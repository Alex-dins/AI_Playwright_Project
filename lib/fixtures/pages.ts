import { test as base } from "@playwright/test";
import { BasePage } from "../pages/base.page";
import { AuthPage } from "../pages/auth.page";
import { MyAccountPage } from "../pages/my-account.page";

export type pageFixtures = {
  basePage: BasePage;
  authPage: AuthPage;
  myAccountPage: MyAccountPage;
};

export const test = base.extend<pageFixtures>({
  basePage: async ({ page }, use) => {
    const basePage = new BasePage(page);
    await use(basePage);
  },

  authPage: async ({ page }, use) => {
    const authPage = new AuthPage(page);
    await use(authPage);
  },

  myAccountPage: async ({ page }, use) => {
    const myAccountPage = new MyAccountPage(page);
    await use(myAccountPage);
  },
});

export { expect } from "@playwright/test";
