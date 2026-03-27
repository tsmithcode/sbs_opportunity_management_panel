# Data Capture Schema Template

## Purpose
Define the minimum structured records needed for onboarding, pipeline management, reporting, and AI determinations.

## Core Records

### Opportunity
- opportunity_id
- user_id
- company_name
- role_title
- source
- stage
- status
- created_at
- updated_at

### User Profile
- user_id
- full_name
- email
- region
- current_role
- target_role_family
- compensation_target
- accessibility_needs
- sponsorship_type

### Source Artifact
- artifact_id
- opportunity_id
- artifact_type
- source_name
- uploaded_at
- parsed_status
- reviewer_status

### AI Checkpoint
- checkpoint_id
- opportunity_id
- stage
- trigger
- decision
- confidence
- evidence_summary
- escalation_required
- approver
- completed_at

### Stage Event
- event_id
- opportunity_id
- stage
- event_type
- actor_type
- actor_id
- timestamp
- notes

### Reporting Snapshot
- snapshot_id
- period_start
- period_end
- active_opportunities
- intake_completion_rate
- fit_review_completion_rate
- approval_rate
- escalation_rate
- trust_score

## Data Rules
- Every opportunity must have a stage and status
- Every AI determination must reference evidence
- Every external-facing artifact must support human review status
- Every escalation must have an owner and timestamp
