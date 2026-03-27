namespace WebGameServer.Core.Player;

public enum PlayerState
{
    Connecting,
    Connected,
    Playing,
    Disconnected
}

public enum GameMode
{
    Survival,
    Creative,
    Adventure,
    Spectator
}
