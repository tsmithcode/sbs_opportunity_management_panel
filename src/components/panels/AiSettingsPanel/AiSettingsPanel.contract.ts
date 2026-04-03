export interface AiSettingsPanelProps {
  settings: {
    openai_api_key?: string;
    anthropic_api_key?: string;
    api_base_url?: string;
    model?: string;
    provider: "local" | "openai" | "anthropic";
  };
  onSettingsChange: (settings: {
    openai_api_key?: string;
    anthropic_api_key?: string;
    api_base_url?: string;
    model?: string;
    provider: "local" | "openai" | "anthropic";
  }) => void;
}
