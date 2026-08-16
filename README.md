# OrangeHRM Playwright Automation Framework

## Overview

This repository contains a scalable, modular end‑to‑end automation framework for OrangeHRM, built using **Playwright**, **TypeScript**, and **PostgreSQL**.

The framework supports:

- Page Object Model (POM) architecture
- Cross‑browser execution (Chromium, Firefox, WebKit)
- Parallel test execution
- Allure reporting with screenshots and artifacts
- Database‑backed test data setup and validation
- Structured error handling (script, functional, negative validation)
- CI/CD integration with GitHub Actions
- Code quality enforcement (build, lint, formatting checks)

This foundation enables reliable **smoke**, **sanity**, and **regression** testing across the application.

## Tech Stack

- **Playwright** (E2E automation)
- **TypeScript**
- **Node.js 20+**
- **PostgreSQL**
- **Allure Report**
- **GitHub Actions CI**

## Prerequisites

Ensure the following are installed:

- Node.js 20+
- npm
- Cloud PostgreSQL database instance (for example Neon)
- Allure commandline
- GitHub Actions enabled for CI

## Setup

1. Clone the repository:

   ```bash
   git clone <repo-url>
   cd <repo-folder>
   npm install
   ```

2. Run the full local validation sequence in one step:
   ```bat
   allTests.bat
   ```
   This batch file runs, in order:
   - npm install
   - npm run build
   - npm run lint
   - npm run format:check
   - npx playwright test
   - npx allure serve .\allure-results

## Running tests

- Run all tests:
  npx playwright test
- Run smoke tests:
  npx playwright test --grep @smoke
- Run sanity tests:
  npx playwright test --grep @sanity
- Run regression tests:
  npx playwright test --grep @regression
- Run tests in headed mode:
  npx playwright test --headed
- Run tests in a specific browser:
  npx playwright test --project=chromium
- Generate Allure report:
  npm run report:allure
- View Allure report:
  npx allure serve ./allure-results

## Database configuration

The project includes a PostgreSQL integration helper in db.ts. Configure the database using a cloud connection string:

- DATABASE_URL (preferred)
- NEON_CONNECTION_STRING (optional fallback)
- DEFAULT_NEON_CONNECTION_STRING (optional fallback)
- CURRENT_EMPLOYEE_ID

Example:

`DATABASE_URL=postgresql://<user>:<password>@<host>/<database>?sslmode=require`

The helper supports reading and writing employee data and can persist the active employee ID for workflow continuity in end-to-end automation flows.

## CI Pipeline (GitHub Actions)

The workflow in .github/workflows/ci.yml runs automatically on pull requests targeting master.

For Playwright tests in CI, set repository secret `DATABASE_URL` to your cloud PostgreSQL connection string.

It performs:

- TypeScript compile check (build)
- ESLint code quality check (lint)
- Prettier formatting check (format-checks)
- Playwright test execution (playwrite-tests)
- Allure report generation (allure-report)
- Artifact upload for reporting
- Branch protection rules enforce all checks before merging.

## Project structure

src/
pages/ # Page Object Model classes
elements/ # Element locator definitions
tests/ # Test suites (smoke, sanity, regression)
utils/ # Helpers (DB, env, logger)
helpers/ # Screenshot, Allure helpers
playwright.config.ts
db.ts
.env.example
.github/workflows/ci.yml

## Error Handling Architecture

The framework implements structured error handling across three layers:

1. Script Error Handling

- Locator failures
- Timeout errors
- Unexpected crashes
- Screenshot + Allure logging

2. Functional Validation Handling

- Assertions for expected UI behavior
- Toast message validation
- Page header validation

3. Negative Scenario Validation Handling

- Expected validation messages
- Required field errors
- Invalid input handling

## Features Summary

- Modular POM structure
- Reusable element locators
- Centralized DB integration
- Allure reporting with screenshots
- Parallel + cross‑browser execution
- CI/CD pipeline with quality gates
- Structured error handling
- Tag‑based test execution (smoke, sanity, regression)

# Framework Architecture Diagram (ASCII)

## Framework Architecture Diagram

Below is a high-level representation of the automation framework structure.

+----------------------------------------------------------------------------------+
| OrangeHRM QA Automation Framework |
+----------------------------------------------------------------------------------+
| Configuration |
| Playwright + TypeScript + Environment |
+-------------------------------------------+--------------------------------------+
|
v
+------------------------+ +------------------------+ +------------------------+
| Tests Layer | ---> | Pages Layer | ---> | Elements Layer |
| Smoke / Sanity / Reg | | Reusable page actions | | Centralized locators |
+-----------+------------+ +-----------+------------+ +-----------+------------+
| | |
+-------------------------------+-------------------------------+
|
v
+------------------------+ +------------------------+ +------------------------+
| Helpers Layer | ---> | Utils Layer | ---> | DB Integration |
| Screenshots / Allure | | Logger / Env / Common | | PostgreSQL test data |
| Error categorization | | helper functions | | setup + validation |
+-----------+------------+ +-----------+------------+ +-----------+------------+
| | |
+-------------------------------+-------------------------------+
|
v
+----------------------------------------------------------------------------------+
| Execution & Quality Gates |
| Parallel workers | Cross-browser matrix | Functional/Negative checks |
+----------------------------------------------------------------------------------+
|
v
+----------------------------------------------------------------------------------+
| Reporting |
| Allure results, screenshots, artifacts, failure logs |
+----------------------------------------------------------------------------------+
|
v
+----------------------------------------------------------------------------------+
| CI/CD Pipeline |
| Build | Lint | Format Check | Playwright Run | Allure Artifact |
+----------------------------------------------------------------------------------+
