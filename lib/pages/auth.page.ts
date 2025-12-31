import { type Page, type Locator, expect } from "@playwright/test";
import { BasePage } from "./base.page";
import { UserRegister } from "../interfaces/user-register.interface";
import { authPageLocators } from "../locators/auth-page.loc";
import { UserLogin } from "../types/types";

export class AuthPage extends BasePage {
  readonly firstNameInput = this.getByDataTest(authPageLocators.firstNameInput);
  readonly lastNameInput = this.getByDataTest(authPageLocators.lastNameInput);
  readonly dobInput = this.getByDataTest(authPageLocators.dobInput);
  readonly streetInput = this.getByDataTest(authPageLocators.streetInput);
  readonly postalCodeInput = this.getByDataTest(
    authPageLocators.postalCodeInput
  );
  readonly cityInput = this.getByDataTest(authPageLocators.cityInput);
  readonly stateInput = this.getByDataTest(authPageLocators.stateInput);
  readonly countrySelect = this.getByDataTest(authPageLocators.countrySelect);
  readonly phoneInput = this.getByDataTest(authPageLocators.phoneInput);
  readonly registerButton = this.getByDataTest(authPageLocators.registerButton);
  readonly invalidEmailOrPasswordMessage = this.getByDataTest(
    authPageLocators.invalidEmailOrPasswordMessage
  );
  readonly emailIsRequiredMessage = this.getByDataTest(
    authPageLocators.emailIsRequiredMessage
  );
  readonly passwordIsRequiredMessage = this.getByDataTest(
    authPageLocators.passwordIsRequiredMessage
  );
  readonly emailInput = this.getByDataTest(authPageLocators.emailInput);
  readonly passwordInput = this.getByDataTest(authPageLocators.passwordInput);
  readonly loginButton = this.getByRole("button", {
    name: authPageLocators.loginButton,
  });

  constructor(public page: Page) {
    super(page);
  }

  async registerNewUser(userData: UserRegister): Promise<void> {
    await this.firstNameInput.fill(userData.firstName);
    await this.lastNameInput.fill(userData.lastName);
    await this.dobInput.fill(userData.dateOfBirth);
    await this.streetInput.fill(userData.street);
    await this.postalCodeInput.fill(userData.postalCode);
    await this.cityInput.fill(userData.city);
    await this.stateInput.fill(userData.state);
    await this.countrySelect.selectOption(userData.country);
    await this.phoneInput.fill(userData.phone);
    await this.emailInput.fill(userData.email);
    await this.passwordInput.fill(userData.password);
    await this.registerButton.click();
  }

  async login(userData: UserLogin): Promise<void> {
    await this.fillEmail(userData.email);
    await this.fillPassword(userData.password);
    await this.clickLoginButton();
  }

  async clickLoginButton(): Promise<void> {
    await this.loginButton.click();
  }

  async fillEmail(email: string): Promise<void> {
    await this.emailInput.fill(email);
  }

  async fillPassword(password: string): Promise<void> {
    await this.passwordInput.fill(password);
  }
}
