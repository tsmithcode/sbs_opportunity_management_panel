export type AppPage = "workspace" | "about";

export interface AppHeaderProps {
  currentPage: AppPage;
  currentMode: string;
  modeLabel: string;
  lastExportedAt: string;
  navigateToPage: (page: AppPage) => void;
}
