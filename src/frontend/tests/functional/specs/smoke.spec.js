const { test, expect } = require("@playwright/test");

test("frontend shell loads", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByText("Kete Kopaki")).toBeVisible();
});

test("api health endpoint is reachable", async ({ request }) => {
  const apiUrl = process.env.API_URL ?? "http://localhost:8080";
  const response = await request.get(`${apiUrl}/health`);
  expect(response.ok()).toBeTruthy();
});
