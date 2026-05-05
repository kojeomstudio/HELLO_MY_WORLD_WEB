using System.Collections.Concurrent;
using System.Diagnostics;

namespace WebGameServer.Core;

public class ServerProfiler
{
    private readonly ConcurrentDictionary<string, ProfileMetric> _metrics = new();
    private readonly ConcurrentDictionary<string, double> _gaugeValues = new();
    private Stopwatch _stopwatch = Stopwatch.StartNew();
    private long _totalTicks;
    private long _updateCount;

    public void BeginFrame()
    {
        _stopwatch = Stopwatch.StartNew();
    }

    public void EndFrame()
    {
        _stopwatch.Stop();
        Interlocked.Add(ref _totalTicks, _stopwatch.ElapsedTicks);
        Interlocked.Increment(ref _updateCount);
    }

    public IDisposable Measure(string name)
    {
        return new ProfileScope(this, name);
    }

    public void Record(string name, double milliseconds)
    {
        var metric = _metrics.GetOrAdd(name, _ => new ProfileMetric());
        lock (metric)
        {
            metric.Count++;
            metric.TotalMs += milliseconds;
            if (milliseconds > metric.MaxMs)
                metric.MaxMs = milliseconds;
            if (metric.MinMs < 0 || milliseconds < metric.MinMs)
                metric.MinMs = milliseconds;
        }
    }

    public void SetGauge(string name, double value)
    {
        _gaugeValues[name] = value;
    }

    public void IncrementCounter(string name, long amount = 1)
    {
        _metrics.TryGetValue(name, out var metric);
        if (metric == null)
        {
            metric = new ProfileMetric();
            _metrics[name] = metric;
        }
        lock (metric)
        {
            metric.Count += amount;
        }
    }

    public Dictionary<string, object> GetSnapshot()
    {
        var result = new Dictionary<string, object>();
        var totalMs = _totalTicks / (Stopwatch.Frequency / 1000.0);
        var avgFrameMs = _updateCount > 0 ? totalMs / _updateCount : 0;
        var tps = _updateCount > 0 && totalMs > 0 ? (_updateCount / totalMs) * 1000 : 0;

        result["uptime_ms"] = totalMs;
        result["frames"] = _updateCount;
        result["avg_frame_ms"] = Math.Round(avgFrameMs, 2);
        result["tps"] = Math.Round(tps, 1);

        foreach (var kvp in _metrics)
        {
            lock (kvp.Value)
            {
                if (kvp.Value.TotalMs > 0)
                {
                    result[$"perf.{kvp.Key}.avg_ms"] = Math.Round(kvp.Value.TotalMs / kvp.Value.Count, 3);
                    result[$"perf.{kvp.Key}.max_ms"] = Math.Round(kvp.Value.MaxMs, 3);
                    result[$"perf.{kvp.Key}.min_ms"] = Math.Round(kvp.Value.MinMs < 0 ? 0 : kvp.Value.MinMs, 3);
                    result[$"perf.{kvp.Key}.count"] = kvp.Value.Count;
                }
                else
                {
                    result[$"counter.{kvp.Key}"] = kvp.Value.Count;
                }
            }
        }

        foreach (var kvp in _gaugeValues)
        {
            result[$"gauge.{kvp.Key}"] = Math.Round(kvp.Value, 2);
        }

        return result;
    }

    public string FormatReport()
    {
        var snapshot = GetSnapshot();
        var lines = new List<string>();
        lines.Add("=== Server Profiler Report ===");
        lines.Add($"Uptime: {snapshot["uptime_ms"]}ms | Frames: {snapshot["frames"]} | Avg: {snapshot["avg_frame_ms"]}ms | TPS: {snapshot["tps"]}");
        lines.Add("");

        var perfEntries = snapshot.Keys
            .Where(k => k.StartsWith("perf.") && k.EndsWith(".avg_ms"))
            .OrderBy(k => k)
            .ToList();

        if (perfEntries.Count > 0)
        {
            lines.Add("--- Performance Metrics ---");
            foreach (var key in perfEntries)
            {
                var name = key.Substring(5, key.Length - 12);
                var avg = snapshot[key];
                var max = snapshot[$"perf.{name}.max_ms"];
                var cnt = snapshot[$"perf.{name}.count"];
                lines.Add($"  {name,-30} avg:{avg,8}ms  max:{max,8}ms  n:{cnt}");
            }
            lines.Add("");
        }

        var gauges = snapshot.Keys.Where(k => k.StartsWith("gauge.")).OrderBy(k => k).ToList();
        if (gauges.Count > 0)
        {
            lines.Add("--- Gauge Values ---");
            foreach (var key in gauges)
            {
                lines.Add($"  {key.Substring(6),-30} {snapshot[key]}");
            }
            lines.Add("");
        }

        var counters = snapshot.Keys.Where(k => k.StartsWith("counter.")).OrderBy(k => k).ToList();
        if (counters.Count > 0)
        {
            lines.Add("--- Counters ---");
            foreach (var key in counters)
            {
                lines.Add($"  {key.Substring(8),-30} {snapshot[key]}");
            }
        }

        return string.Join('\n', lines);
    }

    public void Reset()
    {
        _metrics.Clear();
        _gaugeValues.Clear();
        Interlocked.Exchange(ref _totalTicks, 0);
        Interlocked.Exchange(ref _updateCount, 0);
    }

    private class ProfileMetric
    {
        public long Count;
        public double TotalMs;
        public double MaxMs;
        public double MinMs = -1;
    }

    private class ProfileScope : IDisposable
    {
        private readonly ServerProfiler _profiler;
        private readonly string _name;
        private readonly Stopwatch _sw;

        public ProfileScope(ServerProfiler profiler, string name)
        {
            _profiler = profiler;
            _name = name;
            _sw = Stopwatch.StartNew();
        }

        public void Dispose()
        {
            _sw.Stop();
            _profiler.Record(_name, _sw.Elapsed.TotalMilliseconds);
        }
    }
}
