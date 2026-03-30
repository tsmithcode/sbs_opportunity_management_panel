import { releaseStatus } from "../../../releaseStatus";
import { PageTemplate } from "../../templates/PageTemplate";
import { AboutPageProps, aboutExperts } from "./AboutPage.contract";

function formatTimestampForFile(value: string) {
  return value.replace(/[-:]/g, "").replace(/\.\d+Z$/, "Z");
}

function downloadTextFile(filename: string, content: string, mimeType: string) {
  const blob = new Blob([content], { type: mimeType });
  const url = window.URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  anchor.click();
  window.URL.revokeObjectURL(url);
}

export function AboutPage({ RESUME_PATH, navigateToPage, setNotice }: AboutPageProps) {
  function handleDownloadMarkdown() {
    const generatedAt = new Date().toISOString();
    const content = `# Release Summary\n\nGenerated: \`${generatedAt}\`\n\n## Summary\n${releaseStatus.summary}\n\n## Local Checks\n${releaseStatus.localChecks.map(i => `- \`${i}\``).join("\n")}\n\n## CI Checks\n${releaseStatus.ciChecks.map(i => `- ${i}`).join("\n")}\n`;
    downloadTextFile(`release-summary-${formatTimestampForFile(generatedAt)}.md`, content, "text/markdown;charset=utf-8");
    setNotice({ tone: "success", message: "Release summary markdown downloaded." });
  }

  function handleDownloadJson() {
    const generatedAt = new Date().toISOString();
    const content = JSON.stringify({ generatedAt, ...releaseStatus }, null, 2);
    downloadTextFile(`release-summary-${formatTimestampForFile(generatedAt)}.json`, content, "application/json;charset=utf-8");
    setNotice({ tone: "success", message: "Release summary JSON downloaded." });
  }

  return (
    <PageTemplate
      id="main-content"
      banner={{
        strongText: "Live build — 7-day sprint in progress.",
        text: "This platform is being built in public to demonstrate production-ready delivery under real pressure.",
        tone: "success"
      }}
      header={{
        kicker: "About Monyawn",
        title: "A local-first platform built to help people move with clarity.",
        description: "Monyawn is designed to turn opportunity management into a guided, evidence-backed, human-readable workflow.",
        actions: (
          <>
            <a className="primary-action" href={RESUME_PATH} download>Download Thomas Smith Resume</a>
            <button className="secondary-action" type="button" onClick={() => navigateToPage("workspace")}>Open workspace</button>
          </>
        ),
        callout: (
          <div className="warning-callout" role="note">
            <p className="panel-label">Direction and purpose</p>
            <p>The company direction is to build trustworthy opportunity infrastructure.</p>
          </div>
        ),
        panel: (
          <>
            <p className="panel-label">Current public posture</p>
            <ul className="plain-list">
              <li>Local-only user data posture</li>
              <li>Guided workflow across user, staff, and admin perspectives</li>
              <li>Candidate story and coaching are core value surfaces</li>
            </ul>
          </>
        )
      }}
    >
      <section className="record-grid">
        <div className="stage-block">
          <h3>What this platform is for</h3>
          <p>
            Monyawn exists to help users pursue opportunities with stronger judgment, better
            narrative clarity, and a calmer operating system for complex decisions.
          </p>
          <ul className="plain-list">
            <li>Guided opportunity intake and evidence capture</li>
            <li>Know-thyself candidate story development</li>
            <li>Contextual coaching and compensation literacy</li>
            <li>Portable ZIP handoff with JSON, Markdown, and PDF outputs</li>
          </ul>
        </div>

        <div className="stage-block">
          <h3>Direction and purpose experts</h3>
          <div className="stack-list">
            {aboutExperts.map((expert) => (
              <article key={expert.role} className="mini-card">
                <p className="panel-label">{expert.role}</p>
                <p>{expert.purpose}</p>
              </article>
            ))}
          </div>
        </div>

        <div className="stage-block">
          <h3>Release confidence</h3>
          <p>{releaseStatus.summary}</p>
          <div className="stage-footer">
            <button className="secondary-action" type="button" onClick={handleDownloadMarkdown}>Download release summary MD</button>
            <button className="secondary-action" type="button" onClick={handleDownloadJson}>Download release summary JSON</button>
          </div>
          <div className="stack-list">
            <article className="mini-card">
              <p className="panel-label">Current coverage</p>
              <ul className="plain-list">
                {releaseStatus.currentCoverage.map((item) => (<li key={item}>{item}</li>))}
              </ul>
            </article>
          </div>
        </div>
      </section>
    </PageTemplate>
  );
}
