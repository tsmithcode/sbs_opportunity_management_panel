import { MobileNavigationProps, MobileTab } from "./MobileNavigation.contract";

export function MobileNavigation({ activeTab, onTabChange }: MobileNavigationProps) {
  const tabs: { id: MobileTab; label: string; icon: string }[] = [
    { id: "home", label: "Home", icon: "🏠" },
    { id: "lifecycle", label: "Workflow", icon: "🔄" },
    { id: "story", label: "Story", icon: "📖" },
    { id: "admin", label: "Admin", icon: "⚙️" },
  ];

  return (
    <nav className="mobile-nav" aria-label="Mobile navigation">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          type="button"
          className={`mobile-nav-item${activeTab === tab.id ? " is-active" : ""}`}
          onClick={() => onTabChange(tab.id)}
        >
          <span className="mobile-nav-icon" aria-hidden="true">{tab.icon}</span>
          <span className="mobile-nav-label">{tab.label}</span>
        </button>
      ))}
    </nav>
  );
}
