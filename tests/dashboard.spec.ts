import { test } from "../lib/fixtures/setup.fixtures";

test.use({ storageState: ".auth/user.json" });

test.describe("Dashboard Test", () => {
  test("check if user loged in after auth setup", async ({ basePage }) => {
    await basePage.goTo("");
  });
});
