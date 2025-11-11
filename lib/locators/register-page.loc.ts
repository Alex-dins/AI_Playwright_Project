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
}

export const registerPageLocators: LocatorMap = {
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
};
