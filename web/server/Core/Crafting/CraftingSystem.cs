using System.Text.Json;

namespace WebGameServer.Core.Crafting;

public class CraftingSystem
{
    private List<CraftingRecipe> _recipes = new();

    public void LoadRecipes(string filePath)
    {
        if (!File.Exists(filePath)) return;
        var json = File.ReadAllText(filePath);
        var doc = JsonDocument.Parse(json);
        if (!doc.RootElement.TryGetProperty("craftingRecipes", out var recipesEl)) return;

        _recipes.Clear();
        foreach (var recipeEl in recipesEl.EnumerateArray())
        {
            var ingredients = new List<(string ItemId, int Count)>();
            if (recipeEl.TryGetProperty("ingredients", out var ingEl))
            {
                foreach (var ing in ingEl.EnumerateArray())
                {
                    var itemId = ing[0].GetString() ?? "";
                    var count = ing[1].GetInt32();
                    ingredients.Add((itemId, count));
                }
            }

            _recipes.Add(new CraftingRecipe(
                recipeEl.GetProperty("result").GetString() ?? "",
                recipeEl.TryGetProperty("resultCount", out var rc) ? rc.GetInt32() : 1,
                ingredients,
                recipeEl.TryGetProperty("shaped", out var s) && s.GetBoolean()));
        }
    }

    public CraftingRecipe? FindRecipe(List<(string ItemId, int Count)> availableItems)
    {
        foreach (var recipe in _recipes)
        {
            if (CanCraft(recipe, availableItems))
                return recipe;
        }
        return null;
    }

    public bool CanCraft(CraftingRecipe recipe, List<(string ItemId, int Count)> availableItems)
    {
        foreach (var (requiredId, requiredCount) in recipe.Ingredients)
        {
            var available = availableItems
                .Where(i => i.ItemId == requiredId)
                .Sum(i => i.Count);

            if (available < requiredCount) return false;
        }
        return true;
    }

    public List<(string ItemId, int Count)> Craft(CraftingRecipe recipe, List<(string ItemId, int Count)> availableItems)
    {
        if (!CanCraft(recipe, availableItems)) return availableItems;

        var result = new List<(string ItemId, int Count)>(availableItems);
        foreach (var (requiredId, requiredCount) in recipe.Ingredients)
        {
            int remaining = requiredCount;
            for (int i = 0; i < result.Count && remaining > 0; i++)
            {
                if (result[i].ItemId != requiredId) continue;
                var take = Math.Min(remaining, result[i].Count);
                result[i] = (result[i].ItemId, result[i].Count - take);
                remaining -= take;
            }
            result.RemoveAll(i => i.Count <= 0);
        }

        return result;
    }

    public IReadOnlyList<CraftingRecipe> GetAllRecipes() => _recipes.AsReadOnly();
}

public record CraftingRecipe(
    string ResultItemId,
    int ResultCount,
    List<(string ItemId, int Count)> Ingredients,
    bool Shaped = false);
