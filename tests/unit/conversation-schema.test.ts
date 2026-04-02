import { describe, expect, it } from "vitest";
import { createConversationState } from "../../packages/conversation-core/src";
import {
  CONVERSATION_SCHEMA_VERSION,
  getConversationSchemaMeta,
  migrateConversationState,
} from "../../packages/conversation-schema/src";

describe("conversation schema", () => {
  it("exposes stable schema metadata", () => {
    expect(getConversationSchemaMeta().version).toBe(CONVERSATION_SCHEMA_VERSION);
    expect(getConversationSchemaMeta().family).toBe("conversation-intake");
  });

  it("migrates older envelopes into the current state shape", () => {
    const migrated = migrateConversationState({
      schemaVersion: "2026.04.01",
      state: createConversationState({
        signalType: {
          value: "job_text",
          updatedAt: "2026-04-02T10:00:00.000Z",
          version: 1,
        },
      }),
    });

    expect(migrated.schemaVersion).toBe(CONVERSATION_SCHEMA_VERSION);
    expect(migrated.state.history).toEqual([]);
    expect(migrated.state.staleStepIds).toEqual([]);
  });
});
