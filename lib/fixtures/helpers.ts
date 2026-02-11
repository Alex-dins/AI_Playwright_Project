import { test as api } from "./api";
import { UserLogin } from "../types/types";
import { Response } from "@playwright/test";
import { generateUserData } from "../data-factory/new-user.data";
import { UserDomain } from "../interfaces/user-register.interface";

export type setupResponseOptions = {
  url: string;
  method: "GET" | "POST" | "PUT" | "DELETE";
  status: number;
};

export type HelperSetupFixtures = {
  authSetup: (credentials: UserLogin) => Promise<void>;
  waitForResponse: (setupOptions: setupResponseOptions) => Promise<Response>;
  generateUserData: (overrides?: Partial<UserDomain>) => UserDomain;
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
      setupOptions: setupResponseOptions,
    ): Promise<Response> => {
      return page.waitForResponse(
        (response) =>
          response.url() === `${apiBaseURL}${setupOptions.url}` &&
          response.request().method() === setupOptions.method &&
          response.status() === setupOptions.status,
      );
    };

    await use(waitForResponse);
  },

  generateUserData: async ({}, use) => {
    const userData = (overrides: Partial<UserDomain> = {}): UserDomain => {
      return generateUserData(overrides);
    };
    await use(userData);
  },
});

export { expect } from "@playwright/test";
