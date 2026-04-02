export function ConversationProgressPanel({
  progress,
  progressByModule,
}: {
  progress: number;
  progressByModule: Array<{ module: string; complete: number; total: number }>;
}) {
  return (
    <div className="rounded-[2rem] border border-black/5 bg-[linear-gradient(170deg,rgba(255,255,255,0.96),rgba(208,231,221,0.55))] shadow-brand-shadow p-6 lg:p-7">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-brand-accent">Overall flow</p>
          <h3 className="text-2xl font-bold tracking-[-0.04em] text-brand-ink mt-2">{progress}% locked</h3>
        </div>
        <svg width="88" height="88" viewBox="0 0 88 88" aria-hidden="true">
          <defs>
            <linearGradient id="progress-ring" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#0a5f57" />
              <stop offset="100%" stopColor="#d0e7dd" />
            </linearGradient>
          </defs>
          <circle cx="44" cy="44" r="34" fill="none" stroke="rgba(24,32,40,0.08)" strokeWidth="8" />
          <circle
            cx="44"
            cy="44"
            r="34"
            fill="none"
            stroke="url(#progress-ring)"
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={`${(progress / 100) * 213.6} 213.6`}
            transform="rotate(-90 44 44)"
          />
          <circle cx="44" cy="44" r="20" fill="rgba(255,255,255,0.9)" />
          <text x="44" y="49" textAnchor="middle" className="fill-[#182028]" style={{ fontSize: "15px", fontWeight: 800 }}>
            {progress}%
          </text>
        </svg>
      </div>
      <div className="mt-6 space-y-3">
        {progressByModule.map((item) => (
          <div key={item.module} className="rounded-[1.35rem] border border-black/8 bg-white/70 px-4 py-3">
            <div className="flex items-center justify-between gap-3">
              <p className="text-sm font-semibold text-brand-ink">{item.module}</p>
              <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-brand-muted">
                {item.complete}/{item.total}
              </span>
            </div>
            <div className="mt-3 h-2 rounded-full bg-black/5 overflow-hidden">
              <div
                className="h-full rounded-full bg-brand-accent transition-all duration-500"
                style={{ width: `${item.total === 0 ? 0 : (item.complete / item.total) * 100}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
