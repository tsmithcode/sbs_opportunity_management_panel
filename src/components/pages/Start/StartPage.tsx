import { PageTemplate } from "../../templates/PageTemplate";
import { StartPageProps } from "./StartPage.contract";

export function StartPage({ onAddSignal, onOpenWorkspace, onOpenAbout }: StartPageProps) {
  return (
    <PageTemplate
      id="start-page"
      className="min-h-[calc(100vh-72px)]"
      header={{
        kicker: "Spawn Point ✨",
        title: "Drop the first clue. We build the route.",
        description:
          "Start with the DM, link, screenshot, transcript, or note you already have. We sort the mess, mark the next checkpoint, and keep the vibe moving.",
        actions: (
          <>
            <button
              className="bg-brand-accent text-white px-6 py-3 rounded-full font-bold hover:bg-brand-accent-strong transition-all shadow-sm active:scale-95"
              type="button"
              onClick={onAddSignal}
            >
              Drop the clue 📨
            </button>
            <button
              className="bg-brand-surface border border-black/10 text-brand-ink px-6 py-3 rounded-full font-medium hover:bg-black/5 transition-all active:scale-95"
              type="button"
              onClick={onOpenWorkspace}
            >
              Open my route 🗺️
            </button>
            <button
              className="bg-brand-surface border border-black/10 text-brand-ink px-6 py-3 rounded-full font-medium hover:bg-black/5 transition-all active:scale-95"
              type="button"
              onClick={onOpenAbout}
            >
              Read the lore 📜
            </button>
          </>
        ),
        panel: (
          <div className="toy-surface rounded-[2rem] border border-black/5 bg-white/75 shadow-brand-shadow p-6 lg:p-7">
            <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-brand-accent">
              Speedrun path 🎮
            </p>
            <div className="space-y-4 mt-4">
              <div className="border-t border-black/8 pt-4">
                <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-brand-muted">
                  1. Drop the clue 🧃
                </p>
                <p className="text-sm text-brand-ink mt-2 leading-relaxed">
                  Paste the text, link, note, or transcript. No extra yapping.
                </p>
              </div>
              <div className="border-t border-black/8 pt-4">
                <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-brand-muted">
                  2. Check the build ✅
                </p>
                <p className="text-sm text-brand-ink mt-2 leading-relaxed">
                  We do the cleanup. You just confirm the essentials.
                </p>
              </div>
              <div className="border-t border-black/8 pt-4">
                <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-brand-muted">
                  3. Hit the next move 🚀
                </p>
                <p className="text-sm text-brand-ink mt-2 leading-relaxed">
                  Message, prep, debrief, repeat. Always one clear checkpoint at a time.
                </p>
              </div>
            </div>
          </div>
        ),
      }}
    >
      <section className="grid grid-cols-1 lg:grid-cols-[minmax(0,1.1fr)_minmax(300px,0.9fr)] gap-6">
        <div className="onboarding-grid toy-surface rounded-[2rem] border border-black/5 shadow-brand-shadow p-6 lg:p-8">
          <div className="flex flex-wrap items-center gap-3">
            <span className="sticker-badge">new quest unlocked 🪄</span>
            <span className="sticker-badge animate-float">one screen, one move 🎯</span>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1.05fr)_240px] gap-6 mt-5 items-center">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-brand-muted">
                How it should hit
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mt-5">
                <div>
                  <h3 className="text-xl font-bold tracking-[-0.03em] text-brand-ink">Fast ⚡</h3>
                  <p className="text-sm text-brand-muted leading-relaxed mt-2">
                    New opportunity live in minutes, not a whole side mission.
                  </p>
                </div>
                <div>
                  <h3 className="text-xl font-bold tracking-[-0.03em] text-brand-ink">
                    Supportive 🫶
                  </h3>
                  <p className="text-sm text-brand-muted leading-relaxed mt-2">
                    Every recruiter ping should feel like momentum, not admin sludge.
                  </p>
                </div>
                <div>
                  <h3 className="text-xl font-bold tracking-[-0.03em] text-brand-ink">
                    Obvious 👀
                  </h3>
                  <p className="text-sm text-brand-muted leading-relaxed mt-2">
                    You should always know where to look and what to do next.
                  </p>
                </div>
              </div>
            </div>
            <svg viewBox="0 0 200 190" className="w-full h-auto" aria-hidden="true">
              <path
                d="M38 146 L84 98 L122 120 L168 54"
                fill="none"
                stroke="#0a5f57"
                strokeWidth="12"
                strokeLinecap="round"
                className="animate-dash-flow"
              />
              <rect
                x="20"
                y="128"
                width="40"
                height="40"
                rx="12"
                fill="#fffdf8"
                stroke="#182028"
                strokeWidth="4"
                className="animate-float"
              />
              <rect
                x="76"
                y="78"
                width="40"
                height="40"
                rx="12"
                fill="#d0e7dd"
                stroke="#182028"
                strokeWidth="4"
                className="animate-float-delayed"
              />
              <rect
                x="118"
                y="100"
                width="40"
                height="40"
                rx="12"
                fill="#fffdf8"
                stroke="#182028"
                strokeWidth="4"
                className="animate-float"
              />
              <circle
                cx="170"
                cy="52"
                r="20"
                fill="#57d4aa"
                stroke="#182028"
                strokeWidth="4"
                className="animate-glow-pulse"
              />
            </svg>
          </div>
        </div>

        <div className="toy-surface rounded-[2rem] border border-black/5 bg-brand-review/20 shadow-brand-shadow p-6 lg:p-8">
          <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-brand-muted">
            Main promise ✨
          </p>
          <p className="text-base text-brand-ink leading-relaxed mt-3">
            Bring the messy raw stuff. We structure it, mark the checkpoint, and tell you the next
            smart move without making you read a novel.
          </p>
        </div>
      </section>
    </PageTemplate>
  );
}
