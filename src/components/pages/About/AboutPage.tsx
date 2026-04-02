import { useState } from "react";
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
  const [downloadFormat, setDownloadFormat] = useState<"md" | "json">("md");
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

  function handleDownloadReleasePack() {
    if (downloadFormat === "json") {
      handleDownloadJson();
    } else {
      handleDownloadMarkdown();
    }
  }

  return (
    <PageTemplate
      id="main-content"
      banner={{
        strongText: "Live build — no corporate zombie talk.",
        text: "We’re building this in public to prove it moves fast and stays real.",
        tone: "success"
      }}
      header={{
        kicker: "The vibe",
        title: "This is the money lane. No cap, no corporate zombie talk.",
        description: "You’re the hero. This page says what we do, why it helps you get paid, and how we keep it clean.",
        actions: (
          <>
            <a className="bg-brand-accent text-white px-6 py-3 rounded-full font-bold hover:bg-brand-accent-strong transition-all shadow-sm active:scale-95 inline-block" href={RESUME_PATH} download>Download Thomas Smith Resume</a>
            <button className="bg-brand-surface border border-black/10 text-brand-ink px-6 py-3 rounded-full font-medium hover:bg-black/5 transition-all active:scale-95" type="button" onClick={() => navigateToPage("workspace")}>Open my grind</button>
          </>
        ),
        callout: (
          <div className="p-5 rounded-[1.5rem] bg-brand-review/20 border border-brand-review/40 space-y-2" role="note">
            <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-brand-muted">The rule</p>
            <p className="text-sm text-brand-ink leading-relaxed">Fuck all this corporate zombie shit. This is about your money and your name.</p>
          </div>
        ),
        panel: (
          <div className="space-y-5 bg-[linear-gradient(160deg,rgba(255,255,255,0.96),rgba(239,236,226,0.85))] p-6 lg:p-7 rounded-[2rem] border border-black/5 shadow-brand-shadow">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-brand-accent">What we stand on</p>
              <h3 className="text-2xl font-bold text-brand-ink tracking-[-0.04em] mt-2">Your money, your rules</h3>
            </div>
            <div className="space-y-4">
              <div className="border-t border-black/10 pt-4">
                <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-brand-muted">Privacy</p>
                <p className="text-sm text-brand-ink mt-2">Local-only data. You choose if it leaves.</p>
              </div>
              <div className="border-t border-black/10 pt-4">
                <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-brand-muted">Flow</p>
                <p className="text-sm text-brand-ink mt-2">Fast moves, clean proof, real progress.</p>
              </div>
              <div className="border-t border-black/10 pt-4">
                <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-brand-muted">Money</p>
                <p className="text-sm text-brand-ink mt-2">We turn chaos into a playable bag.</p>
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
              <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-brand-muted">Why we exist</p>
              <h3 className="text-2xl lg:text-3xl font-bold text-brand-ink tracking-[-0.04em] mt-3">Because money talks</h3>
              <p className="text-sm text-brand-muted leading-relaxed mt-4">
                Monyawn helps you chase opportunities with clear proof, clear words, and a path to the bag.
              </p>
            </div>
            <div className="p-6 lg:p-8">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-brand-muted">Flow</p>
                  <p className="text-sm text-brand-ink mt-2 leading-relaxed">Drop proof, confirm, move fast.</p>
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-brand-muted">Story</p>
                  <p className="text-sm text-brand-ink mt-2 leading-relaxed">Your story backed by proof, not fluff.</p>
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-brand-muted">Support</p>
                  <p className="text-sm text-brand-ink mt-2 leading-relaxed">Tips if you want them, no overload.</p>
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-brand-muted">Portability</p>
                  <p className="text-sm text-brand-ink mt-2 leading-relaxed">Export a ZIP and take it anywhere.</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-[2rem] border border-black/5 bg-white/48 shadow-brand-shadow p-6 lg:p-8">
          <div className="flex items-end justify-between gap-4 mb-5">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-brand-muted">Gatekeepers</p>
              <h3 className="text-2xl font-bold text-brand-ink tracking-[-0.04em] mt-2">Who keeps it real</h3>
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
              <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-brand-muted">Proof</p>
              <h3 className="text-2xl font-bold text-brand-ink tracking-[-0.04em] mt-2">Verification vibes</h3>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <select
                value={downloadFormat}
                onChange={(event) => setDownloadFormat(event.target.value as "md" | "json")}
                className="px-3 py-2 rounded-full bg-white/70 text-brand-ink text-xs font-semibold border border-black/10 focus:outline-none focus:ring-1 focus:ring-brand-accent"
                aria-label="Select download format"
              >
                <option value="md">Markdown</option>
                <option value="json">JSON</option>
              </select>
              <button
                className="bg-brand-surface border border-black/10 text-brand-ink px-4 py-2 rounded-full text-xs font-medium hover:bg-black/5 transition-all"
                type="button"
                onClick={handleDownloadReleasePack}
              >
                Download pack
              </button>
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
          <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-brand-muted">Style rules</p>
          <div className="space-y-4 mt-4">
            <div className="border-t border-black/8 pt-4">
              <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-brand-muted">Structure</p>
              <p className="text-sm text-brand-ink mt-2 leading-relaxed">Keep it sharp. No fluff.</p>
            </div>
            <div className="border-t border-black/8 pt-4">
              <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-brand-muted">Layout</p>
              <p className="text-sm text-brand-ink mt-2 leading-relaxed">Main message left, proof right.</p>
            </div>
            <div className="border-t border-black/8 pt-4">
              <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-brand-muted">Density</p>
              <p className="text-sm text-brand-ink mt-2 leading-relaxed">Every line earns its spot.</p>
            </div>
          </div>
        </aside>
      </section>
    </PageTemplate>
  );
}
