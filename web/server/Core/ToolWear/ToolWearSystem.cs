using WebGameServer.Core.Player;

namespace WebGameServer.Core.ToolWear;

public static class ToolWearSystem
{
    private const int MaxWear = 65536;

    public static ItemStack? ApplyWear(ItemStack tool, int uses)
    {
        if (uses <= 0) return tool;

        var currentWear = ParseWear(tool.Metadata);
        var wearPerUse = MaxWear / uses;
        var newWear = currentWear + wearPerUse;

        if (newWear >= MaxWear)
            return null;

        return tool with { Metadata = FormatWear(newWear) };
    }

    public static ItemStack? ApplyDigWear(ItemStack tool)
    {
        var durability = ToolConfig.GetDurability(tool.ItemId);
        return ApplyWear(tool, durability);
    }

    public static ItemStack? ApplyAttackWear(ItemStack tool)
    {
        var durability = ToolConfig.GetDurability(tool.ItemId);
        return ApplyWear(tool, durability / 2);
    }

    public static float GetWearPercent(ItemStack tool)
    {
        var wear = ParseWear(tool.Metadata);
        return (float)wear / MaxWear;
    }

    public static ItemStack? RepairTools(ItemStack tool1, ItemStack tool2)
    {
        if (tool1.ItemId != tool2.ItemId) return null;

        var wear1 = ParseWear(tool1.Metadata);
        var wear2 = ParseWear(tool2.Metadata);

        var combinedWear = Math.Max(0, wear1 + wear2 - MaxWear);

        if (combinedWear >= MaxWear)
            return null;

        return tool1 with { Count = 1, Metadata = FormatWear(combinedWear) };
    }

    private static int ParseWear(string? metadata)
    {
        if (string.IsNullOrEmpty(metadata)) return 0;
        if (metadata.StartsWith("wear:"))
            return int.TryParse(metadata[5..], out var w) ? w : 0;
        return 0;
    }

    private static string FormatWear(int wear)
    {
        return $"wear:{wear}";
    }
}
