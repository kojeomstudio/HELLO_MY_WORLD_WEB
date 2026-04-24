namespace WebGameServer.Core.World;

public static class LightingEngine
{
    public const byte MaxLight = 15;

    private static readonly (short dx, short dy, short dz)[] Neighbors =
    {
        (1, 0, 0), (-1, 0, 0), (0, 1, 0), (0, -1, 0), (0, 0, 1), (0, 0, -1)
    };

    public static byte PackLight(byte sunLight, byte artificialLight)
        => (byte)((sunLight << 4) | artificialLight);

    public static byte GetSunLight(byte packed)
        => (byte)((packed >> 4) & 0xF);

    public static byte GetArtificialLight(byte packed)
        => (byte)(packed & 0xF);

    public static byte CalculateFinalLight(byte packed)
        => Math.Max(GetSunLight(packed), GetArtificialLight(packed));

    public static int GetEmissionLevel(BlockType type) => type switch
    {
        BlockType.Torch => 14,
        BlockType.Lava => 14,
        BlockType.LavaFlowing => 14,
        BlockType.GlowingObsidian => 14,
        BlockType.JackOLantern => 15,
        BlockType.SeaLantern => 15,
        BlockType.Glowstone => 15,
        BlockType.RedstoneLampOn => 12,
        BlockType.Fire => 15,
        BlockType.SoulTorch => 10,
        BlockType.Lantern => 15,
        BlockType.Campfire => 15,
        BlockType.SoulCampfire => 10,
        _ => 0
    };

    private static bool IsTransparentType(BlockType type) => type switch
    {
        BlockType.Air => true,
        BlockType.Leaves => true,
        BlockType.JungleLeaves => true,
        BlockType.PineNeedles => true,
        BlockType.Glass => true,
        BlockType.Water => true,
        BlockType.WaterFlowing => true,
        BlockType.RiverWater => true,
        BlockType.RiverWaterFlowing => true,
        BlockType.Lava => true,
        BlockType.LavaFlowing => true,
        BlockType.Torch => true,
        BlockType.SoulTorch => true,
        BlockType.Ladder => true,
        BlockType.Fence => true,
        BlockType.DoorWood => true,
        BlockType.SugarCane => true,
        BlockType.SugarCaneBlock => true,
        BlockType.Ice => true,
        BlockType.TallGrass => true,
        BlockType.FlowerRed => true,
        BlockType.FlowerYellow => true,
        BlockType.FlowerRose => true,
        BlockType.FlowerTulip => true,
        BlockType.DeadBush => true,
        BlockType.JungleGrass => true,
        BlockType.MushroomRedBlock => true,
        BlockType.MushroomBrownBlock => true,
        BlockType.Fire => true,
        BlockType.IronBars => true,
        BlockType.Chain => true,
        BlockType.Cobweb => true,
        BlockType.SnowLayer => true,
        _ => false
    };

    private static bool IsTransparent(Block block) => IsTransparentType(block.Type);

    public static Block? GetBlockSafe(World world, Vector3s pos)
    {
        var coord = ChunkCoord.FromBlockCoord(pos);
        var chunk = world.GetChunkIfExists(coord);
        if (chunk == null) return null;

        var lx = pos.X & (Chunk.Size - 1);
        var ly = pos.Y & (Chunk.Size - 1);
        var lz = pos.Z & (Chunk.Size - 1);
        return chunk.GetBlock(lx, ly, lz);
    }

    private static void SetSunLight(World world, Vector3s pos, byte sunLight)
    {
        var coord = ChunkCoord.FromBlockCoord(pos);
        var chunk = world.GetChunkIfExists(coord);
        if (chunk == null) return;

        var lx = pos.X & (Chunk.Size - 1);
        var ly = pos.Y & (Chunk.Size - 1);
        var lz = pos.Z & (Chunk.Size - 1);
        var block = chunk.GetBlock(lx, ly, lz);
        block.Light = PackLight(sunLight, GetArtificialLight(block.Light));
    }

    private static void SetArtificialLight(World world, Vector3s pos, byte artificialLight)
    {
        var coord = ChunkCoord.FromBlockCoord(pos);
        var chunk = world.GetChunkIfExists(coord);
        if (chunk == null) return;

        var lx = pos.X & (Chunk.Size - 1);
        var ly = pos.Y & (Chunk.Size - 1);
        var lz = pos.Z & (Chunk.Size - 1);
        var block = chunk.GetBlock(lx, ly, lz);
        block.Light = PackLight(GetSunLight(block.Light), artificialLight);
    }

    public static void PropagateSunLight(World world, Chunk chunk)
    {
        var baseX = chunk.Coord.X * Chunk.Size;
        var baseY = chunk.Coord.Y * Chunk.Size;
        var baseZ = chunk.Coord.Z * Chunk.Size;

        for (int lx = 0; lx < Chunk.Size; lx++)
        {
            for (int lz = 0; lz < Chunk.Size; lz++)
            {
                int sunLight = MaxLight;

                var aboveCoord = new ChunkCoord(chunk.Coord.X, chunk.Coord.Y + 1, chunk.Coord.Z);
                var aboveChunk = world.GetChunkIfExists(aboveCoord);
                if (aboveChunk != null)
                {
                    var aboveBlock = aboveChunk.GetBlock(lx, 0, lz);
                    var aboveSun = GetSunLight(aboveBlock.Light);
                    sunLight = aboveSun > 1 ? aboveSun - 1 : 0;
                }

                for (int ly = Chunk.Size - 1; ly >= 0; ly--)
                {
                    if (sunLight <= 0) break;

                    var pos = new Vector3s(
                        (short)(baseX + lx),
                        (short)(baseY + ly),
                        (short)(baseZ + lz));
                    var block = GetBlockSafe(world, pos);
                    if (block == null) break;

                    if (!IsTransparent(block))
                    {
                        SetSunLight(world, pos, 0);
                        sunLight = 0;
                    }
                    else
                    {
                        var currentSun = GetSunLight(block.Light);
                        if ((byte)sunLight > currentSun)
                        {
                            SetSunLight(world, pos, (byte)sunLight);
                        }
                        sunLight--;
                    }
                }
            }
        }

        var queue = new Queue<Vector3s>();
        var visited = new HashSet<Vector3s>();

        for (int lx = 0; lx < Chunk.Size; lx++)
        {
            for (int ly = 0; ly < Chunk.Size; ly++)
            {
                for (int lz = 0; lz < Chunk.Size; lz++)
                {
                    var sunLight = GetSunLight(chunk.GetBlock(lx, ly, lz).Light);
                    if (sunLight > 1)
                    {
                        var pos = new Vector3s(
                            (short)(baseX + lx),
                            (short)(baseY + ly),
                            (short)(baseZ + lz));
                        queue.Enqueue(pos);
                        visited.Add(pos);
                    }
                }
            }
        }

        while (queue.Count > 0)
        {
            var current = queue.Dequeue();
            var currentBlock = GetBlockSafe(world, current);
            if (currentBlock == null) continue;
            var currentSun = GetSunLight(currentBlock.Light);

            foreach (var (dx, dy, dz) in Neighbors)
            {
                var nPos = new Vector3s(
                    (short)(current.X + dx),
                    (short)(current.Y + dy),
                    (short)(current.Z + dz));
                var newSun = (byte)(currentSun - 1);
                if (newSun <= 0) continue;

                var nBlock = GetBlockSafe(world, nPos);
                if (nBlock == null) continue;
                if (!IsTransparent(nBlock)) continue;

                var nSun = GetSunLight(nBlock.Light);
                if (newSun > nSun)
                {
                    SetSunLight(world, nPos, newSun);
                    if (!visited.Contains(nPos))
                    {
                        visited.Add(nPos);
                        queue.Enqueue(nPos);
                    }
                }
            }
        }
    }

    public static void PropagateArtificialLight(World world, ChunkCoord coord, Vector3s position, int lightLevel)
    {
        if (lightLevel <= 0) return;

        var clampedLevel = Math.Min(lightLevel, MaxLight);
        SetArtificialLight(world, position, (byte)clampedLevel);

        var queue = new Queue<(Vector3s pos, int light)>();
        var visited = new HashSet<Vector3s> { position };
        queue.Enqueue((position, clampedLevel));

        while (queue.Count > 0)
        {
            var (current, light) = queue.Dequeue();

            foreach (var (dx, dy, dz) in Neighbors)
            {
                var nPos = new Vector3s(
                    (short)(current.X + dx),
                    (short)(current.Y + dy),
                    (short)(current.Z + dz));
                var newLight = light - 1;
                if (newLight <= 0) continue;
                if (visited.Contains(nPos)) continue;

                var nBlock = GetBlockSafe(world, nPos);
                if (nBlock == null) continue;
                if (!IsTransparent(nBlock)) continue;

                var nArt = GetArtificialLight(nBlock.Light);
                if (newLight > nArt)
                {
                    SetArtificialLight(world, nPos, (byte)newLight);
                    visited.Add(nPos);
                    queue.Enqueue((nPos, newLight));
                }
            }
        }
    }

    public static void RemoveLight(World world, Vector3s position)
    {
        var sourceBlock = GetBlockSafe(world, position);
        if (sourceBlock == null) return;

        var sourceArt = GetArtificialLight(sourceBlock.Light);
        if (sourceArt <= 0) return;

        var removalQueue = new Queue<Vector3s>();
        var removedSet = new HashSet<Vector3s>();
        removalQueue.Enqueue(position);
        removedSet.Add(position);

        while (removalQueue.Count > 0)
        {
            var current = removalQueue.Dequeue();
            var block = GetBlockSafe(world, current);
            if (block == null) continue;

            var currentArt = GetArtificialLight(block.Light);
            var emission = GetEmissionLevel(block.Type);
            SetArtificialLight(world, current, (byte)emission);

            var effectiveLevel = current.Equals(position) ? sourceArt : currentArt;
            if (effectiveLevel <= 1) continue;

            foreach (var (dx, dy, dz) in Neighbors)
            {
                var nPos = new Vector3s(
                    (short)(current.X + dx),
                    (short)(current.Y + dy),
                    (short)(current.Z + dz));
                if (removedSet.Contains(nPos)) continue;

                var nBlock = GetBlockSafe(world, nPos);
                if (nBlock == null) continue;
                if (!IsTransparent(nBlock)) continue;

                var nArt = GetArtificialLight(nBlock.Light);
                if (nArt > 0 && nArt < effectiveLevel)
                {
                    removedSet.Add(nPos);
                    removalQueue.Enqueue(nPos);
                }
            }
        }

        var repropagateQueue = new Queue<(Vector3s pos, int light)>();
        var repropagateVisited = new HashSet<Vector3s>();

        foreach (var pos in removedSet)
        {
            int maxIncoming = 0;

            foreach (var (dx, dy, dz) in Neighbors)
            {
                var nPos = new Vector3s(
                    (short)(pos.X + dx),
                    (short)(pos.Y + dy),
                    (short)(pos.Z + dz));
                var nBlock = GetBlockSafe(world, nPos);
                if (nBlock == null) continue;
                if (!IsTransparent(nBlock)) continue;

                var nArt = GetArtificialLight(nBlock.Light);
                var nEmission = GetEmissionLevel(nBlock.Type);
                maxIncoming = Math.Max(maxIncoming, Math.Max(nArt, nEmission));
            }

            if (maxIncoming <= 0) continue;

            var newLight = maxIncoming - 1;
            var selfBlock = GetBlockSafe(world, pos);
            if (selfBlock == null) continue;
            var selfEmission = GetEmissionLevel(selfBlock.Type);
            newLight = Math.Max(newLight, selfEmission);
            var selfArt = GetArtificialLight(selfBlock.Light);

            if (newLight > selfArt)
            {
                SetArtificialLight(world, pos, (byte)newLight);
                repropagateVisited.Add(pos);
                repropagateQueue.Enqueue((pos, newLight));
            }
        }

        while (repropagateQueue.Count > 0)
        {
            var (current, light) = repropagateQueue.Dequeue();

            foreach (var (dx, dy, dz) in Neighbors)
            {
                var nPos = new Vector3s(
                    (short)(current.X + dx),
                    (short)(current.Y + dy),
                    (short)(current.Z + dz));
                var newLight = light - 1;
                if (newLight <= 0) continue;
                if (repropagateVisited.Contains(nPos)) continue;

                var nBlock = GetBlockSafe(world, nPos);
                if (nBlock == null) continue;
                if (!IsTransparent(nBlock)) continue;

                var nArt = GetArtificialLight(nBlock.Light);
                var nEmission = GetEmissionLevel(nBlock.Type);
                var nEffective = Math.Max(nArt, nEmission);

                if (newLight > nEffective)
                {
                    SetArtificialLight(world, nPos, (byte)newLight);
                    repropagateVisited.Add(nPos);
                    repropagateQueue.Enqueue((nPos, newLight));
                }
            }
        }
    }

    public static byte CalculateLight(World world, Vector3s position)
    {
        var block = GetBlockSafe(world, position);
        if (block == null) return 0;
        return CalculateFinalLight(block.Light);
    }

    public static void OnBlockChanged(World world, Vector3s position, BlockType oldType, BlockType newType)
    {
        var oldEmission = GetEmissionLevel(oldType);
        var newEmission = GetEmissionLevel(newType);
        var oldTransparent = IsTransparentType(oldType);
        var newTransparent = IsTransparentType(newType);

        if (oldEmission == newEmission && oldTransparent == newTransparent)
        {
            return;
        }

        if (oldEmission > 0)
        {
            RemoveLight(world, position);
        }

        var chunkCoord = ChunkCoord.FromBlockCoord(position);
        var chunk = world.GetChunkIfExists(chunkCoord);
        if (chunk != null)
        {
            PropagateSunLight(world, chunk);
        }

        if (newEmission > 0)
        {
            PropagateArtificialLight(world, chunkCoord, position, newEmission);
        }

        if (oldTransparent != newTransparent)
        {
            foreach (var (dx, dy, dz) in Neighbors)
            {
                var nPos = new Vector3s(
                    (short)(position.X + dx),
                    (short)(position.Y + dy),
                    (short)(position.Z + dz));
                var nBlock = GetBlockSafe(world, nPos);
                if (nBlock == null) continue;
                var emission = GetEmissionLevel(nBlock.Type);
                if (emission > 0)
                {
                    var nCoord = ChunkCoord.FromBlockCoord(nPos);
                    PropagateArtificialLight(world, nCoord, nPos, emission);
                }
            }
        }
    }

    internal static void InitializeArtificialLightInChunk(World world, Chunk chunk)
    {
        var baseX = chunk.Coord.X * Chunk.Size;
        var baseY = chunk.Coord.Y * Chunk.Size;
        var baseZ = chunk.Coord.Z * Chunk.Size;

        for (int x = 0; x < Chunk.Size; x++)
        {
            for (int y = 0; y < Chunk.Size; y++)
            {
                for (int z = 0; z < Chunk.Size; z++)
                {
                    var block = chunk.GetBlock(x, y, z);
                    var emission = GetEmissionLevel(block.Type);
                    if (emission > 0)
                    {
                        var worldPos = new Vector3s(
                            (short)(baseX + x),
                            (short)(baseY + y),
                            (short)(baseZ + z));
                        PropagateArtificialLight(world, chunk.Coord, worldPos, emission);
                    }
                }
            }
        }
    }
}
