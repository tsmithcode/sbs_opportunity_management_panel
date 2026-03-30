export interface AboutExpert {
  role: string;
  purpose: string;
}

export type AppPage = "workspace" | "about";

export interface AboutPageProps {
  RESUME_PATH: string;
  navigateToPage: (page: AppPage) => void;
  setNotice: (notice: { tone: "success" | "info"; message: string } | null) => void;
}

export const aboutExperts: AboutExpert[] = [
  {
    role: "Founder / CEO",
    purpose: "Owns company direction, mission clarity, and the long-range reason Monyawn exists.",
  },
  {
    role: "Mission / Purpose Lead",
    purpose: "Turns company values and public purpose into stable product and brand guidance.",
  },
  {
    role: "Brand Strategy Lead",
    purpose: "Shapes how Monyawn is understood in the market and how the story stays coherent across product and public surfaces.",
  },
  {
    role: "Marketing / Communications Lead",
    purpose: "Owns public-facing messaging, including how the about page explains the platform in plain language.",
  },
  {
    role: "Candidate Story Architect",
    purpose: "Ensures the product teaches users how to communicate identity, value, and purpose through evidence-backed narrative.",
  },
  {
    role: "Trust Center / Public Documentation Owner",
    purpose: "Keeps public-facing explanations truthful, aligned to policy, and consistent with the product’s local-only posture.",
  },
];
