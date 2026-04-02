import { ConversationState } from "../../conversation-core/src";
import { CONVERSATION_SCHEMA_VERSION } from "./version";

export type ConversationStateEnvelope = {
  schemaVersion: string;
  state: ConversationState;
};

export type ConversationMigration = {
  fromVersion: string;
  toVersion: string;
  migrate: (input: ConversationStateEnvelope) => ConversationStateEnvelope;
};

const knownMigrations: ConversationMigration[] = [
  {
    fromVersion: "2026.04.01",
    toVersion: CONVERSATION_SCHEMA_VERSION,
    migrate: (input) => ({
      ...input,
      schemaVersion: CONVERSATION_SCHEMA_VERSION,
      state: {
        responses: input.state.responses,
        history: input.state.history ?? [],
        staleStepIds: input.state.staleStepIds ?? [],
      },
    }),
  },
];

export function migrateConversationState(
  envelope: ConversationStateEnvelope,
): ConversationStateEnvelope {
  if (envelope.schemaVersion === CONVERSATION_SCHEMA_VERSION) {
    return envelope;
  }

  const migration = knownMigrations.find(
    (candidate) => candidate.fromVersion === envelope.schemaVersion,
  );

  if (!migration) {
    return {
      schemaVersion: CONVERSATION_SCHEMA_VERSION,
      state: {
        responses: envelope.state.responses,
        history: envelope.state.history ?? [],
        staleStepIds: envelope.state.staleStepIds ?? [],
      },
    };
  }

  return migration.migrate(envelope);
}
