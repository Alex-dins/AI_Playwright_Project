import { type Page, type Locator, expect } from "@playwright/test";
import { BasePage } from "./base.page";

export class MyAccountPage extends BasePage {
  readonly myAccountHeading = this.getByRole("heading", {
    name: "My account",
  });

  constructor(public page: Page) {
    super(page);
  }
}
