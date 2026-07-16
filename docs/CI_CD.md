# CI/CD Plan (GitHub Actions)

## 1. Workflow Overview

| Workflow         | Trigger                       | Purpose                                                              |
| ---------------- | ----------------------------- | -------------------------------------------------------------------- |
| `ci.yml`         | Pull request, push to `main`  | Build, lint, test, and validate contracts                            |
| `functional.yml` | Manual (`workflow_dispatch`)  | Run full-stack functional tests in containerized deployment topology |
| `security.yml`   | Pull request, scheduled daily | Static and dependency security checks                                |
| `cd-staging.yml` | Merge to `main`               | Build/push images and deploy to staging                              |
| `cd-prod.yml`    | Version tag/manual approval   | Promote release to production                                        |

## 2. CI Pipeline (`ci.yml`)

## 2.1 Backend jobs

1. Restore and build with .NET 10.
2. Run analyzers/format checks.
3. Run tests:
   - Domain unit tests
   - Application unit tests
   - API integration tests (with PostgreSQL service container)
   - Contract tests

## 2.2 Frontend jobs

1. Install dependencies (`npm ci`).
2. Run lint and type-check.
3. Run frontend unit/integration tests.
4. Build Expo project artifacts required for CI validation.

## 2.3 Quality gates

1. All required checks must pass before merge.
2. Coverage thresholds are enforced at repository level.
3. OpenAPI contract drift must fail the build.

## 3. Security Pipeline (`security.yml`)

1. CodeQL analysis for C# and JavaScript/TypeScript.
2. Dependency vulnerability checks:
   - `dotnet list package --vulnerable`
   - `npm audit --production`
3. Container image vulnerability scan (Trivy) for built images.

## 3.1 Functional Pipeline (`functional.yml`)

Current mode: manual-only trigger while functional coverage is being expanded and stabilized.

1. Build or pull deployment images for the current commit SHA.
2. Start `deploy/compose.functional.yml` services.
3. Run the `functional-tests` container and wait for completion.
4. Publish artifacts:
   - Playwright HTML report
   - JUnit XML
   - Traces/screenshots/videos
5. Fail the workflow on any functional test failure.

## 4. Staging Delivery (`cd-staging.yml`)

1. Build backend and worker images.
2. Tag images by commit SHA.
3. Push images to GHCR:
   - `ghcr.io/neongraal/kete-kopaki-api:<sha>`
   - `ghcr.io/neongraal/kete-kopaki-jobs:<sha>`
4. Run database migrations.
5. Deploy using staging compose stack.
6. Execute post-deploy smoke checks.

## 5. Production Delivery (`cd-prod.yml`)

1. Trigger on signed version tag or manual approval flow.
2. Promote previously verified image digests.
3. Run controlled migration step (backward-compatible policy).
4. Roll out production stack.
5. Run smoke checks and basic health verification.

## 6. Test Strategy in CI

| Level             | Scope                                           | Where it runs        |
| ----------------- | ----------------------------------------------- | -------------------- |
| Static checks     | Linting, analyzers, type-checking               | PR + main            |
| Unit tests        | Domain, application, frontend unit              | PR + main            |
| Integration tests | API + DB + worker integration                   | PR + main            |
| Contract tests    | API schema and consumer compatibility           | PR + main            |
| Functional tests  | Full stack (frontend + API + jobs + DB + cache) | Manual run (current) |
| E2E smoke         | Critical user journeys                          | Main and release     |

## 7. Artifact and Release Governance

1. Use immutable image references (SHA or digest).
2. Keep build and deploy workflows separate.
3. Store deployment configuration in version-controlled `deploy/` files.
4. Keep rollback path documented by previous known-good image digest.
