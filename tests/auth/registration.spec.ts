import { generateUserData } from "../../lib/data-factory/new-user.data";
import { test } from "../../lib/fixtures/setup.fixtures";

test.describe("Registration Test", () => {
  const userData = generateUserData();

  test("Happy Path - Successful Registration", async ({
    basePage,
    authPage,
  }) => {
    await basePage.goTo("/auth/register");
    await authPage.registerNewUser(userData);
    await authPage.verifySuccessfulRegistration();

    await authPage.login(userData);
    await authPage.verifySuccessfulLogin();
  });
});
