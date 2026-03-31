# Town Hall: The 10/10 Backend Evolution Roadmap

## Objective
Design and implement a robust, enterprise-grade backend to support the "Opportunity Engine." Transition from Local-Only storage to a Hybrid-Cloud model that maintains local-first performance with backend durability and multi-user governance.

---

## Expert Panel Consensus
- **Data Systems Architect:** We must adopt a "Contract-First" API. The backend should not just store JSON; it must enforce the `AppState` schema at the database level (PostgreSQL with JSONB for flexible entities, strict tables for core ones).
- **LLMOps Engineer:** The backend must handle AI "Batch Requests" and provide a secure vault for OpenAI API keys, preventing client-side exposure.
- **Offline-First Architect:** The backend MUST support "Optimistic UI" and "Delta Sync." We don't want to reload the whole app; we only push/pull changes.
- **CEO/Governance:** Data must be encrypted at rest. We need a "Durable Audit Log" for all outcome transitions (Awards/Denials).

---

## Execution Plan: The 10/10 Backend

### Phase 1: Persistence & Identity (P0)
- **Database Selection:** PostgreSQL. Use `uuid` for all primary keys to allow local-side generation without collisions.
- **Auth Layer:** Implement stateless JWT-based authentication. Support "Anonymous First" flows where users can start locally and "Claim" their account to sync to the backend.
- **Schema Implementation:** Mirror the `src/types.ts` structures into SQL tables.

### Phase 2: The Max-Leverage API (P1)
- **Protocol:** REST with OpenAPI/Swagger documentation. 
- **Endpoint Design:** 
    - `/opportunities`: Full CRUD with batch outcome resolution.
    - `/content/generate`: Endpoint to trigger the "Blog Asset" generation server-side.
    - `/ai/analyze`: Managed endpoint for OpenAI signal extraction.

### Phase 3: The Sync Engine (P1)
- **Implementation:** WebSocket or Server-Sent Events (SSE) for real-time integrity alerts.
- **Conflict Resolution:** "Last Write Wins" for simple fields; "Merge" logic for `CandidateStory` markdown.

### Phase 4: Enterprise Infrastructure (P2)
- **Observability:** Implement structured logging (Winston/Pino) and cost-tracking per user/batch.
- **Global Distribution:** CDN integration for assets; Edge functions for low-latency AI pre-processing.

---

## CEO Visibility Note
This backend roadmap moves Monyawn from a "Local Tool" to a "SaaS Platform." It provides the architectural foundation to support thousands of users pushing 10+ opportunities each with zero performance degradation.
