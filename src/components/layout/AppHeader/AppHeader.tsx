import { AppHeaderProps } from "./AppHeader.contract";

export function AppHeader({ currentPage, currentMode, modeLabel, lastExportedAt, navigateToPage, onModeChange }: AppHeaderProps & { onModeChange?: (mode: any) => void }) {
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
        <div className="mode-switcher hide-on-mobile" style={{ marginLeft: '1rem', display: 'flex', gap: '0.25rem', background: 'rgba(0,0,0,0.05)', padding: '0.25rem', borderRadius: '0.5rem' }}>
          {(['user', 'staff', 'admin'] as const).map(m => (
            <button
              key={m}
              className={`mode-button ${currentMode === m ? 'is-active' : ''}`}
              onClick={() => onModeChange?.(m)}
              style={{
                background: currentMode === m ? 'var(--accent)' : 'transparent',
                color: currentMode === m ? 'white' : 'var(--muted)',
                border: 'none',
                padding: '0.3rem 0.6rem',
                borderRadius: '0.4rem',
                fontSize: '0.75rem',
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              {m.toUpperCase()}
            </button>
          ))}
        </div>
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
