export interface LocatorMap {
  readonly firstNameInput: string;
  readonly lastNameInput: string;
  readonly dobInput: string;
  readonly streetInput: string;
  readonly cityInput: string;
  readonly stateInput: string;
  readonly countrySelect: string;
  readonly phoneInput: string;
  readonly emailInput: string;
  readonly passwordInput: string;
  readonly postalCodeInput: string;
  readonly registerButton: string;
  readonly loginButton: string;
  readonly invalidEmailOrPasswordMessage: string;
  readonly emailIsRequiredMessage: string;
  readonly passwordIsRequiredMessage: string;
  readonly dobValidationMessage: string;
  readonly countryValidationMessage: string;
  readonly registerErrorMessage: string;
}

export const authPageLocators: LocatorMap = {
  firstNameInput: "first-name",
  lastNameInput: "last-name",
  dobInput: "dob",
  streetInput: "street",
  postalCodeInput: "postal_code",
  cityInput: "city",
  stateInput: "state",
  countrySelect: "country",
  phoneInput: "phone",
  emailInput: "email",
  passwordInput: "password",
  registerButton: "register-submit",
  loginButton: "Login",
  invalidEmailOrPasswordMessage: "login-error",
  emailIsRequiredMessage: "email-error",
  passwordIsRequiredMessage: "password-error",
  dobValidationMessage: "dob-error",
  countryValidationMessage: "country-error",
  registerErrorMessage: "register-error",
};
