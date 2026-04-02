import { FormEvent, useState } from "react";
import { PageTemplate } from "../../templates/PageTemplate";
import {
  SignalIntakePageProps,
  SignalIntakePayload,
  SignalSourceType,
} from "./SignalIntakePage.contract";

const signalOptions: { id: SignalSourceType; label: string; hint: string }[] = [
  { id: "recruiter_email", label: "Recruiter text/email", hint: "Paste it. We read the play for you." },
  { id: "job_link", label: "Job link", hint: "Drop the link. We pull the key facts." },
  { id: "job_text", label: "Job text", hint: "Paste the role write-up. We clean it up." },
  { id: "transcript", label: "Interview transcript", hint: "Turn raw talk into next moves." },
  { id: "note", label: "Quick note", hint: "Rough notes are fine. We shape it." },
];

export function SignalIntakePage({ onBack, onSubmitSignal }: SignalIntakePageProps) {
  const [signalType, setSignalType] = useState<SignalSourceType>("recruiter_email");
  const [signalText, setSignalText] = useState("");
  const [signalUrl, setSignalUrl] = useState("");

  const activeOption = signalOptions.find((option) => option.id === signalType) ?? signalOptions[0];

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const payload: SignalIntakePayload = {
      signalType,
      signalText: signalText.trim(),
      signalUrl: signalUrl.trim(),
    };

    onSubmitSignal(payload);
  };

  return (
    <PageTemplate
      id="signal-intake-page"
      header={{
        kicker: "Drop The Proof",
        title: "Start with what you got. We do the cleanup.",
        description:
          "No corporate zombie talk. Drop the message or link, and we flip it into a money move.",
        actions: (
          <button
            className="bg-brand-surface border border-black/10 text-brand-ink px-6 py-3 rounded-full font-medium hover:bg-black/5 transition-all active:scale-95"
            type="button"
            onClick={onBack}
          >
            Go back
          </button>
        ),
        panel: (
          <div className="rounded-[2rem] border border-black/5 bg-white/80 shadow-brand-shadow p-6 lg:p-7">
            <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-brand-accent">The rule</p>
            <p className="text-base text-brand-ink leading-relaxed mt-3">
              Start with the signal, not the paperwork. We infer the structure before we ask you to type.
            </p>
            <div className="space-y-4 mt-5">
              <div className="border-t border-black/8 pt-4">
                <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-brand-muted">Best use</p>
                <p className="text-sm text-brand-ink mt-2 leading-relaxed">{activeOption.hint}</p>
              </div>
              <div className="border-t border-black/8 pt-4">
                <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-brand-muted">What you get</p>
                <p className="text-sm text-brand-ink mt-2 leading-relaxed">Company, role, and your next move ready to approve.</p>
              </div>
            </div>
          </div>
        ),
      }}
    >
      <section className="grid grid-cols-1 xl:grid-cols-[320px_minmax(0,1fr)] gap-6 items-start">
        <div className="rounded-[2rem] border border-black/5 bg-white/60 shadow-brand-shadow p-5 lg:p-6">
          <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-brand-muted">What you got</p>
          <div className="space-y-3 mt-4">
            {signalOptions.map((option) => (
              <button
                key={option.id}
                type="button"
                onClick={() => setSignalType(option.id)}
                className={`w-full text-left rounded-[1.25rem] border px-4 py-3 transition-all ${
                  signalType === option.id
                    ? "border-brand-accent/30 bg-brand-highlight/20"
                    : "border-black/5 bg-brand-surface hover:bg-black/5"
                }`}
              >
                <p className="text-sm font-semibold text-brand-ink">{option.label}</p>
                <p className="text-xs text-brand-muted mt-1">{option.hint}</p>
              </button>
            ))}
          </div>
        </div>

        <form
          onSubmit={handleSubmit}
          className="rounded-[2rem] border border-black/5 bg-white/60 shadow-brand-shadow p-6 sm:p-8 lg:p-9 flex flex-col gap-6"
        >
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-brand-muted mb-2">Main drop</p>
            <h2 className="text-2xl lg:text-[2rem] font-bold tracking-[-0.04em] text-brand-ink">{activeOption.label}</h2>
            <p className="text-sm text-brand-muted leading-relaxed mt-2">{activeOption.hint}</p>
          </div>

          {(signalType === "job_link" || signalType === "recruiter_email") && (
            <label className="flex flex-col gap-1.5">
              <span className="text-[10px] font-bold uppercase tracking-widest text-brand-muted">
                {signalType === "job_link" ? "Job link" : "Link inside the message"}
              </span>
              <input
                value={signalUrl}
                onChange={(event) => setSignalUrl(event.target.value)}
                className="w-full px-4 py-3 rounded-2xl border border-black/10 bg-brand-surface-strong focus:ring-2 focus:ring-brand-accent focus:border-transparent outline-none transition-all text-sm"
                placeholder="https://"
              />
            </label>
          )}

            <label className="flex flex-col gap-1.5">
            <span className="text-[10px] font-bold uppercase tracking-widest text-brand-muted">
              {signalType === "job_link" ? "Extra context (optional)" : "Paste the proof"}
            </span>
            <textarea
              value={signalText}
              onChange={(event) => setSignalText(event.target.value)}
              className="w-full px-4 py-3 rounded-2xl border border-black/10 bg-brand-surface-strong focus:ring-2 focus:ring-brand-accent focus:border-transparent outline-none transition-all text-sm resize-none"
              rows={12}
              placeholder={
                signalType === "transcript"
                  ? "Paste the interview transcript or notes."
                  : signalType === "recruiter_email"
                    ? "Paste the recruiter message here."
                    : signalType === "job_text"
                      ? "Paste the job description or role text."
                      : signalType === "note"
                        ? "Paste your notes or quick context."
                        : "Extra context."
              }
              required={signalType !== "job_link"}
            />
          </label>

          <div className="flex flex-wrap gap-4 items-center">
            <button
              type="submit"
              className="bg-brand-accent text-white px-6 py-3 rounded-full font-bold hover:bg-brand-accent-strong transition-all shadow-md active:scale-95"
            >
              Flip it into a play
            </button>
            <p className="text-xs text-brand-muted">
              We auto-fill the draft and take you to the confirm screen.
            </p>
          </div>
        </form>
      </section>
    </PageTemplate>
  );
}
