export type AppPage = "landing" | "workspace" | "about" | "intake";

export interface LandingPageProps {
  onStartPursuit: () => void;
  onOpenAbout: () => void;
}
