export interface LoginPageProps {
  onContinueLocal: () => void;
  onContinueGoogle: () => void;
  onContinueApple: () => void;
  onLoadMockData?: () => void;
}
