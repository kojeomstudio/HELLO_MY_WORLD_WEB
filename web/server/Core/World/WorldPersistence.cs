namespace WebGameServer.Core.World;

public static class WorldPersistence
{
    public static void SaveWorld(World world, string directory)
    {
        Directory.CreateDirectory(directory);
        foreach (var chunkCoord in world.GetLoadedChunks())
        {
            var chunk = world.GetChunkIfExists(chunkCoord);
            if (chunk == null) continue;

            var fileName = Path.Combine(directory, $"{chunkCoord.X}_{chunkCoord.Y}_{chunkCoord.Z}.chunk");
            var data = chunk.Serialize();
            File.WriteAllBytes(fileName, data);
        }
    }

    public static void LoadWorld(World world, string directory)
    {
        if (!Directory.Exists(directory)) return;

        foreach (var file in Directory.GetFiles(directory, "*.chunk"))
        {
            var name = Path.GetFileNameWithoutExtension(file);
            var parts = name.Split('_');
            if (parts.Length != 3) continue;

            if (!int.TryParse(parts[0], out var x) ||
                !int.TryParse(parts[1], out var y) ||
                !int.TryParse(parts[2], out var z)) continue;

            byte[] data;
            try { data = File.ReadAllBytes(file); }
            catch { continue; }

            if (data.Length == 0) continue;

            var coord = new ChunkCoord(x, y, z);
            var chunk = world.GetChunk(coord);
            chunk.Deserialize(data);
        }
    }
}
