using WebGameServer.Core.Entities;
using WebGameServer.Core.Player;

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
        Func<string, string, string, bool>? sendPrivateMessage = null)
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

                _teleport(playerName, new Vector3(x, y, z));
                return Task.FromResult($"Teleported {playerName} to ({x}, {y}, {z})");
            }, "teleport"));

        Register(new ChatCommand("give", "Give item to player", Array.Empty<string>(),
            (playerName, args) =>
            {
                if (_giveItem == null) return Task.FromResult("Give command is not available.");
                if (args.Length < 2) return Task.FromResult("Usage: /give <player> <item> [count]");

                var targetPlayer = args[0];
                var itemId = args[1];
                var count = 1;
                if (args.Length >= 3 && !int.TryParse(args[2], out count))
                {
                    return Task.FromResult("Invalid count. Usage: /give <player> <item> [count]");
                }

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
                if (args[1] == "server" && _hasPrivilege != null && !_hasPrivilege(playerName))
                    return Task.FromResult("Only server admins can grant the 'server' privilege.");
                _grantPrivilege(args[0], args[1]);
                return Task.FromResult($"Granted '{args[1]}' to {args[0]}");
            }, "privs"));

        Register(new ChatCommand("revoke", "Revoke a privilege from a player", Array.Empty<string>(),
            (_, args) =>
            {
                if (_revokePrivilege == null) return Task.FromResult("Revoke command is not available.");
                if (args.Length < 2) return Task.FromResult("Usage: /revoke <player> <privilege>");
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
                _spawnEntity(args[0], new Vector3(x, y, z));
                return Task.FromResult($"Spawned {args[0]} at ({x}, {y}, {z})");
            }, "give"));

        Register(new ChatCommand("killall", "Clear all entities", new[] { "clearentities", "pulverize" },
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
            if (playerPrivs == null || !Array.Exists(playerPrivs, p => p == command.RequiredPrivilege))
            {
                return $"You don't have the '{command.RequiredPrivilege}' privilege to use /{command.Name}";
            }
        }

        var args = parts.Skip(1).ToArray();
        return await command.Handler(playerName, args);
    }
}
