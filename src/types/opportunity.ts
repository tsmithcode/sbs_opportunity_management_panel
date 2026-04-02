import { OpportunityPathway, OpportunityStage, OpportunityStatus } from "./common";

export type Opportunity = {
  opportunity_id: string;
  account_id: string;
  user_id: string;
  use_case_id: string;
  pathway: OpportunityPathway;
  company_name: string;
  role_title: string;
  opportunity_source: string;
  job_posting_url: string;
  employment_type: string;
  location_type: string;
  current_stage: OpportunityStage;
  status: OpportunityStatus;
  created_at: string;
  updated_at: string;
};
