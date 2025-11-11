import { generateUserData } from "../../lib/data-factory/new-user.data";
import { test } from "../../lib/fixtures/setup.fixtures";

test.describe("Registration Test", () => {
  const userData = generateUserData();
  test("Happy Path - Successful Registration", async ({
    basePage,
    registerPage,
  }) => {
    await basePage.goTo("/auth/register");
    await registerPage.registerNewUser(userData);
    await registerPage.verifySuccessfulRegistration();
  });
});
