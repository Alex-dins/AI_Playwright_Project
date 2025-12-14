import { generateUserData } from "../../lib/data-factory/new-user.data";
import { test } from "../../lib/fixtures/setup.fixtures";

test.describe("Login Test", () => {
  const userData = {
    email: process.env.customerUsername!,
    password: process.env.customerPassword!,
  };

  test.beforeEach(async ({ basePage }) => {
    await basePage.goTo("/auth/login");
  });

  test("Pozitive Path - Invalid Email", async ({ authPage }) => {
    await authPage.login(userData);
    await authPage.verifySuccessfulLogin();
  });

  test("Negative Path - Invalid Email", async ({ authPage }) => {
    await authPage.fillEmail("invalid-email@test.com");
    await authPage.fillPassword("password");
    await authPage.clickLoginButton();
    await authPage.verifyInvalidLogin();
  });

  test("Negative Path - Invalid Password", async ({ authPage }) => {
    await authPage.fillEmail(userData.email);
    await authPage.fillPassword("invalid-password");
    await authPage.clickLoginButton();
    await authPage.verifyInvalidLogin();
  });

  test("Negative Path - Empty Credentials", async ({ authPage }) => {
    await authPage.clickLoginButton();
    await authPage.verifyEmailIsRequired();
    await authPage.verifyPasswordIsRequired();
  });

  test("Negative Path - Empty Email", async ({ authPage }) => {
    await authPage.fillPassword("password");
    await authPage.clickLoginButton();
    await authPage.verifyEmailIsRequired();
  });

  test("Negative Path - Empty Password", async ({ authPage }) => {
    await authPage.fillEmail(userData.email);
    await authPage.clickLoginButton();
    await authPage.verifyPasswordIsRequired();
  });
});
