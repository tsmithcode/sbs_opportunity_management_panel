import { PageTemplate } from "../../templates/PageTemplate";
import { StartPageProps } from "./StartPage.contract";

export function StartPage({ onAddSignal, onOpenWorkspace, onOpenAbout }: StartPageProps) {
  return (
    <PageTemplate
      id="start-page"
      className="min-h-[calc(100vh-72px)]"
      header={{
        kicker: "Get Started",
        title: "Bring in the first signal. Let the system do the organizing.",
        description:
          "Start from the real-world thing you actually have right now: a recruiter email, job link, transcript, or note. The product should structure the opportunity before it asks you for effort.",
        actions: (
          <>
            <button
              className="bg-brand-accent text-white px-6 py-3 rounded-full font-bold hover:bg-brand-accent-strong transition-all shadow-sm active:scale-95"
              type="button"
              onClick={onAddSignal}
            >
              Add your first signal
            </button>
            <button
              className="bg-brand-surface border border-black/10 text-brand-ink px-6 py-3 rounded-full font-medium hover:bg-black/5 transition-all active:scale-95"
              type="button"
              onClick={onOpenWorkspace}
            >
              Open existing opportunity
            </button>
            <button
              className="bg-brand-surface border border-black/10 text-brand-ink px-6 py-3 rounded-full font-medium hover:bg-black/5 transition-all active:scale-95"
              type="button"
              onClick={onOpenAbout}
            >
              Read the system brief
            </button>
          </>
        ),
        panel: (
          <div className="rounded-[2rem] border border-black/5 bg-white/75 shadow-brand-shadow p-6 lg:p-7">
            <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-brand-accent">Fastest path</p>
            <div className="space-y-4 mt-4">
              <div className="border-t border-black/8 pt-4">
                <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-brand-muted">1. Drop the signal</p>
                <p className="text-sm text-brand-ink mt-2 leading-relaxed">Paste the recruiter email, job link, transcript, or note.</p>
              </div>
              <div className="border-t border-black/8 pt-4">
                <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-brand-muted">2. Confirm the draft</p>
                <p className="text-sm text-brand-ink mt-2 leading-relaxed">Approve what the system inferred instead of typing from scratch.</p>
              </div>
              <div className="border-t border-black/8 pt-4">
                <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-brand-muted">3. Move the opportunity</p>
                <p className="text-sm text-brand-ink mt-2 leading-relaxed">Use guided next steps for messages, interview prep, and outcome decisions.</p>
              </div>
            </div>
          </div>
        ),
      }}
    >
      <section className="grid grid-cols-1 lg:grid-cols-[minmax(0,1.1fr)_minmax(300px,0.9fr)] gap-6">
        <div className="rounded-[2rem] border border-black/5 bg-white/60 shadow-brand-shadow p-6 lg:p-8">
          <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-brand-muted">What the product should feel like</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mt-5">
            <div>
              <h3 className="text-xl font-bold tracking-[-0.03em] text-brand-ink">Fast</h3>
              <p className="text-sm text-brand-muted leading-relaxed mt-2">Most new opportunities should start in under five minutes.</p>
            </div>
            <div>
              <h3 className="text-xl font-bold tracking-[-0.03em] text-brand-ink">Supportive</h3>
              <p className="text-sm text-brand-muted leading-relaxed mt-2">Every recruiter touchpoint should feel like progress, not admin work.</p>
            </div>
            <div>
              <h3 className="text-xl font-bold tracking-[-0.03em] text-brand-ink">Predictable</h3>
              <p className="text-sm text-brand-muted leading-relaxed mt-2">Users should never wonder where to look, what matters, or what comes next.</p>
            </div>
          </div>
        </div>

        <div className="rounded-[2rem] border border-black/5 bg-brand-review/20 shadow-brand-shadow p-6 lg:p-8">
          <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-brand-muted">Primary promise</p>
          <p className="text-base text-brand-ink leading-relaxed mt-3">
            Bring the raw input. Let the product structure the opportunity, preserve context, and recommend the next move without overwhelming the screen.
          </p>
        </div>
      </section>
    </PageTemplate>
  );
}
