import { LeverageIndicatorProps } from "./LeverageIndicator.contract";

export function LeverageIndicator({ score, label, isComplete }: LeverageIndicatorProps) {
  return (
    <div className="leverage-indicator">
      <div className="leverage-label-row">
        <span className="panel-label">Leverage Score 🥱</span>
        <span style={{ fontWeight: 700 }}>{score}%</span>
      </div>
      <div className="leverage-bar-container">
        <div className="leverage-bar-fill" style={{ width: `${score}%` }} />
      </div>
      <p style={{ margin: "0.5rem 0 0", fontSize: "0.85rem", color: "var(--muted)" }}>
        {isComplete ? "🚀 Maximum leverage achieved. Ready for outcome." : `Next: ${label}`}
      </p>
    </div>
  );
}
