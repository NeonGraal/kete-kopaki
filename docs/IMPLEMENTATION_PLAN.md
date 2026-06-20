# Implementation Plan (Expo + .NET 10)

## 1. Architecture

- **Frontend:** Expo (React Native + Expo Router)
- **Backend:** ASP.NET Core Web API (.NET 10), C#
- **Database:** PostgreSQL
- **Background processing:** .NET worker service for scheduled transaction posting and nudges
- **Observability (local-first):** OpenTelemetry + .NET Aspire Dashboard
- **Functional test runner:** Dedicated `functional-tests` container (Playwright)

## 2. Repository Layout

```text
docs/
  DESIGN.md
  IMPLEMENTATION_PLAN.md
  LOCAL_TESTING.md
  CI_CD.md
src/
  backend/
    KeteKopaki.slnx
    KeteKopaki.Api/
    KeteKopaki.Application/
    KeteKopaki.Domain/
    KeteKopaki.Infrastructure/
    KeteKopaki.Jobs/
    tests/
      KeteKopaki.Domain.Tests/
      KeteKopaki.Application.Tests/
      KeteKopaki.Api.IntegrationTests/
      KeteKopaki.ContractTests/
  frontend/
    app/
    src/
      components/
      features/
      services/
      state/
      hooks/
      theme/
    tests/
      unit/
      integration/
      e2e/
deploy/
  compose.local.yml
  compose.functional.yml
  compose.staging.yml
  compose.prod.yml
docker/
  backend.Dockerfile
  jobs.Dockerfile
  functional-tests.Dockerfile
```

## 3. Backend Delivery Plan

## 3.1 Foundation

1. Create solution and projects (Domain, Application, Infrastructure, Api, Jobs, Tests).
2. Configure dependency injection, app settings, environment profiles.
3. Add baseline packages:
   - EF Core (PostgreSQL provider)
   - FluentValidation
   - MediatR (or equivalent application handler pattern)
   - Serilog
   - OpenTelemetry
4. Enable migrations and health endpoints.

## 3.2 Domain Modeling (from DESIGN.md)

1. Implement entities:
   - Household
   - Envelope
   - Budget
   - ScheduledTransaction
   - Transaction
   - Account (General, CreditCard, Loan/RevolvingCredit)
   - Payee
   - AmountTier
   - InterestTier
2. Enforce core rules:
   - Envelope balances are persistent
   - Scheduled transactions are unposted until due/confirmed
   - Transfers are zero-sum
   - Expenses/transfers support many-to-many envelope allocations
   - Amount tiers apply by effective date

## 3.3 Services and APIs

1. Envelope operations:
   - Record income
   - Record expense
   - Transfer between envelopes
2. Budget operations:
   - Create/edit budget schedules
   - Manage recurring scheduled transactions
   - Apply single-instance amount overrides
3. Scheduled processing:
   - Due transaction posting
   - Confirmation/postpone flows
4. Reporting:
   - Upcoming cashflow projections
   - Actual vs planned variance by period/envelope
5. Account management:
   - Running balances
   - Interest tier configuration metadata

## 4. Frontend Delivery Plan (Expo)

## 4.1 App Setup

1. Initialize Expo app with Expo Router.
2. Add API client layer and auth/session handling.
3. Add data fetching and cache management (React Query recommended).

## 4.2 Screen Implementation Order

1. Dashboard
2. Add Income
3. Add Expense
4. Transfer
5. Envelope Detail
6. Scheduled Transactions
7. Budget Setup
8. Budgets Overview
9. Amount Changes
10. Reports
11. Household Settings

## 4.3 UX and State Rules

1. Envelope states: Healthy, Low, Empty, Overspent.
2. Visual warning on low/overspent envelopes.
3. Estimated scheduled transaction variance display.
4. Smart defaults from recent payees/envelope associations.

## 5. Phased Milestones

1. **Phase 1:** Foundation + scaffolding (backend/frontend/deploy).
2. **Phase 2:** Core ledger and envelope transaction flows.
3. **Phase 3:** Scheduled transactions, recurring rules, amount tiers.
4. **Phase 4:** Dashboards, reports, actual vs planned variance.
5. **Phase 5:** Functional test container and full-stack journey coverage.
6. **Phase 6:** Hardening, observability, release readiness.

## TODO (Temporary)

- Keep `functional.yml` as **manual-only** (`workflow_dispatch`) until functional suite stability and runtime are acceptable for automatic PR gating.
