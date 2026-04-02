import { AppState } from "../../types";
import {
  renderReadinessPacketMarkdown,
  renderReleaseSummaryJson,
  renderReleaseSummaryMarkdown,
} from "../markdown";

export async function buildReleaseReadinessZip(state: AppState): Promise<Blob> {
  const { default: JSZip } = await import("jszip");
  const zip = new JSZip();

  zip.file(
    "README.md",
    `# Release Readiness Packet

This packet was generated locally from the current Monyawn workspace.

## Included Files
- release-summary.md
- release-summary.json
- buyer-readiness-packet.md

## Use Guidance
- This packet is human-readable and exportable.
- It does not replace the durable handoff ZIP used for full workspace recovery.
- It is intended for release review, buyer-readiness review, and internal operational handoff.
`,
  );
  zip.file("release-summary.md", renderReleaseSummaryMarkdown());
  zip.file("release-summary.json", `${renderReleaseSummaryJson()}\n`);
  zip.file("buyer-readiness-packet.md", renderReadinessPacketMarkdown(state));

  return zip.generateAsync({ type: "blob" });
}
