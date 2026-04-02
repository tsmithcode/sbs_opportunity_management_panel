import { useState } from "react";
import { PageTemplate } from "../../templates/PageTemplate";
import { IntakeFlowProps } from "./IntakeFlow.contract";

type IntakeStep = "account" | "user" | "opportunity";

export function IntakeFlow({
  accountDraft, onAccountDraftChange, onAccountSubmit,
  userDraft, onUserDraftChange, onUserSubmit,
  opportunityDraft, onOpportunityDraftChange, onOpportunitySubmit,
  onComplete, onCancel
}: IntakeFlowProps) {
  const [step, setStep] = useState<IntakeStep>("account");
  const steps: { id: IntakeStep; label: string; note: string }[] = [
    { id: "account", label: "Squad", note: "Name the home base." },
    { id: "user", label: "You", note: "Lock in who’s getting the bag." },
    { id: "opportunity", label: "The Play", note: "Set the company + role." },
  ];
  const activeStepIndex = steps.findIndex((item) => item.id === step);
  const stepGuidance: Record<IntakeStep, { title: string; body: string; checklist: string[] }> = {
    account: {
      title: "Name the home base",
      body: "This is just your base name so exports don’t look crazy later.",
      checklist: [
        "Pick a name you’ll recognize fast.",
        "Choose the type without overthinking it.",
        "Move once it looks right.",
      ],
    },
    user: {
      title: "Put your name on it",
      body: "This locks the hero to the play so everything else lines up.",
      checklist: [
        "Use the name you actually want on the bag.",
        "Email can be real or later, your call.",
        "Keep it short and move on.",
      ],
    },
    opportunity: {
      title: "Lock the play",
      body: "Company + role should be clean enough to run without extra cleanup.",
      checklist: [
        "Pick the deal type first.",
        "Use the real company name and exact role.",
        "Finish only when it looks right at a glance.",
      ],
    },
  };
  const activeGuide = stepGuidance[step];

  const handleAccountSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    onAccountSubmit(e);
    setStep("user");
  };

  const handleUserSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    onUserSubmit(e);
    setStep("opportunity");
  };

  const handleOpportunitySubmit = (e: React.FormEvent<HTMLFormElement>) => {
    onOpportunitySubmit(e);
    onComplete();
  };

  return (
    <PageTemplate
      id="intake-flow"
      header={{
        kicker: `Setup step ${activeStepIndex + 1}`,
        title: step === "account" ? "Name the base." : step === "user" ? "Claim the hero." : "Lock the play.",
        description: "Keep it tight. One form, one rail, no extra noise.",
        actions: (
          <button className="bg-brand-surface border border-black/10 text-brand-ink px-6 py-3 rounded-full font-medium hover:bg-black/5 transition-all active:scale-95" type="button" onClick={onCancel}>Cancel and bounce</button>
        )
      }}
    >
      <div className="grid grid-cols-1 xl:grid-cols-[minmax(0,1.45fr)_minmax(320px,0.8fr)] gap-8 py-4">
        <div className="space-y-8 p-6 sm:p-8 lg:p-10 rounded-[2rem] bg-white/55 border border-black/5 shadow-brand-shadow">
          {step === "account" && (
            <form onSubmit={handleAccountSubmit} className="flex flex-col gap-6">
              <div>
                <h3 className="text-2xl lg:text-3xl font-bold tracking-[-0.04em] text-brand-ink mb-2">1. Name your base</h3>
                <p className="text-sm text-brand-muted">Just the home name for your plays.</p>
              </div>
              <label className="flex flex-col gap-1.5">
                <span className="text-[10px] font-bold uppercase tracking-widest text-brand-muted">Base name</span>
                <input 
                  className="w-full px-4 py-2.5 rounded-xl border border-black/10 bg-brand-surface-strong focus:ring-2 focus:ring-brand-accent focus:border-transparent outline-none transition-all text-sm"
                  value={accountDraft.account_name} 
                  onChange={e => onAccountDraftChange({ ...accountDraft, account_name: e.target.value })} 
                  required 
                />
              </label>
              <label className="flex flex-col gap-1.5">
                <span className="text-[10px] font-bold uppercase tracking-widest text-brand-muted">Base type</span>
                <select 
                  className="w-full px-4 py-2.5 rounded-xl border border-black/10 bg-brand-surface-strong focus:ring-2 focus:ring-brand-accent focus:border-transparent outline-none transition-all text-sm appearance-none"
                  value={accountDraft.account_type} 
                  onChange={e => onAccountDraftChange({ ...accountDraft, account_type: e.target.value as any })}
                >
                  <option value="enterprise">Crew / org</option>
                  <option value="individual">Solo</option>
                </select>
              </label>
              <button className="bg-brand-accent text-white px-6 py-3 rounded-full font-bold hover:bg-brand-accent-strong transition-all shadow-md active:scale-95 mt-4" type="submit">
                Next: your name
              </button>
            </form>
          )}

          {step === "user" && (
            <form onSubmit={handleUserSubmit} className="flex flex-col gap-6">
              <div>
                <h3 className="text-2xl lg:text-3xl font-bold tracking-[-0.04em] text-brand-ink mb-2">2. Claim the hero</h3>
                <p className="text-sm text-brand-muted">Who’s getting the bag?</p>
              </div>
              <label className="flex flex-col gap-1.5">
                <span className="text-[10px] font-bold uppercase tracking-widest text-brand-muted">Your name</span>
                <input 
                  className="w-full px-4 py-2.5 rounded-xl border border-black/10 bg-brand-surface-strong focus:ring-2 focus:ring-brand-accent focus:border-transparent outline-none transition-all text-sm"
                  value={userDraft.full_name} 
                  onChange={e => onUserDraftChange({ ...userDraft, full_name: e.target.value })} 
                  required 
                />
              </label>
              <label className="flex flex-col gap-1.5">
                <span className="text-[10px] font-bold uppercase tracking-widest text-brand-muted">Email (optional)</span>
                <input 
                  type="email" 
                  className="w-full px-4 py-2.5 rounded-xl border border-black/10 bg-brand-surface-strong focus:ring-2 focus:ring-brand-accent focus:border-transparent outline-none transition-all text-sm"
                  value={userDraft.email} 
                  onChange={e => onUserDraftChange({ ...userDraft, email: e.target.value })} 
                />
              </label>
              <div className="flex flex-wrap gap-4 mt-6 pt-6 border-t border-black/5">
                <button className="bg-brand-surface border border-black/10 text-brand-ink px-6 py-3 rounded-full font-medium hover:bg-black/5 transition-all active:scale-95" type="button" onClick={() => setStep("account")}>Back</button>
                <button className="bg-brand-accent text-white px-6 py-3 rounded-full font-bold hover:bg-brand-accent-strong transition-all shadow-md active:scale-95" type="submit">Next: the play</button>
              </div>
            </form>
          )}

          {step === "opportunity" && (
            <form onSubmit={handleOpportunitySubmit} className="flex flex-col gap-6">
              <div>
                <h3 className="text-2xl lg:text-3xl font-bold tracking-[-0.04em] text-brand-ink mb-2">3. Lock the play</h3>
                <p className="text-sm text-brand-muted">Company and role, keep it clean.</p>
              </div>
              <label className="flex flex-col gap-1.5">
                <span className="text-[10px] font-bold uppercase tracking-widest text-brand-muted">Deal type</span>
                <select 
                  className="w-full px-4 py-2.5 rounded-xl border border-black/10 bg-brand-surface-strong focus:ring-2 focus:ring-brand-accent focus:border-transparent outline-none transition-all text-sm appearance-none"
                  value={opportunityDraft.pathway} 
                  onChange={e => onOpportunityDraftChange({ ...opportunityDraft, pathway: e.target.value as "w2" | "1099" })}
                >
                  <option value="w2">Payroll job</option>
                  <option value="1099">Contract bag</option>
                </select>
              </label>
              <label className="flex flex-col gap-1.5">
                <span className="text-[10px] font-bold uppercase tracking-widest text-brand-muted">Company</span>
                <input 
                  className="w-full px-4 py-2.5 rounded-xl border border-black/10 bg-brand-surface-strong focus:ring-2 focus:ring-brand-accent focus:border-transparent outline-none transition-all text-sm"
                  value={opportunityDraft.company_name} 
                  onChange={e => onOpportunityDraftChange({ ...opportunityDraft, company_name: e.target.value })} 
                  required 
                />
              </label>
              <label className="flex flex-col gap-1.5">
                <span className="text-[10px] font-bold uppercase tracking-widest text-brand-muted">Role</span>
                <input 
                  className="w-full px-4 py-2.5 rounded-xl border border-black/10 bg-brand-surface-strong focus:ring-2 focus:ring-brand-accent focus:border-transparent outline-none transition-all text-sm"
                  value={opportunityDraft.role_title} 
                  onChange={e => onOpportunityDraftChange({ ...opportunityDraft, role_title: e.target.value })} 
                  required 
                />
              </label>
              <div className="flex flex-wrap gap-4 mt-6 pt-6 border-t border-black/5">
                <button className="bg-brand-surface border border-black/10 text-brand-ink px-6 py-3 rounded-full font-medium hover:bg-black/5 transition-all active:scale-95" type="button" onClick={() => setStep("user")}>Back</button>
                <button className="bg-brand-accent text-white px-6 py-3 rounded-full font-bold hover:bg-brand-accent-strong transition-all shadow-md active:scale-95" type="submit">Finish and go</button>
              </div>
            </form>
          )}
        </div>

        <aside className="space-y-6 xl:sticky xl:top-24">
          <section className="space-y-5 p-6 lg:p-7 rounded-[2rem] bg-[linear-gradient(160deg,rgba(255,255,255,0.98),rgba(230,239,236,0.88))] border border-brand-highlight/30 shadow-brand-shadow">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-brand-accent">Keep it clean</p>
              <h3 className="text-2xl font-bold tracking-[-0.04em] text-brand-ink mt-2">{activeGuide.title}</h3>
              <p className="text-sm text-brand-muted leading-relaxed mt-3">{activeGuide.body}</p>
            </div>
            <div className="space-y-3">
              {activeGuide.checklist.map((item) => (
                <div key={item} className="flex gap-3 border-t border-black/8 pt-3">
                  <span className="mt-1.5 h-2 w-2 rounded-full bg-brand-accent flex-none" />
                  <p className="text-sm text-brand-ink leading-relaxed">{item}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="p-6 lg:p-7 rounded-[2rem] bg-white/60 border border-black/5 shadow-brand-shadow">
            <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-brand-muted">Step map</p>
            <div className="mt-4 space-y-3">
              {steps.map((item, index) => {
                const status =
                  index < activeStepIndex ? "done" : index === activeStepIndex ? "active" : "next";

                return (
                  <div key={item.id} className={`rounded-[1.25rem] border px-4 py-3 ${status === "active" ? "border-brand-accent/30 bg-brand-highlight/20" : "border-black/5 bg-brand-surface"}`}>
                    <div className="flex items-center justify-between gap-3">
                      <p className="text-sm font-semibold text-brand-ink">{item.label}</p>
                      <span className={`text-[10px] font-bold uppercase tracking-[0.16em] ${status === "active" ? "text-brand-accent" : "text-brand-muted"}`}>{status}</span>
                    </div>
                    <p className="text-xs text-brand-muted mt-2">{item.note}</p>
                  </div>
                );
              })}
            </div>
          </section>
        </aside>
      </div>
    </PageTemplate>
  );
}
