export type SignalSourceType = "recruiter_email" | "job_link" | "job_text" | "transcript" | "note";

export interface SignalIntakePayload {
  signalType: SignalSourceType;
  signalText: string;
  signalUrl: string;
}

export interface SignalIntakePageProps {
  onBack: () => void;
  onSubmitSignal: (payload: SignalIntakePayload) => void;
}
