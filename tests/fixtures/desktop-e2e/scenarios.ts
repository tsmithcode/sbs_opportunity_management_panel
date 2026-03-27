export type DesktopE2EScenario = {
  id: string;
  title: string;
  finalOutcome: "closed_won" | "closed_lost";
  posting: {
    company: string;
    roleTitle: string;
    source: string;
    url: string;
    locationType: string;
    employmentType: string;
    snapshotPath: string;
  };
  persona: {
    accountName: string;
    fullName: string;
    email: string;
    currentRole: string;
    targetRoleFamily: string;
    targetCompensation: string;
    accessibilityNeeds: string;
  };
  profile: {
    skillsSummary: string;
    experienceLevel: string;
    domainStrengths: string;
    declaredGaps: string;
  };
  artifacts: Array<{
    type:
      | "resume"
      | "job_description"
      | "message"
      | "note"
      | "offer"
      | "debrief"
      | "generated_output"
      | "other";
    label: string;
    evidenceNote: string;
    contentSummary: string;
  }>;
  correspondence: {
    channel: "email" | "linkedin" | "note";
    subject: string;
    body: string;
  };
  support?: {
    categories: Array<
      | "layoff"
      | "fired"
      | "quit_without_notice"
      | "criminal_history"
      | "reentry"
      | "background_concern"
    >;
    notes: string;
    encouragementPlan: string;
    includeInExport: boolean;
    alsoVerifyIncludedExport?: boolean;
  };
};

export const desktopE2EScenarios: DesktopE2EScenario[] = [
  {
    id: "scenario-a-non-sensitive",
    title: "Scenario A - standard non-sensitive candidate path",
    finalOutcome: "closed_won",
    posting: {
      company: "Zoox",
      roleTitle: "Senior/Staff Software Engineer - Operational Tools",
      source: "Live public posting snapshot captured on 2026-03-27",
      url: "https://jobs.lever.co/zoox/b6799ed0-252b-4535-a908-af77eb130415",
      locationType: "Hybrid - Foster City / Seattle / San Diego",
      employmentType: "Full-time",
      snapshotPath: "tests/fixtures/desktop-e2e/postings/zoox-operational-tools.md",
    },
    persona: {
      accountName: "Town Hall Desktop Proof A",
      fullName: "Jordan Rivera",
      email: "jordan.rivera@example.com",
      currentRole: "Senior Software Engineer, Desktop Tools",
      targetRoleFamily: "Operational tooling and product software",
      targetCompensation: "$240K total compensation target",
      accessibilityNeeds: "Desktop-first review, larger text in long-form reading surfaces",
    },
    profile: {
      skillsSummary:
        "Full-stack TypeScript, React, desktop workflow tooling, operational dashboards, and design-system quality.",
      experienceLevel: "Senior / Staff-level software engineer",
      domainStrengths:
        "Workflow-heavy product surfaces, human-in-the-loop tooling, platform operations, and pragmatic frontend architecture.",
      declaredGaps:
        "Direct autonomous vehicle fleet experience is limited, but adjacent operational tooling and high-stakes UI ownership are strong.",
    },
    artifacts: [
      {
        type: "resume",
        label: "Jordan Rivera resume",
        evidenceNote: "Core profile and operating-history evidence",
        contentSummary:
          "Jordan Rivera\njordan.rivera@example.com\n(415) 555-0189\nCurrent role: Senior Software Engineer, Desktop Tools\nRecent work with operational dashboards, human review workflows, and TypeScript/React product systems at River Forge Labs.\nLocation: Hybrid, Seattle, WA\nAvailability: April 14, 2026 at 10:30 AM works for an interview.\nContingency: can reschedule if needed and provide references.",
      },
      {
        type: "job_description",
        label: "Zoox operational tools posting snapshot",
        evidenceNote: "Live posting frozen for repeatable proof",
        contentSummary:
          "Senior/Staff Software Engineer - Operational Tools at Zoox.\nHybrid role across Foster City, Seattle, or San Diego.\nFocus on full-stack systems, real-time vehicle monitoring, live support tooling, JavaScript/TypeScript, Node.js, HTML, CSS, and front-end frameworks such as React.\nInterview process likely includes recruiter screen, hiring manager interview, and technical panel on April 22, 2026 at 1:00 PM.",
      },
    ],
    correspondence: {
      channel: "email",
      subject: "Zoox operational tools follow-up with recruiter Maya Chen",
      body:
        "Hello Maya Chen,\nThank you for the conversation about the Senior/Staff Software Engineer - Operational Tools role at Zoox.\nI am available for a recruiter screen on April 22, 2026 at 1:00 PM or April 23, 2026 at 11:30 AM.\nMy phone is (415) 555-0189 and my email is jordan.rivera@example.com.\nIf needed, I can share additional examples of TypeScript, React, and operational tooling work.\nRegards,\nJordan Rivera",
    },
  },
  {
    id: "scenario-b-reentry",
    title: "Scenario B - felony and re-entry path",
    finalOutcome: "closed_won",
    posting: {
      company: "Merlin Labs",
      roleTitle: "Simulation Software Engineer",
      source: "Live public posting snapshot captured on 2026-03-27",
      url: "https://jobs.lever.co/merlinlabs/e81539bf-31a4-440a-8477-9c8d0871173a",
      locationType: "Remote with hybrid options in Boston / Denver / Mojave",
      employmentType: "Full-time",
      snapshotPath: "tests/fixtures/desktop-e2e/postings/merlin-simulation-software-engineer.md",
    },
    persona: {
      accountName: "Town Hall Desktop Proof B",
      fullName: "Marcus Hale",
      email: "marcus.hale@example.com",
      currentRole: "Simulation Software Engineer",
      targetRoleFamily: "Simulation and engineering systems",
      targetCompensation: "$185K total compensation target",
      accessibilityNeeds: "Needs clean desktop spacing and strong keyboard-first flow",
    },
    profile: {
      skillsSummary:
        "C++, Python, simulation systems, test harnesses, CI discipline, and technical storytelling under scrutiny.",
      experienceLevel: "Senior simulation-focused engineer",
      domainStrengths:
        "Simulation environments, systems integration, continuous integration, and writing software that supports review-heavy engineering operations.",
      declaredGaps:
        "Needs careful narrative around re-entry and criminal-history timing; direct aviation domain depth is still developing.",
    },
    artifacts: [
      {
        type: "resume",
        label: "Marcus Hale resume",
        evidenceNote: "Re-entry candidate operating profile",
        contentSummary:
          "Marcus Hale\nmarcus.hale@example.com\n(617) 555-0199\nSimulation engineer with C++, Python, integration testing, and CI pipeline experience.\nWorked with synthetic sensor data, test benches, and desktop validation environments.\nRemote from Denver, CO.\nInterview availability: April 18, 2026 at 9:00 AM.\nContingency: background review may require extra documentation and timing.",
      },
      {
        type: "job_description",
        label: "Merlin simulation software engineer posting snapshot",
        evidenceNote: "Live posting frozen for repeatable proof",
        contentSummary:
          "Simulation Software Engineer at Merlin Labs.\nRemote with hybrid options in Boston, Denver, and Mojave.\nRole covers simulation environments, desktop testing environments, piloted simulators, cloud environments, C++ 11+, Python or JavaScript/TypeScript, and CI.\nInterview process expected to include recruiter conversation, engineering interview, and simulation systems review on April 24, 2026 at 2:00 PM.",
      },
    ],
    correspondence: {
      channel: "email",
      subject: "Merlin Labs simulation engineer follow-up with recruiter Elena Park",
      body:
        "Hello Elena Park,\nI appreciated the overview of the Simulation Software Engineer role at Merlin Labs.\nI am available for the recruiter interview on April 24, 2026 at 2:00 PM, and I can also meet on April 25, 2026 at 10:00 AM.\nPlease use marcus.hale@example.com or call (617) 555-0199.\nIf needed, I can provide more detail on simulation pipelines, CI, and integration testing.\nRegards,\nMarcus Hale",
    },
    support: {
      categories: ["criminal_history", "reentry", "background_concern"],
      notes:
        "Keep disclosure timing narrow, only record what helps planning, and focus on role fit plus practical readiness.",
      encouragementPlan:
        "Break the process into weekly tasks, use one calm disclosure script, and document proof points that show discipline and reliability since re-entry.",
      includeInExport: false,
      alsoVerifyIncludedExport: true,
    },
  },
  {
    id: "scenario-c-transition-stress",
    title: "Scenario C - layoff or termination recovery path",
    finalOutcome: "closed_lost",
    posting: {
      company: "Johnson Controls",
      roleTitle: "Senior Controls Systems Engineer (hybrid)",
      source: "Live public posting snapshot captured on 2026-03-27",
      url: "https://jobs.johnsoncontrols.com/job/WD30261744",
      locationType: "Hybrid / onsite Glendale, Wisconsin",
      employmentType: "Full-time",
      snapshotPath: "tests/fixtures/desktop-e2e/postings/johnson-controls-senior-controls-systems-engineer.md",
    },
    persona: {
      accountName: "Town Hall Desktop Proof C",
      fullName: "Avery Brooks",
      email: "avery.brooks@example.com",
      currentRole: "Controls and systems software engineer",
      targetRoleFamily: "Controls systems and industrial software",
      targetCompensation: "$140K base target plus strong benefits",
      accessibilityNeeds: "Prefers compact desktop layouts with low noise",
    },
    profile: {
      skillsSummary:
        "Controls software, modeling, simulation, MATLAB/Simulink exposure, and cross-functional engineering delivery.",
      experienceLevel: "Senior engineer in transition",
      domainStrengths:
        "Control systems thinking, modeling, simulation, and translating technical breadth into stable operational outcomes.",
      declaredGaps:
        "Recent layoff created urgency; relocation and HVAC-specific depth need careful discussion before commit.",
    },
    artifacts: [
      {
        type: "resume",
        label: "Avery Brooks resume",
        evidenceNote: "Transition-stress candidate profile",
        contentSummary:
          "Avery Brooks\navery.brooks@example.com\n(262) 555-0144\nControls and systems engineer with software development experience, modeling, simulation, and cross-functional delivery.\nRecently impacted by a layoff and now prioritizing stable hybrid roles.\nLocation: Milwaukee, WI.\nAvailable for interviews on April 20, 2026 at 3:30 PM.",
      },
      {
        type: "job_description",
        label: "Johnson Controls controls systems engineer posting snapshot",
        evidenceNote: "Live posting frozen for repeatable proof",
        contentSummary:
          "Senior Controls Systems Engineer (hybrid) at Johnson Controls.\nGlendale, Wisconsin.\nRole includes building automation systems, control theory, thermodynamics, heat transfer, models, algorithms, control sequences, MATLAB, Simulink, and 5+ years of related software development experience.\nSalary range is listed as $90,000 to $112,000.\nInterview timing can start April 20, 2026 at 3:30 PM.",
      },
      {
        type: "offer",
        label: "Compensation comparison notes",
        evidenceNote: "Used to stress compensation coaching and decision review",
        contentSummary:
          "Base range posted at $90,000 to $112,000, but candidate target is higher based on systems and software breadth.\nNeed explicit compare on title, runway, benefits, and whether hybrid relocation tradeoffs are acceptable.",
      },
    ],
    correspondence: {
      channel: "email",
      subject: "Johnson Controls controls systems engineer follow-up with manager Priya Nair",
      body:
        "Hello Priya Nair,\nThank you for the discussion regarding the Senior Controls Systems Engineer role at Johnson Controls.\nI am available on April 20, 2026 at 3:30 PM and April 21, 2026 at 11:00 AM.\nYou can reach me at avery.brooks@example.com or (262) 555-0144.\nI would also welcome a conversation about compensation range, relocation expectations, and how software depth fits the controls scope.\nRegards,\nAvery Brooks",
    },
    support: {
      categories: ["layoff"],
      notes:
        "The layoff should be framed briefly and factually without turning the workflow into a grief log.",
      encouragementPlan:
        "Keep the explanation short, track runway pressure clearly, and use compensation coaching to avoid accepting a poor-fit role out of urgency.",
      includeInExport: false,
    },
  },
];
