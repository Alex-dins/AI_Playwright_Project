import { generateUserData } from "../../lib/data-factory/new-user.data";
import { expect, test } from "../../lib/fixtures/setup.fixtures";

test.describe("Registration Test", () => {
  const userData = generateUserData();

  test("Happy Path - Successful Registration", async ({
    basePage,
    authPage,
    apiBaseURL,
    page,
  }) => {
    await basePage.goTo("/auth/register");
    const registeredResponsePromise = page.waitForResponse(
      (response) =>
        response.url() === `${apiBaseURL}/users/register` &&
        response.request().method() === "POST" &&
        response.status() === 201
    );
    await authPage.registerNewUser(userData);

    await registeredResponsePromise;
    await expect(page).toHaveURL(/.*\/auth\/login/);
  });
});
