namespace WebGameServer.Core.World;

public static class WorldBackup
{
    private static readonly string BackupDir = "data/backups";
    private static int MaxBackups = 5;

    public static string? CreateBackup(string worldDir)
    {
        try
        {
            Directory.CreateDirectory(BackupDir);
            var timestamp = DateTime.UtcNow.ToString("yyyyMMdd_HHmmss");
            var backupPath = Path.Combine(BackupDir, $"world_{timestamp}");

            if (Directory.Exists(worldDir))
            {
                CopyDirectory(worldDir, backupPath);
            }

            CleanupOldBackups();
            return backupPath;
        }
        catch
        {
            return null;
        }
    }

    public static List<string> ListBackups()
    {
        if (!Directory.Exists(BackupDir)) return new();
        return Directory.GetDirectories(BackupDir)
            .OrderByDescending(d => d)
            .Take(MaxBackups)
            .ToList();
    }

    public static bool RestoreBackup(string backupPath, string worldDir)
    {
        try
        {
            if (!Directory.Exists(backupPath)) return false;
            if (Directory.Exists(worldDir))
            {
                Directory.Delete(worldDir, true);
            }
            CopyDirectory(backupPath, worldDir);
            return true;
        }
        catch
        {
            return false;
        }
    }

    private static void CleanupOldBackups()
    {
        if (!Directory.Exists(BackupDir)) return;
        var dirs = Directory.GetDirectories(BackupDir)
            .OrderByDescending(d => d)
            .ToList();
        foreach (var dir in dirs.Skip(MaxBackups))
        {
            try { Directory.Delete(dir, true); } catch { }
        }
    }

    private static void CopyDirectory(string src, string dst)
    {
        Directory.CreateDirectory(dst);
        foreach (var file in Directory.GetFiles(src))
        {
            File.Copy(file, Path.Combine(dst, Path.GetFileName(file)), true);
        }
        foreach (var dir in Directory.GetDirectories(src))
        {
            CopyDirectory(dir, Path.Combine(dst, Path.GetFileName(dir)));
        }
    }
}
