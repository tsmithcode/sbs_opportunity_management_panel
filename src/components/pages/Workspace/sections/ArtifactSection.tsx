import { useMonyawn } from "../../../../context/MonyawnContext";
import { useArtifactOperations } from "../../../../hooks/useArtifactOperations";

export function ArtifactSection() {
  const { opportunityArtifacts } = useMonyawn();
  const { artifactDraft, setArtifactDraft, handleArtifactSubmit } = useArtifactOperations();

  return (
    <form className="flex flex-col gap-6 p-8 rounded-3xl bg-white/40 border border-black/5 shadow-brand-shadow" onSubmit={handleArtifactSubmit}>
      <div>
        <h3 className="text-2xl font-bold text-brand-ink mb-1">1. Drop your proof</h3>
        <p className="text-sm text-brand-muted">Resumes, job posts, notes, anything that backs your story.</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <label className="flex flex-col gap-1.5">
          <span className="text-[10px] font-bold uppercase tracking-widest text-brand-muted">Proof type</span>
          <select
            className="w-full px-4 py-2.5 rounded-xl border border-black/10 bg-brand-surface-strong focus:ring-2 focus:ring-brand-accent focus:border-transparent outline-none transition-all text-sm appearance-none"
            value={artifactDraft.artifact_type}
            onChange={(e) => setArtifactDraft({ ...artifactDraft, artifact_type: e.target.value as any })}
          >
            <option value="resume">Resume</option>
            <option value="job_description">Job Post</option>
            <option value="cover_letter">Cover Letter</option>
            <option value="portfolio">Portfolio / Work Sample</option>
            <option value="recruiter_notes">Recruiter Notes</option>
            <option value="internal_note">Private Note</option>
            <option value="generated_output">Generated Output</option>
          </select>
        </label>
        
        <label className="flex flex-col gap-1.5">
          <span className="text-[10px] font-bold uppercase tracking-widest text-brand-muted">Label</span>
          <input
            type="text"
            className="w-full px-4 py-2.5 rounded-xl border border-black/10 bg-brand-surface-strong focus:ring-2 focus:ring-brand-accent focus:border-transparent outline-none transition-all text-sm"
            required
            placeholder="e.g. My resume"
            value={artifactDraft.source_label}
            onChange={(e) => setArtifactDraft({ ...artifactDraft, source_label: e.target.value })}
          />
        </label>
      </div>

      <label className="flex flex-col gap-1.5">
        <span className="text-[10px] font-bold uppercase tracking-widest text-brand-muted">Quick summary</span>
        <textarea
          className="w-full px-4 py-2.5 rounded-xl border border-black/10 bg-brand-surface-strong focus:ring-2 focus:ring-brand-accent focus:border-transparent outline-none transition-all text-sm resize-none"
          required
          rows={4}
          placeholder="Paste key text or a short summary..."
          value={artifactDraft.content_summary}
          onChange={(e) => setArtifactDraft({ ...artifactDraft, content_summary: e.target.value })}
        />
      </label>

      <button className="bg-brand-accent text-white px-6 py-3 rounded-xl font-bold hover:bg-brand-accent-strong transition-all shadow-md active:scale-95 mt-2" type="submit">
        Add proof
      </button>

      {!opportunityArtifacts.length && (
        <div className="p-4 rounded-xl bg-brand-review/30 border border-brand-review/50 text-sm text-brand-ink">
          <p>No proof yet. Start with your resume to build the base.</p>
        </div>
      )}

      {opportunityArtifacts.length > 0 && (
        <div className="space-y-2 mt-4 pt-4 border-t border-black/5">
          <p className="text-[10px] font-bold uppercase tracking-widest text-brand-muted">Active proof ({opportunityArtifacts.length})</p>
          <ul className="space-y-2 list-none p-0 m-0">
            {opportunityArtifacts.map(a => (
              <li key={a.artifact_id} className="flex justify-between items-center p-3 rounded-lg bg-black/5 text-sm transition-all hover:bg-black/10">
                <span className="font-medium text-brand-ink">{a.source_label}</span>
                <span className="px-2 py-0.5 rounded-full bg-brand-highlight/30 text-brand-accent text-[10px] font-bold border border-brand-accent/10">{a.artifact_type}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </form>
  );
}
