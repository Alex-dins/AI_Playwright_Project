import { Locator, type Page, expect } from "@playwright/test";

export class BasePage {
  constructor(public readonly page: Page) {}

  async goTo(url: string): Promise<void> {
    await this.page.goto(url);
  }

  getByDataTest(testId: string | RegExp): Locator {
    return this.page.getByTestId(testId);
  }

  getByRole(
    role: Parameters<Page["getByRole"]>[0],
    options?: { name?: string | RegExp; exact?: boolean },
  ): Locator {
    return this.page.getByRole(role, options);
  }

  getByText(text: string | RegExp, options?: { exact?: boolean }): Locator {
    return this.page.getByText(text, options);
  }

  async checkPageUrl(expectedUrl: string | RegExp): Promise<void> {
    await expect(this.page).toHaveURL(expectedUrl);
  }
}
