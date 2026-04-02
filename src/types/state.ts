import { AppMode } from "./common";
import { Account, User } from "./auth";
import { Opportunity } from "./opportunity";
import {
  CandidateProfile,
  SourceArtifact,
  CommercialPostureProfile,
  CorrespondenceItem,
  CandidateStory,
  SensitiveSupportProfile,
  ReleaseArtifactReviewRecord,
} from "./artifacts";
import {
  StageEvent,
  AICheckpoint,
  WorkflowTask,
  Escalation,
  DecisionMemo,
  ReportingSnapshot,
  OutcomeMetadata,
} from "./workflow";
import { EnterpriseControlProfile, RoleEntitlement } from "./enterprise";

export type AiSettings = {
  openai_api_key?: string;
  model?: string;
  provider: "local" | "openai";
};

export type AppState = {
  schemaVersion: string;
  accounts: Account[];
  users: User[];
  opportunities: Opportunity[];
  artifacts: SourceArtifact[];
  candidateProfiles: CandidateProfile[];
  commercialPostures: CommercialPostureProfile[];
  events: StageEvent[];
  checkpoints: AICheckpoint[];
  tasks: WorkflowTask[];
  escalations: Escalation[];
  memos: DecisionMemo[];
  reportingSnapshots: ReportingSnapshot[];
  correspondence: CorrespondenceItem[];
  candidateStories: CandidateStory[];
  sensitiveSupportProfiles: SensitiveSupportProfile[];
  enterpriseControlProfiles: EnterpriseControlProfile[];
  roleEntitlements: RoleEntitlement[];
  releaseArtifactReviews: ReleaseArtifactReviewRecord[];
  outcomes: OutcomeMetadata[];
  aiSettings: AiSettings;
  selectedAccountId: string;
  selectedUserId: string;
  selectedOpportunityId: string;
  currentMode: AppMode;
  lastSavedAt: string;
  lastExportedAt: string;
};
