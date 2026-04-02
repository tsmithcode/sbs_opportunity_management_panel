import { PageTemplate } from "../../templates/PageTemplate";
import { LandingPageProps } from "./LandingPage.contract";

export function LandingPage({ onStartPursuit, onOpenAbout }: LandingPageProps) {
  return (
    <PageTemplate
      id="landing-page"
      className="min-h-[calc(100vh-72px)]"
      header={{
        kicker: "Career operating system",
        title: "High-stakes opportunity management with principal-level discipline.",
        description: "Monyawn turns pursuit work into a compact, governed, local-first flow so evidence, decisions, and next actions stay sharp instead of sprawling across tabs and documents.",
        actions: (
          <>
            <button className="bg-brand-accent text-white px-6 py-3 rounded-full font-bold hover:bg-brand-accent-strong transition-all shadow-sm active:scale-95" type="button" onClick={onStartPursuit}>
              Start intake
            </button>
            <button className="bg-brand-surface border border-black/10 text-brand-ink px-6 py-3 rounded-full font-medium hover:bg-black/5 transition-all active:scale-95" type="button" onClick={() => window.location.hash = "workspace"}>
              Open workspace
            </button>
            <button className="bg-brand-surface border border-black/10 text-brand-ink px-6 py-3 rounded-full font-medium hover:bg-black/5 transition-all active:scale-95" type="button" onClick={onOpenAbout}>
              Read system brief
            </button>
          </>
        ),
        panel: (
          <div className="rounded-[2rem] border border-black/5 bg-[linear-gradient(160deg,rgba(255,255,255,0.95),rgba(230,239,236,0.92))] p-6 lg:p-7 shadow-brand-shadow space-y-6">
            <div className="flex items-center justify-between gap-4">
              <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-brand-accent">Executive posture</p>
              <span className="px-3 py-1 rounded-full bg-white/80 border border-black/10 text-[10px] font-bold tracking-[0.14em] text-brand-ink">LOCAL-FIRST</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 xl:grid-cols-1 gap-3">
              <div className="border-t border-black/10 pt-3">
                <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-brand-muted">Data boundary</p>
                <p className="text-sm text-brand-ink mt-2 leading-relaxed">Your records stay on-device unless you explicitly export them.</p>
              </div>
              <div className="border-t border-black/10 pt-3">
                <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-brand-muted">Operating model</p>
                <p className="text-sm text-brand-ink mt-2 leading-relaxed">One guided opportunity at a time, with durable evidence and clear stage ownership.</p>
              </div>
              <div className="border-t border-black/10 pt-3">
                <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-brand-muted">Handoff quality</p>
                <p className="text-sm text-brand-ink mt-2 leading-relaxed">Export-ready packets stay human-readable for review, delivery, and audit.</p>
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
              <p className="text-[11px] font-bold uppercase tracking-[0.24em]">Golden path</p>
            </div>
            <div className="p-6 md:p-8 lg:p-10">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-5">
                <div className="space-y-3">
                  <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-brand-muted">01 Intake</p>
                  <h3 className="text-xl font-bold text-brand-ink tracking-[-0.03em]">Capture the base case</h3>
                  <p className="text-sm text-brand-muted leading-relaxed">Set the account, user, and opportunity frame without drowning the screen in fields.</p>
                </div>
                <div className="space-y-3">
                  <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-brand-muted">02 Evidence</p>
                  <h3 className="text-xl font-bold text-brand-ink tracking-[-0.03em]">Shape the record</h3>
                  <p className="text-sm text-brand-muted leading-relaxed">Turn documents, profile edits, and correspondence into governed proof.</p>
                </div>
                <div className="space-y-3">
                  <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-brand-muted">03 Handoff</p>
                  <h3 className="text-xl font-bold text-brand-ink tracking-[-0.03em]">Export with discipline</h3>
                  <p className="text-sm text-brand-muted leading-relaxed">Leave the workspace with a clean packet instead of a loose bundle of files.</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <aside className="rounded-[2rem] border border-black/5 bg-white/60 shadow-brand-shadow p-6 lg:p-8 space-y-6">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-brand-accent">Panel gate</p>
            <h3 className="text-2xl font-bold text-brand-ink tracking-[-0.04em] mt-2">Principal operator standard</h3>
          </div>
          <div className="space-y-4">
            <div className="border-t border-black/10 pt-4">
              <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-brand-muted">CEO / Product</p>
              <p className="text-sm text-brand-ink mt-2 leading-relaxed">The page states exactly what the system is for and does not waste the first screen on decorative filler.</p>
            </div>
            <div className="border-t border-black/10 pt-4">
              <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-brand-muted">Design / UX</p>
              <p className="text-sm text-brand-ink mt-2 leading-relaxed">One dominant hero, one supporting posture rail, and compact supporting structure below.</p>
            </div>
            <div className="border-t border-black/10 pt-4">
              <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-brand-muted">Security / Trust</p>
              <p className="text-sm text-brand-ink mt-2 leading-relaxed">Local-first posture is explicit before any workflow promise is made.</p>
            </div>
          </div>
        </aside>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] gap-6 lg:gap-8 mt-10">
        <div className="rounded-[2rem] bg-brand-review/30 border border-brand-review/50 p-6 lg:p-8">
          <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-brand-muted">Privacy first</p>
          <p className="text-brand-ink text-base lg:text-lg leading-relaxed mt-3">Monyawn is designed so the premium experience comes from structure and judgment, not from collecting more of your data. <strong className="font-bold">Everything stays in your browser unless you export it.</strong></p>
        </div>
        <div className="rounded-[2rem] border border-black/5 bg-white/45 p-6 lg:p-8">
          <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-brand-muted">Why the page is compact</p>
          <p className="text-sm text-brand-muted leading-relaxed mt-3">Magazine logic: every region must orient, prove, or move the user forward. Nothing here exists only to decorate the page.</p>
        </div>
      </section>
    </PageTemplate>
  );
}
