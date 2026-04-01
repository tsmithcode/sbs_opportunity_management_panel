import { MonyawnProvider, useMonyawn } from "./context/MonyawnContext";
import { AppHeader } from "./components/layout/AppHeader/AppHeader";
import { MobileNavigation } from "./components/layout/MobileNavigation/MobileNavigation";
import { LandingPage } from "./components/pages/Landing/LandingPage";
import { AboutPage } from "./components/pages/About/AboutPage";
import { IntakeFlow } from "./components/flows/IntakeFlow/IntakeFlow";
import { WorkspacePage } from "./components/pages/Workspace/WorkspacePage";
import { useState, useEffect } from "react";
import { 
  defaultAccountDraft, 
  defaultUserDraft, 
  defaultOpportunityDraft 
} from "./context/MonyawnContext.types";
import { useAdminOps } from "./hooks/useAdminOps";
import { useOpportunityOps } from "./hooks/useOpportunityOps";
import { AppMode } from "./types";

const modeLabels: Record<AppMode, string> = {
  user: "Guided workspace",
  staff: "Staff operations",
  admin: "Admin and governance",
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

  const { handleAccountSubmit, handleUserSubmit } = useAdminOps();
  const { handleOpportunitySubmit } = useOpportunityOps();

  const onAccountSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleAccountSubmit(accountDraft);
    setAccountDraft(defaultAccountDraft);
  };

  const onUserSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleUserSubmit(userDraft);
    setUserDraft(defaultUserDraft);
  };

  const onOpportunitySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleOpportunitySubmit(opportunityDraft);
    setOpportunityDraft(defaultOpportunityDraft);
  };

  return (
    <div className="app-shell">
      <AppHeader
        currentPage={currentPage}
        currentMode={state.currentMode}
        modeLabel={modeLabels[state.currentMode]}
        lastExportedAt={state.lastExportedAt}
        navigateToPage={setCurrentPage}
        onModeChange={(mode: AppMode) => patchState(s => ({ ...s, currentMode: mode }), `Mode switched to ${mode}.`)}
        opportunities={state.opportunities.map(o => ({ id: o.opportunity_id, name: `${o.company_name} - ${o.role_title}` }))}
        selectedOpportunityId={state.selectedOpportunityId}
        onOpportunitySelect={(id) => patchState(s => ({ ...s, selectedOpportunityId: id }), "Opportunity switched.")}
      />
      
      {windowWidth <= 768 && (
        <MobileNavigation
          activeTab={mobileTab}
          onTabChange={(tab) => {
            setMobileTab(tab);
            if (tab === "admin") patchState(c => ({ ...c, currentMode: "admin" }));
            else patchState(c => ({ ...c, currentMode: "user" }));
          }}
        />
      )}

      {currentPage === "landing" && (
        <LandingPage
          onStartPursuit={() => setCurrentPage("intake")}
          onOpenAbout={() => setCurrentPage("about")}
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
          onComplete={() => setCurrentPage("workspace")}
          onCancel={() => setCurrentPage("landing")}
        />
      )}

      {currentPage === "workspace" && <WorkspacePage />}

      {currentPage === "about" && (
        <AboutPage
          navigateToPage={setCurrentPage}
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
