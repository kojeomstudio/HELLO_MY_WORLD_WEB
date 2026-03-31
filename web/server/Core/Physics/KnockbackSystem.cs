namespace WebGameServer.Core.Physics;

public class KnockbackSystem
{
    public Vector3 CalculateKnockback(Vector3 attackerPos, Vector3 targetPos, float damage, float distance)
    {
        var direction = (targetPos - attackerPos).Normalized;
        var kbValue = 8 - 8 * MathF.Exp(-0.17328f * damage);
        var distanceFactor = 1.0f / (distance + 1.0f);
        var kb = kbValue * distanceFactor;

        var horizontal = direction * kb * 10;
        var vertical = new Vector3(0, kb * 8, 0);

        return horizontal + vertical;
    }

    public Vector3 CalculateKnockback(Vector3 attackerPos, Vector3 targetPos, float damage)
    {
        var distance = Vector3.Distance(attackerPos, targetPos);
        return CalculateKnockback(attackerPos, targetPos, damage, distance);
    }
}
