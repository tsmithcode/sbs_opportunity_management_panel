import { AccountDraft, OpportunityDraft, UserDraft } from "../../../context/MonyawnContext.types";
import { SignalIntakePayload } from "../SignalIntake/SignalIntakePage.contract";

export interface ConversationIntakeCompletePayload {
  signal: SignalIntakePayload;
  accountDraft: AccountDraft;
  userDraft: UserDraft;
  opportunityDraft: OpportunityDraft;
}

export interface ConversationIntakePageProps {
  accountDraft: AccountDraft;
  userDraft: UserDraft;
  opportunityDraft: OpportunityDraft;
  onBack: () => void;
  onCompleteConversation: (payload: ConversationIntakeCompletePayload) => void;
}
