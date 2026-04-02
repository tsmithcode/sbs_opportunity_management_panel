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
    { id: "account", label: "Account", note: "Create the workspace shell." },
    { id: "user", label: "User", note: "Define the operator behind the pursuit." },
    { id: "opportunity", label: "Opportunity", note: "Capture the target role and company." },
  ];
  const activeStepIndex = steps.findIndex((item) => item.id === step);
  const stepGuidance: Record<IntakeStep, { title: string; body: string; checklist: string[] }> = {
    account: {
      title: "Start with the container",
      body: "The first screen should feel calm and minimal because it only establishes the operating boundary for everything that follows.",
      checklist: [
        "Use a clear account name you would recognize in exports.",
        "Choose the account type without overthinking secondary details.",
        "Move forward once the workspace container is named and correct.",
      ],
    },
    user: {
      title: "Name the operator",
      body: "This step anchors who is pursuing the role so the later profile and evidence screens have a real owner.",
      checklist: [
        "Use the exact full name you want tied to the opportunity.",
        "Enter a working email that fits the current search posture.",
        "Keep the screen narrow and finish the two required fields cleanly.",
      ],
    },
    opportunity: {
      title: "Capture the opportunity cleanly",
      body: "This is the last intake gate, so the company and role should be precise enough to drive the workspace without extra cleanup.",
      checklist: [
        "Choose the pathway before entering company and role.",
        "Use the real company name and an exact role title.",
        "Finish intake only when the base case reads correctly at a glance.",
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
        kicker: `Intake step ${activeStepIndex + 1}`,
        title: step === "account" ? "Set the workspace boundary." : step === "user" ? "Identify the operator." : "Capture the opportunity target.",
        description: "This intake flow should feel narrow, decisive, and premium on desktop: one form in focus, one supporting rail, no competing regions.",
        actions: (
          <button className="bg-brand-surface border border-black/10 text-brand-ink px-6 py-3 rounded-full font-medium hover:bg-black/5 transition-all active:scale-95" type="button" onClick={onCancel}>Cancel and return</button>
        )
      }}
    >
      <div className="grid grid-cols-1 xl:grid-cols-[minmax(0,1.45fr)_minmax(320px,0.8fr)] gap-8 py-4">
        <div className="space-y-8 p-6 sm:p-8 lg:p-10 rounded-[2rem] bg-white/55 border border-black/5 shadow-brand-shadow">
          {step === "account" && (
            <form onSubmit={handleAccountSubmit} className="flex flex-col gap-6">
              <div>
                <h3 className="text-2xl lg:text-3xl font-bold tracking-[-0.04em] text-brand-ink mb-2">1. Account setup</h3>
                <p className="text-sm text-brand-muted">Create the enterprise-grade container for your career records.</p>
              </div>
              <label className="flex flex-col gap-1.5">
                <span className="text-[10px] font-bold uppercase tracking-widest text-brand-muted">Account Name</span>
                <input 
                  className="w-full px-4 py-2.5 rounded-xl border border-black/10 bg-brand-surface-strong focus:ring-2 focus:ring-brand-accent focus:border-transparent outline-none transition-all text-sm"
                  value={accountDraft.account_name} 
                  onChange={e => onAccountDraftChange({ ...accountDraft, account_name: e.target.value })} 
                  required 
                />
              </label>
              <label className="flex flex-col gap-1.5">
                <span className="text-[10px] font-bold uppercase tracking-widest text-brand-muted">Account Type</span>
                <select 
                  className="w-full px-4 py-2.5 rounded-xl border border-black/10 bg-brand-surface-strong focus:ring-2 focus:ring-brand-accent focus:border-transparent outline-none transition-all text-sm appearance-none"
                  value={accountDraft.account_type} 
                  onChange={e => onAccountDraftChange({ ...accountDraft, account_type: e.target.value as any })}
                >
                  <option value="enterprise">Enterprise</option>
                  <option value="individual">Individual</option>
                </select>
              </label>
              <button className="bg-brand-accent text-white px-6 py-3 rounded-full font-bold hover:bg-brand-accent-strong transition-all shadow-md active:scale-95 mt-4" type="submit">
                Continue to User Setup
              </button>
            </form>
          )}

          {step === "user" && (
            <form onSubmit={handleUserSubmit} className="flex flex-col gap-6">
              <div>
                <h3 className="text-2xl lg:text-3xl font-bold tracking-[-0.04em] text-brand-ink mb-2">2. User onboarding</h3>
                <p className="text-sm text-brand-muted">Who is pursuing this opportunity?</p>
              </div>
              <label className="flex flex-col gap-1.5">
                <span className="text-[10px] font-bold uppercase tracking-widest text-brand-muted">Full Name</span>
                <input 
                  className="w-full px-4 py-2.5 rounded-xl border border-black/10 bg-brand-surface-strong focus:ring-2 focus:ring-brand-accent focus:border-transparent outline-none transition-all text-sm"
                  value={userDraft.full_name} 
                  onChange={e => onUserDraftChange({ ...userDraft, full_name: e.target.value })} 
                  required 
                />
              </label>
              <label className="flex flex-col gap-1.5">
                <span className="text-[10px] font-bold uppercase tracking-widest text-brand-muted">Email</span>
                <input 
                  type="email" 
                  className="w-full px-4 py-2.5 rounded-xl border border-black/10 bg-brand-surface-strong focus:ring-2 focus:ring-brand-accent focus:border-transparent outline-none transition-all text-sm"
                  value={userDraft.email} 
                  onChange={e => onUserDraftChange({ ...userDraft, email: e.target.value })} 
                  required 
                />
              </label>
              <div className="flex flex-wrap gap-4 mt-6 pt-6 border-t border-black/5">
                <button className="bg-brand-surface border border-black/10 text-brand-ink px-6 py-3 rounded-full font-medium hover:bg-black/5 transition-all active:scale-95" type="button" onClick={() => setStep("account")}>Back</button>
                <button className="bg-brand-accent text-white px-6 py-3 rounded-full font-bold hover:bg-brand-accent-strong transition-all shadow-md active:scale-95" type="submit">Continue to Opportunity</button>
              </div>
            </form>
          )}

          {step === "opportunity" && (
            <form onSubmit={handleOpportunitySubmit} className="flex flex-col gap-6">
              <div>
                <h3 className="text-2xl lg:text-3xl font-bold tracking-[-0.04em] text-brand-ink mb-2">3. Opportunity details</h3>
                <p className="text-sm text-brand-muted">What is the role and company?</p>
              </div>
              <label className="flex flex-col gap-1.5">
                <span className="text-[10px] font-bold uppercase tracking-widest text-brand-muted">Pathway</span>
                <select 
                  className="w-full px-4 py-2.5 rounded-xl border border-black/10 bg-brand-surface-strong focus:ring-2 focus:ring-brand-accent focus:border-transparent outline-none transition-all text-sm appearance-none"
                  value={opportunityDraft.pathway} 
                  onChange={e => onOpportunityDraftChange({ ...opportunityDraft, pathway: e.target.value as "w2" | "1099" })}
                >
                  <option value="w2">W2 Employment / Career Progression</option>
                  <option value="1099">1099 Consulting / CAD Guardian / B2B</option>
                </select>
              </label>
              <label className="flex flex-col gap-1.5">
                <span className="text-[10px] font-bold uppercase tracking-widest text-brand-muted">Company Name</span>
                <input 
                  className="w-full px-4 py-2.5 rounded-xl border border-black/10 bg-brand-surface-strong focus:ring-2 focus:ring-brand-accent focus:border-transparent outline-none transition-all text-sm"
                  value={opportunityDraft.company_name} 
                  onChange={e => onOpportunityDraftChange({ ...opportunityDraft, company_name: e.target.value })} 
                  required 
                />
              </label>
              <label className="flex flex-col gap-1.5">
                <span className="text-[10px] font-bold uppercase tracking-widest text-brand-muted">Role Title</span>
                <input 
                  className="w-full px-4 py-2.5 rounded-xl border border-black/10 bg-brand-surface-strong focus:ring-2 focus:ring-brand-accent focus:border-transparent outline-none transition-all text-sm"
                  value={opportunityDraft.role_title} 
                  onChange={e => onOpportunityDraftChange({ ...opportunityDraft, role_title: e.target.value })} 
                  required 
                />
              </label>
              <div className="flex flex-wrap gap-4 mt-6 pt-6 border-t border-black/5">
                <button className="bg-brand-surface border border-black/10 text-brand-ink px-6 py-3 rounded-full font-medium hover:bg-black/5 transition-all active:scale-95" type="button" onClick={() => setStep("user")}>Back</button>
                <button className="bg-brand-accent text-white px-6 py-3 rounded-full font-bold hover:bg-brand-accent-strong transition-all shadow-md active:scale-95" type="submit">Complete Intake</button>
              </div>
            </form>
          )}
        </div>

        <aside className="space-y-6 xl:sticky xl:top-24">
          <section className="space-y-5 p-6 lg:p-7 rounded-[2rem] bg-[linear-gradient(160deg,rgba(255,255,255,0.98),rgba(230,239,236,0.88))] border border-brand-highlight/30 shadow-brand-shadow">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-brand-accent">Intake discipline</p>
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
