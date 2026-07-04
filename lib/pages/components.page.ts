import { type Page, type Locator } from "@playwright/test";
import { BasePage } from "./base.page";
import { componentsLocators } from "../locators/components.loc";

export class Components extends BasePage {
  readonly navHome: Locator = this.getByDataTest(componentsLocators.navHome);

  constructor(public page: Page) {
    super(page);
  }
}
