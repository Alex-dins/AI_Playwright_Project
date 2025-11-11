import { test as base } from "@playwright/test";
import { BasePage } from "../pages/base.page";
import { RegistrationPage } from "../pages/register.page";

export type pageFixtures = {
  basePage: BasePage;
  registerPage: RegistrationPage;
};

export const test = base.extend<pageFixtures>({
  basePage: async ({ page }, use) => {
    const basePage = new BasePage(page);
    await use(basePage);
  },

  registerPage: async ({ page }, use) => {
    const registerPage = new RegistrationPage(page);
    await use(registerPage);
  },
});

export { expect } from "@playwright/test";
