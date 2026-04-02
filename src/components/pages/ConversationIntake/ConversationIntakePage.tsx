import { useEffect, useId, useMemo, useRef, useState } from "react";
import {
  ConversationStep,
  getAnswers,
  getCurrentStep,
  getProgress,
  getSnapshot,
  getStaleSteps,
  getTranscript,
  getVisibleSteps,
} from "../../../../packages/conversation-core/src";
import {
  ConversationAnswerCard,
  ConversationControlRenderer,
  ConversationEditModal,
  ConversationProgressPanel,
  ConversationPromptCard,
  ConversationTabs,
} from "../../../../packages/conversation-react/src";
import {
  buildConversationSeedState,
  deriveConversationState,
  intakeConversationEngine,
  intakeConversationSteps,
} from "../../../conversation/intakeConversation";
import {
  getConversationBridge,
  getConversationCompletionSummary,
  getConversationRecap,
  getReplayNarration,
} from "../../../conversation/narrator";
import { PageTemplate } from "../../templates/PageTemplate";
import {
  ConversationIntakeCompletePayload,
  ConversationIntakePageProps,
} from "./ConversationIntakePage.contract";

type ConversationTab = "data-entry" | "journey" | "snapshot";

function prettyTime(iso: string) {
  return new Date(iso).toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
}

function moduleProgress(steps: ConversationStep[], answeredIds: Set<string>) {
  const modules = Array.from(new Set(steps.map((step) => step.module)));
  return modules.map((module) => {
    const moduleSteps = steps.filter((step) => step.module === module);
    const complete = moduleSteps.filter((step) => answeredIds.has(step.id)).length;
    return {
      module,
      complete,
      total: moduleSteps.length,
    };
  });
}

export function ConversationIntakePage({
  accountDraft,
  userDraft,
  opportunityDraft,
  onBack,
  onCompleteConversation,
}: ConversationIntakePageProps) {
  const promptCardRef = useRef<HTMLElement>(null);
  const lastEditTriggerRef = useRef<HTMLElement | null>(null);
  const [activeTab, setActiveTab] = useState<ConversationTab>("data-entry");
  const [conversationState, setConversationState] = useState(() =>
    buildConversationSeedState(accountDraft, userDraft, opportunityDraft),
  );
  const [draftValue, setDraftValue] = useState<unknown>("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [editingStepId, setEditingStepId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState<unknown>("");
  const [editErrorMessage, setEditErrorMessage] = useState<string | null>(null);
  const promptId = useId();
  const promptDescriptionId = useId();
  const promptHelperId = useId();
  const promptErrorId = useId();
  const promptInputId = useId();
  const editControlId = useId();
  const editDescriptionId = useId();
  const editErrorId = useId();
  const currentPanelId = `conversation-tabpanel-${activeTab}`;
  const tabOptions: Array<{ id: ConversationTab; label: string }> = [
    { id: "data-entry", label: "Data Entry" },
    { id: "journey", label: "Journey" },
    { id: "snapshot", label: "Snapshot" },
  ];

  const visibleSteps = useMemo(
    () => getVisibleSteps(intakeConversationSteps, conversationState),
    [conversationState],
  );
  const currentStep = useMemo(
    () => getCurrentStep(intakeConversationSteps, conversationState),
    [conversationState],
  );
  const snapshot = useMemo(
    () => getSnapshot(intakeConversationSteps, conversationState),
    [conversationState],
  );
  const transcript = useMemo(
    () => getTranscript(intakeConversationSteps, conversationState),
    [conversationState],
  );
  const staleSteps = useMemo(
    () => getStaleSteps(intakeConversationSteps, conversationState),
    [conversationState],
  );
  const answers = useMemo(() => getAnswers(conversationState), [conversationState]);
  const progress = useMemo(() => getProgress(intakeConversationSteps, conversationState), [conversationState]);
  const derivedDrafts = useMemo(
    () => deriveConversationState(accountDraft, userDraft, opportunityDraft, answers),
    [accountDraft, answers, opportunityDraft, userDraft],
  );
  const answeredIds = useMemo(() => new Set(snapshot.map((item) => item.stepId)), [snapshot]);
  const progressByModule = useMemo(
    () => moduleProgress(visibleSteps, answeredIds),
    [answeredIds, visibleSteps],
  );
  const recapLine = useMemo(() => getConversationRecap(snapshot), [snapshot]);
  const currentIndex = currentStep
    ? visibleSteps.findIndex((step) => step.id === currentStep.id)
    : visibleSteps.length - 1;
  const previousStep = currentIndex > 0 ? visibleSteps[currentIndex - 1] : undefined;
  const nextStep = currentStep ? visibleSteps[currentIndex + 1] : undefined;
  const bridgeLine = useMemo(
    () => getConversationBridge(currentStep, previousStep, snapshot),
    [currentStep, previousStep, snapshot],
  );
  const completionSummary = useMemo(
    () => getConversationCompletionSummary(snapshot),
    [snapshot],
  );
  const replayNarration = useMemo(
    () => getReplayNarration(staleSteps.length),
    [staleSteps.length],
  );
  const editingStep = editingStepId
    ? visibleSteps.find((step) => step.id === editingStepId) ??
      intakeConversationSteps.find((step) => step.id === editingStepId)
    : undefined;

  useEffect(() => {
    if (!currentStep) {
      setDraftValue("");
      return;
    }

    const existingValue = conversationState.responses[currentStep.id]?.value ?? "";
    setDraftValue(existingValue);
    setErrorMessage(null);
  }, [conversationState.responses, currentStep]);

  useEffect(() => {
    if (!currentStep || editingStep) {
      return;
    }

    promptCardRef.current?.focus();
  }, [currentStep?.id, editingStep]);

  useEffect(() => {
    if (!editingStep) {
      setEditValue("");
      setEditErrorMessage(null);
      return;
    }

    setEditValue(conversationState.responses[editingStep.id]?.value ?? "");
    setEditErrorMessage(null);
  }, [conversationState.responses, editingStep]);

  useEffect(() => {
    if (!editingStep && lastEditTriggerRef.current) {
      lastEditTriggerRef.current.focus();
      lastEditTriggerRef.current = null;
    }
  }, [editingStep]);

  function submitStep(step: ConversationStep, value: unknown) {
    const validation = intakeConversationEngine.validateStep(step, value, conversationState);
    if (validation) {
      setErrorMessage(validation);
      return;
    }

    const nextState = intakeConversationEngine.applyResponse(
      intakeConversationSteps,
      conversationState,
      step.id,
      value,
    );
    setConversationState(nextState);
    setErrorMessage(null);
  }

  function handlePrimarySubmit() {
    if (!currentStep) {
      return;
    }

    submitStep(currentStep, draftValue);
  }

  function handleCompletion() {
    const payload: ConversationIntakeCompletePayload = {
      signal: {
        signalType: (answers.signalType as ConversationIntakeCompletePayload["signal"]["signalType"]) ?? "note",
        signalText: String(answers.signalText ?? ""),
        signalUrl: String(answers.signalUrl ?? ""),
      },
      accountDraft: derivedDrafts.accountDraft,
      userDraft: derivedDrafts.userDraft,
      opportunityDraft: derivedDrafts.opportunityDraft,
    };

    onCompleteConversation(payload);
  }

  function tryEditSave(step: ConversationStep, value: unknown) {
    const validation = intakeConversationEngine.validateStep(step, value, conversationState);
    if (validation) {
      setEditErrorMessage(validation);
      return;
    }

    submitStep(step, value);
    setEditingStepId(null);
    setEditErrorMessage(null);
  }

  return (
    <PageTemplate
      id="conversation-intake"
      className="min-h-[calc(100vh-72px)]"
      header={{
        kicker: "One lane only",
        title: "Talk it through. We build the play in the same window.",
        description:
          "No more bouncing through forms. The chat keeps the golden path tight, remembers the receipts, and lets you edit any answer without losing the trail.",
        actions: (
          <button
            type="button"
            onClick={onBack}
            className="bg-brand-surface border border-black/10 text-brand-ink px-6 py-3 rounded-full font-medium hover:bg-black/5 transition-all active:scale-95"
          >
            Back
          </button>
        ),
        panel: (
          <ConversationProgressPanel progress={progress} progressByModule={progressByModule} />
        ),
      }}
    >
      <div aria-live="polite" aria-atomic="true" className="sr-only">
        {currentStep
          ? `Current question: ${currentStep.label}. Step ${currentIndex + 1} of ${visibleSteps.length}.`
          : "Conversation complete. Ready to lock the play."}
        {staleSteps.length > 0
          ? ` ${staleSteps.length} answers need review after an edit.`
          : ""}
      </div>
      <section className="rounded-[2rem] border border-black/5 bg-white/55 shadow-brand-shadow overflow-hidden">
        <ConversationTabs
          activeTab={activeTab}
          options={tabOptions}
          onChange={setActiveTab}
          panelIdPrefix="conversation-tabpanel"
        />

        <div
          id={currentPanelId}
          role="tabpanel"
          aria-labelledby={`conversation-tabpanel-tab-${activeTab}`}
          className="p-4 sm:p-6 lg:p-8"
        >
          {activeTab === "data-entry" && (
            <div className="max-w-4xl mx-auto space-y-5">
              <section className="rounded-[1.6rem] border border-black/8 bg-white/75 px-5 py-4 shadow-sm">
                <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-brand-accent">What I heard</p>
                <p className="text-sm text-brand-ink mt-2 leading-relaxed">{recapLine}</p>
              </section>

              {snapshot.map((item) => (
                <ConversationAnswerCard
                  key={item.stepId}
                  module={item.module}
                  label={item.label}
                  summary={item.summary || "No answer yet."}
                  meta={`v${item.version} at ${prettyTime(item.updatedAt)}`}
                  status={item.version > 1 ? "Edited" : null}
                  onEdit={() => {
                    lastEditTriggerRef.current = document.activeElement as HTMLElement | null;
                    setEditingStepId(item.stepId);
                  }}
                />
              ))}

              {staleSteps.length > 0 && (
                <section
                  role="status"
                  aria-live="polite"
                  className="rounded-[1.8rem] border border-amber-300/60 bg-amber-50/80 px-5 py-5 shadow-sm"
                >
                  <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-amber-700">Replay queue</p>
                  <h3 className="text-lg font-bold text-brand-ink mt-2">A few answers need a fresh pass.</h3>
                  <p className="text-sm text-brand-muted mt-2 leading-relaxed">
                    You changed an earlier answer, so these steps were reopened to keep the trail honest.
                  </p>
                  {replayNarration && (
                    <p className="text-sm text-brand-ink mt-3 leading-relaxed">{replayNarration}</p>
                  )}
                  <div className="mt-4 flex flex-wrap gap-2">
                    {staleSteps.map((step) => (
                      <span
                        key={step.id}
                        className="rounded-full border border-amber-300 bg-white px-3 py-1.5 text-xs font-semibold text-amber-800"
                      >
                        {step.label}
                      </span>
                    ))}
                  </div>
                </section>
              )}

              {currentStep ? (
                <ConversationPromptCard
                  title={currentStep.prompt}
                  segue={bridgeLine}
                  helper={currentStep.helper}
                  position={currentIndex + 1}
                  total={visibleSteps.length}
                  titleId={promptId}
                  descriptionId={promptDescriptionId}
                  helperId={promptHelperId}
                  errorId={promptErrorId}
                  containerRef={promptCardRef}
                  control={
                    <ConversationControlRenderer
                      step={currentStep}
                      value={draftValue}
                      inputId={promptInputId}
                      labelledBy={promptId}
                      describedBy={[promptDescriptionId, currentStep.helper ? promptHelperId : undefined, errorMessage ? promptErrorId : undefined]
                        .filter(Boolean)
                        .join(" ")}
                      invalid={Boolean(errorMessage)}
                      autoFocus
                      onChange={(nextValue) => {
                        setDraftValue(nextValue);
                        if (currentStep.control === "choice") {
                          submitStep(currentStep, nextValue);
                        }
                      }}
                    />
                  }
                  errorMessage={errorMessage}
                  showSubmit={currentStep.control !== "choice"}
                  onSubmit={handlePrimarySubmit}
                  onSkip={currentStep.optional ? () => submitStep(currentStep, "") : undefined}
                  optional={currentStep.optional}
                />
              ) : (
                <article className="rounded-[2rem] border border-brand-accent/20 bg-[linear-gradient(180deg,rgba(255,255,255,0.98),rgba(208,231,221,0.26))] px-5 sm:px-6 lg:px-7 py-6 shadow-brand-shadow">
                  <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-brand-accent">Ready to lock</p>
                  <h2 className="text-2xl font-bold tracking-[-0.04em] text-brand-ink mt-2">
                    We’ve got enough to build the play.
                  </h2>
                  <p className="text-base text-brand-muted leading-relaxed mt-3">{completionSummary}</p>
                  <p className="text-sm text-brand-ink leading-relaxed mt-3">
                    The golden path is complete. If the snapshot still feels right, lock it and jump into the workspace.
                  </p>
                  <div className="mt-6 flex flex-wrap gap-3">
                    <button
                      type="button"
                      onClick={handleCompletion}
                      className="bg-brand-accent text-white px-6 py-3 rounded-full font-bold hover:bg-brand-accent-strong transition-all shadow-md active:scale-95"
                    >
                      Lock the play
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveTab("snapshot")}
                      className="bg-brand-surface border border-black/10 text-brand-ink px-5 py-3 rounded-full font-medium hover:bg-black/5 transition-all active:scale-95"
                    >
                      Review snapshot
                    </button>
                  </div>
                </article>
              )}
            </div>
          )}

          {activeTab === "journey" && (
            <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1.1fr)_minmax(320px,0.9fr)] gap-6">
              <section className="rounded-[1.8rem] border border-black/8 bg-white/75 px-5 py-6">
                <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-brand-accent">Where you came from</p>
                <h3 className="text-xl font-bold text-brand-ink mt-3">
                  {previousStep ? previousStep.label : "We just opened the conversation."}
                </h3>
                <p className="text-sm text-brand-muted mt-2 leading-relaxed">
                  {previousStep
                    ? previousStep.prompt
                    : "The trail starts with whatever proof you already have in your hand."}
                </p>
              </section>

              <section className="rounded-[1.8rem] border border-black/8 bg-white/75 px-5 py-6">
                <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-brand-accent">Where you are</p>
                <h3 className="text-xl font-bold text-brand-ink mt-3">
                  {currentStep ? currentStep.label : "Ready to launch"}
                </h3>
                <p className="text-sm text-brand-muted mt-2 leading-relaxed">
                  {currentStep ? currentStep.segue : "The conversation has enough to create the play and move into the cockpit."}
                </p>
              </section>

              <section className="rounded-[1.8rem] border border-black/8 bg-white/75 px-5 py-6 lg:col-span-2">
                <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-brand-accent">Where you’re going</p>
                <h3 className="text-xl font-bold text-brand-ink mt-3">
                  {nextStep ? nextStep.label : "Workspace takeover"}
                </h3>
                <p className="text-sm text-brand-muted mt-2 leading-relaxed">
                  {nextStep
                    ? nextStep.prompt
                    : "The next move is not another form. It’s the real workspace with the play already built."}
                </p>
              </section>

              <section className="rounded-[1.8rem] border border-black/8 bg-white/75 px-5 py-6 lg:col-span-2">
                <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-brand-accent">Module flow</p>
                <div className="mt-5 grid grid-cols-1 md:grid-cols-3 gap-4">
                  {progressByModule.map((item) => (
                    <article key={item.module} className="rounded-[1.5rem] border border-black/8 bg-brand-surface px-4 py-4">
                      <p className="text-sm font-semibold text-brand-ink">{item.module}</p>
                      <p className="text-xs text-brand-muted mt-2">
                        {item.complete} of {item.total} prompts locked
                      </p>
                      <div className="mt-3 h-2 rounded-full bg-black/5 overflow-hidden">
                        <div
                          className="h-full rounded-full bg-brand-accent"
                          style={{ width: `${item.total === 0 ? 0 : (item.complete / item.total) * 100}%` }}
                        />
                      </div>
                    </article>
                  ))}
                </div>
              </section>

              <section className="rounded-[1.8rem] border border-black/8 bg-white/75 px-5 py-6 lg:col-span-2">
                <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-brand-accent">Audit trail</p>
                <div className="mt-4 space-y-3">
                  {transcript.length === 0 ? (
                    <p className="text-sm text-brand-muted leading-relaxed">
                      The trail starts the second the first answer lands.
                    </p>
                  ) : (
                    transcript
                      .slice()
                      .reverse()
                      .map((item, index) => (
                        <div
                          key={`${item.kind}-${item.stepId}-${item.version}-${item.updatedAt}-${index}`}
                          className="rounded-[1.3rem] border border-black/8 bg-brand-surface px-4 py-4"
                        >
                          <div className="flex items-start justify-between gap-4">
                            <div>
                              <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-brand-muted">
                                {item.module}
                              </p>
                              <h4 className="text-sm font-semibold text-brand-ink mt-2">{item.label}</h4>
                              <p className="text-sm text-brand-muted mt-2 leading-relaxed">
                                {item.kind === "stale" ? `Old answer retired: ${item.summary}` : item.summary}
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-brand-muted">
                                v{item.version} at {prettyTime(item.updatedAt)}
                              </p>
                              <p
                                className={`text-[10px] font-bold uppercase tracking-[0.16em] mt-2 ${
                                  item.kind === "stale" ? "text-amber-700" : "text-brand-accent"
                                }`}
                              >
                                {item.kind === "stale" ? "Reopened" : "Saved"}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))
                  )}
                </div>
              </section>
            </div>
          )}

          {activeTab === "snapshot" && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <section className="rounded-[1.8rem] border border-black/8 bg-white/75 px-5 py-6">
                <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-brand-accent">Quick glance</p>
                <div className="mt-4 space-y-3">
                  {snapshot.map((item) => (
                    <div key={item.stepId} className="flex items-start justify-between gap-4 border-t border-black/8 pt-3">
                      <div>
                        <p className="text-xs font-bold uppercase tracking-[0.14em] text-brand-muted">{item.label}</p>
                        <p className="text-sm text-brand-ink mt-1 leading-relaxed">{item.summary || "Not answered yet"}</p>
                      </div>
                      <span className="text-[10px] font-bold uppercase tracking-[0.14em] text-brand-muted">{item.module}</span>
                    </div>
                  ))}
                </div>
              </section>

              <section className="rounded-[1.8rem] border border-black/8 bg-white/75 px-5 py-6">
                <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-brand-accent">Normalized state</p>
                <div className="mt-4 space-y-3">
                  {[
                    { label: "Base name", value: derivedDrafts.accountDraft.account_name || "Pending" },
                    {
                      label: "Base type",
                      value:
                        derivedDrafts.accountDraft.account_type === "enterprise"
                          ? "Crew / org"
                          : "Solo",
                    },
                    { label: "Full name", value: derivedDrafts.userDraft.full_name || "Pending" },
                    { label: "Email", value: derivedDrafts.userDraft.email || "Pending" },
                    { label: "Company", value: derivedDrafts.opportunityDraft.company_name || "Pending" },
                    { label: "Role", value: derivedDrafts.opportunityDraft.role_title || "Pending" },
                    {
                      label: "Deal type",
                      value: derivedDrafts.opportunityDraft.pathway === "1099" ? "Contract bag" : "Payroll job",
                    },
                    {
                      label: "Source",
                      value: derivedDrafts.opportunityDraft.opportunity_source || "Pending",
                    },
                    {
                      label: "Job link",
                      value: derivedDrafts.opportunityDraft.job_posting_url || "Pending",
                    },
                  ].map((item) => (
                    <div key={item.label} className="grid grid-cols-[120px_minmax(0,1fr)] gap-4 border-t border-black/8 pt-3">
                      <p className="text-xs font-bold uppercase tracking-[0.14em] text-brand-muted">{item.label}</p>
                      <p className="text-sm text-brand-ink leading-relaxed break-words">{item.value}</p>
                    </div>
                  ))}
                </div>
              </section>
            </div>
          )}
        </div>
      </section>

      {editingStep && (
        <ConversationEditModal
          title={editingStep.prompt}
          helper="Changing this answer reopens the steps after it so the trail stays honest."
          controlId={editControlId}
          descriptionId={editDescriptionId}
          errorId={editErrorId}
          control={
            <ConversationControlRenderer
              step={editingStep}
              value={editValue}
              inputId={editControlId}
              labelledBy={undefined}
              describedBy={[editDescriptionId, editErrorMessage ? editErrorId : undefined]
                .filter(Boolean)
                .join(" ")}
              invalid={Boolean(editErrorMessage)}
              autoFocus
              onChange={(nextValue) => {
                setEditValue(nextValue);
                setEditErrorMessage(null);
              }}
            />
          }
          errorMessage={editErrorMessage}
          onSave={() => tryEditSave(editingStep, editValue)}
          onClose={() => setEditingStepId(null)}
        />
      )}
    </PageTemplate>
  );
}
