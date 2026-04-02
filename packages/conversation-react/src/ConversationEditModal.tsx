import React from "react";

export function ConversationEditModal({
  title,
  helper,
  control,
  errorMessage,
  onSave,
  onClose,
  controlId,
  descriptionId,
  errorId,
}: {
  title: string;
  helper: string;
  control: React.ReactNode;
  errorMessage: string | null;
  onSave: () => void;
  onClose: () => void;
  controlId?: string;
  descriptionId?: string;
  errorId?: string;
}) {
  const titleId = React.useId();
  const modalRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const container = modalRef.current;
    if (!container) {
      return;
    }

    const focusable = container.querySelector<HTMLElement>(
      `[id="${controlId}"], button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])`,
    );
    focusable?.focus();
  }, [controlId]);

  function handleKeyDown(event: React.KeyboardEvent<HTMLDivElement>) {
    if (event.key === "Escape") {
      event.preventDefault();
      onClose();
      return;
    }

    if (event.key !== "Tab") {
      return;
    }

    const container = modalRef.current;
    if (!container) {
      return;
    }

    const focusable = Array.from(
      container.querySelectorAll<HTMLElement>(
        `button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])`,
      ),
    ).filter((element) => !element.hasAttribute("disabled"));

    if (focusable.length === 0) {
      return;
    }

    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    const active = document.activeElement as HTMLElement | null;

    if (event.shiftKey && active === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && active === last) {
      event.preventDefault();
      first.focus();
    }
  }

  return (
    <div className="fixed inset-0 z-[60] bg-[rgba(24,32,40,0.45)] backdrop-blur-sm flex items-center justify-center px-4">
      <div
        ref={modalRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={[descriptionId, errorMessage ? errorId : undefined].filter(Boolean).join(" ")}
        onKeyDown={handleKeyDown}
        className="w-full max-w-2xl rounded-[2rem] border border-black/10 bg-white shadow-[0_30px_80px_rgba(24,32,40,0.2)] p-6 sm:p-7"
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-brand-accent">Edit answer</p>
            <h3 id={titleId} className="text-2xl font-bold tracking-[-0.04em] text-brand-ink mt-2">{title}</h3>
            <p id={descriptionId} className="text-sm text-brand-muted mt-3 leading-relaxed">{helper}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="h-10 w-10 rounded-full border border-black/10 bg-brand-surface text-brand-ink text-lg"
            aria-label="Close edit modal"
          >
            x
          </button>
        </div>

        <div className="mt-6">{control}</div>
        {errorMessage && <p id={errorId} role="alert" className="text-sm text-red-600 mt-3">{errorMessage}</p>}

        <div className="mt-6 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={onSave}
            className="bg-brand-accent text-white px-6 py-3 rounded-full font-bold hover:bg-brand-accent-strong transition-all shadow-md active:scale-95"
          >
            Save changes
          </button>
          <button
            type="button"
            onClick={onClose}
            className="bg-brand-surface border border-black/10 text-brand-ink px-5 py-3 rounded-full font-medium hover:bg-black/5 transition-all active:scale-95"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
