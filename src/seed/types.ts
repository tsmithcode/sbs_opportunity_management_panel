import {
  AICheckpoint,
  CandidateProfile,
  CandidateStory,
  CorrespondenceItem,
  DecisionMemo,
  Escalation,
  Opportunity,
  StageEvent,
  SourceArtifact,
  SensitiveSupportProfile,
  WorkflowTask,
} from "../types";

export type SeedBundle = {
  opportunity: Opportunity;
  profile: CandidateProfile;
  artifacts: SourceArtifact[];
  checkpoints: AICheckpoint[];
  tasks: WorkflowTask[];
  escalations: Escalation[];
  memos: DecisionMemo[];
  correspondence: CorrespondenceItem[];
  candidateStory: CandidateStory;
  events: StageEvent[];
  sensitiveSupportProfiles: SensitiveSupportProfile[];
};
