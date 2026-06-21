import { expect, test } from "../../lib/fixtures/setup.fixtures";
import { VALIDATION_MESSAGES } from "../../lib/constants/validation-messages";

test.describe("Login Test", () => {
  const userData = {
    email: process.env.customerUsername!,
    password: process.env.customerPassword!,
  };

  test.beforeEach(async ({ basePage }) => {
    await basePage.goTo("/auth/login");
  });

  test("Happy Path - Successful login", async ({
    authPage,
    myAccountPage,
    page,
  }) => {
    await authPage.login(userData);
    await expect(page).toHaveURL(/.*\/account/);
    await expect(myAccountPage.myAccountHeading).toBeVisible();
  });

  test("Negative Path - Invalid Email", async ({ authPage }) => {
    await authPage.fillEmail("invalid-email@test.com");
    await authPage.fillPassword("password");
    await authPage.clickLoginButton();
    await expect(authPage.invalidEmailOrPasswordMessage).toHaveText(
      VALIDATION_MESSAGES.AUTH.INVALID_CREDENTIALS
    );
  });

  test("Negative Path - Invalid Password", async ({ authPage }) => {
    await authPage.fillEmail(userData.email);
    await authPage.fillPassword("invalid-password");
    await authPage.clickLoginButton();
    await expect(authPage.invalidEmailOrPasswordMessage).toHaveText(
      VALIDATION_MESSAGES.AUTH.INVALID_CREDENTIALS
    );
  });

  test("Negative Path - Empty Credentials", async ({ authPage }) => {
    await authPage.clickLoginButton();
    await expect(authPage.emailIsRequiredMessage).toBeVisible();
    await expect(authPage.passwordIsRequiredMessage).toBeVisible();
  });

  test("Negative Path - Empty Email", async ({ authPage }) => {
    await authPage.fillPassword("password");
    await authPage.clickLoginButton();
    await expect(authPage.emailIsRequiredMessage).toHaveText(
      VALIDATION_MESSAGES.REQUIRED.EMAIL
    );
  });

  test("Negative Path - Empty Password", async ({ authPage }) => {
    await authPage.fillEmail(userData.email);
    await authPage.clickLoginButton();
    await expect(authPage.passwordIsRequiredMessage).toHaveText(
      VALIDATION_MESSAGES.REQUIRED.PASSWORD
    );
  });
});
