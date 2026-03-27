# Ready For Personal Use Checklist

## Current Readiness
- Local-first multi-opportunity SBS sample workspace is available on first load.
- Guided, staff, and admin modes are working in one app shell.
- ZIP export/import uses `session.json` as the restore authority.
- Markdown and PDF handoff artifacts are generated for lifecycle summaries, candidate stories, memos, correspondence, and session summary.
- Candidate story, contextual coaching, and optional sensitive support paths are integrated into the existing SBS workflow screens.

## Before You Use It For Live Opportunities
- Export a ZIP before clearing browser storage, switching browsers, or testing resets.
- Review generated candidate story text before relying on it for outreach or interviews.
- Review sensitive support export settings if you enable that section.
- Confirm artifact text and correspondence details were parsed correctly when names, dates, or interview timing matter.

## Known Gaps
- No backend or multi-device sync exists in this version.
- Verification is now stronger, but still lightweight rather than exhaustive: `npm run smoke` and `npm run roundtrip` exist, and `npm run verify` bundles build plus browser checks.
- Client-side PDF generation adds optional export-time weight, but the heaviest export libraries are now lazy-loaded and split out of the initial app load.
- Industry coaching is currently bundled and stage-aware, but not yet dynamically tailored from imported industry packs.

## Recommended Personal Workflow
1. Duplicate the seeded SBS patterns by creating your own opportunities rather than overwriting the reference examples immediately.
2. Use artifact intake plus correspondence capture first so story generation has real evidence to work from.
3. Export a ZIP at meaningful milestones such as post-intake, post-interview, and post-offer review.
4. Keep the exported ZIPs in your own storage system because Monyawn does not retain them for you.
