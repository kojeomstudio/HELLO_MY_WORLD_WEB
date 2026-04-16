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
    private readonly HashSet<string> _bannedNames = new();
    private readonly HashSet<string> _bannedIps = new();

    public AuthResult AuthenticatePlayer(string name, string connectionId, int onlineCount, int maxPlayers)
    {
        if (string.IsNullOrWhiteSpace(name) || name.Length < 1 || name.Length > 20)
            return AuthResult.NameInvalid;

        foreach (var c in name)
        {
            if (!char.IsLetterOrDigit(c) && c != '_' && c != '-')
                return AuthResult.NameInvalid;
        }

        if (_bannedNames.Contains(name.ToLowerInvariant()))
            return AuthResult.Banned;

        if (onlineCount >= maxPlayers)
            return AuthResult.ServerFull;

        return AuthResult.Success;
    }

    public void BanName(string name) => _bannedNames.Add(name.ToLowerInvariant());
    public void BanIp(string ip) => _bannedIps.Add(ip);
    public void UnbanName(string name) => _bannedNames.Remove(name.ToLowerInvariant());
    public void UnbanIp(string ip) => _bannedIps.Remove(ip);
    public bool IsBanned(string name) => _bannedNames.Contains(name.ToLowerInvariant());
}
