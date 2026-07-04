import { test as base } from "@playwright/test";
import { BasePage } from "../pages/base.page";
import { AuthPage } from "../pages/auth.page";
import { MyAccountPage } from "../pages/my-account.page";
import { MainPage } from "../pages/main.page";
import { Components } from "../pages/components.page";

export type pageFixtures = {
  basePage: BasePage;
  authPage: AuthPage;
  myAccountPage: MyAccountPage;
  mainPage: MainPage;
  components: Components;
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

  mainPage: async ({ page }, use) => {
    await use(new MainPage(page));
  },

  components: async ({ page }, use) => {
    await use(new Components(page));
  },
});

export { expect } from "@playwright/test";
