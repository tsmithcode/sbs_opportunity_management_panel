import { MonyawnProvider, useMonyawn } from "./context/MonyawnContext";
import { AppHeader } from "./components/layout/AppHeader/AppHeader";
import { MobileNavigation } from "./components/layout/MobileNavigation/MobileNavigation";
import { AboutPage } from "./components/pages/About/AboutPage";
import { WorkspacePage } from "./components/pages/Workspace/WorkspacePage";
import { LoginPage } from "./components/pages/Login/LoginPage";
import { StartPage } from "./components/pages/Start/StartPage";
import { ConversationIntakePage } from "./components/pages/ConversationIntake/ConversationIntakePage";
import { useEffect, useState } from "react";
import { 
  defaultAccountDraft,
  defaultUserDraft, 
  defaultOpportunityDraft,
  AppPage,
  AccountDraft,
  OpportunityDraft,
  UserDraft,
} from "./context/MonyawnContext.types";
import {
  AppMode,
} from "./types";
import { createSeedState } from "./seed";
import { SignalIntakePayload } from "./components/pages/SignalIntake/SignalIntakePage.contract";
import { commitMonyawnConversationResult, hydrateMonyawnConversationDrafts } from "../packages/conversation-adapters/src";

const modeLabels: Record<AppMode, string> = {
  user: "Hero mode",
  staff: "Crew ops",
  admin: "Boss room",
};


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
  const [, setPendingSignal] = useState<SignalIntakePayload | null>(null);

  const navigateToPage = (page: AppPage) => {
    window.location.hash = page;
    setCurrentPage(page);
  };

  const startNewSignalFlow = () => {
    setAccountDraft(defaultAccountDraft);
    setUserDraft(defaultUserDraft);
    setOpportunityDraft(defaultOpportunityDraft);
    setPendingSignal(null);
    navigateToPage("proof-drop");
  };

  const routeToStart = () => {
    navigateToPage("start");
  };

  const handleLoadMockData = () => {
    patchState(() => createSeedState(), "Mock data loaded.");
    setNotice({ tone: "success", message: "Mock bag loaded. Let’s go." });
    navigateToPage("workspace");
  };

  const handleConversationComplete = ({
    signal,
    accountDraft: nextAccountDraft,
    userDraft: nextUserDraft,
    opportunityDraft: nextOpportunityDraft,
  }: {
    signal: SignalIntakePayload;
    accountDraft: AccountDraft;
    userDraft: UserDraft;
    opportunityDraft: OpportunityDraft;
  }) => {
    const hydratedDrafts = hydrateMonyawnConversationDrafts({
      accountDraft: nextAccountDraft,
      userDraft: nextUserDraft,
      opportunityDraft: nextOpportunityDraft,
      signal,
    });

    setAccountDraft(hydratedDrafts.accountDraft);
    setUserDraft(hydratedDrafts.userDraft);
    setOpportunityDraft(hydratedDrafts.opportunityDraft);
    setPendingSignal(signal);
    const committed = commitMonyawnConversationResult({
      state,
      accountDraft: hydratedDrafts.accountDraft,
      userDraft: hydratedDrafts.userDraft,
      opportunityDraft: hydratedDrafts.opportunityDraft,
      signal,
    });

    if (!committed) {
      setNotice({
        tone: "info",
        message: "Add your name, company, and role before you lock the play.",
      });
      return;
    }

    patchState(() => committed.nextState, committed.patchLabel);
    setPendingSignal(null);
    setOpportunityDraft(defaultOpportunityDraft);
    setNotice({ tone: "success", message: committed.noticeMessage });
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
          onLoadMockData={import.meta.env.DEV ? handleLoadMockData : undefined}
        />
      )}

      {currentPage === "start" && (
        <StartPage
          onAddSignal={startNewSignalFlow}
          onOpenWorkspace={() => navigateToPage("workspace")}
          onOpenAbout={() => navigateToPage("about")}
        />
      )}

      {(currentPage === "proof-drop" || currentPage === "confirm" || currentPage === "setup-base") && (
        <ConversationIntakePage
          accountDraft={accountDraft}
          userDraft={userDraft}
          opportunityDraft={opportunityDraft}
          onBack={routeToStart}
          onCompleteConversation={handleConversationComplete}
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
