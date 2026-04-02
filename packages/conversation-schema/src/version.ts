export const CONVERSATION_SCHEMA_VERSION = "2026.04.02";

export type ConversationSchemaMeta = {
  version: string;
  family: string;
};

export function getConversationSchemaMeta(): ConversationSchemaMeta {
  return {
    version: CONVERSATION_SCHEMA_VERSION,
    family: "conversation-intake",
  };
}
