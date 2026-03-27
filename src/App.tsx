import { ChangeEvent, FormEvent, useEffect, useMemo, useRef, useState } from "react";
import { getCoachingForStage, getCoachingTitle } from "./coaching";
import { validateAppStateIntegrity } from "./integrity";
import {
  createCandidateStoryRecord,
  extractSignalsFromText,
  generateCandidateStory,
  mergeSignalSets,
} from "./intelligence";
import { createSeedState } from "./seed";
import { releaseStatus } from "./releaseStatus";
import { SCHEMA_VERSION } from "./schema";
import { supportTemplates } from "./support";
import type {
  AccountType,
  AppMode,
  AppState,
  ArtifactType,
  CorrespondenceStatus,
  OpportunityStatus,
  ParseStatus,
  ReviewStatus,
  SensitiveSupportType,
  SponsorshipType,
  TaskStatus,
} from "./types";
import {
  apiSurface,
  createAccount,
  createArtifact,
  createCheckpoint,
  createCorrespondence,
  createEscalation,
  createMemo,
  createOpportunity,
  createReportingSnapshot,
  createSensitiveSupportProfile,
  createTask,
  createUser,
  createRoleEntitlement,
  getOpportunityCandidateStory,
  getCompletionScore,
  getGovernanceOverlays,
  getNextStage,
  getOpportunityArtifacts,
  getOpportunityCheckpoints,
  getOpportunityCorrespondence,
  getOpportunityEscalations,
  getOpportunitySensitiveSupport,
  getOpportunityTasks,
  isClosedStage,
  nowIso,
  stageMeta,
  stageOrder,
} from "./workflow";

const STORAGE_KEY = "monyawn-platform-state-v1";
const RESUME_PATH = "/thomas-smith-architect-resume.pdf";

type AppPage = "workspace" | "about";

const aboutExperts = [
  {
    role: "Founder / CEO",
    purpose: "Owns company direction, mission clarity, and the long-range reason Monyawn exists.",
  },
  {
    role: "Mission / Purpose Lead",
    purpose: "Turns company values and public purpose into stable product and brand guidance.",
  },
  {
    role: "Brand Strategy Lead",
    purpose: "Shapes how Monyawn is understood in the market and how the story stays coherent across product and public surfaces.",
  },
  {
    role: "Marketing / Communications Lead",
    purpose: "Owns public-facing messaging, including how the about page explains the platform in plain language.",
  },
  {
    role: "Candidate Story Architect",
    purpose: "Ensures the product teaches users how to communicate identity, value, and purpose through evidence-backed narrative.",
  },
  {
    role: "Trust Center / Public Documentation Owner",
    purpose: "Keeps public-facing explanations truthful, aligned to policy, and consistent with the product’s local-only posture.",
  },
];

type Notice = { tone: "success" | "info"; message: string } | null;
type ImportedReleaseArtifact = {
  title: string;
  summary: string;
  sourceName: string;
  entries: string[];
  content: string;
} | null;

type AccountDraft = {
  account_name: string;
  account_type: AccountType;
  primary_region: string;
  support_tier: string;
};

type UserDraft = {
  full_name: string;
  email: string;
  phone: string;
  timezone: string;
  region: string;
  current_role: string;
  target_role_family: string;
  target_compensation: string;
  accessibility_needs: string;
  sponsorship_type: SponsorshipType;
};

type OpportunityDraft = {
  company_name: string;
  role_title: string;
  opportunity_source: string;
  job_posting_url: string;
  employment_type: string;
  location_type: string;
};

type ArtifactDraft = {
  artifact_type: ArtifactType;
  source_label: string;
  origin: "user_uploaded" | "system_generated" | "imported" | "organization_supplied";
  review_status: ReviewStatus;
  parse_status: ParseStatus;
  evidence_note: string;
  content_summary: string;
};

type ProfileDraft = {
  skills_summary: string;
  experience_level: string;
  domain_strengths: string;
  declared_gaps: string;
  user_corrected: boolean;
};

type TaskDraft = {
  task_type: string;
  owner_role: string;
  blocking: boolean;
};

type EscalationDraft = {
  escalation_type:
    | "product"
    | "accessibility"
    | "security"
    | "privacy"
    | "legal"
    | "policy"
    | "finance"
    | "support"
    | "delivery";
  owner_role: string;
  severity: "low" | "medium" | "high" | "critical";
  resolution_notes: string;
};

type CorrespondenceDraft = {
  channel: "email" | "linkedin" | "note";
  subject: string;
  body: string;
};

type SensitiveSupportDraft = {
  enabled: boolean;
  categories: SensitiveSupportType[];
  notes: string;
  encouragement_plan: string;
  include_in_export: boolean;
};

const defaultAccountDraft: AccountDraft = {
  account_name: "",
  account_type: "enterprise",
  primary_region: "United States",
  support_tier: "Enterprise Premium Governance",
};

const defaultUserDraft: UserDraft = {
  full_name: "",
  email: "",
  phone: "",
  timezone: "America/New_York",
  region: "United States",
  current_role: "",
  target_role_family: "",
  target_compensation: "",
  accessibility_needs: "",
  sponsorship_type: "organization_sponsored",
};

const defaultOpportunityDraft: OpportunityDraft = {
  company_name: "",
  role_title: "",
  opportunity_source: "",
  job_posting_url: "",
  employment_type: "Full-time",
  location_type: "Remote",
};

const defaultArtifactDraft: ArtifactDraft = {
  artifact_type: "resume",
  source_label: "",
  origin: "user_uploaded",
  review_status: "unreviewed",
  parse_status: "pending",
  evidence_note: "",
  content_summary: "",
};

const defaultTaskDraft: TaskDraft = {
  task_type: "Review generated output",
  owner_role: "Workflow Analyst",
  blocking: true,
};

const defaultEscalationDraft: EscalationDraft = {
  escalation_type: "policy",
  owner_role: "Safety / Policy Lead",
  severity: "medium",
  resolution_notes: "",
};

const defaultCorrespondenceDraft: CorrespondenceDraft = {
  channel: "email",
  subject: "",
  body: "",
};

const defaultSensitiveSupportDraft: SensitiveSupportDraft = {
  enabled: false,
  categories: [],
  notes: "",
  encouragement_plan: "",
  include_in_export: false,
};

const modeLabels: Record<AppMode, string> = {
  user: "Guided workspace",
  staff: "Staff operations",
  admin: "Admin and governance",
};

function formatTimestampForFile(value: string) {
  return value.replace(/[-:]/g, "").replace(/\.\d+Z$/, "Z");
}

function slugify(input: string) {
  return input
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 48);
}

function downloadTextFile(filename: string, content: string, mimeType: string) {
  const blob = new Blob([content], { type: mimeType });
  const url = window.URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  anchor.click();
  window.URL.revokeObjectURL(url);
}

function buildDefaultEnterpriseAdminRecords(accounts: AppState["accounts"]) {
  const enterpriseControlProfiles = accounts.map((account) => ({
    control_profile_id: `control_${account.account_id}`,
    account_id: account.account_id,
    entitlements_mode: "guided_default" as const,
    external_release_requires_approval: true,
    export_confirmation_required: true,
    allow_sensitive_support_export: false,
    local_only_posture_locked: true,
    deployment_posture: "Local-only browser workspace with ZIP handoff packages.",
    buyer_readiness_stage: "internal_only" as const,
    notes: "Auto-created local-only governance profile.",
    updated_at: nowIso(),
  }));

  const roleEntitlements = accounts.flatMap((account) => [
    createRoleEntitlement({
      account_id: account.account_id,
      role_name: "Candidate / User",
      workspace_access: true,
      staff_queue_access: false,
      admin_console_access: false,
      export_package_access: true,
      diligence_packet_access: false,
      notes: "Default guided access.",
    }),
    createRoleEntitlement({
      account_id: account.account_id,
      role_name: "Staff Operations",
      workspace_access: true,
      staff_queue_access: true,
      admin_console_access: false,
      export_package_access: true,
      diligence_packet_access: false,
      notes: "Default review and queue access.",
    }),
    createRoleEntitlement({
      account_id: account.account_id,
      role_name: "Admin / Governance",
      workspace_access: true,
      staff_queue_access: true,
      admin_console_access: true,
      export_package_access: true,
      diligence_packet_access: true,
      notes: "Default governance owner for local-only review.",
    }),
  ]);

  return { enterpriseControlProfiles, roleEntitlements };
}

function mergeEnterpriseAdminRecords(
  accounts: AppState["accounts"],
  enterpriseControlProfiles: AppState["enterpriseControlProfiles"] | undefined,
  roleEntitlements: AppState["roleEntitlements"] | undefined,
) {
  const defaults = buildDefaultEnterpriseAdminRecords(accounts);
  const existingProfiles = enterpriseControlProfiles ?? [];
  const existingEntitlements = roleEntitlements ?? [];

  const mergedProfiles = [
    ...existingProfiles,
    ...defaults.enterpriseControlProfiles.filter(
      (defaultProfile) =>
        !existingProfiles.some((profile) => profile.account_id === defaultProfile.account_id),
    ),
  ];

  const mergedEntitlements = [
    ...existingEntitlements,
    ...defaults.roleEntitlements.filter(
      (defaultEntitlement) =>
        !existingEntitlements.some(
          (entitlement) =>
            entitlement.account_id === defaultEntitlement.account_id &&
            entitlement.role_name === defaultEntitlement.role_name,
        ),
    ),
  ];

  return {
    enterpriseControlProfiles: mergedProfiles,
    roleEntitlements: mergedEntitlements,
  };
}

function loadInitialState(): AppState {
  const rawState = window.localStorage.getItem(STORAGE_KEY);
  if (!rawState) {
    return createSeedState();
  }

  try {
    const parsed = JSON.parse(rawState) as Partial<AppState>;
    const fallback = createSeedState();
    const accounts = parsed.accounts ?? fallback.accounts;
    const mergedAdminRecords = mergeEnterpriseAdminRecords(
      accounts,
      parsed.enterpriseControlProfiles,
      parsed.roleEntitlements,
    );

    return {
      ...fallback,
      ...parsed,
      accounts,
      schemaVersion: parsed.schemaVersion ?? SCHEMA_VERSION,
      reportingSnapshots: parsed.reportingSnapshots ?? fallback.reportingSnapshots,
      candidateStories: parsed.candidateStories ?? fallback.candidateStories,
      sensitiveSupportProfiles:
        parsed.sensitiveSupportProfiles ?? fallback.sensitiveSupportProfiles,
      enterpriseControlProfiles: mergedAdminRecords.enterpriseControlProfiles,
      roleEntitlements: mergedAdminRecords.roleEntitlements,
      releaseArtifactReviews: (parsed.releaseArtifactReviews ?? fallback.releaseArtifactReviews).map(
        (item) => ({
          ...item,
          pinned: item.pinned ?? false,
        }),
      ),
      lastExportedAt: parsed.lastExportedAt ?? "",
    };
  } catch {
    return createSeedState();
  }
}

function App() {
  const [currentPage, setCurrentPage] = useState<AppPage>(() =>
    window.location.hash === "#about" ? "about" : "workspace",
  );
  const [state, setState] = useState<AppState>(() => loadInitialState());
  const [notice, setNotice] = useState<Notice>(null);
  const [accountDraft, setAccountDraft] = useState<AccountDraft>(defaultAccountDraft);
  const [userDraft, setUserDraft] = useState<UserDraft>(defaultUserDraft);
  const [opportunityDraft, setOpportunityDraft] = useState<OpportunityDraft>(
    defaultOpportunityDraft,
  );
  const [artifactDraft, setArtifactDraft] = useState<ArtifactDraft>(defaultArtifactDraft);
  const [taskDraft, setTaskDraft] = useState<TaskDraft>(defaultTaskDraft);
  const [escalationDraft, setEscalationDraft] = useState<EscalationDraft>(
    defaultEscalationDraft,
  );
  const [correspondenceDraft, setCorrespondenceDraft] = useState<CorrespondenceDraft>(
    defaultCorrespondenceDraft,
  );
  const [candidateStoryDraft, setCandidateStoryDraft] = useState("");
  const [sensitiveSupportDraft, setSensitiveSupportDraft] = useState<SensitiveSupportDraft>(
    defaultSensitiveSupportDraft,
  );
  const [importedReleaseArtifact, setImportedReleaseArtifact] =
    useState<ImportedReleaseArtifact>(null);
  const [releaseArtifactQuery, setReleaseArtifactQuery] = useState("");
  const [lastIntegrityRunAt, setLastIntegrityRunAt] = useState("");
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const releaseArtifactInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    const nextState = { ...state, lastSavedAt: nowIso() };
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(nextState));
  }, [state]);

  useEffect(() => {
    const timer = window.setTimeout(() => setNotice(null), 3000);
    return () => window.clearTimeout(timer);
  }, [notice]);

  useEffect(() => {
    const handleHashChange = () => {
      setCurrentPage(window.location.hash === "#about" ? "about" : "workspace");
    };

    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, []);

  const selectedAccount = state.accounts.find(
    (account) => account.account_id === state.selectedAccountId,
  );
  const selectedUser = state.users.find((user) => user.user_id === state.selectedUserId);
  const selectedOpportunity = state.opportunities.find(
    (opportunity) => opportunity.opportunity_id === state.selectedOpportunityId,
  );
  const selectedProfile = state.candidateProfiles.find(
    (profile) => profile.opportunity_id === state.selectedOpportunityId,
  );

  const profileDraft: ProfileDraft = useMemo(
    () => ({
      skills_summary: selectedProfile?.skills_summary ?? "",
      experience_level: selectedProfile?.experience_level ?? "",
      domain_strengths: selectedProfile?.domain_strengths ?? "",
      declared_gaps: selectedProfile?.declared_gaps ?? "",
      user_corrected: selectedProfile?.user_corrected ?? false,
    }),
    [selectedProfile],
  );

  const opportunityArtifacts = useMemo(
    () =>
      selectedOpportunity
        ? getOpportunityArtifacts(state, selectedOpportunity.opportunity_id)
        : [],
    [selectedOpportunity, state],
  );
  const opportunityTasks = useMemo(
    () =>
      selectedOpportunity ? getOpportunityTasks(state, selectedOpportunity.opportunity_id) : [],
    [selectedOpportunity, state],
  );
  const opportunityCheckpoints = useMemo(
    () =>
      selectedOpportunity
        ? getOpportunityCheckpoints(state, selectedOpportunity.opportunity_id)
        : [],
    [selectedOpportunity, state],
  );
  const opportunityCorrespondence = useMemo(
    () =>
      selectedOpportunity
        ? getOpportunityCorrespondence(state, selectedOpportunity.opportunity_id)
        : [],
    [selectedOpportunity, state],
  );
  const opportunityEscalations = useMemo(
    () =>
      selectedOpportunity
        ? getOpportunityEscalations(state, selectedOpportunity.opportunity_id)
        : [],
    [selectedOpportunity, state],
  );
  const opportunityMemos = useMemo(
    () =>
      selectedOpportunity
        ? state.memos.filter((memo) => memo.opportunity_id === selectedOpportunity.opportunity_id)
        : [],
    [selectedOpportunity, state],
  );
  const selectedCandidateStory = useMemo(
    () =>
      selectedOpportunity
        ? getOpportunityCandidateStory(state, selectedOpportunity.opportunity_id)
        : undefined,
    [selectedOpportunity, state],
  );
  const selectedSensitiveSupport = useMemo(
    () =>
      selectedOpportunity
        ? getOpportunitySensitiveSupport(state, selectedOpportunity.opportunity_id)
        : undefined,
    [selectedOpportunity, state],
  );
  const releaseArtifactReviews = useMemo(
    () =>
      state.releaseArtifactReviews.filter(
        (item) =>
          item.account_id === state.selectedAccountId &&
          item.opportunity_id === state.selectedOpportunityId,
      ),
    [state.releaseArtifactReviews, state.selectedAccountId, state.selectedOpportunityId],
  );
  const sortedReleaseArtifactReviews = useMemo(
    () =>
      [...releaseArtifactReviews].sort((left, right) => {
        if (left.pinned !== right.pinned) {
          return Number(right.pinned) - Number(left.pinned);
        }

        return new Date(right.imported_at).getTime() - new Date(left.imported_at).getTime();
      }),
    [releaseArtifactReviews],
  );
  const filteredReleaseArtifactReviews = useMemo(() => {
    const query = releaseArtifactQuery.trim().toLowerCase();
    if (!query) {
      return sortedReleaseArtifactReviews;
    }

    return sortedReleaseArtifactReviews.filter((item) =>
      [item.title, item.summary, item.source_name, item.content, item.entries.join(" ")]
        .join(" ")
        .toLowerCase()
        .includes(query),
    );
  }, [releaseArtifactQuery, sortedReleaseArtifactReviews]);
  const extractedSignals = useMemo(
    () =>
      mergeSignalSets(
        [
          ...opportunityArtifacts.map((artifact) => artifact.extracted_signals).filter(Boolean),
          ...opportunityCorrespondence
            .map((item) => item.extracted_signals)
            .filter(Boolean),
        ] as NonNullable<typeof opportunityArtifacts[number]["extracted_signals"]>[],
      ),
    [opportunityArtifacts, opportunityCorrespondence],
  );

  const governanceOverlays = useMemo(
    () => getGovernanceOverlays(selectedAccount, selectedUser, selectedOpportunity),
    [selectedAccount, selectedOpportunity, selectedUser],
  );
  const selectedEnterpriseControls = useMemo(
    () =>
      state.enterpriseControlProfiles.find(
        (profile) => profile.account_id === state.selectedAccountId,
      ),
    [state.enterpriseControlProfiles, state.selectedAccountId],
  );
  const selectedRoleEntitlements = useMemo(
    () =>
      state.roleEntitlements.filter(
        (entitlement) => entitlement.account_id === state.selectedAccountId,
      ),
    [state.roleEntitlements, state.selectedAccountId],
  );
  const currentCoaching = useMemo(
    () =>
      selectedOpportunity
        ? getCoachingForStage(selectedOpportunity.current_stage)
        : getCoachingForStage("intake_started"),
    [selectedOpportunity],
  );

  const reportingSnapshot = useMemo(() => createReportingSnapshot(state), [state]);
  const integrityReport = useMemo(() => validateAppStateIntegrity(state), [state]);
  const localLossWarning = useMemo(() => {
    if (!state.lastExportedAt) {
      return "This workspace is stored locally on this device only. Export a handoff ZIP if you want durable recovery.";
    }

    return `Last export package created at ${new Date(state.lastExportedAt).toLocaleString()}. Local browser storage can still be lost if it is cleared.`;
  }, [state.lastExportedAt]);

  const onboardingQueue = state.opportunities.filter(
    (opportunity) =>
      opportunity.current_stage === "intake_started" ||
      opportunity.current_stage === "intake_complete",
  );
  const reviewQueue = [
    ...state.artifacts.filter((artifact) =>
      ["unreviewed", "user_reviewed"].includes(artifact.review_status),
    ),
    ...state.correspondence.filter((item) =>
      ["draft", "in_review"].includes(item.status),
    ),
  ];
  const escalationQueue = state.escalations.filter(
    (escalation) => escalation.status === "open" || escalation.status === "under_review",
  );
  const blockingTaskCount = useMemo(
    () =>
      opportunityTasks.filter(
        (task) => task.blocking && task.status !== "completed" && task.status !== "cancelled",
      ).length,
    [opportunityTasks],
  );
  const currentReviewRequiredCount = useMemo(
    () =>
      opportunityCheckpoints.filter((checkpoint) => checkpoint.human_review_required).length,
    [opportunityCheckpoints],
  );
  const exportReadinessLabel = useMemo(() => {
    if (!selectedOpportunity) {
      return "Select an opportunity";
    }
    if (!selectedCandidateStory) {
      return "Generate candidate story";
    }
    if (blockingTaskCount > 0) {
      return `${blockingTaskCount} blocking task${blockingTaskCount === 1 ? "" : "s"}`;
    }
    return "Ready for handoff export";
  }, [blockingTaskCount, selectedCandidateStory, selectedOpportunity]);
  const enterpriseControlSummary = useMemo(() => {
    if (!selectedEnterpriseControls) {
      return "No enterprise control profile";
    }
    return `${selectedEnterpriseControls.buyer_readiness_stage.replace(/_/g, " ")} • ${selectedEnterpriseControls.entitlements_mode.replace(/_/g, " ")}`;
  }, [selectedEnterpriseControls]);
  const diligenceEnabledCount = useMemo(
    () =>
      selectedRoleEntitlements.filter((entitlement) => entitlement.diligence_packet_access)
        .length,
    [selectedRoleEntitlements],
  );

  useEffect(() => {
    setCandidateStoryDraft(selectedCandidateStory?.markdown ?? "");
  }, [selectedCandidateStory?.story_id, selectedCandidateStory?.markdown]);

  useEffect(() => {
    setSensitiveSupportDraft(
      selectedSensitiveSupport
        ? {
            enabled: selectedSensitiveSupport.enabled,
            categories: selectedSensitiveSupport.categories,
            notes: selectedSensitiveSupport.notes,
            encouragement_plan: selectedSensitiveSupport.encouragement_plan,
            include_in_export: selectedSensitiveSupport.include_in_export,
          }
        : defaultSensitiveSupportDraft,
    );
  }, [selectedSensitiveSupport?.support_profile_id, selectedSensitiveSupport?.updated_at]);

  function patchState(mutator: (current: AppState) => AppState, message: string) {
    setState((current) => mutator(current));
    setNotice({ tone: "success", message });
  }

  function navigateToPage(page: AppPage) {
    window.location.hash = page === "about" ? "about" : "";
    setCurrentPage(page);
  }

  function handleAccountSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const account = createAccount(accountDraft);
    const controlProfile = {
      control_profile_id: `control_${account.account_id}`,
      account_id: account.account_id,
      entitlements_mode: "guided_default" as const,
      external_release_requires_approval: true,
      export_confirmation_required: true,
      allow_sensitive_support_export: false,
      local_only_posture_locked: true,
      deployment_posture: "Local-only browser workspace with ZIP handoff packages.",
      buyer_readiness_stage: "internal_only" as const,
      notes: "New account created with default local-only enterprise controls.",
      updated_at: nowIso(),
    };
    const defaultEntitlements = [
      createRoleEntitlement({
        account_id: account.account_id,
        role_name: "Candidate / User",
        workspace_access: true,
        staff_queue_access: false,
        admin_console_access: false,
        export_package_access: true,
        diligence_packet_access: false,
        notes: "Default guided access.",
      }),
      createRoleEntitlement({
        account_id: account.account_id,
        role_name: "Admin / Governance",
        workspace_access: true,
        staff_queue_access: true,
        admin_console_access: true,
        export_package_access: true,
        diligence_packet_access: true,
        notes: "Default governance owner for local-only review.",
      }),
    ];

    patchState(
      (current) => ({
        ...current,
        accounts: [account, ...current.accounts],
        enterpriseControlProfiles: [controlProfile, ...current.enterpriseControlProfiles],
        roleEntitlements: [...defaultEntitlements, ...current.roleEntitlements],
        selectedAccountId: account.account_id,
      }),
      "Account created and set as the active enterprise container.",
    );
    setAccountDraft(defaultAccountDraft);
  }

  function handleUserSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!state.selectedAccountId) {
      setNotice({ tone: "info", message: "Create or select an account first." });
      return;
    }

    const user = createUser({
      account_id: state.selectedAccountId,
      ...userDraft,
    });

    patchState(
      (current) => ({
        ...current,
        users: [user, ...current.users],
        selectedUserId: user.user_id,
      }),
      "User onboarding record created.",
    );
    setUserDraft(defaultUserDraft);
  }

  function ensureEnterpriseControlProfile(accountId: string) {
    const existing = state.enterpriseControlProfiles.find(
      (profile) => profile.account_id === accountId,
    );
    if (existing) {
      return existing;
    }

    return {
      control_profile_id: `control_${accountId}`,
      account_id: accountId,
      entitlements_mode: "guided_default" as const,
      external_release_requires_approval: true,
      export_confirmation_required: true,
      allow_sensitive_support_export: false,
      local_only_posture_locked: true,
      deployment_posture: "Local-only browser workspace with ZIP handoff packages.",
      buyer_readiness_stage: "internal_only" as const,
      notes: "Auto-created enterprise control profile for local-only governance.",
      updated_at: nowIso(),
    };
  }

  function handleOpportunitySubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!state.selectedAccountId || !state.selectedUserId) {
      setNotice({
        tone: "info",
        message: "Set the active account and user before starting an opportunity.",
      });
      return;
    }

    const opportunity = createOpportunity({
      account_id: state.selectedAccountId,
      user_id: state.selectedUserId,
      use_case_id: "sbs",
      ...opportunityDraft,
    });
    const profile = {
      ...createSeedState().candidateProfiles[0],
      profile_id: `profile_${opportunity.opportunity_id}`,
      user_id: state.selectedUserId,
      opportunity_id: opportunity.opportunity_id,
      skills_summary: "",
      experience_level: "",
      domain_strengths: "",
      declared_gaps: "",
      user_corrected: false,
      updated_at: nowIso(),
    };
    const checkpoint = createCheckpoint(
      opportunity,
      "Opportunity created",
      "Start end-to-end onboarding",
      "medium",
      "pause_for_input",
      "User, account, and opportunity are present. Resume and job description are still required.",
      "none",
      "low",
    );
    const task = createTask(
      opportunity.opportunity_id,
      "Collect intake artifacts and confirm candidate profile",
      "Customer Success Lead",
      true,
    );

    patchState(
      (current) => ({
        ...current,
        opportunities: [opportunity, ...current.opportunities],
        candidateProfiles: [profile, ...current.candidateProfiles],
        checkpoints: [checkpoint, ...current.checkpoints],
        tasks: [task, ...current.tasks],
        selectedOpportunityId: opportunity.opportunity_id,
      }),
      "Opportunity created and routed into intake.",
    );
    setOpportunityDraft(defaultOpportunityDraft);
  }

  function updateEnterpriseControlField<
    K extends keyof NonNullable<typeof selectedEnterpriseControls>,
  >(field: K, value: NonNullable<typeof selectedEnterpriseControls>[K]) {
    if (!state.selectedAccountId) {
      return;
    }

    patchState(
      (current) => {
        const controlProfile =
          current.enterpriseControlProfiles.find(
            (profile) => profile.account_id === current.selectedAccountId,
          ) ??
          ensureEnterpriseControlProfile(current.selectedAccountId);
        const remainingProfiles = current.enterpriseControlProfiles.filter(
          (profile) => profile.control_profile_id !== controlProfile.control_profile_id,
        );

        return {
          ...current,
          enterpriseControlProfiles: [
            {
              ...controlProfile,
              [field]: value,
              updated_at: nowIso(),
            },
            ...remainingProfiles,
          ],
        };
      },
      "Enterprise control posture updated.",
    );
  }

  function setRoleEntitlementFlag(
    entitlementId: string,
    field:
      | "workspace_access"
      | "staff_queue_access"
      | "admin_console_access"
      | "export_package_access"
      | "diligence_packet_access",
    value: boolean,
  ) {
    patchState(
      (current) => ({
        ...current,
        roleEntitlements: current.roleEntitlements.map((entitlement) =>
          entitlement.entitlement_id === entitlementId
            ? {
                ...entitlement,
                [field]: value,
                updated_at: nowIso(),
              }
            : entitlement,
        ),
      }),
      "Role entitlement updated.",
    );
  }

  function addEntitlementTemplate() {
    if (!state.selectedAccountId) {
      return;
    }

    const entitlement = createRoleEntitlement({
      account_id: state.selectedAccountId,
      role_name: "Solutions Demo Lead",
      workspace_access: true,
      staff_queue_access: true,
      admin_console_access: false,
      export_package_access: true,
      diligence_packet_access: false,
      notes: "Can run buyer-facing demos without changing governance posture.",
    });

    patchState(
      (current) => ({
        ...current,
        roleEntitlements: [entitlement, ...current.roleEntitlements],
      }),
      "Entitlement template added for enterprise operations.",
    );
  }

  function handleArtifactSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!selectedOpportunity) {
      setNotice({ tone: "info", message: "Select an opportunity before adding artifacts." });
      return;
    }

    const existingVersions = opportunityArtifacts.filter(
      (artifact) =>
        artifact.source_label === artifactDraft.source_label &&
        artifact.artifact_type === artifactDraft.artifact_type,
    );
    const nextVersion = existingVersions.length
      ? Math.max(...existingVersions.map((artifact) => artifact.version_number)) + 1
      : 1;

    const artifact = createArtifact({
      opportunity_id: selectedOpportunity.opportunity_id,
      version_number: nextVersion,
      extracted_signals: extractSignalsFromText(
        artifactDraft.content_summary,
        selectedOpportunity.company_name,
      ),
      ...artifactDraft,
    });
    const task = createTask(
      selectedOpportunity.opportunity_id,
      `Review ${artifact.artifact_type.replace(/_/g, " ")}`,
      "Document Operations Lead",
      artifact.review_status !== "approved",
    );
    const checkpoint = createCheckpoint(
      selectedOpportunity,
      "Structured artifact extraction",
      "Artifact text was parsed for names, companies, interviews, dates, and contact signals.",
      artifact.extracted_signals &&
        (artifact.extracted_signals.emails.length ||
          artifact.extracted_signals.interviews.length ||
          artifact.extracted_signals.dates.length)
        ? "high"
        : "medium",
      "proceed_with_warning",
      `Captured ${artifact.extracted_signals?.companies.length ?? 0} companies, ${artifact.extracted_signals?.emails.length ?? 0} emails, and ${artifact.extracted_signals?.interviews.length ?? 0} interview cues from the artifact.`,
      "low",
      "low",
    );

    patchState(
      (current) => ({
        ...current,
        artifacts: [artifact, ...current.artifacts],
        checkpoints: [checkpoint, ...current.checkpoints],
        tasks: [task, ...current.tasks],
      }),
      "Artifact recorded with structured signal extraction and review routing.",
    );
    setArtifactDraft(defaultArtifactDraft);
  }

  function handleProfileSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!selectedProfile) {
      setNotice({ tone: "info", message: "Create an opportunity before saving a profile." });
      return;
    }

    const formData = new FormData(event.currentTarget);

    patchState(
      (current) => ({
        ...current,
        candidateProfiles: current.candidateProfiles.map((profile) =>
          profile.profile_id === selectedProfile.profile_id
            ? {
                ...profile,
                skills_summary: String(formData.get("skills_summary") ?? ""),
                experience_level: String(formData.get("experience_level") ?? ""),
                domain_strengths: String(formData.get("domain_strengths") ?? ""),
                declared_gaps: String(formData.get("declared_gaps") ?? ""),
                user_corrected: true,
                updated_at: nowIso(),
              }
            : profile,
        ),
      }),
      "Candidate profile updated for checkpoint and fit review logic.",
    );
  }

  function handleAdvanceStage() {
    if (!selectedOpportunity) {
      return;
    }

    const nextStage = getNextStage(selectedOpportunity.current_stage);
    if (nextStage === selectedOpportunity.current_stage) {
      setNotice({ tone: "info", message: "This opportunity is already at a terminal stage." });
      return;
    }

    const nextStatus: OpportunityStatus =
      nextStage === "closed_won"
        ? "closed_won"
        : nextStage === "closed_lost"
          ? "closed_lost"
          : "active";
    const updatedOpportunity = {
      ...selectedOpportunity,
      current_stage: nextStage,
      updated_at: nowIso(),
      status: nextStatus,
    };
    const checkpoint = createCheckpoint(
      updatedOpportunity,
      stageMeta[nextStage].label,
      `Advance from ${stageMeta[selectedOpportunity.current_stage].label}`,
      nextStage === "positioning" || nextStage === "offer_review" ? "medium" : "high",
      nextStage === "outreach_ready" || nextStage === "offer_review"
        ? "escalate_for_review"
        : "proceed",
      stageMeta[nextStage].description,
      nextStage === "positioning" ? "medium" : "low",
      nextStage === "offer_review" ? "medium" : "low",
    );
    const task = createTask(
      selectedOpportunity.opportunity_id,
      `Complete ${stageMeta[nextStage].label.toLowerCase()} review`,
      stageMeta[nextStage].reviewerRole,
      !isClosedStage(nextStage),
    );
    const memo = createMemo(
      selectedOpportunity.opportunity_id,
      nextStage === "offer_review"
        ? "offer"
        : nextStage === "fit_review"
          ? "fit"
          : nextStage === "positioning"
            ? "positioning"
            : nextStage === "interview_active"
              ? "interview"
              : "final",
      stageMeta[nextStage].description,
      checkpoint.confidence_level,
      false,
    );

    patchState(
      (current) => ({
        ...current,
        opportunities: current.opportunities.map((opportunity) =>
          opportunity.opportunity_id === updatedOpportunity.opportunity_id
            ? updatedOpportunity
            : opportunity,
        ),
        checkpoints: [checkpoint, ...current.checkpoints],
        tasks: [task, ...current.tasks],
        memos: [memo, ...current.memos],
      }),
      `Opportunity advanced into ${stageMeta[nextStage].label}.`,
    );
  }

  function handleTaskSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!selectedOpportunity) {
      setNotice({ tone: "info", message: "Select an opportunity before creating tasks." });
      return;
    }

    const task = createTask(
      selectedOpportunity.opportunity_id,
      taskDraft.task_type,
      taskDraft.owner_role,
      taskDraft.blocking,
    );
    patchState(
      (current) => ({
        ...current,
        tasks: [task, ...current.tasks],
      }),
      "Workflow task added to the operational queue.",
    );
    setTaskDraft(defaultTaskDraft);
  }

  function handleEscalationSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!selectedOpportunity) {
      setNotice({ tone: "info", message: "Select an opportunity before escalating." });
      return;
    }

    const escalation = createEscalation(
      selectedOpportunity.opportunity_id,
      escalationDraft.escalation_type,
      escalationDraft.owner_role,
      escalationDraft.severity,
      escalationDraft.resolution_notes,
    );
    const task = createTask(
      selectedOpportunity.opportunity_id,
      `Resolve ${escalationDraft.escalation_type} escalation`,
      escalationDraft.owner_role,
      true,
    );

    patchState(
      (current) => ({
        ...current,
        escalations: [escalation, ...current.escalations],
        tasks: [task, ...current.tasks],
      }),
      "Escalation routed to the assigned functional owner.",
    );
    setEscalationDraft(defaultEscalationDraft);
  }

  function handleCorrespondenceSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!selectedOpportunity) {
      setNotice({ tone: "info", message: "Select an opportunity before drafting correspondence." });
      return;
    }

    const correspondence = createCorrespondence(
      selectedOpportunity.opportunity_id,
      correspondenceDraft.channel,
      correspondenceDraft.subject,
      correspondenceDraft.body,
      extractSignalsFromText(
        `${correspondenceDraft.subject}\n${correspondenceDraft.body}`,
        selectedOpportunity.company_name,
      ),
    );
    const artifact = createArtifact({
      opportunity_id: selectedOpportunity.opportunity_id,
      artifact_type: "message",
      source_label: correspondence.subject || "Untitled message draft",
      origin: "system_generated",
      review_status: "unreviewed",
      parse_status: "not_applicable",
      evidence_note: "Correspondence operations",
      content_summary: correspondence.body,
      extracted_signals: correspondence.extracted_signals,
    });
    const checkpoint = createCheckpoint(
      selectedOpportunity,
      "Correspondence signal extraction",
      "Correspondence text was parsed for contact, timing, and interview signals.",
      correspondence.extracted_signals &&
        (correspondence.extracted_signals.emails.length ||
          correspondence.extracted_signals.dates.length ||
          correspondence.extracted_signals.times.length)
        ? "high"
        : "medium",
      "proceed_with_warning",
      `Captured ${correspondence.extracted_signals?.emails.length ?? 0} emails, ${correspondence.extracted_signals?.dates.length ?? 0} dates, and ${correspondence.extracted_signals?.times.length ?? 0} time references from correspondence.`,
      "low",
      "low",
    );

    patchState(
      (current) => ({
        ...current,
        correspondence: [correspondence, ...current.correspondence],
        artifacts: [artifact, ...current.artifacts],
        checkpoints: [checkpoint, ...current.checkpoints],
      }),
      "Correspondence draft created with structured signal extraction and attached to the document record.",
    );
    setCorrespondenceDraft(defaultCorrespondenceDraft);
  }

  function setTaskStatus(taskId: string, status: TaskStatus) {
    patchState(
      (current) => ({
        ...current,
        tasks: current.tasks.map((task) =>
          task.task_id === taskId ? { ...task, status } : task,
        ),
      }),
      "Task status updated.",
    );
  }

  function setArtifactReviewStatus(artifactId: string, reviewStatus: ReviewStatus) {
    patchState(
      (current) => ({
        ...current,
        artifacts: current.artifacts.map((artifact) =>
          artifact.artifact_id === artifactId
            ? { ...artifact, review_status: reviewStatus }
            : artifact,
        ),
      }),
      "Artifact review state updated.",
    );
  }

  function setCorrespondenceStatus(correspondenceId: string, status: CorrespondenceStatus) {
    patchState(
      (current) => ({
        ...current,
        correspondence: current.correspondence.map((item) =>
          item.correspondence_id === correspondenceId ? { ...item, status } : item,
        ),
      }),
      "Correspondence status updated.",
    );
  }

  function resolveEscalation(escalationId: string) {
    patchState(
      (current) => ({
        ...current,
        escalations: current.escalations.map((escalation) =>
          escalation.escalation_id === escalationId
            ? { ...escalation, status: "resolved" }
            : escalation,
        ),
      }),
      "Escalation marked resolved.",
    );
  }

  async function handleExport() {
    const report = validateAppStateIntegrity(state);
    if (report.errors.length) {
      setNotice({
        tone: "info",
        message: `Export blocked: ${report.errors[0]}`,
      });
      setLastIntegrityRunAt(nowIso());
      return;
    }

    const { buildExportZip, createExportFilename } = await import("./package");
    const payload = { ...state, schemaVersion: state.schemaVersion || SCHEMA_VERSION };
    const blob = await buildExportZip(payload);
    const url = window.URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = createExportFilename(payload);
    anchor.click();
    window.URL.revokeObjectURL(url);
    setState((current) => ({ ...current, lastExportedAt: new Date().toISOString() }));
    setLastIntegrityRunAt(nowIso());
    setNotice({
      tone: "success",
      message:
        report.warnings.length > 0
          ? `ZIP handoff package generated with ${report.warnings.length} integrity warning${report.warnings.length === 1 ? "" : "s"}.`
          : "ZIP handoff package generated. Keep it if you want durable recovery beyond local browser storage.",
    });
  }

  async function handleBuyerPacketExport() {
    const report = validateAppStateIntegrity(state);
    if (report.errors.length) {
      setNotice({
        tone: "info",
        message: `Buyer packet blocked: ${report.errors[0]}`,
      });
      setLastIntegrityRunAt(nowIso());
      return;
    }

    const { buildBuyerPacketZip, createBuyerPacketFilename } = await import("./package");
    const payload = { ...state, schemaVersion: state.schemaVersion || SCHEMA_VERSION };
    const blob = await buildBuyerPacketZip(payload);
    const url = window.URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = createBuyerPacketFilename(payload);
    anchor.click();
    window.URL.revokeObjectURL(url);
    setLastIntegrityRunAt(nowIso());
    setNotice({
      tone: "success",
      message:
        "Premium enterprise buyer packet generated as a separate ZIP for human review and external-ready assembly.",
    });
  }

  async function handleReleaseReadinessPacketExport() {
    const report = validateAppStateIntegrity(state);
    if (report.errors.length) {
      setNotice({
        tone: "info",
        message: `Release readiness packet blocked: ${report.errors[0]}`,
      });
      setLastIntegrityRunAt(nowIso());
      return;
    }

    const { buildReleaseReadinessZip, createReadinessPacketFilename } = await import("./package");
    const payload = { ...state, schemaVersion: state.schemaVersion || SCHEMA_VERSION };
    const blob = await buildReleaseReadinessZip(payload);
    const url = window.URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = createReadinessPacketFilename(payload);
    anchor.click();
    window.URL.revokeObjectURL(url);
    setLastIntegrityRunAt(nowIso());
    setNotice({
      tone: "success",
      message:
        "Release readiness packet ZIP generated with release summary and buyer-facing readiness materials.",
    });
  }

  async function handleImport(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    const { importStateFromFile } = await import("./package");
    const fallback = createSeedState();
    const result = await importStateFromFile(file);
    if (result.ok) {
      const importedState = {
        ...fallback,
        ...result.state,
        schemaVersion: result.state.schemaVersion || SCHEMA_VERSION,
        reportingSnapshots:
          result.state.reportingSnapshots?.length
            ? result.state.reportingSnapshots
            : fallback.reportingSnapshots,
        candidateStories: result.state.candidateStories ?? fallback.candidateStories,
        sensitiveSupportProfiles:
          result.state.sensitiveSupportProfiles ?? fallback.sensitiveSupportProfiles,
        releaseArtifactReviews:
          result.state.releaseArtifactReviews ?? fallback.releaseArtifactReviews,
        lastExportedAt: result.state.lastExportedAt ?? "",
      };
      const importIntegrity = validateAppStateIntegrity(importedState);

      setState(importedState);
      setLastIntegrityRunAt(nowIso());
      setNotice({
        tone: "success",
        message:
          result.warning ??
          (importIntegrity.errors.length
            ? `Import loaded with ${importIntegrity.errors.length} structural error${importIntegrity.errors.length === 1 ? "" : "s"} to review in admin mode.`
            : importIntegrity.warnings.length
              ? `Platform import loaded with ${importIntegrity.warnings.length} integrity warning${importIntegrity.warnings.length === 1 ? "" : "s"}.`
              : "Platform import loaded from handoff package."),
      });
    } else {
      setNotice({
        tone: "info",
        message: result.error,
      });
    }

    event.target.value = "";
  }

  async function handleReleaseArtifactImport(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    const { importReleaseArtifactForReview } = await import("./package");
    const result = await importReleaseArtifactForReview(file);
    if (result.ok) {
      setImportedReleaseArtifact(result.artifact);
      patchState(
        (current) => ({
          ...current,
          releaseArtifactReviews: [
            {
              review_id: `release_review_${Date.now()}`,
              account_id: current.selectedAccountId,
              opportunity_id: current.selectedOpportunityId,
              title: result.artifact.title,
              summary: result.artifact.summary,
              source_name: result.artifact.sourceName,
              entries: result.artifact.entries,
              content: result.artifact.content,
              pinned: false,
              imported_at: nowIso(),
            },
            ...current.releaseArtifactReviews,
          ],
        }),
        `Release/readiness artifact imported for review from ${file.name}.`,
      );
      setNotice({
        tone: "success",
        message: `Release/readiness artifact imported for review from ${file.name}.`,
      });
    } else {
      setNotice({
        tone: "info",
        message: result.error,
      });
    }

    event.target.value = "";
  }

  function resetSeedState() {
    setState(createSeedState());
    setLastIntegrityRunAt(nowIso());
    setNotice({ tone: "success", message: "Reset to the seeded SBS reference state." });
  }

  function handleIntegrityCheck() {
    const report = validateAppStateIntegrity(state);
    setLastIntegrityRunAt(nowIso());
    if (report.errors.length) {
      setNotice({
        tone: "info",
        message: `Integrity check found ${report.errors.length} error${report.errors.length === 1 ? "" : "s"} and ${report.warnings.length} warning${report.warnings.length === 1 ? "" : "s"}.`,
      });
      return;
    }

    setNotice({
      tone: "success",
      message:
        report.warnings.length > 0
          ? `Integrity check passed with ${report.warnings.length} warning${report.warnings.length === 1 ? "" : "s"}.`
          : "Integrity check passed with no structural issues.",
    });
  }

  function handleReleaseSummaryMarkdownDownload() {
    const generatedAt = nowIso();
    const filename = `release-summary-${formatTimestampForFile(generatedAt)}.md`;
    const content = `# Release Summary

Generated: \`${generatedAt}\`

## Summary
${releaseStatus.summary}

## Local Checks
${releaseStatus.localChecks.map((item) => `- \`${item}\``).join("\n")}

## CI Checks
${releaseStatus.ciChecks.map((item) => `- ${item}`).join("\n")}

## Current Coverage
${releaseStatus.currentCoverage.map((item) => `- ${item}`).join("\n")}

## Current Limits
${releaseStatus.currentLimits.map((item) => `- ${item}`).join("\n")}

## Expert Owners
${releaseStatus.expertOwners.map((item) => `- \`${item}\``).join("\n")}
`;

    downloadTextFile(filename, `${content}\n`, "text/markdown;charset=utf-8");
    setNotice({
      tone: "success",
      message: "Release summary markdown downloaded for human review or handoff.",
    });
  }

  function handleReleaseSummaryJsonDownload() {
    const generatedAt = nowIso();
    const filename = `release-summary-${formatTimestampForFile(generatedAt)}.json`;
    const content = JSON.stringify(
      {
        generatedAt,
        ...releaseStatus,
      },
      null,
      2,
    );

    downloadTextFile(filename, `${content}\n`, "application/json;charset=utf-8");
    setNotice({
      tone: "success",
      message: "Release summary JSON downloaded for structured review or CI handoff.",
    });
  }

  function removeReleaseArtifactReview(reviewId: string) {
    patchState(
      (current) => ({
        ...current,
        releaseArtifactReviews: current.releaseArtifactReviews.filter(
          (item) => item.review_id !== reviewId,
        ),
      }),
      "Stored release/readiness review removed.",
    );
  }

  function toggleReleaseArtifactReviewPin(reviewId: string) {
    patchState(
      (current) => ({
        ...current,
        releaseArtifactReviews: current.releaseArtifactReviews.map((item) =>
          item.review_id === reviewId ? { ...item, pinned: !item.pinned } : item,
        ),
      }),
      "Stored release/readiness review pin state updated.",
    );
  }

  function clearReleaseArtifactReviewsForCurrentOpportunity() {
    patchState(
      (current) => ({
        ...current,
        releaseArtifactReviews: current.releaseArtifactReviews.filter(
          (item) =>
            !(
              item.account_id === current.selectedAccountId &&
              item.opportunity_id === current.selectedOpportunityId
            ),
        ),
      }),
      "Stored release/readiness reviews cleared for the current opportunity.",
    );
    setImportedReleaseArtifact(null);
  }

  function handleReadinessPacketDownload() {
    const generatedAt = nowIso();
    const accountName = selectedAccount?.account_name || "monyawn-account";
    const opportunityLabel = selectedOpportunity
      ? `${selectedOpportunity.company_name} ${selectedOpportunity.role_title}`
      : "workspace";
    const filename = `${slugify(accountName)}-${slugify(opportunityLabel)}-readiness-packet-${formatTimestampForFile(generatedAt)}.md`;
    const content = `# Buyer-Facing Readiness Packet

Generated: \`${generatedAt}\`

## Current Workspace
- Account: ${selectedAccount?.account_name || "Not selected"}
- Account type: ${selectedAccount?.account_type || "Not selected"}
- Opportunity: ${selectedOpportunity ? `${selectedOpportunity.company_name} - ${selectedOpportunity.role_title}` : "Not selected"}
- Stage: ${selectedOpportunity ? stageMeta[selectedOpportunity.current_stage].label : "Not selected"}
- Buyer readiness stage: ${selectedEnterpriseControls?.buyer_readiness_stage || "Not configured"}
- Deployment posture: ${selectedEnterpriseControls?.deployment_posture || "Not configured"}

## Product Posture
- Local-only data custody in the current version
- Human-in-the-loop operating model
- Export-first recovery posture with ZIP handoff packages
- Candidate story, coaching, and buyer packet workflows are available in-product

## Release Confidence
- Last validated phase: ${releaseStatus.lastValidatedPhase}
- Local checks: ${releaseStatus.localChecks.length}
- CI checks: ${releaseStatus.ciChecks.length}
- Integrity errors: ${integrityReport.errors.length}
- Integrity warnings: ${integrityReport.warnings.length}
- Last export: ${state.lastExportedAt || "No export yet recorded"}

## Governance Notes
- External release approval: ${selectedEnterpriseControls?.external_release_requires_approval ? "Required" : "Not required"}
- Export confirmation required: ${selectedEnterpriseControls?.export_confirmation_required ? "Yes" : "No"}
- Sensitive support export allowed by policy: ${selectedEnterpriseControls?.allow_sensitive_support_export ? "Yes" : "No"}
- Local-only posture locked: ${selectedEnterpriseControls?.local_only_posture_locked ? "Yes" : "No"}

## Current Limits
${releaseStatus.currentLimits.map((item) => `- ${item}`).join("\n")}

## Expert Owners
${releaseStatus.expertOwners.map((item) => `- \`${item}\``).join("\n")}
`;

    downloadTextFile(filename, `${content}\n`, "text/markdown;charset=utf-8");
    setNotice({
      tone: "success",
      message: "Buyer-facing readiness packet markdown downloaded from the current workspace state.",
    });
  }

  function handleGenerateCandidateStory() {
    if (!selectedOpportunity) {
      setNotice({ tone: "info", message: "Select an opportunity before generating a story." });
      return;
    }

    const nextStory = createCandidateStoryRecord(
      generateCandidateStory({
        user: selectedUser,
        opportunity: selectedOpportunity,
        profile: selectedProfile,
        artifacts: opportunityArtifacts,
        correspondence: opportunityCorrespondence,
      }),
    );
    const checkpoint = createCheckpoint(
      selectedOpportunity,
      "Candidate story generation",
      "Lifecycle evidence was synthesized into a who/what/why/where/when/how narrative.",
      opportunityArtifacts.length || opportunityCorrespondence.length ? "high" : "medium",
      "proceed_with_warning",
      `Story generated from ${nextStory.source_artifact_ids.length} artifacts and ${nextStory.source_correspondence_ids.length} correspondence records.`,
      "low",
      "low",
    );
    const task = createTask(
      selectedOpportunity.opportunity_id,
      "Review candidate story before external use",
      "Candidate Story Architect",
      false,
    );

    patchState(
      (current) => ({
        ...current,
        candidateStories: [
          nextStory,
          ...current.candidateStories.filter(
            (story) => story.opportunity_id !== selectedOpportunity.opportunity_id,
          ),
        ],
        checkpoints: [checkpoint, ...current.checkpoints],
        tasks: [task, ...current.tasks],
      }),
      "Candidate story generated from current lifecycle evidence.",
    );
  }

  function handleSaveCandidateStory() {
    if (!selectedOpportunity) {
      return;
    }

    const existing = selectedCandidateStory;
    const story =
      existing ??
      createCandidateStoryRecord({
        opportunity_id: selectedOpportunity.opportunity_id,
        title: `${selectedUser?.full_name || "Candidate"} story for ${selectedOpportunity.company_name}`,
        summary: `${selectedOpportunity.role_title} narrative draft.`,
        markdown: candidateStoryDraft,
        status: "review",
        source_artifact_ids: opportunityArtifacts.map((artifact) => artifact.artifact_id),
        source_correspondence_ids: opportunityCorrespondence.map(
          (item) => item.correspondence_id,
        ),
      });

    patchState(
      (current) => ({
        ...current,
        candidateStories: [
          {
            ...story,
            markdown: candidateStoryDraft,
            summary:
              candidateStoryDraft.split("\n").find((line) => line.trim())?.slice(0, 140) ||
              story.summary,
            updated_at: nowIso(),
          },
          ...current.candidateStories.filter(
            (item) => item.opportunity_id !== selectedOpportunity.opportunity_id,
          ),
        ],
      }),
      "Candidate story saved for this opportunity.",
    );
  }

  function toggleSensitiveCategory(category: SensitiveSupportType, checked: boolean) {
    setSensitiveSupportDraft((current) => ({
      ...current,
      categories: checked
        ? Array.from(new Set([...current.categories, category]))
        : current.categories.filter((item) => item !== category),
    }));
  }

  function handleSensitiveSupportSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!selectedOpportunity) {
      setNotice({
        tone: "info",
        message: "Select an opportunity before saving a support profile.",
      });
      return;
    }

    const existing =
      selectedSensitiveSupport ?? createSensitiveSupportProfile(selectedOpportunity.opportunity_id);
    const nextProfile = {
      ...existing,
      enabled: sensitiveSupportDraft.enabled,
      categories: sensitiveSupportDraft.categories,
      notes: sensitiveSupportDraft.notes,
      encouragement_plan: sensitiveSupportDraft.encouragement_plan,
      include_in_export: sensitiveSupportDraft.include_in_export,
      updated_at: nowIso(),
    };
    const checkpoint = createCheckpoint(
      selectedOpportunity,
      "Sensitive support profile review",
      "User explicitly opted into local-only support guidance.",
      nextProfile.enabled ? "medium" : "high",
      nextProfile.enabled ? "pause_for_input" : "proceed",
      nextProfile.enabled
        ? "Sensitive support is stored only on this device and excluded from export unless the user explicitly allows it."
        : "Sensitive support remains disabled and excluded from export.",
      "low",
      "medium",
    );

    patchState(
      (current) => ({
        ...current,
        sensitiveSupportProfiles: [
          nextProfile,
          ...current.sensitiveSupportProfiles.filter(
            (profile) => profile.opportunity_id !== selectedOpportunity.opportunity_id,
          ),
        ],
        checkpoints: [checkpoint, ...current.checkpoints],
      }),
      nextProfile.enabled
        ? "Sensitive support saved locally with explicit export controls."
        : "Sensitive support remains disabled.",
    );
  }

  const selectedStageIndex = selectedOpportunity
    ? stageOrder.indexOf(selectedOpportunity.current_stage)
    : 0;
  const completionScore = selectedOpportunity
    ? getCompletionScore(state, selectedOpportunity.opportunity_id)
    : 0;

  return (
    <div className="app-shell">
      <a className="skip-link" href="#main-content">
        Skip to main content
      </a>
      <header className="topbar" aria-label="Primary">
        <div>
          <p className="brand-mark">Monyawn</p>
          <p className="brand-subtitle">
            Enterprise ops foundation with premium governance and accessible workflow UX
          </p>
        </div>
        <div className="topbar-nav" aria-label="Page navigation">
          <button
            className={`secondary-action nav-button${currentPage === "workspace" ? " is-current" : ""}`}
            type="button"
            onClick={() => navigateToPage("workspace")}
          >
            Workspace
          </button>
          <button
            className={`secondary-action nav-button${currentPage === "about" ? " is-current" : ""}`}
            type="button"
            onClick={() => navigateToPage("about")}
          >
            About
          </button>
        </div>
        <div className="topbar-actions" aria-label="Session status">
          <span className="status-chip">{modeLabels[state.currentMode]}</span>
          <span className="status-chip">Human-in-the-loop</span>
          <span className="status-chip">Saved locally</span>
          <span className="status-chip">
            {state.lastExportedAt ? "ZIP export ready" : "Export recommended"}
          </span>
        </div>
      </header>

      {currentPage === "about" ? (
        <main id="main-content" className="workspace">
          <section className="hero hero-wide" aria-labelledby="about-title">
            <div className="hero-copy">
              <p className="kicker">About Monyawn</p>
              <h1 id="about-title">A local-first platform built to help people move with clarity.</h1>
              <p className="hero-text">
                Monyawn is designed to turn opportunity management into a guided, evidence-backed,
                human-readable workflow. The product is intentionally local-first, export-first,
                and supportive of people navigating complex career transitions without giving up
                control of their data.
              </p>
              <div className="hero-actions">
                <a className="primary-action" href={RESUME_PATH} download>
                  Download Thomas Smith Resume
                </a>
                <button
                  className="secondary-action"
                  type="button"
                  onClick={() => navigateToPage("workspace")}
                >
                  Open workspace
                </button>
              </div>
              <div className="warning-callout" role="note" aria-label="Purpose note">
                <p className="panel-label">Direction and purpose</p>
                <p>
                  The company direction is to build trustworthy opportunity infrastructure that
                  helps users understand themselves, communicate more clearly, and keep control of
                  their own handoff package.
                </p>
              </div>
            </div>

            <div className="hero-panel" aria-label="About posture">
              <p className="panel-label">Current public posture</p>
              <ul className="plain-list">
                <li>Local-only user data posture in the current version</li>
                <li>Guided workflow across user, staff, and admin perspectives</li>
                <li>Candidate story, coaching, and exportable handoff package are core value surfaces</li>
              </ul>
            </div>
          </section>

          <section className="record-grid">
            <div className="stage-block">
              <h3>What this platform is for</h3>
              <p>
                Monyawn exists to help users pursue opportunities with stronger judgment, better
                narrative clarity, and a calmer operating system for complex decisions.
              </p>
              <ul className="plain-list">
                <li>Guided opportunity intake and evidence capture</li>
                <li>Know-thyself candidate story development</li>
                <li>Contextual coaching and compensation literacy</li>
                <li>Portable ZIP handoff with JSON, Markdown, and PDF outputs</li>
              </ul>
            </div>

            <div className="stage-block">
              <h3>Direction and purpose experts</h3>
              <div className="stack-list">
                {aboutExperts.map((expert) => (
                  <article key={expert.role} className="mini-card">
                    <p className="panel-label">{expert.role}</p>
                    <p>{expert.purpose}</p>
                  </article>
                ))}
              </div>
            </div>

            <div className="stage-block">
              <h3>Why the local-first choice matters</h3>
              <p>
                In the current version, Monyawn does not retain user opportunity data on company
                systems. Local browser storage is for convenience, and ZIP export is the durable
                recovery path.
              </p>
              <ul className="plain-list">
                <li>Users keep control of their own records</li>
                <li>Human-readable outputs remain portable</li>
                <li>Public product claims stay aligned to the real implementation</li>
              </ul>
            </div>

            <div className="stage-block">
              <h3>Release confidence</h3>
              <p>{releaseStatus.summary}</p>
              <div className="stage-footer">
                <button
                  className="secondary-action"
                  type="button"
                  onClick={handleReleaseSummaryMarkdownDownload}
                >
                  Download release summary MD
                </button>
                <button
                  className="secondary-action"
                  type="button"
                  onClick={handleReleaseSummaryJsonDownload}
                >
                  Download release summary JSON
                </button>
              </div>
              <div className="stack-list">
                <article className="mini-card">
                  <p className="panel-label">Current coverage</p>
                  <ul className="plain-list">
                    {releaseStatus.currentCoverage.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </article>
                <article className="mini-card tone-warning">
                  <p className="panel-label">Current limits</p>
                  <ul className="plain-list">
                    {releaseStatus.currentLimits.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </article>
              </div>
            </div>
          </section>
        </main>
      ) : (
      <main id="main-content" className="workspace">
        <section className="hero hero-wide" aria-labelledby="hero-title">
          <div className="hero-copy">
            <p className="kicker">www.monyawn.com</p>
            <h1 id="hero-title">
              Opportunity platform operations, not just a demo wizard.
            </h1>
            <p className="hero-text">
              This implementation adds live onboarding, lifecycle records, local
              CRUD, import and export, document and correspondence operations,
              staff queues, governance overlays, and admin visibility on top of
              the SBS reference use case.
            </p>
            <div className="warning-callout" role="note" aria-label="Local storage warning">
              <p className="panel-label">Local-only storage warning</p>
              <p>{localLossWarning}</p>
            </div>
            <div className="hero-actions">
              <button
                className="primary-action"
                type="button"
                onClick={() => setState((current) => ({ ...current, currentMode: "user" }))}
              >
                Guided workspace
              </button>
              <button
                className="secondary-action"
                type="button"
                onClick={() => setState((current) => ({ ...current, currentMode: "staff" }))}
              >
                Staff queues
              </button>
              <button
                className="secondary-action"
                type="button"
                onClick={() => setState((current) => ({ ...current, currentMode: "admin" }))}
              >
                Governance and API
              </button>
            </div>
            {notice ? (
              <p className={`notice notice-${notice.tone}`} role="status">
                {notice.message}
              </p>
            ) : null}
          </div>

          <div className="hero-panel" aria-label="Platform posture">
            <p className="panel-label">Current platform posture</p>
            <ul className="plain-list">
              <li>Canonical workflow entities persisted in local state</li>
              <li>Progressive disclosure across user, staff, and admin views</li>
              <li>Review gates, escalations, and reporting visible in-product</li>
            </ul>
            <div className="summary-grid">
              <div>
                <span className="metric-label">Active opportunities</span>
                <strong>{reportingSnapshot.active_opportunities}</strong>
              </div>
              <div>
                <span className="metric-label">Open escalations</span>
                <strong>{escalationQueue.length}</strong>
              </div>
              <div>
                <span className="metric-label">Review queue</span>
                <strong>{reviewQueue.length}</strong>
              </div>
              <div>
                <span className="metric-label">Completion</span>
                <strong>{completionScore}%</strong>
              </div>
            </div>
          </div>
        </section>

        <section className="mode-switch" aria-label="Mode selection">
          {(Object.keys(modeLabels) as AppMode[]).map((mode) => (
            <button
              key={mode}
              type="button"
              className={`step-button compact-button${
                state.currentMode === mode ? " is-active" : ""
              }`}
              onClick={() => setState((current) => ({ ...current, currentMode: mode }))}
            >
              <span className="step-name">{modeLabels[mode]}</span>
              <span className="step-caption">
                {mode === "user"
                  ? "Primary guided workflow"
                  : mode === "staff"
                    ? "Queues and execution"
                    : "API, policy, and account controls"}
              </span>
            </button>
          ))}
        </section>

        <section className="wizard-layout" aria-label="Platform workspace">
          <aside className="step-nav">
            <div className="step-nav-header">
              <p className="step-nav-label">Lifecycle</p>
              <p className="step-nav-progress">
                {selectedOpportunity
                  ? `${selectedStageIndex + 1} of ${stageOrder.length} stages`
                  : "Create an opportunity to begin"}
              </p>
            </div>
            <ol className="step-list">
              {stageOrder.map((stage, index) => {
                const isActive = selectedOpportunity?.current_stage === stage;
                const isPast = index < selectedStageIndex;
                return (
                  <li key={stage}>
                    <button type="button" className={`step-button${isActive ? " is-active" : ""}${isPast ? " is-past" : ""}`}>
                      <span className="step-number">{String(index + 1).padStart(2, "0")}</span>
                      <span>
                        <span className="step-name">{stageMeta[stage].label}</span>
                        <span className="step-caption">{stageMeta[stage].reviewerRole}</span>
                      </span>
                    </button>
                  </li>
                );
              })}
            </ol>
            {selectedOpportunity ? (
              <div className="mini-card">
                <p className="panel-label">Governance overlays</p>
                <ul className="plain-list">
                  {governanceOverlays.map((overlay) => (
                    <li key={overlay}>{overlay}</li>
                  ))}
                </ul>
              </div>
            ) : null}
          </aside>

          <div className="content-stack">
            <section className="stage-panel">
              <div className="stage-header">
                <p className="stage-eyebrow">Current operating context</p>
                <h2>
                  {selectedOpportunity
                    ? `${selectedOpportunity.company_name} • ${selectedOpportunity.role_title}`
                    : "Set up account, user, and opportunity records"}
                </h2>
                <p className="stage-summary">
                  {selectedOpportunity
                    ? stageMeta[selectedOpportunity.current_stage].description
                    : "The app now supports onboarding intake, lifecycle state, document and correspondence records, review queues, escalations, and exportable platform data in one local product shell."}
                </p>
              </div>

              <div className="platform-actions">
                <label className="field">
                  <span>Account</span>
                  <select
                    value={state.selectedAccountId}
                    onChange={(event) =>
                      setState((current) => ({
                        ...current,
                        selectedAccountId: event.target.value,
                      }))
                    }
                  >
                    {state.accounts.map((account) => (
                      <option key={account.account_id} value={account.account_id}>
                        {account.account_name}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="field">
                  <span>User</span>
                  <select
                    value={state.selectedUserId}
                    onChange={(event) =>
                      setState((current) => ({
                        ...current,
                        selectedUserId: event.target.value,
                      }))
                    }
                  >
                    {state.users.map((user) => (
                      <option key={user.user_id} value={user.user_id}>
                        {user.full_name}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="field">
                  <span>Opportunity</span>
                  <select
                    value={state.selectedOpportunityId}
                    onChange={(event) =>
                      setState((current) => ({
                        ...current,
                        selectedOpportunityId: event.target.value,
                      }))
                    }
                  >
                    {state.opportunities.map((opportunity) => (
                      <option key={opportunity.opportunity_id} value={opportunity.opportunity_id}>
                        {opportunity.company_name} • {opportunity.role_title}
                      </option>
                    ))}
                  </select>
                </label>
                <div className="platform-button-row">
                  <button className="primary-action" type="button" onClick={handleAdvanceStage}>
                    Advance stage
                  </button>
                  <button className="secondary-action" type="button" onClick={handleExport}>
                    Export handoff ZIP
                  </button>
                  <button className="secondary-action" type="button" onClick={handleIntegrityCheck}>
                    Run integrity check
                  </button>
                  <button
                    className="secondary-action"
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    Import ZIP or JSON
                  </button>
                  <button className="secondary-action" type="button" onClick={resetSeedState}>
                    Reset seeded state
                  </button>
                </div>
                <input
                  ref={fileInputRef}
                  className="sr-only"
                  type="file"
                  accept=".zip,application/zip,application/json"
                  onChange={handleImport}
                />
              </div>

              {selectedOpportunity ? (
                <div className="cockpit-grid" aria-label="Opportunity cockpit">
                  <article className="mini-card">
                    <p className="panel-label">Handoff readiness</p>
                    <h4>{exportReadinessLabel}</h4>
                    <p>
                      Last export:{" "}
                      {state.lastExportedAt
                        ? new Date(state.lastExportedAt).toLocaleString()
                        : "No ZIP created yet"}
                    </p>
                  </article>
                  <article className="mini-card">
                    <p className="panel-label">Candidate story</p>
                    <h4>{selectedCandidateStory ? "Story ready" : "Story missing"}</h4>
                    <p>
                      {selectedCandidateStory
                        ? `${selectedCandidateStory.source_artifact_ids.length} artifacts and ${selectedCandidateStory.source_correspondence_ids.length} correspondence records support this narrative.`
                        : "Generate a who/what/why/where/when/how narrative before final handoff."}
                    </p>
                  </article>
                  <article className="mini-card">
                    <p className="panel-label">Review gates</p>
                    <h4>{currentReviewRequiredCount} visible</h4>
                    <p>
                      Blocking tasks: {blockingTaskCount}. Escalations:{" "}
                      {opportunityEscalations.length}. Memos: {opportunityMemos.length}.
                    </p>
                  </article>
                  <article className="mini-card">
                    <p className="panel-label">Integrity status</p>
                    <h4>
                      {integrityReport.errors.length
                        ? `${integrityReport.errors.length} error${integrityReport.errors.length === 1 ? "" : "s"}`
                        : integrityReport.warnings.length
                          ? `${integrityReport.warnings.length} warning${integrityReport.warnings.length === 1 ? "" : "s"}`
                          : "Clean"}
                    </h4>
                    <p>
                      {lastIntegrityRunAt
                        ? `Last checked ${new Date(lastIntegrityRunAt).toLocaleString()}.`
                        : "Run an integrity check before major imports or exports."}
                    </p>
                  </article>
                  <article className="mini-card">
                    <p className="panel-label">Optional support</p>
                    <h4>
                      {selectedSensitiveSupport?.enabled
                        ? `${selectedSensitiveSupport.categories.length} path${selectedSensitiveSupport.categories.length === 1 ? "" : "s"} enabled`
                        : "Support path disabled"}
                    </h4>
                    <p>
                      {selectedSensitiveSupport?.enabled
                        ? selectedSensitiveSupport.include_in_export
                          ? "Included in export when you generate a ZIP."
                          : "Excluded from export unless you turn inclusion on."
                        : "No sensitive support data is being tracked for this opportunity."}
                    </p>
                  </article>
                </div>
              ) : null}
            </section>

            {state.currentMode === "user" ? (
              <>
                <section className="record-grid">
                  <form className="stage-block" onSubmit={handleAccountSubmit}>
                    <h3>1. Account setup</h3>
                    <p>Create or switch the enterprise container that owns support tier, region, and governance posture.</p>
                    <label className="field">
                      <span>Account name</span>
                      <input
                        value={accountDraft.account_name}
                        onChange={(event) =>
                          setAccountDraft((current) => ({
                            ...current,
                            account_name: event.target.value,
                          }))
                        }
                        required
                      />
                    </label>
                    <label className="field">
                      <span>Account type</span>
                      <select
                        value={accountDraft.account_type}
                        onChange={(event) =>
                          setAccountDraft((current) => ({
                            ...current,
                            account_type: event.target.value as AccountType,
                          }))
                        }
                      >
                        <option value="enterprise">Enterprise</option>
                        <option value="government">Government</option>
                        <option value="education">Education</option>
                        <option value="workforce_program">Workforce program</option>
                        <option value="individual">Individual</option>
                      </select>
                    </label>
                    <label className="field">
                      <span>Primary region</span>
                      <input
                        value={accountDraft.primary_region}
                        onChange={(event) =>
                          setAccountDraft((current) => ({
                            ...current,
                            primary_region: event.target.value,
                          }))
                        }
                      />
                    </label>
                    <label className="field">
                      <span>Support tier</span>
                      <input
                        value={accountDraft.support_tier}
                        onChange={(event) =>
                          setAccountDraft((current) => ({
                            ...current,
                            support_tier: event.target.value,
                          }))
                        }
                      />
                    </label>
                    <button className="primary-action" type="submit">
                      Create account
                    </button>
                  </form>

                  <form className="stage-block" onSubmit={handleUserSubmit}>
                    <h3>2. User onboarding</h3>
                    <p>Capture the human actor, region, accessibility needs, and sponsorship model before lifecycle logic starts.</p>
                    <label className="field">
                      <span>Full name</span>
                      <input
                        value={userDraft.full_name}
                        onChange={(event) =>
                          setUserDraft((current) => ({
                            ...current,
                            full_name: event.target.value,
                          }))
                        }
                        required
                      />
                    </label>
                    <label className="field">
                      <span>Email</span>
                      <input
                        type="email"
                        value={userDraft.email}
                        onChange={(event) =>
                          setUserDraft((current) => ({ ...current, email: event.target.value }))
                        }
                        required
                      />
                    </label>
                    <label className="field">
                      <span>Current role</span>
                      <input
                        value={userDraft.current_role}
                        onChange={(event) =>
                          setUserDraft((current) => ({
                            ...current,
                            current_role: event.target.value,
                          }))
                        }
                      />
                    </label>
                    <label className="field">
                      <span>Target role family</span>
                      <input
                        value={userDraft.target_role_family}
                        onChange={(event) =>
                          setUserDraft((current) => ({
                            ...current,
                            target_role_family: event.target.value,
                          }))
                        }
                      />
                    </label>
                    <label className="field">
                      <span>Accessibility needs</span>
                      <input
                        value={userDraft.accessibility_needs}
                        onChange={(event) =>
                          setUserDraft((current) => ({
                            ...current,
                            accessibility_needs: event.target.value,
                          }))
                        }
                      />
                    </label>
                    <label className="field">
                      <span>Sponsorship type</span>
                      <select
                        value={userDraft.sponsorship_type}
                        onChange={(event) =>
                          setUserDraft((current) => ({
                            ...current,
                            sponsorship_type: event.target.value as SponsorshipType,
                          }))
                        }
                      >
                        <option value="organization_sponsored">Organization sponsored</option>
                        <option value="self_serve">Self serve</option>
                        <option value="managed_service">Managed service</option>
                      </select>
                    </label>
                    <button className="primary-action" type="submit">
                      Create user
                    </button>
                  </form>

                  <form className="stage-block" onSubmit={handleOpportunitySubmit}>
                    <h3>3. Opportunity intake</h3>
                    <p>Start a real opportunity record with lifecycle stage, source, and supportable metadata.</p>
                    <label className="field">
                      <span>Company name</span>
                      <input
                        value={opportunityDraft.company_name}
                        onChange={(event) =>
                          setOpportunityDraft((current) => ({
                            ...current,
                            company_name: event.target.value,
                          }))
                        }
                        required
                      />
                    </label>
                    <label className="field">
                      <span>Role title</span>
                      <input
                        value={opportunityDraft.role_title}
                        onChange={(event) =>
                          setOpportunityDraft((current) => ({
                            ...current,
                            role_title: event.target.value,
                          }))
                        }
                        required
                      />
                    </label>
                    <label className="field">
                      <span>Opportunity source</span>
                      <input
                        value={opportunityDraft.opportunity_source}
                        onChange={(event) =>
                          setOpportunityDraft((current) => ({
                            ...current,
                            opportunity_source: event.target.value,
                          }))
                        }
                      />
                    </label>
                    <label className="field">
                      <span>Posting URL</span>
                      <input
                        value={opportunityDraft.job_posting_url}
                        onChange={(event) =>
                          setOpportunityDraft((current) => ({
                            ...current,
                            job_posting_url: event.target.value,
                          }))
                        }
                      />
                    </label>
                    <button className="primary-action" type="submit">
                      Create opportunity
                    </button>
                  </form>
                </section>

                <section className="record-grid">
                  <form className="stage-block" onSubmit={handleArtifactSubmit}>
                    <h3>4. Document intake and management</h3>
                    <p>Capture resumes, job descriptions, notes, messages, and generated outputs with lifecycle-aware metadata.</p>
                    <label className="field">
                      <span>Artifact type</span>
                      <select
                        value={artifactDraft.artifact_type}
                        onChange={(event) =>
                          setArtifactDraft((current) => ({
                            ...current,
                            artifact_type: event.target.value as ArtifactType,
                          }))
                        }
                      >
                        <option value="resume">Resume</option>
                        <option value="job_description">Job description</option>
                        <option value="message">Message</option>
                        <option value="note">Note</option>
                        <option value="offer">Offer</option>
                        <option value="debrief">Debrief</option>
                        <option value="generated_output">Generated output</option>
                        <option value="other">Other</option>
                      </select>
                    </label>
                    <label className="field">
                      <span>Source label</span>
                      <input
                        value={artifactDraft.source_label}
                        onChange={(event) =>
                          setArtifactDraft((current) => ({
                            ...current,
                            source_label: event.target.value,
                          }))
                        }
                        required
                      />
                    </label>
                    <label className="field">
                      <span>Evidence note</span>
                      <input
                        value={artifactDraft.evidence_note}
                        onChange={(event) =>
                          setArtifactDraft((current) => ({
                            ...current,
                            evidence_note: event.target.value,
                          }))
                        }
                      />
                    </label>
                    <label className="field">
                      <span>Content summary</span>
                      <textarea
                        rows={4}
                        value={artifactDraft.content_summary}
                        onChange={(event) =>
                          setArtifactDraft((current) => ({
                            ...current,
                            content_summary: event.target.value,
                          }))
                        }
                      />
                    </label>
                    <button className="primary-action" type="submit">
                      Add artifact
                    </button>
                  </form>

                  <form className="stage-block" onSubmit={handleProfileSubmit}>
                    <h3>5. Candidate profile confirmation</h3>
                    <p>Turn extracted data into a reviewable, correctable profile that drives checkpoints and fit analysis.</p>
                    <label className="field">
                      <span>Skills summary</span>
                      <textarea rows={3} defaultValue={profileDraft.skills_summary} name="skills_summary" />
                    </label>
                    <label className="field">
                      <span>Experience level</span>
                      <input defaultValue={profileDraft.experience_level} name="experience_level" />
                    </label>
                    <label className="field">
                      <span>Domain strengths</span>
                      <textarea rows={3} defaultValue={profileDraft.domain_strengths} name="domain_strengths" />
                    </label>
                    <label className="field">
                      <span>Declared gaps</span>
                      <textarea rows={3} defaultValue={profileDraft.declared_gaps} name="declared_gaps" />
                    </label>
                    <button className="primary-action" type="submit">
                      Save profile
                    </button>
                  </form>

                  <form className="stage-block" onSubmit={handleCorrespondenceSubmit}>
                    <h3>6. Correspondence operations</h3>
                    <p>Generate reviewable outreach or internal notes without bypassing approval state or auditability.</p>
                    <label className="field">
                      <span>Channel</span>
                      <select
                        value={correspondenceDraft.channel}
                        onChange={(event) =>
                          setCorrespondenceDraft((current) => ({
                            ...current,
                            channel: event.target.value as CorrespondenceDraft["channel"],
                          }))
                        }
                      >
                        <option value="email">Email</option>
                        <option value="linkedin">LinkedIn</option>
                        <option value="note">Internal note</option>
                      </select>
                    </label>
                    <label className="field">
                      <span>Subject</span>
                      <input
                        value={correspondenceDraft.subject}
                        onChange={(event) =>
                          setCorrespondenceDraft((current) => ({
                            ...current,
                            subject: event.target.value,
                          }))
                        }
                      />
                    </label>
                    <label className="field">
                      <span>Body</span>
                      <textarea
                        rows={4}
                        value={correspondenceDraft.body}
                        onChange={(event) =>
                          setCorrespondenceDraft((current) => ({
                            ...current,
                            body: event.target.value,
                          }))
                        }
                      />
                    </label>
                    <button className="primary-action" type="submit">
                      Create correspondence draft
                    </button>
                  </form>
                </section>

                <section className="record-grid">
                  <div className="stage-block coaching-block">
                    <h3>Optional stage coaching</h3>
                    <p>
                      This support stays inside the current workflow step, stays hidden
                      until opened, and can be skipped completely.
                    </p>
                    <div className="coaching-stack">
                      <details className="coaching-panel">
                        <summary>{getCoachingTitle(selectedOpportunity?.current_stage ?? "intake_started")}</summary>
                        <p>{currentCoaching.intro}</p>
                        <ul className="plain-list">
                          {currentCoaching.businessLessons.map((lesson) => (
                            <li key={lesson}>{lesson}</li>
                          ))}
                        </ul>
                      </details>

                      <details className="coaching-panel">
                        <summary>Glossary for this stage</summary>
                        <div className="stack-list">
                          {currentCoaching.glossary.map((entry) => (
                            <article key={entry.term} className="mini-card">
                              <p className="panel-label">{entry.term}</p>
                              <p>{entry.definition}</p>
                            </article>
                          ))}
                        </div>
                      </details>

                      <details className="coaching-panel">
                        <summary>Business lifecycle context</summary>
                        <div className="stack-list">
                          {currentCoaching.lifecycle.map((entry) => (
                            <article key={entry.label} className="mini-card">
                              <p className="panel-label">{entry.label}</p>
                              <p>{entry.detail}</p>
                            </article>
                          ))}
                        </div>
                      </details>

                      <details className="coaching-panel">
                        <summary>Document and process guidance</summary>
                        <div className="stack-list">
                          {currentCoaching.process.map((entry) => (
                            <article key={entry.label} className="mini-card">
                              <p className="panel-label">{entry.label}</p>
                              <p>{entry.detail}</p>
                            </article>
                          ))}
                        </div>
                      </details>

                      <details className="coaching-panel">
                        <summary>Compensation stack coaching</summary>
                        <ul className="plain-list">
                          {currentCoaching.compensation.map((entry) => (
                            <li key={entry}>{entry}</li>
                          ))}
                        </ul>
                      </details>
                    </div>
                  </div>

                  <form className="stage-block" onSubmit={handleSensitiveSupportSubmit}>
                    <h3>Optional sensitive support path</h3>
                    <p>
                      This section is fully optional. It stays local to this device and
                      is excluded from export unless you explicitly include it.
                    </p>
                    <label className="checkbox-field">
                      <input
                        type="checkbox"
                        checked={sensitiveSupportDraft.enabled}
                        onChange={(event) =>
                          setSensitiveSupportDraft((current) => ({
                            ...current,
                            enabled: event.target.checked,
                          }))
                        }
                      />
                      <span>Enable local-only support guidance for this opportunity</span>
                    </label>
                    <div className="support-grid">
                      {(Object.keys(supportTemplates) as SensitiveSupportType[]).map((key) => (
                        <label key={key} className="checkbox-field">
                          <input
                            type="checkbox"
                            checked={sensitiveSupportDraft.categories.includes(key)}
                            disabled={!sensitiveSupportDraft.enabled}
                            onChange={(event) =>
                              toggleSensitiveCategory(key, event.target.checked)
                            }
                          />
                          <span>{supportTemplates[key].label}</span>
                        </label>
                      ))}
                    </div>
                    <label className="field">
                      <span>Private notes</span>
                      <textarea
                        rows={4}
                        value={sensitiveSupportDraft.notes}
                        disabled={!sensitiveSupportDraft.enabled}
                        onChange={(event) =>
                          setSensitiveSupportDraft((current) => ({
                            ...current,
                            notes: event.target.value,
                          }))
                        }
                        placeholder="Only capture what helps you plan. This is not required."
                      />
                    </label>
                    <label className="field">
                      <span>Encouragement and practical next-step plan</span>
                      <textarea
                        rows={4}
                        value={sensitiveSupportDraft.encouragement_plan}
                        disabled={!sensitiveSupportDraft.enabled}
                        onChange={(event) =>
                          setSensitiveSupportDraft((current) => ({
                            ...current,
                            encouragement_plan: event.target.value,
                          }))
                        }
                        placeholder="Record a calm next-step plan for yourself."
                      />
                    </label>
                    <label className="checkbox-field">
                      <input
                        type="checkbox"
                        checked={sensitiveSupportDraft.include_in_export}
                        disabled={!sensitiveSupportDraft.enabled}
                        onChange={(event) =>
                          setSensitiveSupportDraft((current) => ({
                            ...current,
                            include_in_export: event.target.checked,
                          }))
                        }
                      />
                      <span>Include this support profile in ZIP export</span>
                    </label>
                    <button className="primary-action" type="submit">
                      Save support settings
                    </button>
                    {sensitiveSupportDraft.enabled && sensitiveSupportDraft.categories.length ? (
                      <div className="stack-list">
                        {sensitiveSupportDraft.categories.map((category) => (
                          <article key={category} className="mini-card">
                            <p className="panel-label">{supportTemplates[category].label}</p>
                            <p>{supportTemplates[category].guidance}</p>
                            <ul className="plain-list">
                              {supportTemplates[category].actions.map((action) => (
                                <li key={action}>{action}</li>
                              ))}
                            </ul>
                          </article>
                        ))}
                      </div>
                    ) : null}
                  </form>

                  <div className="stage-block">
                    <h3>7. Candidate story</h3>
                    <p>
                      Generate a know-thyself narrative that teaches who, what, why,
                      where, when, and how to communicate from captured lifecycle evidence.
                    </p>
                    <div className="platform-button-row">
                      <button
                        className="primary-action"
                        type="button"
                        onClick={handleGenerateCandidateStory}
                      >
                        Generate story
                      </button>
                      <button
                        className="secondary-action"
                        type="button"
                        onClick={handleSaveCandidateStory}
                      >
                        Save edits
                      </button>
                    </div>
                    <label className="field">
                      <span>Candidate story markdown</span>
                      <textarea
                        rows={16}
                        value={candidateStoryDraft}
                        onChange={(event) => setCandidateStoryDraft(event.target.value)}
                        placeholder="Generate a candidate story to create an editable narrative."
                      />
                    </label>
                    {selectedCandidateStory ? (
                      <div className="chip-row">
                        <span className="status-chip">{selectedCandidateStory.status}</span>
                        <span className="status-chip">
                          artifacts: {selectedCandidateStory.source_artifact_ids.length}
                        </span>
                        <span className="status-chip">
                          correspondence: {selectedCandidateStory.source_correspondence_ids.length}
                        </span>
                      </div>
                    ) : null}
                  </div>

                  <div className="stage-block">
                    <h3>Structured signal extraction</h3>
                    <p>
                      Parsed signals stay local and help build profile, timing, interview,
                      and contact awareness for this opportunity.
                    </p>
                    <div className="stack-list">
                      <article className="mini-card">
                        <p className="panel-label">Contacts and entities</p>
                        <p>
                          Names: {extractedSignals.names.join(", ") || "None yet"}
                        </p>
                        <p>
                          Emails: {extractedSignals.emails.join(", ") || "None yet"}
                        </p>
                        <p>
                          Phones: {extractedSignals.phones.join(", ") || "None yet"}
                        </p>
                        <p>
                          Companies: {extractedSignals.companies.join(", ") || "None yet"}
                        </p>
                      </article>
                      <article className="mini-card">
                        <p className="panel-label">Timing and interview cues</p>
                        <p>
                          Dates: {extractedSignals.dates.join(", ") || "None yet"}
                        </p>
                        <p>
                          Times: {extractedSignals.times.join(", ") || "None yet"}
                        </p>
                        <p>
                          Interviews: {extractedSignals.interviews.join(" | ") || "None yet"}
                        </p>
                        <p>
                          Contingencies: {extractedSignals.contingencies.join(" | ") || "None yet"}
                        </p>
                      </article>
                    </div>
                  </div>

                  <div className="stage-block">
                    <h3>Documents and evidence</h3>
                    <div className="table-wrap">
                      <table>
                        <thead>
                          <tr>
                            <th>Artifact</th>
                            <th>Type</th>
                            <th>Version</th>
                            <th>Parse</th>
                            <th>Review</th>
                            <th>Signals</th>
                          </tr>
                        </thead>
                        <tbody>
                          {opportunityArtifacts.map((artifact) => (
                            <tr key={artifact.artifact_id}>
                              <td>{artifact.source_label}</td>
                              <td>{artifact.artifact_type}</td>
                              <td>v{artifact.version_number}</td>
                              <td>{artifact.parse_status}</td>
                              <td>
                                <select
                                  value={artifact.review_status}
                                  onChange={(event) =>
                                    setArtifactReviewStatus(
                                      artifact.artifact_id,
                                      event.target.value as ReviewStatus,
                                    )
                                  }
                                >
                                  <option value="unreviewed">Unreviewed</option>
                                  <option value="user_reviewed">User reviewed</option>
                                  <option value="approved">Approved</option>
                                  <option value="rejected">Rejected</option>
                                  <option value="archived">Archived</option>
                                </select>
                              </td>
                              <td>
                                {artifact.extracted_signals
                                  ? artifact.extracted_signals.emails.length +
                                    artifact.extracted_signals.names.length +
                                    artifact.extracted_signals.dates.length +
                                    artifact.extracted_signals.interviews.length
                                  : 0}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  <div className="stage-block">
                    <h3>AI checkpoints and review gates</h3>
                    <div className="stack-list">
                      {opportunityCheckpoints.map((checkpoint) => (
                        <article key={checkpoint.checkpoint_id} className="mini-card">
                          <p className="panel-label">{checkpoint.step_name}</p>
                          <h4>{checkpoint.decision.replace(/_/g, " ")}</h4>
                          <p>{checkpoint.evidence_summary}</p>
                          <div className="chip-row">
                            <span className="status-chip">{checkpoint.confidence_level}</span>
                            <span className="status-chip">
                              reviewer: {checkpoint.assigned_reviewer_role}
                            </span>
                          </div>
                        </article>
                      ))}
                    </div>
                  </div>
                </section>
              </>
            ) : null}

            {state.currentMode === "staff" ? (
              <>
                <section className="record-grid">
                  <div className="stage-block">
                    <h3>Current opportunity ops snapshot</h3>
                    <div className="summary-grid">
                      <div>
                        <span className="metric-label">Story status</span>
                        <strong>{selectedCandidateStory ? "Ready" : "Missing"}</strong>
                      </div>
                      <div>
                        <span className="metric-label">Blocking tasks</span>
                        <strong>{blockingTaskCount}</strong>
                      </div>
                      <div>
                        <span className="metric-label">Review-required checkpoints</span>
                        <strong>{currentReviewRequiredCount}</strong>
                      </div>
                      <div>
                        <span className="metric-label">Sensitive support</span>
                        <strong>
                          {selectedSensitiveSupport?.enabled ? "Enabled" : "Off"}
                        </strong>
                      </div>
                    </div>
                  </div>

                  <div className="stage-block">
                    <h3>Onboarding queue</h3>
                    <div className="stack-list">
                      {onboardingQueue.map((opportunity) => (
                        <article key={opportunity.opportunity_id} className="mini-card">
                          <p className="panel-label">{stageMeta[opportunity.current_stage].label}</p>
                          <h4>{opportunity.company_name}</h4>
                          <p>{opportunity.role_title}</p>
                        </article>
                      ))}
                    </div>
                  </div>

                  <div className="stage-block">
                    <h3>Review queue</h3>
                    <div className="stack-list">
                      {reviewQueue.map((item) => (
                        <article
                          key={"artifact_id" in item ? item.artifact_id : item.correspondence_id}
                          className="mini-card"
                        >
                          <p className="panel-label">
                            {"artifact_id" in item ? "Document review" : "Correspondence review"}
                          </p>
                          <h4>
                            {"artifact_id" in item ? item.source_label : item.subject || "Untitled draft"}
                          </h4>
                          <p>
                            {"artifact_id" in item
                              ? item.content_summary
                              : item.body}
                          </p>
                          {"artifact_id" in item ? (
                            <button
                              className="secondary-action"
                              type="button"
                              onClick={() => setArtifactReviewStatus(item.artifact_id, "approved")}
                            >
                              Approve artifact
                            </button>
                          ) : (
                            <button
                              className="secondary-action"
                              type="button"
                              onClick={() => setCorrespondenceStatus(item.correspondence_id, "approved")}
                            >
                              Approve correspondence
                            </button>
                          )}
                        </article>
                      ))}
                    </div>
                  </div>

                  <div className="stage-block">
                    <h3>Escalation queue</h3>
                    <div className="stack-list">
                      {escalationQueue.map((escalation) => (
                        <article key={escalation.escalation_id} className="mini-card">
                          <p className="panel-label">{escalation.escalation_type}</p>
                          <h4>
                            {escalation.owner_role} • {escalation.severity}
                          </h4>
                          <p>{escalation.resolution_notes || "Awaiting resolution notes."}</p>
                          <button
                            className="secondary-action"
                            type="button"
                            onClick={() => resolveEscalation(escalation.escalation_id)}
                          >
                            Mark resolved
                          </button>
                        </article>
                      ))}
                    </div>
                  </div>
                </section>

                <section className="record-grid">
                  <form className="stage-block" onSubmit={handleTaskSubmit}>
                    <h3>Task orchestration</h3>
                    <label className="field">
                      <span>Task type</span>
                      <input
                        value={taskDraft.task_type}
                        onChange={(event) =>
                          setTaskDraft((current) => ({
                            ...current,
                            task_type: event.target.value,
                          }))
                        }
                      />
                    </label>
                    <label className="field">
                      <span>Owner role</span>
                      <input
                        value={taskDraft.owner_role}
                        onChange={(event) =>
                          setTaskDraft((current) => ({
                            ...current,
                            owner_role: event.target.value,
                          }))
                        }
                      />
                    </label>
                    <label className="checkbox-field">
                      <input
                        type="checkbox"
                        checked={taskDraft.blocking}
                        onChange={(event) =>
                          setTaskDraft((current) => ({
                            ...current,
                            blocking: event.target.checked,
                          }))
                        }
                      />
                      <span>Blocking task</span>
                    </label>
                    <button className="primary-action" type="submit">
                      Add task
                    </button>
                  </form>

                  <form className="stage-block" onSubmit={handleEscalationSubmit}>
                    <h3>Escalate issue</h3>
                    <label className="field">
                      <span>Escalation type</span>
                      <select
                        value={escalationDraft.escalation_type}
                        onChange={(event) =>
                          setEscalationDraft((current) => ({
                            ...current,
                            escalation_type: event.target.value as EscalationDraft["escalation_type"],
                          }))
                        }
                      >
                        <option value="policy">Policy</option>
                        <option value="privacy">Privacy</option>
                        <option value="security">Security</option>
                        <option value="legal">Legal</option>
                        <option value="accessibility">Accessibility</option>
                        <option value="finance">Finance</option>
                        <option value="delivery">Delivery</option>
                      </select>
                    </label>
                    <label className="field">
                      <span>Owner role</span>
                      <input
                        value={escalationDraft.owner_role}
                        onChange={(event) =>
                          setEscalationDraft((current) => ({
                            ...current,
                            owner_role: event.target.value,
                          }))
                        }
                      />
                    </label>
                    <label className="field">
                      <span>Severity</span>
                      <select
                        value={escalationDraft.severity}
                        onChange={(event) =>
                          setEscalationDraft((current) => ({
                            ...current,
                            severity: event.target.value as EscalationDraft["severity"],
                          }))
                        }
                      >
                        <option value="low">Low</option>
                        <option value="medium">Medium</option>
                        <option value="high">High</option>
                        <option value="critical">Critical</option>
                      </select>
                    </label>
                    <label className="field">
                      <span>Reason</span>
                      <textarea
                        rows={3}
                        value={escalationDraft.resolution_notes}
                        onChange={(event) =>
                          setEscalationDraft((current) => ({
                            ...current,
                            resolution_notes: event.target.value,
                          }))
                        }
                      />
                    </label>
                    <button className="primary-action" type="submit">
                      Route escalation
                    </button>
                  </form>

                  <div className="stage-block">
                    <h3>Operational task list</h3>
                    <div className="table-wrap">
                      <table>
                        <thead>
                          <tr>
                            <th>Task</th>
                            <th>Owner</th>
                            <th>Status</th>
                            <th>Blocking</th>
                          </tr>
                        </thead>
                        <tbody>
                          {opportunityTasks.map((task) => (
                            <tr key={task.task_id}>
                              <td>{task.task_type}</td>
                              <td>{task.owner_role}</td>
                              <td>
                                <select
                                  value={task.status}
                                  onChange={(event) =>
                                    setTaskStatus(task.task_id, event.target.value as TaskStatus)
                                  }
                                >
                                  <option value="open">Open</option>
                                  <option value="in_progress">In progress</option>
                                  <option value="blocked">Blocked</option>
                                  <option value="completed">Completed</option>
                                  <option value="cancelled">Cancelled</option>
                                </select>
                              </td>
                              <td>{task.blocking ? "Yes" : "No"}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  <div className="stage-block">
                    <h3>Story and handoff review</h3>
                    <div className="stack-list">
                      <article className="mini-card">
                        <p className="panel-label">Candidate story</p>
                        <h4>{selectedCandidateStory?.title || "No story yet"}</h4>
                        <p>
                          {selectedCandidateStory?.summary ||
                            "Generate and review the opportunity narrative before final external use."}
                        </p>
                      </article>
                      <article className="mini-card">
                        <p className="panel-label">ZIP handoff status</p>
                        <h4>{exportReadinessLabel}</h4>
                        <p>
                          Local-only data is durable only after export. Use this as the staff
                          reminder before resets, browser changes, or device transitions.
                        </p>
                      </article>
                      <article className="mini-card">
                        <p className="panel-label">Enterprise controls</p>
                        <h4>{enterpriseControlSummary}</h4>
                        <p>
                          Diligence-enabled roles: {diligenceEnabledCount}. External release
                          approval:{" "}
                          {selectedEnterpriseControls?.external_release_requires_approval
                            ? "Required"
                            : "Not required"}.
                        </p>
                      </article>
                    </div>
                  </div>
                </section>
              </>
            ) : null}

            {state.currentMode === "admin" ? (
              <>
                <section className="record-grid">
                  <div className="stage-block">
                    <h3>Current handoff package scope</h3>
                    <div className="chip-row">
                      <span className="status-chip">session.json</span>
                      <span className="status-chip">manifest.json</span>
                      <span className="status-chip">lifecycle markdown</span>
                      <span className="status-chip">candidate story markdown/pdf</span>
                      <span className="status-chip">correspondence markdown/pdf</span>
                      <span className="status-chip">memo markdown/pdf</span>
                      <span className="status-chip">session summary pdf</span>
                    </div>
                    <p>
                      JSON remains the restore authority. Markdown and PDF outputs are readable
                      derivatives for handoff, review, and print-safe usage.
                    </p>
                    <div className="stage-footer">
                      <button
                        className="secondary-action"
                        type="button"
                        onClick={handleIntegrityCheck}
                      >
                        Run integrity check
                      </button>
                      <button
                        className="secondary-action"
                        type="button"
                        onClick={handleBuyerPacketExport}
                      >
                        Generate buyer packet ZIP
                      </button>
                    </div>
                  </div>

                  <div className="stage-block">
                    <h3>Platform API surface</h3>
                    <div className="chip-row">
                      {apiSurface.map((resource) => (
                        <span key={resource} className="status-chip">
                          {resource}
                        </span>
                      ))}
                    </div>
                    <p>
                      The current implementation uses the workflow schema as the
                      local contract for first-class records and supports export
                      of all resources as a local handoff package with canonical JSON.
                    </p>
                  </div>

                  <div className="stage-block">
                    <h3>Integrity summary</h3>
                    <div className="summary-grid">
                      <div>
                        <span className="metric-label">Errors</span>
                        <strong>{integrityReport.errors.length}</strong>
                      </div>
                      <div>
                        <span className="metric-label">Warnings</span>
                        <strong>{integrityReport.warnings.length}</strong>
                      </div>
                    </div>
                    <div className="stack-list">
                      {integrityReport.errors.length ? (
                        integrityReport.errors.map((item) => (
                          <article key={item} className="mini-card tone-error">
                            <p className="panel-label">Error</p>
                            <p>{item}</p>
                          </article>
                        ))
                      ) : (
                        <article className="mini-card">
                          <p className="panel-label">Errors</p>
                          <p>No structural errors detected.</p>
                        </article>
                      )}
                      {integrityReport.warnings.slice(0, 3).map((item) => (
                        <article key={item} className="mini-card tone-warning">
                          <p className="panel-label">Warning</p>
                          <p>{item}</p>
                        </article>
                      ))}
                    </div>
                    <p>
                      {lastIntegrityRunAt
                        ? `Last integrity run: ${new Date(lastIntegrityRunAt).toLocaleString()}.`
                        : "Integrity checks run automatically during import and export and can be triggered manually here."}
                    </p>
                  </div>

                  <div className="stage-block">
                    <h3>Reporting snapshot</h3>
                    <div className="summary-grid">
                      <div>
                        <span className="metric-label">Intake completion</span>
                        <strong>{Math.round(reportingSnapshot.intake_completion_rate * 100)}%</strong>
                      </div>
                      <div>
                        <span className="metric-label">Fit review completion</span>
                        <strong>{Math.round(reportingSnapshot.fit_review_completion_rate * 100)}%</strong>
                      </div>
                      <div>
                        <span className="metric-label">Approval rate</span>
                        <strong>{Math.round(reportingSnapshot.approval_rate * 100)}%</strong>
                      </div>
                      <div>
                        <span className="metric-label">Escalation rate</span>
                        <strong>{Math.round(reportingSnapshot.escalation_rate * 100)}%</strong>
                      </div>
                    </div>
                  </div>

                  <div className="stage-block">
                    <h3>Release status</h3>
                    <div className="summary-grid">
                      <div>
                        <span className="metric-label">Last validated phase</span>
                        <strong>{releaseStatus.lastValidatedPhase}</strong>
                      </div>
                      <div>
                        <span className="metric-label">Local checks</span>
                        <strong>{releaseStatus.localChecks.length}</strong>
                      </div>
                      <div>
                        <span className="metric-label">CI checks</span>
                        <strong>{releaseStatus.ciChecks.length}</strong>
                      </div>
                    </div>
                    <div className="stack-list">
                      <article className="mini-card">
                        <p className="panel-label">Local release path</p>
                        <ul className="plain-list">
                          {releaseStatus.localChecks.map((item) => (
                            <li key={item}>{item}</li>
                          ))}
                        </ul>
                      </article>
                      <article className="mini-card">
                        <p className="panel-label">CI release path</p>
                        <ul className="plain-list">
                          {releaseStatus.ciChecks.map((item) => (
                            <li key={item}>{item}</li>
                          ))}
                        </ul>
                      </article>
                      <article className="mini-card tone-warning">
                        <p className="panel-label">Known limits</p>
                        <ul className="plain-list">
                          {releaseStatus.currentLimits.map((item) => (
                            <li key={item}>{item}</li>
                          ))}
                        </ul>
                      </article>
                    </div>
                    <div className="stage-footer">
                      <button
                        className="secondary-action"
                        type="button"
                        onClick={() => releaseArtifactInputRef.current?.click()}
                      >
                        Import release/readiness artifact
                      </button>
                      <button
                        className="secondary-action"
                        type="button"
                        onClick={handleReleaseSummaryMarkdownDownload}
                      >
                        Download release summary MD
                      </button>
                      <button
                        className="secondary-action"
                        type="button"
                        onClick={handleReleaseSummaryJsonDownload}
                      >
                        Download release summary JSON
                      </button>
                      <button
                        className="secondary-action"
                        type="button"
                        onClick={handleReleaseReadinessPacketExport}
                      >
                        Generate readiness packet ZIP
                      </button>
                      <button
                        className="secondary-action"
                        type="button"
                        onClick={handleReadinessPacketDownload}
                      >
                        Download readiness packet MD
                      </button>
                    </div>
                    <input
                      ref={releaseArtifactInputRef}
                      data-testid="release-artifact-input"
                      className="sr-only"
                      type="file"
                      accept=".zip,application/zip,.json,application/json,.md,text/markdown,text/plain"
                      onChange={handleReleaseArtifactImport}
                    />
                    {importedReleaseArtifact ? (
                      <div className="stack-list artifact-review">
                        <article className="mini-card">
                          <p className="panel-label">Imported artifact</p>
                          <h4>{importedReleaseArtifact.title}</h4>
                          <p>{importedReleaseArtifact.summary}</p>
                          <p>Source: {importedReleaseArtifact.sourceName}</p>
                        </article>
                        <article className="mini-card">
                          <p className="panel-label">Included entries</p>
                          <ul className="plain-list">
                            {importedReleaseArtifact.entries.map((item) => (
                              <li key={item}>{item}</li>
                            ))}
                          </ul>
                        </article>
                        <article className="mini-card artifact-preview-card">
                          <p className="panel-label">Preview</p>
                          <pre className="artifact-preview">{importedReleaseArtifact.content}</pre>
                        </article>
                      </div>
                    ) : null}
                    <div className="stack-list artifact-review" data-testid="release-review-history">
                      <article className="mini-card">
                        <p className="panel-label">Review history</p>
                        <h4>{releaseArtifactReviews.length} stored</h4>
                        <p>
                          Imported release and readiness artifacts are persisted locally with the
                          workspace and included in handoff exports.
                        </p>
                        <div className="stage-footer">
                          <button
                            className="secondary-action"
                            type="button"
                            onClick={clearReleaseArtifactReviewsForCurrentOpportunity}
                            disabled={releaseArtifactReviews.length === 0}
                          >
                            Clear review history
                          </button>
                        </div>
                      </article>
                      <article className="mini-card">
                        <label className="field">
                          <span>Search stored reviews</span>
                          <input
                            value={releaseArtifactQuery}
                            onChange={(event) => setReleaseArtifactQuery(event.target.value)}
                            placeholder="Filter by title, source, summary, or content"
                          />
                        </label>
                        <p className="cell-note">
                          Showing {filteredReleaseArtifactReviews.length} of{" "}
                          {releaseArtifactReviews.length} stored review
                          {releaseArtifactReviews.length === 1 ? "" : "s"}.
                        </p>
                      </article>
                      {filteredReleaseArtifactReviews.slice(0, 3).map((item) => (
                        <article
                          key={item.review_id}
                          className="mini-card"
                          data-testid={`release-review-item-${item.review_id}`}
                        >
                          <p className="panel-label">{item.source_name}</p>
                          <div className="card-title-row">
                            <h4>{item.title}</h4>
                            {item.pinned ? <span className="status-chip">Pinned</span> : null}
                          </div>
                          <p>{item.summary}</p>
                          <p>Imported: {new Date(item.imported_at).toLocaleString()}</p>
                          <div className="stage-footer">
                            <button
                              className="secondary-action"
                              type="button"
                              onClick={() => removeReleaseArtifactReview(item.review_id)}
                            >
                              Remove review
                            </button>
                            <button
                              className="secondary-action"
                              type="button"
                              onClick={() => toggleReleaseArtifactReviewPin(item.review_id)}
                            >
                              {item.pinned ? "Unpin review" : "Pin review"}
                            </button>
                          </div>
                        </article>
                      ))}
                      {!filteredReleaseArtifactReviews.length ? (
                        <article className="mini-card tone-warning">
                          <p className="panel-label">No matching reviews</p>
                          <p>Adjust the search text or import another release/readiness artifact.</p>
                        </article>
                      ) : null}
                    </div>
                  </div>

                  <div className="stage-block">
                    <h3>Governance and town hall outcome</h3>
                    <ul className="plain-list">
                      <li>CEO direction: build Monyawn as an enterprise-grade opportunity platform.</li>
                      <li>President vote: Platform Ops First.</li>
                      <li>HR position: enterprise-complete functional coverage, with fractional roles allowed.</li>
                      <li>Operating model: human-in-the-loop with premium accessibility and governance standards on every shipped surface.</li>
                    </ul>
                  </div>
                </section>

                <section className="record-grid">
                  <div className="stage-block">
                    <h3>Enterprise control profile</h3>
                    {selectedEnterpriseControls ? (
                      <div className="field-stack">
                        <label className="field">
                          <span>Entitlements mode</span>
                          <select
                            value={selectedEnterpriseControls.entitlements_mode}
                            onChange={(event) =>
                              updateEnterpriseControlField(
                                "entitlements_mode",
                                event.target.value as typeof selectedEnterpriseControls.entitlements_mode,
                              )
                            }
                          >
                            <option value="guided_default">Guided default</option>
                            <option value="staff_review">Staff review</option>
                            <option value="admin_controlled">Admin controlled</option>
                          </select>
                        </label>
                        <label className="field">
                          <span>Buyer readiness stage</span>
                          <select
                            value={selectedEnterpriseControls.buyer_readiness_stage}
                            onChange={(event) =>
                              updateEnterpriseControlField(
                                "buyer_readiness_stage",
                                event.target.value as typeof selectedEnterpriseControls.buyer_readiness_stage,
                              )
                            }
                          >
                            <option value="internal_only">Internal only</option>
                            <option value="guided_pilot">Guided pilot</option>
                            <option value="buyer_reviewable">Buyer reviewable</option>
                          </select>
                        </label>
                        <label className="field">
                          <span>Deployment posture</span>
                          <textarea
                            rows={3}
                            value={selectedEnterpriseControls.deployment_posture}
                            onChange={(event) =>
                              updateEnterpriseControlField(
                                "deployment_posture",
                                event.target.value,
                              )
                            }
                          />
                        </label>
                        <label className="field">
                          <span>Control notes</span>
                          <textarea
                            rows={3}
                            value={selectedEnterpriseControls.notes}
                            onChange={(event) =>
                              updateEnterpriseControlField("notes", event.target.value)
                            }
                          />
                        </label>
                        <div className="toggle-grid">
                          <label className="checkbox-field">
                            <input
                              type="checkbox"
                              checked={selectedEnterpriseControls.external_release_requires_approval}
                              onChange={(event) =>
                                updateEnterpriseControlField(
                                  "external_release_requires_approval",
                                  event.target.checked,
                                )
                              }
                            />
                            <span>Require approval before external release</span>
                          </label>
                          <label className="checkbox-field">
                            <input
                              type="checkbox"
                              checked={selectedEnterpriseControls.export_confirmation_required}
                              onChange={(event) =>
                                updateEnterpriseControlField(
                                  "export_confirmation_required",
                                  event.target.checked,
                                )
                              }
                            />
                            <span>Require export confirmation prompt</span>
                          </label>
                          <label className="checkbox-field">
                            <input
                              type="checkbox"
                              checked={selectedEnterpriseControls.allow_sensitive_support_export}
                              onChange={(event) =>
                                updateEnterpriseControlField(
                                  "allow_sensitive_support_export",
                                  event.target.checked,
                                )
                              }
                            />
                            <span>Allow sensitive support export by policy</span>
                          </label>
                          <label className="checkbox-field">
                            <input
                              type="checkbox"
                              checked={selectedEnterpriseControls.local_only_posture_locked}
                              onChange={(event) =>
                                updateEnterpriseControlField(
                                  "local_only_posture_locked",
                                  event.target.checked,
                                )
                              }
                            />
                            <span>Lock local-only data posture</span>
                          </label>
                        </div>
                      </div>
                    ) : (
                      <p>Select an account to manage enterprise controls.</p>
                    )}
                  </div>

                  <div className="stage-block">
                    <h3>Account implementation console</h3>
                    <div className="table-wrap">
                      <table>
                        <thead>
                          <tr>
                            <th>Account</th>
                            <th>Type</th>
                            <th>Region</th>
                            <th>Support</th>
                          </tr>
                        </thead>
                        <tbody>
                          {state.accounts.map((account) => (
                            <tr key={account.account_id}>
                              <td>{account.account_name}</td>
                              <td>{account.account_type}</td>
                              <td>{account.primary_region}</td>
                              <td>{account.support_tier}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  <div className="stage-block">
                    <div className="section-head">
                      <h3>Entitlements and admin controls</h3>
                      <button
                        className="secondary-action"
                        type="button"
                        onClick={addEntitlementTemplate}
                      >
                        Add template role
                      </button>
                    </div>
                    <div className="table-wrap">
                      <table>
                        <thead>
                          <tr>
                            <th>Role</th>
                            <th>Workspace</th>
                            <th>Staff</th>
                            <th>Admin</th>
                            <th>Export</th>
                            <th>Diligence</th>
                          </tr>
                        </thead>
                        <tbody>
                          {selectedRoleEntitlements.map((entitlement) => (
                            <tr key={entitlement.entitlement_id}>
                              <td>
                                <strong>{entitlement.role_name}</strong>
                                <div className="cell-note">{entitlement.notes}</div>
                              </td>
                              <td>
                                <input
                                  type="checkbox"
                                  checked={entitlement.workspace_access}
                                  onChange={(event) =>
                                    setRoleEntitlementFlag(
                                      entitlement.entitlement_id,
                                      "workspace_access",
                                      event.target.checked,
                                    )
                                  }
                                />
                              </td>
                              <td>
                                <input
                                  type="checkbox"
                                  checked={entitlement.staff_queue_access}
                                  onChange={(event) =>
                                    setRoleEntitlementFlag(
                                      entitlement.entitlement_id,
                                      "staff_queue_access",
                                      event.target.checked,
                                    )
                                  }
                                />
                              </td>
                              <td>
                                <input
                                  type="checkbox"
                                  checked={entitlement.admin_console_access}
                                  onChange={(event) =>
                                    setRoleEntitlementFlag(
                                      entitlement.entitlement_id,
                                      "admin_console_access",
                                      event.target.checked,
                                    )
                                  }
                                />
                              </td>
                              <td>
                                <input
                                  type="checkbox"
                                  checked={entitlement.export_package_access}
                                  onChange={(event) =>
                                    setRoleEntitlementFlag(
                                      entitlement.entitlement_id,
                                      "export_package_access",
                                      event.target.checked,
                                    )
                                  }
                                />
                              </td>
                              <td>
                                <input
                                  type="checkbox"
                                  checked={entitlement.diligence_packet_access}
                                  onChange={(event) =>
                                    setRoleEntitlementFlag(
                                      entitlement.entitlement_id,
                                      "diligence_packet_access",
                                      event.target.checked,
                                    )
                                  }
                                />
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  <div className="stage-block">
                    <h3>Exportable correspondence and audit data</h3>
                    <div className="stack-list">
                      {opportunityCorrespondence.map((item) => (
                        <article key={item.correspondence_id} className="mini-card">
                          <p className="panel-label">{item.channel}</p>
                          <h4>{item.subject || "Untitled correspondence"}</h4>
                          <p>{item.body}</p>
                          <div className="chip-row">
                            <span className="status-chip">{item.status}</span>
                            <button
                              className="secondary-action"
                              type="button"
                              onClick={() => setCorrespondenceStatus(item.correspondence_id, "scheduled")}
                            >
                              Mark scheduled
                            </button>
                          </div>
                        </article>
                      ))}
                    </div>
                  </div>

                  <div className="stage-block">
                    <h3>Current opportunity governance</h3>
                    <div className="stack-list">
                      <article className="mini-card">
                        <p className="panel-label">Review controls</p>
                        <p>
                          Human-review-required checkpoints: {currentReviewRequiredCount}. Open
                          escalations: {opportunityEscalations.length}. Blocking tasks:{" "}
                          {blockingTaskCount}.
                        </p>
                      </article>
                      <article className="mini-card">
                        <p className="panel-label">Support boundary</p>
                        <p>
                          {selectedSensitiveSupport?.enabled
                            ? selectedSensitiveSupport.include_in_export
                              ? "Sensitive support is enabled and explicitly marked for export."
                              : "Sensitive support is enabled but remains local-only and excluded from export."
                            : "No sensitive support profile is active for this opportunity."}
                        </p>
                      </article>
                      <article className="mini-card">
                        <p className="panel-label">Narrative readiness</p>
                        <p>
                          {selectedCandidateStory
                            ? `Candidate story ready with ${selectedCandidateStory.source_artifact_ids.length} linked artifacts.`
                            : "Candidate story has not been generated yet."}
                        </p>
                      </article>
                      <article className="mini-card">
                        <p className="panel-label">Entitlement posture</p>
                        <p>
                          {selectedRoleEntitlements.length} role rows loaded.{" "}
                          {diligenceEnabledCount > 0
                            ? `${diligenceEnabledCount} role${diligenceEnabledCount === 1 ? "" : "s"} can assemble diligence materials.`
                            : "No role currently has diligence-packet access."}
                        </p>
                      </article>
                    </div>
                  </div>
                </section>
              </>
            ) : null}
          </div>
        </section>
      </main>
      )}
    </div>
  );
}

export default App;
