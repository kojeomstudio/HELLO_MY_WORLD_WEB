using System.Text.Json;

namespace WebGameServer.Core.Smelting;

public class SmeltingSystem
{
    private List<SmeltingRecipe> _recipes = new();
    private Dictionary<string, FuelEntry> _fuels = new(StringComparer.OrdinalIgnoreCase);

    public void LoadRecipes(string filePath)
    {
        if (!File.Exists(filePath)) return;
        var json = File.ReadAllText(filePath);
        var doc = JsonDocument.Parse(json);
        if (!doc.RootElement.TryGetProperty("smeltingRecipes", out var recipesEl)) return;

        _recipes.Clear();
        foreach (var recipeEl in recipesEl.EnumerateArray())
        {
            var input = recipeEl.GetProperty("input").GetString() ?? "";
            var result = recipeEl.GetProperty("result").GetString() ?? "";
            var cookTime = recipeEl.TryGetProperty("cookTime", out var ct) ? ct.GetSingle() : 10.0f;
            var xp = recipeEl.TryGetProperty("experience", out var xpEl) ? xpEl.GetSingle() : 0.1f;

            _recipes.Add(new SmeltingRecipe(input, result, cookTime, xp));
        }

        if (doc.RootElement.TryGetProperty("fuels", out var fuelsEl))
        {
            _fuels.Clear();
            foreach (var fuelEl in fuelsEl.EnumerateArray())
            {
                var item = fuelEl.GetProperty("item").GetString() ?? "";
                var burnTime = fuelEl.TryGetProperty("burnTime", out var bt) ? bt.GetSingle() : 10.0f;
                _fuels[item] = new FuelEntry(item, burnTime);
            }
        }
    }

    public SmeltingRecipe? GetRecipe(string inputId)
    {
        return _recipes.FirstOrDefault(r => r.InputItemId.Equals(inputId, StringComparison.OrdinalIgnoreCase));
    }

    public IReadOnlyList<SmeltingRecipe> GetAllRecipes() => _recipes.AsReadOnly();

    public FuelEntry? GetFuel(string itemId)
    {
        return _fuels.TryGetValue(itemId, out var fuel) ? fuel : null;
    }

    public bool IsFuel(string itemId) => _fuels.ContainsKey(itemId);

    public IReadOnlyDictionary<string, FuelEntry> GetAllFuels() => _fuels;

    public float GetFuelBurnTime(string itemId)
    {
        return _fuels.TryGetValue(itemId, out var fuel) ? fuel.BurnTime : 0f;
    }
}

public record SmeltingRecipe(
    string InputItemId,
    string ResultItemId,
    float CookTime,
    float Experience);

public record FuelEntry(
    string ItemId,
    float BurnTime);
