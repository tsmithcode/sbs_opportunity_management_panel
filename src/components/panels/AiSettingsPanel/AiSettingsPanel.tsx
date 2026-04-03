import { AiSettingsPanelProps } from "./AiSettingsPanel.contract";

export function AiSettingsPanel({ settings, onSettingsChange }: AiSettingsPanelProps) {
  return (
    <div className="flex flex-col gap-6 p-8 rounded-3xl bg-white/40 border border-black/5 shadow-brand-shadow">
      <div>
        <h3 className="text-2xl font-bold text-brand-ink mb-1">AI settings</h3>
        <p className="text-sm text-brand-muted">
          Pick how we polish your story. Local mode is free and private.
        </p>
      </div>

      <div className="flex flex-col gap-6">
        <label className="flex flex-col gap-1.5">
          <span className="text-[10px] font-bold uppercase tracking-widest text-brand-muted">
            AI Provider
          </span>
          <select
            className="w-full px-4 py-2.5 rounded-xl border border-black/10 bg-brand-surface-strong focus:ring-2 focus:ring-brand-accent focus:border-transparent outline-none transition-all text-sm appearance-none"
            value={settings.provider}
            onChange={(e) => onSettingsChange({ ...settings, provider: e.target.value as any })}
          >
            <option value="local">Local Rules (Private & Free)</option>
            <option value="openai">OpenAI API (Higher Yield)</option>
            <option value="anthropic">Anthropic API (Precise Writing)</option>
          </select>
        </label>

        {settings.provider === "openai" && (
          <div className="flex flex-col gap-6 pt-6 border-t border-black/5">
            <label className="flex flex-col gap-1.5">
              <span className="text-[10px] font-bold uppercase tracking-widest text-brand-muted">
                OpenAI API Key
              </span>
              <input
                className="w-full px-4 py-2.5 rounded-xl border border-black/10 bg-brand-surface-strong focus:ring-2 focus:ring-brand-accent focus:border-transparent outline-none transition-all text-sm"
                type="password"
                value={settings.openai_api_key || ""}
                onChange={(e) => onSettingsChange({ ...settings, openai_api_key: e.target.value })}
                placeholder="sk-..."
              />
              <span className="text-[10px] text-brand-muted mt-1">
                Stored locally in your browser only.
              </span>
            </label>
            <label className="flex flex-col gap-1.5">
              <span className="text-[10px] font-bold uppercase tracking-widest text-brand-muted">
                API Base URL (Optional)
              </span>
              <input
                className="w-full px-4 py-2.5 rounded-xl border border-black/10 bg-brand-surface-strong focus:ring-2 focus:ring-brand-accent focus:border-transparent outline-none transition-all text-sm"
                type="text"
                value={settings.api_base_url || ""}
                onChange={(e) => onSettingsChange({ ...settings, api_base_url: e.target.value })}
                placeholder="https://api.openai.com/v1"
              />
              <span className="text-[10px] text-brand-muted mt-1">
                Change this to use a proxy or custom backend (e.g. Railway).
              </span>
            </label>
            <label className="flex flex-col gap-1.5">
              <span className="text-[10px] font-bold uppercase tracking-widest text-brand-muted">
                Model
              </span>
              <select
                className="w-full px-4 py-2.5 rounded-xl border border-black/10 bg-brand-surface-strong focus:ring-2 focus:ring-brand-accent focus:border-transparent outline-none transition-all text-sm appearance-none"
                value={settings.model || "gpt-4o-mini"}
                onChange={(e) => onSettingsChange({ ...settings, model: e.target.value })}
              >
                <option value="gpt-4o-mini">GPT-4o mini (Recommended)</option>
                <option value="gpt-4o">GPT-4o (High Quality)</option>
              </select>
            </label>
          </div>
        )}

        {settings.provider === "anthropic" && (
          <div className="flex flex-col gap-6 pt-6 border-t border-black/5">
            <label className="flex flex-col gap-1.5">
              <span className="text-[10px] font-bold uppercase tracking-widest text-brand-muted">
                Anthropic API Key
              </span>
              <input
                className="w-full px-4 py-2.5 rounded-xl border border-black/10 bg-brand-surface-strong focus:ring-2 focus:ring-brand-accent focus:border-transparent outline-none transition-all text-sm"
                type="password"
                value={settings.anthropic_api_key || ""}
                onChange={(e) =>
                  onSettingsChange({ ...settings, anthropic_api_key: e.target.value })
                }
                placeholder="sk-ant-..."
              />
              <span className="text-[10px] text-brand-muted mt-1">
                Stored locally in your browser only.
              </span>
            </label>
            <label className="flex flex-col gap-1.5">
              <span className="text-[10px] font-bold uppercase tracking-widest text-brand-muted">
                API Base URL (Optional)
              </span>
              <input
                className="w-full px-4 py-2.5 rounded-xl border border-black/10 bg-brand-surface-strong focus:ring-2 focus:ring-brand-accent focus:border-transparent outline-none transition-all text-sm"
                type="text"
                value={settings.api_base_url || ""}
                onChange={(e) => onSettingsChange({ ...settings, api_base_url: e.target.value })}
                placeholder="https://api.anthropic.com"
              />
              <span className="text-[10px] text-brand-muted mt-1">
                Change this to use a proxy or custom backend (e.g. Railway).
              </span>
            </label>
            <label className="flex flex-col gap-1.5">
              <span className="text-[10px] font-bold uppercase tracking-widest text-brand-muted">
                Model
              </span>
              <select
                className="w-full px-4 py-2.5 rounded-xl border border-black/10 bg-brand-surface-strong focus:ring-2 focus:ring-brand-accent focus:border-transparent outline-none transition-all text-sm appearance-none"
                value={settings.model || "claude-3-haiku-20240307"}
                onChange={(e) => onSettingsChange({ ...settings, model: e.target.value })}
              >
                <option value="claude-3-haiku-20240307">Claude 3 Haiku (Fast)</option>
                <option value="claude-3-sonnet-20240229">Claude 3 Sonnet (Balanced)</option>
                <option value="claude-3-opus-20240229">Claude 3 Opus (Powerful)</option>
              </select>
            </label>
          </div>
        )}
      </div>
    </div>
  );
}
