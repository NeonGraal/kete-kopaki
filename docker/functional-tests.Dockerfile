FROM mcr.microsoft.com/playwright:v1.54.1-noble

WORKDIR /workspace/src/frontend

# The compose volume mounts the repository at /workspace.
# Tests are expected at src/frontend/tests/functional with package scripts in src/frontend/package.json.

ENV CI=true

CMD ["sh", "-c", "npm ci && npx playwright install --with-deps chromium && npm run test:functional"]
