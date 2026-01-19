import { generateUserData } from "../../lib/data-factory/new-user.data";
import type { UserDomain } from "../../lib/interfaces/user-register.interface";
import type { AuthPage } from "../../lib/pages/auth.page";
import type { Response, Route } from "@playwright/test";
import { expect, test } from "../../lib/fixtures/setup.fixtures";
import { apiUserData } from "../../lib/mappers/user.mapper";

test.describe("Registration Test", () => {
  const userData = generateUserData();

  test.beforeEach(async ({ basePage }) => {
    await basePage.goTo("/auth/register");
  });

  test("Happy Path - Successful Registration", async ({
    authPage,
    page,
    waitForResponse,
  }) => {
    const registeredResponsePromise = waitForResponse({
      url: "/users/register",
      method: "POST",
      status: 201,
    });
    await authPage.fillRegistrationForm(userData);
    await authPage.clickRegisterButton();

    await registeredResponsePromise;
    await expect(page).toHaveURL(/.*\/auth\/login/);
  });

  test("Negative Path - Required Fields Validation", async ({
    authPage,
    page,
  }) => {
    const requiredErrors = [
      "First name is required",
      "Last name is required",
      "Date of Birth is required",
      "Street is required",
      "Postcode is required",
      "City is required",
      "State is required",
      "Country is required",
      "Phone is required",
      "Email is required",
      "Password is required",
    ];

    let registerCallCount = 0;
    await page.route("**/users/register", async (route: Route) => {
      registerCallCount += 1;
      await route.continue();
    });

    await authPage.clickRegisterButton();
    await authPage.fillEmail(userData.email);

    await expect(authPage.emailIsRequiredMessage).not.toBeVisible();

    await authPage.fillEmail("");

    for (const message of requiredErrors) {
      await expect(page.getByText(message)).toBeVisible();
    }
    await expect(page).toHaveURL(/.*\/auth\/register/);
    expect(registerCallCount).toBe(0);
  });

  test("Negative Path - Date of Birth Format Validation", async ({
    authPage,
    page,
  }) => {
    const invalidDobUser = generateUserData();
    invalidDobUser.dateOfBirth = "13/32/1980";

    await authPage.fillRegistrationForm(invalidDobUser);
    await authPage.registerButton.click();

    await expect(authPage.dobValidationMessage).toHaveText(
      "Please enter a valid date in YYYY-MM-DD format.",
    );
    await expect(page).toHaveURL(/.*\/auth\/register/);

    await authPage.fillDob("2099-01-01");
    await authPage.registerButton.click();

    await expect(authPage.registerErrorMessage).toHaveText(
      "Customer must be 18 years old.",
    );
    await expect(authPage.dobValidationMessage).not.toBeVisible();
    await expect(page).toHaveURL(/.*\/auth\/register/);

    await authPage.fillDob("1995-06-15");
    await authPage.clickRegisterButton();

    await expect(authPage.registerErrorMessage).not.toBeVisible();
    await expect(page).toHaveURL(/.*\/auth\/login/);
  });

  test("Negative Path - Country Requirement", async ({ authPage, page }) => {
    const userData = generateUserData();
    await authPage.fillRegistrationForm(userData, {
      skipFields: ["country", "firstName"],
    });
    await authPage.clickRegisterButton();

    await expect(authPage.countryValidationMessage).toHaveText(
      "Country is required",
    );
    await expect(page).toHaveURL(/.*\/auth\/register/);

    await authPage.selectCountry(userData.country);
    await authPage.clickRegisterButton();

    await expect(authPage.countryValidationMessage).not.toBeVisible();
  });

  test("Negative Path - Invalid Email Format", async ({ authPage, page }) => {
    const invalidEmailUser = generateUserData({ email: "invalid-email" });

    await authPage.fillRegistrationForm(invalidEmailUser);
    await authPage.clickRegisterButton();

    await expect(page).toHaveURL(/.*\/auth\/register/);
    await expect(page.getByText("Email format is invalid")).toBeVisible();
    await expect(authPage.emailInput).toHaveValue("invalid-email");
  });

  test("Negative Path - Password Policy Enforcement", async ({
    basePage,
    authPage,
    page,
  }) => {
    const weakPasswordCases = [
      "password#1", // missing uppercase
      "Passwordwithoutnumber!", // missing digit
      "Password1", // missing special character
      "P#1s", // too short
    ];

    for (const weakPassword of weakPasswordCases) {
      const weakPasswordUser = generateUserData();
      weakPasswordUser.password = weakPassword;
      await authPage.fillRegistrationForm(weakPasswordUser);

      await authPage.clickRegisterButton();
      await expect(page).toHaveURL(/.*\/auth\/register/);
      await expect(authPage.passwordInput).toHaveAttribute(
        "aria-invalid",
        "true",
      );
      await expect(page.getByText(/password.*must/i)).toBeVisible();
    }
  });

  test("Negative Path - Phone and Postal Formatting", async ({
    authPage,
    page,
  }) => {
    const invalidPhone = generateUserData({
      phone: "ABC-DEF",
      postalCode: "ABCDE",
    });
    await authPage.fillRegistrationForm(invalidPhone);
    await authPage.clickRegisterButton();

    await expect(page).toHaveURL(/.*\/auth\/register/);
    await expect(authPage.phoneInput).toHaveAttribute("aria-invalid", "true");
    await expect(authPage.postalCodeInput).toHaveAttribute(
      "aria-invalid",
      "true",
    );

    const longPostalAndPhone = generateUserData({
      phone: "1234567890",
      postalCode: "12345678901234567890",
    });
    await authPage.fillRegistrationForm(longPostalAndPhone);
    await authPage.clickRegisterButton();

    await expect(page).toHaveURL(/.*\/auth\/register/);
    await expect(authPage.postalCodeInput).toHaveAttribute(
      "aria-invalid",
      "true",
    );
  });

  test("Negative Path - Duplicate Email Registration", async ({
    authPage,
    page,
    registerNewUser,
    waitForResponse,
  }) => {
    let masterUser = generateUserData();
    await registerNewUser(apiUserData(masterUser));

    const duplicateResponse = waitForResponse({
      url: "/users/register",
      method: "POST",
      status: 422,
    });

    const duplicateAttempt = generateUserData({ email: masterUser.email });
    await authPage.fillRegistrationForm(duplicateAttempt);

    await authPage.clickRegisterButton();
    await duplicateResponse;

    await expect(page).toHaveURL(/.*\/auth\/register/);
    await expect(
      page.getByText("A customer with this email address already exists."),
    ).toBeVisible(); //data-test="register-error"
    await expect(authPage.emailInput).toHaveValue(masterUser.email);
  });

  test("Negative Path - Server Error Handling", async ({
    authPage,
    page,
    waitForResponse,
  }) => {
    const failureHandler = async (route: Route) => {
      if (route.request().method() === "POST") {
        await route.fulfill({
          status: 500,
          body: JSON.stringify({
            message: "Internal server error",
          }),
          headers: {
            "Content-Type": "application/json",
          },
        });
      } else {
        await route.continue();
      }
    };
    await page.route("**/users/register", failureHandler);

    const errorUser = generateUserData();
    await authPage.fillRegistrationForm(errorUser);
    await authPage.clickRegisterButton();

    await page.waitForResponse(
      (response) =>
        response.request().method() === "POST" &&
        response.url().includes("/users/register") &&
        response.status() === 500,
    );
    await expect(page).toHaveURL(/.*\/auth\/register/);
    await expect(page.getByText(/something went wrong/i)).toBeVisible();
    await expect(authPage.firstNameInput).toHaveValue(errorUser.firstName);

    page.unroute("**/users/register", failureHandler);
    const recoveryResponse = waitForResponse({
      url: "/users/register",
      method: "POST",
      status: 201,
    });

    await authPage.registerButton.click();
    await recoveryResponse;
    await expect(page).toHaveURL(/.*\/auth\/login/);
  });
});
