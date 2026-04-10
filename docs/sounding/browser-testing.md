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
  { browser: true },
  async ({ sails, page, login, expect }) => {
    await sails.sounding.world.use('issue-access')
    await login.as('subscriber', page)

    await page.goto('/issues/the-nerve-to-build')

    await expect(page.getByText('The rest of the story')).toBeVisible()
  }
)
```

## Load a world before browser setup

Browser trials become harder to maintain when they carry too much setup. Use `sails.sounding.world.use()` to start from a named business situation.

## Run the same flows across browser projects

Run the same core flows across:

- desktop
- mobile
- dark mode when relevant

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
