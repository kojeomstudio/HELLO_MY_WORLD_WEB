namespace WebGameServer.Core.Chat;

public class ModChannel
{
    public string Name { get; }
    public HashSet<string> Subscribers { get; } = new();
    public Func<string, string, Task>? OnMessage { get; set; }

    public ModChannel(string name)
    {
        Name = name;
    }
}

public static class ModChannelManager
{
    private static readonly Dictionary<string, ModChannel> _channels = new();
    private static readonly object _lock = new();

    public static bool JoinChannel(string channelName, string playerName)
    {
        lock (_lock)
        {
            if (!_channels.TryGetValue(channelName, out var channel))
            {
                channel = new ModChannel(channelName);
                _channels[channelName] = channel;
            }
            return channel.Subscribers.Add(playerName);
        }
    }

    public static bool LeaveChannel(string channelName, string playerName)
    {
        lock (_lock)
        {
            if (!_channels.TryGetValue(channelName, out var channel)) return false;
            channel.Subscribers.Remove(playerName);
            if (channel.Subscribers.Count == 0)
            {
                _channels.Remove(channelName);
            }
            return true;
        }
    }

    public static List<string> SendMessage(string channelName, string sender, string message)
    {
        lock (_lock)
        {
            if (!_channels.TryGetValue(channelName, out var channel)) return new();
            var recipients = new List<string>(channel.Subscribers);
            channel.OnMessage?.Invoke(sender, message);
            return recipients;
        }
    }

    public static List<string> GetChannels()
    {
        lock (_lock)
        {
            return _channels.Keys.ToList();
        }
    }

    public static List<string> GetSubscribers(string channelName)
    {
        lock (_lock)
        {
            return _channels.TryGetValue(channelName, out var channel)
                ? channel.Subscribers.ToList()
                : new();
        }
    }

    public static void RegisterHandler(string channelName, Func<string, string, Task> handler)
    {
        lock (_lock)
        {
            if (!_channels.TryGetValue(channelName, out var channel))
            {
                channel = new ModChannel(channelName);
                _channels[channelName] = channel;
            }
            channel.OnMessage = handler;
        }
    }
}
