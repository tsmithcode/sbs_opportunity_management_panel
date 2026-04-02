import { AiSettingsPanelProps } from "./AiSettingsPanel.contract";

export function AiSettingsPanel({ settings, onSettingsChange }: AiSettingsPanelProps) {
  return (
    <div className="flex flex-col gap-6 p-8 rounded-3xl bg-white/40 border border-black/5 shadow-brand-shadow">
      <div>
        <h3 className="text-2xl font-bold text-brand-ink mb-1">AI Intelligence Settings 🥱</h3>
        <p className="text-sm text-brand-muted">Configure how Monyawn processes your narrative. Local rule-based processing is always free and private. 🥱</p>
      </div>
      
      <div className="flex flex-col gap-6">
        <label className="flex flex-col gap-1.5">
          <span className="text-[10px] font-bold uppercase tracking-widest text-brand-muted">AI Provider</span>
          <select 
            className="w-full px-4 py-2.5 rounded-xl border border-black/10 bg-brand-surface-strong focus:ring-2 focus:ring-brand-accent focus:border-transparent outline-none transition-all text-sm appearance-none"
            value={settings.provider} 
            onChange={e => onSettingsChange({ ...settings, provider: e.target.value as any })}
          >
            <option value="local">Local Rules (Private & Free)</option>
            <option value="openai">OpenAI API (Higher Yield)</option>
          </select>
        </label>

        {settings.provider === "openai" && (
          <div className="flex flex-col gap-6 pt-6 border-t border-black/5">
            <label className="flex flex-col gap-1.5">
              <span className="text-[10px] font-bold uppercase tracking-widest text-brand-muted">OpenAI API Key</span>
              <input 
                className="w-full px-4 py-2.5 rounded-xl border border-black/10 bg-brand-surface-strong focus:ring-2 focus:ring-brand-accent focus:border-transparent outline-none transition-all text-sm"
                type="password" 
                value={settings.openai_api_key || ""} 
                onChange={e => onSettingsChange({ ...settings, openai_api_key: e.target.value })}
                placeholder="sk-..."
              />
              <span className="text-[10px] text-brand-muted mt-1">Stored locally in your browser only.</span>
            </label>
            <label className="flex flex-col gap-1.5">
              <span className="text-[10px] font-bold uppercase tracking-widest text-brand-muted">Model</span>
              <select 
                className="w-full px-4 py-2.5 rounded-xl border border-black/10 bg-brand-surface-strong focus:ring-2 focus:ring-brand-accent focus:border-transparent outline-none transition-all text-sm appearance-none"
                value={settings.model || "gpt-4o-mini"} 
                onChange={e => onSettingsChange({ ...settings, model: e.target.value })}
              >
                <option value="gpt-4o-mini">GPT-4o mini (Recommended)</option>
                <option value="gpt-4o">GPT-4o (High Quality)</option>
              </select>
            </label>
          </div>
        )}
      </div>
    </div>
  );
}
