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
        kicker: `Step: ${step.toUpperCase()} 🥱`,
        title: step === "account" ? "Let's set up your account" : step === "user" ? "Tell us about yourself" : "Capture the opportunity",
        description: "Making the complex feel easy. Everything stays local, secure, and private.",
        actions: (
          <button className="secondary-action" type="button" onClick={onCancel}>Cancel and return</button>
        )
      }}
    >
      <div className="record-grid">
        <div className="stage-block col-span-2">
          {step === "account" && (
            <form onSubmit={handleAccountSubmit} className="field-stack">
              <h3>1. Account Setup 🥱</h3>
              <p>Create the enterprise-grade container for your career records.</p>
              <label className="field">
                <span>Account Name</span>
                <input value={accountDraft.account_name} onChange={e => onAccountDraftChange({ ...accountDraft, account_name: e.target.value })} required />
              </label>
              <label className="field">
                <span>Account Type</span>
                <select value={accountDraft.account_type} onChange={e => onAccountDraftChange({ ...accountDraft, account_type: e.target.value as any })}>
                  <option value="enterprise">Enterprise</option>
                  <option value="individual">Individual</option>
                </select>
              </label>
              <button className="primary-action" type="submit" style={{ marginTop: '1.5rem' }}>Continue to User Setup</button>
            </form>
          )}

          {step === "user" && (
            <form onSubmit={handleUserSubmit} className="field-stack">
              <h3>2. User Onboarding</h3>
              <p>Who is pursuing this opportunity?</p>
              <label className="field">
                <span>Full Name</span>
                <input value={userDraft.full_name} onChange={e => onUserDraftChange({ ...userDraft, full_name: e.target.value })} required />
              </label>
              <label className="field">
                <span>Email</span>
                <input type="email" value={userDraft.email} onChange={e => onUserDraftChange({ ...userDraft, email: e.target.value })} required />
              </label>
              <div className="platform-button-row" style={{ marginTop: '1.5rem' }}>
                <button className="secondary-action" type="button" onClick={() => setStep("account")}>Back</button>
                <button className="primary-action" type="submit">Continue to Opportunity</button>
              </div>
            </form>
          )}

          {step === "opportunity" && (
            <form onSubmit={handleOpportunitySubmit} className="field-stack">
              <h3>3. Opportunity Details</h3>
              <p>What is the role and company?</p>
              <label className="field">
                <span>Company Name</span>
                <input value={opportunityDraft.company_name} onChange={e => onOpportunityDraftChange({ ...opportunityDraft, company_name: e.target.value })} required />
              </label>
              <label className="field">
                <span>Role Title</span>
                <input value={opportunityDraft.role_title} onChange={e => onOpportunityDraftChange({ ...opportunityDraft, role_title: e.target.value })} required />
              </label>
              <div className="platform-button-row" style={{ marginTop: '1.5rem' }}>
                <button className="secondary-action" type="button" onClick={() => setStep("user")}>Back</button>
                <button className="primary-action" type="submit">Complete Intake</button>
              </div>
            </form>
          )}
        </div>

        <aside className="stage-block">
          <p className="panel-label">Expert Tip</p>
          <p>The <strong>Opportunity Strategist</strong> recommends capturing as much detail as possible early on to build a stronger evidence base for your candidate story.</p>
        </aside>
      </div>
    </PageTemplate>
  );
}
