import type { Route } from "@playwright/test";
import { expect, test } from "../../lib/fixtures/setup.fixtures";
import { apiUserData } from "../../lib/mappers/user.mapper";
import { VALIDATION_MESSAGES } from "../../lib/constants/validation-messages";
import { pageUrls } from "../../lib/constants/page-urls";

test.describe("Registration Test", () => {
  test.beforeEach(async ({ basePage }) => {
    await basePage.goTo("/auth/register");
  });

  test("Happy Path - Successful Registration", async ({
    authPage,
    waitForResponse,
    generateUserData,
  }) => {
    const registeredResponsePromise = waitForResponse({
      url: "/users/register",
      method: "POST",
      status: 201,
    });
    await authPage.fillRegistrationForm(generateUserData());
    await authPage.clickRegisterButton();

    await registeredResponsePromise;
    await authPage.checkPageUrl(pageUrls.login);
  });

  test("Negative Path - Required Fields Validation", async ({
    basePage,
    authPage,
    page,
    generateUserData,
  }) => {
    const userEmail = generateUserData().email;
    const requiredErrors = [
      VALIDATION_MESSAGES.REQUIRED.FIRST_NAME,
      VALIDATION_MESSAGES.REQUIRED.LAST_NAME,
      VALIDATION_MESSAGES.REQUIRED.DOB,
      VALIDATION_MESSAGES.REQUIRED.STREET,
      VALIDATION_MESSAGES.REQUIRED.POSTCODE,
      VALIDATION_MESSAGES.REQUIRED.CITY,
      VALIDATION_MESSAGES.REQUIRED.STATE,
      VALIDATION_MESSAGES.REQUIRED.COUNTRY,
      VALIDATION_MESSAGES.REQUIRED.PHONE,
      VALIDATION_MESSAGES.REQUIRED.EMAIL,
      VALIDATION_MESSAGES.REQUIRED.PASSWORD,
    ];

    let registerCallCount = 0;
    await page.route("**/users/register", async (route: Route) => {
      registerCallCount += 1;
      await route.continue();
    });

    await authPage.clickRegisterButton();
    await authPage.fillEmail(userEmail);

    await expect(
      authPage.getByText(VALIDATION_MESSAGES.REQUIRED.EMAIL),
    ).not.toBeVisible();

    await authPage.fillEmail("");

    for (const message of requiredErrors) {
      await expect(authPage.getByText(message)).toBeVisible();
    }
    await authPage.checkPageUrl(pageUrls.register);
    expect(registerCallCount).toBe(0);
  });

  test("Negative Path - Date of Birth Format Validation", async ({
    authPage,
    page,
    generateUserData,
  }) => {
    const invalidDobUser = generateUserData();
    invalidDobUser.dateOfBirth = "13/32/1980";

    await authPage.fillRegistrationForm(invalidDobUser);
    await authPage.clickRegisterButton();

    await expect(
      authPage.getByText(VALIDATION_MESSAGES.FORMAT.DOB),
    ).toBeVisible();
    await authPage.checkPageUrl(pageUrls.register);

    await authPage.fillDob("2099-01-01");
    await authPage.clickRegisterButton();

    await expect(
      authPage.getByText(VALIDATION_MESSAGES.FORMAT.DOB_MINIMUM_AGE),
    ).toBeVisible();
    await expect(
      authPage.getByText(VALIDATION_MESSAGES.FORMAT.DOB),
    ).not.toBeVisible();
    await authPage.checkPageUrl(pageUrls.register);

    await authPage.fillDob("1995-06-15");
    await authPage.clickRegisterButton();

    await expect(
      authPage.getByText(VALIDATION_MESSAGES.FORMAT.DOB_MINIMUM_AGE),
    ).not.toBeVisible();
    await authPage.checkPageUrl(pageUrls.login);
  });

  test("Negative Path - Country Requirement", async ({
    authPage,
    page,
    generateUserData,
  }) => {
    const userData = generateUserData();
    await authPage.fillRegistrationForm(userData, {
      skipFields: ["country", "firstName"],
    });
    await authPage.clickRegisterButton();

    await expect(
      authPage.getByText(VALIDATION_MESSAGES.REQUIRED.COUNTRY),
    ).toBeVisible();
    await authPage.checkPageUrl(pageUrls.register);

    await authPage.selectCountry(userData.country);
    await authPage.clickRegisterButton();

    await expect(
      authPage.getByText(VALIDATION_MESSAGES.REQUIRED.COUNTRY),
    ).not.toBeVisible();
  });

  test("Negative Path - Invalid Email Format", async ({
    authPage,
    page,
    generateUserData,
  }) => {
    const invalidEmailUser = generateUserData({ email: "invalid-email" });

    await authPage.fillRegistrationForm(invalidEmailUser);
    await authPage.clickRegisterButton();

    await authPage.checkPageUrl(pageUrls.register);
    await expect(
      authPage.getByText(VALIDATION_MESSAGES.FORMAT.EMAIL),
    ).toBeVisible();
    await expect(authPage.emailInput).toHaveValue("invalid-email");
  });

  test("Negative Path - Password Policy Enforcement", async ({
    authPage,
    page,
    generateUserData,
  }) => {
    const weakPasswordCases = [
      "password#1", // missing uppercase
      "Passwordwithoutnumber!", // missing digit
      "Password1", // missing special character
      "P#1s", // too short
    ];
    const weakPasswordUser = generateUserData({ password: " " });
    await authPage.fillRegistrationForm(weakPasswordUser);

    for (const weakPassword of weakPasswordCases) {
      weakPasswordUser.password = weakPassword;
      await authPage.fillPassword(weakPassword);
      await authPage.clickRegisterButton();
      await authPage.checkPageUrl(pageUrls.register);
      await expect(
        authPage
          .getByText(VALIDATION_MESSAGES.FORMAT.PASSWORD_SPECIAL_CHAR)
          .or(authPage.getByText(VALIDATION_MESSAGES.LENGTH.PASSWORD_MIN)),
      ).toBeVisible();
    }
  });

  test("Negative Path - Phone Number Validation", async ({
    authPage,
    page,
    waitForResponse,
    generateUserData,
  }) => {
    const invalidPhoneUser = generateUserData({
      phone: "ABC-DEF",
    });
    await authPage.fillRegistrationForm(invalidPhoneUser);
    await authPage.clickRegisterButton();

    await authPage.checkPageUrl(pageUrls.register);
    await expect(
      authPage.getByText(VALIDATION_MESSAGES.FORMAT.PHONE_NUMBERS_ONLY),
    ).toBeVisible();

    await authPage.phoneInput.fill("1234567890");
    await expect(
      authPage.getByText(VALIDATION_MESSAGES.FORMAT.PHONE_NUMBERS_ONLY),
    ).not.toBeVisible();

    const successResponse = waitForResponse({
      url: "/users/register",
      method: "POST",
      status: 201,
    });

    await authPage.clickRegisterButton();
    await successResponse;

    await authPage.checkPageUrl(pageUrls.login);
  });

  test("Negative Path - Postal Code Length Validation", async ({
    authPage,
    page,
    waitForResponse,
    generateUserData,
  }) => {
    const invalidPostalUser = generateUserData({
      postalCode: "12345678901234567890",
    });
    await authPage.fillRegistrationForm(invalidPostalUser);

    const postalCodeErrorResponse = waitForResponse({
      url: "/users/register",
      method: "POST",
      status: 422,
    });

    await authPage.clickRegisterButton();
    await postalCodeErrorResponse;

    await authPage.checkPageUrl(pageUrls.register);
    await expect(
      authPage.getByText(VALIDATION_MESSAGES.FORMAT.POSTCODE_LENGTH_EXCEEDED),
    ).toBeVisible();

    await authPage.postalCodeInput.fill("12345");
    const successResponse = waitForResponse({
      url: "/users/register",
      method: "POST",
      status: 201,
    });

    await authPage.clickRegisterButton();
    await successResponse;
    await expect(
      authPage.getByText(VALIDATION_MESSAGES.FORMAT.POSTCODE_LENGTH_EXCEEDED),
    ).not.toBeVisible();
    await authPage.checkPageUrl(pageUrls.login);
  });

  test("Negative Path - Duplicate Email Registration", async ({
    authPage,
    page,
    registerNewUser,
    waitForResponse,
    generateUserData,
  }) => {
    const masterUser = generateUserData();
    await registerNewUser(apiUserData(masterUser));

    const registrationErrorResponse = waitForResponse({
      url: "/users/register",
      method: "POST",
      status: 422,
    });

    const existingUserAttempt = generateUserData({ email: masterUser.email });
    await authPage.fillRegistrationForm(existingUserAttempt);

    await authPage.clickRegisterButton();
    await registrationErrorResponse;

    await authPage.checkPageUrl(pageUrls.register);
    await expect(
      authPage.getByText(VALIDATION_MESSAGES.FORMAT.EMAIL_ALREADY_EXISTS),
    ).toBeVisible();
    await expect(authPage.emailInput).toHaveValue(masterUser.email);
  });

  test("Negative Path - Server Error Handling", async ({
    authPage,
    page,
    waitForResponse,
    generateUserData,
  }) => {
    const failureHandler = async (route: Route) => {
      if (route.request().method() === "POST") {
        await route.fulfill({
          status: 500,
          body: JSON.stringify({
            message: ["Internal server error"],
          }),
          headers: {
            "Content-Type": "application/json, text/plain, */*",
          },
        });
      } else {
        await route.continue();
      }
    };
    await page.route("**/users/register", failureHandler);

    const errorUser = generateUserData();
    await authPage.fillRegistrationForm(errorUser);
    const errorResponse = waitForResponse({
      url: "/users/register",
      method: "POST",
      status: 500,
    });

    await authPage.clickRegisterButton();
    await errorResponse;
    await authPage.checkPageUrl(pageUrls.register);
    await expect(
      authPage.getByText(VALIDATION_MESSAGES.SERVER_ERROR),
    ).toBeVisible();
    await expect(authPage.firstNameInput).toHaveValue(errorUser.firstName);

    page.unroute("**/users/register", failureHandler);
    const recoveryResponse = waitForResponse({
      url: "/users/register",
      method: "POST",
      status: 201,
    });

    await authPage.registerButton.click();
    await recoveryResponse;
    await authPage.checkPageUrl(pageUrls.login);
  });
});
