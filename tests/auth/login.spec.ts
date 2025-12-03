import { generateUserData } from "../../lib/data-factory/new-user.data";
import { test } from "../../lib/fixtures/setup.fixtures";

test.describe("Login Test", () => {
  const userData = generateUserData();

  test("Happy Path - Successful login", async ({ basePage, authPage }) => {
    await basePage.goTo("/auth/login");
    await authPage.login(userData);
  });
});
