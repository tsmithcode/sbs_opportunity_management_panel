import { buildSeedOpportunity } from "./base";
import { SeedBundle } from "./types";

export function buildMonyawnBundles(accountId: string, userId: string): SeedBundle[] {
  return [
    buildSeedOpportunity({
      accountId,
      userId,
      companyName: "Monyawn Pilot",
      roleTitle: "Software Engineer, Design Tools",
      source: "Recruiter outreach",
      postingUrl: "https://example.com/monyawn-design-tools",
      stageSteps: 1,
      profile: {
        skillsSummary:
          "C#, .NET, Autodesk ecosystem, CAD tooling, performance-sensitive workflows",
        experienceLevel: "Senior IC with architecture depth",
        strengths: "Desktop software, Autodesk integrations, enterprise design systems",
        gaps: "Revit API depth needs explicit ramp narrative",
      },
      resumeSummary:
        "Resume uploaded and parsed with Autodesk-heavy engineering evidence ready for intake completion.",
      jdSummary:
        "Mid-level design tools software engineer role with Revit API emphasis and Autodesk platform depth.",
      checkpointSummary:
        "Resume and job description are present. Intake is nearly complete, but profile review and fit routing still need confirmation.",
      memoType: "fit",
      memoSummary:
        "Proceed into fit review with explicit Revit-gap mitigation and seniority framing controls.",
      correspondenceSubject: "Monyawn intake follow-up draft",
      correspondenceBody:
        "Thank you for the outreach. I have strong Autodesk platform experience and would like to continue the conversation about the design tools role.",
    }),
    buildSeedOpportunity({
      accountId,
      userId,
      companyName: "Monyawn Grid",
      roleTitle: "Implementation Engineer, Grid Design Tools",
      source: "Hiring manager referral",
      postingUrl: "https://example.com/monyawn-grid-tools",
      stageSteps: 3,
      profile: {
        skillsSummary:
          "Autodesk platform work, engineering software design, systems integration, stakeholder translation",
        experienceLevel: "Senior engineer with strong platform execution depth",
        strengths: "Positioning and domain translation are strong for utilities-adjacent desktop tooling",
        gaps: "Needs sharper mid-level scope framing and utility-specific storytelling",
      },
      resumeSummary:
        "Resume tuned for Autodesk-heavy delivery work with execution-oriented scope and design-tool relevance.",
      jdSummary:
        "Role emphasizes implementation, grid design workflow knowledge, and collaborative desktop tooling support.",
      checkpointSummary:
        "Evidence supports strong fit with some domain translation work still required before outreach.",
      memoType: "positioning",
      memoSummary:
        "Positioning is viable if messaging emphasizes immediate delivery value over title inflation.",
      correspondenceSubject: "Monyawn positioning review draft",
      correspondenceBody:
        "I can contribute quickly in Autodesk-centric engineering workflows while staying hands-on and execution-focused.",
    }),
    buildSeedOpportunity({
      accountId,
      userId,
      companyName: "Monyawn Advanced",
      roleTitle: "Senior Design Tools Engineer",
      source: "Panel continuation",
      postingUrl: "https://example.com/monyawn-senior-design-tools",
      stageSteps: 6,
      profile: {
        skillsSummary:
          "Interview-ready Autodesk and enterprise tooling experience with strong systems literacy and coaching value",
        experienceLevel: "Senior IC / architect profile with proven platform depth",
        strengths: "Interview preparation and offer logic have rich evidence to work from",
        gaps: "Comp and title calibration still need careful handling",
      },
      resumeSummary:
        "Resume and supporting materials are aligned to an advanced design-tools conversation and late-stage evaluation.",
      jdSummary:
        "Late-stage role with stronger ownership expectations, broader architecture influence, and more nuanced offer tradeoffs.",
      checkpointSummary:
        "Late-stage opportunity has strong evidence depth and should surface offer-review governance clearly.",
      memoType: "offer",
      memoSummary:
        "Offer-review sample should demonstrate high-stakes guidance, compensation calibration, and explicit human review.",
      correspondenceSubject: "Monyawn late-stage follow-up",
      correspondenceBody:
        "I appreciate the continued conversation. I would like to make sure scope, level, and compensation reflect both immediate contribution and long-term fit.",
      addEscalation: {
        type: "finance",
        owner: "Finance Lead",
        severity: "medium",
        notes:
          "Late-stage sample includes comp calibration questions and should keep explicit review gates visible.",
      },
    }),
  ];
}
