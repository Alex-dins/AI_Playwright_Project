# Current progress: done, in-progress, blocked

_Last updated: 2026-11-02_

## Done

- **Framework:** Playwright 1.61 + TS (ESM), dotenv, faker v10; chromium project; html + json reporters; traces on failure.
- **Fixture chain:** `pages → api → helpers → setup.fixtures` (`authSetup`, `waitForResponse`, `generateUserData`, `registerNewUser`, `loginAccessToken`).
- **POM:** `BasePage`, `AuthPage`, `MyAccountPage`, `MainPage`, `Components` + locator maps for auth, main, and components.
- **Data:** `UserDomain` / `ApiUserRegister`, `apiUserData` mapper, `generateUserData(overrides)`, `pageUrls`, `VALIDATION_MESSAGES`.
- **Login tests** (`tests/auth/login.spec.ts`, 6): happy path + invalid email/password, empty fields.
- **Registration tests** (`tests/auth/registration.spec.ts`, 10): happy path, required fields, DOB, country, email, password policy, phone, postal code, duplicate email (API seeded), mocked 500 + recovery.
- **Search tests** (`tests/search.spec.ts`, 5): happy path, no results, Enter key, clear/reset, logged-in search via `authSetup`.
- **Agent docs:** `AGENTS.md` (overview, quick start, hard constraints, topic docs), `lib/ARCHITECTURE.md`, playwright-cli skill, trace-analyst agent.
- **Makefile:** `setup`, `test`, `test-auth`, `test-search`, `lint`, `lint-fix`, `check`, `report`, `clean`.
- **Lint:** ESLint flat config (`@eslint/js`, `typescript-eslint`, `eslint-plugin-playwright` on `tests/`) + tsc; 0 errors, 1 warning (conditional in the route handler of the server-error test).

## To do

### Fixes
- Fix 4 failing registration tests: Required Fields, Password Policy, Phone Number, Duplicate Email. Last run: 17/21 passed.
- Auth setup: `tests/auth.setup.ts` doesn't exist, so the `setup` project in `playwright.config.ts` matches nothing. Either add it (API login → storageState) or remove the `setup` project.
- Search spec: stop hard-coding the user name "Jack Howe" (derive it from env/API), fix the "functionalyty" typo, use `Happy Path - …` / `Negative Path - …` titles, and move it to `tests/search/`.
- `MyAccountPage`: move its selectors to `lib/locators/my-account-page.loc.ts` and use `getByDataTest`.
- `apiUserData`: map `houseNumber`.
- `analysis/architecture-review.md` is stale (mentions `dashboard.spec.ts`, `mergeTests`, `loginUser`): delete it or mark it as history.
- npm scripts `test:cart|products|account` point to folders that don't exist; drop them or add the specs (Makefile is the main entry point now).

### New coverage
- Cart, products, and account tests.

### Optional
- Add firefox/webkit projects.
- CI pipeline running `make check`.
- Seed faker for reproducible runs.

## Blocked

- Nothing.
