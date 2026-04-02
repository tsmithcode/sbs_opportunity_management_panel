export function ConversationAnswerCard({
  module,
  label,
  summary,
  meta,
  status,
  onEdit,
}: {
  module: string;
  label: string;
  summary: string;
  meta: string;
  status?: string | null;
  onEdit: () => void;
}) {
  return (
    <article className="rounded-[1.8rem] border border-black/8 bg-white/80 px-5 py-5 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-brand-accent">{module}</p>
          <h3 className="text-lg font-bold text-brand-ink mt-2">{label}</h3>
          <p className="text-sm text-brand-muted mt-2 leading-relaxed">{summary || "No answer yet."}</p>
          {status && (
            <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-amber-700 mt-3">
              {status}
            </p>
          )}
        </div>
        <div className="flex flex-col items-end gap-2">
          <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-brand-muted">{meta}</span>
          <button
            type="button"
            onClick={onEdit}
            className="px-3 py-1.5 rounded-full bg-brand-surface border border-black/10 text-xs font-semibold text-brand-ink hover:bg-black/5 transition-all"
          >
            Edit
          </button>
        </div>
      </div>
    </article>
  );
}
