import { LoginPageProps } from "./LoginPage.contract";

export function LoginPage({
  onContinueLocal,
  onContinueGoogle,
  onContinueApple,
  onLoadMockData,
}: LoginPageProps) {
  return (
    <main
      id="main-content"
      className="min-h-screen w-full flex items-center justify-center px-4 sm:px-6 lg:px-8 py-10 bg-[radial-gradient(circle_at_top,rgba(195,246,214,0.75),rgba(247,245,240,1)_42%),linear-gradient(135deg,#fff8ef_0%,#e7f8f0_58%,#f4efe4_100%)]"
    >
      <section className="w-full max-w-[1100px] grid grid-cols-1 xl:grid-cols-[minmax(0,1.1fr)_440px] gap-8 xl:gap-10 items-stretch">
        <div className="onboarding-grid toy-surface rounded-[2.25rem] border border-black/5 shadow-brand-shadow p-8 lg:p-10 flex flex-col justify-between gap-8">
          <div className="relative space-y-6">
            <div className="flex flex-wrap items-center gap-3">
              <span className="sticker-badge animate-sticker-spin">main character mode 🎮</span>
              <span className="sticker-badge">zero paperwork spiral ✨</span>
            </div>
            <div className="space-y-4 max-w-[40rem] relative z-10">
              <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-brand-accent">
                Monyawn // route to the bag 💸
              </p>
              <h1 className="text-4xl sm:text-5xl xl:text-[4.1rem] font-extrabold tracking-[-0.05em] leading-[0.92] text-brand-ink">
                We finna get to the bag, no cap. 🏃‍♂️💨
              </h1>
              <p className="max-w-[58ch] text-base lg:text-lg text-brand-muted leading-relaxed">
                Paste the tea, the link, or the transcript and we map the next play fast. It&apos;s
                giving low effort, high aura, fully locked in. This is an opportunity management
                platform with the vibe of a bestie who always knows the move. We keep the route
                clear, the chaos contained, and the energy focused on the win.
              </p>
            </div>

            <div className="relative mt-4 rounded-[2rem] border border-black/5 bg-white/70 p-5 lg:p-6 overflow-hidden">
              <div className="absolute top-3 right-3 sticker-badge animate-float-delayed">
                speedrun onboarding 🛼
              </div>
              <svg viewBox="0 0 520 220" className="w-full h-auto" aria-hidden="true">
                <defs>
                  <linearGradient id="login-path" x1="0%" x2="100%" y1="0%" y2="0%">
                    <stop offset="0%" stopColor="#0a5f57" />
                    <stop offset="100%" stopColor="#57d4aa" />
                  </linearGradient>
                </defs>
                <path
                  d="M42 164 C112 150, 148 88, 220 86 S332 152, 408 122 S458 74, 492 64"
                  fill="none"
                  stroke="url(#login-path)"
                  strokeWidth="14"
                  strokeLinecap="round"
                  className="animate-dash-flow"
                />
                {[
                  { x: 52, y: 162, label: "DM 📨" },
                  { x: 194, y: 91, label: "Draft 🧠" },
                  { x: 338, y: 143, label: "Play ✅" },
                  { x: 474, y: 70, label: "Bag 💸" },
                ].map((node, index) => (
                  <g
                    key={node.label}
                    className={index % 2 === 0 ? "animate-float" : "animate-float-delayed"}
                  >
                    <circle
                      cx={node.x}
                      cy={node.y}
                      r="22"
                      fill="#fffdf8"
                      stroke="#182028"
                      strokeWidth="4"
                    />
                    <circle
                      cx={node.x}
                      cy={node.y}
                      r="10"
                      fill="#57d4aa"
                      className="animate-glow-pulse"
                    />
                    <foreignObject x={node.x - 42} y={node.y + 26} width="96" height="40">
                      <div className="sticker-badge justify-center text-[11px]">{node.label}</div>
                    </foreignObject>
                  </g>
                ))}
              </svg>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <article className="rounded-[1.5rem] border border-black/5 bg-white/80 p-4">
              <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-brand-muted">
                No lore dump
              </p>
              <p className="text-sm text-brand-ink mt-2 leading-relaxed">
                Drop one signal. We read the room and set the route.
              </p>
            </article>
            <article className="rounded-[1.5rem] border border-black/5 bg-white/80 p-4">
              <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-brand-muted">
                AI bestie
              </p>
              <p className="text-sm text-brand-ink mt-2 leading-relaxed">
                Messy recruiter chaos in, clean next move out.
              </p>
            </article>
            <article className="rounded-[1.5rem] border border-black/5 bg-white/80 p-4">
              <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-brand-muted">
                Private stash
              </p>
              <p className="text-sm text-brand-ink mt-2 leading-relaxed">
                Your data stays local until you say it can leave.
              </p>
            </article>
          </div>
        </div>

        <div className="toy-surface rounded-[2.25rem] border border-black/5 bg-white/85 shadow-brand-shadow p-7 lg:p-8 flex flex-col gap-4 justify-center">
          <div className="space-y-2 mb-2">
            <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-brand-muted">
              Pull up ✨
            </p>
            <h2 className="text-2xl font-bold tracking-[-0.04em] text-brand-ink">
              Tap in and start the speedrun.
            </h2>
            <p className="text-sm text-brand-muted leading-relaxed">
              Pick your lane. We keep the first move light, obvious, and low-stress.
            </p>
          </div>

          <button
            type="button"
            onClick={onContinueGoogle}
            className="w-full rounded-full px-5 py-3 bg-brand-ink text-white font-semibold hover:bg-black transition-colors"
          >
            Slide in with Google ✨
          </button>
          <button
            type="button"
            onClick={onContinueApple}
            className="w-full rounded-full px-5 py-3 bg-black text-white font-semibold hover:bg-black/85 transition-colors"
          >
            Slide in with Apple 🍏
          </button>
          <button
            type="button"
            onClick={onContinueLocal}
            className="w-full rounded-full px-5 py-3 bg-brand-surface border border-black/10 text-brand-ink font-semibold hover:bg-black/5 transition-colors"
          >
            Stay local 🔒
          </button>
          {onLoadMockData && (
            <details className="rounded-2xl border border-black/10 bg-brand-surface px-4 py-3">
              <summary className="cursor-pointer text-xs font-semibold uppercase tracking-[0.18em] text-brand-muted">
                Dev tools
              </summary>
              <button
                type="button"
                onClick={onLoadMockData}
                className="w-full mt-3 rounded-full px-5 py-2.5 border border-dashed border-black/20 text-brand-ink font-semibold hover:bg-black/5 transition-colors"
              >
                Load mock data (dev)
              </button>
            </details>
          )}

          <p className="text-xs text-brand-muted leading-relaxed mt-2">
            You bring the receipt. We bring the route, the cleanup, and the calm. 🫶
          </p>
        </div>
      </section>
    </main>
  );
}
