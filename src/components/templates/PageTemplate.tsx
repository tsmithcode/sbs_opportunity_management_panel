import { PageTemplateProps } from "./PageTemplate.contract";

export function PageTemplate({ id, className = "workspace", banner, header, children }: PageTemplateProps) {
  return (
    <>
      {banner && (
        <div role="status" aria-live="polite" className="bg-brand-accent-strong text-white text-center py-3 px-5 text-sm font-medium flex items-center justify-center gap-2.5 tracking-wide shadow-sm">
          <span className="inline-block w-2 h-2 rounded-full bg-[#4ade80] flex-shrink-0 animate-pulse-dot" aria-hidden="true" />
          <span>
            <strong>{banner.strongText}</strong>{" "}
            {banner.text}
          </span>
        </div>
      )}
      
      <main id={id} className={`w-full max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-10 py-8 sm:py-10 lg:py-12 ${className}`}>
        {header && (
          <section className="grid grid-cols-1 xl:grid-cols-[minmax(0,1.2fr)_minmax(340px,0.8fr)] gap-8 xl:gap-10 items-start mb-12 lg:mb-14" aria-labelledby={`${id}-title`}>
            <div className="flex flex-col gap-5 lg:gap-6 min-w-0">
              <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-brand-accent">{header.kicker}</p>
              <div className="max-w-4xl">
                <h1 id={`${id}-title`} className="text-3xl sm:text-4xl lg:text-5xl xl:text-[3.35rem] font-extrabold text-brand-ink leading-[0.98] tracking-[-0.04em]">{header.title}</h1>
              </div>
              <p className="text-base lg:text-lg text-brand-muted leading-relaxed max-w-[68ch]">{header.description}</p>
              {header.actions && <div className="flex flex-wrap gap-3 lg:gap-4 pt-1">{header.actions}</div>}
              {header.callout && <div className="max-w-3xl">{header.callout}</div>}
            </div>
            {header.panel && (
              <div className="w-full xl:sticky xl:top-24" aria-label="Posture">
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
