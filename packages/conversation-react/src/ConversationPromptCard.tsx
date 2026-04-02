import React from "react";

export function ConversationPromptCard({
  title,
  segue,
  helper,
  position,
  total,
  control,
  errorMessage,
  showSubmit,
  onSubmit,
  onSkip,
  optional,
  titleId,
  descriptionId,
  helperId,
  errorId,
  containerRef,
}: {
  title: string;
  segue: string;
  helper?: string;
  position: number;
  total: number;
  control: React.ReactNode;
  errorMessage: string | null;
  showSubmit: boolean;
  onSubmit: () => void;
  onSkip?: () => void;
  optional?: boolean;
  titleId?: string;
  descriptionId?: string;
  helperId?: string;
  errorId?: string;
  containerRef?: React.RefObject<HTMLElement>;
}) {
  return (
    <article
      ref={containerRef}
      role="region"
      aria-labelledby={titleId}
      aria-describedby={[descriptionId, helper ? helperId : undefined, errorMessage ? errorId : undefined]
        .filter(Boolean)
        .join(" ")}
      tabIndex={-1}
      className="rounded-[2rem] border border-brand-accent/20 bg-[linear-gradient(180deg,rgba(255,255,255,0.98),rgba(208,231,221,0.26))] px-5 sm:px-6 lg:px-7 py-6 shadow-brand-shadow"
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-brand-accent">Live prompt</p>
          <h2 id={titleId} className="text-2xl font-bold tracking-[-0.04em] text-brand-ink mt-2">{title}</h2>
          <p id={descriptionId} className="text-base text-brand-muted leading-relaxed mt-3">{segue}</p>
          {helper && <p id={helperId} className="text-sm text-brand-muted leading-relaxed mt-3">{helper}</p>}
        </div>
        <div className="hidden sm:block rounded-full bg-white/80 border border-black/10 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.16em] text-brand-muted">
          {position} / {total}
        </div>
      </div>

      <div className="mt-6">{control}</div>

      {errorMessage && <p id={errorId} role="alert" className="text-sm text-red-600 mt-3">{errorMessage}</p>}

      {showSubmit && (
        <div className="flex flex-wrap gap-3 items-center mt-6">
          <button
            type="button"
            onClick={onSubmit}
            className="bg-brand-accent text-white px-6 py-3 rounded-full font-bold hover:bg-brand-accent-strong transition-all shadow-md active:scale-95"
          >
            Save and keep moving
          </button>
          {optional && onSkip && (
            <button
              type="button"
              onClick={onSkip}
              className="bg-brand-surface border border-black/10 text-brand-ink px-5 py-3 rounded-full font-medium hover:bg-black/5 transition-all active:scale-95"
            >
              Skip for now
            </button>
          )}
        </div>
      )}
    </article>
  );
}
