export interface AiSettingsPanelProps {
  settings: {
    openai_api_key?: string;
    model?: string;
    provider: "local" | "openai";
  };
  onSettingsChange: (settings: {
    openai_api_key?: string;
    model?: string;
    provider: "local" | "openai";
  }) => void;
}
