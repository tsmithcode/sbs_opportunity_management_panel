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
      className="min-h-screen w-full flex items-center justify-center px-4 sm:px-6 lg:px-8 py-10 bg-[radial-gradient(circle_at_top,rgba(230,239,236,0.9),rgba(247,245,240,1)_50%)]"
    >
      <section className="w-full max-w-[1100px] grid grid-cols-1 xl:grid-cols-[minmax(0,1.1fr)_440px] gap-8 xl:gap-10 items-stretch">
        <div className="rounded-[2rem] border border-black/5 bg-white/70 shadow-brand-shadow p-8 lg:p-10 flex flex-col justify-between gap-8">
          <div className="space-y-5">
            <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-brand-accent">Monyawn = monyan</p>
            <h1 className="text-4xl sm:text-5xl xl:text-[4rem] font-extrabold tracking-[-0.05em] leading-[0.94] text-brand-ink">
              We finna get to the monyan, no cap. You hear me.
            </h1>
            <p className="max-w-[62ch] text-base lg:text-lg text-brand-muted leading-relaxed">
              You the hero, the celeb, the rockstar. This app just clears the path to the bag.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <article className="rounded-[1.5rem] border border-black/5 bg-brand-surface p-4">
              <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-brand-muted">Quick grab</p>
              <p className="text-sm text-brand-ink mt-2 leading-relaxed">Drop the message, link, or notes. We turn it into a play.</p>
            </article>
            <article className="rounded-[1.5rem] border border-black/5 bg-brand-surface p-4">
              <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-brand-muted">AI wingman</p>
              <p className="text-sm text-brand-ink mt-2 leading-relaxed">From messy texts to clean moves, no extra typing.</p>
            </article>
            <article className="rounded-[1.5rem] border border-black/5 bg-brand-surface p-4">
              <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-brand-muted">Your stash</p>
              <p className="text-sm text-brand-ink mt-2 leading-relaxed">Your data stays on your device unless you say export.</p>
            </article>
          </div>
        </div>

        <div className="rounded-[2rem] border border-black/5 bg-white/85 shadow-brand-shadow p-7 lg:p-8 flex flex-col gap-4 justify-center">
          <div className="space-y-2 mb-2">
            <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-brand-muted">Pull up</p>
            <h2 className="text-2xl font-bold tracking-[-0.04em] text-brand-ink">Get in, get paid, get out.</h2>
            <p className="text-sm text-brand-muted leading-relaxed">
              Pick the fast lane. We can stay local or add accounts later.
            </p>
          </div>

          <button
            type="button"
            onClick={onContinueGoogle}
            className="w-full rounded-full px-5 py-3 bg-brand-ink text-white font-semibold hover:bg-black transition-colors"
          >
            Slide in with Google
          </button>
          <button
            type="button"
            onClick={onContinueApple}
            className="w-full rounded-full px-5 py-3 bg-black text-white font-semibold hover:bg-black/85 transition-colors"
          >
            Slide in with Apple
          </button>
          <button
            type="button"
            onClick={onContinueLocal}
            className="w-full rounded-full px-5 py-3 bg-brand-surface border border-black/10 text-brand-ink font-semibold hover:bg-black/5 transition-colors"
          >
            Run it local
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
            No corporate zombie talk. You got the signal, we build the play.
          </p>
        </div>
      </section>
    </main>
  );
}
