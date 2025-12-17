# Playwright MCP Automation Suite

This repository implements Playwright tests against the Context7 MCP server with a focus on accessibility-aware flows, shared fixtures, and structured page objects. Key files and folders referenced by these guidelines include:

- `playwright.config.ts` for shared browser/project configuration, retries, reporters, and shared `use` hooks.
- `lib/fixtures/` for API, page, and setup fixtures that combine UI helpers, API helpers, and data builders.
- `lib/pages/` and `lib/locators/` for the Page Object Model (POM) helpers and centralized selectors used by tests.
- `lib/data-factory/`, `lib/interfaces/`, and `lib/types/` for typed payloads, DTOs, and faker-based factories.
- `tests/` (including `auth.setup.ts`) for auth/login/dashboard suites that consume the shared fixtures and POMs.

## Fixture & Test Guidelines

- Keep fixtures modular: `lib/fixtures/pages.ts` supplies `BasePage` and `AuthPage` per test while `lib/fixtures/api.ts` layers a worker-scoped `apiRequest` plus the typed helpers `registerNewUser` and `loginAccessToken` that share the `apiBaseURL` option.
- Introduce new API helpers by wrapping `apiRequest` (for example, add an `addProductToCart` helper that calls `apiRequest.post("cart/items", { data })`) and export only the functions tests need so fixtures stay descriptive and reusable.
- Use `tests/auth.setup.ts` as the entry point for reusable storage state lifecycles; log in through the existing helpers, store the context under `.auth/user.json`, and avoid mixing UI and API login code in the setup file.
- In tests, navigate through `basePage.goTo` and rely on flow helpers from `authPage` so each spec asserts behavior instead of wiring low-level DOM interactions.
- Feed fixtures with deterministic payloads from `lib/data-factory/new-user.data.ts`, extending that builder with optional overrides when a scenario only needs to tweak a single field.

## Page Objects & Locator Practices

- Keep `BasePage` (currently in `lib/pages/base.page.ts`) thin but ready for shared navigation, idle waits, or loader guards so flows stay readable even when UI timing shifts.
- Centralize selectors in `lib/locators/auth-page.loc.ts`, augmenting the map with role-aware labels when possible, and let `AuthPage` choose the most resilient locator (`getByRole` for buttons, `getByTestId` for the controlled inputs).
- Expose flow-level helpers on `AuthPage`—`registerNewUser`, `login`, and the various verification helpers—instead of duplicating DOM lookups inside tests.
- Apply the same pattern when adding other page objects: keep selectors in `lib/locators`, expose intent-driven methods in page classes, and inject them via the `lib/fixtures/pages.ts` fixture so tests can compose high-level flows.

## Data Contracts & Factories

- Keep UI-facing shapes (camelCase) in `lib/interfaces/user-register.interface.ts` and API-facing shapes (snake_case with nested `address`) in `lib/types/types.ts`; add conversion helpers when a single flow needs to work with both representations.
- Centralize fake data generation in `lib/data-factory/new-user.data.ts` and update the builder to accept optional overrides so tests can tweak only the fields they care about while the rest remain deterministic.
- When extending the domain model, add new interfaces/types in the shared folders and consume them in fixtures/POMs instead of redefining them in individual specs.

## Coverage & CI Practices

- Keep authentication coverage inside `tests/auth`, reusing `basePage`, `authPage`, and the API helpers to drive both positive and negative scenarios; `login.spec.ts` and `registration.spec.ts` show how to verify URLs, headings, and error banners after each flow.
- Name tests with intentful titles (e.g., “Happy Path – Successful login”) and keep assertions focused on user-visible outcomes.
- Prefer API-backed setups for CI by calling `registerNewUser` and `loginAccessToken` from the fixtures so UI logins stay reserved for flow validation; always source `customerUsername` and `customerPassword` from env vars to keep secrets out of the repo.
- Persist shared storage states via `.auth/user.json` when a suite needs session replay and keep the authentication fixture file tidy by removing commented API fallbacks.

## Tooling & Scripts

- Run `npx playwright test` from the repo root so `playwright.config.ts` and the shared fixtures resolve automatically; target folders like `tests/auth` for quicker iterations (e.g., `npx playwright test tests/auth`).
- Provide `API_BASE_URL`, `customerUsername`, and `customerPassword` through `.env` or CI variables so the API helpers and `tests/auth.setup.ts` can log in reliably without hard-coding credentials.
- Keep npm scripts minimal for now; when ready, add descriptive scripts (for example, `"test:auth": "npx playwright test tests/auth"`) but avoid global Playwright commands to keep everyone on `npx playwright`.
