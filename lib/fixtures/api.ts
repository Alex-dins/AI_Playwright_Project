import { request, APIRequestContext, APIResponse } from "@playwright/test";
import { test as pages } from "./pages";
import { UserLogin, UserRegister } from "../types/types";

export type APIRequestOptions = {
  apiBaseURL: string;
  registerNewUser: (userData: UserRegister) => Promise<APIResponse>;
  loginAccessToken: (credentials: UserLogin) => Promise<string>;
};

type APIRequestFixture = {
  apiRequest: APIRequestContext;
};

export const test = pages.extend<APIRequestOptions & APIRequestFixture>({
  apiBaseURL: [process.env.API_BASE_URL ?? "", { option: true }],

  apiRequest: async ({ apiBaseURL }, use) => {
    const apiRequestContext = await request.newContext({
      baseURL: apiBaseURL,
    });

    await use(apiRequestContext);
    await apiRequestContext.dispose();
  },

  registerNewUser: async ({ apiRequest }, use) => {
    const registerNewUser = async (userData: UserRegister): Promise<APIResponse> => {
      return apiRequest.post("users/register", { data: userData });
    };

    await use(registerNewUser);
  },

  loginAccessToken: async ({ apiRequest }, use) => {
    const loginAccessToken = async (credentials: UserLogin): Promise<string> => {
      const response = await apiRequest.post("users/login", {
        data: {
          email: credentials.email,
          password: credentials.password,
        },
      });

      const responseBody = (await response.json()) as { access_token: string };
      return responseBody.access_token;
    };

    await use(loginAccessToken);
  },
});

export { expect } from "@playwright/test";
