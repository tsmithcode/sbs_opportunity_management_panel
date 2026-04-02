import React, { createContext, useContext, useMemo, useState, useEffect } from "react";
import { AppState, Opportunity, SourceArtifact, CorrespondenceItem, WorkflowTask, AICheckpoint, CandidateProfile, CandidateStory, SensitiveSupportProfile, CommercialPostureProfile } from "../types";
import { useMonyawnCore } from "../hooks/useMonyawnCore";
import { AppPage, Notice } from "./MonyawnContext.types";
import { MobileTab } from "../components/layout/MobileNavigation/MobileNavigation.contract";
import { 
  getOpportunityArtifacts, 
  getOpportunityTasks, 
  getOpportunityCheckpoints, 
  getOpportunityCorrespondence, 
  getOpportunitySensitiveSupport, 
  getOpportunityCandidateStory,
  getCompletionScore
} from "../workflow";
import { validateAppStateIntegrity } from "../integrity";

interface MonyawnContextType {
  state: AppState;
  patchState: (updater: (current: AppState) => AppState, actionLabel?: string) => void;
  resetSeedState: () => void;
  currentPage: AppPage;
  setCurrentPage: (page: AppPage) => void;
  mobileTab: MobileTab;
  setMobileTab: (tab: MobileTab) => void;
  notice: Notice;
  setNotice: (notice: Notice) => void;
  
  // Selection
  selectedAccount: any;
  selectedUser: any;
  selectedOpportunity: Opportunity | undefined;
  selectedProfile: CandidateProfile | undefined;
  selectedCommercialPosture: CommercialPostureProfile | undefined;
  selectedCandidateStory: CandidateStory | undefined;
  selectedSensitiveSupport: SensitiveSupportProfile | undefined;
  
  // Filtered Lists
  opportunityArtifacts: SourceArtifact[];
  opportunityTasks: WorkflowTask[];
  opportunityCheckpoints: AICheckpoint[];
  opportunityCorrespondence: CorrespondenceItem[];
  
  // Computed
  completionScore: number;
  integrityReport: { errors: string[]; warnings: string[] };
  lastIntegrityRunAt: string;
}

const MonyawnContext = createContext<MonyawnContextType | undefined>(undefined);

export const MonyawnProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { state, patchState, resetSeedState } = useMonyawnCore();
  const [currentPage, setCurrentPage] = useState<AppPage>("login");
  const [mobileTab, setMobileTab] = useState<MobileTab>("home");
  const [notice, setNotice] = useState<Notice>(null);

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace(/^#/, "");
      const routeMap: Record<string, AppPage> = {
        "login": "login",
        "start": "start",
        "proof-drop": "proof-drop",
        "confirm": "confirm",
        "setup-base": "setup-base",
        "workspace": "workspace",
        "about": "about",
        "signal": "proof-drop",
        "intake": "setup-base",
      };
      setCurrentPage(routeMap[hash] ?? "login");
    };
    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, []);

  const selectedAccount = useMemo(() => 
    state.accounts.find(a => a.account_id === state.selectedAccountId), 
    [state.accounts, state.selectedAccountId]
  );
  
  const selectedUser = useMemo(() => 
    state.users.find(u => u.user_id === state.selectedUserId), 
    [state.users, state.selectedUserId]
  );
  
  const selectedOpportunity = useMemo(() => 
    state.opportunities.find(o => o.opportunity_id === state.selectedOpportunityId), 
    [state.opportunities, state.selectedOpportunityId]
  );
  
  const selectedProfile = useMemo(() => 
    state.candidateProfiles.find(p => p.opportunity_id === state.selectedOpportunityId), 
    [state.candidateProfiles, state.selectedOpportunityId]
  );

  const selectedCommercialPosture = useMemo(() => 
    state.commercialPostures?.find(p => p.opportunity_id === state.selectedOpportunityId), 
    [state.commercialPostures, state.selectedOpportunityId]
  );

  const selectedCandidateStory = useMemo(() => 
    selectedOpportunity ? getOpportunityCandidateStory(state, selectedOpportunity.opportunity_id) : undefined, 
    [selectedOpportunity, state]
  );

  const selectedSensitiveSupport = useMemo(() => 
    selectedOpportunity ? getOpportunitySensitiveSupport(state, selectedOpportunity.opportunity_id) : undefined, 
    [selectedOpportunity, state]
  );

  const opportunityArtifacts = useMemo(() => 
    selectedOpportunity ? getOpportunityArtifacts(state, selectedOpportunity.opportunity_id) : [], 
    [selectedOpportunity, state]
  );
  
  const opportunityTasks = useMemo(() => 
    selectedOpportunity ? getOpportunityTasks(state, selectedOpportunity.opportunity_id) : [], 
    [selectedOpportunity, state]
  );
  
  const opportunityCheckpoints = useMemo(() => 
    selectedOpportunity ? getOpportunityCheckpoints(state, selectedOpportunity.opportunity_id) : [], 
    [selectedOpportunity, state]
  );
  
  const opportunityCorrespondence = useMemo(() => 
    selectedOpportunity ? getOpportunityCorrespondence(state, selectedOpportunity.opportunity_id) : [], 
    [selectedOpportunity, state]
  );

  const completionScore = useMemo(() => 
    selectedOpportunity ? getCompletionScore(state, selectedOpportunity.opportunity_id) : 0, 
    [selectedOpportunity, state]
  );

  const integrityReport = useMemo(() => validateAppStateIntegrity(state), [state]);
  const lastIntegrityRunAt = state.lastExportedAt || "";

  const value = {
    state,
    patchState,
    resetSeedState,
    currentPage,
    setCurrentPage,
    mobileTab,
    setMobileTab,
    notice,
    setNotice,
    selectedAccount,
    selectedUser,
    selectedOpportunity,
    selectedProfile,
    selectedCommercialPosture,
    selectedCandidateStory,
    selectedSensitiveSupport,
    opportunityArtifacts,
    opportunityTasks,
    opportunityCheckpoints,
    opportunityCorrespondence,
    completionScore,
    integrityReport,
    lastIntegrityRunAt
  }
  return <MonyawnContext.Provider value={value}>{children}</MonyawnContext.Provider>;
};

export const useMonyawn = () => {
  const context = useContext(MonyawnContext);
  if (!context) throw new Error("useMonyawn must be used within MonyawnProvider");
  return context;
};
