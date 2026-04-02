import type { KeyboardEvent } from "react";

export type ConversationTabOption<T extends string> = {
  id: T;
  label: string;
};

export function ConversationTabs<T extends string>({
  activeTab,
  options,
  onChange,
  panelIdPrefix = "conversation-tabpanel",
}: {
  activeTab: T;
  options: ConversationTabOption<T>[];
  onChange: (tab: T) => void;
  panelIdPrefix?: string;
}) {
  function handleKeyDown(event: KeyboardEvent<HTMLButtonElement>, currentIndex: number) {
    if (event.key !== "ArrowRight" && event.key !== "ArrowLeft" && event.key !== "Home" && event.key !== "End") {
      return;
    }

    event.preventDefault();

    if (event.key === "Home") {
      onChange(options[0].id);
      return;
    }

    if (event.key === "End") {
      onChange(options[options.length - 1].id);
      return;
    }

    const direction = event.key === "ArrowRight" ? 1 : -1;
    const nextIndex = (currentIndex + direction + options.length) % options.length;
    onChange(options[nextIndex].id);
  }

  return (
    <div
      role="tablist"
      aria-label="Conversation views"
      className="border-b border-black/6 bg-white/70 px-4 sm:px-6 py-4 flex flex-wrap gap-3"
    >
      {options.map((tab, index) => (
        <button
          key={tab.id}
          id={`${panelIdPrefix}-tab-${tab.id}`}
          type="button"
          onClick={() => onChange(tab.id)}
          onKeyDown={(event) => handleKeyDown(event, index)}
          role="tab"
          aria-selected={activeTab === tab.id}
          aria-controls={`${panelIdPrefix}-${tab.id}`}
          tabIndex={activeTab === tab.id ? 0 : -1}
          className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${
            activeTab === tab.id
              ? "bg-brand-accent text-white shadow-sm"
              : "bg-brand-surface border border-black/10 text-brand-muted hover:bg-black/5"
          }`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}
