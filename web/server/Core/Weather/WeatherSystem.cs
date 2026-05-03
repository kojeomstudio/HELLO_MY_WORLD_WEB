using WebGameServer.Core.World;
using WorldMap = WebGameServer.Core.World.World;

namespace WebGameServer.Core.Weather;

public enum WeatherType
{
    None,
    Rain,
    Snow,
    Thunderstorm
}

public class WeatherSystem
{
    private readonly ServerConfig _config;
    private readonly WorldMap _world;
    private readonly Random _random = new();

    private long _lastGameTime = -1;
    private long _accumulatedTime;

    public WeatherType CurrentWeather { get; private set; }
    public float Intensity { get; private set; }
    public long NextChangeTime { get; private set; }

    public WeatherSystem(ServerConfig config, WorldMap world)
    {
        _config = config;
        _world = world;
        CurrentWeather = WeatherType.None;
        Intensity = 0f;
        NextChangeTime = CalculateInterval();
    }

    private long CalculateInterval()
    {
        var seconds = 300 + _random.Next(0, 301);
        return (long)(seconds * 2000.0);
    }

    public void Update(long gameTime)
    {
        if (_lastGameTime < 0)
        {
            _lastGameTime = gameTime;
            return;
        }

        var delta = gameTime - _lastGameTime;
        if (delta < 0) delta += 24000;
        _lastGameTime = gameTime;
        _accumulatedTime += delta;

        if (_accumulatedTime >= NextChangeTime)
        {
            SelectWeather(gameTime);
            NextChangeTime = _accumulatedTime + CalculateInterval();
        }
    }

    private void SelectWeather(long gameTime)
    {
        bool isNight = gameTime >= 18000 || gameTime < 4500;
        bool isDuskDawn = (gameTime >= 4500 && gameTime < 6000) ||
                          (gameTime >= 16500 && gameTime < 18000);

        var roll = _random.NextDouble();

        if (isNight)
        {
            if (roll < 0.1) CurrentWeather = WeatherType.Thunderstorm;
            else if (roll < 0.4) CurrentWeather = WeatherType.Rain;
            else if (roll < 0.55) CurrentWeather = WeatherType.Snow;
            else CurrentWeather = WeatherType.None;
        }
        else if (isDuskDawn)
        {
            if (roll < 0.05) CurrentWeather = WeatherType.Thunderstorm;
            else if (roll < 0.45) CurrentWeather = WeatherType.Rain;
            else if (roll < 0.55) CurrentWeather = WeatherType.Snow;
            else CurrentWeather = WeatherType.None;
        }
        else
        {
            if (roll < 0.15) CurrentWeather = WeatherType.Rain;
            else if (roll < 0.2) CurrentWeather = WeatherType.Snow;
            else CurrentWeather = WeatherType.None;
        }

        Intensity = CurrentWeather switch
        {
            WeatherType.None => 0f,
            WeatherType.Rain => 0.3f + (float)_random.NextDouble() * 0.5f,
            WeatherType.Snow => 0.2f + (float)_random.NextDouble() * 0.4f,
            WeatherType.Thunderstorm => 0.6f + (float)_random.NextDouble() * 0.4f,
            _ => 0f
        };
    }

    public void SetWeather(WeatherType type)
    {
        CurrentWeather = type;
        Intensity = type switch
        {
            WeatherType.None => 0f,
            WeatherType.Rain => 0.5f,
            WeatherType.Snow => 0.4f,
            WeatherType.Thunderstorm => 0.8f,
            _ => 0f
        };
    }

    public bool TryGenerateLightning(out int x, out int y, out int z)
    {
        x = 0;
        y = 0;
        z = 0;

        if (CurrentWeather != WeatherType.Thunderstorm) return false;
        if (_random.NextDouble() > Intensity * 0.02f) return false;

        var range = 100;
        x = _random.Next(-range, range);
        z = _random.Next(-range, range);
        y = _world.GetGroundHeight(x, z);

        var abovePos = new Vector3s((short)x, (short)(y + 1), (short)z);
        if (_world.GetBlock(abovePos).Type != BlockType.Air)
        {
            y++;
        }

        return true;
    }
}
