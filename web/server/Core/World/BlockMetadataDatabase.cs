using System.Text.Json;
using Microsoft.Data.Sqlite;
using WebGameServer.Core.Player;

namespace WebGameServer.Core.World;

public class BlockMetadataDatabase
{
    private readonly string _connectionString;

    public BlockMetadataDatabase(string dbPath)
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
            CREATE TABLE IF NOT EXISTS chest_inventories (
                pos_key TEXT PRIMARY KEY,
                items_json TEXT NOT NULL
            );
            CREATE TABLE IF NOT EXISTS furnace_operations (
                pos_key TEXT PRIMARY KEY,
                input_item_id TEXT NOT NULL,
                result_item_id TEXT NOT NULL,
                cook_time REAL NOT NULL,
                progress REAL NOT NULL,
                connection_id TEXT
            );
            CREATE TABLE IF NOT EXISTS node_timers (
                x INTEGER, y INTEGER, z INTEGER,
                block_name TEXT,
                expiration REAL,
                PRIMARY KEY (x, y, z)
            )";
        cmd.ExecuteNonQuery();
    }

    public void SaveChestInventory(string posKey, ItemStack?[] items)
    {
        using var connection = new SqliteConnection(_connectionString);
        connection.Open();
        var cmd = connection.CreateCommand();
        cmd.CommandText = @"
            INSERT OR REPLACE INTO chest_inventories (pos_key, items_json)
            VALUES ($posKey, $json)";
        cmd.Parameters.AddWithValue("$posKey", posKey);
        cmd.Parameters.AddWithValue("$json", JsonSerializer.Serialize(
            items.Select(i => i == null ? null : new { i.ItemId, i.Count, i.Metadata }).ToArray()));
        cmd.ExecuteNonQuery();
    }

    public ItemStack?[] LoadChestInventory(string posKey)
    {
        using var connection = new SqliteConnection(_connectionString);
        connection.Open();
        var cmd = connection.CreateCommand();
        cmd.CommandText = "SELECT items_json FROM chest_inventories WHERE pos_key = $posKey";
        cmd.Parameters.AddWithValue("$posKey", posKey);
        var result = cmd.ExecuteScalar();
        if (result == null) return new ItemStack?[27];
        var items = JsonSerializer.Deserialize<ItemStack?[]>(result.ToString()!);
        if (items == null) return new ItemStack?[27];
        return items;
    }

    public void DeleteChestInventory(string posKey)
    {
        using var connection = new SqliteConnection(_connectionString);
        connection.Open();
        var cmd = connection.CreateCommand();
        cmd.CommandText = "DELETE FROM chest_inventories WHERE pos_key = $posKey";
        cmd.Parameters.AddWithValue("$posKey", posKey);
        cmd.ExecuteNonQuery();
    }

    public void SaveFurnaceOperation(string posKey, FurnaceOperation operation)
    {
        using var connection = new SqliteConnection(_connectionString);
        connection.Open();
        var cmd = connection.CreateCommand();
        cmd.CommandText = @"
            INSERT OR REPLACE INTO furnace_operations (pos_key, input_item_id, result_item_id, cook_time, progress, connection_id)
            VALUES ($posKey, $input, $result, $cookTime, $progress, $connId)";
        cmd.Parameters.AddWithValue("$posKey", posKey);
        cmd.Parameters.AddWithValue("$input", operation.InputItemId);
        cmd.Parameters.AddWithValue("$result", operation.ResultItemId);
        cmd.Parameters.AddWithValue("$cookTime", operation.CookTime);
        cmd.Parameters.AddWithValue("$progress", operation.Progress);
        cmd.Parameters.AddWithValue("$connId", (string?)operation.ConnectionId);
        cmd.ExecuteNonQuery();
    }

    public FurnaceOperation? LoadFurnaceOperation(string posKey)
    {
        using var connection = new SqliteConnection(_connectionString);
        connection.Open();
        var cmd = connection.CreateCommand();
        cmd.CommandText = "SELECT input_item_id, result_item_id, cook_time, progress, connection_id FROM furnace_operations WHERE pos_key = $posKey";
        cmd.Parameters.AddWithValue("$posKey", posKey);
        using var reader = cmd.ExecuteReader();
        if (!reader.Read()) return null;
        return new FurnaceOperation(
            reader.GetString(0),
            reader.GetString(1),
            reader.GetFloat(2),
            reader.GetFloat(3),
            reader.IsDBNull(4) ? string.Empty : reader.GetString(4));
    }

    public void DeleteFurnaceOperation(string posKey)
    {
        using var connection = new SqliteConnection(_connectionString);
        connection.Open();
        var cmd = connection.CreateCommand();
        cmd.CommandText = "DELETE FROM furnace_operations WHERE pos_key = $posKey";
        cmd.Parameters.AddWithValue("$posKey", posKey);
        cmd.ExecuteNonQuery();
    }

    public void SaveAllNodeTimers(List<(int X, int Y, int Z, string BlockName, double Expiration)> timers)
    {
        using var connection = new SqliteConnection(_connectionString);
        connection.Open();
        using var transaction = connection.BeginTransaction();
        var deleteCmd = connection.CreateCommand();
        deleteCmd.CommandText = "DELETE FROM node_timers";
        deleteCmd.ExecuteNonQuery();

        foreach (var (x, y, z, blockName, expiration) in timers)
        {
            var cmd = connection.CreateCommand();
            cmd.CommandText = "INSERT INTO node_timers (x, y, z, block_name, expiration) VALUES ($x, $y, $z, $bn, $exp)";
            cmd.Parameters.AddWithValue("$x", x);
            cmd.Parameters.AddWithValue("$y", y);
            cmd.Parameters.AddWithValue("$z", z);
            cmd.Parameters.AddWithValue("$bn", blockName);
            cmd.Parameters.AddWithValue("$exp", expiration);
            cmd.ExecuteNonQuery();
        }

        transaction.Commit();
    }

    public List<(int X, int Y, int Z, string BlockName, double Expiration)> LoadNodeTimers()
    {
        var results = new List<(int, int, int, string, double)>();
        using var connection = new SqliteConnection(_connectionString);
        connection.Open();
        var cmd = connection.CreateCommand();
        cmd.CommandText = "SELECT x, y, z, block_name, expiration FROM node_timers";
        using var reader = cmd.ExecuteReader();
        while (reader.Read())
        {
            results.Add((reader.GetInt32(0), reader.GetInt32(1), reader.GetInt32(2),
                reader.GetString(3), reader.GetDouble(4)));
        }
        return results;
    }
}
