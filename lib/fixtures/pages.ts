import { test as base } from "@playwright/test";
import { BasePage } from "../pages/base.page";
import { AuthPage } from "../pages/auth.page";
import { MyAccountPage } from "../pages/my-account.page";
import { CartPage } from "../pages/cart.page";
import { SearchPage } from "../pages/search.page";

export type pageFixtures = {
  basePage: BasePage;
  authPage: AuthPage;
  myAccountPage: MyAccountPage;
  cartPage: CartPage;
  searchPage: SearchPage;
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

  cartPage: async ({ page }, use) => {
    await use(new CartPage(page));
  },

  searchPage: async ({ page }, use) => {
    await use(new SearchPage(page));
  },
});

export { expect } from "@playwright/test";
