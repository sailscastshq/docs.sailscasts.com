---
title: Browser Testing
editLink: true
---

# Browser testing

Sounding uses Playwright for browser-capable trials.

## `test()` when the browser matters

Use browser trials when the real browser matters:

- sign in journeys
- mobile navigation
- editors and dashboards
- gated content flows
- checkout handoff

When a repo uses a separate functional layer, keep these browser flows under `tests/e2e/pages/` and move request or Inertia contracts down into `tests/functional/`.

```js
import { test } from 'sounding'

test(
  'subscriber can finish a members-only issue',
  { browser: true, world: 'issue-access' },
  async ({ page, login, expect }) => {
    await login.as('subscriber', page)

    await page.goto('/issues/the-nerve-to-build')

    await expect(page.getByText('The rest of the story')).toBeVisible()
  }
)
```

## Failure artifacts

Browser failures are the hardest failures to understand from a stack trace alone, so Sounding captures the most useful evidence automatically.

When a `{ browser: true }` trial fails, Sounding keeps:

- the current page URL
- a `current-url.txt` file
- a full-page `screenshot.png`

The files live under:

```txt
.tmp/sounding/artifacts/<trial-name>/<browser-project>/
```

For example, this trial:

```js
test(
  'subscriber can finish a members-only issue',
  { browser: true },
  async ({ page }) => {
    await page.goto('/issues/the-nerve-to-build')

    // ...
  }
)
```

would write failure evidence to:

```txt
.tmp/sounding/artifacts/subscriber-can-finish-a-members-only-issue/desktop/
```

Sounding also appends the current URL and artifact paths to the thrown error:

```txt
Sounding browser artifacts:
- URL: http://127.0.0.1:3333/issues/the-nerve-to-build
- current URL file: .tmp/sounding/artifacts/subscriber-can-finish-a-members-only-issue/desktop/current-url.txt
- screenshot: .tmp/sounding/artifacts/subscriber-can-finish-a-members-only-issue/desktop/screenshot.png
```

That keeps the assertion failure as the main message while still pointing you at the browser evidence.

## Capture traces and videos

Screenshots and URLs are cheap enough to keep on by default. Traces and videos are heavier, so Sounding makes them opt-in.

Turn them on for one trial when a browser flow is flaky or timing-sensitive:

```js
test(
  'checkout keeps the cart after refresh',
  {
    browser: {
      artifacts: {
        trace: true,
        video: true
      }
    }
  },
  async ({ page, expect }) => {
    await page.goto('/checkout')
    await page.reload()

    await expect(page.getByText('Your cart')).toBeVisible()
  }
)
```

The failure directory will then include:

```txt
current-url.txt
screenshot.png
trace.zip
video.webm
```

Use trace when you need to inspect network requests, DOM snapshots, console output, or the timing between browser actions.
Use video when motion, redirects, focus changes, or transient UI states are the thing you need to see.

## Artifact modes

Artifact settings accept booleans for the common path:

- `true` keeps the artifact when the trial fails
- `false` disables that artifact

They also accept explicit modes:

- `off` disables the artifact
- `on-failure` keeps the artifact only for failed trials
- `on` keeps the artifact for successful trials too

Most apps should use booleans in day-to-day tests:

```js
test(
  'publisher can update an issue cover',
  {
    browser: {
      artifacts: {
        trace: true
      }
    }
  },
  async ({ page }) => {
    await page.goto('/publisher/issues/42/edit')
  }
)
```

Use `on` when you are deliberately collecting evidence from a passing browser flow:

```js
test(
  'launch demo recording stays stable',
  {
    browser: {
      artifacts: {
        video: 'on'
      }
    }
  },
  async ({ page }) => {
    await page.goto('/demo')
  }
)
```

## Disable artifacts for a trial

If a smoke trial is intentionally tiny and you do not want files, turn artifacts off for that trial:

```js
test(
  'health page responds',
  { browser: { artifacts: false } },
  async ({ page }) => {
    await page.goto('/health')
  }
)
```

This is mainly useful for very large suites or trials that intentionally fail while exercising error boundaries.

## Load a world before browser setup

Browser trials become harder to maintain when they carry too much setup. Use the trial's `world` option to start from a named business situation before the browser flow begins.

## Run the same flows across browser projects

Run the same core flows across named browser projects:

- desktop
- mobile
- WebKit or Firefox when the browser engine matters
- dark mode when relevant

The default project is `desktop`, so most browser trials can stay terse:

```js
test(
  'subscriber can read a gated issue',
  { browser: true },
  async ({ page }) => {
    await page.goto('/issues/the-nerve-to-build')
  }
)
```

When a trial needs a specific project, use the string shorthand:

```js
test(
  'mobile navigation opens the account menu',
  { browser: 'mobile' },
  async ({ page }) => {
    await page.goto('/dashboard')
  }
)
```

Or use the object form when the trial also needs artifacts or direct browser overrides:

```js
test(
  'checkout works in WebKit',
  {
    browser: {
      project: 'safari',
      artifacts: {
        trace: true
      }
    }
  },
  async ({ page }) => {
    await page.goto('/checkout')
  }
)
```

Define the projects in `config/sounding.js`:

```js
module.exports.sounding = {
  browser: {
    projects: {
      desktop: {},
      mobile: {
        device: 'iPhone 13'
      },
      safari: {
        type: 'webkit'
      }
    }
  }
}
```

If a trial references a project that is not configured, Sounding fails before opening the browser and lists the available project names.

## Choose the right layer

Use browser trials for what only the browser can prove.

Leave lower-level behavior to:

- `test()` with `sails.helpers`
- `test()` with `get()` / `post()`
- `test()` with `visit()`

## What browser-capable trials add

When you opt into `{ browser: true }`, the trial context additionally gives you:

- `page`
- `browserContext`
- `browser`
- Playwright-flavored `expect()` behavior for browser assertions

It also makes helpers like `login.as(actorOrEmail, page)` useful in the same trial.
It also makes helpers like `login.withPassword(actorOrEmail, page, { password })` useful when the real browser form is the behavior.

## Typical browser cases

Use browser-capable trials for:

- sign-in journeys
- editor flows
- checkout or handoff flows
- mobile navigation
- anything where the DOM, navigation, or real page state is the behavior

Do not use browser-capable trials just because they exist.

If a request or Inertia contract can prove the behavior more cheaply and more clearly, prefer that lower layer first.
