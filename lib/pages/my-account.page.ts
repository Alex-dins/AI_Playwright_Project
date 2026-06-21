import { type Page, type Locator } from "@playwright/test";
import { BasePage } from "./base.page";

export class MyAccountPage extends BasePage {
  readonly myAccountHeading: Locator = this.getByRole("heading", { name: "My account" });
  readonly profileNameHeading: Locator = this.page.locator('[data-test="page-title"]');
  readonly navFavourites: Locator = this.page.locator('[data-test="nav-favourites"]');
  readonly navOrders: Locator = this.page.locator('[data-test="nav-orders"]');
  readonly navProfile: Locator = this.page.locator('[data-test="nav-menu"]');
  readonly invoicesLink: Locator = this.page.locator('[data-test="nav-invoices"]');

  constructor(public page: Page) {
    super(page);
  }
}
