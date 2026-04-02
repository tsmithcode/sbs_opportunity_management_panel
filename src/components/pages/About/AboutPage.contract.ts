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
    role: "Boss / Founder",
    purpose: "Keeps the vision on money and truth, no corporate zombie drift.",
  },
  {
    role: "Vibe Keeper",
    purpose: "Guards the voice so it stays real, human, and hungry.",
  },
  {
    role: "Street Story Lead",
    purpose: "Makes the story hit like a friend, not a memo.",
  },
  {
    role: "Clout Lead",
    purpose: "Drives viral language, sharing hooks, and social proof.",
  },
  {
    role: "Story Builder",
    purpose: "Keeps your story backed by proof, not fluff.",
  },
  {
    role: "Trust Guard",
    purpose: "Keeps the product honest, private, and clean to share.",
  },
];
