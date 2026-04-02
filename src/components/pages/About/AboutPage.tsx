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
        kicker: "System brief",
        title: "A product brief, release posture, and expert panel in one disciplined page.",
        description: "This screen should read like a premium operating memo: what the platform is for, who governs it, and how release confidence is being earned.",
        actions: (
          <>
            <a className="bg-brand-accent text-white px-6 py-3 rounded-full font-bold hover:bg-brand-accent-strong transition-all shadow-sm active:scale-95 inline-block" href={RESUME_PATH} download>Download Thomas Smith Resume</a>
            <button className="bg-brand-surface border border-black/10 text-brand-ink px-6 py-3 rounded-full font-medium hover:bg-black/5 transition-all active:scale-95" type="button" onClick={() => navigateToPage("workspace")}>Open workspace</button>
          </>
        ),
        callout: (
          <div className="p-5 rounded-[1.5rem] bg-brand-review/20 border border-brand-review/40 space-y-2" role="note">
            <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-brand-muted">Direction and purpose</p>
            <p className="text-sm text-brand-ink leading-relaxed">The company direction is to build trustworthy opportunity infrastructure with strong operator discipline, not just another job-search dashboard.</p>
          </div>
        ),
        panel: (
          <div className="space-y-5 bg-[linear-gradient(160deg,rgba(255,255,255,0.96),rgba(239,236,226,0.85))] p-6 lg:p-7 rounded-[2rem] border border-black/5 shadow-brand-shadow">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-brand-accent">Public posture</p>
              <h3 className="text-2xl font-bold text-brand-ink tracking-[-0.04em] mt-2">What the platform stands for right now</h3>
            </div>
            <div className="space-y-4">
              <div className="border-t border-black/10 pt-4">
                <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-brand-muted">Trust</p>
                <p className="text-sm text-brand-ink mt-2">Local-only user data posture with explicit export control.</p>
              </div>
              <div className="border-t border-black/10 pt-4">
                <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-brand-muted">Workflow</p>
                <p className="text-sm text-brand-ink mt-2">Guided surfaces across user, staff, and admin perspectives.</p>
              </div>
              <div className="border-t border-black/10 pt-4">
                <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-brand-muted">Value</p>
                <p className="text-sm text-brand-ink mt-2">Narrative shaping, evidence review, and durable handoff quality.</p>
              </div>
            </div>
          </div>
        )
      }}
    >
      <section className="grid grid-cols-1 xl:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] gap-8 py-4">
        <div className="rounded-[2rem] border border-black/5 bg-white/55 shadow-brand-shadow overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)]">
            <div className="p-6 lg:p-8 border-b md:border-b-0 md:border-r border-black/8">
              <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-brand-muted">Platform intent</p>
              <h3 className="text-2xl lg:text-3xl font-bold text-brand-ink tracking-[-0.04em] mt-3">Why this platform exists</h3>
              <p className="text-sm text-brand-muted leading-relaxed mt-4">
                Monyawn exists to help users pursue opportunities with stronger judgment, better narrative clarity, and a calmer system for complex decisions.
              </p>
            </div>
            <div className="p-6 lg:p-8">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-brand-muted">Workflow</p>
                  <p className="text-sm text-brand-ink mt-2 leading-relaxed">Guided opportunity intake and evidence capture with clearer stage ownership.</p>
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-brand-muted">Narrative</p>
                  <p className="text-sm text-brand-ink mt-2 leading-relaxed">Know-thyself candidate story development that stays grounded in artifacts and messages.</p>
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-brand-muted">Support</p>
                  <p className="text-sm text-brand-ink mt-2 leading-relaxed">Contextual coaching and compensation literacy without turning the workspace into content clutter.</p>
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-brand-muted">Portability</p>
                  <p className="text-sm text-brand-ink mt-2 leading-relaxed">Portable ZIP handoff with JSON, Markdown, and PDF outputs for review and delivery.</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-[2rem] border border-black/5 bg-white/48 shadow-brand-shadow p-6 lg:p-8">
          <div className="flex items-end justify-between gap-4 mb-5">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-brand-muted">Expert panel</p>
              <h3 className="text-2xl font-bold text-brand-ink tracking-[-0.04em] mt-2">Direction and purpose gates</h3>
            </div>
          </div>
          <div className="grid gap-3">
            {aboutExperts.map((expert) => (
              <article key={expert.role} className="py-3 border-t border-black/8 first:border-t-0 first:pt-0">
                <p className="text-[9px] font-bold uppercase tracking-[0.18em] text-brand-accent mb-1">{expert.role}</p>
                <p className="text-sm text-brand-muted leading-relaxed">{expert.purpose}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="grid grid-cols-1 xl:grid-cols-[minmax(0,1.15fr)_minmax(320px,0.85fr)] gap-8 mt-8">
        <div className="rounded-[2rem] border border-black/5 bg-white/55 shadow-brand-shadow p-6 lg:p-8">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-brand-muted">Release confidence</p>
              <h3 className="text-2xl font-bold text-brand-ink tracking-[-0.04em] mt-2">Verification posture</h3>
            </div>
            <div className="flex flex-wrap gap-2">
              <button className="bg-brand-surface border border-black/10 text-brand-ink px-4 py-2 rounded-full text-xs font-medium hover:bg-black/5 transition-all" type="button" onClick={handleDownloadMarkdown}>Download MD</button>
              <button className="bg-brand-surface border border-black/10 text-brand-ink px-4 py-2 rounded-full text-xs font-medium hover:bg-black/5 transition-all" type="button" onClick={handleDownloadJson}>Download JSON</button>
            </div>
          </div>
          <p className="text-sm text-brand-muted leading-relaxed mt-4">{releaseStatus.summary}</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
            {releaseStatus.currentCoverage.map((item) => (
              <article key={item} className="p-4 rounded-[1.35rem] bg-brand-highlight/10 border border-brand-highlight/30">
                <p className="text-sm text-brand-ink leading-relaxed">{item}</p>
              </article>
            ))}
          </div>
        </div>

        <aside className="rounded-[2rem] border border-black/5 bg-white/45 shadow-brand-shadow p-6 lg:p-8">
          <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-brand-muted">Editorial standard</p>
          <div className="space-y-4 mt-4">
            <div className="border-t border-black/8 pt-4">
              <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-brand-muted">Structure</p>
              <p className="text-sm text-brand-ink mt-2 leading-relaxed">This page should feel like a board memo, not a feature dump.</p>
            </div>
            <div className="border-t border-black/8 pt-4">
              <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-brand-muted">Layout</p>
              <p className="text-sm text-brand-ink mt-2 leading-relaxed">Primary brief on the left, supporting posture and gates on the right.</p>
            </div>
            <div className="border-t border-black/8 pt-4">
              <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-brand-muted">Density</p>
              <p className="text-sm text-brand-ink mt-2 leading-relaxed">Every paragraph and block needs to justify its footprint.</p>
            </div>
          </div>
        </aside>
      </section>
    </PageTemplate>
  );
}
