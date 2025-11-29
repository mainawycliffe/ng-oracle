# 📅 Project Plan: ng-lens

## Phase 1: Backend & Data Configuration
- [ ] **Configure Firestore Indexes**: Add vector index configuration to `firestore.indexes.json` for the `angular-docs` collection.
    - **Requirement**: The index must support filtering by the `version` field to allow version-specific searches.
- [ ] **Implement Vector Search**: Update `apps/functions/src/index.ts` to implement the `vectorSearch` logic.
    - **Requirement**: Use a **pre-filter** in the vector query to restrict results to the user's selected Angular version (`v18`, `v19`, or `v20`).
- [ ] **Data Ingestion**: Run `tools/process-docs.ts` to populate Firestore with embeddings.
    - **Task**: Populate `docs/` folders with markdown files.

## Phase 2: Frontend Integration
- [ ] **Create Oracle Service**: Implement `OracleService` in `apps/ui` to communicate with the `theOracle` Cloud Function.
- [ ] **Connect Components**: Wire up `search-bar` and `answer-display` components to the service.
- [ ] **State Management**: Ensure proper loading states and error handling in the UI.

## Phase 3: Polish & Deployment
- [ ] **UI Polish**: Ensure Markdown rendering and code highlighting work correctly in the answer display.
- [ ] **Deployment**: Deploy Firestore indexes and Cloud Functions.
