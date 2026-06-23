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
  text: Error handling
  link: '/boring-stack/error-handling'
editLink: true
---

# Testing

The Boring JavaScript Stack uses [Sounding](/sounding/) as the default testing surface.

Sounding is built for Sails apps, so tests can use the real app, real helpers, real routes, real Inertia responses, real mail capture, and real browser automation without each project carrying its own test harness.

Once the suite shape is in place, use the [Testing cookbook](/boring-stack/cookbook/testing) for real app recipes.

## Philosophy

The testing shape is still pragmatic: test the smallest useful surface, and move up a layer only when that layer is the behavior.

- **Unit trials** prove helpers and business logic in a Sails-aware context.
- **Functional trials** prove endpoints, policies, redirects, JSON APIs, mail, and Inertia response contracts.
- **Browser trials** prove behavior that only the browser can prove: DOM rendering, navigation, focus, client-side interaction, and full page flows.

All three layers use the same import:

```js
const { test } = require('sounding')
```

Sounding runs on top of Node's test runner and uses Playwright for browser-capable trials, but day to day you write one kind of test: a Sounding trial.

## Directory structure

New Boring Stack templates use this shape:

```txt
tests/
├── unit/
│   └── helpers/
│       ├── capitalize.test.js
│       └── get-user-initials.test.js
├── functional/
│   ├── api/
│   │   └── health.test.js
│   ├── auth/
│   │   └── dashboard-access.test.js
│   └── pages/
│       └── home.test.js
└── e2e/
    └── pages/
        └── home.test.js
```

Use `tests/functional/` for fast app-aware trials that do not need a browser. Keep `tests/e2e/` for browser-capable trials.

For the full suite layout guidance, read [Organizing your suite](/sounding/organizing-your-suite).

## Setup

If you scaffolded with a current Boring Stack template, the scripts are already in your `package.json`:

```json
{
  "scripts": {
    "test:unit": "node --test --test-concurrency=1 tests/unit/**/*.test.js",
    "test:functional": "node --test --test-concurrency=1 tests/functional/**/*.test.js",
    "test:e2e": "node --test --test-concurrency=1 tests/e2e/**/*.test.js",
    "test": "npm run test:unit && npm run test:functional && npm run test:e2e"
  }
}
```

If you are adding Sounding to an existing app, start with [Sounding getting started](/sounding/getting-started).

## Running tests

```bash
# Run helper and business-logic trials
npm run test:unit

# Run endpoint, auth, JSON, mail, and Inertia contract trials
npm run test:functional

# Run browser-capable trials
npm run test:e2e

# Run the whole suite
npm test
```

Browser-capable trials need Playwright's browser binaries installed:

```bash
npx playwright install chromium
```

In CI, use `npx playwright install --with-deps chromium`.

## Unit trials

Use unit trials for helpers and small business operations. They still get a lifted Sails app through Sounding, so you do not need to maintain a custom `getSails()` singleton.

```js
const { test } = require('sounding')

test('capitalize capitalizes a single word correctly', async ({
  sails,
  expect
}) => {
  const capitalized = await sails.helpers.capitalize('hello')

  expect(capitalized).toBe('Hello')
})
```

Read [Testing helpers](/sounding/testing-helpers) for the deeper helper-testing guide.

## Functional trials

Use functional trials for app behavior that can be proved without a browser.

```js
const { test } = require('sounding')

test('health endpoint reports ok', async ({ get, expect }) => {
  const response = await get('/health')

  expect(response).toHaveStatus(200)
  expect(response).toHaveJsonPath('status', 'ok')
})
```

For JSON endpoints, read [Testing JSON APIs](/sounding/testing-json-apis). For auth helpers and actor-driven setup, read [Auth and actors](/sounding/auth-and-actors).

## Inertia trials

Use `visit()` when you want to test the server-side contract of an Inertia page without starting a browser.

```js
const { test } = require('sounding')

test('home page returns the expected Inertia payload', async ({
  visit,
  expect
}) => {
  const page = await visit('/')

  expect(page).toHaveStatus(200)
  expect(page).toBeInertiaPage('index')
  expect(page).toHaveJsonPath('url', '/')
  expect(page).toHaveSharedProp('errors')
})
```

This is the default replacement for older `inertia-sails/test` examples in new Boring Stack apps. Read [Testing Inertia pages](/sounding/testing-inertia) for partial reloads, validation errors, redirects, and Inertia-specific matchers.

## Browser trials

Use browser trials only when the browser is part of the behavior.

```js
const { test } = require('sounding')

test(
  'home page renders in the browser',
  { browser: true },
  async ({ page, expect }) => {
    await page.goto('/')

    await expect(
      page.getByRole('heading', { name: /Simplify Authentication/i })
    ).toBeVisible()
  }
)
```

Sounding gives you Playwright's `page` and `expect` inside the same trial style. Read [Browser testing](/sounding/browser-testing) when you need DOM interaction, logged-in browser flows, mobile projects, or Playwright-specific behavior.

For a quick public-page browser check, use Sounding's smoke helper:

```js
test('public pages do not smoke', async ({ smoke }) => {
  await smoke(['/', '/pricing', '/contact'])
})
```

When the rendered page itself is the contract, use [Visual regression testing](/sounding/visual-regression) deliberately rather than replacing behavior assertions with screenshots.

## Configuration

Keep app-level test behavior in `config/env/test.js`:

```js
module.exports = {
  port: 3333,
  models: {
    migrate: 'drop'
  },
  log: {
    level: 'error'
  },
  mail: {
    default: 'log'
  }
}
```

Most apps do not need `config/sounding.js`. Add it only when you need to override Sounding defaults, such as datastore mode, browser projects, request transport, or world paths. Read [Sounding configuration](/sounding/configuration) before adding one.

## What to test

Start with the flows that would hurt to break:

- a helper or action that carries business rules
- one health or JSON endpoint
- guest and authenticated access to a protected page
- the Inertia payload for the home page or dashboard
- one real browser render for the first page users see
- mail delivery when email is the behavior

As the app grows, use [worlds](/sounding/worlds), [factories](/sounding/factories), and [scenarios](/sounding/scenarios) to keep setup readable.
