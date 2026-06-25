import { test, expect } from "@playwright/test";

test("dashboard loads with KPIs and live scan card", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { name: "Pulse Dashboard" })).toBeVisible();
  await expect(page.getByText("Live GitHub Scan")).toBeVisible();
  await expect(page.getByText("Total Agents Tracked")).toBeVisible();
});

test("leaderboard filters by category", async ({ page }) => {
  await page.goto("/leaderboard");
  await expect(page.getByRole("heading", { name: "Reputation Leaderboard" })).toBeVisible();
  const rowsBefore = await page.locator("table tbody tr").count();
  expect(rowsBefore).toBeGreaterThan(0);
  await page.getByRole("button", { name: "DeFi", exact: true }).click();
  // Table still renders after filtering (may have fewer/zero rows).
  await expect(page.locator("table")).toBeVisible();
});

test("agent detail switches tabs", async ({ page }) => {
  await page.goto("/agents/sentience-1");
  await expect(page.getByText("Global Trust Reputation")).toBeVisible();
  await page.getByRole("tab", { name: "Developer Analysis" }).click();
  await expect(page.getByText("Commit Activity (Last 12 Months)")).toBeVisible();
  await page.getByRole("tab", { name: "Security" }).click();
  await expect(page.getByText("Automated Forensics")).toBeVisible();
});

test("agents search narrows results", async ({ page }) => {
  await page.goto("/agents");
  await page.getByPlaceholder("Search agent, token or repo…").fill("sentience");
  await expect(page.getByText("Sentience-1")).toBeVisible();
});
