import React, { createContext, useContext, useMemo, useState, useEffect } from "react";
import { AppState, AppMode, Opportunity, Artifact, Correspondence, Task, Checkpoint, CandidateProfile } from "../types";
import { useMonyawnCore } from "../hooks/useMonyawnCore";
import { AppPage, Notice } from "./MonyawnContext.types";
import { 
  getOpportunityArtifacts, 
  getOpportunityTasks, 
  getOpportunityCheckpoints, 
  getOpportunityCorrespondence, 
  getOpportunitySensitiveSupport, 
  getOpportunityCandidateStory,
  getCompletionScore
} from "../workflow";

interface MonyawnContextType {
  state: AppState;
  patchState: (updater: (current: AppState) => AppState, actionLabel?: string) => void;
  resetSeedState: () => void;
  currentPage: AppPage;
  setCurrentPage: (page: AppPage) => void;
  notice: Notice;
  setNotice: (notice: Notice) => void;
  
  // Selection
  selectedAccount: any;
  selectedUser: any;
  selectedOpportunity: Opportunity | undefined;
  selectedProfile: CandidateProfile | undefined;
  
  // Filtered Lists
  opportunityArtifacts: Artifact[];
  opportunityTasks: Task[];
  opportunityCheckpoints: Checkpoint[];
  opportunityCorrespondence: Correspondence[];
  
  // Computed
  completionScore: number;
}

const MonyawnContext = createContext<MonyawnContextType | undefined>(undefined);

export const MonyawnProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { state, patchState, resetSeedState } = useMonyawnCore();
  const [currentPage, setCurrentPage] = useState<AppPage>("landing");
  const [notice, setNotice] = useState<Notice>(null);

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash;
      if (hash.includes("about")) setCurrentPage("about");
      else if (hash.includes("workspace")) setCurrentPage("workspace");
      else if (hash.includes("intake")) setCurrentPage("intake");
      else setCurrentPage("landing");
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

  const value = {
    state,
    patchState,
    resetSeedState,
    currentPage,
    setCurrentPage,
    notice,
    setNotice,
    selectedAccount,
    selectedUser,
    selectedOpportunity,
    selectedProfile,
    opportunityArtifacts,
    opportunityTasks,
    opportunityCheckpoints,
    opportunityCorrespondence,
    completionScore
  };

  return <MonyawnContext.Provider value={value}>{children}</MonyawnContext.Provider>;
};

export const useMonyawn = () => {
  const context = useContext(MonyawnContext);
  if (!context) throw new Error("useMonyawn must be used within MonyawnProvider");
  return context;
};
