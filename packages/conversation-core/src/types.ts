export type ConversationControlType =
  | "text"
  | "textarea"
  | "email"
  | "url"
  | "choice"
  | "select"
  | "toggle";

export type ConversationChoiceOption = {
  value: string;
  label: string;
  hint?: string;
};

export type ConversationResponse = {
  value: unknown;
  updatedAt: string;
  version: number;
};

export type ConversationHistoryEntry =
  | {
      kind: "answer";
      stepId: string;
      value: unknown;
      updatedAt: string;
      version: number;
    }
  | {
      kind: "stale";
      stepId: string;
      invalidatedByStepId: string;
      previousValue: unknown;
      updatedAt: string;
      version: number;
    };

export type ConversationState = {
  responses: Record<string, ConversationResponse>;
  history: ConversationHistoryEntry[];
  staleStepIds: string[];
};

export type ConversationStep = {
  id: string;
  module: string;
  label: string;
  segue: string;
  prompt: string;
  helper?: string;
  placeholder?: string;
  control: ConversationControlType;
  optional?: boolean;
  options?: ConversationChoiceOption[];
  isVisible?: (answers: Record<string, unknown>) => boolean;
  validate?: (value: unknown, answers: Record<string, unknown>) => string | null;
  summarize?: (value: unknown, answers: Record<string, unknown>) => string;
};

export type ConversationSnapshotItem = {
  stepId: string;
  module: string;
  label: string;
  summary: string;
  updatedAt: string;
  version: number;
};

export type ConversationTranscriptItem = {
  kind: "answer" | "stale";
  stepId: string;
  module: string;
  label: string;
  summary: string;
  updatedAt: string;
  version: number;
  invalidatedByStepId?: string;
};
