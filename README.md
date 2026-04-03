# Monyawn 🥱

[![CI](https://github.com/cadguardianllc/sbs_opportunity_management_panel/actions/workflows/verify.yml/badge.svg)](https://github.com/cadguardianllc/sbs_opportunity_management_panel/actions/workflows/verify.yml)

**Monyawn** (Money + Yawn) is a local-first, AI-native platform for high-stakes career moves ($100k-$300k+). 🥱

Our mission is to turn the high-friction "job search" into a governed, evidence-backed workflow where the user maintains full control of their data.

## 🥱 Product Truth
- **Identity:** Making what seemed hard feel easy.
- **Privacy:** Local-browser storage by default. No personal data leaves your device.
- **Narrative:** Storytelling backed by artifacts, not just claims.
- **Handoff:** Durable ZIP packages for the final mile.

## 📖 Documentation System (The Monyawn Truth)
We maintain a "10/10" documentation strategy to ensure architectural and brand integrity:

- **[PRODUCT_TRUTH.md](docs/PRODUCT_TRUTH.md)**: The core vision, tenets, and workflows.
- **[TECHNICAL_SPEC.md](docs/TECHNICAL_SPEC.md)**: Schema definitions and technical boundaries.
- **[AI_OPERATING_SYSTEM.md](docs/AI_OPERATING_SYSTEM.md)**: Guidelines for AI-assisted development and LLM-ops.
- **[DECISION_AUTHORITY.md](docs/DECISION_AUTHORITY.md)**: The expert panel that gates implementation and product decisions.
- **[DEVELOPER_GUIDE.md](docs/DEVELOPER_GUIDE.md)**: Onboarding and contribution standards for engineers.

## 🚀 Getting Started
1. **Clone the repo:** `git clone https://github.com/cadguardianllc/sbs_opportunity_management_panel.git && cd sbs_opportunity_management_panel`
2. **Setup dev environment:** `bash scripts/setup.sh`
3. **Launch Dev:** `pnpm run dev`

## 📦 Deployment
- **Production:** [monyawn.com](https://monyawn.com) (Deploys via Vercel CLI)
- **CI/CD:** GitHub Actions for verification and GitHub Pages staging.

## 🏗️ Architecture
Monyawn is built as a set of decoupled packages. For a detailed architectural overview, refer to the [TECHNICAL_SPEC.md](docs/TECHNICAL_SPEC.md).
- `packages/conversation-core`: Headless guided flow engine.
- `packages/conversation-schema`: Versioned intake definitions.
- `packages/conversation-react`: Chat UI primitives.
- `packages/conversation-adapters`: Host-app domain mapping.

## 🥱 Current Play (Shipped)
The workspace includes:
- **Local-First Persistence:** State saved to Browser LocalStorage; optional ZIP export/import.
- **AI Wingman:** Configurable OpenAI/Anthropic support with custom API Base URL (e.g., for Railway proxies).
- **Workspace Cockpit:** Multiple "Plays" tracking, Artifact management, and Correspondence drafting.
- **Enterprise Controls:** Admin-mode for managing account-level governance and AI settings.
- **Verification:** Vitest unit tests and Playwright browser smoke tests.

---
*Monyawn: Finna get to the monyawn.* 🥱
