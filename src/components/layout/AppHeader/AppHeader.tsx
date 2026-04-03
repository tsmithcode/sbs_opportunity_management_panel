import { AppHeaderProps } from "./AppHeader.contract";

export function AppHeader({
  currentPage,
  currentMode,
  modeLabel,
  lastExportedAt,
  navigateToPage,
  onModeChange,
  opportunities = [],
  selectedOpportunityId,
  onOpportunitySelect,
}: AppHeaderProps & { onModeChange?: (mode: any) => void }) {
  const inGuidedEntry =
    currentPage === "start" ||
    currentPage === "proof-drop" ||
    currentPage === "confirm" ||
    currentPage === "setup-base";

  return (
    <header
      className="sticky top-0 z-50 border-b border-black/10 bg-[rgba(247,245,240,0.88)] backdrop-blur-xl"
      aria-label="Primary"
    >
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-10 py-3 flex flex-wrap items-center justify-between gap-4">
        <div
          className="flex flex-col min-w-[150px] cursor-pointer"
          onClick={() => navigateToPage("start")}
        >
          <p className="font-bold text-lg leading-tight tracking-[-0.03em] text-brand-ink">
            Monyawn 🥱
          </p>
          <p className="text-[10px] uppercase tracking-[0.18em] text-brand-muted hidden lg:block">
            We finna get to the monyawn
          </p>
        </div>

        <nav className="flex items-center gap-2 sm:gap-3" aria-label="Page navigation">
          <button
            className={`px-3.5 py-2 rounded-full text-xs sm:text-sm font-semibold transition-colors ${inGuidedEntry ? "bg-brand-accent text-white hover:bg-brand-accent-strong" : "text-brand-muted hover:bg-black/5 hover:text-brand-ink"}`}
            type="button"
            onClick={() => navigateToPage("start")}
          >
            New play
          </button>
          <button
            className={`px-3.5 py-2 rounded-full text-xs sm:text-sm font-semibold transition-colors ${currentPage === "workspace" ? "bg-brand-accent text-white hover:bg-brand-accent-strong" : "text-brand-muted hover:bg-black/5 hover:text-brand-ink"}`}
            type="button"
            onClick={() => navigateToPage("workspace")}
          >
            My bag
          </button>
          <button
            className={`px-3.5 py-2 rounded-full text-xs sm:text-sm font-semibold transition-colors ${currentPage === "about" ? "bg-brand-accent text-white hover:bg-brand-accent-strong" : "text-brand-muted hover:bg-black/5 hover:text-brand-ink"}`}
            type="button"
            onClick={() => navigateToPage("about")}
          >
            Rules
          </button>
          {!inGuidedEntry && (
            <div className="hidden lg:flex gap-1 bg-black/5 p-1 rounded-full ml-2">
              {(["user", "staff", "admin"] as const).map((m) => (
                <button
                  key={m}
                  className={`px-2.5 py-1 rounded-full text-[10px] font-bold tracking-[0.14em] transition-all ${currentMode === m ? "bg-white text-brand-ink shadow-sm" : "text-brand-muted hover:text-brand-ink"}`}
                  onClick={() => onModeChange?.(m)}
                >
                  {m.toUpperCase()}
                </button>
              ))}
            </div>
          )}
        </nav>

        <div
          className="flex items-center gap-2 sm:gap-3 flex-wrap justify-end"
          aria-label="Session status"
        >
          {!inGuidedEntry && opportunities.length > 0 && onOpportunitySelect && (
            <select
              value={selectedOpportunityId || ""}
              onChange={(e) => onOpportunitySelect(e.target.value)}
              className="min-w-[200px] max-w-[280px] px-3 py-2 rounded-full bg-white/70 text-brand-ink text-xs font-semibold border border-black/10 focus:outline-none focus:ring-1 focus:ring-brand-accent"
              aria-label="Switch Play"
            >
              <option value="" disabled>
                Select a play
              </option>
              {opportunities.map((opp) => (
                <option key={opp.id} value={opp.id}>
                  {opp.name}
                </option>
              ))}
            </select>
          )}
          {!inGuidedEntry && (
            <span className="px-3 py-1.5 rounded-full bg-brand-highlight/30 text-brand-accent text-[10px] font-bold tracking-[0.14em] border border-brand-accent/10 hidden md:block">
              {modeLabel}
            </span>
          )}
          {!inGuidedEntry && (
            <span className="px-3 py-1.5 rounded-full bg-brand-highlight/30 text-brand-accent text-[10px] font-bold tracking-[0.14em] border border-brand-accent/10 hidden md:block">
              {lastExportedAt ? "ZIP READY" : "EXPORT IF YOU NEED IT"}
            </span>
          )}
        </div>
      </div>
    </header>
  );
}
