import {
  ApprovalState,
  ArtifactType,
  CorrespondenceStatus,
  ExtractedSignalSet,
  ParseStatus,
  ReviewStatus,
  SensitiveSupportType,
} from "./common";

export type SourceArtifact = {
  artifact_id: string;
  opportunity_id: string;
  artifact_type: ArtifactType;
  source_label: string;
  origin: "user_uploaded" | "system_generated" | "imported" | "organization_supplied";
  review_status: ReviewStatus;
  parse_status: ParseStatus;
  version_number: number;
  evidence_note: string;
  content_summary: string;
  source_text: string;
  extracted_signals?: ExtractedSignalSet;
  created_at: string;
};

export type CandidateProfile = {
  profile_id: string;
  user_id: string;
  opportunity_id: string;
  skills_summary: string;
  experience_level: string;
  domain_strengths: string;
  declared_gaps: string;
  user_corrected: boolean;
  updated_at: string;
};

export type CommercialPostureProfile = {
  posture_id: string;
  opportunity_id: string;
  target_rate: string;
  engagement_type: "fixed_bid" | "time_and_materials" | "retainer";
  availability: string;
  sow_status: "drafting" | "proposed" | "negotiating" | "signed" | "not_started";
  notes: string;
  updated_at: string;
};

export type CorrespondenceItem = {
  correspondence_id: string;
  opportunity_id: string;
  channel: "email" | "linkedin" | "note";
  subject: string;
  body: string;
  status: CorrespondenceStatus;
  scheduled_for: string;
  owner_role: string;
  extracted_signals?: ExtractedSignalSet;
  created_at: string;
};

export type CandidateStory = {
  story_id: string;
  opportunity_id: string;
  title: string;
  summary: string;
  markdown: string;
  status: ApprovalState;
  source_artifact_ids: string[];
  source_correspondence_ids: string[];
  updated_at: string;
};

export type SensitiveSupportProfile = {
  support_profile_id: string;
  opportunity_id: string;
  enabled: boolean;
  categories: SensitiveSupportType[];
  notes: string;
  encouragement_plan: string;
  include_in_export: boolean;
  updated_at: string;
};

export type ReleaseArtifactReviewRecord = {
  review_id: string;
  account_id: string;
  opportunity_id: string;
  title: string;
  summary: string;
  source_name: string;
  entries: string[];
  content: string;
  pinned: boolean;
  imported_at: string;
};
