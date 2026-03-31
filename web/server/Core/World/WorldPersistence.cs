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

            var x = int.Parse(parts[0]);
            var y = int.Parse(parts[1]);
            var z = int.Parse(parts[2]);
            var data = File.ReadAllBytes(file);

            var coord = new ChunkCoord(x, y, z);
            var chunk = world.GetChunk(coord);
            chunk.Deserialize(data);
        }
    }
}
