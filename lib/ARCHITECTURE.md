# Architecture Map

Playwright + TypeScript E2E suite (ESM). POM pages → fixture chain → specs. App URL from `BASE_URL`, API from `API_BASE_URL`; `testIdAttribute` is `data-test`.

## Layers (dependency direction: top → bottom)

```
tests/*.spec.ts
  └─ lib/fixtures/setup.fixtures.ts   ← ONLY import point for tests ({ test, expect })
       └─ helpers.ts   authSetup, waitForResponse, generateUserData
            └─ api.ts   apiBaseURL (option), api (APIRequestContext), registerNewUser, loginAccessToken
                 └─ pages.ts   basePage, authPage, myAccountPage, mainPage, components
                      └─ lib/pages/*.page.ts  (extend BasePage)
                           └─ lib/locators/*.loc.ts  (data-test ids / role names)
```

Each fixture file does `prev.extend<...>()` on the previous one — add new fixtures at the matching layer, never skip one.

## Folders

| Path | Role |
|------|------|
| `lib/pages/` | POMs. `BasePage`: `goTo`, `getByDataTest`, `getByRole`, `getByText`, `checkPageUrl`. Locators are `readonly` class properties; methods are user intents (`login`, `fillRegistrationForm`, `search`). |
| `lib/locators/` | One `*.loc.ts` per page: a `LocatorMap` interface + const map of `data-test` ids/role names. No Playwright calls here. |
| `lib/fixtures/` | Fixture chain above. Register every new page in `pages.ts`; wrap `api` for new API helpers in `api.ts`; compose flows in `helpers.ts`. |
| `lib/interfaces/` | UI/domain shapes, camelCase (`UserDomain`). |
| `lib/types/` | API shapes, snake_case (`ApiUserRegister`, `UserLogin`). |
| `lib/mappers/` | Domain → API converters (`apiUserData`). |
| `lib/data-factory/` | Faker builders with `Partial<>` overrides (`generateUserData`). |
| `lib/constants/` | `pageUrls` (URL regexes), `VALIDATION_MESSAGES` (expected UI text). |
| `tests/` | Specs by feature: `tests/auth/{login,registration}.spec.ts`, `tests/search.spec.ts`. |

## Pages → fixture → locators

| Fixture | Class | Locators | Covers |
|---------|-------|----------|--------|
| `basePage` | `BasePage` | — | navigation, URL checks |
| `authPage` | `AuthPage` | `auth-page.loc.ts` | login + registration forms, error messages |
| `myAccountPage` | `MyAccountPage` | inline (no loc file yet) | `/account` heading + nav |
| `mainPage` | `MainPage` | `main-page.loc.ts` | search input/submit/reset, product names |
| `components` | `Components` | `components.loc.ts` | shared header nav (`nav-home`, `nav-menu`) |

## Key flows

- **Auth via API (preferred for setup):** `authSetup(creds)` → `loginAccessToken` (`POST users/login`) → token injected into `localStorage["auth-token"]` via `addInitScript`; call before `goTo`.
- **User creation via API:** `registerNewUser(apiUserData(generateUserData()))` → `POST users/register`.
- **Network sync:** `waitForResponse({ url, method, status })` matches `${apiBaseURL}${url}` exactly; start it before (or in `Promise.all` with) the triggering action. Search uses method `QUERY`.
- **Mocking:** specs use `page.route` directly (e.g. 500 on register).

## Config & env

- `playwright.config.ts`: projects `setup` (`*.setup.ts`) + `chromium`; `trace: retain-on-failure`; reporters html + json (`playwright-report/test-results.json`); CI → 2 retries, 1 worker.
- Env (`.env` via dotenv): `BASE_URL`, `API_BASE_URL`, `customerUsername`, `customerPassword`.

## Known gaps

- No `*.setup.ts` file exists yet, so the `setup` project matches nothing.
- `MyAccountPage` uses raw `page.locator('[data-test=…]')` instead of a loc file + `getByDataTest`.
- `apiUserData` mapper drops `houseNumber`.
- npm scripts `test:cart|products|account` point to folders that don't exist yet.
