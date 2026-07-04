import { expect, test } from "../lib/fixtures/setup.fixtures";

test.describe("Search functionally tests", () => {
  test("search happy path", async ({
    mainPage,
    components,
    waitForResponse,
  }) => {
    await mainPage.goTo("");
    await expect(components.navHome).toBeVisible();

    const searchTerm = "Hammer";

    await Promise.all([
      waitForResponse({
        url: `/products/search?q=${searchTerm}`,
        method: "GET",
        status: 200,
      }),
      mainPage.search(searchTerm),
    ]);

    await expect(mainPage.searchCaption).toHaveText(
      `Searched for: ${searchTerm}`,
    );
    await expect(mainPage.productNames.first()).toBeVisible();
    expect(await mainPage.productNames.count()).toBeGreaterThan(0);

    const titles = await mainPage.productNames.allTextContents();
    for (const title of titles) {
      expect(title.toLowerCase()).toContain(searchTerm.toLowerCase());
    }
  });
});
