using System.Collections.Concurrent;

namespace WebGameServer.Core;

public enum JobStatus
{
    Pending,
    Running,
    Completed,
    Failed,
    Cancelled
}

public class AsyncJob
{
    public string Id { get; }
    public string Name { get; }
    public JobStatus Status { get; private set; } = JobStatus.Pending;
    public float Progress { get; private set; }
    public string? ErrorMessage { get; private set; }
    public DateTime CreatedAt { get; } = DateTime.UtcNow;
    public DateTime? StartedAt { get; private set; }
    public DateTime? CompletedAt { get; private set; }
    public int TotalSteps { get; set; } = 1;
    public int CompletedSteps { get; private set; }

    private readonly Func<AsyncJob, CancellationToken, Task> _action;
    private CancellationTokenSource? _cts;

    public AsyncJob(string name, Func<AsyncJob, CancellationToken, Task> action)
    {
        Id = Guid.NewGuid().ToString("N")[..8];
        Name = name;
        _action = action;
    }

    public void UpdateProgress(int completedSteps)
    {
        CompletedSteps = Math.Min(completedSteps, TotalSteps);
        Progress = TotalSteps > 0 ? (float)CompletedSteps / TotalSteps : 0f;
    }

    public async Task RunAsync(CancellationToken externalCt = default)
    {
        _cts = CancellationTokenSource.CreateLinkedTokenSource(externalCt);
        StartedAt = DateTime.UtcNow;
        Status = JobStatus.Running;

        try
        {
            await _action(this, _cts.Token);
            if (Status == JobStatus.Running)
            {
                Status = JobStatus.Completed;
                CompletedAt = DateTime.UtcNow;
                Progress = 1f;
            }
        }
        catch (OperationCanceledException)
        {
            Status = JobStatus.Cancelled;
            CompletedAt = DateTime.UtcNow;
        }
        catch (Exception ex)
        {
            Status = JobStatus.Failed;
            ErrorMessage = ex.Message;
            CompletedAt = DateTime.UtcNow;
        }
    }

    public void Cancel()
    {
        _cts?.Cancel();
        if (Status == JobStatus.Pending || Status == JobStatus.Running)
            Status = JobStatus.Cancelled;
    }
}

public class AsyncJobSystem
{
    private readonly ConcurrentDictionary<string, AsyncJob> _jobs = new();
    private readonly SemaphoreSlim _concurrencyLimiter;
    private readonly int _maxConcurrentJobs;
    private int _completedCount;
    private int _failedCount;

    public AsyncJobSystem(int maxConcurrentJobs = 4)
    {
        _maxConcurrentJobs = maxConcurrentJobs;
        _concurrencyLimiter = new SemaphoreSlim(maxConcurrentJobs, maxConcurrentJobs);
    }

    public AsyncJob Submit(string name, Func<AsyncJob, CancellationToken, Task> action)
    {
        var job = new AsyncJob(name, action);
        _jobs[job.Id] = job;

        _ = RunJobAsync(job);
        return job;
    }

    public AsyncJob SubmitAndWait(string name, Func<AsyncJob, CancellationToken, Task> action, CancellationToken ct = default)
    {
        var job = Submit(name, action);
        try
        {
            while (job.Status == JobStatus.Pending || job.Status == JobStatus.Running)
            {
                ct.ThrowIfCancellationRequested();
                Thread.Sleep(100);
            }
        }
        catch
        {
            job.Cancel();
        }
        return job;
    }

    private async Task RunJobAsync(AsyncJob job)
    {
        await _concurrencyLimiter.WaitAsync();
        try
        {
            await job.RunAsync();
        }
        finally
        {
            _concurrencyLimiter.Release();

            if (job.Status == JobStatus.Completed)
                Interlocked.Increment(ref _completedCount);
            else if (job.Status == JobStatus.Failed)
                Interlocked.Increment(ref _failedCount);
        }
    }

    public AsyncJob? GetJob(string id)
    {
        return _jobs.TryGetValue(id, out var job) ? job : null;
    }

    public IReadOnlyList<AsyncJob> GetAllJobs()
    {
        return _jobs.Values.ToList().AsReadOnly();
    }

    public IReadOnlyList<AsyncJob> GetActiveJobs()
    {
        return _jobs.Values
            .Where(j => j.Status == JobStatus.Pending || j.Status == JobStatus.Running)
            .ToList().AsReadOnly();
    }

    public bool CancelJob(string id)
    {
        if (_jobs.TryGetValue(id, out var job))
        {
            job.Cancel();
            return true;
        }
        return false;
    }

    public void CancelAllJobs()
    {
        foreach (var job in _jobs.Values)
            job.Cancel();
    }

    public void CleanupCompletedJobs(TimeSpan maxAge)
    {
        var cutoff = DateTime.UtcNow - maxAge;
        foreach (var kvp in _jobs)
        {
            if (kvp.Value.CompletedAt.HasValue && kvp.Value.CompletedAt.Value < cutoff)
                _jobs.TryRemove(kvp.Key, out _);
        }
    }

    public int ActiveJobCount => _jobs.Values.Count(j => j.Status == JobStatus.Pending || j.Status == JobStatus.Running);
    public int TotalCompletedCount => _completedCount;
    public int TotalFailedCount => _failedCount;
    public int TotalJobCount => _jobs.Count;
}
