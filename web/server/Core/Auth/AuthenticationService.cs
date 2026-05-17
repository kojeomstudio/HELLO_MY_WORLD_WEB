using System.Collections.Concurrent;
using System.Security.Cryptography;
using System.Text.RegularExpressions;
using WebGameServer.Core.Player;
using Microsoft.Extensions.Logging;

namespace WebGameServer.Core.Auth;

public enum AuthResult
{
    Success,
    NameTaken,
    NameInvalid,
    Banned,
    ServerFull,
    PasswordRequired,
    PasswordIncorrect,
    AccountLocked
}

public class AuthenticationService
{
    private readonly int _pbkdf2Iterations;
    private const int SaltSize = 16;
    private const int HashSize = 32;

    private static readonly Regex NameRegex = new("^[a-zA-Z0-9_-]{1,20}$", RegexOptions.Compiled);
    private static readonly HashSet<string> ReservedNames = new(StringComparer.OrdinalIgnoreCase)
    {
        "server", "admin", "system", "console", "root", "moderator",
        "administrator", "owner", "staff", "operator"
    };

    private readonly HashSet<string> _bannedNames = new(StringComparer.OrdinalIgnoreCase);
    private readonly HashSet<string> _bannedIps = new(StringComparer.OrdinalIgnoreCase);
    private BanDatabase? _banDatabase;

    private readonly ConcurrentDictionary<string, LockoutEntry> _lockouts = new(StringComparer.OrdinalIgnoreCase);
    private readonly int _maxLockoutAttempts;
    private readonly TimeSpan _lockoutDuration;

    private readonly ConcurrentDictionary<string, ConnectionRateEntry> _connectionRates = new(StringComparer.OrdinalIgnoreCase);
    private readonly int _maxConnectionsPerMinute;
    private readonly TimeSpan _rateWindow = TimeSpan.FromMinutes(1);

    public AuthenticationService(int maxLockoutAttempts = 5, int lockoutMinutes = 5, int maxConnectionsPerMinute = 10, int pbkdf2Iterations = 100000)
    {
        _maxLockoutAttempts = maxLockoutAttempts;
        _lockoutDuration = TimeSpan.FromMinutes(lockoutMinutes);
        _maxConnectionsPerMinute = maxConnectionsPerMinute;
        _pbkdf2Iterations = pbkdf2Iterations;
    }

    public string HashPassword(string password)
    {
        var salt = RandomNumberGenerator.GetBytes(SaltSize);
        var hash = Rfc2898DeriveBytes.Pbkdf2(password, salt, _pbkdf2Iterations, HashAlgorithmName.SHA256, HashSize);
        return $"{_pbkdf2Iterations}:{Convert.ToHexString(salt)}:{Convert.ToHexString(hash)}";
    }

    public static bool VerifyPassword(string password, string storedHash)
    {
        if (!storedHash.Contains(':'))
        {
            return false;
        }

        var parts = storedHash.Split(':');
        if (parts.Length != 3) return false;
        if (!int.TryParse(parts[0], out var iterations)) return false;
        var salt = Convert.FromHexString(parts[1]);
        var storedHashBytes = Convert.FromHexString(parts[2]);
        var computedHash = Rfc2898DeriveBytes.Pbkdf2(password, salt, iterations, HashAlgorithmName.SHA256, storedHashBytes.Length);
        return CryptographicOperations.FixedTimeEquals(computedHash, storedHashBytes);
    }

    public AuthResult AuthenticateWithPassword(string name, string? password, string connectionId, int onlineCount, int maxPlayers, string? ipAddress, PlayerDatabase playerDb)
    {
        if (password?.Length > 128) return AuthResult.PasswordIncorrect;

        var baseResult = AuthenticatePlayer(name, connectionId, onlineCount, maxPlayers, ipAddress);
        if (baseResult != AuthResult.Success) return baseResult;

        if (IsAccountLocked(name))
            return AuthResult.AccountLocked;

        if (playerDb.PlayerExists(name))
        {
            var existingHash = playerDb.GetPasswordHash(name);
            if (existingHash != null)
            {
                if (string.IsNullOrEmpty(password)) return AuthResult.PasswordRequired;
                if (!VerifyPassword(password, existingHash))
                {
                    RecordFailedAttempt(name);
                    return AuthResult.PasswordIncorrect;
                }
            }
        }

        ClearLockout(name);
        return AuthResult.Success;
    }

    public bool IsAccountLocked(string name)
    {
        if (_lockouts.TryGetValue(name, out var entry))
        {
            if (entry.Attempts >= _maxLockoutAttempts && DateTimeOffset.UtcNow - entry.LockoutStart < _lockoutDuration)
                return true;
            if (DateTimeOffset.UtcNow - entry.LockoutStart >= _lockoutDuration)
                _lockouts.TryRemove(name, out _);
        }
        return false;
    }

    private void RecordFailedAttempt(string name)
    {
        _lockouts.AddOrUpdate(name,
            _ => new LockoutEntry { Attempts = 1, LockoutStart = DateTimeOffset.UtcNow },
            (_, existing) => new LockoutEntry
            {
                Attempts = existing.Attempts + 1,
                LockoutStart = existing.Attempts + 1 >= _maxLockoutAttempts
                    ? DateTimeOffset.UtcNow
                    : existing.LockoutStart
            });
    }

    private void ClearLockout(string name)
    {
        _lockouts.TryRemove(name, out _);
    }

    public void CleanupStaleEntries()
    {
        var cutoff = DateTimeOffset.UtcNow - _rateWindow;
        foreach (var kvp in _connectionRates)
        {
            if (kvp.Value.WindowStart < cutoff)
                _connectionRates.TryRemove(kvp.Key, out _);
        }

        var lockoutCutoff = DateTimeOffset.UtcNow - _lockoutDuration;
        foreach (var kvp in _lockouts)
        {
            if (kvp.Value.LockoutStart < lockoutCutoff)
                _lockouts.TryRemove(kvp.Key, out _);
        }
    }

    public bool IsConnectionRateLimited(string ipAddress)
    {
        if (string.IsNullOrEmpty(ipAddress)) return false;

        var now = DateTimeOffset.UtcNow;
        _connectionRates.AddOrUpdate(ipAddress,
            _ => new ConnectionRateEntry { Count = 1, WindowStart = now },
            (_, existing) =>
            {
                if (now - existing.WindowStart > _rateWindow)
                    return new ConnectionRateEntry { Count = 1, WindowStart = now };
                return new ConnectionRateEntry { Count = existing.Count + 1, WindowStart = existing.WindowStart };
            });

        return _connectionRates.TryGetValue(ipAddress, out var entry) && entry.Count > _maxConnectionsPerMinute;
    }

    public void SetBanDatabase(BanDatabase banDatabase)
    {
        _banDatabase = banDatabase;
    }

    public AuthResult AuthenticatePlayer(string name, string connectionId, int onlineCount, int maxPlayers, string? ipAddress = null)
    {
        if (string.IsNullOrWhiteSpace(name) || !NameRegex.IsMatch(name))
            return AuthResult.NameInvalid;

        if (ReservedNames.Contains(name))
            return AuthResult.NameInvalid;

        if (ipAddress != null && (_bannedIps.Contains(ipAddress) || (_banDatabase?.IsIpBanned(ipAddress) ?? false)))
            return AuthResult.Banned;

        if (_bannedNames.Contains(name) || (_banDatabase?.IsNameBanned(name) ?? false))
            return AuthResult.Banned;

        if (onlineCount >= maxPlayers)
            return AuthResult.ServerFull;

        return AuthResult.Success;
    }

    public async Task BanNameAsync(string name)
    {
        _bannedNames.Add(name);
        if (_banDatabase != null) await _banDatabase.BanNameAsync(name);
    }

    public async Task BanIpAsync(string ip)
    {
        _bannedIps.Add(ip);
        if (_banDatabase != null) await _banDatabase.BanIpAsync(ip);
    }

    public async Task UnbanNameAsync(string name)
    {
        _bannedNames.Remove(name);
        if (_banDatabase != null) await _banDatabase.UnbanNameAsync(name);
    }

    public async Task UnbanIpAsync(string ip)
    {
        _bannedIps.Remove(ip);
        if (_banDatabase != null) await _banDatabase.UnbanIpAsync(ip);
    }

    public void BanName(string name)
    {
        _bannedNames.Add(name);
        if (_banDatabase != null)
        {
            Task.Run(async () =>
            {
                try { await _banDatabase.BanNameAsync(name); }
                catch (Exception ex) { Console.Error.WriteLine($"[Auth] Failed to persist ban for name '{name}': {ex.Message}"); }
            });
        }
    }

    public void BanIp(string ip)
    {
        _bannedIps.Add(ip);
        if (_banDatabase != null)
        {
            Task.Run(async () =>
            {
                try { await _banDatabase.BanIpAsync(ip); }
                catch (Exception ex) { Console.Error.WriteLine($"[Auth] Failed to persist ban for IP '{ip}': {ex.Message}"); }
            });
        }
    }

    public void UnbanName(string name)
    {
        _bannedNames.Remove(name);
        if (_banDatabase != null)
        {
            Task.Run(async () =>
            {
                try { await _banDatabase.UnbanNameAsync(name); }
                catch (Exception ex) { Console.Error.WriteLine($"[Auth] Failed to persist unban for name '{name}': {ex.Message}"); }
            });
        }
    }

    public void UnbanIp(string ip)
    {
        _bannedIps.Remove(ip);
        if (_banDatabase != null)
        {
            Task.Run(async () =>
            {
                try { await _banDatabase.UnbanIpAsync(ip); }
                catch (Exception ex) { Console.Error.WriteLine($"[Auth] Failed to persist unban for IP '{ip}': {ex.Message}"); }
            });
        }
    }

    public bool IsBanned(string name) => _bannedNames.Contains(name) || (_banDatabase?.IsNameBanned(name) ?? false);
    public bool IsIpBanned(string ip) => _bannedIps.Contains(ip) || (_banDatabase?.IsIpBanned(ip) ?? false);

    public void ReloadAuth()
    {
        _banDatabase?.Load();
    }

    private class LockoutEntry
    {
        public int Attempts { get; set; }
        public DateTimeOffset LockoutStart { get; set; }
    }

    private class ConnectionRateEntry
    {
        public int Count { get; set; }
        public DateTimeOffset WindowStart { get; set; }
    }
}
