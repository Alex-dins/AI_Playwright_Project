import { type Page, type Locator, expect } from "@playwright/test";
import { BasePage } from "./base.page";
import { UserRegister } from "../interfaces/user-register.interface";
import { register } from "module";
import { authPageLocators } from "../locators/auth-page.loc";
import { UserLogin } from "../types/user-login.type";

export class AuthPage extends BasePage {
  constructor(public page: Page) {
    super(page);
  }

  async registerNewUser(userData: UserRegister): Promise<void> {
    const firstNameInput = this.page.getByTestId(
      authPageLocators.firstNameInput
    );
    const lastNameInput = this.page.getByTestId(authPageLocators.lastNameInput);
    const dobInput = this.page.getByTestId(authPageLocators.dobInput);
    const streetInput = this.page.getByTestId(authPageLocators.streetInput);
    const postalCodeInput = this.page.getByTestId(
      authPageLocators.postalCodeInput
    );
    const cityInput = this.page.getByTestId(authPageLocators.cityInput);
    const stateInput = this.page.getByTestId(authPageLocators.stateInput);
    const countrySelect = this.page.getByTestId(authPageLocators.countrySelect);
    const phoneInput = this.page.getByTestId(authPageLocators.phoneInput);
    const emailInput = this.page.getByTestId(authPageLocators.emailInput);
    const passwordInput = this.page.getByTestId(authPageLocators.passwordInput);
    const registerButton = this.page.getByTestId(
      authPageLocators.registerButton
    );
    await firstNameInput.fill(userData.firstName);
    await lastNameInput.fill(userData.lastName);
    await dobInput.fill(userData.dateOfBirth);
    await streetInput.fill(userData.street);
    await postalCodeInput.fill(userData.postalCode);
    await cityInput.fill(userData.city);
    await stateInput.fill(userData.state);
    await countrySelect.selectOption(userData.country);
    await phoneInput.fill(userData.phone);
    await emailInput.fill(userData.email);
    await passwordInput.fill(userData.password);
    await registerButton.click();
  }

  async login(userData: UserLogin): Promise<void> {
    const emailInput = this.page.getByTestId(authPageLocators.emailInput);
    const passwordInput = this.page.getByTestId(authPageLocators.passwordInput);
    const loginButton = this.page.getByRole("button", {
      name: authPageLocators.loginButton,
    });
    await emailInput.fill(userData.email);
    await passwordInput.fill(userData.password);
    await loginButton.click();
  }

  async verifySuccessfulRegistration() {
    await expect(this.page).toHaveURL(/.*\/auth\/login/);
    await expect(
      this.page.getByRole("heading", { name: "Login" })
    ).toBeVisible();
  }
}
