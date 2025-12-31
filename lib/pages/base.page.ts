import { Locator, type Page } from "@playwright/test";

export class BasePage {
  constructor(public page: Page) {}

  async goTo(url: string): Promise<void> {
    await this.page.goto(url);
  }

  getByDataTest(testId: string | RegExp): Locator {
    return this.page.getByTestId(testId);
  }

  getByRole(
    role: Parameters<Page["getByRole"]>[0],
    options?: { name?: string | RegExp; exact?: boolean }
  ): Locator {
    return this.page.getByRole(role, options);
  }
}
