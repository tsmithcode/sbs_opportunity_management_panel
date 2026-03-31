import { PrivacyGuardProps } from "./PrivacyGuard.contract";

export function PrivacyGuard({ storageType = "local" }: PrivacyGuardProps) {
  return (
    <div className="privacy-guard" aria-live="polite">
      <span className="privacy-guard-icon" aria-hidden="true">🛡️</span>
      <div>
        <p style={{ margin: 0, fontWeight: 700 }}>Privacy Guard Active</p>
        <p style={{ margin: 0, fontSize: "0.8rem", opacity: 0.9 }}>
          Your data is currently stored <strong>{storageType}ly</strong> in your browser. No data ever leaves your device.
        </p>
      </div>
    </div>
  );
}
