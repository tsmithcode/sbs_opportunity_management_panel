export type MobileTab = "home" | "lifecycle" | "story" | "admin";

export interface MobileNavigationProps {
  activeTab: MobileTab;
  onTabChange: (tab: MobileTab) => void;
}
