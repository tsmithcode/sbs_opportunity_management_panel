# Platform API Surface

## Purpose
Define the current first-class platform resources that Monyawn should treat as CRUD-capable operational records.

This is a platform-alignment document. It is not yet a transport-specific API contract.

## First-Class Resources
- `Account`
- `User`
- `Opportunity`
- `SourceArtifact`
- `CandidateProfile`
- `AICheckpoint`
- `WorkflowTask`
- `Escalation`
- `DecisionMemo`
- `ReportingSnapshot`
- `CorrespondenceItem`
- `CandidateStory`
- `CoachingModule`
- `GlossaryEntry`
- `IndustryLifecycleNote`
- `DocumentProcessGuide`
- `ExportPackageManifest`
- `SensitiveSupportProfile`
- `EnterpriseControlProfile`
- `RoleEntitlement`

## Expected Operations

| Resource | Core Operations | Notes |
|---|---|---|
| Account | create, read, update, list | enterprise and organization container |
| User | create, read, update, list | supports self-serve and sponsored models |
| Opportunity | create, read, update, list, close, reopen | primary lifecycle record |
| SourceArtifact | create, read, update, list, archive, version | document and evidence lifecycle |
| CandidateProfile | create, read, update | user-correctable structured profile |
| AICheckpoint | create, read, list | immutable or append-preferred operational record |
| WorkflowTask | create, read, update, list | queue and review orchestration |
| Escalation | create, read, update, list, resolve | controlled-domain routing |
| DecisionMemo | create, read, update, list, archive | high-signal decision artifact |
| ReportingSnapshot | create, read, list, export | reporting and operational analytics |
| CorrespondenceItem | create, read, update, list, archive | communication lifecycle control |
| CandidateStory | create, read, update, regenerate, export | know-thyself narrative artifact tied to lifecycle data |
| CoachingModule | create, read, update, list | stage-aware optional coaching content |
| GlossaryEntry | create, read, update, list | stage and industry term reference |
| IndustryLifecycleNote | create, read, update, list | current industry business lifecycle guidance |
| DocumentProcessGuide | create, read, update, list | document and process explanation by industry or stage |
| ExportPackageManifest | create, read, update, export | package versioning, JSON restore authority, and Markdown/PDF handoff integrity |
| SensitiveSupportProfile | create, read, update, export | opt-in local-only support profile for special circumstances |
| EnterpriseControlProfile | create, read, update, list | account-level local-only governance, buyer-readiness, and external-release posture |
| RoleEntitlement | create, read, update, list | role-based access matrix for workspace, staff, admin, export, and diligence controls |

## Operating Rule
The transport layer may vary, but these resources should remain the core platform contract unless a documented schema update says otherwise.

Where an interface or packaging choice conflicts with expert governance, the responsible expert owner should take precedence over convenience or ad hoc implementation preference.
