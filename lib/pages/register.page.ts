import { type Page, type Locator, expect } from "@playwright/test";
import { BasePage } from "./base.page";
import { UserRegister } from "../interfaces/user-register.interface";
import { register } from "module";
import { registerPageLocators } from "../locators/register-page.loc";

export class RegistrationPage extends BasePage {
  constructor(public page: Page) {
    super(page);
  }

  async registerNewUser(userData: UserRegister): Promise<void> {
    const firstNameInput = this.page.getByTestId(
      registerPageLocators.firstNameInput
    );
    const lastNameInput = this.page.getByTestId(
      registerPageLocators.lastNameInput
    );
    const dobInput = this.page.getByTestId(registerPageLocators.dobInput);
    const streetInput = this.page.getByTestId(registerPageLocators.streetInput);
    const postalCodeInput = this.page.getByTestId(
      registerPageLocators.postalCodeInput
    );
    const cityInput = this.page.getByTestId(registerPageLocators.cityInput);
    const stateInput = this.page.getByTestId(registerPageLocators.stateInput);
    const countrySelect = this.page.getByTestId(
      registerPageLocators.countrySelect
    );
    const phoneInput = this.page.getByTestId(registerPageLocators.phoneInput);
    const emailInput = this.page.getByTestId(registerPageLocators.emailInput);
    const passwordInput = this.page.getByTestId(
      registerPageLocators.passwordInput
    );
    const registerButton = this.page.getByTestId(
      registerPageLocators.registerButton
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

  async verifySuccessfulRegistration() {
    await expect(this.page).toHaveURL(/.*\/auth\/login/);
    await expect(
      this.page.getByRole("heading", { name: "Login" })
    ).toBeVisible();
  }
}
