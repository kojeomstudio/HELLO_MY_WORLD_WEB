namespace WebGameServer.Core.Player;

public class PlayerStatistics
{
    public int BlocksMined { get; set; }
    public int BlocksPlaced { get; set; }
    public int DistanceWalked { get; set; }
    public int PlayersKilled { get; set; }
    public int MobsKilled { get; set; }
    public int Deaths { get; set; }
    public int ItemsCrafted { get; set; }
    public int DamageTaken { get; set; }
    public int DamageDealt { get; set; }
    public int PlayTimeTicks { get; set; }
    public DateTime JoinTime { get; set; } = DateTime.UtcNow;

    public void IncrementMined() => BlocksMined++;
    public void IncrementPlaced() => BlocksPlaced++;
    public void AddDistanceWalked(int blocks) => DistanceWalked += blocks;
    public void IncrementPlayersKilled() => PlayersKilled++;
    public void IncrementMobsKilled() => MobsKilled++;
    public void IncrementDeaths() => Deaths++;
    public void IncrementItemsCrafted() => ItemsCrafted++;
    public void AddDamageTaken(int amount) => DamageTaken += amount;
    public void AddDamageDealt(int amount) => DamageDealt += amount;
    public void IncrementPlayTime() => PlayTimeTicks++;
}
