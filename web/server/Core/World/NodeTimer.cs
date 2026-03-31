namespace WebGameServer.Core.World;

public class NodeTimer
{
    public int X { get; set; }
    public int Y { get; set; }
    public int Z { get; set; }
    public double Timeout { get; set; }
    public double Elapsed { get; set; }

    public NodeTimerKey Key => new(X, Y, Z);

    public NodeTimer(int x, int y, int z, double timeout)
    {
        X = x;
        Y = y;
        Z = z;
        Timeout = timeout;
        Elapsed = 0;
    }

    public bool IsExpired => Elapsed >= Timeout;
}
