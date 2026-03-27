import type { OpportunityStage } from "./types";
import { stageMeta } from "./workflow";

type CoachingContent = {
  intro: string;
  glossary: Array<{ term: string; definition: string }>;
  lifecycle: Array<{ label: string; detail: string }>;
  process: Array<{ label: string; detail: string }>;
  businessLessons: string[];
  compensation: string[];
};

const compensationStack = [
  "Base pay is only one layer. Bonus, equity, benefits, allowances, and long-term incentives can materially change the offer.",
  "If a recruiter keeps redirecting you to salary only, that can be a clue that other compensation layers are where negotiation room lives.",
  "Use the current stage to decide your question depth. Early screens can ask about pay band and bonus target; later screens can ask about RSUs, ESPP, vesting, and retention structures.",
  "Compensation literacy is not greed. It is system literacy, and it changes long-term financial outcomes.",
];

const coachingByStage: Record<OpportunityStage, CoachingContent> = {
  intake_started: {
    intro:
      "Start by understanding the business setting, the documents you need, and the language the company will likely use at the current point in the process.",
    glossary: [
      { term: "Job description", definition: "The employer’s public summary of responsibilities, expectations, and qualification signals." },
      { term: "Source artifact", definition: "Any document or pasted text that supports decision-making, such as a resume, recruiter note, or offer detail." },
      { term: "Opportunity source", definition: "How the role entered your pipeline, such as recruiter outreach, referral, or direct application." },
    ],
    lifecycle: [
      { label: "Business trigger", detail: "Roles often appear because a team is growing, replacing attrition, or trying to ship work faster." },
      { label: "Hiring intake", detail: "The company aligns role scope, budget, and urgency before recruiter outreach becomes consistent." },
    ],
    process: [
      { label: "What to gather", detail: "Resume, job description, relevant correspondence, and any notes that clarify timeline or people involved." },
      { label: "What to confirm", detail: "Company, title, source, location expectations, and any live dates or interview timing signals." },
    ],
    businessLessons: [
      "At intake, accuracy beats polish. Clean records now reduce confusion later.",
      "Capture real names, dates, and who contacted you. That gives you leverage and context later in the process.",
    ],
    compensation: compensationStack,
  },
  intake_complete: {
    intro:
      "Once intake is complete, the next priority is turning documents into a correct, reviewable opportunity picture before stronger recommendations are made.",
    glossary: [
      { term: "Fit review", definition: "A structured assessment of strengths, risks, gaps, and likely pursuit value." },
      { term: "Evidence", definition: "The source-backed facts that support a recommendation or positioning choice." },
      { term: "Checkpoint", definition: "A decision point where AI and human review determine whether to proceed, pause, or escalate." },
    ],
    lifecycle: [
      { label: "Evidence alignment", detail: "The team checks whether the opportunity is real, current, and worth deeper effort." },
      { label: "Signal filtering", detail: "Urgency, scope, and sponsor quality become clearer when artifacts and correspondence are reviewed together." },
    ],
    process: [
      { label: "Profile correction", detail: "Make sure extracted skills, gaps, and strengths reflect reality before the system builds narrative outputs." },
      { label: "Risk framing", detail: "Flag weak evidence, title mismatch, or skill gaps without overstating problems." },
    ],
    businessLessons: [
      "This is the moment to prevent bad assumptions from becoming strategy.",
      "A correct candidate profile is more valuable than a flattering but inaccurate one.",
    ],
    compensation: compensationStack,
  },
  fit_review: {
    intro:
      "Fit review is where business judgment matters most: separate genuine alignment from wishful thinking and identify what must be proven next.",
    glossary: [
      { term: "Pursue", definition: "Move forward because opportunity value and evidence strength justify more effort." },
      { term: "Defer", definition: "Pause without discarding the role because key facts or timing are still unclear." },
      { term: "Gap mitigation", definition: "A truthful plan for handling missing experience or domain depth." },
    ],
    lifecycle: [
      { label: "Role economics", detail: "Companies compare urgency, budget, and candidate readiness before investing more interview time." },
      { label: "Selection pressure", detail: "Your fit is judged both on current ability and on how clearly your value translates to this exact role." },
    ],
    process: [
      { label: "Strength map", detail: "List the strongest directly supportable reasons you can do the job." },
      { label: "Risk map", detail: "Call out seniority mismatch, tooling gaps, industry gaps, or unclear scope honestly." },
    ],
    businessLessons: [
      "A good fit review does not try to win every argument. It identifies the right next proof.",
      "Truthful framing preserves trust and helps later negotiation.",
    ],
    compensation: compensationStack,
  },
  positioning: {
    intro:
      "Positioning turns raw evidence into a story the market can understand without inflating or fabricating experience.",
    glossary: [
      { term: "Proof point", definition: "A concise, supportable example that demonstrates relevant value." },
      { term: "Narrative framing", definition: "The way you explain experience so the employer understands relevance quickly." },
      { term: "Transferable skill", definition: "A skill that applies across industries or tool stacks even if the context changes." },
    ],
    lifecycle: [
      { label: "Story translation", detail: "You are helping a hiring team see continuity between your prior work and their current need." },
      { label: "Confidence building", detail: "Good positioning reduces uncertainty without pretending the gaps do not exist." },
    ],
    process: [
      { label: "Resume shaping", detail: "Emphasize role-relevant outcomes, systems, tools, and cross-functional value." },
      { label: "Story editing", detail: "Move from generic summaries to who/what/why/how language the employer can repeat back." },
    ],
    businessLessons: [
      "Positioning is not fiction. It is strategic ordering of real facts.",
      "The goal is to become easier to understand, not to sound bigger than you are.",
    ],
    compensation: compensationStack,
  },
  outreach_ready: {
    intro:
      "Outreach should feel calm, specific, and timely. At this stage you are proving seriousness and fit, not trying to say everything at once.",
    glossary: [
      { term: "Approval state", definition: "Whether a message is still draft, in review, approved, scheduled, or sent." },
      { term: "Cadence", definition: "The timing pattern for contact and follow-up." },
      { term: "Outbound-ready", definition: "A message that has passed review and is appropriate to send." },
    ],
    lifecycle: [
      { label: "Relationship motion", detail: "Employers learn reliability from how you communicate before they learn your full depth." },
      { label: "Signal management", detail: "Timing, brevity, and tone affect whether your message helps or hurts momentum." },
    ],
    process: [
      { label: "Message structure", detail: "State context, relevance, and next step clearly with minimal clutter." },
      { label: "Follow-up logic", detail: "Use reminders and timing cues instead of reactive over-messaging." },
    ],
    businessLessons: [
      "A good message lowers the other person’s effort to move the process forward.",
      "Specificity beats enthusiasm without context.",
    ],
    compensation: compensationStack,
  },
  interview_active: {
    intro:
      "Interview coaching is about structured proof, calm delivery, and reading the business need behind the question.",
    glossary: [
      { term: "Debrief", definition: "The post-round reflection that captures what landed, what missed, and what changed." },
      { term: "Panel interview", definition: "A round where multiple stakeholders evaluate different dimensions of fit." },
      { term: "Behavioral proof", definition: "An example that shows decision-making, ownership, or communication in action." },
    ],
    lifecycle: [
      { label: "Validation round", detail: "The company checks whether your story matches your reasoning, depth, and communication under pressure." },
      { label: "Stakeholder mapping", detail: "Different interviewers test different risk concerns such as collaboration, depth, or leadership." },
    ],
    process: [
      { label: "Prep pattern", detail: "Map likely questions, proof points, interviewer goals, and fallback examples." },
      { label: "Debrief discipline", detail: "Record names, dates, concerns, and next steps immediately after the round." },
    ],
    businessLessons: [
      "Interview performance improves when you know what business risk each person is trying to reduce.",
      "Good debriefs make later rounds smarter.",
    ],
    compensation: compensationStack,
  },
  debrief_captured: {
    intro:
      "Debrief is where scattered impressions become usable intelligence for the next move in the process.",
    glossary: [
      { term: "Concern tracking", definition: "A running list of issues that need response or mitigation in later stages." },
      { term: "Signal shift", definition: "A meaningful change in likelihood, scope, or concern based on new evidence." },
      { term: "Next-action owner", definition: "The person or role responsible for the next task after a round." },
    ],
    lifecycle: [
      { label: "Decision tightening", detail: "After each round the company narrows uncertainty and refines what it still needs to see." },
      { label: "Repositioning window", detail: "You may still be able to address concerns through follow-up, prep, or reframing." },
    ],
    process: [
      { label: "What to capture", detail: "Who you met, what they cared about, what felt strong, and what needs reinforcement." },
      { label: "What to do next", detail: "Convert each concern into either a prep action, a clarification, or a stop signal." },
    ],
    businessLessons: [
      "Memory gets worse quickly after an interview. Good debrief capture protects learning.",
      "A debrief is a bridge from one round to the next, not just a diary entry.",
    ],
    compensation: compensationStack,
  },
  offer_review: {
    intro:
      "Offer review is where business literacy and compensation literacy matter most. This is bigger than salary alone.",
    glossary: [
      { term: "Pay band", definition: "The company’s internal salary range for a role or level." },
      { term: "RSU", definition: "Restricted Stock Unit, company stock granted and vested over time." },
      { term: "ESPP", definition: "Employee Stock Purchase Plan, often allowing discounted purchase through payroll deductions." },
    ],
    lifecycle: [
      { label: "Packaging stage", detail: "The company decides not only whether to hire you, but how it wants to package you." },
      { label: "Retention logic", detail: "Bonus, equity, perks, and vesting often reflect how strongly the company wants to secure the hire." },
    ],
    process: [
      { label: "Full-stack review", detail: "Review base, bonus, equity, benefits, allowances, and long-term incentives together." },
      { label: "Timing awareness", detail: "Ask about vesting, refresh cycles, retention bonuses, and bonus eligibility dates." },
    ],
    businessLessons: [
      "Most people negotiate the visible layer and miss the engineered one.",
      "Two offers with the same salary can have radically different long-term value.",
    ],
    compensation: compensationStack,
  },
  closed_won: {
    intro:
      "A won opportunity still has learning value. Capture what worked so future opportunities start from a stronger base.",
    glossary: [
      { term: "Archive", definition: "Preserve the record and outputs for later reference or handoff." },
      { term: "Handoff package", definition: "The exported package containing the machine-readable session and human-readable artifacts." },
      { term: "Playbook reuse", definition: "Reapplying successful patterns to future opportunities." },
    ],
    lifecycle: [
      { label: "Transition", detail: "The opportunity lifecycle closes, but onboarding, negotiation, or internal-transition work may still continue." },
      { label: "Learning loop", detail: "Successful patterns should be preserved for reuse in later opportunities." },
    ],
    process: [
      { label: "What to preserve", detail: "Candidate story, fit reasoning, outreach patterns, debriefs, and compensation logic." },
      { label: "What to export", detail: "Create a clean handoff package so you control your own record." },
    ],
    businessLessons: [
      "Winning is not the end of the data pipeline. It is a moment to keep your best patterns.",
      "Export before you move on so your work stays portable.",
    ],
    compensation: compensationStack,
  },
  closed_lost: {
    intro:
      "A closed-lost opportunity can still improve the next one if the learning is captured without shame or noise.",
    glossary: [
      { term: "Close reason", definition: "The clearest known reason the opportunity did not continue." },
      { term: "Reopen trigger", definition: "A condition that would make the opportunity worth revisiting." },
      { term: "Pattern learning", definition: "A repeatable lesson extracted from one failed path." },
    ],
    lifecycle: [
      { label: "Decision end", detail: "The company or candidate has stopped the current process, but the underlying learning remains valuable." },
      { label: "Future leverage", detail: "A clean loss analysis can improve fit choices, positioning, and negotiation in the next cycle." },
    ],
    process: [
      { label: "What to note", detail: "Known reasons, unresolved risks, timeline issues, and any data worth carrying forward." },
      { label: "What to retain", detail: "Preserve story elements, glossary context, and comp learning that still apply elsewhere." },
    ],
    businessLessons: [
      "Closed-lost should reduce confusion for the next opportunity, not just mark failure.",
      "Preserving truth and learning is more valuable than pretending the process never happened.",
    ],
    compensation: compensationStack,
  },
};

export function getCoachingForStage(stage: OpportunityStage): CoachingContent {
  return coachingByStage[stage];
}

export function getCoachingTitle(stage: OpportunityStage): string {
  return `${stageMeta[stage].label} coaching pack`;
}
