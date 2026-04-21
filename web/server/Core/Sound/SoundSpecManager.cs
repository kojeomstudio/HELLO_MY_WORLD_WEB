using System.Text.Json;
using WebGameServer.Core.Game;

namespace WebGameServer.Core.Sound;

public readonly record struct SoundSpec(
    string Name,
    float Gain = 1.0f,
    float Fade = 0.0f,
    float Pitch = 1.0f,
    float StartTime = 0.0f,
    bool Loop = false
);

public enum SoundLocation
{
    Local,
    Position,
    Object
}

public record SoundEvent(
    SoundSpec Spec,
    SoundLocation Location,
    Vector3? Position = null,
    Guid? ObjectId = null,
    string Category = ""
);

public class SoundSpecManager
{
    private readonly Dictionary<(string SoundGroup, string Action), SoundSpec> _blockSounds = new();
    private readonly List<SoundEvent> _activeSounds = new();
    private readonly BlockDefinitionManager _blockDefs;

    public SoundSpecManager(BlockDefinitionManager blockDefs)
    {
        _blockDefs = blockDefs;
        LoadDefaults();
    }

    public void LoadFromFile(string filePath)
    {
        if (!File.Exists(filePath)) return;
        var json = File.ReadAllText(filePath);
        var doc = JsonDocument.Parse(json);
        if (!doc.RootElement.TryGetProperty("sounds", out var soundsEl)) return;

        foreach (var groupProp in soundsEl.EnumerateObject())
        {
            var groupName = groupProp.Name;
            var actionsEl = groupProp.Value;

            foreach (var actionProp in actionsEl.EnumerateObject())
            {
                var action = actionProp.Name;
                var el = actionProp.Value;

                var name = el.TryGetProperty("name", out var n) ? n.GetString() ?? $"{groupName}_{action}" : $"{groupName}_{action}";
                var gain = el.TryGetProperty("gain", out var g) ? g.GetSingle() : 1.0f;
                var fade = el.TryGetProperty("fade", out var f) ? f.GetSingle() : 0.0f;
                var pitch = el.TryGetProperty("pitch", out var p) ? p.GetSingle() : 1.0f;
                var startTime = el.TryGetProperty("startTime", out var st) ? st.GetSingle() : 0.0f;
                var loop = el.TryGetProperty("loop", out var l) && l.GetBoolean();

                var spec = new SoundSpec(name, gain, fade, pitch, startTime, loop);

                _blockSounds[(groupName, action)] = spec;
            }
        }
    }

    public SoundSpec? GetBlockSound(ushort blockType, string action)
    {
        var blockDef = _blockDefs.Get(blockType);
        if (blockDef is null) return null;

        var soundGroup = blockDef.SoundGroup;
        return _blockSounds.TryGetValue((soundGroup, action), out var spec) ? spec : null;
    }

    public SoundEvent PlayPositionalSound(string name, float x, float y, float z, float gain = 1.0f, float pitch = 1.0f)
    {
        var spec = new SoundSpec(Name: name, Gain: gain, Pitch: pitch);
        var soundEvent = new SoundEvent(
            Spec: spec,
            Location: SoundLocation.Position,
            Position: new Vector3(x, y, z)
        );

        _activeSounds.Add(soundEvent);
        return soundEvent;
    }

    public IReadOnlyList<SoundEvent> GetActiveSounds() => _activeSounds;

    public void ClearActiveSounds() => _activeSounds.Clear();

    public void RemoveActiveSound(SoundEvent sound) => _activeSounds.Remove(sound);

    private void LoadDefaults()
    {
        var defaultGroups = new Dictionary<string, Dictionary<string, SoundSpec>>
        {
            ["stone"] = new()
            {
                ["dig"] = new("stone_dig", Gain: 0.5f),
                ["place"] = new("stone_place", Gain: 0.5f),
                ["step"] = new("stone_step", Gain: 0.3f)
            },
            ["dirt"] = new()
            {
                ["dig"] = new("dirt_dig", Gain: 0.5f),
                ["place"] = new("dirt_place", Gain: 0.5f),
                ["step"] = new("dirt_step", Gain: 0.3f)
            },
            ["grass"] = new()
            {
                ["dig"] = new("grass_dig", Gain: 0.5f),
                ["place"] = new("grass_place", Gain: 0.5f),
                ["step"] = new("grass_step", Gain: 0.3f)
            },
            ["wood"] = new()
            {
                ["dig"] = new("wood_dig", Gain: 0.5f),
                ["place"] = new("wood_place", Gain: 0.5f),
                ["step"] = new("wood_step", Gain: 0.3f)
            },
            ["leaves"] = new()
            {
                ["dig"] = new("leaves_dig", Gain: 0.5f),
                ["place"] = new("leaves_place", Gain: 0.5f),
                ["step"] = new("leaves_step", Gain: 0.3f)
            },
            ["glass"] = new()
            {
                ["dig"] = new("glass_dig", Gain: 0.5f),
                ["place"] = new("glass_place", Gain: 0.5f),
                ["step"] = new("glass_step", Gain: 0.3f)
            },
            ["sand"] = new()
            {
                ["dig"] = new("sand_dig", Gain: 0.5f),
                ["place"] = new("sand_place", Gain: 0.5f),
                ["step"] = new("sand_step", Gain: 0.3f)
            },
            ["gravel"] = new()
            {
                ["dig"] = new("gravel_dig", Gain: 0.5f),
                ["place"] = new("gravel_place", Gain: 0.5f),
                ["step"] = new("gravel_step", Gain: 0.3f)
            },
            ["cloth"] = new()
            {
                ["dig"] = new("cloth_dig", Gain: 0.5f),
                ["place"] = new("cloth_place", Gain: 0.5f),
                ["step"] = new("cloth_step", Gain: 0.2f)
            },
            ["metal"] = new()
            {
                ["dig"] = new("metal_dig", Gain: 0.5f),
                ["place"] = new("metal_place", Gain: 0.5f),
                ["step"] = new("metal_step", Gain: 0.3f)
            },
            ["snow"] = new()
            {
                ["dig"] = new("snow_dig", Gain: 0.5f),
                ["place"] = new("snow_place", Gain: 0.5f),
                ["step"] = new("snow_step", Gain: 0.3f)
            },
            ["water"] = new()
            {
                ["dig"] = new("water_dig", Gain: 0.5f),
                ["place"] = new("water_place", Gain: 0.5f),
                ["step"] = new("water_step", Gain: 0.2f)
            },
            ["lava"] = new()
            {
                ["dig"] = new("lava_dig", Gain: 0.5f),
                ["place"] = new("lava_place", Gain: 0.5f),
                ["step"] = new("lava_step", Gain: 0.2f)
            },
            ["default"] = new()
            {
                ["dig"] = new("default_dig", Gain: 0.5f),
                ["place"] = new("default_place", Gain: 0.5f),
                ["step"] = new("default_step", Gain: 0.3f)
            }
        };

        foreach (var (group, actions) in defaultGroups)
        {
            foreach (var (action, spec) in actions)
            {
                _blockSounds[(group, action)] = spec;
            }
        }
    }
}
