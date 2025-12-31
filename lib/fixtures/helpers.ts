import { test as api } from "./api";
import { UserLogin, UserRegister } from "../types/types";

export type AuthSetupOptions = {
  authSetup: (credentials: UserLogin) => Promise<void>;
};

export const test = api.extend<AuthSetupOptions>({
  authSetup: async ({ loginAccessToken, page }, use): Promise<void> => {
    const setup = async (credentials: UserLogin) => {
      const authToken = await loginAccessToken(credentials);
      await page.addInitScript((token) => {
        window.localStorage.setItem("auth-token", token);
      }, authToken);
    };

    await use(setup);
  },
});

export { expect } from "@playwright/test";
