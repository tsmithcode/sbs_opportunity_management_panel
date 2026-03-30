import { PageTemplateProps } from "./PageTemplate.contract";

export function PageTemplate({ id, className = "workspace", banner, header, children }: PageTemplateProps) {
  const bannerStyle = banner?.tone === "success" 
    ? { background: "linear-gradient(90deg, #0a5f57, #083f3b)" }
    : {};

  return (
    <>
      {banner && (
        <div role="status" aria-live="polite" style={{
          background: "linear-gradient(90deg, #0a5f57, #083f3b)",
          color: "#fff",
          textAlign: "center",
          padding: "11px 20px",
          fontSize: "0.88rem",
          fontWeight: 500,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "10px",
          letterSpacing: "0.01em",
          ...bannerStyle
        }}>
          <span style={{
            display: "inline-block",
            width: "8px",
            height: "8px",
            borderRadius: "50%",
            background: "#4ade80",
            boxShadow: "0 0 0 0 rgba(74,222,128,0.7)",
            animation: "pulse-dot 1.8s ease-in-out infinite",
            flexShrink: 0,
          }} aria-hidden="true" />
          <span>
            <strong>{banner.strongText}</strong>{" "}
            {banner.text}
          </span>
        </div>
      )}
      
      <main id={id} className={className}>
        {header && (
          <section className="hero hero-wide" aria-labelledby={`${id}-title`}>
            <div className="hero-copy">
              <p className="kicker">{header.kicker}</p>
              <h1 id={`${id}-title`}>{header.title}</h1>
              <p className="hero-text">{header.description}</p>
              {header.actions && <div className="hero-actions">{header.actions}</div>}
              {header.callout}
            </div>
            {header.panel && (
              <div className="hero-panel" aria-label="Posture">
                {header.panel}
              </div>
            )}
          </section>
        )}
        {children}
      </main>
    </>
  );
}
