using System.Collections.Concurrent;
using WebGameServer.Core.World;
using GameWorld = WebGameServer.Core.World.World;
using ItemStack = WebGameServer.Core.Player.ItemStack;

namespace WebGameServer.Core.Entities;

public enum FishingPhase
{
    None,
    Waiting,
    Bite,
    Reeling
}

public record struct FishingSession(
    DateTime CastTime,
    DateTime BiteTime,
    Vector3 BobberPosition,
    FishingPhase Phase,
    TimeSpan BiteDelay,
    TimeSpan ReelWindow)
{
    public bool IsReelWindowActive => Phase == FishingPhase.Bite
        && DateTime.UtcNow - BiteTime <= ReelWindow;
}

public class FishingSystem
{
    private readonly ConcurrentDictionary<string, FishingSession> _activeSessions = new();

    public TimeSpan MinBiteDelay { get; set; } = TimeSpan.FromSeconds(5);
    public TimeSpan MaxBiteDelay { get; set; } = TimeSpan.FromSeconds(30);
    public TimeSpan MinReelWindow { get; set; } = TimeSpan.FromSeconds(3);
    public TimeSpan MaxReelWindow { get; set; } = TimeSpan.FromSeconds(5);
    public double FishProbability { get; set; } = 0.85;
    public double JunkProbability { get; set; } = 0.10;
    public double TreasureProbability { get; set; } = 0.05;
    public float WaterCheckRadius { get; set; } = 5.0f;
    public int MaxFishingDistance { get; set; } = 10;

    private static readonly string[] FishItems = { "fish_raw" };
    private static readonly string[] JunkItems = { "leather_boots", "stick", "bone" };
    private static readonly string[] TreasureItems = { "name_tag", "saddle", "enchanted_book" };

    public FishingPhase GetFishingState(string playerName)
    {
        if (!_activeSessions.TryGetValue(playerName, out var session)) return FishingPhase.None;
        return session.Phase;
    }

    public FishingSession? GetSession(string playerName)
    {
        if (!_activeSessions.TryGetValue(playerName, out var session)) return null;
        return session;
    }

    public bool IsFishing(string playerName) => _activeSessions.ContainsKey(playerName);

    public bool StartFishing(string playerName, Vector3 playerPosition, Vector3 bobberPosition, GameWorld world)
    {
        if (_activeSessions.ContainsKey(playerName)) return false;
        if (!IsNearWater(bobberPosition, world)) return false;

        var distance = Vector3.Distance(playerPosition, bobberPosition);
        if (distance > MaxFishingDistance) return false;

        var biteDelay = TimeSpan.FromSeconds(
            MinBiteDelay.TotalSeconds + Random.Shared.NextDouble()
            * (MaxBiteDelay.TotalSeconds - MinBiteDelay.TotalSeconds));
        var reelWindow = TimeSpan.FromSeconds(
            MinReelWindow.TotalSeconds + Random.Shared.NextDouble()
            * (MaxReelWindow.TotalSeconds - MinReelWindow.TotalSeconds));

        var session = new FishingSession(
            CastTime: DateTime.UtcNow,
            BiteTime: DateTime.MaxValue,
            BobberPosition: bobberPosition,
            Phase: FishingPhase.Waiting,
            BiteDelay: biteDelay,
            ReelWindow: reelWindow);

        return _activeSessions.TryAdd(playerName, session);
    }

    public void Update()
    {
        var now = DateTime.UtcNow;
        foreach (var kvp in _activeSessions)
        {
            var session = kvp.Value;
            if (session.Phase != FishingPhase.Waiting) continue;

            if (now - session.CastTime >= session.BiteDelay)
            {
                session = session with
                {
                    Phase = FishingPhase.Bite,
                    BiteTime = now
                };
                _activeSessions[kvp.Key] = session;
            }
        }
    }

    public ItemEntity? ReelIn(string playerName)
    {
        if (!_activeSessions.TryRemove(playerName, out var session)) return null;

        if (session.Phase == FishingPhase.Waiting) return null;

        if (session.Phase == FishingPhase.Bite && !session.IsReelWindowActive) return null;

        var caughtItem = GenerateCatch();
        if (caughtItem == null) return null;

        var spawnPos = session.BobberPosition + new Vector3(0, 0.3f, 0);
        return new ItemEntity(caughtItem.ItemId, caughtItem.Count, spawnPos);
    }

    public void CancelFishing(string playerName)
    {
        _activeSessions.TryRemove(playerName, out _);
    }

    public void CancelAllFishing()
    {
        _activeSessions.Clear();
    }

    private ItemStack? GenerateCatch()
    {
        var roll = Random.Shared.NextDouble();
        string itemId;

        if (roll < FishProbability)
        {
            itemId = FishItems[Random.Shared.Next(FishItems.Length)];
        }
        else if (roll < FishProbability + JunkProbability)
        {
            itemId = JunkItems[Random.Shared.Next(JunkItems.Length)];
        }
        else if (roll < FishProbability + JunkProbability + TreasureProbability)
        {
            itemId = TreasureItems[Random.Shared.Next(TreasureItems.Length)];
        }
        else
        {
            return null;
        }

        var count = itemId == "enchanted_book" ? 1 : Random.Shared.Next(1, 4);
        return new ItemStack(itemId, count);
    }

    private bool IsNearWater(Vector3 position, GameWorld world)
    {
        var blockX = (short)Math.Floor(position.X);
        var blockY = (short)Math.Floor(position.Y);
        var blockZ = (short)Math.Floor(position.Z);
        var radius = (int)WaterCheckRadius;

        for (int dx = -radius; dx <= radius; dx++)
        {
            for (int dy = -3; dy <= 3; dy++)
            {
                for (int dz = -radius; dz <= radius; dz++)
                {
                    var checkPos = new Vector3s(
                        (short)(blockX + dx),
                        (short)(blockY + dy),
                        (short)(blockZ + dz));
                    var block = world.GetBlock(checkPos);
                    if (block.Type is BlockType.Water or BlockType.WaterFlowing
                        or BlockType.RiverWater or BlockType.RiverWaterFlowing)
                    {
                        return true;
                    }
                }
            }
        }

        return false;
    }
}
