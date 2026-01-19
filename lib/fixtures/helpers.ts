import { test as api } from "./api";
import { UserLogin } from "../types/types";
import { Response } from "@playwright/test";

export type setupResponseOptions = {
  url: string;
  method: "GET" | "POST" | "PUT" | "DELETE";
  status: number;
};

export type HelperSetupFixtures = {
  authSetup: (credentials: UserLogin) => Promise<void>;
  waitForResponse: (setupOptions: setupResponseOptions) => Promise<Response>;
};

export const test = api.extend<HelperSetupFixtures>({
  authSetup: async ({ loginAccessToken, page }, use): Promise<void> => {
    const authSetup = async (credentials: UserLogin) => {
      const authToken = await loginAccessToken(credentials);
      await page.addInitScript((token) => {
        window.localStorage.setItem("auth-token", token);
      }, authToken);
    };

    await use(authSetup);
  },

  waitForResponse: async ({ page, apiBaseURL }, use) => {
    const waitForResponse = (
      setupOptions: setupResponseOptions
    ): Promise<Response> => {
      return page.waitForResponse(
        (response) =>
          response.url() === `${apiBaseURL}${setupOptions.url}` &&
          response.request().method() === setupOptions.method &&
          response.status() === setupOptions.status
      );
    };

    await use(waitForResponse);
  },
});

export { expect } from "@playwright/test";
