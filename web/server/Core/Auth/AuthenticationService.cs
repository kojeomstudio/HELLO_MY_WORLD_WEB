using System.Text.RegularExpressions;

namespace WebGameServer.Core.Auth;

public enum AuthResult
{
    Success,
    NameTaken,
    NameInvalid,
    Banned,
    ServerFull
}

public class AuthenticationService
{
    private static readonly Regex NameRegex = new("^[a-zA-Z0-9_-]{1,20}$", RegexOptions.Compiled);
    private static readonly HashSet<string> ReservedNames = new(StringComparer.OrdinalIgnoreCase)
    {
        "server", "admin", "system", "console", "root", "moderator"
    };

    private readonly HashSet<string> _bannedNames = new(StringComparer.OrdinalIgnoreCase);
    private readonly HashSet<string> _bannedIps = new(StringComparer.OrdinalIgnoreCase);
    private BanDatabase? _banDatabase;

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
