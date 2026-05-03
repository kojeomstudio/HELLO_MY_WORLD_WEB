using System.Text.Json;

namespace WebGameServer.Core.UI;

public class FormspecSystem
{
    private readonly FormspecParser _parser = new();
    private readonly Dictionary<string, string> _definitions = new(StringComparer.OrdinalIgnoreCase);

    public void LoadFromFile(string path)
    {
        if (!File.Exists(path)) return;

        var json = File.ReadAllText(path);
        var doc = JsonDocument.Parse(json);

        foreach (var prop in doc.RootElement.EnumerateObject())
        {
            var formspec = prop.Value.GetString();
            if (formspec != null)
            {
                _definitions[prop.Name] = formspec;
            }
        }
    }

    public string? GetFormspec(string formName)
    {
        return _definitions.TryGetValue(formName, out var formspec) ? formspec : null;
    }

    public void RegisterFormspec(string formName, string formspec)
    {
        _definitions[formName] = formspec;
    }

    public string ParseAndSerialize(string formspec)
    {
        var parsed = _parser.Parse(formspec);
        return JsonSerializer.Serialize(parsed);
    }
}
