import {
  test as base,
  APIRequestContext,
  request,
  APIResponse,
} from "@playwright/test";
import { UserLogin } from "../types/user-login.type";
import { UserRegister } from "../types/user-register.type";

export type APIRequestOptions = {
  apiBaseURL: string;
  registerNewUser: (userData: UserRegister) => Promise<APIResponse>;
  loginUser: (credentials: UserLogin) => Promise<APIResponse>;
};

type APIRequestFixture = {
  apiRequest: APIRequestContext;
};

export const test = base.extend<APIRequestOptions & APIRequestFixture>({
  apiBaseURL: ["", { option: true }],

  apiRequest: async ({ apiBaseURL }, use) => {
    const apiRequestContext = await request.newContext({
      baseURL: apiBaseURL,
    });

    await use(apiRequestContext);
    await apiRequestContext.dispose();
  },

  registerNewUser: async ({ apiRequest }, use) => {
    const registerNewUser = async (userData: UserRegister) => {
      const response = await apiRequest.post("users/register", {
        data: userData,
      });
      return response;
    };

    await use(registerNewUser);
  },

  loginUser: async ({ apiRequest }, use) => {
    const loginUser = async (credentials: UserLogin): Promise<APIResponse> => {
      const response = await apiRequest.post("users/login", {
        data: {
          email: credentials.email,
          password: credentials.password,
        },
      });
      const responseBody = await response.json();
      return responseBody.access_token;
    };

    await use(loginUser);
  },
});
