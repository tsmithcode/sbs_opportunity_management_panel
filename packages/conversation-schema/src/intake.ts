import { ConversationStep } from "../../conversation-core/src";

export const intakeConversationSteps: ConversationStep[] = [
  {
    id: "signalType",
    module: "Origin",
    label: "What are we working from?",
    segue: "Let's start where real life starts: with the thing already in your hand.",
    prompt: "Pick the kind of proof you're bringing in.",
    helper: "This choice shapes the next question so the chat feels natural, not like a survey.",
    control: "choice",
    options: [
      { value: "recruiter_email", label: "Recruiter text/email", hint: "Paste the message and let the chat pull the play out of it." },
      { value: "job_link", label: "Job link", hint: "Drop the link and add context only if the post is messy." },
      { value: "job_text", label: "Job text", hint: "Paste the write-up directly." },
      { value: "transcript", label: "Interview transcript", hint: "Turn raw talk into next moves." },
      { value: "note", label: "Quick note", hint: "Rough notes are fine. We shape it." },
    ],
    summarize: (value) => {
      const option = intakeConversationSteps[0].options?.find((item) => item.value === value);
      return option?.label ?? String(value ?? "");
    },
  },
  {
    id: "signalText",
    module: "Origin",
    label: "Drop the proof",
    segue: "Now talk to me like you're sending a voice note, not filing paperwork.",
    prompt: "Paste the message, role text, transcript, or notes.",
    helper: "We'll use this to infer the company, role, and next move before asking you to clean anything up.",
    control: "textarea",
    placeholder: "Paste the message, job text, or notes here...",
    validate: (value) =>
      typeof value === "string" && value.trim().length >= 8
        ? null
        : "Drop a little more detail so the engine has something real to work with.",
    summarize: (value) => String(value ?? "").replace(/\s+/g, " ").trim().slice(0, 120),
  },
  {
    id: "signalUrl",
    module: "Origin",
    label: "Any link with it?",
    segue: "If there's a link riding with this play, this is where we lock it in.",
    prompt: "Add the URL if there is one.",
    helper: "Optional, unless the source is a job link.",
    control: "url",
    placeholder: "https://",
    optional: true,
    isVisible: (answers) =>
      answers.signalType === "job_link" || answers.signalType === "recruiter_email",
    validate: (value, answers) => {
      const requiresUrl = answers.signalType === "job_link";
      if (!value) {
        return requiresUrl ? "A job link needs the actual URL." : null;
      }

      if (typeof value !== "string") {
        return "This link needs to be plain text.";
      }

      return /^https?:\/\//i.test(value.trim()) ? null : "Use a full link starting with http:// or https://";
    },
  },
  {
    id: "fullName",
    module: "You",
    label: "Who's the star of this play?",
    segue: "Cool. Now let's make sure the right name is on the bag.",
    prompt: "What name should this play run under?",
    helper: "Use the real name you want attached to outreach, proof, and exports.",
    control: "text",
    placeholder: "Your full name",
    validate: (value) =>
      typeof value === "string" && value.trim().length >= 2
        ? null
        : "Drop the real name you want us to use.",
  },
  {
    id: "accountName",
    module: "Home Base",
    label: "What should we call your base?",
    segue: "Quick home-base tag so the workspace, exports, and receipts don’t look random later.",
    prompt: "What name should your base run under?",
    helper: "Usually your name, brand, or crew name. Keep it simple and recognizable.",
    control: "text",
    placeholder: "Your base name",
    validate: (value) =>
      typeof value === "string" && value.trim().length >= 2
        ? null
        : "Give the base a real name so the workspace has a home.",
  },
  {
    id: "accountType",
    module: "Home Base",
    label: "Is this just you or a whole crew?",
    segue: "This sets the lane for how the workspace thinks about access and posture.",
    prompt: "Pick the base type.",
    helper: "Solo means personal workspace. Crew means org-style workspace.",
    control: "choice",
    options: [
      { value: "individual", label: "Solo", hint: "Just me. Personal workspace energy." },
      { value: "enterprise", label: "Crew / org", hint: "Team, company, or shared-op workspace." },
    ],
    summarize: (value) => (value === "enterprise" ? "Crew / org" : "Solo"),
  },
  {
    id: "email",
    module: "You",
    label: "Best email?",
    segue: "One more quick identity lock and then we tighten the play itself.",
    prompt: "What email should ride with this play?",
    helper: "Optional. If we spotted one in the proof, you can keep it or swap it.",
    control: "email",
    placeholder: "name@example.com",
    optional: true,
    validate: (value) => {
      if (!value) {
        return null;
      }

      return /\S+@\S+\.\S+/.test(String(value)) ? null : "Drop a real-looking email or skip it for now.";
    },
  },
  {
    id: "companyName",
    module: "The Play",
    label: "Who's the company?",
    segue: "Now we tighten the target so the chat can speak clearly about the play.",
    prompt: "What company is this move for?",
    helper: "We may prefill this from the proof, but you can always sharpen it.",
    control: "text",
    placeholder: "Company name",
    validate: (value) =>
      typeof value === "string" && value.trim().length >= 2
        ? null
        : "Give the play a real company name.",
  },
  {
    id: "roleTitle",
    module: "The Play",
    label: "What role are we chasing?",
    segue: "Good. One last clarity pass so the play sounds expensive and exact.",
    prompt: "What role title should we lock in?",
    helper: "Keep it as close to the original role as possible.",
    control: "text",
    placeholder: "Role title",
    validate: (value) =>
      typeof value === "string" && value.trim().length >= 2
        ? null
        : "Drop the actual role title.",
  },
  {
    id: "pathway",
    module: "The Play",
    label: "What kind of bag is this?",
    segue: "Last fork in the road. This tells the workspace whether we're talking payroll or contract money.",
    prompt: "Pick the deal type.",
    control: "choice",
    options: [
      { value: "w2", label: "Payroll job", hint: "Classic employee lane." },
      { value: "1099", label: "Contract bag", hint: "Independent/contract money lane." },
    ],
    summarize: (value) => (value === "1099" ? "Contract bag" : "Payroll job"),
  },
];
