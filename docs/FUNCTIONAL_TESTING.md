# Full-Stack Functional Testing Container

This document defines a dedicated `functional-tests` container that runs alongside deployment containers for true end-to-end functional validation.

## 1. Goal

Run high-confidence, production-like tests against the full stack:

- Frontend
- API
- Worker/jobs
- Database
- Cache

## 2. Recommended Tooling (practical and low-complexity)

Use a **single primary test framework**:

1. **Playwright Test (Node.js)**
   - Browser-based functional flows
   - API assertions via `APIRequestContext`
   - Built-in retries, reporters, traces, screenshots, videos
2. **JUnit + HTML reports**
   - Machine-readable CI artifacts + human-readable output

Optional later:

- **k6** for separate load/performance testing (not part of core functional suite)

## 3. Why Playwright for this project

- Covers UI and API in one runner.
- Easy containerization.
- Good diagnostics when failures happen.
- Works well in CI and local Podman compose workflows.

## 4. Container Topology

The functional test runner is started in the same compose network as:

- `api`
- `jobs`
- `frontend`
- `postgres`
- `redis`
- `aspire-dashboard` (optional for inspection)

It waits for readiness endpoints, runs tests, writes results to a mounted volume, then exits.

## 5. Test Suite Structure

```text
src/frontend/tests/functional/
  setup/
    global-setup.ts
    global-teardown.ts
  specs/
    dashboard.spec.ts
    envelope-flows.spec.ts
    scheduled-transactions.spec.ts
    reports.spec.ts
  playwright.config.ts
```

## 6. Minimum Functional Scenarios

1. Household isolation across contexts.
2. Income split to multiple envelopes updates balances.
3. Expense and transfer (many-to-many envelope allocations).
4. Scheduled transaction due posting (worker-driven).
5. Confirm/postpone scheduled transaction behavior.
6. Single-instance amount override behavior.
7. Amount-tier effective-date change behavior.
8. Dashboard envelope state changes (healthy/low/empty/overspent).
9. Report accuracy for planned vs actual variance.

## 7. Running Functional Tests Locally

1. Start the stack and test runner profile:
   - `podman compose -f deploy/compose.functional.yml --profile test up --build --abort-on-container-exit functional-tests`
2. Collect artifacts from `./artifacts/functional/`.
3. Tear down:
   - `podman compose -f deploy/compose.functional.yml down -v`

## 8. CI Integration Pattern

In CI (current mode is manual trigger only):

1. Build/pull deployment images for the commit SHA.
2. Start the same compose stack used by `functional-tests`.
3. Run `functional-tests` container.
4. Publish artifacts (HTML report, traces, screenshots, videos).
5. Fail pipeline if functional tests fail.

`functional.yml` currently runs via `workflow_dispatch` only.

## 9. Exit Criteria

Functional stage passes only when:

1. All critical user journeys pass.
2. No critical console/network errors appear in the run.
3. Required reports/artifacts are generated and uploaded.
