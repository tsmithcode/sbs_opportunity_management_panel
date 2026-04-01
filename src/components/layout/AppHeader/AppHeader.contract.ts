export type AppPage = "landing" | "intake" | "workspace" | "about";

export interface AppHeaderProps {
  currentPage: AppPage;
  currentMode: string;
  modeLabel: string;
  lastExportedAt: string;
  navigateToPage: (page: AppPage) => void;
  opportunities?: { id: string; name: string }[];
  selectedOpportunityId?: string;
  onOpportunitySelect?: (id: string) => void;
}
