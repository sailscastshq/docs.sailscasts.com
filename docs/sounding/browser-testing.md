---
title: Browser Testing
editLink: true
---

# Browser testing

Sounding uses Playwright for browser trials, but the goal is not to make Playwright feel foreign inside a Sails app.

The goal is to make browser trials feel like the natural top layer of the same testing story.

## `test()` when the browser matters

Use browser trials when the real browser matters:

- sign in journeys
- mobile navigation
- editors and dashboards
- gated content flows
- checkout handoff

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

## Why worlds matter even more here

Browser trials become fragile when they carry too much setup.

That is why `sails.sounding.world.use()` matters so much. It lets the trial start from a named business situation instead of twenty lines of scattered setup code.

## Mobile should be first-class

Sounding should treat mobile browser projects as first-class citizens, not as an afterthought.

A good browser story should make it easy to run the same core flows across:

- desktop
- mobile
- dark mode when relevant

## The ideal browser split

Use browser trials for what only the browser can prove.

Leave lower-level behavior to:

- `test()` with `sails.helpers`
- `test()` with `get()` / `post()`
- `test()` with `visit()`

That keeps browser coverage high-value and resilient.

## What browser-capable trials add

When you opt into `{ browser: true }`, the trial context additionally gives you:

- `page`
- `browserContext`
- `browser`
- Playwright-flavored `expect()` behavior for browser assertions

It also makes helpers like `login.as(actorOrEmail, page)` useful in the same trial.

## A practical split that keeps browser tests healthy

Use browser-capable trials for:

- sign-in journeys
- editor flows
- checkout or handoff flows
- mobile navigation
- anything where the DOM, navigation, or real page state is the behavior

Do not use browser-capable trials just because they exist.

If a request or Inertia contract can prove the behavior more cheaply and more clearly, prefer that lower layer first.
