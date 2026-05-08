namespace WebGameServer.Core.World.Generators;

public enum AdvancedOreType
{
    Scatter,
    Sheet,
    Blob,
    Puff,
    Stratum,
    Vein
}

public record AdvancedOreParams(
    string Name,
    AdvancedOreType OreType,
    ushort OreBlockId,
    int YMin,
    int YMax,
    NoiseParams Noise,
    float Threshold,
    int ClustSize,
    float ClustRadius,
    int SheetThickness,
    float PuffUpperBound,
    float PuffLowerBound,
    int StratumYMin,
    int StratumYMax,
    string[] Biomes);

public class AdvancedOrePlacer
{
    private readonly List<AdvancedOreParams> _ores = new();
    private readonly Dictionary<string, PerlinNoise> _noiseInstances = new();

    private const int ChunkSize = 16;

    public void RegisterOre(AdvancedOreParams ore)
    {
        _ores.Add(ore);
        if (!_noiseInstances.ContainsKey(ore.Name))
            _noiseInstances[ore.Name] = new PerlinNoise(ore.Noise.Seed);
    }

    public void PlaceOres(ushort[,,] blocks, int baseX, int baseY, int baseZ,
        Func<int, int, int, string?>? getBiomeAt = null)
    {
        foreach (var ore in _ores)
        {
            switch (ore.OreType)
            {
                case AdvancedOreType.Scatter:
                    PlaceScatterOre(blocks, baseX, baseY, baseZ, ore, getBiomeAt);
                    break;
                case AdvancedOreType.Sheet:
                    PlaceSheetOre(blocks, baseX, baseY, baseZ, ore, getBiomeAt);
                    break;
                case AdvancedOreType.Blob:
                    PlaceBlobOre(blocks, baseX, baseY, baseZ, ore, getBiomeAt);
                    break;
                case AdvancedOreType.Puff:
                    PlacePuffOre(blocks, baseX, baseY, baseZ, ore, getBiomeAt);
                    break;
                case AdvancedOreType.Stratum:
                    PlaceStratumOre(blocks, baseX, baseY, baseZ, ore, getBiomeAt);
                    break;
                case AdvancedOreType.Vein:
                    PlaceVeinOre(blocks, baseX, baseY, baseZ, ore, getBiomeAt);
                    break;
            }
        }
    }

    private void PlaceScatterOre(ushort[,,] blocks, int baseX, int baseY, int baseZ,
        AdvancedOreParams ore, Func<int, int, int, string?>? getBiomeAt)
    {
        var rng = new Random(ore.Noise.Seed ^ (baseX * 73856093) ^ (baseZ * 19349663) ^ (baseY * 83492791));
        var clustSize = Math.Max(1, ore.ClustSize);

        for (int i = 0; i < clustSize; i++)
        {
            var cx = rng.Next(0, ChunkSize);
            var cy = rng.Next(0, ChunkSize);
            var cz = rng.Next(0, ChunkSize);
            var worldY = baseY + cy;

            if (worldY < ore.YMin || worldY > ore.YMax) continue;

            if (ore.Biomes.Length > 0 && getBiomeAt != null)
            {
                var biome = getBiomeAt(baseX + cx, worldY, baseZ + cz);
                if (biome == null || !ore.Biomes.Contains(biome)) continue;
            }

            var scatterRadius = Math.Max(1, (int)MathF.Ceiling(ore.ClustRadius));
            for (int dx = -scatterRadius; dx <= scatterRadius; dx++)
            {
                for (int dy = -scatterRadius; dy <= scatterRadius; dy++)
                {
                    for (int dz = -scatterRadius; dz <= scatterRadius; dz++)
                    {
                        var distSq = dx * dx + dy * dy + dz * dz;
                        if (distSq > scatterRadius * scatterRadius) continue;

                        var bx = cx + dx;
                        var by = cy + dy;
                        var bz = cz + dz;

                        if (bx < 0 || bx >= ChunkSize || by < 0 || by >= ChunkSize
                            || bz < 0 || bz >= ChunkSize) continue;

                        if (rng.NextDouble() > ore.Threshold) continue;

                        if (IsReplaceable(blocks[bx, by, bz]))
                            blocks[bx, by, bz] = ore.OreBlockId;
                    }
                }
            }
        }
    }

    private void PlaceVeinOre(ushort[,,] blocks, int baseX, int baseY, int baseZ,
        AdvancedOreParams ore, Func<int, int, int, string?>? getBiomeAt)
    {
        var noise = _noiseInstances[ore.Name];
        var rng = new Random(ore.Noise.Seed ^ (baseX * 73856093) ^ (baseZ * 19349663));

        var numVeins = Math.Max(1, ore.ClustSize);
        var veinLength = Math.Max(3, (int)ore.ClustRadius);

        for (int v = 0; v < numVeins; v++)
        {
            var cx = rng.Next(2, ChunkSize - 2);
            var cy = rng.Next(2, ChunkSize - 2);
            var cz = rng.Next(2, ChunkSize - 2);

            if (baseY + cy < ore.YMin || baseY + cy > ore.YMax) continue;

            if (ore.Biomes.Length > 0 && getBiomeAt != null)
            {
                var biome = getBiomeAt(baseX + cx, baseY + cy, baseZ + cz);
                if (biome == null || !ore.Biomes.Contains(biome)) continue;
            }

            var dx = (float)(rng.NextDouble() * 2 - 1);
            var dy = (float)(rng.NextDouble() * 0.6 - 0.3);
            var dz = (float)(rng.NextDouble() * 2 - 1);
            var len = MathF.Sqrt(dx * dx + dy * dy + dz * dz);
            if (len > 0.001f) { dx /= len; dy /= len; dz /= len; }

            for (int step = 0; step < veinLength; step++)
            {
                var px = (int)MathF.Round(cx + dx * step);
                var py = (int)MathF.Round(cy + dy * step);
                var pz = (int)MathF.Round(cz + dz * step);

                dx += (float)(rng.NextDouble() - 0.5) * 0.4f;
                dy += (float)(rng.NextDouble() - 0.5) * 0.2f;
                dz += (float)(rng.NextDouble() - 0.5) * 0.4f;
                len = MathF.Sqrt(dx * dx + dy * dy + dz * dz);
                if (len > 0.001f) { dx /= len; dy /= len; dz /= len; }

                var worldY = baseY + py;
                if (worldY < ore.YMin || worldY > ore.YMax) continue;

                for (var ox = -1; ox <= 1; ox++)
                {
                    for (var oy = -1; oy <= 1; oy++)
                    {
                        for (var oz = -1; oz <= 1; oz++)
                        {
                            var bx = px + ox;
                            var by = py + oy;
                            var bz = pz + oz;

                            if (bx < 0 || bx >= ChunkSize || by < 0 || by >= ChunkSize
                                || bz < 0 || bz >= ChunkSize) continue;

                            var nVal = noise.Noise3DEx(ore.Noise,
                                baseX + bx, baseY + by, baseZ + bz);
                            if (nVal < ore.Threshold) continue;

                            if (IsReplaceable(blocks[bx, by, bz]))
                                blocks[bx, by, bz] = ore.OreBlockId;
                        }
                    }
                }
            }
        }
    }

    private void PlaceSheetOre(ushort[,,] blocks, int baseX, int baseY, int baseZ,
        AdvancedOreParams ore, Func<int, int, int, string?>? getBiomeAt)
    {
        var noise = _noiseInstances[ore.Name];

        for (int x = 0; x < ChunkSize; x++)
        {
            for (int z = 0; z < ChunkSize; z++)
            {
                var worldX = baseX + x;
                var worldZ = baseZ + z;

                var noiseVal = noise.Noise2DEx(ore.Noise, worldX, worldZ);
                if (noiseVal < ore.Threshold) continue;

                for (int y = 0; y < ChunkSize; y++)
                {
                    var worldY = baseY + y;
                    if (worldY < ore.YMin || worldY > ore.YMax) continue;

                    if (ore.Biomes.Length > 0 && getBiomeAt != null)
                    {
                        var biome = getBiomeAt(worldX, worldY, worldZ);
                        if (biome == null || !ore.Biomes.Contains(biome)) continue;
                    }

                    var thicknessNoise = noise.Noise3DEx(ore.Noise, worldX, worldY, worldZ);
                    var effectiveThickness = Math.Max(1, ore.SheetThickness);
                    if (MathF.Abs(thicknessNoise) > effectiveThickness * 0.5f) continue;

                    if (IsReplaceable(blocks[x, y, z]))
                        blocks[x, y, z] = ore.OreBlockId;
                }
            }
        }
    }

    private void PlaceBlobOre(ushort[,,] blocks, int baseX, int baseY, int baseZ,
        AdvancedOreParams ore, Func<int, int, int, string?>? getBiomeAt)
    {
        var noise = _noiseInstances[ore.Name];
        var rng = new Random(ore.Noise.Seed ^ (baseX * 73856093) ^ (baseZ * 19349663));

        var numBlobs = Math.Max(1, ore.ClustSize);
        var radius = Math.Max(1f, ore.ClustRadius);

        for (int i = 0; i < numBlobs; i++)
        {
            var cx = rng.Next(0, ChunkSize);
            var cy = rng.Next(0, ChunkSize);
            var cz = rng.Next(0, ChunkSize);
            var worldY = baseY + cy;

            if (worldY < ore.YMin || worldY > ore.YMax) continue;

            if (ore.Biomes.Length > 0 && getBiomeAt != null)
            {
                var biome = getBiomeAt(baseX + cx, worldY, baseZ + cz);
                if (biome == null || !ore.Biomes.Contains(biome)) continue;
            }

            var blobRadius = radius * (0.5f + (float)rng.NextDouble() * 0.5f);
            var blobR = (int)MathF.Ceiling(blobRadius);

            for (int dx = -blobR; dx <= blobR; dx++)
            {
                for (int dy = -blobR; dy <= blobR; dy++)
                {
                    for (int dz = -blobR; dz <= blobR; dz++)
                    {
                        var distSq = dx * dx + dy * dy + dz * dz;
                        if (distSq > blobRadius * blobRadius) continue;

                        var bx = cx + dx;
                        var by = cy + dy;
                        var bz = cz + dz;

                        if (bx < 0 || bx >= ChunkSize || by < 0 || by >= ChunkSize
                            || bz < 0 || bz >= ChunkSize) continue;

                        var noiseVal = noise.Noise3DEx(ore.Noise,
                            baseX + bx, baseY + by, baseZ + bz);

                        if (noiseVal < ore.Threshold) continue;

                        if (IsReplaceable(blocks[bx, by, bz]))
                            blocks[bx, by, bz] = ore.OreBlockId;
                    }
                }
            }
        }
    }

    private void PlacePuffOre(ushort[,,] blocks, int baseX, int baseY, int baseZ,
        AdvancedOreParams ore, Func<int, int, int, string?>? getBiomeAt)
    {
        var noise = _noiseInstances[ore.Name];

        for (int x = 0; x < ChunkSize; x++)
        {
            for (int y = 0; y < ChunkSize; y++)
            {
                for (int z = 0; z < ChunkSize; z++)
                {
                    var worldX = baseX + x;
                    var worldY = baseY + y;
                    var worldZ = baseZ + z;

                    if (worldY < ore.YMin || worldY > ore.YMax) continue;

                    var noiseVal = noise.Noise3DEx(ore.Noise, worldX, worldY, worldZ);

                    var yNorm = (float)(worldY - ore.YMin) / Math.Max(ore.YMax - ore.YMin, 1);
                    var upperBound = ore.PuffUpperBound;
                    var lowerBound = ore.PuffLowerBound;

                    var puffValue = noiseVal * (1f - MathF.Abs(yNorm - 0.5f) * 2f);
                    if (puffValue < lowerBound || puffValue > upperBound) continue;

                    if (ore.Biomes.Length > 0 && getBiomeAt != null)
                    {
                        var biome = getBiomeAt(worldX, worldY, worldZ);
                        if (biome == null || !ore.Biomes.Contains(biome)) continue;
                    }

                    if (IsReplaceable(blocks[x, y, z]))
                        blocks[x, y, z] = ore.OreBlockId;
                }
            }
        }
    }

    private void PlaceStratumOre(ushort[,,] blocks, int baseX, int baseY, int baseZ,
        AdvancedOreParams ore, Func<int, int, int, string?>? getBiomeAt)
    {
        var noise = _noiseInstances[ore.Name];
        var stratumMin = Math.Max(ore.StratumYMin, ore.YMin);
        var stratumMax = Math.Min(ore.StratumYMax, ore.YMax);

        for (int x = 0; x < ChunkSize; x++)
        {
            for (int z = 0; z < ChunkSize; z++)
            {
                var worldX = baseX + x;
                var worldZ = baseZ + z;

                var noiseVal = noise.Noise2DEx(ore.Noise, worldX, worldZ);
                if (noiseVal < ore.Threshold) continue;

                var center = (stratumMin + stratumMax) / 2;
                var halfRange = (stratumMax - stratumMin) / 2;
                var yOffset = (int)(noiseVal * halfRange);
                var stratumY = center + yOffset;

                if (ore.Biomes.Length > 0 && getBiomeAt != null)
                {
                    var biome = getBiomeAt(worldX, stratumY, worldZ);
                    if (biome == null || !ore.Biomes.Contains(biome)) continue;
                }

                for (int dy = 0; dy < Math.Max(1, ore.SheetThickness); dy++)
                {
                    var placeY = stratumY + dy;
                    var localY = placeY - baseY;
                    if (localY < 0 || localY >= ChunkSize) continue;
                    if (placeY < ore.YMin || placeY > ore.YMax) continue;

                    if (IsReplaceable(blocks[x, localY, z]))
                        blocks[x, localY, z] = ore.OreBlockId;
                }
            }
        }
    }

    private static bool IsReplaceable(ushort blockType)
    {
        if (blockType == (ushort)BlockType.Air) return false;
        if (blockType == (ushort)BlockType.Water) return false;
        if (blockType == (ushort)BlockType.Bedrock) return false;
        return true;
    }
}
