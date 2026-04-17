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

    public AuthResult AuthenticatePlayer(string name, string connectionId, int onlineCount, int maxPlayers, string? ipAddress = null)
    {
        if (string.IsNullOrWhiteSpace(name) || !NameRegex.IsMatch(name))
            return AuthResult.NameInvalid;

        if (ReservedNames.Contains(name))
            return AuthResult.NameInvalid;

        if (ipAddress != null && _bannedIps.Contains(ipAddress))
            return AuthResult.Banned;

        if (_bannedNames.Contains(name))
            return AuthResult.Banned;

        if (onlineCount >= maxPlayers)
            return AuthResult.ServerFull;

        return AuthResult.Success;
    }

    public void BanName(string name) => _bannedNames.Add(name);
    public void BanIp(string ip) => _bannedIps.Add(ip);
    public void UnbanName(string name) => _bannedNames.Remove(name);
    public void UnbanIp(string ip) => _bannedIps.Remove(ip);
    public bool IsBanned(string name) => _bannedNames.Contains(name);
    public bool IsIpBanned(string ip) => _bannedIps.Contains(ip);
}
