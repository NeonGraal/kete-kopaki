# Local Testing Guide (Developer Manual Testing)

This runbook covers full manual validation of v1 features with the **minimum local tools**.

## 1. Required Tools

1. Podman Desktop
2. .NET 10 SDK
3. Node LTS (with npm)
4. A web browser

No separate DB GUI, API GUI, or paid observability tooling is required.

## 2. Local Startup

1. Start local dependencies:
   - `podman compose -f deploy/compose.local.yml up -d`
2. Start backend API:
   - `dotnet run --project src/backend/KeteKopaki.Api`
3. Start jobs worker:
   - `dotnet run --project src/backend/KeteKopaki.Jobs`
4. Start frontend:
   - `cd src/frontend`
   - `npm install`
   - `npx expo start`

## 2.1 Full-Stack Functional Test Container

Run functional tests against the full running stack:

- `podman compose -f deploy/compose.functional.yml --profile test up --build --abort-on-container-exit functional-tests`

Test artifacts are written to `./artifacts/functional/`.

## 3. Seed Data for End-to-End Manual Tests

Create:

1. A household (for example: "Local Test Household")
2. Envelopes: Rent, Groceries, Transport, Fun, Health, Savings
3. Accounts: General, Credit Card, Loan
4. At least:
   - One weekly budget
   - One monthly budget
   - Scheduled income, expense, and transfer
5. One future amount tier change

## 4. Manual Test Matrix

| Feature                  | Steps                                             | Expected                                               |
| ------------------------ | ------------------------------------------------- | ------------------------------------------------------ |
| Household scoping        | Create a second household and switch context      | Data remains isolated by household                     |
| Record income            | Split one income into multiple envelopes          | Envelope balances increase correctly                   |
| Record expense           | Spend from one envelope and multi-envelope split  | Envelope balances decrease correctly                   |
| Transfer                 | Move from multiple sources to multiple recipients | Transfer remains zero-sum and auditable                |
| Envelope state colors    | Spend envelope near/at/below zero                 | Low/Empty/Overspent states appear correctly            |
| Scheduled posting        | Create due scheduled transaction and run worker   | Transaction posts exactly once                         |
| Confirm/postpone         | Confirm one, postpone one scheduled item          | Status and effective dates update correctly            |
| Single-instance override | Override one occurrence amount                    | Current occurrence changes; recurring template remains |
| Amount tiers             | Cross tier effective date                         | New amount automatically applies                       |
| Transaction edit         | Edit posted transaction                           | Recalculated balances remain consistent                |
| Reports                  | Compare planned vs actual                         | Correct variance by envelope/category                  |

## 5. Local Observability Checks (Minimal Stack)

Use **Aspire Dashboard** as the single UI for observability:

1. **Logs:** verify API and worker logs include request correlation identifiers.
2. **Traces:** verify API request -> DB work -> background job chain.
3. **Metrics:** verify request rate, error count, and latency are visible.
4. **Health:** verify readiness/liveness endpoints report expected status.

Optional terminal checks:

- API health endpoint via browser or curl
- Worker logs in terminal for due posting events

## 6. Failure Injection Checks

1. Stop PostgreSQL container and submit an API transaction.
2. Confirm failure is explicit and non-silent.
3. Restart PostgreSQL and confirm normal recovery.
4. Stop/restart worker during due posting and verify no duplicate postings.

## 7. Evidence to Attach to Pull Requests

1. Screenshot of Dashboard envelope states.
2. Screenshot of scheduled transaction management flow.
3. Screenshot of Aspire trace for transaction posting.
4. Short checklist in PR description with pass/fail status.
