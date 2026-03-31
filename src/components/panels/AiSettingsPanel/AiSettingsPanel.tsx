import { AiSettingsPanelProps } from "./AiSettingsPanel.contract";

export function AiSettingsPanel({ settings, onSettingsChange }: AiSettingsPanelProps) {
  return (
    <div className="stage-block ai-settings-panel">
      <h3>AI Intelligence Settings 🥱</h3>
      <p>Configure how Monyawn processes your narrative. Local rule-based processing is always free and private. 🥱</p>
      
      <div className="field-stack">
        <label className="field">
          <span>AI Provider</span>
          <select 
            value={settings.provider} 
            onChange={e => onSettingsChange({ ...settings, provider: e.target.value as any })}
          >
            <option value="local">Local Rules (Private & Free)</option>
            <option value="openai">OpenAI API (Higher Yield)</option>
          </select>
        </label>

        {settings.provider === "openai" && (
          <>
            <label className="field">
              <span>OpenAI API Key</span>
              <input 
                type="password" 
                value={settings.openai_api_key || ""} 
                onChange={e => onSettingsChange({ ...settings, openai_api_key: e.target.value })}
                placeholder="sk-..."
              />
              <span className="field-help">Stored locally in your browser only.</span>
            </label>
            <label className="field">
              <span>Model</span>
              <select 
                value={settings.model || "gpt-4o-mini"} 
                onChange={e => onSettingsChange({ ...settings, model: e.target.value })}
              >
                <option value="gpt-4o-mini">GPT-4o mini (Recommended)</option>
                <option value="gpt-4o">GPT-4o (High Quality)</option>
              </select>
            </label>
          </>
        )}
      </div>
    </div>
  );
}
