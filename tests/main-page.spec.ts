import { expect, test } from "../lib/fixtures/setup.fixtures";

test.describe("Main page Tests", () => {
  const userData = {
    email: process.env.customerUsername!,
    password: process.env.customerPassword!,
  };
  test("check if user loged in after auth setup", async ({
    basePage,
    authSetup,
    page,
  }) => {
    await authSetup(userData);
    await basePage.goTo("");
    await expect(page.locator('[data-test="nav-menu"]')).toBeVisible();
  });
});
