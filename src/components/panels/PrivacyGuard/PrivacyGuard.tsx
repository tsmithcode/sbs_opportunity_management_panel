import { PrivacyGuardProps } from "./PrivacyGuard.contract";

export function PrivacyGuard({ storageType = "local" }: PrivacyGuardProps) {
  return (
    <div className="flex items-start gap-4 p-4 lg:p-5 rounded-[1.5rem] bg-brand-ink text-white shadow-brand-shadow" aria-live="polite">
      <div className="h-10 w-10 rounded-2xl bg-white/10 flex items-center justify-center text-lg flex-none" aria-hidden="true">🛡️</div>
      <div className="min-w-0">
        <p className="m-0 text-[10px] font-bold uppercase tracking-[0.18em] text-white/70">Privacy guard</p>
        <p className="m-0 mt-1 font-bold leading-tight text-base">Local boundary is active.</p>
        <p className="m-0 mt-2 text-[0.82rem] opacity-90 leading-relaxed">
          Your data is stored <strong className="font-bold">{storageType}ly</strong> in the browser and does not leave this device unless you export it.
        </p>
      </div>
    </div>
  );
}
