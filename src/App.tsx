import { MonyawnProvider, useMonyawn } from "./context/MonyawnContext";
import { AppHeader } from "./components/layout/AppHeader/AppHeader";
import { MobileNavigation } from "./components/layout/MobileNavigation/MobileNavigation";
import { AboutPage } from "./components/pages/About/AboutPage";
import { IntakeFlow } from "./components/flows/IntakeFlow/IntakeFlow";
import { WorkspacePage } from "./components/pages/Workspace/WorkspacePage";
import { LoginPage } from "./components/pages/Login/LoginPage";
import { StartPage } from "./components/pages/Start/StartPage";
import { SignalIntakePage } from "./components/pages/SignalIntake/SignalIntakePage";
import { OpportunityConfirmPage } from "./components/pages/OpportunityConfirm/OpportunityConfirmPage";
import { FormEvent, useEffect, useState } from "react";
import { 
  defaultAccountDraft, 
  defaultUserDraft, 
  defaultOpportunityDraft,
  AppPage,
} from "./context/MonyawnContext.types";
import { useAdminOps } from "./hooks/useAdminOps";
import { useOpportunityOps } from "./hooks/useOpportunityOps";
import {
  AICheckpoint,
  AppMode,
  CandidateProfile,
  EnterpriseControlProfile,
  Opportunity,
  RoleEntitlement,
  SourceArtifact,
  StageEvent,
  WorkflowTask,
} from "./types";
import { SignalIntakePayload } from "./components/pages/SignalIntake/SignalIntakePage.contract";
import {
  createAccount,
  createArtifact,
  createCandidateProfile,
  createCheckpoint,
  createEnterpriseControlProfile,
  createOpportunity,
  createRoleEntitlement,
  createStageEvent,
  createTask,
  createUser,
  nowIso,
} from "./workflow";

const modeLabels: Record<AppMode, string> = {
  user: "Guided workspace",
  staff: "Staff operations",
  admin: "Admin and governance",
};

function extractRoleTitle(text: string) {
  const lines = text
    .split(/\n+/)
    .map((line) => line.trim())
    .filter(Boolean);

  const titledLine = lines.find((line) =>
    /\b(engineer|manager|designer|architect|specialist|developer|analyst|director|lead|consultant|recruiter|coordinator)\b/i.test(
      line,
    ),
  );

  if (titledLine) {
    return titledLine.slice(0, 80);
  }

  const roleMatch = text.match(
    /\b(?:role|position|opportunity|opening)\s*(?:for|as)?\s*:?[\s-]*([A-Z][A-Za-z0-9,&/()\- ]{4,80})/i,
  );

  return roleMatch?.[1]?.trim() ?? "";
}

function inferCompanyFromUrl(url: string) {
  try {
    const parsed = new URL(url);
    const host = parsed.hostname.replace(/^www\./, "");
    const [first] = host.split(".");
    return first ? first.replace(/[-_]+/g, " ").replace(/\b\w/g, (char) => char.toUpperCase()) : "";
  } catch {
    return "";
  }
}

function extractEmails(text: string) {
  return Array.from(
    new Set(Array.from(text.matchAll(/\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/gi), (match) => match[0])),
  );
}

function extractCompanies(text: string) {
  return Array.from(
    new Set(
      Array.from(
        text.matchAll(/\b(?:at|with|from|joining|role at|opportunity with)\s+([A-Z][A-Za-z0-9&.\- ]{2,40})\b/g),
        (match) => (match[1] ?? "").trim(),
      ).filter(Boolean),
    ),
  );
}

function normalizeValue(value: string) {
  return value.trim().toLowerCase();
}

function summarizeSignalText(text: string) {
  const compact = text.replace(/\s+/g, " ").trim();
  if (!compact) {
    return "Imported signal";
  }
  return compact.length > 180 ? `${compact.slice(0, 177)}...` : compact;
}

function getSignalArtifactType(signalType: SignalIntakePayload["signalType"]) {
  switch (signalType) {
    case "recruiter_email":
      return "message" as const;
    case "job_link":
    case "job_text":
      return "job_description" as const;
    case "transcript":
      return "debrief" as const;
    case "note":
    default:
      return "note" as const;
  }
}

function getSignalSourceLabel(signal: SignalIntakePayload) {
  switch (signal.signalType) {
    case "recruiter_email":
      return "Recruiter email intake";
    case "job_link":
      return signal.signalUrl || "Job link intake";
    case "job_text":
      return "Job description intake";
    case "transcript":
      return "Interview transcript intake";
    case "note":
    default:
      return "Quick note intake";
  }
}

function AppContent() {
  const { 
    state, patchState, 
    currentPage, setCurrentPage, 
    mobileTab, setMobileTab,
    setNotice
  } = useMonyawn();

  const [windowWidth, setWindowWidth] = useState(typeof window !== "undefined" ? window.innerWidth : 1200);
  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const [accountDraft, setAccountDraft] = useState(defaultAccountDraft);
  const [userDraft, setUserDraft] = useState(defaultUserDraft);
  const [opportunityDraft, setOpportunityDraft] = useState(defaultOpportunityDraft);
  const [pendingSignal, setPendingSignal] = useState<SignalIntakePayload | null>(null);

  const { handleAccountSubmit, handleUserSubmit } = useAdminOps();
  const { handleOpportunitySubmit } = useOpportunityOps();

  const onAccountSubmit = (e: FormEvent) => {
    e.preventDefault();
    handleAccountSubmit(accountDraft);
    setAccountDraft(defaultAccountDraft);
  };

  const onUserSubmit = (e: FormEvent) => {
    e.preventDefault();
    handleUserSubmit(userDraft);
    setUserDraft(defaultUserDraft);
  };

  const onOpportunitySubmit = (e: FormEvent) => {
    e.preventDefault();
    handleOpportunitySubmit(opportunityDraft);
    setOpportunityDraft(defaultOpportunityDraft);
  };

  const navigateToPage = (page: AppPage) => {
    window.location.hash = page;
    setCurrentPage(page);
  };

  const startNewSignalFlow = () => {
    setOpportunityDraft(defaultOpportunityDraft);
    setPendingSignal(null);
    navigateToPage("signal");
  };

  const routeToStart = () => {
    navigateToPage("start");
  };

  const handleSignalSubmit = (payload: SignalIntakePayload) => {
    const combinedText = `${payload.signalText}\n${payload.signalUrl}`.trim();
    const companies = extractCompanies(combinedText);
    const emails = extractEmails(combinedText);
    const inferredCompany =
      companies[0] || inferCompanyFromUrl(payload.signalUrl) || opportunityDraft.company_name;
    const inferredRole = extractRoleTitle(payload.signalText) || opportunityDraft.role_title;

    setOpportunityDraft((current) => ({
      ...current,
      company_name: inferredCompany || current.company_name,
      role_title: inferredRole || current.role_title,
      opportunity_source: payload.signalType.replace(/_/g, " "),
      job_posting_url: payload.signalUrl || current.job_posting_url,
    }));

    if (emails[0] && !userDraft.email) {
      setUserDraft((current) => ({
        ...current,
        email: emails[0],
      }));
    }

    setPendingSignal(payload);

    setNotice({
      tone: "success",
      message: "Signal structured. Confirm the draft and create the opportunity.",
    });
    navigateToPage("confirm");
  };

  const handleConfirmOpportunity = () => {
    const trimmedName = userDraft.full_name.trim();
    const trimmedEmail = userDraft.email.trim();
    const trimmedCompany = opportunityDraft.company_name.trim();
    const trimmedRole = opportunityDraft.role_title.trim();

    if (!trimmedName || !trimmedCompany || !trimmedRole) {
      setNotice({
        tone: "info",
        message: "Add your name, company, and role before creating the opportunity.",
      });
      return;
    }

    const normalizedEmail = normalizeValue(trimmedEmail);
    const normalizedName = normalizeValue(trimmedName);
    const normalizedCompany = normalizeValue(trimmedCompany);
    const normalizedRole = normalizeValue(trimmedRole);
    const normalizedUrl = normalizeValue(opportunityDraft.job_posting_url);

    const matchedUser = state.users.find((user) => {
      if (normalizedEmail && normalizeValue(user.email) === normalizedEmail) {
        return true;
      }
      return normalizeValue(user.full_name) === normalizedName;
    });

    const nextAccountAdditions: Array<ReturnType<typeof createAccount>> = [];
    const nextUserAdditions: Array<ReturnType<typeof createUser>> = [];
    const nextControlProfileAdditions: EnterpriseControlProfile[] = [];
    const nextEntitlementAdditions: RoleEntitlement[] = [];
    const nextOpportunityAdditions: Opportunity[] = [];
    const nextProfileAdditions: CandidateProfile[] = [];
    const nextCheckpointAdditions: AICheckpoint[] = [];
    const nextTaskAdditions: WorkflowTask[] = [];
    const nextEventAdditions: StageEvent[] = [];
    const nextArtifactAdditions: SourceArtifact[] = [];

    let selectedAccountId = matchedUser?.account_id ?? "";
    let selectedUserId = matchedUser?.user_id ?? "";
    let selectedOpportunityId = "";

    if (!matchedUser) {
      const account = createAccount({
        account_name: `${trimmedName} workspace`,
        account_type: "individual",
        primary_region: userDraft.region || "United States",
        support_tier: "Guided opportunity workspace",
      });

      nextAccountAdditions.push(account);
      selectedAccountId = account.account_id;

      nextControlProfileAdditions.push(
        createEnterpriseControlProfile({
          account_id: account.account_id,
          entitlements_mode: "guided_default",
          external_release_requires_approval: true,
          export_confirmation_required: true,
          allow_sensitive_support_export: false,
          local_only_posture_locked: true,
          deployment_posture: "Local-first guided opportunity workspace.",
          buyer_readiness_stage: "internal_only",
          notes: "Auto-created from fast opportunity confirmation.",
        }),
      );

      nextEntitlementAdditions.push(
        createRoleEntitlement({
          account_id: account.account_id,
          role_name: "Candidate / User",
          workspace_access: true,
          staff_queue_access: false,
          admin_console_access: false,
          export_package_access: true,
          diligence_packet_access: false,
          notes: "Default guided candidate access.",
        }),
        createRoleEntitlement({
          account_id: account.account_id,
          role_name: "Admin / Governance",
          workspace_access: true,
          staff_queue_access: true,
          admin_console_access: true,
          export_package_access: true,
          diligence_packet_access: true,
          notes: "Default governance access.",
        }),
      );

      const user = createUser({
        account_id: account.account_id,
        ...userDraft,
        full_name: trimmedName,
        email: trimmedEmail,
      });

      nextUserAdditions.push(user);
      selectedUserId = user.user_id;
    } else {
      const mergedUser = {
        ...matchedUser,
        full_name: trimmedName || matchedUser.full_name,
        email: trimmedEmail || matchedUser.email,
        phone: userDraft.phone || matchedUser.phone,
        timezone: userDraft.timezone || matchedUser.timezone,
        region: userDraft.region || matchedUser.region,
        current_role: userDraft.current_role || matchedUser.current_role,
        target_role_family: userDraft.target_role_family || matchedUser.target_role_family,
        target_compensation:
          userDraft.target_compensation || matchedUser.target_compensation,
        accessibility_needs:
          userDraft.accessibility_needs || matchedUser.accessibility_needs,
        sponsorship_type: userDraft.sponsorship_type || matchedUser.sponsorship_type,
        updated_at: nowIso(),
      };

      if (
        JSON.stringify(mergedUser) !== JSON.stringify(matchedUser)
      ) {
        nextUserAdditions.push(mergedUser);
      }

      if (
        !state.enterpriseControlProfiles.some(
          (profile) => profile.account_id === matchedUser.account_id,
        )
      ) {
        nextControlProfileAdditions.push(
          createEnterpriseControlProfile({
            account_id: matchedUser.account_id,
            entitlements_mode: "guided_default",
            external_release_requires_approval: true,
            export_confirmation_required: true,
            allow_sensitive_support_export: false,
            local_only_posture_locked: true,
            deployment_posture: "Local-first guided opportunity workspace.",
            buyer_readiness_stage: "internal_only",
            notes: "Auto-created during fast confirmation.",
          }),
        );
      }

      if (
        state.roleEntitlements.filter(
          (entitlement) => entitlement.account_id === matchedUser.account_id,
        ).length === 0
      ) {
        nextEntitlementAdditions.push(
          createRoleEntitlement({
            account_id: matchedUser.account_id,
            role_name: "Candidate / User",
            workspace_access: true,
            staff_queue_access: false,
            admin_console_access: false,
            export_package_access: true,
            diligence_packet_access: false,
            notes: "Default guided candidate access.",
          }),
          createRoleEntitlement({
            account_id: matchedUser.account_id,
            role_name: "Admin / Governance",
            workspace_access: true,
            staff_queue_access: true,
            admin_console_access: true,
            export_package_access: true,
            diligence_packet_access: true,
            notes: "Default governance access.",
          }),
        );
      }
    }

    const matchedOpportunity = state.opportunities.find((opportunity) => {
      if (
        opportunity.account_id !== selectedAccountId ||
        opportunity.user_id !== selectedUserId
      ) {
        return false;
      }

      const sameCompany = normalizeValue(opportunity.company_name) === normalizedCompany;
      const sameRole = normalizeValue(opportunity.role_title) === normalizedRole;
      const sameUrl = normalizedUrl
        ? normalizeValue(opportunity.job_posting_url) === normalizedUrl
        : true;

      return sameCompany && sameRole && sameUrl;
    });

    let opportunity = matchedOpportunity;
    let profileExists = false;

    if (!opportunity) {
      opportunity = createOpportunity({
        account_id: selectedAccountId,
        user_id: selectedUserId,
        use_case_id: "sbs",
        ...opportunityDraft,
        company_name: trimmedCompany,
        role_title: trimmedRole,
        opportunity_source: opportunityDraft.opportunity_source || "signal intake",
        job_posting_url: opportunityDraft.job_posting_url.trim(),
      });

      nextOpportunityAdditions.push(opportunity);
      nextProfileAdditions.push(
        createCandidateProfile(selectedUserId, opportunity.opportunity_id),
      );
      nextCheckpointAdditions.push(
        createCheckpoint(
          opportunity,
          "Opportunity created",
          "Fast confirmation from signal intake",
          "high",
          "proceed",
          "A structured opportunity was created from a confirmed signal with minimal manual entry.",
          "none",
          "low",
        ),
      );
      nextTaskAdditions.push(
        createTask(
          opportunity.opportunity_id,
          "Review generated opportunity context and next steps",
          "Customer Success Lead",
          true,
        ),
      );
      nextEventAdditions.push(
        createStageEvent(
          opportunity.opportunity_id,
          opportunity.current_stage,
          "created",
          "user",
          selectedUserId,
          "Opportunity created from fast signal confirmation.",
        ),
      );
    } else {
      selectedOpportunityId = opportunity.opportunity_id;
      profileExists = state.candidateProfiles.some(
        (profile) => profile.opportunity_id === opportunity?.opportunity_id,
      );
    }

    if (opportunity) {
      selectedOpportunityId = opportunity.opportunity_id;
    }

    if (opportunity && matchedOpportunity && !profileExists) {
      nextProfileAdditions.push(
        createCandidateProfile(selectedUserId, opportunity.opportunity_id),
      );
    }

    if (pendingSignal && opportunity) {
      const sourceText = pendingSignal.signalText.trim() || pendingSignal.signalUrl.trim();
      const duplicateArtifact = state.artifacts.some(
        (artifact) =>
          artifact.opportunity_id === opportunity?.opportunity_id &&
          normalizeValue(artifact.source_label) ===
            normalizeValue(getSignalSourceLabel(pendingSignal)) &&
          normalizeValue(artifact.source_text ?? "") === normalizeValue(sourceText),
      );

      if (sourceText && !duplicateArtifact) {
        nextArtifactAdditions.push(
          createArtifact({
            opportunity_id: opportunity.opportunity_id,
            artifact_type: getSignalArtifactType(pendingSignal.signalType),
            source_label: getSignalSourceLabel(pendingSignal),
            origin: "imported",
            review_status: "user_reviewed",
            parse_status: "complete",
            evidence_note: `Captured from ${pendingSignal.signalType.replace(/_/g, " ")}.`,
            content_summary: summarizeSignalText(sourceText),
            source_text: sourceText,
          }),
        );
      }
    }

    patchState(
      (current) => ({
        ...current,
        accounts: [...nextAccountAdditions, ...current.accounts],
        users: nextUserAdditions.length
          ? [
              ...nextUserAdditions,
              ...current.users.filter(
                (user) => !nextUserAdditions.some((nextUser) => nextUser.user_id === user.user_id),
              ),
            ]
          : current.users,
        enterpriseControlProfiles: [
          ...nextControlProfileAdditions,
          ...current.enterpriseControlProfiles,
        ],
        roleEntitlements: [...nextEntitlementAdditions, ...current.roleEntitlements],
        opportunities: [...nextOpportunityAdditions, ...current.opportunities],
        candidateProfiles: [...nextProfileAdditions, ...current.candidateProfiles],
        checkpoints: [...nextCheckpointAdditions, ...current.checkpoints],
        tasks: [...nextTaskAdditions, ...current.tasks],
        events: [...nextEventAdditions, ...current.events],
        artifacts: [...nextArtifactAdditions, ...current.artifacts],
        selectedAccountId,
        selectedUserId,
        selectedOpportunityId,
      }),
      matchedOpportunity
        ? "Existing opportunity reopened from confirmed signal."
        : "Opportunity created from confirmed signal.",
    );

    setPendingSignal(null);
    setOpportunityDraft(defaultOpportunityDraft);
    setNotice({
      tone: "success",
      message: matchedOpportunity
        ? "Existing opportunity found. We reopened it and preserved the signal."
        : "Opportunity created. The workspace is ready for the next step.",
    });
    navigateToPage("workspace");
  };

  return (
    <div className="min-h-screen flex flex-col">
      {currentPage !== "login" && (
        <AppHeader
          currentPage={currentPage}
          currentMode={state.currentMode}
          modeLabel={modeLabels[state.currentMode]}
          lastExportedAt={state.lastExportedAt}
          navigateToPage={navigateToPage}
          onModeChange={(mode: AppMode) => patchState(s => ({ ...s, currentMode: mode }), `Mode switched to ${mode}.`)}
          opportunities={state.opportunities.map(o => ({ id: o.opportunity_id, name: `${o.company_name} - ${o.role_title}` }))}
          selectedOpportunityId={state.selectedOpportunityId}
          onOpportunitySelect={(id) => patchState(s => ({ ...s, selectedOpportunityId: id }), "Opportunity switched.")}
        />
      )}
      
      {windowWidth <= 768 && currentPage !== "login" && (
        <MobileNavigation
          activeTab={mobileTab}
          onTabChange={(tab) => {
            setMobileTab(tab);
            if (tab === "admin") patchState(c => ({ ...c, currentMode: "admin" }));
            else patchState(c => ({ ...c, currentMode: "user" }));
          }}
        />
      )}

      {currentPage === "login" && (
        <LoginPage
          onContinueLocal={routeToStart}
          onContinueGoogle={routeToStart}
          onContinueApple={routeToStart}
        />
      )}

      {currentPage === "start" && (
        <StartPage
          onAddSignal={startNewSignalFlow}
          onOpenWorkspace={() => navigateToPage("workspace")}
          onOpenAbout={() => navigateToPage("about")}
        />
      )}

      {currentPage === "signal" && (
        <SignalIntakePage
          onBack={routeToStart}
          onSubmitSignal={handleSignalSubmit}
        />
      )}

      {currentPage === "confirm" && (
        <OpportunityConfirmPage
          userDraft={userDraft}
          opportunityDraft={opportunityDraft}
          onUserDraftChange={setUserDraft}
          onOpportunityDraftChange={setOpportunityDraft}
          onBack={() => navigateToPage("signal")}
          onOpenAdvanced={() => navigateToPage("intake")}
          onConfirm={handleConfirmOpportunity}
        />
      )}

      {currentPage === "intake" && (
        <IntakeFlow
          accountDraft={accountDraft}
          onAccountDraftChange={setAccountDraft}
          onAccountSubmit={onAccountSubmit}
          userDraft={userDraft}
          onUserDraftChange={setUserDraft}
          onUserSubmit={onUserSubmit}
          opportunityDraft={opportunityDraft}
          onOpportunityDraftChange={setOpportunityDraft}
          onOpportunitySubmit={onOpportunitySubmit}
          onComplete={() => navigateToPage("workspace")}
          onCancel={routeToStart}
        />
      )}

      {currentPage === "workspace" && <WorkspacePage />}

      {currentPage === "about" && (
        <AboutPage
          navigateToPage={navigateToPage}
          RESUME_PATH="/thomas-smith-architect-resume.pdf"
          setNotice={setNotice}
        />
      )}
    </div>
  );
}

export default function App() {
  return (
    <MonyawnProvider>
      <AppContent />
    </MonyawnProvider>
  );
}
