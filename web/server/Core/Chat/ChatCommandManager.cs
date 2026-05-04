using WebGameServer.Core.Entities;
using WebGameServer.Core.Player;
using WebGameServer.Core.Protection;
using WebGameServer.Core.World;

namespace WebGameServer.Core.Chat;

public class ChatCommand
{
    public string Name { get; }
    public string Description { get; }
    public string[] Aliases { get; }
    public string RequiredPrivilege { get; }
    public Func<string, string[], Task<string>> Handler { get; }

    public ChatCommand(string name, string description, string[] aliases, Func<string, string[], Task<string>> handler, string requiredPrivilege = "")
    {
        Name = name;
        Description = description;
        Aliases = aliases;
        Handler = handler;
        RequiredPrivilege = requiredPrivilege;
    }
}

public class ChatCommandManager
{
    private readonly Dictionary<string, ChatCommand> _commands = new();
    private readonly Func<long> _getGameTime;
    private readonly Func<int> _getTps;
    private readonly Action<string, GameMode>? _setGameMode;
    private readonly Action<string, Vector3>? _teleport;
    private readonly Action<string, string, string, int>? _giveItem;
    private readonly Action<string>? _killPlayer;
    private readonly Action<string>? _clearInventory;
    private readonly Func<string[]?>? _getOnlinePlayers;
    private readonly Action<string>? _kickPlayer;
    private readonly Action<string>? _banPlayer;
    private readonly Action<string>? _unbanPlayer;
    private readonly Func<string, string[]?>? _getPlayerPrivileges;
    private readonly Action<string, string>? _grantPrivilege;
    private readonly Action<string, string>? _revokePrivilege;
    private readonly Action<long>? _setTimeOfDay;
    private readonly Action? _stopServer;
    private readonly Action<string, Vector3>? _spawnEntity;
    private readonly Action? _clearAllEntities;
    private readonly Action<int>? _setWorldBorder;
    private readonly Func<string, bool>? _hasPrivilege;
    private readonly Func<string, string, string, bool>? _sendPrivateMessage;
    private readonly AreaProtectionSystem? _areaProtection;
    private readonly Func<string, string, bool>? _setPassword;
    private readonly Func<string, bool>? _isValidItemId;
    private readonly Func<string, bool>? _isValidEntityType;
    private readonly Action<string, float>? _setPlayerHp;
    private readonly Action<string, int>? _setHotbarSize;
    private readonly Action<string, float?, float?, float?, float?, float?>? _setPhysicsOverride;
    private readonly Action<string>? _clearPhysicsOverride;
    private readonly Action<string>? _sendPhysicsParams;
    private readonly Func<string, string, string?>? _togglePlayerFlag;
    private readonly Action<string, float, float, float, string, string>? _addWaypoint;
    private readonly Action? _killAllMobs;
    private readonly Func<string, PlayerStatistics?>? _getPlayerStatistics;
    private readonly Func<string>? _getWorldDataPath;
    private readonly Func<string, int, int>? _rollbackPlayer;
    private readonly Func<int, int, int, int, int, int, int, int>? _rollbackArea;
    private readonly Func<int>? _getWorldSeed;
    private readonly Func<string>? _getWorldName;
    private readonly Func<int>? _getLoadedChunkCount;
    private readonly Func<int>? _getEntityCount;
    private readonly Action<string>? _setMapGen;
    private readonly Func<string, bool>? _clearPassword;
    private readonly Func<string, bool>? _removePlayer;
    private readonly Action? _reloadAuth;
    private readonly Func<string, string?>? _getLastLogin;
    private readonly Func<int, int, int, int, string?>? _rollbackCheck;
    private readonly Func<int, int, int, int, int, int, int>? _emergeBlocks;
    private readonly Func<int, int, int, int, int, int, int>? _deleteBlocks;
    private readonly Func<int, int, int, int, int, int, int>? _fixLight;
    private readonly Func<string, Vector3>? _getPlayerPosition;
    private readonly Func<string, string, bool>? _teleportPlayerToPlayer;
    private readonly Action<string, string, int, int>? _useToolOnPlayer;
    private readonly Func<string, int, int>? _detachNearby;
    private readonly Action<string>? _setWeatherClear;
    private readonly Action<string>? _setWeatherRain;
    private readonly Action<string>? _setWeatherSnow;
    private readonly Action<string>? _setWeatherThunder;

    public ChatCommandManager(
        Func<long> getGameTime,
        Func<int> getTps,
        Action<string, GameMode>? setGameMode = null,
        Action<string, Vector3>? teleport = null,
        Action<string, string, string, int>? giveItem = null,
        Action<string>? killPlayer = null,
        Action<string>? clearInventory = null,
        Func<string[]?>? getOnlinePlayers = null,
        Action<string>? kickPlayer = null,
        Action<string>? banPlayer = null,
        Action<string>? unbanPlayer = null,
        Func<string, string[]?>? getPlayerPrivileges = null,
        Action<string, string>? grantPrivilege = null,
        Action<string, string>? revokePrivilege = null,
        Action<long>? setTimeOfDay = null,
        Action? stopServer = null,
        Action<string, Vector3>? spawnEntity = null,
        Action? clearAllEntities = null,
        Action<int>? setWorldBorder = null,
        Func<string, bool>? hasPrivilege = null,
        Func<string, string, string, bool>? sendPrivateMessage = null,
        AreaProtectionSystem? areaProtection = null,
        Func<string, string, bool>? setPassword = null,
        Func<string, bool>? isValidItemId = null,
        Func<string, bool>? isValidEntityType = null,
        Action<string, float>? setPlayerHp = null,
        Action<string, int>? setHotbarSize = null,
        Action<string, float?, float?, float?, float?, float?>? setPhysicsOverride = null,
        Action<string>? clearPhysicsOverride = null,
        Action<string>? sendPhysicsParams = null,
        Func<string, string, string?>? togglePlayerFlag = null,
        Action<string, float, float, float, string, string>? addWaypoint = null,
        Action? killAllMobs = null,
        Func<string, PlayerStatistics?>? getPlayerStatistics = null,
        Func<string>? getWorldDataPath = null,
        Func<string, int, int>? rollbackPlayer = null,
        Func<int, int, int, int, int, int, int, int>? rollbackArea = null,
        Func<int>? getWorldSeed = null,
        Func<string>? getWorldName = null,
        Func<int>? getLoadedChunkCount = null,
        Func<int>? getEntityCount = null,
        Action<string>? setMapGen = null,
        Func<string, bool>? clearPassword = null,
        Func<string, bool>? removePlayer = null,
        Action? reloadAuth = null,
        Func<string, string?>? getLastLogin = null,
        Func<int, int, int, int, string?>? rollbackCheck = null,
        Func<int, int, int, int, int, int, int>? emergeBlocks = null,
        Func<int, int, int, int, int, int, int>? deleteBlocks = null,
        Func<int, int, int, int, int, int, int>? fixLight = null,
        Func<string, Vector3>? getPlayerPosition = null,
        Func<string, string, bool>? teleportPlayerToPlayer = null,
        Action<string, string, int, int>? useToolOnPlayer = null,
        Func<string, int, int>? detachNearby = null,
        Action<string>? setWeatherClear = null,
        Action<string>? setWeatherRain = null,
        Action<string>? setWeatherSnow = null,
        Action<string>? setWeatherThunder = null)
    {
        _getGameTime = getGameTime;
        _getTps = getTps;
        _setGameMode = setGameMode;
        _teleport = teleport;
        _giveItem = giveItem;
        _killPlayer = killPlayer;
        _clearInventory = clearInventory;
        _getOnlinePlayers = getOnlinePlayers;
        _kickPlayer = kickPlayer;
        _banPlayer = banPlayer;
        _unbanPlayer = unbanPlayer;
        _getPlayerPrivileges = getPlayerPrivileges;
        _grantPrivilege = grantPrivilege;
        _revokePrivilege = revokePrivilege;
        _setTimeOfDay = setTimeOfDay;
        _stopServer = stopServer;
        _spawnEntity = spawnEntity;
        _clearAllEntities = clearAllEntities;
        _setWorldBorder = setWorldBorder;
        _hasPrivilege = hasPrivilege;
        _sendPrivateMessage = sendPrivateMessage;
        _areaProtection = areaProtection;
        _setPassword = setPassword;
        _isValidItemId = isValidItemId;
        _isValidEntityType = isValidEntityType;
        _setPlayerHp = setPlayerHp;
        _setHotbarSize = setHotbarSize;
        _setPhysicsOverride = setPhysicsOverride;
        _clearPhysicsOverride = clearPhysicsOverride;
        _sendPhysicsParams = sendPhysicsParams;
        _togglePlayerFlag = togglePlayerFlag;
        _addWaypoint = addWaypoint;
        _killAllMobs = killAllMobs;
        _getPlayerStatistics = getPlayerStatistics;
        _getWorldDataPath = getWorldDataPath;
        _rollbackPlayer = rollbackPlayer;
        _rollbackArea = rollbackArea;
        _getWorldSeed = getWorldSeed;
        _getWorldName = getWorldName;
        _getLoadedChunkCount = getLoadedChunkCount;
        _getEntityCount = getEntityCount;
        _setMapGen = setMapGen;
        _clearPassword = clearPassword;
        _removePlayer = removePlayer;
        _reloadAuth = reloadAuth;
        _getLastLogin = getLastLogin;
        _rollbackCheck = rollbackCheck;
        _emergeBlocks = emergeBlocks;
        _deleteBlocks = deleteBlocks;
        _fixLight = fixLight;
        _getPlayerPosition = getPlayerPosition;
        _teleportPlayerToPlayer = teleportPlayerToPlayer;
        _useToolOnPlayer = useToolOnPlayer;
        _detachNearby = detachNearby;
        _setWeatherClear = setWeatherClear;
        _setWeatherRain = setWeatherRain;
        _setWeatherSnow = setWeatherSnow;
        _setWeatherThunder = setWeatherThunder;
        RegisterBuiltInCommands();
    }

    private void RegisterBuiltInCommands()
    {
        Register(new ChatCommand("help", "Show available commands", new[] { "?" },
            (_, _) => Task.FromResult(string.Join(", ", _commands.Keys.OrderBy(k => k)))));

        Register(new ChatCommand("time", "Show current game time", Array.Empty<string>(),
            (_, _) =>
            {
                var gameTime = _getGameTime();
                var totalSeconds = gameTime / 1000 % 24000;
                var phase = totalSeconds switch
                {
                    < 6000 => "Day",
                    < 12000 => "Noon",
                    < 13000 => "Sunset",
                    < 18000 => "Night",
                    _ => "Midnight"
                };
                return Task.FromResult($"Game time: {gameTime} ({phase})");
            }));

        Register(new ChatCommand("tps", "Show server ticks per second", Array.Empty<string>(),
            (_, _) => Task.FromResult($"Server TPS: {_getTps()}")));

        Register(new ChatCommand("status", "Show server status", Array.Empty<string>(),
            (_, _) =>
            {
                var players = _getOnlinePlayers?.Invoke();
                var playerList = players != null && players.Length > 0
                    ? string.Join(", ", players)
                    : "None";
                var uptimeMs = _getGameTime();
                var uptime = TimeSpan.FromMilliseconds(uptimeMs);
                var uptimeStr = $"{uptime.Hours}h {uptime.Minutes}m {uptime.Seconds}s";
                return Task.FromResult($"TPS: {_getTps()} | Players online: {playerList} | Uptime: {uptimeStr}");
            }));

        Register(new ChatCommand("gamemode", "Set game mode (survival|creative|adventure|spectator)", new[] { "gm" },
            (playerName, args) =>
            {
                if (_setGameMode == null) return Task.FromResult("Game mode command is not available.");
                if (args.Length == 0) return Task.FromResult("Usage: /gamemode <survival|creative|adventure|spectator>");

                var modeStr = args[0].ToLowerInvariant();
                var mode = modeStr switch
                {
                    "survival" or "s" => GameMode.Survival,
                    "creative" or "c" => GameMode.Creative,
                    "adventure" or "a" => GameMode.Adventure,
                    "spectator" or "sp" => GameMode.Spectator,
                    _ => GameMode.Survival
                };

                _setGameMode(playerName, mode);
                return Task.FromResult($"Game mode set to {mode} for {playerName}");
            }, "server"));

        Register(new ChatCommand("tp", "Teleport to coordinates", new[] { "teleport" },
            (playerName, args) =>
            {
                if (_teleport == null) return Task.FromResult("Teleport command is not available.");
                if (args.Length < 3) return Task.FromResult("Usage: /tp <x> <y> <z>");

                if (!float.TryParse(args[0], out var x) ||
                    !float.TryParse(args[1], out var y) ||
                    !float.TryParse(args[2], out var z))
                {
                    return Task.FromResult("Invalid coordinates. Usage: /tp <x> <y> <z>");
                }

                x = Math.Clamp(x, -5000f, 5000f);
                y = Math.Clamp(y, -64f, 320f);
                z = Math.Clamp(z, -5000f, 5000f);

                _teleport(playerName, new Vector3(x, y, z));
                return Task.FromResult($"Teleported {playerName} to ({x}, {y}, {z})");
            }, "teleport"));

        Register(new ChatCommand("give", "Give item to player", Array.Empty<string>(),
            (playerName, args) =>
            {
                if (_giveItem == null) return Task.FromResult("Give command is not available.");
                if (args.Length < 2) return Task.FromResult("Usage: /give <player> <item> [count]");

                var targetPlayer = args[0];
                var itemId = args[1].ToLowerInvariant();
                var count = 1;
                if (args.Length >= 3 && !int.TryParse(args[2], out count))
                {
                    return Task.FromResult("Invalid count. Usage: /give <player> <item> [count]");
                }

                if (_isValidItemId != null && !_isValidItemId(itemId))
                {
                    return Task.FromResult($"Unknown item: {itemId}");
                }

                count = Math.Clamp(count, 1, 64);
                _giveItem(playerName, targetPlayer, itemId, count);
                return Task.FromResult($"Gave {count}x {itemId} to {targetPlayer}");
            }, "give"));

        Register(new ChatCommand("kill", "Kill a player", Array.Empty<string>(),
            (playerName, args) =>
            {
                if (_killPlayer == null) return Task.FromResult("Kill command is not available.");
                var target = args.Length > 0 ? args[0] : playerName;
                _killPlayer(target);
                return Task.FromResult($"Killed {target}");
            }, "server"));

        Register(new ChatCommand("clear", "Clear your inventory", new[] { "clearinventory", "clearinv" },
            (playerName, _) =>
            {
                if (_clearInventory == null) return Task.FromResult("Clear command is not available.");
                _clearInventory(playerName);
                return Task.FromResult($"Cleared inventory for {playerName}");
            }, "give"));

        Register(new ChatCommand("list", "List online players", new[] { "online", "players" },
            (_, _) =>
            {
                if (_getOnlinePlayers == null) return Task.FromResult("List command is not available.");
                var players = _getOnlinePlayers();
                if (players == null || players.Length == 0) return Task.FromResult("No players online.");
                return Task.FromResult($"Online players ({players.Length}): {string.Join(", ", players)}");
            }));

        Register(new ChatCommand("kick", "Kick a player from the server", Array.Empty<string>(),
            (playerName, args) =>
            {
                if (_kickPlayer == null) return Task.FromResult("Kick command is not available.");
                if (args.Length == 0) return Task.FromResult("Usage: /kick <player>");
                _kickPlayer(args[0]);
                return Task.FromResult($"Kicked {args[0]}");
            }, "kick"));

        Register(new ChatCommand("ban", "Ban a player from the server", Array.Empty<string>(),
            (_, args) =>
            {
                if (_banPlayer == null) return Task.FromResult("Ban command is not available.");
                if (args.Length == 0) return Task.FromResult("Usage: /ban <player>");
                _banPlayer(args[0]);
                return Task.FromResult($"Banned {args[0]}");
            }, "ban"));

        Register(new ChatCommand("unban", "Unban a player", Array.Empty<string>(),
            (_, args) =>
            {
                if (_unbanPlayer == null) return Task.FromResult("Unban command is not available.");
                if (args.Length == 0) return Task.FromResult("Usage: /unban <player>");
                _unbanPlayer(args[0]);
                return Task.FromResult($"Unbanned {args[0]}");
            }, "ban"));

        Register(new ChatCommand("privileges", "List a player's privileges", new[] { "privs" },
            (playerName, args) =>
            {
                if (_getPlayerPrivileges == null) return Task.FromResult("Privilege command is not available.");
                var target = args.Length > 0 ? args[0] : playerName;
                var privs = _getPlayerPrivileges(target);
                if (privs == null || privs.Length == 0) return Task.FromResult($"{target} has no privileges.");
                return Task.FromResult($"{target} privileges: {string.Join(", ", privs)}");
            }));

        Register(new ChatCommand("grant", "Grant a privilege to a player", Array.Empty<string>(),
            (playerName, args) =>
            {
                if (_grantPrivilege == null) return Task.FromResult("Grant command is not available.");
                if (args.Length < 2) return Task.FromResult("Usage: /grant <player> <privilege>");
                if (string.Equals(args[0], playerName, StringComparison.OrdinalIgnoreCase))
                    return Task.FromResult("You cannot grant privileges to yourself.");
                if (args[1] == "server" && _hasPrivilege != null && !_hasPrivilege(playerName))
                    return Task.FromResult("Only server admins can grant the 'server' privilege.");
                var granterPrivs = _getPlayerPrivileges?.Invoke(playerName);
                var hasBasicPrivs = granterPrivs != null && Array.Exists(granterPrivs, p => p == "basic_privs");
                var hasFullPrivs = granterPrivs != null && Array.Exists(granterPrivs, p => p == "privs");
                var hasServer = granterPrivs != null && Array.Exists(granterPrivs, p => p == "server");
                if (!hasServer)
                {
                    var safePrivs = new HashSet<string>(StringComparer.OrdinalIgnoreCase)
                    {
                        "interact", "shout", "fly", "fast", "teleport", "give",
                        "noclip", "creative", "rollback"
                    };
                    if (hasBasicPrivs)
                    {
                        safePrivs.IntersectWith(new HashSet<string>(StringComparer.OrdinalIgnoreCase) { "interact", "shout" });
                    }
                    if (!safePrivs.Contains(args[1]))
                        return Task.FromResult($"You cannot grant '{args[1]}'. Only server admins can grant dangerous privileges.");
                }
                _grantPrivilege(args[0], args[1]);
                return Task.FromResult($"Granted '{args[1]}' to {args[0]}");
            }, "privs"));

        Register(new ChatCommand("revoke", "Revoke a privilege from a player", Array.Empty<string>(),
            (playerName, args) =>
            {
                if (_revokePrivilege == null) return Task.FromResult("Revoke command is not available.");
                if (args.Length < 2) return Task.FromResult("Usage: /revoke <player> <privilege>");
                if (string.Equals(args[0], playerName, StringComparison.OrdinalIgnoreCase))
                    return Task.FromResult("You cannot revoke privileges from yourself.");
                if (args[1] == "server")
                    return Task.FromResult("The 'server' privilege cannot be revoked via command.");
                _revokePrivilege(args[0], args[1]);
                return Task.FromResult($"Revoked '{args[1]}' from {args[0]}");
            }, "privs"));

        Register(new ChatCommand("settime", "Set time of day", new[] { "timeofday" },
            (_, args) =>
            {
                if (_setTimeOfDay == null) return Task.FromResult("Set time command is not available.");
                if (args.Length == 0 || !long.TryParse(args[0], out var time))
                    return Task.FromResult("Usage: /settime <time>");
                _setTimeOfDay(time);
                return Task.FromResult($"Time set to {time}");
            }, "settime"));

        Register(new ChatCommand("stop", "Stop the server", new[] { "shutdown" },
            (_, _) =>
            {
                if (_stopServer == null) return Task.FromResult("Stop command is not available.");
                _stopServer();
                return Task.FromResult("Server is shutting down...");
            }, "server"));

        Register(new ChatCommand("spawn", "Spawn an entity", new[] { "summon", "spawnentity" },
            (_, args) =>
            {
                if (_spawnEntity == null) return Task.FromResult("Spawn command is not available.");
                if (args.Length < 2) return Task.FromResult("Usage: /spawn <entityType> <x> <y> <z>");
                if (!float.TryParse(args[1], out var x) ||
                    !float.TryParse(args[2], out var y) ||
                    !float.TryParse(args[3], out var z))
                    return Task.FromResult("Invalid coordinates. Usage: /spawn <entityType> <x> <y> <z>");
                if (_isValidEntityType != null && !_isValidEntityType(args[0].ToLowerInvariant()))
                {
                    return Task.FromResult($"Unknown entity type: {args[0]}");
                }
                _spawnEntity(args[0], new Vector3(x, y, z));
                return Task.FromResult($"Spawned {args[0]} at ({x}, {y}, {z})");
            }, "give"));

        Register(new ChatCommand("killall", "Clear all entities", new[] { "clearentities" },
            (_, _) =>
            {
                if (_clearAllEntities == null) return Task.FromResult("Kill all command is not available.");
                _clearAllEntities();
                return Task.FromResult("All entities have been cleared");
            }, "server"));

        Register(new ChatCommand("setborder", "Set the world border size", Array.Empty<string>(),
            (_, args) =>
            {
                if (_setWorldBorder == null) return Task.FromResult("Set border command is not available.");
                if (args.Length == 0 || !int.TryParse(args[0], out var size) || size < 100)
                    return Task.FromResult("Usage: /setborder <size> (minimum 100)");
                _setWorldBorder(size);
                return Task.FromResult($"World border set to {size} ({size * 2}x{size * 2})");
            }, "server"));

        Register(new ChatCommand("me", "Show chat action", Array.Empty<string>(),
            (playerName, args) =>
            {
                if (args.Length == 0) return Task.FromResult($"* {playerName}");
                return Task.FromResult($"* {playerName} {string.Join(' ', args)}");
            }));

        Register(new ChatCommand("admin", "Show server admin name", Array.Empty<string>(),
            (_, _) => Task.FromResult("Server admin: server_owner")));

        Register(new ChatCommand("mods", "List installed mods", Array.Empty<string>(),
            (_, _) => Task.FromResult("Installed mods: basenodes, basetools, bucket, chest, stairs, testnodes")));

        Register(new ChatCommand("days", "Show day count", Array.Empty<string>(),
            (_, _) =>
            {
                var gameTime = _getGameTime();
                var days = gameTime / 24000;
                return Task.FromResult($"Day {days + 1}");
            }));

        Register(new ChatCommand("haspriv", "List players with a privilege", Array.Empty<string>(),
            (playerName, args) =>
            {
                if (_getPlayerPrivileges == null) return Task.FromResult("Privilege command is not available.");
                if (args.Length == 0) return Task.FromResult("Usage: /haspriv <privilege>");
                return Task.FromResult($"Players with '{args[0]}': use /list and check individually");
            }, "basic_privs"));

        Register(new ChatCommand("msg", "Send private message to player", new[] { "tell", "whisper" },
            (playerName, args) =>
            {
                if (args.Length < 2) return Task.FromResult("Usage: /msg <player> <message>");
                var target = args[0];
                var message = string.Join(' ', args[1..]);
                if (_sendPrivateMessage == null || !_sendPrivateMessage(playerName, target, message))
                    return Task.FromResult($"Player '{target}' not found or offline.");
                return Task.FromResult($"[PM] To {target}: {message}");
            }));

        Register(new ChatCommand("giveme", "Give item to yourself", Array.Empty<string>(),
            (playerName, args) =>
            {
                if (_giveItem == null) return Task.FromResult("Give command is not available.");
                if (args.Length == 0) return Task.FromResult("Usage: /giveme <item> [count]");
                var count = 1;
                if (args.Length >= 2 && !int.TryParse(args[1], out count))
                    return Task.FromResult("Invalid count. Usage: /giveme <item> [count]");
                _giveItem(playerName, playerName, args[0], count);
                return Task.FromResult($"Gave {count}x {args[0]} to yourself");
            }, "give"));

        Register(new ChatCommand("protect", "Claim a protected area", Array.Empty<string>(),
            (playerName, args) =>
            {
                if (_areaProtection == null) return Task.FromResult("Area protection is not available.");
                if (args.Length < 6) return Task.FromResult("Usage: /protect <x1> <y1> <z1> <x2> <y2> <z2>");
                if (!int.TryParse(args[0], out var x1) || !int.TryParse(args[1], out var y1) ||
                    !int.TryParse(args[2], out var z1) || !int.TryParse(args[3], out var x2) ||
                    !int.TryParse(args[4], out var y2) || !int.TryParse(args[5], out var z2))
                    return Task.FromResult("Invalid coordinates. Usage: /protect <x1> <y1> <z1> <x2> <y2> <z2>");
                var (success, areaId, error) = _areaProtection.ClaimArea(playerName, x1, y1, z1, x2, y2, z2);
                if (!success) return Task.FromResult(error ?? "Failed to claim area.");
                return Task.FromResult($"Area #{areaId} claimed successfully.");
            }, "protection"));

        Register(new ChatCommand("unprotect", "Remove a protected area", Array.Empty<string>(),
            (playerName, args) =>
            {
                if (_areaProtection == null) return Task.FromResult("Area protection is not available.");
                if (args.Length == 0 || !int.TryParse(args[0], out var id))
                    return Task.FromResult("Usage: /unprotect <id>");
                var (success, error) = _areaProtection.RemoveArea(id, playerName);
                if (!success) return Task.FromResult(error ?? "Failed to remove area.");
                return Task.FromResult($"Area #{id} removed successfully.");
            }, "protection"));

        Register(new ChatCommand("areas", "List your protected areas", Array.Empty<string>(),
            (playerName, _) =>
            {
                if (_areaProtection == null) return Task.FromResult("Area protection is not available.");
                var areas = _areaProtection.GetAreasOwnedBy(playerName);
                if (areas.Count == 0) return Task.FromResult("You have no protected areas.");
                var lines = areas.Select(a =>
                    $"#{a.Id}: ({a.MinX},{a.MinY},{a.MinZ}) to ({a.MaxX},{a.MaxY},{a.MaxZ}) vol={a.Volume}");
                return Task.FromResult($"Your areas ({areas.Count}):\n{string.Join("\n", lines)}");
            }));

        Register(new ChatCommand("area_info", "Show protection info at position", new[] { "areainfo" },
            (_, args) =>
            {
                if (_areaProtection == null) return Task.FromResult("Area protection is not available.");
                if (args.Length < 3 || !int.TryParse(args[0], out var x) ||
                    !int.TryParse(args[1], out var y) || !int.TryParse(args[2], out var z))
                    return Task.FromResult("Usage: /area_info <x> <y> <z>");
                var areas = _areaProtection.GetAreasAt(x, y, z);
                if (areas.Count == 0) return Task.FromResult($"No protection at ({x},{y},{z}).");
                var lines = areas.Select(a =>
                    $"#{a.Id}: owner={a.OwnerName} ({a.MinX},{a.MinY},{a.MinZ}) to ({a.MaxX},{a.MaxY},{a.MaxZ})");
                return Task.FromResult($"Protected areas at ({x},{y},{z}):\n{string.Join("\n", lines)}");
            }));

        Register(new ChatCommand("password", "Set your account password", new[] { "changepassword" },
            (playerName, args) =>
            {
                if (_setPassword == null) return Task.FromResult("Password command is not available.");
                if (args.Length == 0) return Task.FromResult("Usage: /password <new_password>");
                var newPassword = string.Join(' ', args);
                if (newPassword.Length < 8) return Task.FromResult("Password must be at least 8 characters.");
                if (newPassword.Length > 128) return Task.FromResult("Password must be at most 128 characters.");
                var success = _setPassword(playerName, newPassword);
                return Task.FromResult(success ? "Password updated successfully." : "Failed to update password.");
            }, ""));

        Register(new ChatCommand("hp", "Set your health", new[] { "sethp" },
            (playerName, args) =>
            {
                if (_setPlayerHp == null) return Task.FromResult("HP command is not available.");
                if (args.Length == 0 || !float.TryParse(args[0], out var hp))
                    return Task.FromResult("Usage: /hp <health>");
                if (hp < 0 || hp > 100) return Task.FromResult("Health must be between 0 and 100.");
                _setPlayerHp(playerName, hp);
                return Task.FromResult($"Health set to {hp}");
            }, "server"));

        Register(new ChatCommand("hotbar", "Set hotbar size", new[] { "sethotbar" },
            (playerName, args) =>
            {
                if (_setHotbarSize == null) return Task.FromResult("Hotbar command is not available.");
                if (args.Length == 0 || !int.TryParse(args[0], out var size))
                    return Task.FromResult("Usage: /hotbar <size>");
                if (size < 1 || size > 9) return Task.FromResult("Hotbar size must be between 1 and 9.");
                _setHotbarSize(playerName, size);
                return Task.FromResult($"Hotbar size set to {size}");
            }, "server"));

        Register(new ChatCommand("setphysics", "Override player physics parameters", new[] { "physics" },
            (playerName, args) =>
            {
                if (_setPhysicsOverride == null) return Task.FromResult("Physics command is not available.");
                if (args.Length == 0) return Task.FromResult("Usage: /setphysics <player> [gravity] [jump] [walk] [sprint] [fly]");
                if (args.Length < 2) return Task.FromResult("Usage: /setphysics <player> [gravity] [jump] [walk] [sprint] [fly]");
                var target = args[0];
                float? gravity = null, jumpForce = null, walkSpeed = null, sprintSpeed = null, flySpeed = null;
                if (args.Length > 1 && float.TryParse(args[1], out var g)) gravity = Math.Clamp(g, 0.1f, 50f);
                if (args.Length > 2 && float.TryParse(args[2], out var j)) jumpForce = Math.Clamp(j, 0f, 50f);
                if (args.Length > 3 && float.TryParse(args[3], out var w)) walkSpeed = Math.Clamp(w, 0.1f, 50f);
                if (args.Length > 4 && float.TryParse(args[4], out var s)) sprintSpeed = Math.Clamp(s, 0.1f, 50f);
                if (args.Length > 5 && float.TryParse(args[5], out var f)) flySpeed = Math.Clamp(f, 0.1f, 50f);
                _setPhysicsOverride(target, gravity, jumpForce, walkSpeed, sprintSpeed, flySpeed);
                if (_sendPhysicsParams != null) _sendPhysicsParams(target);
                var parts = new List<string>();
                if (gravity.HasValue) parts.Add($"gravity={gravity}");
                if (jumpForce.HasValue) parts.Add($"jump={jumpForce}");
                if (walkSpeed.HasValue) parts.Add($"walk={walkSpeed}");
                if (sprintSpeed.HasValue) parts.Add($"sprint={sprintSpeed}");
                if (flySpeed.HasValue) parts.Add($"fly={flySpeed}");
                return Task.FromResult($"Physics overridden for {target}: {string.Join(", ", parts)}");
            }, "server"));

        Register(new ChatCommand("resetphysics", "Reset player physics to defaults", new[] { "clearphysics" },
            (playerName, args) =>
            {
                if (_clearPhysicsOverride == null) return Task.FromResult("Physics command is not available.");
                var target = args.Length > 0 ? args[0] : playerName;
                _clearPhysicsOverride(target);
                if (_sendPhysicsParams != null)                 _sendPhysicsParams(target);
                return Task.FromResult($"Physics reset to defaults for {target}");
            }, "server"));

        Register(new ChatCommand("toggleflag", "Toggle a player flag", Array.Empty<string>(),
            (playerName, args) =>
            {
                if (_togglePlayerFlag == null) return Task.FromResult("Toggle flag command is not available.");
                if (args.Length < 2) return Task.FromResult("Usage: /toggleflag <player> <flag>");
                var target = args[0];
                var flag = args[1].ToLowerInvariant();
                var validFlags = new[] { "invisible", "footstep", "zoom" };
                if (!validFlags.Contains(flag))
                    return Task.FromResult($"Invalid flag '{flag}'. Valid flags: {string.Join(", ", validFlags)}");
                var result = _togglePlayerFlag(target, flag);
                if (result == null) return Task.FromResult($"Player '{target}' not found or offline.");
                return Task.FromResult(result);
            }, "server"));

        Register(new ChatCommand("detached", "Create a detached inventory", Array.Empty<string>(),
            (playerName, args) =>
            {
                if (args.Length < 2) return Task.FromResult("Usage: /detached <name> <size>");
                if (!int.TryParse(args[1], out var size) || size < 1 || size > 64)
                    return Task.FromResult("Size must be between 1 and 64.");
                return Task.FromResult($"DETACHED_CREATE:{args[0]}:{size}");
            }, "server"));

        Register(new ChatCommand("trash", "Open a shared trash inventory", Array.Empty<string>(),
            (_, _) => Task.FromResult("DETACHED_OPEN:trash")));

        Register(new ChatCommand("waypoint", "Add a waypoint marker", Array.Empty<string>(),
            (playerName, args) =>
            {
                if (_addWaypoint == null) return Task.FromResult("Waypoint command not available.");
                if (args.Length < 3) return Task.FromResult("Usage: /waypoint <name> <x> <y> <z> [color]");
                if (!float.TryParse(args[1], out var x) || !float.TryParse(args[2], out var y) || !float.TryParse(args[3], out var z))
                    return Task.FromResult("Invalid coordinates. Usage: /waypoint <name> <x> <y> <z> [color]");
                var color = args.Length > 4 ? args[4] : "#00ff00";
                _addWaypoint(playerName, x, y, z, args[0], color);
                return Task.FromResult($"Waypoint '{args[0]}' set at ({Math.Round(x)}, {Math.Round(y)}, {Math.Round(z)})");
            }, "interact"));

        Register(new ChatCommand("set_lighting", "Set lighting parameters", new[] { "lighting" },
            (playerName, args) =>
            {
                if (args.Length == 0)
                    return Task.FromResult("Usage: /set_lighting [shadow <0-1>] [exposure_min <0-1>] [exposure_max <0-2>] [ambient <0-2>] [bloom <0-1>]");
                if (args.Length == 1 && args[0].Equals("reset", StringComparison.OrdinalIgnoreCase))
                    return Task.FromResult("LIGHTING:1:0.2:1:0:0");
                var shadow = 1.0f; var expMin = 0.2f; var expMax = 1.0f; var ambient = 0f; var bloom = 0f;
                for (var i = 0; i < args.Length - 1; i += 2)
                {
                    if (i + 1 >= args.Length) break;
                    if (!float.TryParse(args[i + 1], out var val)) continue;
                    switch (args[i].ToLowerInvariant())
                    {
                        case "shadow": shadow = val; break;
                        case "exposure_min": expMin = val; break;
                        case "exposure_max": expMax = val; break;
                        case "ambient": ambient = val; break;
                        case "bloom": bloom = val; break;
                    }
                }
                shadow = Math.Clamp(shadow, 0, 1);
                expMin = Math.Clamp(expMin, 0, 1);
                expMax = Math.Clamp(expMax, 0, 2);
                ambient = Math.Clamp(ambient, 0, 2);
                bloom = Math.Clamp(bloom, 0, 1);
                return Task.FromResult($"LIGHTING:{shadow}:{expMin}:{expMax}:{ambient}:{bloom}");
            }, "server"));

        Register(new ChatCommand("hudflag", "Toggle a HUD element visibility", new[] { "hudtoggleflag", "togglehud" },
            (playerName, args) =>
            {
                if (args.Length == 0)
                    return Task.FromResult("Usage: /hudflag <flag> [on|off]. Flags: hotbar, healthbar, crosshair, breathbar, hungerbar, minimap, debug, chat");
                var flag = args[0].ToLowerInvariant();
                var validFlags = new[] { "hotbar", "healthbar", "crosshair", "breathbar", "hungerbar", "minimap", "debug", "chat" };
                if (!validFlags.Contains(flag))
                    return Task.FromResult($"Invalid flag '{flag}'. Valid flags: {string.Join(", ", validFlags)}");
                if (args.Length > 1)
                {
                    var val = args[1].ToLowerInvariant();
                    if (val == "on") return Task.FromResult($"HUD_SET:{flag}:true");
                    if (val == "off") return Task.FromResult($"HUD_SET:{flag}:false");
                }
                return Task.FromResult($"HUD_TOGGLE:{flag}");
            }, "interact"));

        Register(new ChatCommand("stuff", "Give initial starter items to yourself", new[] { "givestuff" },
            (_playerName, _args) => Task.FromResult("GIVE_INITIAL_STUFF"), "give"));

        Register(new ChatCommand("infplace", "Toggle infinite block placement", new[] { "infinite_place" },
            (playerName, args) =>
            {
                if (args.Length > 0 && args[0].Equals("on", StringComparison.OrdinalIgnoreCase))
                    return Task.FromResult("INFPLACE:true");
                if (args.Length > 0 && args[0].Equals("off", StringComparison.OrdinalIgnoreCase))
                    return Task.FromResult("INFPLACE:false");
                return Task.FromResult("INFPLACE:toggle");
            }, "give"));

        Register(new ChatCommand("days", "Show the current day count", Array.Empty<string>(),
            (_playerName, _args) =>
            {
                var gameTime = _getGameTime();
                var totalDays = (gameTime / 1000 / 24000) + 1;
                return Task.FromResult($"Day {totalDays}");
            }));

        Register(new ChatCommand("worldinfo", "Show world information", new[] { "world" },
            (_playerName, _args) =>
            {
                var seed = _getWorldSeed?.Invoke() ?? 0;
                var name = _getWorldName?.Invoke() ?? "unknown";
                var chunks = _getLoadedChunkCount?.Invoke() ?? 0;
                var entities = _getEntityCount?.Invoke() ?? 0;
                var players = _getOnlinePlayers?.Invoke();
                var playerCount = players?.Length ?? 0;
                var uptimeMs = _getGameTime();
                var uptime = TimeSpan.FromMilliseconds(uptimeMs);
                var uptimeStr = $"{uptime.Days}d {uptime.Hours}h {uptime.Minutes}m {uptime.Seconds}s";
                var lines = new List<string>
                {
                    $"--- World Info ---",
                    $"World: {name}",
                    $"Seed: {seed}",
                    $"Loaded chunks: {chunks}",
                    $"Active entities: {entities}",
                    $"Online players: {playerCount}",
                    $"Server uptime: {uptimeStr}"
                };
                return Task.FromResult(string.Join("\n", lines));
            }));

        Register(new ChatCommand("mods", "List ported game features", Array.Empty<string>(),
            (_playerName, _args) =>
            {
                return Task.FromResult("Web port of minetest devtest. Ported features: basenodes, basetools, bucket, chest, stairs, crafting, smelting, fishing, breeding, mobs, weather, redstone, particles, protection, rollback, sound, ABMs, biomes, dungeons, ores, farming, PvP/PvM, privileges, chat commands.");
            }));

        Register(new ChatCommand("whois", "Show player connection info", Array.Empty<string>(),
            (playerName, args) =>
            {
                if (args.Length == 0) return Task.FromResult("Usage: /whois <player>");
                return Task.FromResult($"WHOIS:{args[0]}");
            }));

        Register(new ChatCommand("ping", "Check your connection latency", Array.Empty<string>(),
            (playerName, _args) =>
            {
                return Task.FromResult("Pong!");
            }));

        Register(new ChatCommand("clear", "Clear your chat history", Array.Empty<string>(),
            (_playerName, _args) =>
            {
                return Task.FromResult("CLEAR_CHAT");
            }));

        Register(new ChatCommand("setclouds", "Set cloud parameters", new[] { "clouds" },
            (playerName, args) =>
            {
                if (args.Length == 0 || args[0] == "reset")
                    return Task.FromResult("CLOUD_SET:density:0.4:thickness:16:height:120:speed:2.0");
                if (args.Length < 2)
                    return Task.FromResult("Usage: /setclouds <param> <value>. Params: density(0-1), thickness(1-32), height(50-200), speed(0-20), reset");
                var param = args[0].ToLowerInvariant();
                var value = args[1];
                if (param is not ("density" or "thickness" or "height" or "speed"))
                    return Task.FromResult("Unknown param. Use: density, thickness, height, speed, reset");
                return Task.FromResult($"CLOUD_SET:{param}:{value}");
            }, "server"));

        Register(new ChatCommand("spawnmob", "Spawn a mob at a location", new[] { "summonmob" },
            (playerName, args) =>
            {
                if (args.Length < 1)
                    return Task.FromResult("Usage: /spawnmob <type> [x y z]");
                return Task.FromResult($"SPAWNMOB:{args[0]}:{(args.Length >= 4 ? $"{args[1]} {args[2]} {args[3]}" : "")}");
            }, "server"));

        Register(new ChatCommand("killmobs", "Kill all mob entities", new[] { "killentities2" },
            (_playerName, _args) =>
            {
                _killAllMobs?.Invoke();
                return Task.FromResult("All mobs killed.");
            }, "server"));

        Register(new ChatCommand("getblock", "Get block info at a position", new[] { "blockinfo" },
            (playerName, args) =>
            {
                if (args.Length < 3)
                    return Task.FromResult("Usage: /getblock <x> <y> <z>");
                return Task.FromResult($"GETBLOCK:{args[0]}:{args[1]}:{args[2]}");
            }, "interact"));

        Register(new ChatCommand("setsky", "Set sky rendering parameters", new[] { "sky" },
            (playerName, args) =>
            {
                if (args.Length == 0)
                    return Task.FromResult("Usage: /setsky <sun|moon|stars|fog|reset> [value]");
                var sub = args[0].ToLowerInvariant();
                if (sub == "reset")
                    return Task.FromResult("SKY_SET:reset");
                if (args.Length < 2)
                    return Task.FromResult("Usage: /setsky <sun|moon|stars|fog|reset> [value]");
                return sub switch
                {
                    "sun" => Task.FromResult($"SKY_SET:sunColor:{args[1]}"),
                    "moon" => Task.FromResult($"SKY_SET:moonColor:{args[1]}"),
                    "stars" => Task.FromResult($"SKY_SET:starsCount:{args[1]}"),
                    "fog" => Task.FromResult($"SKY_SET:fogColor:{args[1]}"),
                    _ => Task.FromResult("Unknown subcommand. Use: sun, moon, stars, fog, reset")
                };
            }, "server"));

        Register(new ChatCommand("stats", "Show player statistics", new[] { "scoreboard" },
            (playerName, args) =>
            {
                if (_getPlayerStatistics == null) return Task.FromResult("Statistics command is not available.");
                var target = args.Length > 0 ? args[0] : playerName;
                var stats = _getPlayerStatistics(target);
                if (stats == null) return Task.FromResult($"Player '{target}' not found or offline.");
                var playTime = TimeSpan.FromTicks(stats.PlayTimeTicks * (TimeSpan.TicksPerSecond / 20));
                var lines = new List<string>
                {
                    $"--- {target} Stats ---",
                    $"Blocks Mined: {stats.BlocksMined}",
                    $"Blocks Placed: {stats.BlocksPlaced}",
                    $"Distance Walked: {stats.DistanceWalked}",
                    $"Players Killed: {stats.PlayersKilled}",
                    $"Mobs Killed: {stats.MobsKilled}",
                    $"Deaths: {stats.Deaths}",
                    $"Items Crafted: {stats.ItemsCrafted}",
                    $"Damage Taken: {stats.DamageTaken}",
                    $"Damage Dealt: {stats.DamageDealt}",
                    $"Play Time: {playTime.Hours}h {playTime.Minutes}m {playTime.Seconds}s"
                };
                return Task.FromResult(string.Join("\n", lines));
            }));

        Register(new ChatCommand("color", "Set a color tint for an inventory item", Array.Empty<string>(),
            (playerName, args) =>
            {
                if (args.Length < 2) return Task.FromResult("Usage: /color <item> <hex_color>");
                var itemId = args[0].ToLowerInvariant();
                var color = args[1];
                if (!color.StartsWith('#')) color = '#' + color;
                if (!System.Text.RegularExpressions.Regex.IsMatch(color, @"^#[0-9a-fA-F]{3,8}$"))
                    return Task.FromResult("Invalid hex color. Use format: #RRGGBB");
                return Task.FromResult($"COLOR_SET:{itemId}:{color}");
            }, "interact"));

        Register(new ChatCommand("uncolor", "Remove color tint from an inventory item", Array.Empty<string>(),
            (playerName, args) =>
            {
                if (args.Length == 0) return Task.FromResult("Usage: /uncolor <item>");
                var itemId = args[0].ToLowerInvariant();
                return Task.FromResult($"COLOR_CLEAR:{itemId}");
            }, "interact"));

        Register(new ChatCommand("fov", "Set player field of view", Array.Empty<string>(),
            (playerName, args) =>
            {
                if (args.Length < 2) return Task.FromResult("Usage: /fov <player> <degrees>");
                var target = args[0];
                if (!float.TryParse(args[1], out var fov))
                    return Task.FromResult("Invalid FOV value. Must be a number.");
                fov = Math.Clamp(fov, 30f, 110f);
                return Task.FromResult($"FOV_SET:{target}:{fov}");
            }, "server"));

        Register(new ChatCommand("backup", "Create a world backup", Array.Empty<string>(),
            (_, _) =>
            {
                if (_getWorldDataPath == null) return Task.FromResult("Backup command is not available.");
                var worldDir = _getWorldDataPath();
                var backupPath = WorldBackup.CreateBackup(worldDir);
                return Task.FromResult(backupPath != null
                    ? $"Backup created: {backupPath}"
                    : "Failed to create backup.");
            }, "server"));

        Register(new ChatCommand("restore", "Restore the most recent world backup", Array.Empty<string>(),
            (_, _) =>
            {
                if (_getWorldDataPath == null) return Task.FromResult("Restore command is not available.");
                var worldDir = _getWorldDataPath();
                var backups = WorldBackup.ListBackups();
                if (backups.Count == 0) return Task.FromResult("No backups available to restore.");
                var latest = backups[0];
                var success = WorldBackup.RestoreBackup(latest, worldDir);
                return Task.FromResult(success
                    ? $"Restored from backup: {latest}"
                    : "Failed to restore backup.");
            }, "server"));

        Register(new ChatCommand("rollback", "Rollback block changes by a player within a time window", Array.Empty<string>(),
            (playerName, args) =>
            {
                if (_rollbackPlayer == null) return Task.FromResult("Rollback command is not available.");
                if (args.Length < 2) return Task.FromResult("Usage: /rollback <player> <seconds>");
                var targetPlayer = args[0];
                if (!int.TryParse(args[1], out var seconds) || seconds <= 0)
                    return Task.FromResult("Seconds must be a positive number.");
                var rolledBack = _rollbackPlayer(targetPlayer, seconds);
                return Task.FromResult($"Rolled back {rolledBack} block changes by {targetPlayer} in the last {seconds}s.");
            }, "rollback"));

        Register(new ChatCommand("setmapgen", "Change the world generator type", new[] { "setgen" },
            (_playerName, args) =>
            {
                if (_setMapGen == null) return Task.FromResult("Set mapgen command is not available.");
                if (args.Length == 0) return Task.FromResult("Usage: /setmapgen <v7|v5|fractal|singlenode|flat|noise>");
                var validTypes = new[] { "v7", "v5", "fractal", "singlenode", "flat", "noise" };
                var genType = args[0].ToLowerInvariant();
                if (!validTypes.Contains(genType))
                    return Task.FromResult($"Unknown generator '{genType}'. Valid types: {string.Join(", ", validTypes)}");
                _setMapGen(genType);
                return Task.FromResult($"World generator changed to '{genType}'. Only affects newly generated chunks.");
            }, "server"));

        Register(new ChatCommand("rollbacktell", "Rollback block changes in an area within a time window", Array.Empty<string>(),
            (playerName, args) =>
            {
                if (_rollbackArea == null) return Task.FromResult("Rollback tell command is not available.");
                if (args.Length < 7) return Task.FromResult("Usage: /rollbacktell <x1> <y1> <z1> <x2> <y2> <z2> <seconds>");
                if (!int.TryParse(args[0], out var x1) || !int.TryParse(args[1], out var y1) ||
                    !int.TryParse(args[2], out var z1) || !int.TryParse(args[3], out var x2) ||
                    !int.TryParse(args[4], out var y2) || !int.TryParse(args[5], out var z2))
                    return Task.FromResult("Invalid coordinates. Usage: /rollbacktell <x1> <y1> <z1> <x2> <y2> <z2> <seconds>");
                if (!int.TryParse(args[6], out var seconds) || seconds <= 0)
                    return Task.FromResult("Seconds must be a positive number.");
                var rolledBack = _rollbackArea(x1, y1, z1, x2, y2, z2, seconds);
                return Task.FromResult($"Rolled back {rolledBack} block changes in ({x1},{y1},{z1})-({x2},{y2},{z2}) in the last {seconds}s.");
            }, "rollback"));

        Register(new ChatCommand("timeoverride", "Override the day/night ratio", Array.Empty<string>(),
            (playerName, args) =>
            {
                if (args.Length == 0)
                    return Task.FromResult("Usage: /timeoverride <0-1|off>");
                if (args[0].Equals("off", StringComparison.OrdinalIgnoreCase))
                    return Task.FromResult("TIME_OVERRIDE:0:false");
                if (!float.TryParse(args[0], out var ratio))
                    return Task.FromResult("Invalid ratio. Use a number between 0 and 1, or 'off'.");
                ratio = Math.Clamp(ratio, 0f, 1f);
                return Task.FromResult($"TIME_OVERRIDE:{ratio}:true");
            }, "server"));

        Register(new ChatCommand("setpassword", "Set another player's password", Array.Empty<string>(),
            (playerName, args) =>
            {
                if (_setPassword == null) return Task.FromResult("Password command is not available.");
                if (args.Length < 2) return Task.FromResult("Usage: /setpassword <player> <new_password>");
                var targetPlayer = args[0];
                var newPassword = string.Join(' ', args[1..]);
                if (newPassword.Length < 8) return Task.FromResult("Password must be at least 8 characters.");
                if (newPassword.Length > 128) return Task.FromResult("Password must be at most 128 characters.");
                var success = _setPassword(targetPlayer, newPassword);
                return Task.FromResult(success
                    ? $"Password updated for {targetPlayer}."
                    : $"Failed to update password for {targetPlayer}.");
            }, "password"));

        Register(new ChatCommand("clearpassword", "Clear a player's password", Array.Empty<string>(),
            (playerName, args) =>
            {
                if (_clearPassword == null) return Task.FromResult("Clear password command is not available.");
                if (args.Length == 0) return Task.FromResult("Usage: /clearpassword <player>");
                var success = _clearPassword(args[0]);
                return Task.FromResult(success
                    ? $"Password cleared for {args[0]}."
                    : $"Failed to clear password for {args[0]}.");
            }, "password"));

        Register(new ChatCommand("remove_player", "Remove a player's account data", new[] { "removeplayer" },
            (playerName, args) =>
            {
                if (_removePlayer == null) return Task.FromResult("Remove player command is not available.");
                if (args.Length == 0) return Task.FromResult("Usage: /remove_player <player>");
                var success = _removePlayer(args[0]);
                return Task.FromResult(success
                    ? $"Player '{args[0]}' account data removed."
                    : $"Failed to remove player '{args[0]}'. Player may not exist.");
            }, "server"));

        Register(new ChatCommand("auth_reload", "Reload authentication data", new[] { "reloadauth" },
            (_playerName, _args) =>
            {
                if (_reloadAuth == null) return Task.FromResult("Auth reload command is not available.");
                _reloadAuth();
                return Task.FromResult("Authentication data reloaded.");
            }, "server"));

        Register(new ChatCommand("last-login", "Show last login time for a player", new[] { "lastlogin" },
            (playerName, args) =>
            {
                if (_getLastLogin == null) return Task.FromResult("Last login command is not available.");
                if (args.Length == 0) return Task.FromResult("Usage: /last-login <player>");
                var lastLogin = _getLastLogin(args[0]);
                if (lastLogin == null) return Task.FromResult($"No login data found for '{args[0]}'.");
                return Task.FromResult($"Last login for {args[0]}: {lastLogin}");
            }, "server"));

        Register(new ChatCommand("rollback_check", "Check rollback data for a position", new[] { "rbcheck" },
            (playerName, args) =>
            {
                if (_rollbackCheck == null) return Task.FromResult("Rollback check command is not available.");
                if (args.Length < 4) return Task.FromResult("Usage: /rollback_check <x> <y> <z> <radius>");
                if (!int.TryParse(args[0], out var x) || !int.TryParse(args[1], out var y) ||
                    !int.TryParse(args[2], out var z) || !int.TryParse(args[3], out var radius))
                    return Task.FromResult("Invalid parameters. Usage: /rollback_check <x> <y> <z> <radius>");
                if (radius < 1 || radius > 100) return Task.FromResult("Radius must be between 1 and 100.");
                var result = _rollbackCheck(x, y, z, radius);
                if (result == null) return Task.FromResult($"No rollback data found at ({x},{y},{z}) within radius {radius}.");
                return Task.FromResult(result);
            }, "rollback"));

        Register(new ChatCommand("emergeblocks", "Force-generate chunks in an area", new[] { "emerge" },
            (playerName, args) =>
            {
                if (_emergeBlocks == null) return Task.FromResult("Emerge blocks command is not available.");
                if (args.Length < 6) return Task.FromResult("Usage: /emergeblocks <x1> <y1> <z1> <x2> <y2> <z2>");
                if (!int.TryParse(args[0], out var x1) || !int.TryParse(args[1], out var y1) ||
                    !int.TryParse(args[2], out var z1) || !int.TryParse(args[3], out var x2) ||
                    !int.TryParse(args[4], out var y2) || !int.TryParse(args[5], out var z2))
                    return Task.FromResult("Invalid coordinates. Usage: /emergeblocks <x1> <y1> <z1> <x2> <y2> <z2>");
                var count = _emergeBlocks(x1, y1, z1, x2, y2, z2);
                return Task.FromResult($"Emerged {count} blocks in ({x1},{y1},{z1})-({x2},{y2},{z2}).");
            }, "server"));

        Register(new ChatCommand("deleteblocks", "Delete blocks in an area", new[] { "deleteblocks" },
            (playerName, args) =>
            {
                if (_deleteBlocks == null) return Task.FromResult("Delete blocks command is not available.");
                if (args.Length < 6) return Task.FromResult("Usage: /deleteblocks <x1> <y1> <z1> <x2> <y2> <z2>");
                if (!int.TryParse(args[0], out var x1) || !int.TryParse(args[1], out var y1) ||
                    !int.TryParse(args[2], out var z1) || !int.TryParse(args[3], out var x2) ||
                    !int.TryParse(args[4], out var y2) || !int.TryParse(args[5], out var z2))
                    return Task.FromResult("Invalid coordinates. Usage: /deleteblocks <x1> <y1> <z1> <x2> <y2> <z2>");
                var count = _deleteBlocks(x1, y1, z1, x2, y2, z2);
                return Task.FromResult($"Deleted {count} blocks in ({x1},{y1},{z1})-({x2},{y2},{z2}).");
            }, "server"));

        Register(new ChatCommand("fixlight", "Fix lighting in an area", new[] { "fixlighting" },
            (playerName, args) =>
            {
                if (_fixLight == null) return Task.FromResult("Fix light command is not available.");
                if (args.Length < 6) return Task.FromResult("Usage: /fixlight <x1> <y1> <z1> <x2> <y2> <z2>");
                if (!int.TryParse(args[0], out var x1) || !int.TryParse(args[1], out var y1) ||
                    !int.TryParse(args[2], out var z1) || !int.TryParse(args[3], out var x2) ||
                    !int.TryParse(args[4], out var y2) || !int.TryParse(args[5], out var z2))
                    return Task.FromResult("Invalid coordinates. Usage: /fixlight <x1> <y1> <z1> <x2> <y2> <z2>");
                var count = _fixLight(x1, y1, z1, x2, y2, z2);
                return Task.FromResult($"Fixed lighting for {count} nodes in ({x1},{y1},{z1})-({x2},{y2},{z2}).");
            }, "server"));

        Register(new ChatCommand("weather", "Set weather (clear/rain/snow/thunder)", Array.Empty<string>(),
            (playerName, args) =>
            {
                if (args.Length < 1) return Task.FromResult("Usage: /weather <clear|rain|snow|thunder>");
                var weather = args[0].ToLowerInvariant();
                switch (weather)
                {
                    case "clear":
                        _setWeatherClear?.Invoke(playerName);
                        return Task.FromResult("Weather set to clear.");
                    case "rain":
                        _setWeatherRain?.Invoke(playerName);
                        return Task.FromResult("Weather set to rain.");
                    case "snow":
                        _setWeatherSnow?.Invoke(playerName);
                        return Task.FromResult("Weather set to snow.");
                    case "thunder":
                        _setWeatherThunder?.Invoke(playerName);
                        return Task.FromResult("Weather set to thunderstorm.");
                    default:
                        return Task.FromResult("Unknown weather type. Use: clear, rain, snow, thunder");
                }
            }, "server"));

        Register(new ChatCommand("tpplayer", "Teleport a player to another player", new[] { "teleport_player" },
            (playerName, args) =>
            {
                if (_teleportPlayerToPlayer == null) return Task.FromResult("Teleport player command is not available.");
                if (args.Length < 2) return Task.FromResult("Usage: /tpplayer <source> <target>");
                var source = args[0];
                var target = args[1];
                var success = _teleportPlayerToPlayer(source, target);
                return Task.FromResult(success ? $"Teleported {source} to {target}." : $"Failed to teleport. Check player names.");
            }, "teleport"));

        Register(new ChatCommand("use_tool", "Apply tool wear for testing", new[] { "usetool" },
            (playerName, args) =>
            {
                if (_useToolOnPlayer == null) return Task.FromResult("Use tool command is not available.");
                if (args.Length < 2) return Task.FromResult("Usage: /use_tool <dig|hit> <group> [level] [uses]");
                var action = args[0].ToLowerInvariant();
                if (action != "dig" && action != "hit") return Task.FromResult("Action must be 'dig' or 'hit'.");
                var group = args[1];
                var level = args.Length >= 3 && int.TryParse(args[2], out var lvl) ? lvl : 1;
                var uses = args.Length >= 4 && int.TryParse(args[3], out var u) ? u : 1;
                _useToolOnPlayer(playerName, group, level, uses);
                return Task.FromResult($"Applied {uses} {action}({group},{level}) to your tool.");
            }, "server"));

        Register(new ChatCommand("detach", "Detach all objects near you", Array.Empty<string>(),
            (playerName, args) =>
            {
                if (_detachNearby == null) return Task.FromResult("Detach command is not available.");
                var radius = args.Length >= 1 && int.TryParse(args[0], out var r) ? r : 5;
                var count = _detachNearby(playerName, radius);
                return Task.FromResult($"Detached {count} objects within {radius} blocks.");
            }, "interact"));

        Register(new ChatCommand("clearobjects", "Clear all objects (quick/full)", new[] { "clear_obj" },
            (playerName, args) =>
            {
                if (_clearAllEntities == null) return Task.FromResult("Clear objects command is not available.");
                var mode = args.Length >= 1 ? args[0].ToLowerInvariant() : "quick";
                _clearAllEntities();
                return Task.FromResult($"Cleared all objects (mode: {mode}).");
            }, "server"));

        Register(new ChatCommand("pulverize", "Clear all entities", Array.Empty<string>(),
            (_playerName, _args) =>
            {
                if (_clearAllEntities == null) return Task.FromResult("Pulverize command is not available.");
                _clearAllEntities();
                return Task.FromResult("All entities have been cleared");
            }, "interact"));
    }

    public void RegisterExternalCommand(ChatCommand command)
    {
        Register(command);
    }

    public ChatCommand? GetCommand(string name)
    {
        return _commands.TryGetValue(name.ToLowerInvariant(), out var cmd) ? cmd : null;
    }

    public string[] GetCommandNames()
    {
        return _commands.Keys.OrderBy(k => k).ToArray();
    }

    public void Register(ChatCommand command)
    {
        _commands[command.Name.ToLowerInvariant()] = command;
        foreach (var alias in command.Aliases)
        {
            _commands[alias.ToLowerInvariant()] = command;
        }
    }

    public async Task<string?> TryExecute(string playerName, string input)
    {
        if (string.IsNullOrWhiteSpace(input) || input[0] != '/') return null;

        var parts = input.Substring(1).Split(' ', StringSplitOptions.RemoveEmptyEntries);
        if (parts.Length == 0) return null;

        var commandName = parts[0].ToLowerInvariant();
        if (!_commands.TryGetValue(commandName, out var command)) return "Unknown command. Type /help for available commands.";

        if (!string.IsNullOrEmpty(command.RequiredPrivilege))
        {
            var playerPrivs = _getPlayerPrivileges?.Invoke(playerName);
            if (playerPrivs == null) return $"You don't have the '{command.RequiredPrivilege}' privilege to use /{command.Name}";
            var requiredPriv = command.RequiredPrivilege;
            var hasRequired = Array.Exists(playerPrivs, p => p == requiredPriv);
            if (!hasRequired && requiredPriv == "privs")
            {
                hasRequired = Array.Exists(playerPrivs, p => p == "basic_privs");
            }
            if (!hasRequired)
            {
                return $"You don't have the '{command.RequiredPrivilege}' privilege to use /{command.Name}";
            }
        }

        var args = parts.Skip(1).ToArray();
        return await command.Handler(playerName, args);
    }
}
