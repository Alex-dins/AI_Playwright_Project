# Playwright MCP Documentation & Architecture Review

## 1. Documentation Sources

1. **Playwright MCP Overview (README)** – Explains that the MCP server exposes Playwright automation via structured accessibility snapshots, highlights the JSON configuration entry point (`--config`), capability gating (`core`, `pdf`, `vision`), and init hooks (`--init-page`, `--init-script`).  This context confirms that the environment is capable of fine-grained fixture setup and that tooling integration should favor accessibility trees over pixel data when designing automation (see https://github.com/microsoft/playwright-mcp/blob/main/README.md).
2. **Test Fixtures Guide** – The official fixtures guide demonstrates how to extend `test` with custom fixtures (options, reusable page objects, worker/test scoped fixtures, custom titles) and how to consume them in tests.  The samples reinforce that fixtures should depend only on what they declare and should clean themselves up after use to keep suites isolated (docs/src/test-fixtures-js.md & docs/src/test-api/class-fixtures.md).
3. **Page Object Model (POM) Guidance** – The POM doc recommends modeling each screen independently, encapsulating selectors and interactions, and keeping selectors centralized to resist DOM churn.  It encourages exposing high-level intents (navigate, fill, verify) through reusable class methods so tests communicate intent, not implementation (docs/src/pom.md).
4. **Best Practices** – The best practices guide emphasizes selecting user-facing locators (role/text/test-id) over brittle CSS, testing user-visible behavior only, preferring TypeScript for type safety, isolating external dependencies, and optimizing CI (docs/src/best-practices-js.md).  These principles will underpin the architectural improvements below.

## 2. Project Analysis

### 2.1 Repository Layout & Configuration
- `playwright.config.ts` already centralizes browser definitions (setup/chromium) with retries, traces, reporters, and shared `use` hooks that inject `baseURL`, `apiBaseURL`, and `testIdAttribute`.  Environment variables are loaded via `dotenv`, keeping secrets out of source.
- Projects include a dedicated `setup` project targeting `*.setup.ts` scripts, promoting reusable authentication states (see `tests/auth.setup.ts`).  Only `chromium` is active now, but other browsers are commented out.
- `mergeTests` is used in `lib/fixtures/setup.fixtures.ts` to combine page and API fixtures, giving tests simultaneous access to UI helpers and API helpers.  However, the merge happens without distinguishing scope, which can lead to overly permissive dependencies if new fixtures are added without clear ownership.

### 2.2 Fixture Implementation
- `lib/fixtures/api.ts` defines API fixtures (`apiRequest`, `registerNewUser`, `loginUser`) and exposes `apiBaseURL` as an option, but `registerNewUser` wraps raw API calls while tests rely on UI flows.  `loginUser` returns `access_token` despite name implying a login action; this mismatch can be confusing when consumed downstream.
- `lib/fixtures/pages.ts` and `lib/pages/auth.page.ts` already align with the POM guidance: locators are stored in `lib/locators/auth-page.loc.ts`, and methods expose normalized interactions (e.g., `registerNewUser`, `login`, `verify*`).  However, `AuthPage.registerNewUser` fills each field explicitly and navigates by `page.getByTestId`, so any change in the `data-test` attribute requires touching both locators and page methods.

### 2.3 Data & Type Safety
- `lib/interfaces/user-register.interface.ts` uses camelCase properties (e.g., `firstName`, `dateOfBirth`), while `lib/types/types.ts` for API payloads uses snake_case and nested `address`.  Tests like `generateUserData` build camelCase data for UI registration and rely on `authPage.registerNewUser`, but API fixtures expect different structure.  This dual model risks duplication when asserting API responses or calling backend directly.
- `generateUserData` seeds realistic values with Faker, which is good, but there is no deterministic seeding for reproducible runs or the ability to override specific fields in edge-case scenarios.

### 2.4 Test Coverage & Quality
- Auth tests (`tests/auth/login.spec.ts`, `tests/auth/registration.spec.ts`) cover positive/negative login flows and a happy path registration.  `dashboard.spec.ts` currently only verifies navigation after stored storage state, but does not assert dashboard-specific elements.
- The positive login test is misnamed as "Pozitive Path - Invalid Email" but actually asserts successful login with valid credentials.  This mislabeling may confuse QA about intent and coverage.
- `tests/auth.setup.ts` still contains commented-out API login code; the active flow performs UI login then persists storage state, which is slower than a direct API token exchange.

## 3. Improvement Suggestions

### 3.1 Strengthen Fixture & Test Architecture
1. **Manually scoped fixtures** – Split merged fixtures into logical layers (`api`, `pages`, `userHelpers`) so each test imports only what it needs.  For example, create worker-scoped API clients vs test-scoped page helpers, and avoid `mergeTests` if no clear ownership exists.  Custom fixtures can expose `registerUser`, `seedUser`, `authHeader`, etc., aligning with the fixtures doc that recommends declaring dependencies explicitly.
2. **Improve naming clarity** – Rename `loginUser` fixture to `loginAccessToken` or similar to reflect that it returns an access token.  Update tests to consume helper definitions via the fixture API, keeping method names aligned with what they return (per best-practices emphasis on descriptive names).
3. **Introduce deterministic data overrides** – Extend `generateUserData` to accept partial overrides so edge-case tests (e.g., invalid email, missing phone) can reuse base fixtures without repeating boilerplate.

### 3.2 Harden Page Object Model & Locators
1. **Centralize locator contracts** – The current `authPageLocators` object is a good start; augment it with metadata (`role`, `label`, fallback selectors) so page methods can switch between locator strategies without rewriting the entire method.  This echoes the best practice of preferring user-facing attributes and relying on `getByRole`/`getByTestId`.  Add helper `getInput` methods to consolidate `getByTestId` calls.
2. **Encapsulate flows** – Move multi-step interactions (e.g., register with defaults, login as customer) into dedicated page or flow objects.  This keeps tests focused on assertions, matching POM guidance to expose higher-level API surfaces.
3. **Add wait helpers** – Extend `BasePage` with utilities like `waitForNavigation`, `waitForLoader`, `waitForIdle` so tests don’t repeat wait logic and remain resilient if animations/slowing occurs.

### 3.3 Align Data Contracts with API
1. **Unified DTO** – Introduce a single `UserProfile` DTO that represents both UI and API fields, with conversion helpers (e.g., `toApiPayload`, `toUiPayload`).  This prevents confusion between camelCase and snake_case models and makes it easier to call `registerNewUser` from both UI and backend tests.
2. **API + UI shared builder** – Store faker-based data generation in a `UserFactory` that can optionally persist a user via API, returning credentials and storage state.  This supports faster setup flows (per MCP best practices about controlling test data) and eliminates manual UI registration in setup files.

### 3.4 Expand Coverage & Optimization
1. **CI-friendly auth setup** – Replace UI login in `tests/auth.setup.ts` with a direct API login call that saves storage state, reducing runtime and flakiness.  Retain UI verification tests separately to ensure login page still works, following best practices on isolating third-party dependencies.
2. **Complete scenario labels** – Rename tests to accurately describe their intent (e.g., `"Happy Path - Successful Login"`), and ensure that each suite includes both success and failure assertions aligned with user-visible behavior.
3. **Dashboard assertions** – Expand `dashboard.spec.ts` to assert key dashboard elements (headings, widgets) after storage state application, ensuring we test the actual landing experience rather than only navigation.

By combining these improvements with the Context7-sourced documentation, the project can scale to more complex suites while maintaining clarity, reusability, and resilience in the Playwright MCP environment.

## 4. QA Analyzer Architecture (CLI + Opencode + Subagents)

1. **Reporter ingestion layer** – A helper module reads QA reports (Playwright HTML/JSON results or custom agent QA logs), normalizes each failure to a `FailureRecord` (test id, error message, stack, artifacts, snapshots). This layer can live in `analysis/qa-analyzer/ingest.ts` and expose a typed pipeline so downstream consumers can easily filter by suite/test/trace.
2. **Reproduction orchestrator** – For each `FailureRecord`, a `Reproducer` invokes the `playwright-cli` skill via opencode. It replays the problematic test flow using snapshot refs (`playwright-cli snapshot` produced during failure) or manual command sequences crafted from the recorded steps. Use the CLI references (`test-generation.md`, `session-management.md`, `storage-state.md`) to start named sessions, bootstrap persistent profiles, restore storage state, or mock failing APIs before executing interactions. This module collects diagnostics (console logs, `trace`, `video`, storage dumps) whenever the reproduction diverges from expected behavior.
3. **Analysis engine** – Compare reproduced outcomes with the original failure signals (assertion text, missing DOM elements, HTTP errors). Annotate why failure occurred (e.g., locator change, API timeout). This component can also leverage `running-code.md` to evaluate arbitrary Playwright expressions in-context for deeper insight (e.g., `page.$eval` checks or data extraction). The engine generates a structured plan: reproduce steps, determine corrective action, and mark severity.
4. **Fix generator** – Guided by `test-generation.md`, translate CLI replay sequences into Playwright test edits under `tests/`. This might mean patching an existing spec to include new waits/locators or generating a new spec from CLI snapshots (saved `.playwright-cli/page-*.yml`). The generator outputs PR-ready diffs describing fixes and includes annotations about captured diagnostics (traces, videos).
5. **Verification & feedback** – Invoke `npx playwright test <target>` after applying fixes; if reruns still fail, feed the diagnostics back into the ingestion layer for another analysis iteration. Use CLI session management (`session-stop`, `state-clear`) to ensure clean environments between iterations.
6. **Opencode + subagent integration** – Wrap the reproduction, analysis, and fix steps inside an opencode task that can spawn specialized subagents when needed: e.g., a `report-parser` subagent focused on parsing and summarizing QA data, a `cli-fixer` subagent that runs playlists of `playwright-cli` commands, and a `git-helper` subagent to stage/test code updates. Each subagent consumes the CLI skill (per `.opencode/skills/playwright-cli`) and shares the main analyzer’s context via task IDs.

This architecture keeps the CLI as the execution engine, opencode skills as the orchestration contract, and subagents as isolated workers for parsing, reproduction, and code editing. Let me know if you’d like me to start scaffolding the `analysis/qa-analyzer` module or wire up the subagent orchestration.
