using System.Text.Json;
using Microsoft.Data.Sqlite;

namespace WebGameServer.Core.Player;

public class PlayerDatabase
{
    private readonly string _connectionString;

    public PlayerDatabase(string dbPath)
    {
        _connectionString = $"Data Source={dbPath}";
        Initialize();
    }

    private void Initialize()
    {
        using var connection = new SqliteConnection(_connectionString);
        connection.Open();
        var cmd = connection.CreateCommand();
        cmd.CommandText = @"
            CREATE TABLE IF NOT EXISTS players (
                name TEXT PRIMARY KEY,
                position_x REAL DEFAULT 0,
                position_y REAL DEFAULT 0,
                position_z REAL DEFAULT 0,
                yaw REAL DEFAULT 0,
                pitch REAL DEFAULT 0,
                health REAL DEFAULT 20,
                max_health REAL DEFAULT 20,
                breath REAL DEFAULT 10,
                food_level REAL DEFAULT 20,
                food_saturation REAL DEFAULT 5,
                total_experience INTEGER DEFAULT 0,
                experience_level INTEGER DEFAULT 0,
                game_mode INTEGER DEFAULT 0,
                inventory_json TEXT,
                armor_json TEXT,
                selected_hotbar_slot INTEGER DEFAULT 0,
                last_ground_y REAL DEFAULT 0,
                last_login TEXT,
                last_save TEXT
            )";
        cmd.ExecuteNonQuery();
    }

    public void SavePlayer(Player player)
    {
        using var connection = new SqliteConnection(_connectionString);
        connection.Open();
        var cmd = connection.CreateCommand();
        cmd.CommandText = @"
            INSERT OR REPLACE INTO players 
            (name, position_x, position_y, position_z, yaw, pitch, health, max_health, breath,
             food_level, food_saturation, total_experience, experience_level, game_mode,
             inventory_json, armor_json, selected_hotbar_slot, last_ground_y, last_save)
            VALUES 
            ($name, $px, $py, $pz, $yaw, $pitch, $health, $maxHealth, $breath,
             $food, $saturation, $totalExp, $expLevel, $gameMode,
             $inventory, $armor, $hotbar, $lastGroundY, $lastSave)";
        cmd.Parameters.AddWithValue("$name", player.Name);
        cmd.Parameters.AddWithValue("$px", player.Position.X);
        cmd.Parameters.AddWithValue("$py", player.Position.Y);
        cmd.Parameters.AddWithValue("$pz", player.Position.Z);
        cmd.Parameters.AddWithValue("$yaw", player.Yaw);
        cmd.Parameters.AddWithValue("$pitch", player.Pitch);
        cmd.Parameters.AddWithValue("$health", player.Health);
        cmd.Parameters.AddWithValue("$maxHealth", player.MaxHealth);
        cmd.Parameters.AddWithValue("$breath", player.Breath);
        cmd.Parameters.AddWithValue("$food", player.FoodLevel);
        cmd.Parameters.AddWithValue("$saturation", player.FoodSaturation);
        cmd.Parameters.AddWithValue("$totalExp", player.TotalExperience);
        cmd.Parameters.AddWithValue("$expLevel", player.ExperienceLevel);
        cmd.Parameters.AddWithValue("$gameMode", (int)player.Mode);
        cmd.Parameters.AddWithValue("$inventory", SerializeInventory(player.Inventory));
        cmd.Parameters.AddWithValue("$armor", SerializeArmor(player.ArmorSlots));
        cmd.Parameters.AddWithValue("$hotbar", player.SelectedHotbarSlot);
        cmd.Parameters.AddWithValue("$lastGroundY", player.LastGroundY);
        cmd.Parameters.AddWithValue("$lastSave", DateTime.UtcNow.ToString("O"));
        cmd.ExecuteNonQuery();
    }

    public void LoadPlayer(Player player)
    {
        using var connection = new SqliteConnection(_connectionString);
        connection.Open();
        var cmd = connection.CreateCommand();
        cmd.CommandText = @"
            SELECT position_x, position_y, position_z, yaw, pitch, health, max_health, breath,
                   food_level, food_saturation, total_experience, experience_level, game_mode,
                   inventory_json, armor_json, selected_hotbar_slot, last_ground_y
            FROM players WHERE name = $name";
        cmd.Parameters.AddWithValue("$name", player.Name);
        using var reader = cmd.ExecuteReader();
        if (!reader.Read()) return;

        player.Position = new Vector3(reader.GetFloat(0), reader.GetFloat(1), reader.GetFloat(2));
        player.Yaw = reader.GetFloat(3);
        player.Pitch = reader.GetFloat(4);
        player.Health = reader.GetFloat(5);
        player.MaxHealth = reader.GetFloat(6);
        player.Breath = reader.GetFloat(7);
        player.FoodLevel = reader.GetFloat(8);
        player.FoodSaturation = reader.GetFloat(9);
        player.TotalExperience = reader.GetInt32(10);
        player.ExperienceLevel = reader.GetInt32(11);
        player.Mode = (GameMode)reader.GetInt32(12);
        player.SelectedHotbarSlot = reader.GetInt32(15);
        player.LastGroundY = reader.GetFloat(16);

        if (!reader.IsDBNull(13))
        {
            DeserializeInventory(reader.GetString(13), player.Inventory);
        }
        if (!reader.IsDBNull(14))
        {
            DeserializeArmor(reader.GetString(14), player.ArmorSlots);
        }

        var updateLoginCmd = connection.CreateCommand();
        updateLoginCmd.CommandText = "UPDATE players SET last_login = $login WHERE name = $name";
        updateLoginCmd.Parameters.AddWithValue("$login", DateTime.UtcNow.ToString("O"));
        updateLoginCmd.Parameters.AddWithValue("$name", player.Name);
        updateLoginCmd.ExecuteNonQuery();
    }

    public bool PlayerExists(string name)
    {
        using var connection = new SqliteConnection(_connectionString);
        connection.Open();
        var cmd = connection.CreateCommand();
        cmd.CommandText = "SELECT COUNT(1) FROM players WHERE name = $name";
        cmd.Parameters.AddWithValue("$name", name);
        var count = Convert.ToInt32(cmd.ExecuteScalar());
        return count > 0;
    }

    private static string SerializeInventory(Inventory inventory)
    {
        var items = inventory.GetAll().Select(i => i == null ? null : new { i.ItemId, i.Count, i.Metadata }).ToArray();
        return JsonSerializer.Serialize(items);
    }

    private static void DeserializeInventory(string json, Inventory inventory)
    {
        var items = JsonSerializer.Deserialize<ItemStack?[]>(json);
        if (items == null) return;
        for (int i = 0; i < Math.Min(items.Length, inventory.Size); i++)
        {
            inventory[i] = items[i];
        }
    }

    private static string SerializeArmor(ItemStack?[] armorSlots)
    {
        var items = armorSlots.Select(i => i == null ? null : new { i.ItemId, i.Count, i.Metadata }).ToArray();
        return JsonSerializer.Serialize(items);
    }

    private static void DeserializeArmor(string json, ItemStack?[] armorSlots)
    {
        var items = JsonSerializer.Deserialize<ItemStack?[]>(json);
        if (items == null) return;
        for (int i = 0; i < Math.Min(items.Length, armorSlots.Length); i++)
        {
            armorSlots[i] = items[i];
        }
    }
}
