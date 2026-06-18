# Kete Kopaki

Envelope budgeting app based on the design in `docs/DESIGN.md`, with an Expo frontend and a .NET 10 backend.

## Table of Contents

- [Overview](#overview)
- [Goals](#goals)
- [Architecture](#architecture)
- [Tech Stack](#tech-stack)
- [Repository Structure](#repository-structure)
- [Documentation](#documentation)
- [Getting Started](#getting-started)
- [Local Development](#local-development)
- [Testing](#testing)
- [Functional Testing Container](#functional-testing-container)
- [CI/CD](#cicd)
- [Observability](#observability)
- [Contributing](#contributing)
- [Roadmap](#roadmap)
- [License](#license)

## Overview

Kete Kopaki is a personal budgeting application using the envelope method. It supports persistent envelope balances, scheduled transactions, transfers, account tracking, and budget-vs-actual reporting.

## Goals

- Make overspending visible immediately at envelope level.
- Support multiple concurrent budget schedules.
- Provide clear upcoming cashflow projections.
- Keep a complete, auditable transaction history.

## Architecture

- **Frontend:** Expo (React Native)
- **Backend:** ASP.NET Core Web API (.NET 10, C#)
- **Data:** PostgreSQL
- **Background Jobs:** .NET worker for scheduled posting and nudges
- **Observability:** OpenTelemetry with Aspire Dashboard (local-first)

See full details in [Implementation Plan](docs/IMPLEMENTATION_PLAN.md).

## Tech Stack

- Expo / React Native / TypeScript
- .NET 10 / ASP.NET Core / EF Core
- PostgreSQL
- Podman (local containers)
- GitHub Actions (CI/CD)

## Repository Structure

```text
.
├── docs/
│   ├── DESIGN.md
│   ├── IMPLEMENTATION_PLAN.md
│   ├── LOCAL_TESTING.md
│   ├── FUNCTIONAL_TESTING.md
│   └── CI_CD.md
├── src/
│   ├── frontend/
│   └── backend/
├── deploy/
├── docker/
└── .github/
    └── workflows/
```

## Documentation

- Design: [`docs/DESIGN.md`](docs/DESIGN.md)
- Implementation plan: [`docs/IMPLEMENTATION_PLAN.md`](docs/IMPLEMENTATION_PLAN.md)
- Local testing guide: [`docs/LOCAL_TESTING.md`](docs/LOCAL_TESTING.md)
- Functional testing: [`docs/FUNCTIONAL_TESTING.md`](docs/FUNCTIONAL_TESTING.md)
- CI/CD plan: [`docs/CI_CD.md`](docs/CI_CD.md)

## Getting Started

## Prerequisites

- Podman Desktop
- .NET 10 SDK
- Node.js LTS + npm

## Initial setup

1. Clone the repository.
2. Start local dependencies with Podman Compose.
3. Run backend API and jobs worker.
4. Start the Expo app.

For the detailed flow, follow [`docs/LOCAL_TESTING.md`](docs/LOCAL_TESTING.md).

## Local Development

- Keep design and planning changes in `docs/`.
- Implement app/backend code under `src/`.
- Use environment-specific configuration files for local/staging/prod.

## Testing

Testing is multi-level and includes:

- Static checks (lint/type/analyzers)
- Unit tests
- Integration tests
- Contract tests
- E2E smoke tests
- Full-stack functional tests in a dedicated container

See [`docs/LOCAL_TESTING.md`](docs/LOCAL_TESTING.md), [`docs/FUNCTIONAL_TESTING.md`](docs/FUNCTIONAL_TESTING.md), and [`docs/CI_CD.md`](docs/CI_CD.md).

## Functional Testing Container

The repository includes a dedicated `functional-tests` container that can run beside deployment containers to execute true full-stack tests (API + jobs + DB + frontend).

- Compose file: `deploy/compose.functional.yml`
- Container build: `docker/functional-tests.Dockerfile`
- Test approach and tooling: [`docs/FUNCTIONAL_TESTING.md`](docs/FUNCTIONAL_TESTING.md)

## CI/CD

GitHub Actions workflows cover:

- Pull request validation
- Security scanning
- Staging deployment
- Production deployment

See [`docs/CI_CD.md`](docs/CI_CD.md).

## Observability

Local observability uses Aspire Dashboard with OpenTelemetry for:

- Logs
- Traces
- Metrics
- Health checks

See [`docs/LOCAL_TESTING.md`](docs/LOCAL_TESTING.md).

## Contributing

1. Create a feature branch.
2. Make focused changes.
3. Ensure tests/checks pass.
4. Open a pull request with testing evidence.

## Roadmap

- Complete v1 implementation from `docs/DESIGN.md`
- Harden CI/CD and release automation
- Prepare v2 scope items (multi-currency, bank sync, multi-user)

## License

License to be confirmed.
