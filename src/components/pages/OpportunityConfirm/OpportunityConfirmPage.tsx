import { FormEvent } from "react";
import { PageTemplate } from "../../templates/PageTemplate";
import { OpportunityConfirmPageProps } from "./OpportunityConfirmPage.contract";

const pathwayOptions = [
  { value: "w2", label: "W-2 employee path" },
  { value: "1099", label: "1099 / contract path" },
] as const;

export function OpportunityConfirmPage({
  userDraft,
  opportunityDraft,
  onUserDraftChange,
  onOpportunityDraftChange,
  onBack,
  onOpenAdvanced,
  onConfirm,
}: OpportunityConfirmPageProps) {
  const canContinue = Boolean(
    userDraft.full_name.trim() &&
      opportunityDraft.company_name.trim() &&
      opportunityDraft.role_title.trim(),
  );

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!canContinue) {
      return;
    }
    onConfirm();
  };

  return (
    <PageTemplate
      id="opportunity-confirm-page"
      header={{
        kicker: "Opportunity Confirm",
        title: "Confirm the draft and create the opportunity.",
        description:
          "This step should feel like approval, not setup. Keep only the fields needed to start cleanly and move the rest into guided follow-up.",
        actions: (
          <div className="flex flex-wrap gap-3">
            <button
              className="bg-brand-surface border border-black/10 text-brand-ink px-6 py-3 rounded-full font-medium hover:bg-black/5 transition-all active:scale-95"
              type="button"
              onClick={onBack}
            >
              Back
            </button>
            <button
              className="bg-white border border-black/10 text-brand-ink px-6 py-3 rounded-full font-medium hover:bg-black/5 transition-all active:scale-95"
              type="button"
              onClick={onOpenAdvanced}
            >
              Open advanced intake
            </button>
          </div>
        ),
        panel: (
          <div className="rounded-[2rem] border border-black/5 bg-white/85 shadow-brand-shadow p-6 lg:p-7">
            <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-brand-accent">
              Golden path
            </p>
            <div className="space-y-4 mt-4">
              <div className="border-t border-black/8 pt-4">
                <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-brand-muted">
                  What happens next
                </p>
                <p className="text-sm text-brand-ink mt-2 leading-relaxed">
                  We create the opportunity, preserve the original signal, and route you into the working surface with profile and task scaffolding ready.
                </p>
              </div>
              <div className="border-t border-black/8 pt-4">
                <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-brand-muted">
                  Keep this page small
                </p>
                <p className="text-sm text-brand-ink mt-2 leading-relaxed">
                  If a field is not required to start the opportunity, it belongs later in the guided flow.
                </p>
              </div>
            </div>
          </div>
        ),
      }}
    >
      <section className="grid grid-cols-1 xl:grid-cols-[minmax(0,1fr)_320px] gap-6 items-start">
        <form
          onSubmit={handleSubmit}
          className="rounded-[2rem] border border-black/5 bg-white/70 shadow-brand-shadow p-6 sm:p-8 lg:p-9 flex flex-col gap-6"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <label className="flex flex-col gap-1.5">
              <span className="text-[10px] font-bold uppercase tracking-widest text-brand-muted">
                Full name
              </span>
              <input
                value={userDraft.full_name}
                onChange={(event) =>
                  onUserDraftChange({ ...userDraft, full_name: event.target.value })
                }
                className="w-full px-4 py-3 rounded-2xl border border-black/10 bg-brand-surface-strong focus:ring-2 focus:ring-brand-accent focus:border-transparent outline-none transition-all text-sm"
                placeholder="Your name"
                required
              />
            </label>

            <label className="flex flex-col gap-1.5">
              <span className="text-[10px] font-bold uppercase tracking-widest text-brand-muted">
                Email
              </span>
              <input
                value={userDraft.email}
                onChange={(event) =>
                  onUserDraftChange({ ...userDraft, email: event.target.value })
                }
                className="w-full px-4 py-3 rounded-2xl border border-black/10 bg-brand-surface-strong focus:ring-2 focus:ring-brand-accent focus:border-transparent outline-none transition-all text-sm"
                placeholder="name@example.com"
                type="email"
              />
            </label>

            <label className="flex flex-col gap-1.5">
              <span className="text-[10px] font-bold uppercase tracking-widest text-brand-muted">
                Company
              </span>
              <input
                value={opportunityDraft.company_name}
                onChange={(event) =>
                  onOpportunityDraftChange({
                    ...opportunityDraft,
                    company_name: event.target.value,
                  })
                }
                className="w-full px-4 py-3 rounded-2xl border border-black/10 bg-brand-surface-strong focus:ring-2 focus:ring-brand-accent focus:border-transparent outline-none transition-all text-sm"
                placeholder="Company name"
                required
              />
            </label>

            <label className="flex flex-col gap-1.5">
              <span className="text-[10px] font-bold uppercase tracking-widest text-brand-muted">
                Role
              </span>
              <input
                value={opportunityDraft.role_title}
                onChange={(event) =>
                  onOpportunityDraftChange({
                    ...opportunityDraft,
                    role_title: event.target.value,
                  })
                }
                className="w-full px-4 py-3 rounded-2xl border border-black/10 bg-brand-surface-strong focus:ring-2 focus:ring-brand-accent focus:border-transparent outline-none transition-all text-sm"
                placeholder="Role title"
                required
              />
            </label>

            <label className="flex flex-col gap-1.5">
              <span className="text-[10px] font-bold uppercase tracking-widest text-brand-muted">
                Pathway
              </span>
              <select
                value={opportunityDraft.pathway}
                onChange={(event) =>
                  onOpportunityDraftChange({
                    ...opportunityDraft,
                    pathway: event.target.value as "w2" | "1099",
                  })
                }
                className="w-full px-4 py-3 rounded-2xl border border-black/10 bg-brand-surface-strong focus:ring-2 focus:ring-brand-accent focus:border-transparent outline-none transition-all text-sm"
              >
                {pathwayOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </label>

            <label className="flex flex-col gap-1.5">
              <span className="text-[10px] font-bold uppercase tracking-widest text-brand-muted">
                Job link
              </span>
              <input
                value={opportunityDraft.job_posting_url}
                onChange={(event) =>
                  onOpportunityDraftChange({
                    ...opportunityDraft,
                    job_posting_url: event.target.value,
                  })
                }
                className="w-full px-4 py-3 rounded-2xl border border-black/10 bg-brand-surface-strong focus:ring-2 focus:ring-brand-accent focus:border-transparent outline-none transition-all text-sm"
                placeholder="Optional URL"
                type="url"
              />
            </label>
          </div>

          <div className="rounded-[1.5rem] border border-brand-highlight/30 bg-brand-highlight/10 px-4 py-4 flex flex-col gap-2">
            <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-brand-muted">
              Source
            </p>
            <p className="text-sm text-brand-ink leading-relaxed">
              {opportunityDraft.opportunity_source || "Signal intake"}
            </p>
            <p className="text-xs text-brand-muted leading-relaxed">
              You can refine profile details, artifacts, correspondence, and interview support after creation.
            </p>
          </div>

          <div className="flex flex-wrap gap-4 items-center">
            <button
              type="submit"
              disabled={!canContinue}
              className="bg-brand-accent text-white px-6 py-3 rounded-full font-bold hover:bg-brand-accent-strong transition-all shadow-md active:scale-95 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Create opportunity
            </button>
            <p className="text-xs text-brand-muted">
              Required here: your name, company, and role. Everything else can stay downstream.
            </p>
          </div>
        </form>

        <aside className="rounded-[2rem] border border-black/5 bg-white/60 shadow-brand-shadow p-6 lg:p-7">
          <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-brand-muted">
            Review rail
          </p>
          <div className="space-y-4 mt-4">
            <div className="border-t border-black/8 pt-4">
              <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-brand-muted">
                Person
              </p>
              <p className="text-sm text-brand-ink mt-2 leading-relaxed">
                {userDraft.full_name || "Waiting for your name"}
              </p>
              <p className="text-xs text-brand-muted mt-1 break-all">
                {userDraft.email || "Email can be added now or later"}
              </p>
            </div>
            <div className="border-t border-black/8 pt-4">
              <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-brand-muted">
                Opportunity
              </p>
              <p className="text-sm text-brand-ink mt-2 leading-relaxed">
                {opportunityDraft.company_name || "Company pending"}
              </p>
              <p className="text-xs text-brand-muted mt-1">
                {opportunityDraft.role_title || "Role pending"}
              </p>
            </div>
            <div className="border-t border-black/8 pt-4">
              <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-brand-muted">
                Why this page exists
              </p>
              <p className="text-sm text-brand-ink mt-2 leading-relaxed">
                To make sure the product starts from a calm approval moment instead of another overloaded setup screen.
              </p>
            </div>
          </div>
        </aside>
      </section>
    </PageTemplate>
  );
}
