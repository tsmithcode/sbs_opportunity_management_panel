# Monyawn: Product Truth

## 1. Brand Identity 🥱
**Monyawn** (Money + Yawn) is the "guardian angel" platform for high-stakes career moves.
- **Thesis:** Moving between roles worth $100k-$300k+ is currently high-friction and low-evidence. Monyawn makes it feel easy (🥱).
- **Voice:** Direct, professional, unbothered, and evidence-backed.
- **Audience:** From Gen Z (valuing efficiency and 🥱 energy) to Boomers (navigating modern hiring friction).

## 2. Platform Tenets
1. **Local-First Trust:** User data stays in the browser. No cloud storage of personal history.
2. **AI-Native Guidance:** Not just "chat," but a guided conversation engine that builds a structured "bag" of proof.
3. **Evidence-Backed Narrative:** Every claim in a candidate's story must be backed by an artifact or correspondence.
4. **Durable Handoffs:** The output is a "ZIP handoff package" that the user owns and controls.

## 3. Core Architecture
Monyawn is built as a set of decoupled packages to ensure portability and modularity:
- **`packages/conversation-core`**: The headless engine for guided intake.
- **`packages/conversation-schema`**: Versioned definitions of the intake flow.
- **`packages/conversation-react`**: UI primitives for the chat experience.
- **`packages/conversation-adapters`**: The bridge between the engine and Monyawn's domain objects.

## 4. Primary Workflows
1. **Guided Intake:** A single conversation window that captures Account, User, and Opportunity context.
2. **Operational Cockpit:** A workspace for managing artifacts, profile corrections, and correspondence.
3. **Story Generation:** AI-driven narrative development based on captured evidence.
4. **Stage-Gated Governance:** A 10-stage workflow that tracks progress from "Intake Started" to "Closed Won/Lost."

## 5. Success Metrics (The 🥱 Bar)
- **Cognitive Load:** Does the user know exactly what to do next?
- **Evidence Depth:** Is the "Leverage Score" an honest reflection of proof?
- **Export Quality:** Is the final ZIP package "buyer-ready"?
