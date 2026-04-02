import { LeverageIndicatorProps } from "./LeverageIndicator.contract";

export function LeverageIndicator({ score, label, isComplete }: LeverageIndicatorProps) {
  return (
    <div className="w-full max-w-[360px] bg-white/60 p-4 lg:p-5 rounded-[1.5rem] border border-black/5 shadow-brand-shadow space-y-3">
      <div className="flex justify-between items-center gap-4">
        <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-brand-muted">Bag meter</span>
        <span className="text-sm font-bold text-brand-ink">{score}%</span>
      </div>
      <div className="h-2.5 w-full bg-black/5 rounded-full overflow-hidden">
        <div 
          className="h-full bg-brand-accent transition-all duration-500 ease-out" 
          style={{ width: `${score}%` }} 
        />
      </div>
      <p className="text-xs text-brand-muted leading-relaxed">
        {isComplete ? (
          <span className="text-brand-accent font-semibold">Max bag energy. Ready to close.</span>
        ) : (
          <>Next move: <span className="text-brand-ink font-medium">{label}</span></>
        )}
      </p>
    </div>
  );
}
