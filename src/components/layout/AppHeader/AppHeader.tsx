import { AppHeaderProps } from "./AppHeader.contract";

export function AppHeader({ currentPage, modeLabel, lastExportedAt, navigateToPage }: AppHeaderProps) {
  return (
    <header className="topbar" aria-label="Primary">
      <div>
        <p className="brand-mark">Monyawn 🥱</p>
        <p className="brand-subtitle">
          The local-first platform for high-stakes career moves.
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
      </nav>
      <div className="topbar-actions" aria-label="Session status">
        <span className="status-chip">{modeLabel}</span>
        <span className="status-chip hide-on-mobile">Human-in-the-loop</span>
        <span className="status-chip hide-on-mobile">Saved locally</span>
        <span className="status-chip hide-on-mobile">
          {lastExportedAt ? "ZIP export ready" : "Export recommended"}
        </span>
      </div>
    </header>
  );
}
