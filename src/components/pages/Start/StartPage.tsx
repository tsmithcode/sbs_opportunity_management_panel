import { PageTemplate } from "../../templates/PageTemplate";
import { StartPageProps } from "./StartPage.contract";

export function StartPage({ onAddSignal, onOpenWorkspace, onOpenAbout }: StartPageProps) {
  return (
    <PageTemplate
      id="start-page"
      className="min-h-[calc(100vh-72px)]"
      header={{
        kicker: "Let’s Get This Bag",
        title: "Drop the first move. We flip it into a money play.",
        description:
          "Start with what you already got: a recruiter text, a job link, a voice note, or a screenshot. We do the cleanup so you can chase the monyawn.",
        actions: (
          <>
            <button
              className="bg-brand-accent text-white px-6 py-3 rounded-full font-bold hover:bg-brand-accent-strong transition-all shadow-sm active:scale-95"
              type="button"
              onClick={onAddSignal}
            >
              Drop first move
            </button>
            <button
              className="bg-brand-surface border border-black/10 text-brand-ink px-6 py-3 rounded-full font-medium hover:bg-black/5 transition-all active:scale-95"
              type="button"
              onClick={onOpenWorkspace}
            >
              Open my grind
            </button>
            <button
              className="bg-brand-surface border border-black/10 text-brand-ink px-6 py-3 rounded-full font-medium hover:bg-black/5 transition-all active:scale-95"
              type="button"
              onClick={onOpenAbout}
            >
              Read the vibe
            </button>
          </>
        ),
        panel: (
          <div className="rounded-[2rem] border border-black/5 bg-white/75 shadow-brand-shadow p-6 lg:p-7">
            <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-brand-accent">Fast lane</p>
            <div className="space-y-4 mt-4">
              <div className="border-t border-black/8 pt-4">
                <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-brand-muted">1. Drop the proof</p>
                <p className="text-sm text-brand-ink mt-2 leading-relaxed">Paste the text, link, or note. No extra drama.</p>
              </div>
              <div className="border-t border-black/8 pt-4">
                <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-brand-muted">2. Check the draft</p>
                <p className="text-sm text-brand-ink mt-2 leading-relaxed">We fill it in. You just nod or tweak.</p>
              </div>
              <div className="border-t border-black/8 pt-4">
                <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-brand-muted">3. Make the move</p>
                <p className="text-sm text-brand-ink mt-2 leading-relaxed">Shoot the messages, prep the talk, lock the bag.</p>
              </div>
            </div>
          </div>
        ),
      }}
    >
      <section className="grid grid-cols-1 lg:grid-cols-[minmax(0,1.1fr)_minmax(300px,0.9fr)] gap-6">
        <div className="rounded-[2rem] border border-black/5 bg-white/60 shadow-brand-shadow p-6 lg:p-8">
          <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-brand-muted">How it should feel</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mt-5">
            <div>
              <h3 className="text-xl font-bold tracking-[-0.03em] text-brand-ink">Quick</h3>
              <p className="text-sm text-brand-muted leading-relaxed mt-2">Get a new move started in a few minutes.</p>
            </div>
            <div>
              <h3 className="text-xl font-bold tracking-[-0.03em] text-brand-ink">On your side</h3>
              <p className="text-sm text-brand-muted leading-relaxed mt-2">Every text or email should feel like progress, not paperwork.</p>
            </div>
            <div>
              <h3 className="text-xl font-bold tracking-[-0.03em] text-brand-ink">Clear</h3>
              <p className="text-sm text-brand-muted leading-relaxed mt-2">You always know the next move.</p>
            </div>
          </div>
        </div>

        <div className="rounded-[2rem] border border-black/5 bg-brand-review/20 shadow-brand-shadow p-6 lg:p-8">
          <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-brand-muted">Main promise</p>
          <p className="text-base text-brand-ink leading-relaxed mt-3">
            Bring the raw stuff. We structure it and tell you the next money move without the corporate zombie talk.
          </p>
        </div>
      </section>
    </PageTemplate>
  );
}
