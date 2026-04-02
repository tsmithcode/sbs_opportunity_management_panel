import { FormEvent, useState } from "react";
import { PageTemplate } from "../../templates/PageTemplate";
import {
  SignalIntakePageProps,
  SignalIntakePayload,
  SignalSourceType,
} from "./SignalIntakePage.contract";

const signalOptions: { id: SignalSourceType; label: string; hint: string }[] = [
  { id: "recruiter_email", label: "Recruiter email", hint: "Paste the email and let the system infer the opportunity." },
  { id: "job_link", label: "Job link", hint: "Drop the posting URL and use it to seed the opportunity." },
  { id: "job_text", label: "Job text", hint: "Paste the posting or role description directly." },
  { id: "transcript", label: "Interview transcript", hint: "Turn a transcript into interview support and next actions." },
  { id: "note", label: "Quick note", hint: "Capture context even if you only have rough notes right now." },
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
        kicker: "New Signal Intake",
        title: "Start from the real-world thing you actually have.",
        description:
          "The fastest path is not manual setup. Paste the signal, let the system structure it, and confirm what matters.",
        actions: (
          <button
            className="bg-brand-surface border border-black/10 text-brand-ink px-6 py-3 rounded-full font-medium hover:bg-black/5 transition-all active:scale-95"
            type="button"
            onClick={onBack}
          >
            Back
          </button>
        ),
        panel: (
          <div className="rounded-[2rem] border border-black/5 bg-white/80 shadow-brand-shadow p-6 lg:p-7">
            <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-brand-accent">Signal rule</p>
            <p className="text-base text-brand-ink leading-relaxed mt-3">
              Start with the signal, not the data model. The product should infer structure before it asks you to type.
            </p>
            <div className="space-y-4 mt-5">
              <div className="border-t border-black/8 pt-4">
                <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-brand-muted">Best use</p>
                <p className="text-sm text-brand-ink mt-2 leading-relaxed">{activeOption.hint}</p>
              </div>
              <div className="border-t border-black/8 pt-4">
                <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-brand-muted">Expected outcome</p>
                <p className="text-sm text-brand-ink mt-2 leading-relaxed">Company, role, source, and the next step should be easier to confirm after this page.</p>
              </div>
            </div>
          </div>
        ),
      }}
    >
      <section className="grid grid-cols-1 xl:grid-cols-[320px_minmax(0,1fr)] gap-6 items-start">
        <div className="rounded-[2rem] border border-black/5 bg-white/60 shadow-brand-shadow p-5 lg:p-6">
          <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-brand-muted">Signal types</p>
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
            <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-brand-muted mb-2">Primary input</p>
            <h2 className="text-2xl lg:text-[2rem] font-bold tracking-[-0.04em] text-brand-ink">{activeOption.label}</h2>
            <p className="text-sm text-brand-muted leading-relaxed mt-2">{activeOption.hint}</p>
          </div>

          {(signalType === "job_link" || signalType === "recruiter_email") && (
            <label className="flex flex-col gap-1.5">
              <span className="text-[10px] font-bold uppercase tracking-widest text-brand-muted">
                {signalType === "job_link" ? "Posting URL" : "Referenced URL"}
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
              {signalType === "job_link" ? "Optional supporting text" : "Paste the signal"}
            </span>
            <textarea
              value={signalText}
              onChange={(event) => setSignalText(event.target.value)}
              className="w-full px-4 py-3 rounded-2xl border border-black/10 bg-brand-surface-strong focus:ring-2 focus:ring-brand-accent focus:border-transparent outline-none transition-all text-sm resize-none"
              rows={12}
              placeholder={
                signalType === "transcript"
                  ? "Paste the interview transcript or debrief notes."
                  : signalType === "recruiter_email"
                    ? "Paste the recruiter email here."
                    : signalType === "job_text"
                      ? "Paste the job description or role text."
                      : signalType === "note"
                        ? "Paste your notes or quick context."
                        : "Optional supporting text."
              }
              required={signalType !== "job_link"}
            />
          </label>

          <div className="flex flex-wrap gap-4 items-center">
            <button
              type="submit"
              className="bg-brand-accent text-white px-6 py-3 rounded-full font-bold hover:bg-brand-accent-strong transition-all shadow-md active:scale-95"
            >
              Structure this opportunity
            </button>
            <p className="text-xs text-brand-muted">
              The current flow will prefill the opportunity draft and move you into guided confirmation.
            </p>
          </div>
        </form>
      </section>
    </PageTemplate>
  );
}
