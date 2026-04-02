import { PageTemplate } from "../../templates/PageTemplate";
import { LandingPageProps } from "./LandingPage.contract";

export function LandingPage({ onStartPursuit, onOpenAbout }: LandingPageProps) {
  return (
    <PageTemplate
      id="landing-page"
      className="min-h-[calc(100vh-72px)]"
      header={{
        kicker: "Money mode",
        title: "Run your plays, get your bag.",
        description: "Monyawn turns messy pursuit work into a clean, local flow so your proof and next moves stay sharp.",
        actions: (
          <>
            <button className="bg-brand-accent text-white px-6 py-3 rounded-full font-bold hover:bg-brand-accent-strong transition-all shadow-sm active:scale-95" type="button" onClick={onStartPursuit}>
              Start the play
            </button>
            <button className="bg-brand-surface border border-black/10 text-brand-ink px-6 py-3 rounded-full font-medium hover:bg-black/5 transition-all active:scale-95" type="button" onClick={() => window.location.hash = "workspace"}>
              Open my grind
            </button>
            <button className="bg-brand-surface border border-black/10 text-brand-ink px-6 py-3 rounded-full font-medium hover:bg-black/5 transition-all active:scale-95" type="button" onClick={onOpenAbout}>
              Read the vibe
            </button>
          </>
        ),
        panel: (
          <div className="rounded-[2rem] border border-black/5 bg-[linear-gradient(160deg,rgba(255,255,255,0.95),rgba(230,239,236,0.92))] p-6 lg:p-7 shadow-brand-shadow space-y-6">
            <div className="flex items-center justify-between gap-4">
              <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-brand-accent">No cloud drama</p>
              <span className="px-3 py-1 rounded-full bg-white/80 border border-black/10 text-[10px] font-bold tracking-[0.14em] text-brand-ink">LOCAL MODE</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 xl:grid-cols-1 gap-3">
              <div className="border-t border-black/10 pt-3">
                <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-brand-muted">Your data</p>
                <p className="text-sm text-brand-ink mt-2 leading-relaxed">Stays on your device unless you export.</p>
              </div>
              <div className="border-t border-black/10 pt-3">
                <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-brand-muted">Flow</p>
                <p className="text-sm text-brand-ink mt-2 leading-relaxed">One play at a time, proof stays tight.</p>
              </div>
              <div className="border-t border-black/10 pt-3">
                <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-brand-muted">Export</p>
                <p className="text-sm text-brand-ink mt-2 leading-relaxed">ZIP stays readable and share‑ready.</p>
              </div>
            </div>
          </div>
        )
      }}
    >
      <section className="grid grid-cols-1 xl:grid-cols-[minmax(0,1.1fr)_minmax(340px,0.9fr)] gap-8 lg:gap-10 py-4">
        <div className="rounded-[2rem] border border-black/5 bg-white/55 shadow-brand-shadow overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-[120px_minmax(0,1fr)]">
            <div className="bg-brand-ink text-white p-6 md:p-7 flex items-end">
              <p className="text-[11px] font-bold uppercase tracking-[0.24em]">Fast lane</p>
            </div>
            <div className="p-6 md:p-8 lg:p-10">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-5">
                <div className="space-y-3">
                  <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-brand-muted">01 Drop</p>
                  <h3 className="text-xl font-bold text-brand-ink tracking-[-0.03em]">Start the play</h3>
                  <p className="text-sm text-brand-muted leading-relaxed">Drop the proof and lock the basics fast.</p>
                </div>
                <div className="space-y-3">
                  <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-brand-muted">02 Proof</p>
                  <h3 className="text-xl font-bold text-brand-ink tracking-[-0.03em]">Make it real</h3>
                  <p className="text-sm text-brand-muted leading-relaxed">Turn docs and DMs into clean proof.</p>
                </div>
                <div className="space-y-3">
                  <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-brand-muted">03 Share</p>
                  <h3 className="text-xl font-bold text-brand-ink tracking-[-0.03em]">Export clean</h3>
                  <p className="text-sm text-brand-muted leading-relaxed">Share a tight ZIP, not a messy folder.</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <aside className="rounded-[2rem] border border-black/5 bg-white/60 shadow-brand-shadow p-6 lg:p-8 space-y-6">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-brand-accent">Gate rules</p>
            <h3 className="text-2xl font-bold text-brand-ink tracking-[-0.04em] mt-2">Boss‑level standard</h3>
          </div>
          <div className="space-y-4">
            <div className="border-t border-black/10 pt-4">
              <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-brand-muted">Main rule</p>
              <p className="text-sm text-brand-ink mt-2 leading-relaxed">Say what it does. No fluff.</p>
            </div>
            <div className="border-t border-black/10 pt-4">
              <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-brand-muted">Design</p>
              <p className="text-sm text-brand-ink mt-2 leading-relaxed">One hero, one support rail, nothing extra.</p>
            </div>
            <div className="border-t border-black/10 pt-4">
              <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-brand-muted">Trust</p>
              <p className="text-sm text-brand-ink mt-2 leading-relaxed">Local mode is clear before any promises.</p>
            </div>
          </div>
        </aside>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] gap-6 lg:gap-8 mt-10">
        <div className="rounded-[2rem] bg-brand-review/30 border border-brand-review/50 p-6 lg:p-8">
          <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-brand-muted">Your data</p>
          <p className="text-brand-ink text-base lg:text-lg leading-relaxed mt-3">Premium flow comes from structure, not spying. <strong className="font-bold">Everything stays in your browser unless you export it.</strong></p>
        </div>
        <div className="rounded-[2rem] border border-black/5 bg-white/45 p-6 lg:p-8">
          <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-brand-muted">Why it’s tight</p>
          <p className="text-sm text-brand-muted leading-relaxed mt-3">Every block must orient, prove, or move you forward. No decoration filler.</p>
        </div>
      </section>
    </PageTemplate>
  );
}
