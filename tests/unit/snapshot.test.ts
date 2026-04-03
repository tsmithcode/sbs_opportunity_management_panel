import { expect, test } from "vitest";
import { generateCandidateStory } from "../../src/intelligence/story";
import {
  ExportPackageManifest,
  User,
  Opportunity,
  CandidateProfile,
  SourceArtifact,
  CorrespondenceItem,
} from "../../src/types";

test("ExportPackageManifest snapshot", () => {
  const mockManifest: ExportPackageManifest = {
    package_version: "0.1.0",
    schema_version: "1.0",
    generated_at: "2026-04-03T10:00:00Z",
    account_id: "mock_account_123",
    selected_user_id: "mock_user_456",
    selected_opportunity_id: "mock_opportunity_789",
    use_case_ids: ["monyawn-sbs"],
    included_paths: ["session.json", "manifest.json", "README.md", "candidate-story.md"],
    notes: ["Generated for snapshot testing", "Contains mock data"],
  };

  expect(mockManifest).toMatchSnapshot();
});

test("CandidateStory markdown structure snapshot", () => {
  const mockUser: User = {
    id: "user-123",
    account_id: "account-abc",
    full_name: "John Doe",
    email: "john.doe@example.com",
    timezone: "America/New_York",
    region: "North America",
    current_role: "Software Engineer",
    target_role_family: "Engineering Manager",
    target_compensation: "$150k-$200k",
    accessibility_needs: "None",
    sponsorship_type: "self_serve",
    created_at: "2026-04-01T00:00:00Z",
    updated_at: "2026-04-01T00:00:00Z",
  };

  const mockOpportunity: Opportunity = {
    opportunity_id: "opp-789",
    account_id: "account-abc",
    user_id: "user-123",
    use_case_id: "monyawn",
    company_name: "Acme Corp",
    role_title: "Senior Software Engineer",
    opportunity_source: "LinkedIn",
    job_posting_url: "http://example.com/job",
    employment_type: "full-time",
    location_type: "remote",
    current_stage: "intake_started",
    status: "active",
    created_at: "2026-04-01T00:00:00Z",
    updated_at: "2026-04-01T00:00:00Z",
  };

  const mockProfile: CandidateProfile = {
    profile_id: "profile-123",
    user_id: "user-123",
    opportunity_id: "opp-789",
    skills_summary: "Experienced in React, Node.js, TypeScript.",
    experience_level: "Senior",
    domain_strengths: "Frontend architecture, API design.",
    declared_gaps: "Less experience with distributed systems.",
    user_corrected: true,
    updated_at: "2026-04-02T00:00:00Z",
  };

  const mockArtifacts: SourceArtifact[] = [
    {
      artifact_id: "artifact-res",
      opportunity_id: "opp-789",
      artifact_type: "resume",
      source_label: "My Resume",
      origin: "user_uploaded",
      review_status: "approved",
      parse_status: "complete",
      version_number: 1,
      evidence_note: "Latest resume for Acme Corp.",
      content_summary: "Summary of resume content.",
      source_text: "Full resume text...",
      extracted_signals: {
        names: ["John Doe"],
        emails: ["john.doe@example.com"],
        phones: ["555-123-4567"],
        companies: ["PreviousCo", "OldCorp"],
        locations: ["New York"],
        dates: [],
        times: [],
        interviews: [],
        contingencies: [],
      },
      created_at: "2026-04-01T01:00:00Z",
    },
  ];

  const mockCorrespondence: CorrespondenceItem[] = [
    {
      correspondence_id: "corr-123",
      opportunity_id: "opp-789",
      channel: "email",
      subject: "Follow up on Acme Corp role",
      body: "Hi recruiter, following up on the Senior SE role...",
      status: "sent",
      scheduled_for: null,
      owner_role: "user",
      extracted_signals: {
        names: ["Recruiter Name"],
        emails: [],
        phones: [],
        companies: ["Acme Corp"],
        locations: [],
        dates: [],
        times: [],
        interviews: [],
        contingencies: [],
      },
      created_at: "2026-04-01T02:00:00Z",
    },
  ];

  const story = generateCandidateStory({
    user: mockUser,
    opportunity: mockOpportunity,
    profile: mockProfile,
    artifacts: mockArtifacts,
    correspondence: mockCorrespondence,
  });

  expect(story.markdown).toMatchSnapshot();
});
