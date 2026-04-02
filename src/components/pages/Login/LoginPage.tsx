import { LoginPageProps } from "./LoginPage.contract";

export function LoginPage({
  onContinueLocal,
  onContinueGoogle,
  onContinueApple,
}: LoginPageProps) {
  return (
    <main
      id="main-content"
      className="min-h-screen w-full flex items-center justify-center px-4 sm:px-6 lg:px-8 py-10 bg-[radial-gradient(circle_at_top,rgba(230,239,236,0.9),rgba(247,245,240,1)_50%)]"
    >
      <section className="w-full max-w-[1100px] grid grid-cols-1 xl:grid-cols-[minmax(0,1.1fr)_440px] gap-8 xl:gap-10 items-stretch">
        <div className="rounded-[2rem] border border-black/5 bg-white/70 shadow-brand-shadow p-8 lg:p-10 flex flex-col justify-between gap-8">
          <div className="space-y-5">
            <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-brand-accent">Monyawn</p>
            <h1 className="text-4xl sm:text-5xl xl:text-[4rem] font-extrabold tracking-[-0.05em] leading-[0.94] text-brand-ink">
              Opportunity management that feels calm from the first click.
            </h1>
            <p className="max-w-[62ch] text-base lg:text-lg text-brand-muted leading-relaxed">
              Sign in and move straight into a guided flow for recruiter emails, job links, transcripts, and next-step decisions.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <article className="rounded-[1.5rem] border border-black/5 bg-brand-surface p-4">
              <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-brand-muted">Fast intake</p>
              <p className="text-sm text-brand-ink mt-2 leading-relaxed">Paste a signal and let the system structure the opportunity.</p>
            </article>
            <article className="rounded-[1.5rem] border border-black/5 bg-brand-surface p-4">
              <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-brand-muted">AI support</p>
              <p className="text-sm text-brand-ink mt-2 leading-relaxed">Move from raw email or transcript to next action without hunting for sections.</p>
            </article>
            <article className="rounded-[1.5rem] border border-black/5 bg-brand-surface p-4">
              <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-brand-muted">Local first</p>
              <p className="text-sm text-brand-ink mt-2 leading-relaxed">Your work stays under your control while the flow stays export-ready.</p>
            </article>
          </div>
        </div>

        <div className="rounded-[2rem] border border-black/5 bg-white/85 shadow-brand-shadow p-7 lg:p-8 flex flex-col gap-4 justify-center">
          <div className="space-y-2 mb-2">
            <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-brand-muted">Login</p>
            <h2 className="text-2xl font-bold tracking-[-0.04em] text-brand-ink">Get into the product fast.</h2>
            <p className="text-sm text-brand-muted leading-relaxed">
              Choose the fastest path. You can continue locally today and layer in identity providers without changing the product flow.
            </p>
          </div>

          <button
            type="button"
            onClick={onContinueGoogle}
            className="w-full rounded-full px-5 py-3 bg-brand-ink text-white font-semibold hover:bg-black transition-colors"
          >
            Sign in with Google
          </button>
          <button
            type="button"
            onClick={onContinueApple}
            className="w-full rounded-full px-5 py-3 bg-black text-white font-semibold hover:bg-black/85 transition-colors"
          >
            Sign in with Apple
          </button>
          <button
            type="button"
            onClick={onContinueLocal}
            className="w-full rounded-full px-5 py-3 bg-brand-surface border border-black/10 text-brand-ink font-semibold hover:bg-black/5 transition-colors"
          >
            Continue locally
          </button>

          <p className="text-xs text-brand-muted leading-relaxed mt-2">
            The first product goal is simple: get you from a recruiter signal to a structured opportunity with minimal effort.
          </p>
        </div>
      </section>
    </main>
  );
}
