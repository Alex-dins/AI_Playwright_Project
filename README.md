# Playwright E2E Test Suite

End-to-end test automation project built with Playwright and TypeScript, covering authentication, cart, product search, and account flows. Includes a Page Object Model architecture, typed fixtures, API-backed test setup, and an AI-powered failure analyzer.

## Tech Stack

- **[Playwright](https://playwright.dev/)** — browser automation and test runner
- **TypeScript** — strict typing across page objects, fixtures, and data factories
- **Faker.js** — dynamic test data generation
- **OpenAI API** — AI-assisted failure analysis (`analyze:failures` script)

## Project Structure

```
lib/
├── constants/        # Validation messages, page URLs
├── data-factory/     # Faker-based user data builder
├── fixtures/         # Layered Playwright fixtures (pages → api → helpers)
├── interfaces/       # Domain model interfaces (camelCase)
├── locators/         # Centralized selector maps per page
├── mappers/          # Domain ↔ API model converters
├── pages/            # Page Object Model classes
├── types/            # API-facing types (snake_case)
└── utils/            # AI client, report parser, failure extractor

tests/
├── auth/             # Login and registration flows
├── cart/             # Shopping cart (add, remove, empty state)
├── products/         # Search and sorting
└── account/          # My account navigation and auth guard
```

## Getting Started

### Prerequisites

- Node.js 18+
- npm

### Install dependencies

```bash
npm install
npx playwright install chromium
```

### Configure environment

Create a `.env` file in the project root:

```env
BASE_URL=https://practicesoftwaretesting.com
API_BASE_URL=https://api.practicesoftwaretesting.com

customerUsername=your_test_email@example.com
customerPassword=your_test_password

OPENAI_API_KEY=your_openai_key   # only needed for AI failure analysis
```

## Running Tests

```bash
# Run all tests
npm test

# Run by feature area
npm run test:auth
npm run test:cart
npm run test:products
npm run test:account

# CI mode (generates HTML + JSON reports)
npm run test:ci
```

## AI Failure Analysis

After a test run, generate an AI-powered analysis of any failures:

```bash
npm run analyze:failures
```

This reads `playwright-report/test-results.json`, extracts failures, and sends each one to GPT-4o-mini with a structured prompt covering root cause and fix suggestions.

## Architecture Highlights

- **Layered fixtures** — `pages.ts → api.ts → helpers.ts → setup.fixtures.ts` keeps each layer focused and composable
- **Domain/API separation** — `UserDomain` (camelCase UI model) is mapped to `ApiUserRegister` (snake_case API model) via `user.mapper.ts`
- **API-backed setup** — tests that need a logged-in user or pre-seeded cart use API calls rather than UI flows, keeping test execution fast and reliable
- **Popup handling** — `BasePage.handleUnexpectedPopups()` gracefully dismisses consent modals without coupling tests to implementation details
