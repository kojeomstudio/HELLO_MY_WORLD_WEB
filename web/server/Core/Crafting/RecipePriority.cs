namespace WebGameServer.Core.Crafting;

public enum RecipePriority
{
    NoRecipe = 0,
    ToolRepair = 1,
    ShapelessAndGroups = 2,
    Shapeless = 3,
    ShapedAndGroups = 4,
    Shaped = 5
}

public static class RecipePriorityExtensions
{
    public static string ToConfigString(this RecipePriority priority) => priority switch
    {
        RecipePriority.NoRecipe => "no_recipe",
        RecipePriority.ToolRepair => "tool_repair",
        RecipePriority.ShapelessAndGroups => "shapeless_and_groups",
        RecipePriority.Shapeless => "shapeless",
        RecipePriority.ShapedAndGroups => "shaped_and_groups",
        RecipePriority.Shaped => "shaped",
        _ => "shapeless"
    };

    public static RecipePriority FromConfigString(string value) => value switch
    {
        "tool_repair" => RecipePriority.ToolRepair,
        "shapeless_and_groups" => RecipePriority.ShapelessAndGroups,
        "shapeless" => RecipePriority.Shapeless,
        "shaped_and_groups" => RecipePriority.ShapedAndGroups,
        "shaped" => RecipePriority.Shaped,
        _ => RecipePriority.Shapeless
    };
}
