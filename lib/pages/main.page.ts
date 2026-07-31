import { type Page, type Locator } from "@playwright/test";
import { BasePage } from "./base.page";
import { mainPageLocators } from "../locators/main-page.loc";

export class MainPage extends BasePage {
  readonly searchInput: Locator = this.getByDataTest(mainPageLocators.searchInput);
  readonly searchButton: Locator = this.getByDataTest(mainPageLocators.searchButton);
  readonly searchCaption: Locator = this.getByDataTest(mainPageLocators.searchCaption);
  readonly searchResultCount: Locator = this.getByDataTest(mainPageLocators.searchResultCount);
  readonly searchCompleted: Locator = this.getByDataTest(mainPageLocators.searchCompleted);
  readonly searchReset: Locator = this.getByDataTest(mainPageLocators.searchReset);
  readonly productNames: Locator = this.getByDataTest(mainPageLocators.productName);

  constructor(public page: Page) {
    super(page);
  }

  async search(term: string): Promise<void> {
    await this.searchInput.fill(term);
    await this.searchButton.click();
  }

  async searchByEnter(term: string): Promise<void> {
    await this.searchInput.fill(term);
    await this.searchInput.press("Enter");
  }
}
