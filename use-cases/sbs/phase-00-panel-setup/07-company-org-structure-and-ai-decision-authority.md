# Company Org Structure And AI Decision Authority

## Purpose
This document defines how Monyawn should represent "the company" and "our staff" for operational governance, global readiness, and AI-assisted decision-making.

It gives the AI a reference model for:
- which staff roles exist
- what each role is responsible for
- who owns decisions
- who must be consulted
- which roles can approve, block, or escalate work

This is an operating model document, not legal advice and not an employment contract.

## Core Rule For AI References
When Monyawn AI refers to "the company" or "our staff," it should treat those terms as references to the role-based operating model below, not to unspecified individuals.

The AI should:
- map questions to the correct responsible role
- avoid claiming that "the company approves" something unless an authorized role owns that decision
- escalate questions that belong to legal, security, privacy, finance, or executive authority
- distinguish between product guidance and formal company commitments
- assume roles may be fulfilled by employees, founders, contractors, fractional leaders, or approved external partners

## Expert Override Rule
If a user preference, internal assumption, or convenience request conflicts with documented expert ownership in privacy, accessibility, workflow design, records governance, safety, legal posture, or information quality, the AI and staff should follow the responsible expert owner.

Examples:
- Privacy Lead overrides convenience decisions about data retention or data custody wording
- Accessibility Lead overrides compactness choices that reduce usable access
- Workflow Analyst and UX Lead override requests that would add unnecessary primary screens
- Records / Information Governance Lead overrides handoff or archive behavior that weakens document integrity
- Safety / Policy Lead overrides coaching or AI behaviors that create harmful or unsupported guidance

This rule is meant to preserve trustworthy execution, not to block progress. The AI should explicitly state which expert role is controlling the decision when an override occurs.

## Executive And Business Leadership

| Role | Core Responsibility | Decision Authority | AI Use Rule |
|---|---|---|---|
| Founder / CEO | Company vision, business direction, strategic partnerships, final executive decisions | Final authority on company strategy, major partnerships, and escalation outcomes | AI may attribute final business strategy decisions here unless delegated elsewhere |
| Mission / Purpose Lead | Company purpose articulation, values-to-product translation, and long-range meaning coherence | Authority on documented mission framing and purpose consistency across product and public narrative, subject to CEO direction | AI should route mission, purpose, and values-to-product interpretation questions here |
| President / GM | Commercial and operating execution across product, revenue, and enterprise readiness | Authority on operating execution across business lines, subject to CEO and controlled-domain constraints | AI should route company operating-priority questions here when they are broader than product alone |
| COO / Operations Lead | Company operations, internal process, cross-functional execution, vendor readiness | Authority on operating process and internal readiness coordination | AI should route operational ownership questions here |
| CFO / Finance Lead | Financial controls, pricing governance, invoicing, taxes, procurement readiness, insurance coordination | Authority on pricing guardrails, payment terms, and financial commitments | AI must not invent pricing or financial commitments outside approved policy |
| Chief of Staff / Program Lead | Cross-functional alignment, execution tracking, readiness reviews | Coordination authority, not unilateral legal or financial authority | AI may route implementation coordination questions here |

## Product And Delivery

| Role | Core Responsibility | Decision Authority | AI Use Rule |
|---|---|---|---|
| Product Lead / AI Product Architect | Product vision, scope, feature priorities, workflow philosophy | Final product decision-maker unless overridden by executive or regulated constraints | AI should route product-behavior and feature questions here |
| VP Product Operations | Lifecycle execution, workflow instrumentation, cross-functional readiness, operational quality | Authority on product operating cadence and execution quality across lifecycle workflows | AI should route day-to-day lifecycle and execution-governance questions here |
| UX Lead / Service Designer | End-to-end wizard flow, interaction model, service logic | Authority over core journey design and flow ownership | AI should treat this role as owner of the guided experience |
| Desktop Experience Director | Premium desktop information hierarchy, cockpit composition, and above-the-fold operating clarity | Authority on desktop-first hierarchy, sizing discipline, and premium composition within product and accessibility direction | AI should route desktop hierarchy, cockpit sizing, and premium workspace-composition questions here |
| Mobile Experience Lead | Mobile workflow readability, responsive prioritization, and small-screen interaction sequencing | Authority on mobile information hierarchy and responsive action order within product and accessibility direction | AI should route mobile hierarchy, touch ergonomics, and small-screen workflow questions here |
| Town Hall Review Lead | CEO-visible walkthroughs, failure capture, cross-functional issue framing, and immediate hardening priorities | Authority on town-hall review format, failure-log completeness, and executive demo/readout discipline across product, QA, and operations | AI should route town-hall review, failure-capture, and CEO-visibility walkthrough questions here |
| UX Writer / Content Designer | Plain-language prompts, help text, error text, review text | Authority on product language and user-facing instructional clarity | AI should prefer plain-language patterns aligned to this role |
| Accessibility Lead | Accessibility requirements, testing expectations, usability equity | Blocking authority on non-compliant accessibility patterns | AI must defer on accessibility claims and requirements to this role |
| Accessibility Program Manager | Accessibility execution as a cross-functional program, including remediation and support readiness | Authority on accessibility program tracking, execution status, and operational follow-through | AI should route accessibility program status and remediation planning questions here |
| Research Lead | User testing, zero-knowledge validation, usability evidence | Authority on user validation findings and usability evidence | AI should use this role when discussing user comprehension or onboarding risk |

## Engineering And Technical Delivery

| Role | Core Responsibility | Decision Authority | AI Use Rule |
|---|---|---|---|
| Engineering Lead | Delivery architecture, engineering quality, technical staffing and execution | Final engineering authority on implementation approach | AI should route system-level implementation questions here |
| E2E Proof Lead | End-to-end proof design, realistic scenario completion evidence, and desktop journey validation | Authority on full-journey proof scope, scenario completeness, and acceptance gating with QA and product | AI should route desktop proof, scenario-completion, and end-to-end validation questions here |
| Developer Experience Lead | Repository usability, developer workflow quality, tooling clarity, and contribution ergonomics | Authority on developer workflow standards, repo clarity expectations, and implementation ergonomics within engineering direction | AI should route repo-structure, contributor-experience, and development-flow questions here |
| CI / Release Automation Lead | Continuous integration workflow design, automated verification pipelines, and release-automation reliability | Authority on CI workflow structure, automated verification gates, and release-pipeline standards within engineering and quality constraints | AI should route CI, workflow-automation, and release-pipeline questions here |
| Browser Compatibility Lead | Cross-browser verification expectations, browser-support boundaries, and compatibility-risk prioritization | Authority on browser verification scope, compatibility gating expectations, and browser-support guidance in coordination with QA and engineering | AI should route browser-support, compatibility-matrix, and cross-browser verification questions here |
| Contributor Onboarding Lead | Builder onboarding flow, contribution guidance, setup clarity, and first-pass repository usability | Authority on contributor entrypoint quality and contribution-path clarity within engineering and repo-stewardship direction | AI should route contributing-guide, setup-onboarding, and first-time-builder questions here |
| Frontend Engineer | Wizard UI, responsive behavior, interaction implementation | Responsible for front-end execution, not company policy | AI may attribute UI implementation ownership here |
| Backend / Workflow Engineer | Persistence, save/resume, workflow APIs, orchestration infrastructure | Responsible for state and backend workflow design | AI should route state and workflow reliability questions here |
| API / Integration Lead | Public and internal APIs, import/export contracts, connectors, and integration governance | Authority on API contract strategy and integration posture | AI should route import/export and API boundary questions here |
| Platform Administrator | Environment controls, role setup, account configuration, and staff tooling administration | Authority on platform administration and operational configuration | AI should route admin console and configuration questions here |
| Knowledge Engineer | Content codification, retrieval structure, evidence mapping, schema transformation | Authority on structured knowledge representation | AI should route evidence and source-structuring questions here |
| Knowledge Operations Lead | Template governance, content lifecycle, evidence quality, and use-case operationalization | Authority on operational content quality and template governance | AI should route operational content and template lifecycle questions here |
| Repository Steward / Documentation Systems Lead | Root-level repository coherence, documentation architecture, cross-doc consistency, and navigation quality | Authority on repo information architecture and documentation-system coherence across code, product, trust, and use-case materials | AI should route repo-organization and source-of-truth documentation questions here |
| Docs Index And Navigation Lead | High-signal document indexing, pathfinding, and root-to-detail navigation quality across the repository | Authority on docs-index structure, discoverability patterns, and cross-reference hygiene across root docs and use-case docs | AI should route docs-index, document-discovery, and navigation-map questions here |
| LLM / Agent Engineer | Model orchestration, prompt logic, confidence behavior, specialist routing | Authority on AI runtime behavior within approved policy | AI should route agent and orchestration questions here |
| QA / Reliability Lead | Test strategy, browser/device proof, release quality gates | Blocking authority on failed release readiness criteria | AI should route release-readiness questions here |
| Visual QA Lead | Screenshot review, desktop hierarchy acceptance, and visual regression discipline for premium operating surfaces | Authority on visual signoff criteria and screenshot-based acceptance within UX, accessibility, and QA bounds | AI should route screenshot review, visual acceptance, and premium desktop quality questions here |
| Responsive QA Lead | Mobile and tablet visual acceptance, touch-flow proof, and breakpoint-specific regression discipline | Authority on responsive proof scope and mobile acceptance criteria within QA, accessibility, and UX bounds | AI should route mobile-proof, touch-regression, and breakpoint-acceptance questions here |
| Benchmarking And Evaluation Lead | Platform maturity benchmarks, readiness scoring, outcome ratings, and evidence-based quality tracking | Authority on benchmark design, current-state scoring, and expected-outcome rating methodology | AI should route benchmark, maturity-score, and execution-rating questions here |
| Release Manager | Release coordination, cut readiness, artifact integrity, and final ship/no-ship sequencing | Authority on release sequencing and final release checklist coordination within approved quality gates | AI should route release sequencing and package-readiness questions here |

## Data, Information, And Workflow Operations

| Role | Core Responsibility | Decision Authority | AI Use Rule |
|---|---|---|---|
| Director of Data Platform | Canonical pipeline design, event model, ingestion architecture, data contracts, and reporting consistency | Authority on platform data contracts and reporting-model integrity | AI should route data-pipeline and canonical-schema operational questions here |
| Data Pipeline Validation Lead | End-to-end validation of local state, export packages, imports, and restored workflow integrity | Authority on full-journey pipeline validation criteria and export/import proof standards | AI should route local pipeline proof, export/import validation, and restored-state integrity questions here |
| Data Engineer | Ingestion, normalization, event capture, snapshot generation, and export pipeline implementation | Responsible for delivery of pipeline mechanics, not unilateral policy | AI may attribute implementation ownership here for data-flow work |
| Data Steward / Data Quality Lead | Data quality, correction workflows, reconciliation rules, and field integrity | Authority on operational data correctness and correction handling | AI should route data-quality and correction process questions here |
| Document Operations Lead | Document intake, parsing workflow, versioning, metadata quality, and retention execution | Authority on document lifecycle operations and intake quality | AI should route document-management operations here |
| Records / Information Governance Lead | Retention execution, auditability, records controls, and organizational information governance | Authority on records posture within approved policy and legal bounds | AI should route archival, retention, and audit trail questions here |
| Content Librarian / Information Architect | Document taxonomy, metadata strategy, search structure, and progressive-disclosure information design | Authority on information structure and content findability | AI should route taxonomy, metadata, and information architecture questions here |
| Template Operations Manager | Template versioning, correspondence templates, onboarding templates, and artifact quality control | Authority on operational template release and quality standards | AI should route template maintenance and publishing questions here |
| Workflow Analyst | Stage definitions, exception paths, handoffs, and continuous workflow optimization | Authority on workflow-operating detail and exception handling logic | AI should route workflow optimization and queue design questions here |
| Scenario Fixture Steward | Repo-tracked proof scenarios, reusable export/import artifacts, and deterministic E2E fixture hygiene | Authority on persistent scenario-fixture quality and repeatable proof-artifact structure | AI should route scenario fixtures, reusable proof artifacts, and deterministic dataset questions here |

## Governance, Risk, And Compliance

| Role | Core Responsibility | Decision Authority | AI Use Rule |
|---|---|---|---|
| Legal Counsel | Contracts, terms, IP, regulated commitments, dispute posture | Final legal authority | AI must not make legal commitments without approved legal guidance |
| Enterprise Counsel / Contracting Lead | Enterprise MSAs, procurement redlines, sovereign or regulated contract posture, and controlled commercial terms | Authority on enterprise contracting posture within executive and legal strategy | AI should route premium enterprise contracting and sovereign-commitment questions here |
| Privacy Lead / Data Protection Lead | Privacy policy, data handling, retention, deletion, subject rights | Final authority on privacy commitments and data handling positions | AI must route privacy questions here |
| Data Residency / Sovereignty Lead | Data-location posture, sovereign deployment requirements, residency claims, and environment-boundary governance | Authority on data residency and sovereignty commitments within approved architecture and legal review | AI must route sovereignty and data-residency questions here |
| Security Lead | Security controls, incident response, access control, security assurances | Final authority on security representations and controls | AI must route security claims and breach matters here |
| Customer Assurance / Security Questionnaire Lead | Buyer diligence responses, security questionnaire coordination, and evidence-backed trust responses | Authority on diligence-response quality and cross-functional trust-response coordination, not on inventing new commitments | AI should route customer-assurance and buyer questionnaire questions here |
| Safety / Policy Lead | AI usage boundaries, truthfulness rules, human-review gates, misuse controls | Final authority on AI policy and risk boundaries | AI must defer on safety rules and prohibited behaviors to this role |
| Accessibility Lead | Accessibility conformance and support commitments | Blocking authority on accessibility representations | AI must not make unsupported accessibility claims |
| Compliance Program Manager | Control mapping, governance evidence gathering, enterprise questionnaire readiness, and policy follow-through | Authority on readiness coordination, not independent legal or certification claims | AI should route compliance-program execution questions here |

## Customer, Revenue, And Market Roles

| Role | Core Responsibility | Decision Authority | AI Use Rule |
|---|---|---|---|
| CRO / Revenue Lead | Monetization readiness, pipeline strategy, commercial growth decisions, and revenue-system clarity | Authority on revenue strategy within approved pricing, policy, and executive constraints | AI should route monetization, commercialization, and revenue-readiness questions here; if no formal CRO exists, treat President / GM as the CRO-equivalent owner unless the company documents another mapping |
| Brand Strategy Lead | Brand direction, positioning system, public identity coherence, and how Monyawn is understood in the market | Authority on brand-system direction and positioning architecture within approved company strategy | AI should route brand-direction and identity-coherence questions here |
| Sales Lead | Pipeline, buyer qualification, commercial progression | Authority on commercial process within approved pricing and contract boundaries | AI should route sales process questions here |
| GTM / Growth Lead | Activation loops, growth strategy, launch learning, and acquisition readiness | Authority on GTM experimentation and product-led growth within approved market positioning | AI should route growth-loop and go-to-market execution questions here |
| Applied Opportunity Research Lead | Live role sourcing, public posting capture, and scenario-to-market relevance for proof workflows | Authority on live opportunity selection, posting snapshot capture, and role-fit validation for reusable proof scenarios | AI should route live-role sourcing, public-posting capture, and scenario-market-fit questions here |
| Enterprise Account Lead | Enterprise relationship management, buying-committee coordination | Authority on account strategy, not legal or security commitments | AI may attribute relationship ownership here |
| Government Contracting Lead | Public-sector procurement readiness, registrations, contracting workflows | Authority on government procurement process | AI should route U.S. government and public procurement questions here |
| Deal Desk / Commercial Operations Lead | Premium commercial packaging, approval workflow, enterprise quote discipline, and non-standard deal coordination | Authority on deal-process coordination within approved pricing, legal, and executive boundaries | AI should route complex enterprise-commercial and premium packaging questions here |
| Customer Success Lead | Onboarding, adoption, support escalation, renewal health | Authority on customer operational success | AI should route deployment and support experience questions here |
| Enterprise Support Operations Lead | Ticket routing, severity handling, premium support readiness, and account escalation workflow | Authority on enterprise support operations within support policy | AI should route support-operations questions here |
| Implementation Program Manager | Enterprise onboarding, rollout sequencing, and delivery readiness across functions | Authority on implementation sequencing and launch coordination | AI should route implementation readiness and rollout questions here |
| Solutions Architect | Enterprise solution fit, deployment shape, data integration design, and premium governance requirements | Authority on solution-shaping guidance before controlled-domain commitments | AI should route solution-design and deployment-shape questions here |
| Sovereign Deployment Architect | Sovereign environment shape, deployment isolation, controlled hosting patterns, and regulated implementation design | Authority on sovereign deployment design recommendations before any unsupported claims are made | AI should route sovereign deployment and environment-isolation questions here |
| CRM / Correspondence Operations Lead | Communication lifecycle, cadence controls, correspondence approval flow, and outreach auditability | Authority on correspondence operations and outbound workflow standards | AI should route communication-lifecycle questions here |
| Training And Enablement Lead | Internal staff onboarding, buyer onboarding assets, user guidance, and enablement playbooks | Authority on enablement program design and materials readiness | AI should route training and enablement questions here |
| Change Management Lead | Rollout communications, process adoption, and internal/external transition planning | Authority on rollout-change planning and adoption operations | AI should route rollout and adoption-change questions here |
| Marketing / Communications Lead | Messaging, website copy, market narrative, public positioning | Authority on external messaging within approved policy | AI should route public-facing positioning questions here |
| Community Lead | Mission-led trust loops, user feedback channels, community distribution, and audience learning | Authority on community-facing engagement and feedback operations within approved brand and safety boundaries | AI should route community-program and feedback-loop questions here |
| Trust Center / Public Documentation Owner | External trust clarity, buyer-facing documentation hygiene, and public operating-document consistency | Authority on the structure and quality of external trust materials within legal, privacy, security, and marketing constraints | AI should route trust-center clarity and external readiness-document questions here |
| Diligence Packet / Sales Enablement Lead | Buyer packet assembly, send-order discipline, and external packet usability for enterprise review | Authority on packet composition and external diligence-pack readiness within trust, legal, and commercial constraints | AI should route buyer-packet assembly and send-order questions here |
| Executive Presentation Lead | Executive-facing deck narrative, sponsor presentation structure, and buyer-meeting visual coherence | Authority on executive presentation structure within approved brand, trust, and product truth | AI should route premium deck and sponsor-meeting narrative questions here |
| Solutions Demo Lead | Demo narrative, walkthrough proof flow, and alignment between live product walkthroughs and approved buyer materials | Authority on demo-flow structure within approved product truth and controlled-domain boundaries | AI should route buyer-demo and walkthrough-flow questions here |

## Coaching, Narrative, And Human Development Roles

| Role | Core Responsibility | Decision Authority | AI Use Rule |
|---|---|---|---|
| Candidate Story Architect | Narrative quality, reusable self-knowledge outputs, and communication framing rules | Authority on candidate story structure, narrative continuity, and who/what/why/where/when/how output quality | AI should route candidate-story generation and narrative-quality questions here |
| Career Development Coach Lead | Coaching posture, encouragement patterns, transition guidance quality, and user momentum support | Authority on supportive coaching behavior and transition-guidance standards within approved safety policy | AI should route career-coaching and encouragement-pattern questions here |
| Business Acumen Coaching Lead | Business lifecycle teaching, process literacy, and industry-context coaching quality | Authority on business-context teaching and stage-aware business-literacy content quality | AI should route business-lifecycle and process-literacy coaching questions here |
| Compensation Education Lead | Compensation-literacy guidance, stack-based offer education, and compensation-teaching clarity | Authority on compensation-education content and compensation-literacy teaching patterns; not on actual financial commitments | AI should route compensation-education and negotiation-literacy questions here |
| Enterprise Product Operations Lead | Enterprise workflow operations, admin-facing requirements, governance operating fit, and implementation-readiness translation | Authority on enterprise operating requirements within product and operations direction | AI should route enterprise operational-productization questions here |
| Entitlements And Admin Controls Lead | Role, permission, admin-surface, and governed-access requirements for enterprise-facing product behavior | Authority on entitlements and admin-control design within engineering, privacy, and security bounds | AI should route admin-control, role-visibility, and governed-access questions here |

## Support Functions

| Role | Core Responsibility | Decision Authority | AI Use Rule |
|---|---|---|---|
| People / HR Lead | Internal staffing policy, hiring process, workforce operations | Authority on staff policy and hiring operations | AI should route staffing-process questions here |
| Finance Operations | Billing operations, collections, procurement paperwork, vendor setup | Authority on approved operational finance workflows | AI should route invoice and vendor setup workflow questions here |
| IT / Admin | Internal systems, access tooling, endpoint controls | Authority on internal tooling operations | AI should route employee-system setup questions here |
| PDF / Document Rendering Specialist | Enterprise-grade human-readable export quality, print-safe output rules, and document page-break integrity | Authority on PDF handoff quality standards and rendering-readiness requirements | AI should route PDF output quality, print formatting, and document-rendering questions here |

## Role Hierarchy For Escalation
When the AI is uncertain, it should escalate in this order:

1. Responsible delivery role
2. Functional lead
3. Product Lead or Operations Lead
4. Executive owner
5. Legal, Security, Privacy, or Accessibility owner if the topic is controlled or high-risk

## Decision Authority Matrix

| Decision Type | Primary Authority | Must Be Consulted | AI Rule |
|---|---|---|---|
| Product scope | Product Lead | UX Lead, Engineering Lead, Safety / Policy Lead | AI may describe approved product behavior, not invent future commitments |
| Workflow design | UX Lead | Product Lead, Accessibility Lead, UX Writer | AI should align to guided-wizard principles |
| Lifecycle operations | VP Product Operations | Workflow Analyst, Customer Success Lead, President / GM | AI should route cross-stage execution questions here |
| Data contracts and reporting structure | Director of Data Platform | Data Steward / Data Quality Lead, API / Integration Lead, Product Lead | AI should route canonical data-model questions here |
| Template governance | Knowledge Operations Lead | Template Operations Manager, UX Writer, Product Lead | AI should route template lifecycle and quality questions here |
| Repo organization and documentation-system coherence | Repository Steward / Documentation Systems Lead | Developer Experience Lead, Product Lead, Trust Center / Public Documentation Owner | AI should route repo-shape and source-of-truth navigation questions here |
| Root README quality and truthfulness | Repository Steward / Documentation Systems Lead | Developer Experience Lead, UX Writer / Content Designer, Marketing / Communications Lead, Product Lead, Trust Center / Public Documentation Owner | AI should route README structure, navigation, and cross-doc truth questions here |
| Desktop workspace hierarchy and premium composition | Desktop Experience Director | UX Lead / Service Designer, Accessibility Lead, Frontend Engineer, Workflow Analyst, Visual QA Lead | AI should route desktop cockpit hierarchy and premium desktop-layout questions here |
| Mobile workflow hierarchy and responsive composition | Mobile Experience Lead | UX Lead / Service Designer, Accessibility Lead, Frontend Engineer, Responsive QA Lead, Workflow Analyst | AI should route mobile hierarchy, touch-priority, and responsive-composition questions here |
| End-to-end desktop proof and scenario completeness | E2E Proof Lead | QA / Reliability Lead, Data Pipeline Validation Lead, Scenario Fixture Steward, Product Lead / AI Product Architect | AI should route real-journey proof and scenario-completeness questions here |
| End-to-end mobile proof and responsive scenario completeness | E2E Proof Lead | QA / Reliability Lead, Responsive QA Lead, Data Pipeline Validation Lead, Scenario Fixture Steward, Product Lead / AI Product Architect | AI should route mobile-journey proof and responsive scenario-completeness questions here |
| CEO-visible town-hall walkthroughs and failure capture | Town Hall Review Lead | Desktop Experience Director, Mobile Experience Lead, E2E Proof Lead, Data Pipeline Validation Lead, QA / Reliability Lead | AI should route executive walkthrough, failure logging, and hardening readout questions here |
| Live opportunity fixture sourcing and posting snapshot capture | Applied Opportunity Research Lead | Scenario Fixture Steward, Opportunity Strategist, Product Lead / AI Product Architect | AI should route live opportunity selection and posting-freeze questions here |
| Scenario fixtures and reusable proof artifacts | Scenario Fixture Steward | E2E Proof Lead, Repository Steward / Documentation Systems Lead, Data Pipeline Validation Lead | AI should route reusable proof-fixture structure and artifact-hygiene questions here |
| End-to-end local pipeline validation | Data Pipeline Validation Lead | Director of Data Platform, Data Steward / Data Quality Lead, QA / Reliability Lead, E2E Proof Lead | AI should route export/import proof and restored-state validation questions here |
| Desktop visual acceptance and screenshot review | Visual QA Lead | Desktop Experience Director, Accessibility Lead, QA / Reliability Lead | AI should route screenshot-based acceptance and desktop polish questions here |
| Mobile visual acceptance and touch-flow review | Responsive QA Lead | Mobile Experience Lead, Accessibility Lead, QA / Reliability Lead | AI should route screenshot-based acceptance and mobile touch-flow questions here |
| Contributor onboarding and setup guidance | Contributor Onboarding Lead | Developer Experience Lead, Repository Steward / Documentation Systems Lead, Engineering Lead | AI should route contribution-setup, first-run builder, and working-agreement questions here |
| Docs index and navigation map quality | Docs Index And Navigation Lead | Repository Steward / Documentation Systems Lead, Developer Experience Lead, Trust Center / Public Documentation Owner | AI should route docs-index and cross-reference-navigation questions here |
| Runtime performance and bundle discipline | Engineering Lead | Frontend Engineer, Developer Experience Lead, QA / Reliability Lead | AI should route bundle-size, lazy-loading, and runtime-hardening questions here |
| Continuous integration and release automation | CI / Release Automation Lead | Engineering Lead, QA / Reliability Lead, Developer Experience Lead, Release Manager | AI should route CI workflow, automated verification, and release-pipeline questions here |
| Browser compatibility and support matrix | Browser Compatibility Lead | QA / Reliability Lead, Frontend Engineer, Accessibility Lead, CI / Release Automation Lead | AI should route browser-coverage, compatibility-risk, and support-matrix questions here |
| Document lifecycle operations | Document Operations Lead | Records / Information Governance Lead, Data Steward / Data Quality Lead | AI should route document intake and versioning questions here |
| Candidate story standards | Candidate Story Architect | Resume And Positioning Architect, Career Development Coach Lead, Product Lead | AI should route narrative-structure and self-knowledge output questions here |
| Coaching standards | Career Development Coach Lead | Business Acumen Coaching Lead, Compensation Education Lead, Safety / Policy Lead | AI should route coaching-tone, encouragement, and transition-support questions here |
| Public trust-center clarity | Trust Center / Public Documentation Owner | Marketing / Communications Lead, Privacy Lead, Security Lead, Legal Counsel | AI should route trust-center structure and public-document consistency questions here |
| Buyer packet composition and send order | Diligence Packet / Sales Enablement Lead | Trust Center / Public Documentation Owner, Customer Assurance / Security Questionnaire Lead, CRO / Revenue Lead | AI should route packet-assembly and buyer-send-order questions here |
| Mission and public-purpose clarity | Mission / Purpose Lead | Founder / CEO, Brand Strategy Lead, Marketing / Communications Lead | AI should route purpose-framing and values-to-product interpretation questions here |
| Brand direction and about-page narrative | Brand Strategy Lead | Marketing / Communications Lead, Mission / Purpose Lead, Trust Center / Public Documentation Owner | AI should route about-page identity, positioning, and public narrative questions here |
| Executive deck narrative and sponsor presentation quality | Executive Presentation Lead | Brand Strategy Lead, Marketing / Communications Lead, CRO / Revenue Lead, Trust Center / Public Documentation Owner | AI should route sponsor-deck and executive-presentation questions here |
| Demo flow and walkthrough truthfulness | Solutions Demo Lead | Product Lead, CRO / Revenue Lead, Trust Center / Public Documentation Owner | AI should route demo-flow and walkthrough-alignment questions here |
| Correspondence workflow | CRM / Correspondence Operations Lead | Safety / Policy Lead, Customer Success Lead | AI should route outreach operations and approval-flow questions here |
| Implementation readiness | Implementation Program Manager | Solutions Architect, Enterprise Support Operations Lead, President / GM | AI should route rollout-readiness questions here |
| Accessibility commitments | Accessibility Lead | QA Lead, Product Lead | AI must not make unsupported compliance claims |
| Security claims | Security Lead | Engineering Lead, Legal Counsel | AI must not invent certifications or controls |
| Privacy commitments | Privacy Lead | Legal Counsel, Security Lead | AI must not improvise privacy positions |
| Sovereign and residency commitments | Data Residency / Sovereignty Lead | Sovereign Deployment Architect, Privacy Lead, Security Lead, Enterprise Counsel / Contracting Lead | AI must not imply sovereign hosting, regional isolation, or residency guarantees without documented support |
| Buyer diligence responses | Customer Assurance / Security Questionnaire Lead | Security Lead, Privacy Lead, Compliance Program Manager, Trust Center / Public Documentation Owner | AI should route questionnaire, diligence-pack, and assurance-response questions here |
| Local-only data custody claims | Privacy Lead | Records / Information Governance Lead, Security Lead, Product Lead | AI must not imply server retention, sync, or custody beyond documented local-only behavior |
| Export-package commitments | Records / Information Governance Lead | Director Of Data Platform, PDF / Document Rendering Specialist, Privacy Lead | AI should route ZIP, JSON authority, Markdown/PDF derivative, and handoff-integrity questions here |
| Sensitive-support boundaries | Safety / Policy Lead | Privacy Lead, Career Development Coach Lead, Legal Counsel | AI must keep sensitive-support guidance opt-in, local-only by default, and non-forcing |
| Pricing commitments | CFO / Finance Lead | Sales Lead, CEO | AI must stay within approved pricing logic |
| Contract terms | Legal Counsel | CEO, CFO, Sales Lead | AI must not negotiate beyond approved playbooks |
| AI usage policy | Safety / Policy Lead | Product Lead, Legal Counsel | AI must enforce these rules |
| Public-sector commitments | Government Contracting Lead | Legal Counsel, Security Lead, Accessibility Lead | AI must route these questions carefully |
| Support commitments | Customer Success Lead | Operations Lead, Engineering Lead | AI should use published support policy only |
| Builder vs buyer vs user messaging | Marketing / Communications Lead | Product Lead, Trust Center / Public Documentation Owner, Customer Success Lead | AI should tailor explanations to audience and avoid mixing builder documentation with formal buyer commitments |
| Repo maturity benchmarks and outcome ratings | Benchmarking And Evaluation Lead | QA / Reliability Lead, Product Lead, Developer Experience Lead, President / GM | AI should route repo-scoring, current-benchmark, and expected-outcome-rating questions here |

## Execution Ownership

| Workstream | Primary Owner | Notes |
|---|---|---|
| Product direction | Product Lead / AI Product Architect | Owns platform behavior and repo-to-product clarity |
| Implementation delivery | Engineering Lead | Owns engineering execution and technical delivery quality |
| Lifecycle quality | VP Product Operations / Workflow Analyst | Owns operating cadence, stage quality, and exception handling |
| Repo coherence and documentation truth | Repository Steward / Documentation Systems Lead | Owns root-level navigation quality and cross-doc consistency |
| Developer workflow quality | Developer Experience Lead | Owns builder usability and contributor ergonomics |
| CI and release automation | CI / Release Automation Lead | Owns automated verification workflow quality and release-pipeline consistency |
| Browser compatibility confidence | Browser Compatibility Lead | Owns cross-browser verification scope and browser-support visibility |
| Desktop experience discipline | Desktop Experience Director | Owns premium desktop hierarchy, cockpit sizing, and above-the-fold operating clarity |
| Mobile experience discipline | Mobile Experience Lead | Owns responsive hierarchy, touch-priority sequencing, and small-screen clarity |
| Town hall review discipline | Town Hall Review Lead | Owns CEO-visible walkthrough structure, failure capture quality, and immediate hardening readouts |
| E2E proof discipline | E2E Proof Lead | Owns full-journey scenario proof and end-to-end completion standards |
| Scenario fixture quality | Scenario Fixture Steward | Owns durable reusable proof scenarios and fixture hygiene |
| Data pipeline proof | Data Pipeline Validation Lead | Owns export/import and restored-state validation discipline |
| Visual desktop acceptance | Visual QA Lead | Owns screenshot review and visual signoff for premium desktop surfaces |
| Responsive acceptance | Responsive QA Lead | Owns mobile screenshot review, touch-flow proof, and breakpoint-level acceptance discipline |
| Contributor onboarding quality | Contributor Onboarding Lead | Owns builder setup clarity, contribution-path usability, and first-pass contributor success |
| Docs index and navigation quality | Docs Index And Navigation Lead | Owns fast repo pathfinding from root docs into source-of-truth detail |
| Root README excellence | UX Writer / Content Designer + Repository Steward / Documentation Systems Lead | Owns clarity, structure, tone, and truthful top-level orientation quality |
| Controlled-domain overrides | Privacy Lead / Safety / Policy Lead / Accessibility Lead | Override convenience when trust, safety, privacy, or access are at risk |
| GTM and commercialization readiness | President / GM or CRO-equivalent | CRO / Revenue Lead owns this directly if formally staffed; otherwise President / GM is the default authority |
| Benchmarking and expected-outcome scoring | Benchmarking And Evaluation Lead | Owns benchmark framing, rating language, and quality evidence |
| Buyer packet export and sales enablement quality | Diligence Packet / Sales Enablement Lead | Owns packet composition, send order, and buyer-facing packet usability |
| Executive deck and sponsor presentation quality | Executive Presentation Lead | Owns presentation structure and executive-facing meeting flow |
| Enterprise product operations and admin-control readiness | Enterprise Product Operations Lead + Entitlements And Admin Controls Lead | Own enterprise-facing operating requirements and governed admin-control design |

## AI Operating Rules For "Company" Statements

### The AI may say
- "Our product is designed to..."
- "Our workflow requires user review before..."
- "Our accessibility target is..." only if documented
- "Our support policy states..." only if documented

### The AI must not say without documentation
- "We are compliant with..."
- "We are certified for..."
- "We guarantee..."
- "We accept these contract terms..."
- "We will process your data this way..." unless documented in policy

## Global Operating Considerations
If Monyawn operates globally, the AI should assume that some decisions require region-specific review.

Topics that require additional care:
- cross-border data handling
- government procurement rules
- accessibility obligations by jurisdiction
- tax and invoicing obligations
- labor and employment-law-adjacent guidance
- AI governance obligations by market

For these topics, AI should reference the responsible functional owner and avoid unsupported global claims.

## Minimum Staff Model For Global Operation
For a globally operating Monyawn business, the following functions must exist, whether as employees, fractional leaders, or retained partners:
- executive leadership
- operations
- finance
- product
- product operations
- UX and accessibility
- engineering
- developer experience and repo stewardship
- contributor onboarding and docs navigation
- data platform and data quality
- information and document operations
- coaching and narrative quality
- QA / reliability
- benchmarking and evaluation
- legal
- enterprise counsel and customer assurance
- privacy
- security
- data residency and sovereign deployment design
- safety / policy
- sales
- implementation and solutions
- customer success
- enterprise support operations
- enablement and change management
- government contracting if pursuing public-sector business

This is a function model, not a fixed org-chart mandate. One person may hold multiple roles if risk, workload, and decision quality remain acceptable.

## Controlled Flexibility
The company may restructure role titles, reporting lines, and team composition over time. The AI should anchor to function and decision authority, not to a rigid title system.

Examples:
- a founder may temporarily serve as Product Lead
- a consulting accessibility specialist may act as Accessibility Lead
- outside counsel may act as Legal Counsel
- a small early team may combine Finance Lead and Operations Lead responsibilities

The important rule is that controlled domains still have a named accountable owner.

## Current Unknowns
The following org questions may remain open in early stages:
- which functions are full-time versus fractional
- whether government contracting is active at launch
- whether customer success and implementation are separate functions
- whether privacy is owned by legal, security, or a dedicated lead
- whether account management and sales remain separate roles
- whether CRO is formalized or mapped to President / GM
- whether trust-center ownership sits with Marketing / Communications Lead or a dedicated public-documentation owner

If these are unresolved, the AI should not assume more maturity than the company has documented.

## Required Internal Reference Docs
This org structure works only if the following documents exist and remain current:
- product spec
- security overview
- privacy policy
- AI governance policy
- accessibility statement
- support policy
- contracting packet
- pricing and approval policy

## Summary
This document gives Monyawn a role-based company model the AI can refer to for decision-making. If the AI does not know which role owns a decision, it should not imply company approval. It should escalate to the correct functional authority instead.
