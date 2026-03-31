using System.Text.Json;

namespace WebGameServer.Core.Smelting;

public class SmeltingSystem
{
    private List<SmeltingRecipe> _recipes = new();

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
    }

    public SmeltingRecipe? GetRecipe(string inputId)
    {
        return _recipes.FirstOrDefault(r => r.InputItemId.Equals(inputId, StringComparison.OrdinalIgnoreCase));
    }

    public IReadOnlyList<SmeltingRecipe> GetAllRecipes() => _recipes.AsReadOnly();
}

public record SmeltingRecipe(
    string InputItemId,
    string ResultItemId,
    float CookTime,
    float Experience);
