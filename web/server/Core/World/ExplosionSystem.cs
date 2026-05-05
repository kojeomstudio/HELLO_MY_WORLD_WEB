using WebGameServer.Core.Entities;
using WebGameServer.Core.Rollback;
using WorldMap = WebGameServer.Core.World.World;
using BlockType = WebGameServer.Core.World.BlockType;
using PlayerEnt = WebGameServer.Core.Player.Player;

namespace WebGameServer.Core.World;

public class ExplosionSystem
{
    private readonly WorldMap _world;
    private readonly RollbackSystem _rollback;
    private readonly EntityManager _entityManager;

    public delegate void BlockDamageHandler(int x, int y, int z, ushort oldType, ushort newType);
    public event BlockDamageHandler? OnBlockDamaged;

    public delegate void EntityDamageHandler(Entity entity, float damage, Vector3 explosionCenter);
    public event EntityDamageHandler? OnEntityDamaged;

    public delegate void PlayerDamageHandler(PlayerEnt player, float damage, Vector3 explosionCenter);
    public event PlayerDamageHandler? OnPlayerDamaged;

    public ExplosionSystem(WorldMap world, RollbackSystem rollback, EntityManager entityManager)
    {
        _world = world;
        _rollback = rollback;
        _entityManager = entityManager;
    }

    public void Explode(Vector3 center, float radius, float power, string? sourcePlayer = null)
    {
        var cx = (int)Math.Floor(center.X);
        var cy = (int)Math.Floor(center.Y);
        var cz = (int)Math.Floor(center.Z);
        var r = (int)Math.Ceiling(radius);

        var destroyedPositions = new List<(int x, int y, int z, uint oldData)>();

        for (int x = cx - r; x <= cx + r; x++)
        {
            for (int y = cy - r; y <= cy + r; y++)
            {
                for (int z = cz - r; z <= cz + r; z++)
                {
                    var dx = x - center.X;
                    var dy = y - center.Y;
                    var dz = z - center.Z;
                    var dist = MathF.Sqrt(dx * dx + dy * dy + dz * dz);

                    if (dist > radius) continue;

                    var pos = new Vector3s((short)x, (short)y, (short)z);
                    var block = _world.GetBlock(pos);

                    if (block.Type == BlockType.Air) continue;
                    if (block.Type == BlockType.Bedrock) continue;

                    var resistance = GetBlockResistance(block.Type);
                    var chance = power * (1f - dist / radius) / resistance;

                    if (Random.Shared.NextDouble() < chance)
                    {
                        destroyedPositions.Add((x, y, z, block.ToPacked()));
                        _world.SetBlock(pos, new Block(BlockType.Air));
                    }
                }
            }
        }

        foreach (var (x, y, z, oldData) in destroyedPositions)
        {
            if (!string.IsNullOrEmpty(sourcePlayer))
            {
                _rollback.RecordChange(x, y, z, oldData, Block.Air.ToPacked(), sourcePlayer, "explosion");
            }
            OnBlockDamaged?.Invoke(x, y, z, (ushort)(oldData & 0xFFFF), 0);

            if (Random.Shared.NextDouble() < 0.3)
            {
                var dropPos = new Vector3(x + 0.5f, y + 0.5f, z + 0.5f);
                var blockType = (BlockType)(oldData & 0xFFFF);
                var dropItem = GetBlockDropItem(blockType);
                if (!string.IsNullOrEmpty(dropItem))
                {
                    var entity = new ItemEntity(dropItem, 1, dropPos);
                    entity.Velocity = new Vector3(
                        (Random.Shared.NextSingle() - 0.5f) * 4,
                        Random.Shared.NextSingle() * 5 + 2,
                        (Random.Shared.NextSingle() - 0.5f) * 4);
                    _entityManager.Add(entity);
                }
            }
        }

        var nearbyEntities = _entityManager.GetAll()
            .Where(e => e.IsAlive && Vector3.Distance(e.Position, center) <= radius * 1.5f);

        foreach (var entity in nearbyEntities)
        {
            var dist = Vector3.Distance(entity.Position, center);
            var damage = power * (1f - dist / (radius * 1.5f)) * 2f;
            if (damage > 0)
            {
                OnEntityDamaged?.Invoke(entity, damage, center);
            }
        }
    }

    public void DamageEntitiesFromExplosion(Vector3 center, float radius, float power, IEnumerable<PlayerEnt> players)
    {
        foreach (var player in players)
        {
            if (player.IsDead || player.Invulnerable) continue;

            var dist = Vector3.Distance(player.Position, center);
            if (dist > radius * 2f) continue;

            var damage = power * (1f - dist / (radius * 2f)) * 3f;
            if (damage > 0)
            {
                OnPlayerDamaged?.Invoke(player, damage, center);
            }
        }
    }

    private static float GetBlockResistance(BlockType type)
    {
        return type switch
        {
            BlockType.Stone or BlockType.Cobblestone => 6f,
            BlockType.Deepslate => 9f,
            BlockType.CoalOre => 5f,
            BlockType.GoldOre => 8f,
            BlockType.Water or BlockType.WaterFlowing => 100f,
            BlockType.Lava or BlockType.LavaFlowing => 100f,
            _ => 3f
        };
    }

    private static string? GetBlockDropItem(BlockType type)
    {
        return type switch
        {
            BlockType.Stone => "cobblestone",
            BlockType.CoalOre => "coal",
            BlockType.Grass => "dirt",
            _ => null
        };
    }
}
