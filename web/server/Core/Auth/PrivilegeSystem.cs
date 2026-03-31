namespace WebGameServer.Core.Auth;

public record Privilege(string Name, string Description, bool Default);

public class PrivilegeSystem
{
    private readonly Dictionary<string, Privilege> _privileges = new();
    private readonly Dictionary<string, HashSet<string>> _playerPrivileges = new();

    public PrivilegeSystem()
    {
        RegisterBuiltIn("interact", "Can interact with world", true);
        RegisterBuiltIn("shout", "Can chat", true);
        RegisterBuiltIn("basic_privs", "Can grant interact and shout", false);
        RegisterBuiltIn("privs", "Can grant any privilege", false);
        RegisterBuiltIn("teleport", "Can use teleport", false);
        RegisterBuiltIn("bring", "Can teleport other players", false);
        RegisterBuiltIn("settime", "Can change time", false);
        RegisterBuiltIn("server", "Server admin, can do anything", false);
        RegisterBuiltIn("protection_bypass", "Bypass area protection", false);
        RegisterBuiltIn("ban", "Can ban/unban players", false);
        RegisterBuiltIn("kick", "Can kick players", false);
        RegisterBuiltIn("give", "Can give items", false);
        RegisterBuiltIn("password", "Can change own password", false);
        RegisterBuiltIn("fly", "Can fly", false);
        RegisterBuiltIn("fast", "Can move fast", false);
    }

    public bool HasPrivilege(string playerName, string privilege)
    {
        if (privilege == "server")
            return _playerPrivileges.TryGetValue(playerName, out var privs) && privs.Contains("server");

        return _playerPrivileges.TryGetValue(playerName, out var playerPrivs)
            && (playerPrivs.Contains("server") || playerPrivs.Contains(privilege));
    }

    public void GrantPrivilege(string playerName, string privilege)
    {
        if (!_privileges.ContainsKey(privilege))
            return;

        if (!_playerPrivileges.ContainsKey(playerName))
            _playerPrivileges[playerName] = new HashSet<string>();

        _playerPrivileges[playerName].Add(privilege);
    }

    public void RevokePrivilege(string playerName, string privilege)
    {
        if (!_playerPrivileges.TryGetValue(playerName, out var privs))
            return;

        privs.Remove(privilege);

        if (privs.Count == 0)
            _playerPrivileges.Remove(playerName);
    }

    public string[] GetPlayerPrivileges(string playerName)
    {
        if (!_playerPrivileges.TryGetValue(playerName, out var privs))
            return Array.Empty<string>();

        return privs.ToArray();
    }

    public Privilege? GetPrivilege(string name)
    {
        return _privileges.TryGetValue(name, out var privilege) ? privilege : null;
    }

    public IReadOnlyDictionary<string, Privilege> GetAllPrivileges() => _privileges;

    public void GrantDefaultPrivileges(string playerName)
    {
        foreach (var kvp in _privileges)
        {
            if (kvp.Value.Default)
                GrantPrivilege(playerName, kvp.Key);
        }
    }

    public void RemovePlayer(string playerName)
    {
        _playerPrivileges.Remove(playerName);
    }

    private void RegisterBuiltIn(string name, string description, bool defaultPriv)
    {
        var privilege = new Privilege(name, description, defaultPriv);
        _privileges[name] = privilege;
    }
}
