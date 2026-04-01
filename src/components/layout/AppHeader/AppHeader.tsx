import { AppHeaderProps } from "./AppHeader.contract";

export function AppHeader({ currentPage, currentMode, modeLabel, lastExportedAt, navigateToPage, onModeChange, opportunities = [], selectedOpportunityId, onOpportunitySelect }: AppHeaderProps & { onModeChange?: (mode: any) => void }) {
  return (
    <header className="topbar" aria-label="Primary">
      <div className="brand-area">
        <p className="brand-mark">Monyawn 🥱</p>
        <p className="brand-subtitle hide-on-mobile">
          Local-first career decision support.
        </p>
      </div>
      <nav className="topbar-nav" aria-label="Page navigation">
        <button
          className={`secondary-action nav-button${currentPage === "workspace" ? " is-current" : ""}`}
          type="button"
          onClick={() => navigateToPage("workspace")}
        >
          Workspace
        </button>
        <button
          className={`secondary-action nav-button${currentPage === "about" ? " is-current" : ""}`}
          type="button"
          onClick={() => navigateToPage("about")}
        >
          About
        </button>
        <div className="mode-switcher hide-on-mobile">
          {(['user', 'staff', 'admin'] as const).map(m => (
            <button
              key={m}
              className={`mode-button ${currentMode === m ? 'is-active' : ''}`}
              onClick={() => onModeChange?.(m)}
            >
              {m.toUpperCase()}
            </button>
          ))}
        </div>
      </nav>
      <div className="topbar-actions" aria-label="Session status">
        {opportunities.length > 0 && onOpportunitySelect && (
          <select 
            value={selectedOpportunityId || ""} 
            onChange={(e) => onOpportunitySelect(e.target.value)}
            className="status-chip"
            aria-label="Switch Opportunity"
          >
            <option value="" disabled>Select...</option>
            {opportunities.map(opp => (
              <option key={opp.id} value={opp.id}>{opp.name}</option>
            ))}
          </select>
        )}
        <span className="status-chip hide-on-mobile">{modeLabel}</span>
        <span className="status-chip hide-on-mobile">{lastExportedAt ? "ZIP ready" : "Export advised"}</span>
      </div>
    </header>
  );
}
