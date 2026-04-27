using System.Linq;
using System.Text.Json;

namespace WebGameServer.Core.Crafting;

public class GridCraftingSystem
{
    private readonly List<GridRecipe> _recipes = new();
    private readonly Dictionary<string, HashSet<string>> _groups = new();

    public void RegisterGroup(string groupName, HashSet<string> itemIds)
    {
        _groups[groupName] = itemIds;
    }

    public void LoadRecipes(string filePath)
    {
        if (!File.Exists(filePath)) return;
        var json = File.ReadAllText(filePath);
        var doc = JsonDocument.Parse(json);
        if (!doc.RootElement.TryGetProperty("gridRecipes", out var recipesEl)) return;

        foreach (var recipeEl in recipesEl.EnumerateArray())
        {
            var type = recipeEl.TryGetProperty("type", out var typeEl)
                ? typeEl.GetString() ?? "shapeless"
                : "shapeless";

            var result = recipeEl.GetProperty("result").GetString() ?? "";
            var resultCount = recipeEl.TryGetProperty("resultCount", out var rc) ? rc.GetInt32() : 1;

            string[]? pattern = null;
            Dictionary<string, string>? keys = null;
            List<(string ItemId, int Count)> ingredients = new();

            if (type == "shaped")
            {
                if (recipeEl.TryGetProperty("pattern", out var patternEl))
                {
                    pattern = patternEl.EnumerateArray().Select(p => p.GetString() ?? "").ToArray();
                }

                keys = new Dictionary<string, string>();
                if (recipeEl.TryGetProperty("keys", out var keysEl))
                {
                    foreach (var keyProp in keysEl.EnumerateObject())
                    {
                        keys[keyProp.Name] = keyProp.Value.GetString() ?? "";
                    }
                }
            }

            if (recipeEl.TryGetProperty("ingredients", out var ingEl))
            {
                foreach (var ing in ingEl.EnumerateArray())
                {
                    var itemId = ing[0].GetString() ?? "";
                    var count = ing[1].GetInt32();
                    ingredients.Add((itemId, count));
                }
            }

            _recipes.Add(new GridRecipe(result, resultCount, type, pattern, keys, ingredients));
        }
    }

    public GridRecipe? FindRecipe(string?[,] grid, int gridSize)
    {
        foreach (var recipe in _recipes)
        {
            if (recipe.Type == "shaped" && recipe.Pattern != null && recipe.Keys != null)
            {
                if (ShapedMatches(recipe, grid, gridSize))
                    return recipe;
            }
            else
            {
                if (ShapelessMatches(recipe, grid, gridSize))
                    return recipe;
            }
        }
        return null;
    }

    private bool ShapedMatches(GridRecipe recipe, string?[,] grid, int gridSize)
    {
        if (recipe.Pattern == null || recipe.Keys == null) return false;

        var patternRows = recipe.Pattern.Length;
        var patternCols = recipe.Pattern.Length > 0 ? recipe.Pattern[0].Length : 0;

        for (int offsetRow = 0; offsetRow <= gridSize - patternRows; offsetRow++)
        {
            for (int offsetCol = 0; offsetCol <= gridSize - patternCols; offsetCol++)
            {
                if (ShapedMatchesAt(recipe, grid, gridSize, offsetRow, offsetCol))
                    return true;
            }
        }
        return false;
    }

    private bool ShapedMatchesAt(GridRecipe recipe, string?[,] grid, int gridSize, int offsetRow, int offsetCol)
    {
        if (recipe.Pattern == null || recipe.Keys == null) return false;

        for (int r = 0; r < recipe.Pattern.Length; r++)
        {
            var row = recipe.Pattern[r];
            for (int c = 0; c < row.Length; c++)
            {
                var ch = row[c];
                var gridItem = grid[offsetRow + r, offsetCol + c];

                if (ch == ' ')
                {
                    if (!string.IsNullOrEmpty(gridItem)) return false;
                    continue;
                }

                if (!recipe.Keys.TryGetValue(ch.ToString(), out var requiredItem)) return false;

                if (string.IsNullOrEmpty(gridItem)) return false;
                if (!ItemMatchesGroup(requiredItem, gridItem)) return false;
            }
        }

        for (int r = 0; r < gridSize; r++)
        {
            for (int c = 0; c < gridSize; c++)
            {
                bool inPattern = r >= offsetRow && r < offsetRow + recipe.Pattern.Length &&
                                 c >= offsetCol && recipe.Pattern.Length > 0 &&
                                 c < offsetCol + recipe.Pattern[r - offsetRow].Length;

                if (!inPattern && !string.IsNullOrEmpty(grid[r, c]))
                    return false;
            }
        }

        return true;
    }

    private bool ShapelessMatches(GridRecipe recipe, string?[,] grid, int gridSize)
    {
        var gridItems = new List<string>();
        for (int r = 0; r < gridSize; r++)
        {
            for (int c = 0; c < gridSize; c++)
            {
                if (!string.IsNullOrEmpty(grid[r, c]))
                    gridItems.Add(grid[r, c]!);
            }
        }

        if (recipe.Ingredients.Count != gridItems.Count) return false;

        var used = new bool[gridItems.Count];

        foreach (var (requiredId, requiredCount) in recipe.Ingredients)
        {
            int remaining = requiredCount;
            for (int i = 0; i < gridItems.Count && remaining > 0; i++)
            {
                if (used[i]) continue;
                if (ItemMatchesGroup(requiredId, gridItems[i]))
                {
                    used[i] = true;
                    remaining--;
                }
            }
            if (remaining > 0) return false;
        }

        return true;
    }

    public bool ItemMatchesGroup(string groupOrItem, string itemId)
    {
        if (groupOrItem == itemId) return true;
        if (_groups.TryGetValue(groupOrItem, out var groupItems))
            return groupItems.Contains(itemId);
        return false;
    }

    public List<(string ItemId, int Count)> GetRemainingItems(string?[,] grid, int gridSize, GridRecipe recipe)
    {
        var remaining = new List<(string ItemId, int Count)>();
        for (int r = 0; r < gridSize; r++)
        {
            for (int c = 0; c < gridSize; c++)
            {
                if (!string.IsNullOrEmpty(grid[r, c]))
                    remaining.Add((grid[r, c]!, 1));
            }
        }
        return remaining;
    }

    public IReadOnlyList<GridRecipe> GetAllRecipes() => _recipes.AsReadOnly();
}

public record GridRecipe(
    string ResultItemId,
    int ResultCount,
    string Type,
    string[]? Pattern,
    Dictionary<string, string>? Keys,
    List<(string ItemId, int Count)> Ingredients);
