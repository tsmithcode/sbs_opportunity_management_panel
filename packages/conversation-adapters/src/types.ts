export type ConversationAdapterOutcome<TState, TDrafts> = {
  nextState: TState;
  drafts: TDrafts;
  noticeMessage: string;
  patchLabel: string;
  reopenedExisting: boolean;
};
