using System.Security.Cryptography;
using System.Text.RegularExpressions;
using WebGameServer.Core.Player;

namespace WebGameServer.Core.Auth;

public enum AuthResult
{
    Success,
    NameTaken,
    NameInvalid,
    Banned,
    ServerFull,
    PasswordRequired,
    PasswordIncorrect
}

public class AuthenticationService
{
    private const int Pbkdf2Iterations = 100000;
    private const int SaltSize = 16;
    private const int HashSize = 32;

    private static readonly Regex NameRegex = new("^[a-zA-Z0-9_-]{1,20}$", RegexOptions.Compiled);
    private static readonly HashSet<string> ReservedNames = new(StringComparer.OrdinalIgnoreCase)
    {
        "server", "admin", "system", "console", "root", "moderator"
    };

    private readonly HashSet<string> _bannedNames = new(StringComparer.OrdinalIgnoreCase);
    private readonly HashSet<string> _bannedIps = new(StringComparer.OrdinalIgnoreCase);
    private BanDatabase? _banDatabase;

    public static string HashPassword(string password)
    {
        var salt = RandomNumberGenerator.GetBytes(SaltSize);
        using var pbkdf2 = new Rfc2898DeriveBytes(password, salt, Pbkdf2Iterations, HashAlgorithmName.SHA256);
        var hash = pbkdf2.GetBytes(HashSize);
        return $"{Pbkdf2Iterations}:{Convert.ToHexString(salt)}:{Convert.ToHexString(hash)}";
    }

    public static bool VerifyPassword(string password, string storedHash)
    {
        var legacyPrefix = "HelloMyWorld_2024_Salt";
        if (!storedHash.Contains(':'))
        {
            var bytes = System.Text.Encoding.UTF8.GetBytes(password + legacyPrefix);
            using var sha = SHA256.Create();
            var hash = sha.ComputeHash(bytes);
            var hex = Convert.ToHexString(hash);
            return CryptographicOperations.FixedTimeEquals(
                System.Text.Encoding.UTF8.GetBytes(hex),
                System.Text.Encoding.UTF8.GetBytes(storedHash));
        }

        var parts = storedHash.Split(':');
        if (parts.Length != 3) return false;
        if (!int.TryParse(parts[0], out var iterations)) return false;
        var salt = Convert.FromHexString(parts[1]);
        var storedHashBytes = Convert.FromHexString(parts[2]);
        using var pbkdf2 = new Rfc2898DeriveBytes(password, salt, iterations, HashAlgorithmName.SHA256);
        var computedHash = pbkdf2.GetBytes(storedHashBytes.Length);
        return CryptographicOperations.FixedTimeEquals(computedHash, storedHashBytes);
    }

    public AuthResult AuthenticateWithPassword(string name, string? password, string connectionId, int onlineCount, int maxPlayers, string? ipAddress, PlayerDatabase playerDb)
    {
        var baseResult = AuthenticatePlayer(name, connectionId, onlineCount, maxPlayers, ipAddress);
        if (baseResult != AuthResult.Success) return baseResult;

        if (playerDb.PlayerExists(name))
        {
            var existingHash = playerDb.GetPasswordHash(name);
            if (existingHash != null)
            {
                if (string.IsNullOrEmpty(password)) return AuthResult.PasswordRequired;
                if (!VerifyPassword(password, existingHash)) return AuthResult.PasswordIncorrect;
            }
        }

        return AuthResult.Success;
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

    public void BanName(string name)
    {
        _bannedNames.Add(name);
        _banDatabase?.BanName(name);
    }

    public void BanIp(string ip)
    {
        _bannedIps.Add(ip);
        _banDatabase?.BanIp(ip);
    }

    public void UnbanName(string name)
    {
        _bannedNames.Remove(name);
        _banDatabase?.UnbanName(name);
    }

    public void UnbanIp(string ip)
    {
        _bannedIps.Remove(ip);
        _banDatabase?.UnbanIp(ip);
    }

    public bool IsBanned(string name) => _bannedNames.Contains(name) || (_banDatabase?.IsNameBanned(name) ?? false);
    public bool IsIpBanned(string ip) => _bannedIps.Contains(ip) || (_banDatabase?.IsIpBanned(ip) ?? false);
}
