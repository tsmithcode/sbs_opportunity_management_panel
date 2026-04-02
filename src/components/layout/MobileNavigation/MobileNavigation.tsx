import { MobileNavigationProps, MobileTab } from "./MobileNavigation.contract";

export function MobileNavigation({ activeTab, onTabChange }: MobileNavigationProps) {
  const tabs: { id: MobileTab; label: string; icon: string }[] = [
    { id: "home", label: "Bag", icon: "🏠" },
    { id: "lifecycle", label: "Steps", icon: "🔄" },
    { id: "story", label: "Receipts", icon: "📖" },
    { id: "admin", label: "Boss", icon: "⚙️" },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 h-16 bg-brand-surface-soft backdrop-blur-md border-t border-black/10 flex justify-around items-center px-4 z-50 md:hidden" aria-label="Mobile navigation">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          type="button"
          className={`flex flex-col items-center justify-center gap-1 flex-1 h-full transition-colors ${activeTab === tab.id ? "text-brand-accent" : "text-brand-muted hover:text-brand-ink"}`}
          onClick={() => onTabChange(tab.id)}
        >
          <span className="text-xl leading-none" aria-hidden="true">{tab.icon}</span>
          <span className="text-[10px] font-medium">{tab.label}</span>
        </button>
      ))}
    </nav>
  );
}
