import { expect, test } from "../lib/fixtures/setup.fixtures";

test.describe("Search functionalyty tests", () => {
  const userData = {
    email: process.env.customerUsername!,
    password: process.env.customerPassword!,
  };

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
        url: `/products/search`,
        method: "QUERY",
        status: 200,
      }),
      mainPage.search(searchTerm),
    ]);

    await expect(mainPage.searchCaption).toHaveText(
      `Searched for: ${searchTerm}`,
    );
    await expect(mainPage.productNames.first()).toBeVisible();
    const productCount = await mainPage.productNames.count();
    expect(productCount).toBeGreaterThan(0);

    const titles = await mainPage.productNames.allTextContents();
    for (const title of titles) {
      expect(title.toLowerCase()).toContain(searchTerm.toLowerCase());
    }
  });

  test("search negative - no results", async ({
    mainPage,
    components,
    waitForResponse,
  }) => {
    await mainPage.goTo("");
    await expect(components.navHome).toBeVisible();

    const searchTerm = "xyznonexistent123";

    await Promise.all([
      waitForResponse({
        url: `/products/search`,
        method: "QUERY",
        status: 200,
      }),
      mainPage.search(searchTerm),
    ]);

    await expect(mainPage.searchCaption).toHaveText(
      `Searched for: ${searchTerm}`,
    );
    await expect(mainPage.searchCompleted).toHaveText(
      "There are no products found.",
    );
    const productCount = await mainPage.productNames.count();
    expect(productCount).toBe(0);
  });

  test("search by pressing Enter", async ({
    mainPage,
    components,
    waitForResponse,
  }) => {
    await mainPage.goTo("");
    await expect(components.navHome).toBeVisible();

    const searchTerm = "Wrench";

    await Promise.all([
      waitForResponse({
        url: `/products/search`,
        method: "QUERY",
        status: 200,
      }),
      mainPage.searchByEnter(searchTerm),
    ]);

    await expect(mainPage.searchCaption).toHaveText(
      `Searched for: ${searchTerm}`,
    );
    await expect(mainPage.productNames.first()).toBeVisible();
    const productCount = await mainPage.productNames.count();
    expect(productCount).toBeGreaterThan(0);

    const titles = await mainPage.productNames.allTextContents();
    for (const title of titles) {
      expect(title.toLowerCase()).toContain(searchTerm.toLowerCase());
    }
  });

  test("search and clear resets results", async ({
    mainPage,
    components,
    waitForResponse,
  }) => {
    await mainPage.goTo("");
    await expect(components.navHome).toBeVisible();

    const searchTerm = "Hammer";

    await Promise.all([
      waitForResponse({
        url: `/products/search`,
        method: "QUERY",
        status: 200,
      }),
      mainPage.search(searchTerm),
    ]);

    await expect(mainPage.searchCaption).toHaveText(
      `Searched for: ${searchTerm}`,
    );
    await expect(mainPage.productNames.first()).toBeVisible();

    await Promise.all([
      waitForResponse({
        url: `/products`,
        method: "QUERY",
        status: 200,
      }),
      mainPage.searchReset.click(),
    ]);

    await expect(mainPage.searchCaption).not.toBeVisible();
    await expect(mainPage.searchInput).toHaveValue("");
    await expect(mainPage.productNames.first()).toBeVisible();
    const resetProductCount = await mainPage.productNames.count();
    expect(resetProductCount).toBeGreaterThan(0);
  });

  test("search happy path as logged user", async ({
    authSetup,
    mainPage,
    components,
    waitForResponse,
  }) => {
    await authSetup(userData);
    await mainPage.goTo("");
    await expect(components.navMenu).toContainText("Jack Howe");

    const searchTerm = "Drill";

    await Promise.all([
      waitForResponse({
        url: `/products/search`,
        method: "QUERY",
        status: 200,
      }),
      mainPage.search(searchTerm),
    ]);

    await expect(mainPage.searchCaption).toHaveText(
      `Searched for: ${searchTerm}`,
    );
    await expect(mainPage.productNames.first()).toBeVisible();
    const productCount = await mainPage.productNames.count();
    expect(productCount).toBeGreaterThan(0);

    const titles = await mainPage.productNames.allTextContents();
    for (const title of titles) {
      expect(title.toLowerCase()).toContain(searchTerm.toLowerCase());
    }
  });
});
