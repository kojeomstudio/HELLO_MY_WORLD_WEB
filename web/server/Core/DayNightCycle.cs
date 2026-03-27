namespace WebGameServer.Core;

public class DayNightCycle
{
    public float DayLength { get; set; } = 24000f;
    public float DawnStart { get; set; } = 4500f;
    public float DayStart { get; set; } = 6000f;
    public float DuskStart { get; set; } = 16500f;
    public float NightStart { get; set; } = 18000f;

    public float CurrentTime { get; private set; }
    public float SunAngle { get; private set; }
    public float SkyBrightness { get; private set; }
    public float SunlightIntensity { get; private set; }
    public bool IsDay { get; private set; }

    public void Update(long gameTime)
    {
        CurrentTime = gameTime;
        SunAngle = (gameTime / DayLength) * 360f % 360f;

        if (gameTime >= DayStart && gameTime < DuskStart)
        {
            IsDay = true;
            SunlightIntensity = 1.0f;
        }
        else if (gameTime >= NightStart || gameTime < DawnStart)
        {
            IsDay = false;
            SunlightIntensity = 0.2f;
        }
        else if (gameTime >= DawnStart && gameTime < DayStart)
        {
            IsDay = false;
            var t = (gameTime - DawnStart) / (DayStart - DawnStart);
            SunlightIntensity = 0.2f + 0.8f * t;
        }
        else
        {
            IsDay = false;
            var t = (gameTime - DuskStart) / (NightStart - DuskStart);
            SunlightIntensity = 1.0f - 0.8f * t;
        }

        SkyBrightness = SunlightIntensity;
    }
}
