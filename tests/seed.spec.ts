import { expect, test } from "../lib/fixtures/setup.fixtures";

test.describe("Test group", () => {
  test("seed", async ({ basePage }) => {
    // generate code here.
    await basePage.goTo("/auth/register");
  });
});
