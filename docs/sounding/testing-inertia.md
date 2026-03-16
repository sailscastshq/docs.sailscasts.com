---
title: Testing Inertia Pages
editLink: true
---

# Testing Inertia pages

Inertia responses deserve their own testing lane.

They are not just JSON, and they are not just browser pages. They are a Sails response model with their own shape, props, redirects, validation, and partial reload behavior.

## `test()` for Inertia responses

Use `test()` when you want to test the server-side contract of an Inertia response without jumping straight to a browser flow.

```js
import { test } from 'sounding'

test('pricing page returns the correct component and props', async ({
  visit,
  expect
}) => {
  const page = await visit('/pricing')

  expect(page).toBeInertiaPage('billing/pricing')
  expect(page).toHaveProp('plans')
  expect(page).toHaveProp('auth.user', null)
})
```

## Validation and redirects

```js
import { test } from 'sounding'

test('sign up returns validation errors for invalid input', async ({
  visit,
  expect
}) => {
  const page = await visit.post('/signup', {
    fullName: '',
    emailAddress: 'not-an-email'
  })

  expect(page).toBeInertiaPage('auth/signup')
  expect(page).toHaveValidationError('fullName')
  expect(page).toHaveValidationError('emailAddress')
})
```

## Partial reloads

A good Inertia testing story should also cover partial reload behavior when a page only requests a subset of props.

That keeps the framework honest about how modern Sails + Inertia apps really behave.

```js
import { test } from 'sounding'

test('dashboard can request only notifications', async ({ visit, expect }) => {
  const page = await visit('/dashboard', {
    component: 'dashboard/index',
    only: ['notifications'],
    reset: ['sidebar']
  })

  expect(page).toBeInertiaPage('dashboard/index')
  expect(page).toHaveProp('notifications')
})
```

Under the hood, Sounding should translate that into the same Inertia headers the client would send, including `X-Inertia-Partial-Data`, `X-Inertia-Partial-Component`, and `X-Inertia-Reset`.

## Useful Inertia matchers

- `toBeInertiaPage()`
- `toHaveProp()`
- `toMatchProp()`
- `toHaveSharedProp()`
- `toHaveValidationError()`
- `toRedirectTo()`

This is one of Sounding's most important jobs: make Inertia testing feel like a first-class citizen instead of a half-step between HTTP and E2E.
