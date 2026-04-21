using System.Collections.Concurrent;
using System.Text.Json;
using System.Text.Json.Serialization;

namespace WebGameServer.Core.Content;

public enum ContentPackageType
{
    Mod,
    Game,
    TexturePack
}

public record ContentPackage(
    string Name,
    string Version,
    string Description,
    string Author,
    ContentPackageType Type,
    string[] Dependencies,
    bool Enabled
);

public class ContentPackageManager
{
    private readonly ConcurrentDictionary<string, ContentPackage> _packages = new();
    private static readonly JsonSerializerOptions _jsonOptions = new()
    {
        PropertyNameCaseInsensitive = true,
        ReadCommentHandling = JsonCommentHandling.Skip,
        AllowTrailingCommas = true
    };

    public void LoadPackages(string dataPath)
    {
        if (!Directory.Exists(dataPath))
        {
            return;
        }

        foreach (var manifestFile in Directory.GetFiles(dataPath, "*.json", SearchOption.AllDirectories))
        {
            var package = LoadFromJson(manifestFile);
            if (package is not null)
            {
                _packages[package.Name] = package;
            }
        }
    }

    public ContentPackage? GetPackage(string name)
    {
        return _packages.TryGetValue(name, out var package) ? package : null;
    }

    public IReadOnlyList<ContentPackage> GetAllPackages()
    {
        return _packages.Values.ToList().AsReadOnly();
    }

    public IReadOnlyList<ContentPackage> GetEnabledPackages()
    {
        return _packages.Values.Where(p => p.Enabled).ToList().AsReadOnly();
    }

    public bool EnablePackage(string name)
    {
        if (!_packages.TryGetValue(name, out var package))
        {
            return false;
        }

        if (package.Enabled)
        {
            return true;
        }

        return _packages.TryUpdate(name, package with { Enabled = true }, package);
    }

    public bool DisablePackage(string name)
    {
        if (!_packages.TryGetValue(name, out var package))
        {
            return false;
        }

        if (!package.Enabled)
        {
            return true;
        }

        return _packages.TryUpdate(name, package with { Enabled = false }, package);
    }

    public bool IsEnabled(string name)
    {
        return _packages.TryGetValue(name, out var package) && package.Enabled;
    }

    public List<string> ResolveDependencies()
    {
        var issues = new List<string>();

        foreach (var package in _packages.Values.Where(p => p.Enabled))
        {
            foreach (var dependency in package.Dependencies)
            {
                if (!_packages.ContainsKey(dependency))
                {
                    issues.Add($"Package '{package.Name}' depends on missing package '{dependency}'");
                    continue;
                }

                if (!_packages[dependency].Enabled)
                {
                    issues.Add($"Package '{package.Name}' depends on disabled package '{dependency}'");
                }
            }
        }

        var visited = new HashSet<string>();
        var recursionStack = new HashSet<string>();

        foreach (var package in _packages.Values.Where(p => p.Enabled))
        {
            DetectCycles(package.Name, visited, recursionStack, issues);
        }

        return issues;
    }

    public static ContentPackage? LoadFromJson(string filePath)
    {
        try
        {
            var json = File.ReadAllText(filePath);
            var manifest = JsonSerializer.Deserialize<PackageManifest>(json, _jsonOptions);
            if (manifest is null)
            {
                return null;
            }

            return new ContentPackage(
                manifest.Name ?? string.Empty,
                manifest.Version ?? "0.0.0",
                manifest.Description ?? string.Empty,
                manifest.Author ?? string.Empty,
                manifest.Type,
                manifest.Dependencies ?? Array.Empty<string>(),
                manifest.Enabled
            );
        }
        catch (JsonException)
        {
            return null;
        }
        catch (IOException)
        {
            return null;
        }
    }

    private void DetectCycles(
        string packageName,
        HashSet<string> visited,
        HashSet<string> recursionStack,
        List<string> issues)
    {
        if (recursionStack.Contains(packageName))
        {
            issues.Add($"Circular dependency detected involving package '{packageName}'");
            return;
        }

        if (visited.Contains(packageName))
        {
            return;
        }

        visited.Add(packageName);
        recursionStack.Add(packageName);

        if (_packages.TryGetValue(packageName, out var package))
        {
            foreach (var dependency in package.Dependencies)
            {
                DetectCycles(dependency, visited, recursionStack, issues);
            }
        }

        recursionStack.Remove(packageName);
    }

    private sealed class PackageManifest
    {
        [JsonPropertyName("name")]
        public string? Name { get; set; }

        [JsonPropertyName("version")]
        public string? Version { get; set; }

        [JsonPropertyName("description")]
        public string? Description { get; set; }

        [JsonPropertyName("author")]
        public string? Author { get; set; }

        [JsonPropertyName("type")]
        public ContentPackageType Type { get; set; } = ContentPackageType.Mod;

        [JsonPropertyName("dependencies")]
        public string[]? Dependencies { get; set; }

        [JsonPropertyName("enabled")]
        public bool Enabled { get; set; } = true;
    }
}
