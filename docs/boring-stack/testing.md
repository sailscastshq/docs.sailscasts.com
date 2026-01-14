---
head:
  - - meta
    - property: 'og:image'
      content: https://docs.sailscasts.com/boring-stack-social.png
title: Testing
titleTemplate: The Boring JavaScript Stack 🥱
description: Testing philosophy and setup in The Boring JavaScript Stack
prev:
  text: File uploads
  link: '/boring-stack/file-uploads'
next:
  text: Mellow
  link: '/boring-stack/mellow'
editLink: true
---

# Testing

The Boring JavaScript Stack takes a pragmatic approach to testing: **unit test your helpers, end-to-end test your pages**.

## Philosophy

Why this approach?

- **Helpers are pure logic** - They're isolated, stateless functions. Testing them is fast and catches real bugs.
- **E2E covers everything else** - Actions, policies, models, routing - they all get exercised through page tests. One e2e test covers what would take 5-10 unit tests.
- **Less test code to maintain** - Every test is code you have to update when things change. Fewer, higher-value tests mean less maintenance burden.
- **Tests what users actually do** - E2E tests mirror real usage. A passing e2e suite means the app actually works.
- **Playwright makes e2e cheap** - It's fast, reliable, and the API is clean. The old argument that "e2e is slow and flaky" doesn't hold anymore.

## Directory structure

```
tests/
├── util/
│   └── get-sails.js       # Sails singleton for unit tests
├── unit/
│   └── helpers/           # One file per helper
│       ├── capitalize.test.js
│       └── get-user-initials.test.js
└── e2e/
    └── pages/     # Mirrors your pages in assets/js/pages and views/pages
        ├── home.test.js
        ├── features.test.js
        ├── contact.test.js
        ├── auth/
        │   └── login.test.js
        └── billing/
            └── pricing.test.js
```

## Setup

If you scaffolded with a Boring Stack template, these scripts are already in your `package.json`:

```json
{
  "scripts": {
    "test:unit": "node --test --test-concurrency=1 './tests/unit/**/*.test.js'",
    "test:e2e": "playwright test",
    "test:e2e:ui": "playwright test --ui",
    "test:e2e:headed": "playwright test --headed",
    "test": "npm run test:unit && npm run test:e2e"
  }
}
```

## Running tests

```bash
# Run unit tests
npm run test:unit

# Run e2e tests
npm run test:e2e

# Run e2e with UI mode (interactive)
npm run test:e2e:ui

# Run e2e with visible browser
npm run test:e2e:headed

# Run all tests
npm test
```

## Unit tests

Unit tests use Node.js's built-in test runner - no extra dependencies needed.

### The `getSails()` utility

The `tests/util/get-sails.js` file provides a singleton Sails instance that's shared across all tests:

```js
const Sails = require('sails').constructor

// Singleton instance - initialized once, never torn down (process exits after tests)
let sailsInstance = null
let initPromise = null

async function getSails() {
  if (sailsInstance) {
    return sailsInstance
  }

  // Prevent multiple concurrent initializations
  if (initPromise) {
    return initPromise
  }

  initPromise = new Promise((resolve, reject) => {
    const sailsApp = new Sails()
    sailsApp.load(
      { environment: 'test', hooks: { shipwright: false, content: false } },
      (err, sails) => {
        if (err) {
          return reject(err)
        }
        sailsInstance = sails
        resolve(sails)
      }
    )
  })

  return initPromise
}

module.exports = { getSails }
```

This singleton pattern means:

- Sails is initialized once on the first test
- All subsequent tests reuse the same instance
- No teardown needed - the process exits after tests complete

### Writing a helper test

```js
const { describe, it } = require('node:test')
const assert = require('node:assert/strict')
const { getSails } = require('../../util/get-sails')

describe('sails.helpers.capitalize()', () => {
  it('capitalizes single word correctly', async () => {
    const sails = await getSails()
    const capitalized = sails.helpers.capitalize('hello')
    assert.equal(capitalized, 'Hello')
  })

  it('capitalizes multiple words correctly', async () => {
    const sails = await getSails()
    const capitalized = sails.helpers.capitalize('the quick brown fox')
    assert.equal(capitalized, 'The quick brown fox')
  })
})
```

Notice:

- No `before`/`after` hooks needed
- Each `it` block calls `getSails()` directly
- Tests are `async` because `getSails()` returns a promise

### Test environment config

Create `config/env/test.js` to configure the test environment:

```js
module.exports = {
  port: 3333,
  log: {
    level: 'error'
  },
  models: {
    migrate: 'drop'
  },
  datastores: {
    default: {
      adapter: 'sails-disk'
    }
  },
  mail: {
    default: 'log',
    mailers: {
      log: {
        transport: 'log'
      }
    }
  }
}
```

## E2E tests

E2E tests use [Playwright](https://playwright.dev/) and are organized by page/route.

### Writing a page test

```js
import { test, expect } from '@playwright/test'

test.describe('Home Page', () => {
  test('homepage loads successfully', async ({ page }) => {
    await page.goto('/')
    await expect(page).toHaveTitle(/My App/)
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
  })
})
```

### Testing guest protection

```js
import { test, expect } from '@playwright/test'

test.describe('Guest Protection', () => {
  test('dashboard redirects unauthenticated users to login', async ({
    page
  }) => {
    await page.goto('/dashboard')
    await expect(page).toHaveURL(/login/)
  })

  test('settings redirects unauthenticated users to login', async ({
    page
  }) => {
    await page.goto('/settings/profile')
    await expect(page).toHaveURL(/login/)
  })
})
```

### Selector priority

Prefer user-facing selectors:

1. `getByRole()` - Buttons, headings, forms, links
2. `getByLabel()` - Form inputs with labels
3. `getByText()` - Visible text content
4. `getByPlaceholder()` - Input placeholders
5. CSS/ID selectors - Only as last resort

### Playwright config

The `playwright.config.js` at your project root:

```js
import { defineConfig, devices } from '@playwright/test'

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',

  use: {
    baseURL: 'http://localhost:3333',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure'
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] }
    }
  ],

  webServer: {
    command: 'sails_environment="test" sails lift',
    port: 3333,
    timeout: 120 * 1000,
    reuseExistingServer: !process.env.CI
  }
})
```

## CI/CD

### GitHub Actions

If you scaffolded with a Boring Stack template, `.github/workflows/test.yml` is already set up. If not, create it:

```yaml
name: Tests

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  test:
    timeout-minutes: 10
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'

      - name: Install dependencies
        run: |
          rm -rf node_modules package-lock.json
          npm install

      - name: Run unit tests
        run: npm run test:unit

      - name: Install Playwright browsers
        run: npx playwright install --with-deps chromium

      - name: Run E2E tests
        run: npm run test:e2e

      - name: Upload test results
        if: always()
        uses: actions/upload-artifact@v4
        with:
          name: playwright-report
          path: playwright-report/
          retention-days: 7
```

::: warning Note on npm install
The `rm -rf node_modules package-lock.json && npm install` step ensures platform-specific native bindings (like rspack) are installed correctly for the CI environment.
:::

## Inertia test helpers

For integration testing Inertia responses, `inertia-sails` provides test helpers that work with `sails.request()`. These give you fluent assertions for testing your pages without spinning up a browser.

### Setup

```js
const { describe, it } = require('node:test')
const { getSails } = require('../util/get-sails')

describe('Dashboard', () => {
  it('shows user stats', async () => {
    const sails = await getSails()
    const inertia = require('inertia-sails/test')(sails)

    const page = await inertia.request('GET /dashboard')

    page
      .assertStatus(200)
      .assertComponent('Dashboard/Index')
      .assertHas('stats')
      .assertHas('recentActivity', 5)
  })
})
```

### Available assertions

```js
// Status and component
page.assertStatus(200)
page.assertComponent('Users/Index')
page.assertUrl('/users')

// Props
page.assertHas('users') // Prop exists
page.assertHas('users', 10) // Array with 10 items
page.assertMissing('adminData') // Prop doesn't exist
page.assertProps({ 'user.name': 'John' }) // Exact value match (dot notation)
page.assertProp('user', (user) => {
  // Custom assertion
  assert.equal(user.role, 'admin')
})

// Flash
page.assertFlash('success') // Flash key exists
page.assertFlash('success', ['Saved!']) // Flash with value
page.assertNoFlash('error') // No flash key

// Special props
page.assertMergeProps(['items']) // Merge props
page.assertDeepMergeProps(['settings']) // Deep merge props
page.assertDeferredProps(['stats']) // Deferred props
```

### POST requests with data

```js
it('creates a user', async () => {
  const sails = await getSails()
  const inertia = require('inertia-sails/test')(sails)

  const page = await inertia.request({
    url: 'POST /users',
    data: { name: 'Jane', email: 'jane@example.com' }
  })

  page
    .assertStatus(200)
    .assertComponent('Users/Show')
    .assertProps({ 'user.name': 'Jane' })
})
```

### Testing partial reloads

```js
it('reloads only users prop', async () => {
  const sails = await getSails()
  const inertia = require('inertia-sails/test')(sails)

  const page = await inertia.partialRequest('/users', 'Users/Index', ['users'])

  page.assertHas('users')
  // Other props won't be included in partial reload
})
```

### Getting raw data

```js
const page = await inertia.request('GET /users')

const pageObject = page.getPage() // Full Inertia page object
const props = page.getProps() // Just the props
```

## Tips

- Tests use the `test` environment (port 3333, sails-disk adapter)
- Database migrates to `drop` mode (fresh DB for each run)
- Email transport is set to `log` (no actual emails sent)
- Use unique timestamps for test data: `test-${Date.now()}@example.com`
- Run unit tests with `--test-concurrency=1` to ensure the Sails singleton works correctly
