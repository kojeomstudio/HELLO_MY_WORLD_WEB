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

    public ChatCommandManager()
    {
        RegisterBuiltInCommands();
    }

    private void RegisterBuiltInCommands()
    {
        Register(new ChatCommand("help", "Show available commands", new[] { "?" },
            (_, _) => Task.FromResult(string.Join(", ", _commands.Keys.OrderBy(k => k)))));

        Register(new ChatCommand("time", "Show current game time", Array.Empty<string>(),
            (_, _) => Task.FromResult("Current time: check your HUD")));

        Register(new ChatCommand("tps", "Show server ticks per second", Array.Empty<string>(),
            (_, _) => Task.FromResult("Server TPS: 20")));
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
