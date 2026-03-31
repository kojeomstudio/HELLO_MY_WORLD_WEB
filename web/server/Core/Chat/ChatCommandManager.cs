using WebGameServer.Core.Player;

namespace WebGameServer.Core.Chat;

public class ChatCommand
{
    public string Name { get; }
    public string Description { get; }
    public string[] Aliases { get; }
    public Func<string, string[], Task<string>> Handler { get; }

    public ChatCommand(string name, string description, string[] aliases, Func<string, string[], Task<string>> handler)
    {
        Name = name;
        Description = description;
        Aliases = aliases;
        Handler = handler;
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

    public ChatCommandManager(
        Func<long> getGameTime,
        Func<int> getTps,
        Action<string, GameMode>? setGameMode = null,
        Action<string, Vector3>? teleport = null,
        Action<string, string, string, int>? giveItem = null)
    {
        _getGameTime = getGameTime;
        _getTps = getTps;
        _setGameMode = setGameMode;
        _teleport = teleport;
        _giveItem = giveItem;
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
            }));

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
            }));

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
            }));
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

        var args = parts.Skip(1).ToArray();
        return await command.Handler(playerName, args);
    }
}
