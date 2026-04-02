export type AppPage = "landing" | "workspace" | "about" | "setup-base";

export interface LandingPageProps {
  onStartPursuit: () => void;
  onOpenAbout: () => void;
}
