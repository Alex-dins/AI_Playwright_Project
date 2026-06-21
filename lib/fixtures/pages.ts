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
    await use(new BasePage(page));
  },

  authPage: async ({ page }, use) => {
    await use(new AuthPage(page));
  },

  myAccountPage: async ({ page }, use) => {
    await use(new MyAccountPage(page));
  },
});

export { expect } from "@playwright/test";
