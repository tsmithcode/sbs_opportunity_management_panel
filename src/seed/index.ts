import {
  AppState,
  CandidateStory,
  EnterpriseControlProfile,
  ReportingSnapshot,
  RoleEntitlement,
} from "../types";
import { SCHEMA_VERSION } from "../schema";
import {
  createAccount,
  createEnterpriseControlProfile,
  createReportingSnapshot,
  createRoleEntitlement,
  nowIso,
} from "../workflow";
import { buildMonyawnBundles } from "./monyawn";
import { buildHabasitAccountsAndUsers, buildHabasitBundles } from "./habasit";

export function createSeedState(): AppState {
  const account = createAccount({
    account_name: "Monyawn Pilot Account",
    account_type: "enterprise",
    primary_region: "United States",
    support_tier: "Enterprise Premium Governance",
  });

  const userTimestamp = nowIso();
  const user = {
    user_id: "user_seed_primary",
    account_id: account.account_id,
    full_name: "Thomas Smith",
    email: "thomas@example.com",
    phone: "",
    timezone: "America/New_York",
    region: "United States",
    current_role: "Software Engineer",
    target_role_family: "Design Tools Engineering",
    target_compensation: "$165,000 - $195,000",
    accessibility_needs: "Keyboard-first workflow",
    sponsorship_type: "organization_sponsored" as const,
    created_at: userTimestamp,
    updated_at: userTimestamp,
  };

  const seededBundles = buildMonyawnBundles(account.account_id, user.user_id);
  const { habasitAccount, habasitUsers } = buildHabasitAccountsAndUsers();
  const habasitBundles = buildHabasitBundles(habasitAccount, habasitUsers);

  const opportunities = seededBundles.map((bundle) => bundle.opportunity);
  const candidateProfiles = seededBundles.map((bundle) => bundle.profile);
  const artifacts = seededBundles.flatMap((bundle) => bundle.artifacts);
  const checkpoints = seededBundles.flatMap((bundle) => bundle.checkpoints);
  const tasks = seededBundles.flatMap((bundle) => bundle.tasks);
  const escalations = seededBundles.flatMap((bundle) => bundle.escalations);
  const memos = seededBundles.flatMap((bundle) => bundle.memos);
  const correspondence = seededBundles.flatMap((bundle) => bundle.correspondence);
  const candidateStories: CandidateStory[] = seededBundles.map(
    (bundle) => bundle.candidateStory,
  );
  const events = seededBundles.flatMap((bundle) => bundle.events);
  const sensitiveSupportProfiles = seededBundles.flatMap(
    (bundle) => bundle.sensitiveSupportProfiles,
  );

  const enterpriseControlProfiles = [
    createEnterpriseControlProfile({
      account_id: account.account_id,
      entitlements_mode: "admin_controlled",
      external_release_requires_approval: true,
      export_confirmation_required: true,
      allow_sensitive_support_export: false,
      local_only_posture_locked: true,
      deployment_posture: "Local-only browser workspace with ZIP handoff packages.",
      buyer_readiness_stage: "buyer_reviewable",
      notes:
        "Premium governance sample keeps local-only posture locked and requires explicit approval before external release.",
    }),
  ];
  const roleEntitlements = [
    createRoleEntitlement({
      account_id: account.account_id,
      role_name: "Candidate / User",
      workspace_access: true,
      staff_queue_access: false,
      admin_console_access: false,
      export_package_access: true,
      diligence_packet_access: false,
      notes: "Guided workspace and personal handoff exports only.",
    }),
    createRoleEntitlement({
      account_id: account.account_id,
      role_name: "Staff Operations",
      workspace_access: true,
      staff_queue_access: true,
      admin_console_access: false,
      export_package_access: true,
      diligence_packet_access: false,
      notes: "Can coordinate queues, reviews, and controlled handoff preparation.",
    }),
    createRoleEntitlement({
      account_id: account.account_id,
      role_name: "Admin / Governance",
      workspace_access: true,
      staff_queue_access: true,
      admin_console_access: true,
      export_package_access: true,
      diligence_packet_access: true,
      notes: "Can manage enterprise controls, buyer readiness posture, and diligence materials.",
    }),
  ];

  const habasitEnterpriseControls: EnterpriseControlProfile[] = [
    createEnterpriseControlProfile({
      account_id: habasitAccount.account_id,
      entitlements_mode: "admin_controlled",
      external_release_requires_approval: true,
      export_confirmation_required: true,
      allow_sensitive_support_export: true,
      local_only_posture_locked: true,
      deployment_posture:
        "Local-only browser workspace with persistent sample history, buyer packet review, and ZIP handoff discipline.",
      buyer_readiness_stage: "guided_pilot",
      notes:
        "CEO town hall sample for Habasit America in Suwanee, GA. Used to capture failures, prove export/import, and harden the app from demo into product.",
    }),
  ];
  const habasitRoleEntitlements: RoleEntitlement[] = [
    createRoleEntitlement({
      account_id: habasitAccount.account_id,
      role_name: "CEO Town Hall Observer",
      workspace_access: true,
      staff_queue_access: true,
      admin_console_access: true,
      export_package_access: true,
      diligence_packet_access: true,
      notes: "Can review failures, release posture, and sample-state evidence in one workspace.",
    }),
  ];

  const allOpportunities = [...opportunities, ...habasitBundles.map((bundle) => bundle.opportunity)];
  const allProfiles = [...candidateProfiles, ...habasitBundles.map((bundle) => bundle.profile)];
  const allArtifacts = [...artifacts, ...habasitBundles.flatMap((bundle) => bundle.artifacts)];
  const allCheckpoints = [...checkpoints, ...habasitBundles.flatMap((bundle) => bundle.checkpoints)];
  const allTasks = [...tasks, ...habasitBundles.flatMap((bundle) => bundle.tasks)];
  const allEscalations = [...escalations, ...habasitBundles.flatMap((bundle) => bundle.escalations)];
  const allMemos = [...memos, ...habasitBundles.flatMap((bundle) => bundle.memos)];
  const allCorrespondence = [...correspondence, ...habasitBundles.flatMap((bundle) => bundle.correspondence)];
  const allCandidateStories = [
    ...candidateStories,
    ...habasitBundles.map((bundle) => bundle.candidateStory),
  ];
  const allEvents = [...events, ...habasitBundles.flatMap((bundle) => bundle.events)];
  const allSupportProfiles = [
    ...sensitiveSupportProfiles,
    ...habasitBundles.flatMap((bundle) => bundle.sensitiveSupportProfiles),
  ];

  const baseState: AppState = {
    schemaVersion: SCHEMA_VERSION,
    accounts: [account, habasitAccount],
    users: [user, ...habasitUsers],
    opportunities: allOpportunities,
    artifacts: allArtifacts,
    candidateProfiles: allProfiles,
    commercialPostures: [],
    events: allEvents,
    checkpoints: allCheckpoints,
    tasks: allTasks,
    escalations: allEscalations,
    memos: allMemos,
    reportingSnapshots: [],
    correspondence: allCorrespondence,
    candidateStories: allCandidateStories,
    sensitiveSupportProfiles: allSupportProfiles,
    enterpriseControlProfiles: [...enterpriseControlProfiles, ...habasitEnterpriseControls],
    roleEntitlements: [...roleEntitlements, ...habasitRoleEntitlements],
    releaseArtifactReviews: [],
    outcomes: [],
    aiSettings: {
      provider: "local",
      model: "gpt-4o-mini",
    },
    selectedAccountId: account.account_id,
    selectedUserId: user.user_id,
    selectedOpportunityId: allOpportunities[0].opportunity_id,
    currentMode: "user",
    lastSavedAt: nowIso(),
    lastExportedAt: "",
  };

  const reportingSnapshots: ReportingSnapshot[] = [createReportingSnapshot(baseState)];

  return {
    ...baseState,
    reportingSnapshots,
  };
}
