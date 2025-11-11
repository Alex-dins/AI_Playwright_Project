import { type Page, type Locator, expect } from "@playwright/test";

export class BasePage {
  constructor(public page: Page) {}

  async goTo(url: string): Promise<void> {
    await this.page.goto(url);
  }
}
