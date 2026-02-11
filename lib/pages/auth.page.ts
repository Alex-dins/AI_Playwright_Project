import { type Page, type Locator, expect } from "@playwright/test";
import { BasePage } from "./base.page";
import { UserDomain } from "../interfaces/user-register.interface";
import { authPageLocators } from "../locators/auth-page.loc";
import { UserLogin } from "../types/types";

export class AuthPage extends BasePage {
  // Inputs and Buttons
  readonly firstNameInput = this.getByDataTest(authPageLocators.firstNameInput);
  readonly lastNameInput = this.getByDataTest(authPageLocators.lastNameInput);
  readonly dobInput = this.getByDataTest(authPageLocators.dobInput);
  readonly streetInput = this.getByDataTest(authPageLocators.streetInput);
  readonly postalCodeInput = this.getByDataTest(
    authPageLocators.postalCodeInput,
  );
  readonly cityInput = this.getByDataTest(authPageLocators.cityInput);
  readonly stateInput = this.getByDataTest(authPageLocators.stateInput);
  readonly countrySelect = this.getByDataTest(authPageLocators.countrySelect);
  readonly phoneInput = this.getByDataTest(authPageLocators.phoneInput);
  readonly registerButton = this.getByDataTest(authPageLocators.registerButton);
  readonly emailInput = this.getByDataTest(authPageLocators.emailInput);
  readonly passwordInput = this.getByDataTest(authPageLocators.passwordInput);
  readonly loginButton = this.getByRole("button", {
    name: authPageLocators.loginButton,
  });

  constructor(public page: Page) {
    super(page);
  }

  async fillRegistrationForm(
    userData: Partial<UserDomain>,
    options?: { skipFields?: string[] },
  ): Promise<void> {
    const fieldMap: Record<keyof UserDomain, () => Promise<void>> = {
      firstName: () => this.firstNameInput.fill(userData.firstName!),
      lastName: () => this.lastNameInput.fill(userData.lastName!),
      dateOfBirth: () => this.dobInput.fill(userData.dateOfBirth!),
      street: () => this.streetInput.fill(userData.street!),
      postalCode: () => this.postalCodeInput.fill(userData.postalCode!),
      city: () => this.cityInput.fill(userData.city!),
      state: () => this.stateInput.fill(userData.state!),
      country: async () => {
        await this.countrySelect.selectOption(userData.country!);
      },
      phone: () => this.phoneInput.fill(userData.phone!),
      email: () => this.emailInput.fill(userData.email!),
      password: () => this.passwordInput.fill(userData.password!),
    };

    const skipFields = options?.skipFields || [];

    for (const [field, fillAction] of Object.entries(fieldMap)) {
      if (
        !skipFields.includes(field) &&
        userData[field as keyof UserDomain] !== undefined
      ) {
        await fillAction();
      }
    }
  }

  async login(userData: UserLogin): Promise<void> {
    await this.fillEmail(userData.email);
    await this.fillPassword(userData.password);
    await this.clickLoginButton();
  }

  async clickLoginButton(): Promise<void> {
    await this.loginButton.click();
  }

  async clickRegisterButton(): Promise<void> {
    await this.registerButton.click();
  }

  async fillEmail(email: string): Promise<void> {
    await this.emailInput.fill(email);
  }

  async fillPassword(password: string): Promise<void> {
    await this.passwordInput.fill(password);
  }

  async selectCountry(countryCode: string): Promise<void> {
    await this.countrySelect.selectOption(countryCode);
  }

  async fillDob(dob: string): Promise<void> {
    await this.dobInput.fill(dob);
  }
}
