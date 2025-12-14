# Playwright MCP Automation Suite

This repository implements Playwright tests against the Context7 MCP server with a focus on accessibility-aware flows, shared fixtures, and structured page objects. Key files and folders referenced by these guidelines include:

- `playwright.config.ts` for shared browser/project configuration, retries, reporters, and shared `use` hooks.
- `lib/fixtures/` for API, page, and setup fixtures that combine UI helpers, API helpers, and data builders.
- `lib/pages/` and `lib/locators/` for the Page Object Model (POM) helpers and centralized selectors used by tests.
- `lib/data-factory/`, `lib/interfaces/`, and `lib/types/` for typed payloads, DTOs, and faker-based factories.
- `tests/` (including `auth.setup.ts`) for auth/login/dashboard suites that consume the shared fixtures and POMs.
- `analysis/architecture-review.md` for the rationale behind these conventions (see sections 2 and 3 for the detailed improvement suggestions).

## Fixture & Test Guidelines
- Scope fixtures explicitly rather than merging everything globally; keep worker-scoped API clients and test-scoped page helpers separate so each fixture only depends on what it declares (`analysis/architecture-review.md:32-35`).
- Name fixtures according to what they return (e.g., rename `loginUser` to `loginAccessToken`) to avoid confusion when consuming them in tests (`lines 34-35`).
- Provide deterministic data builders (such as a shared `UserFactory`) that accept partial overrides so edge-case tests can reuse base payloads without cloning the full structure (`lines 35-36`).
- Keep fixture cleanup self-contained and ensure each test reinitializes only what it needs, which aligns with the official fixtures guide’s emphasis on isolation (`lines 6-7`).

## Page Objects & Locator Practices
- Keep selectors centralized in `lib/locators/` and enhance locator objects with metadata (`role`, `label`, fallback selectors) so POM methods can choose the most resilient strategy (`lines 37-38`).
- Expose flow-level helpers in page objects (e.g., register, login, verify) rather than repeating low-level `getByTestId` calls; this keeps tests focused on intent, not implementation (`lines 18-20`, `37-38`).
- Extend `BasePage` with shared wait utilities (navigation, loaders, idle waits) so tests don’t duplicate waiting logic and stay resilient to animations or timing changes (`lines 39-40`).
- Prefer building flows (e.g., a `registerWithDefaults` or `loginAsCustomer` method) so fixtures and tests compose high-level steps rather than leaking DOM manipulation details (`line 39`).

## Data Contracts & Factories
- Author a unified `UserProfile` DTO that represents both UI and API fields, with conversion helpers such as `toApiPayload` and `toUiPayload` to avoid camelCase/snake_case mismatches (`lines 21-45`).
- House shared data builders (like a `UserFactory`) that can optionally persist users via the API, return credentials/storage state, and keep faker data centralized for reproducible overrides (`lines 42-45`).
- Keep interface definitions and type contracts consistent across `lib/interfaces/` and `lib/types/`, ensuring UI helpers and API fixtures consume the same contract definitions (`lines 21-23`).

## Coverage & CI Practices
- Build CI-friendly auth setups by favoring API-backed logins that save storage state, reducing reliance on slow UI logins; reserve UI login tests for flow validation (`lines 47-48`).
- Name tests to reflect their intent (e.g., "Happy Path – Successful Login") and always verify user-visible behavior, including dashboard elements after storage replay (`lines 26-49`).
- Keep `tests/auth.setup.ts` focused on reusable storage lifecycles and avoid keeping commented API login code; rely on the shared data builders to seed test users (`lines 28-29`).

## Tooling & Scripts
- _Placeholder for npm/Playwright scripts (`npm test`, `npx playwright test`, etc.) you run regularly; fill in the concrete commands once decided._
- Prefer `npx playwright` invocations from the project root so the shared config and fixtures resolve automatically.
