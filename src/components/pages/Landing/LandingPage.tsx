import { PageTemplate } from "../../templates/PageTemplate";
import { LandingPageProps } from "./LandingPage.contract";

export function LandingPage({ onStartPursuit, onOpenAbout }: LandingPageProps) {
  return (
    <PageTemplate
      id="landing-page"
      header={{
        kicker: "Money + Yawn = Monyawn 🥱",
        title: "Landing $100k-$300k+ roles should feel like a yawn.",
        description: "You have the skills. We provide the guidance. Monyawn is your local-first guardian angel for high-stakes career moves. Move from ambiguity to outcome with total data sovereignty.",
        actions: (
          <>
            <button className="primary-action" type="button" onClick={onStartPursuit}>
              Start my pursuit
            </button>
            <button className="secondary-action" type="button" onClick={() => window.location.hash = "workspace"}>
              Go to Workspace 🥱
            </button>
            <button className="secondary-action" type="button" onClick={onOpenAbout}>
              How it works
            </button>
          </>
        ),
        panel: (
          <div className="landing-posture-panel">
            <p className="panel-label">Platform Integrity 🥱</p>
            <ul className="plain-list">
              <li><strong>Local-Only:</strong> Your data never leaves your device.</li>
              <li><strong>Export-Ready:</strong> One-click ZIP handoff packages.</li>
              <li><strong>AI-Native:</strong> Guided coaching for Gen Z and Boomers.</li>
            </ul>
          </div>
        )
      }}
    >
      <section className="record-grid">
        <div className="stage-block">
          <p className="panel-label">Step 01</p>
          <h3>Guided Intake 🥱</h3>
          <p>Securely capture your profile and opportunity details in a calm, step-by-step onboarding flow.</p>
        </div>
        <div className="stage-block">
          <p className="panel-label">Step 02</p>
          <h3>Evidence Shaping 🥱</h3>
          <p>Upload resumes and correspondence. Let our AI-native panel help you tune your narrative.</p>
        </div>
        <div className="stage-block">
          <p className="panel-label">Step 03</p>
          <h3>Durable Handoff 🥱</h3>
          <p>Export a professional, human-readable packet for internal review or final application.</p>
        </div>
      </section>

      <section className="warning-callout" style={{ marginTop: '3rem', textAlign: 'center' }}>
        <p className="panel-label">Privacy First</p>
        <p>Monyawn is built on a \"Zero-Retention\" architecture. We don't store your data on our servers because we don't have servers. <strong>Everything stays in your browser.</strong></p>
      </section>
    </PageTemplate>
  );
}
