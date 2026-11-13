# Standardized commands: setup, test, lint, check
# Usage: make <target> [ARGS="--headed --grep 'Happy Path'"]

PW   := npx playwright
ARGS ?=

.DEFAULT_GOAL := help
.PHONY: help setup test test-auth test-search lint lint-fix check report clean

help: ## List available targets
	@grep -E '^[a-zA-Z_-]+:.*## ' $(MAKEFILE_LIST) | awk 'BEGIN {FS = ":.*## "} {printf "  %-12s %s\n", $$1, $$2}'

setup: ## Install deps + chromium, warn if .env is missing
	npm ci
	$(PW) install --with-deps chromium
	@test -f .env || echo "WARN: .env missing - set BASE_URL, API_BASE_URL, customerUsername, customerPassword"

test: ## Run all tests
	$(PW) test $(ARGS)

test-auth: ## Run auth tests
	$(PW) test tests/auth $(ARGS)

test-search: ## Run search tests
	$(PW) test tests/search.spec.ts $(ARGS)

lint: ## ESLint (incl. eslint-plugin-playwright) + typecheck (tsc)
	npx eslint .
	npx tsc --noEmit -p .

lint-fix: ## Auto-fix ESLint findings where possible
	npx eslint . --fix

check: lint test ## Lint, then run all tests (pre-push / CI gate)

report: ## Open the last HTML report
	$(PW) show-report

clean: ## Remove test artifacts
	rm -rf test-results playwright-report blob-report
