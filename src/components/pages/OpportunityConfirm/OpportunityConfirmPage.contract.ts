import { OpportunityDraft, UserDraft } from "../../../context/MonyawnContext.types";

export interface OpportunityConfirmPageProps {
  userDraft: UserDraft;
  opportunityDraft: OpportunityDraft;
  onUserDraftChange: (draft: UserDraft) => void;
  onOpportunityDraftChange: (draft: OpportunityDraft) => void;
  onBack: () => void;
  onOpenAdvanced: () => void;
  onConfirm: () => void;
}
