import { OpportunityStage } from "./types";
import { stageMeta, stageOrder } from "./workflow/constants";

type CoachingGlossaryEntry = {
  term: string;
  definition: string;
};

type CoachingLifecycleEntry = {
  label: string;
  detail: string;
};

type CoachingPacket = {
  intro: string;
  businessLessons: string[];
  glossary: CoachingGlossaryEntry[];
  lifecycle: CoachingLifecycleEntry[];
};

const baseGlossary: CoachingGlossaryEntry[] = [
  {
    term: "Monyan",
    definition: "The money. The bag. The only scoreboard you care about.",
  },
  {
    term: "Play",
    definition: "One real opportunity with receipts, steps, and a finish line.",
  },
  {
    term: "Proof",
    definition: "Receipts that make you undeniable: emails, wins, numbers, screenshots.",
  },
  {
    term: "DMs",
    definition: "Your outreach and follow-ups. Keep them short, clean, and confident.",
  },
  {
    term: "Moves",
    definition: "The next steps that push the play forward fast.",
  },
  {
    term: "Bag meter",
    definition: "How much leverage you have right now to ask for more.",
  },
];

const lifecycleEntries: CoachingLifecycleEntry[] = stageOrder.map((stage, index) => {
  const meta = stageMeta[stage];
  return {
    label: `${index + 1}. ${meta.label}`,
    detail: `${meta.description} Lead: ${meta.reviewerRole}.`,
  };
});

const coachingByStage: Record<OpportunityStage, CoachingPacket> = {
  intake_started: {
    intro: "Start with the signal, not the spreadsheets. We want your story clean and fast.",
    businessLessons: [
      "Drop the raw signal. We clean it up and build the play around it.",
      "Keep the first pass lightweight. If it does not move monyan, skip it.",
      "Add proof that screams value in one glance.",
    ],
    glossary: baseGlossary,
    lifecycle: lifecycleEntries,
  },
  intake_complete: {
    intro: "Now we make it look professional without sounding like a robot.",
    businessLessons: [
      "Make sure the role, company, and path are correct. Do not overthink.",
      "Confirm your base profile. We can fix details later.",
      "Put your strongest receipts up front so the play feels inevitable.",
    ],
    glossary: baseGlossary,
    lifecycle: lifecycleEntries,
  },
  fit_review: {
    intro: "This is the gut check. If the fit is off, we pivot fast.",
    businessLessons: [
      "Spot the gaps early so you do not waste time.",
      "Stack the proof that directly matches what they want to buy.",
      "If the risk is too high, move to a better play.",
    ],
    glossary: baseGlossary,
    lifecycle: lifecycleEntries,
  },
  positioning: {
    intro: "We polish the story so it hits like a flex, not a lecture.",
    businessLessons: [
      "Lead with outcomes and money impact, not job duties.",
      "Keep your story tight: problem, move, win.",
      "Make sure the proof is easy to scan in ten seconds.",
    ],
    glossary: baseGlossary,
    lifecycle: lifecycleEntries,
  },
  outreach_ready: {
    intro: "Now we open doors. Short messages, strong energy, no begging.",
    businessLessons: [
      "DMs should be short, specific, and confident.",
      "Ask for one clear next step, not a full interview right away.",
      "Follow up with new receipts, not repeated questions.",
    ],
    glossary: baseGlossary,
    lifecycle: lifecycleEntries,
  },
  interview_active: {
    intro: "Live mode. This is where the money gets real.",
    businessLessons: [
      "Answer quick, then bring it back to your proof.",
      "Own the room. You are the hero, not the applicant.",
      "Close with a confident next step and timeline.",
    ],
    glossary: baseGlossary,
    lifecycle: lifecycleEntries,
  },
  debrief_captured: {
    intro: "Recap while it is fresh. Every detail can be leverage.",
    businessLessons: [
      "Write down what they loved, what they doubted, and what they asked.",
      "Turn the recap into two follow-up moves.",
      "If the vibe was off, prep a pivot play now.",
    ],
    glossary: baseGlossary,
    lifecycle: lifecycleEntries,
  },
  offer_review: {
    intro: "This is money time. Protect your upside and your pride.",
    businessLessons: [
      "Look at total comp, not just base pay.",
      "Ask for more with receipts and calm confidence.",
      "Do not rush. Silence is leverage when you have the bag.",
    ],
    glossary: baseGlossary,
    lifecycle: lifecycleEntries,
  },
  closed_won: {
    intro: "Bag secured. Lock the win and store the receipts.",
    businessLessons: [
      "Capture the final numbers for future plays.",
      "Save the messages and proof that got you here.",
      "Celebrate loud. Then set up the next bag.",
    ],
    glossary: baseGlossary,
    lifecycle: lifecycleEntries,
  },
  closed_lost: {
    intro: "Not every play cashes. Learn quick, pivot fast.",
    businessLessons: [
      "Write the real reason it closed. No fairy tales.",
      "Extract the proof you gained and carry it forward.",
      "Start the next play with stronger receipts.",
    ],
    glossary: baseGlossary,
    lifecycle: lifecycleEntries,
  },
};

export function getCoachingTitle(stage: OpportunityStage): string {
  switch (stage) {
    case "intake_started":
      return "Start move pack";
    case "intake_complete":
      return "Setup move pack";
    case "fit_review":
      return "Fit move pack";
    case "positioning":
      return "Story move pack";
    case "outreach_ready":
      return "DM move pack";
    case "interview_active":
      return "Interview move pack";
    case "debrief_captured":
      return "Debrief move pack";
    case "offer_review":
      return "Money move pack";
    case "closed_won":
      return "Win move pack";
    case "closed_lost":
      return "Reset move pack";
    default:
      return "Move pack";
  }
}

export function getCoachingForStage(stage: OpportunityStage): CoachingPacket {
  return coachingByStage[stage] ?? coachingByStage.intake_started;
}
