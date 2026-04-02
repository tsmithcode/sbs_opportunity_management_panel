import { ConversationStep } from "../../conversation-core/src";

export function ConversationControlRenderer({
  step,
  value,
  onChange,
  inputId,
  labelledBy,
  describedBy,
  invalid = false,
  autoFocus = false,
}: {
  step: ConversationStep;
  value: unknown;
  onChange: (nextValue: unknown) => void;
  inputId?: string;
  labelledBy?: string;
  describedBy?: string;
  invalid?: boolean;
  autoFocus?: boolean;
}) {
  if (step.control === "choice") {
    return (
      <div
        role="radiogroup"
        aria-labelledby={labelledBy ?? (inputId ? `${inputId}-legend` : undefined)}
        aria-describedby={describedBy}
        className="grid grid-cols-1 md:grid-cols-2 gap-3"
      >
        <span id={inputId ? `${inputId}-legend` : undefined} className="sr-only">
          {step.label}
        </span>
        {step.options?.map((option) => (
          <button
            key={option.value}
            type="button"
            onClick={() => onChange(option.value)}
            role="radio"
            aria-checked={value === option.value}
            aria-describedby={option.hint ? `${inputId}-${option.value}-hint` : describedBy}
            className={`text-left rounded-[1.5rem] border px-4 py-4 transition-all ${
              value === option.value
                ? "border-brand-accent bg-brand-highlight/20 shadow-sm"
                : "border-black/10 bg-white hover:bg-brand-surface"
            }`}
          >
            <p className="text-sm font-semibold text-brand-ink">{option.label}</p>
            {option.hint && (
              <p
                id={inputId ? `${inputId}-${option.value}-hint` : undefined}
                className="text-xs text-brand-muted mt-2 leading-relaxed"
              >
                {option.hint}
              </p>
            )}
          </button>
        ))}
      </div>
    );
  }

  if (step.control === "select") {
    return (
      <select
        id={inputId}
        value={String(value ?? "")}
        onChange={(event) => onChange(event.target.value)}
        aria-labelledby={labelledBy}
        aria-describedby={describedBy}
        aria-invalid={invalid}
        autoFocus={autoFocus}
        className="w-full px-4 py-3 rounded-2xl border border-black/10 bg-white focus:ring-2 focus:ring-brand-accent focus:border-transparent outline-none transition-all text-sm"
      >
        <option value="">Choose one</option>
        {step.options?.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    );
  }

  if (step.control === "toggle") {
    const checked = Boolean(value);
    return (
      <button
        type="button"
        onClick={() => onChange(!checked)}
        id={inputId}
        role="switch"
        aria-checked={checked}
        aria-labelledby={labelledBy}
        aria-describedby={describedBy}
        className={`inline-flex items-center gap-3 rounded-full px-4 py-3 border transition-all ${
          checked
            ? "border-brand-accent bg-brand-highlight/20 text-brand-ink"
            : "border-black/10 bg-white text-brand-muted"
        }`}
      >
        <span
          className={`h-6 w-11 rounded-full transition-all ${checked ? "bg-brand-accent" : "bg-black/10"}`}
        >
          <span
            className={`block h-5 w-5 rounded-full bg-white mt-0.5 transition-all ${
              checked ? "translate-x-5" : "translate-x-0.5"
            }`}
          />
        </span>
        <span className="text-sm font-semibold">{checked ? "On" : "Off"}</span>
      </button>
    );
  }

  if (step.control === "textarea") {
    return (
      <textarea
        id={inputId}
        value={String(value ?? "")}
        onChange={(event) => onChange(event.target.value)}
        rows={8}
        placeholder={step.placeholder}
        aria-labelledby={labelledBy}
        aria-describedby={describedBy}
        aria-invalid={invalid}
        autoFocus={autoFocus}
        className="w-full px-4 py-3 rounded-[1.75rem] border border-black/10 bg-white focus:ring-2 focus:ring-brand-accent focus:border-transparent outline-none transition-all text-sm resize-none"
      />
    );
  }

  return (
    <input
      id={inputId}
      value={String(value ?? "")}
      onChange={(event) => onChange(event.target.value)}
      placeholder={step.placeholder}
      type={step.control === "email" ? "email" : step.control === "url" ? "url" : "text"}
      aria-labelledby={labelledBy}
      aria-describedby={describedBy}
      aria-invalid={invalid}
      autoFocus={autoFocus}
      className="w-full px-4 py-3 rounded-2xl border border-black/10 bg-white focus:ring-2 focus:ring-brand-accent focus:border-transparent outline-none transition-all text-sm"
    />
  );
}
