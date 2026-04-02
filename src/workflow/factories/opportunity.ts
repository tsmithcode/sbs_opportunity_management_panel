import {
  CandidateProfile,
  Opportunity,
  SourceArtifact,
} from "../../types";
import { createId, nowIso } from "../utils";

export function createOpportunity(input: {
  account_id: string;
  user_id: string;
  use_case_id: string;
  pathway: "w2" | "1099";
  company_name: string;
  role_title: string;
  opportunity_source: string;
  job_posting_url: string;
  employment_type: string;
  location_type: string;
}): Opportunity {
  const timestamp = nowIso();
  return {
    opportunity_id: createId("opp"),
    current_stage: "intake_started",
    status: "active",
    created_at: timestamp,
    updated_at: timestamp,
    ...input,
  };
}

export function createCandidateProfile(userId: string, opportunityId: string): CandidateProfile {
  return {
    profile_id: createId("profile"),
    user_id: userId,
    opportunity_id: opportunityId,
    skills_summary: "",
    experience_level: "",
    domain_strengths: "",
    declared_gaps: "",
    user_corrected: false,
    updated_at: nowIso(),
  };
}

export function createArtifact(input: {
  opportunity_id: string;
  artifact_type: SourceArtifact["artifact_type"];
  source_label: string;
  origin: SourceArtifact["origin"];
  review_status: SourceArtifact["review_status"];
  parse_status: SourceArtifact["parse_status"];
  evidence_note: string;
  content_summary: string;
  source_text?: string;
  extracted_signals?: SourceArtifact["extracted_signals"];
  version_number?: number;
}): SourceArtifact {
  return {
    artifact_id: createId("artifact"),
    version_number: input.version_number ?? 1,
    created_at: nowIso(),
    source_text: input.source_text ?? input.content_summary,
    ...input,
  };
}
