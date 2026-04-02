import { Account, User } from "../../types";
import { SeedBundle } from "../types";
import { buildHabasitOpportunity } from "./opportunity";

export function buildHabasitBundles(habasitAccount: Account, habasitUsers: User[]): SeedBundle[] {
  return [
    buildHabasitOpportunity({
      accountId: habasitAccount.account_id,
      user: habasitUsers[0],
      roleTitle: "Application Engineer, Conveyor Solutions",
      source: "Mock sample based on Habasit America Suwanee operations",
      postingUrl: "https://www.habasit.com/en-US/Contact/North-America",
      stageSteps: 7,
      finalStage: "closed_won",
      employmentType: "Full-time",
      locationType: "Hybrid - Suwanee, GA",
      resumeSummary:
        "Ava has applications engineering experience across power transmission, plant support, and customer-facing solution design with strong onsite collaboration habits.",
      jdSummary:
        "Mock Habasit America sample for Suwanee, GA focused on conveyor and belting applications, customer problem solving, plant coordination, and technical sales partnership.",
      checkpointSummary:
        "Evidence supports a strong technical-fit path for a Georgia-based applications role tied to conveyor and belting workflows.",
      memoType: "offer",
      memoSummary:
        "Closed-won sample should demonstrate how clean narrative, correspondence, and operating evidence survive export/import at the end of a 30-day cycle.",
      correspondenceSubject: "Habasit America applications engineering follow-up",
      correspondenceBody:
        "Thank you for the Suwanee conversation. I can support conveyor applications, technical customer translation, and plant-facing troubleshooting while staying grounded in fast operational follow-through.",
      coachingBody:
        "Town hall note: this sample should show a premium industrial workflow, not a demo. Candidate story, interview evidence, and offer review all need to read like one operating thread.",
      profile: {
        skillsSummary:
          "Industrial applications engineering, belt and conveyor troubleshooting, field support, customer translation, technical discovery",
        experienceLevel: "Senior individual contributor",
        strengths: "Strong on plant-floor communication, technical issue framing, and converting field evidence into usable action",
        gaps: "Needs sharper compensation framing and cleaner employer-of-record timeline language",
      },
      timeline: {
        createdDaysAgo: 30,
        updatedDaysAgo: 1,
        checkpointDaysAgo: [29, 26, 22, 18, 14, 10, 6, 2],
        taskDaysAgo: [1, 28, 25, 20, 16, 12, 8, 4, 2],
        memoDaysAgo: [27, 5],
        correspondenceDaysAgo: [23, 11],
        artifactDaysAgo: [30, 29, 9],
        stageEventDaysAgo: [30, 27, 24, 20, 16, 12, 8, 4, 1],
      },
    }),
    buildHabasitOpportunity({
      accountId: habasitAccount.account_id,
      user: habasitUsers[1],
      roleTitle: "Fabrication Technician, Timing Belt Operations",
      source: "Mock sample based on Habasit America Suwanee fabrication operations",
      postingUrl: "https://www.habasit.com/en-US/Contact/North-America",
      stageSteps: 6,
      finalStage: "offer_review",
      employmentType: "Full-time",
      locationType: "Onsite - Suwanee, GA",
      resumeSummary:
        "Darius has machine setup, fabrication support, forklift, shift coordination, and documented production reliability experience after re-entry workforce training.",
      jdSummary:
        "Mock Habasit America fabrication sample for Suwanee, GA focused on timing belt fabrication, production quality, shift handoffs, and dependable plant operations.",
      checkpointSummary:
        "Candidate is technically credible for operations support, but the support path must stay local-only by default and encouragement must be explicit.",
      memoType: "positioning",
      memoSummary:
        "Sensitive-support sample should prove re-entry guidance, export exclusion by default, and optional inclusion only when intentionally enabled.",
      correspondenceSubject: "Habasit America fabrication shift discussion",
      correspondenceBody:
        "I appreciate the chance to discuss the fabrication role in Suwanee. I can contribute on shift, stay coachable, and bring consistent attendance plus careful production follow-through.",
      coachingBody:
        "Town hall note: this sample exists to verify the product can handle re-entry support with dignity, practical next steps, and strict export boundaries.",
      profile: {
        skillsSummary:
          "Fabrication support, production floor discipline, machine changeovers, quality checks, dependable shift execution",
        experienceLevel: "Early-mid operations contributor",
        strengths: "Reliable execution, willingness to learn, and calm documentation habits under supervision",
        gaps: "Needs confidence support around background questions and a cleaner explanation of recent work history",
      },
      timeline: {
        createdDaysAgo: 28,
        updatedDaysAgo: 2,
        checkpointDaysAgo: [27, 24, 21, 17, 13, 9, 5, 2],
        taskDaysAgo: [2, 26, 23, 19, 15, 11, 7, 3, 2],
        memoDaysAgo: [22, 6],
        correspondenceDaysAgo: [20, 8],
        artifactDaysAgo: [28, 27, 12],
        stageEventDaysAgo: [28, 25, 22, 18, 14, 10, 6],
      },
      support: {
        categories: ["criminal_history", "reentry", "background_concern"],
        notes:
          "Candidate disclosed re-entry context and wants help answering background questions without shame or oversharing.",
        encouragementPlan:
          "Keep support local-only, practice a short truthful explanation, and anchor the story in reliability, coachability, and current work readiness.",
        includeInExport: false,
        updatedDaysAgo: 2,
      },
    }),
    buildHabasitOpportunity({
      accountId: habasitAccount.account_id,
      user: habasitUsers[2],
      roleTitle: "Customer Operations And Continuous Improvement Lead",
      source: "Mock sample based on Habasit America Suwanee customer support and operations coordination",
      postingUrl: "https://www.habasit.com/en-US/Contact/North-America",
      stageSteps: 7,
      finalStage: "closed_lost",
      employmentType: "Full-time",
      locationType: "Hybrid - Suwanee, GA",
      resumeSummary:
        "Melissa has customer operations, quoting support, process cleanup, and reporting discipline after a recent layoff from a manufacturing-adjacent employer.",
      jdSummary:
        "Mock Habasit America operations sample for Suwanee, GA focused on customer operations, process improvement, quoting coordination, and cross-functional reliability.",
      checkpointSummary:
        "The candidate is viable, but this scenario should prove layoff-recovery coaching, compensation education, and graceful close-lost handling.",
      memoType: "final",
      memoSummary:
        "Closed-lost sample should still export cleanly with a readable story, compensation education evidence, and debrief history intact.",
      correspondenceSubject: "Habasit America operations follow-up and next steps",
      correspondenceBody:
        "Thank you for the update. Even if timing does not align right now, I value the conversation and can clearly speak to customer operations, process discipline, and rapid onboarding support.",
      coachingBody:
        "Town hall note: this sample should prove the product stays supportive after a loss instead of collapsing into a dead-end tracker.",
      profile: {
        skillsSummary:
          "Customer operations, process improvement, quoting support, reporting cadence, manufacturing-adjacent coordination",
        experienceLevel: "Mid-senior operations lead",
        strengths: "Strong on plant-floor communication, technical issue framing, and converting field evidence into usable action",
        gaps: "Needs layoff narrative support and tighter compensation framing after a disrupted last role",
      },
      timeline: {
        createdDaysAgo: 26,
        updatedDaysAgo: 0,
        checkpointDaysAgo: [25, 22, 19, 15, 11, 7, 3, 0],
        taskDaysAgo: [0, 24, 21, 17, 13, 9, 5, 2, 0],
        memoDaysAgo: [20, 1],
        correspondenceDaysAgo: [18, 4],
        artifactDaysAgo: [26, 25, 14],
        stageEventDaysAgo: [26, 23, 20, 16, 12, 8, 4, 2, 0],
      },
      support: {
        categories: ["layoff", "fired"],
        notes:
          "Candidate is processing a layoff and wants help keeping confidence and structure while re-entering a premium industrial environment.",
        encouragementPlan:
          "Normalize the layoff, focus on measurable process wins, and use compensation education to rebuild decision confidence before the next offer cycle.",
        includeInExport: true,
        updatedDaysAgo: 1,
      },
    }),
  ];
}
