# AGENTS.md

## Project Overview
Playwright 1.61 + TypeScript (ESM) E2E suite for the tool-shop web app (`BASE_URL`) and its REST API (`API_BASE_URL`). Page Object Model + layered fixtures; faker for test data; `testIdAttribute` is `data-test`.

## Quick Start
- Install: `make setup` (needs `.env` with `BASE_URL`, `API_BASE_URL`, `customerUsername`, `customerPassword`)
- Test: `make test` · one area: `make test-auth`, `make test-search` · extra flags: `make test ARGS="--headed"`
- Lint: `make lint` (ESLint + eslint-plugin-playwright + tsc) · auto-fix: `make lint-fix`
- Full verification: `make check` — must pass before a change is done
- Run `make` alone to list all targets

## Hard Constraints
- Specs import `{ test, expect }` only from `lib/fixtures/setup.fixtures.ts`.
- No selectors in specs: locator names go in `lib/locators/<page>.loc.ts`, locators are `readonly` properties on the page class, and new pages are registered in `lib/fixtures/pages.ts`.
- Prefer `getByTestId` (`data-test`) and `getByRole`; no CSS/XPath selectors.
- Test data comes from `generateUserData(overrides)`; convert to API shape with `apiUserData`. UI types are camelCase (`lib/interfaces`), API types are snake_case (`lib/types`).
- Set state up through the API (`authSetup`, `registerNewUser`); only drive login/registration through the UI when that flow is what's being tested.
- New API helpers wrap the `api` fixture in `lib/fixtures/api.ts`; reusable flows go in `lib/fixtures/helpers.ts`.
- Sync on the network with `waitForResponse({ url, method, status })`, started before the action. No `waitForTimeout`.
- Credentials only from env vars; never commit `.env` or hard-code users.
- Test titles describe intent: `"Happy Path - …"` / `"Negative Path - …"`.
- No `.only`; `make lint` must report 0 errors.

## Known State
- 4 registration tests already fail on `main` (Required Fields, Password Policy, Phone, Duplicate Email) — see `PROGRESS.md`.

## Topic Docs
- Architecture Map (`lib/ARCHITECTURE.md`) — Required reading before adding pages, fixtures, or specs
- Progress (`PROGRESS.md`) — Current state and to-do; update it when you finish a task
- Playwright CLI skill (`.claude/skills/playwright-cli/`) — Exploring the app and generating tests
- Trace analyst agent (`playwright-trace-analyst`) — Reading `trace.zip` from failed runs
