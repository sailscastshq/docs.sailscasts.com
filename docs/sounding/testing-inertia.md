---
title: Testing Inertia Pages
editLink: true
---

# Testing Inertia pages

Use `visit()` when you want to test the server-side contract of an Inertia response.

Inertia responses have their own component, props, redirect, validation, and partial reload behavior.

When a repo uses a separate functional layer, these trials usually live under `tests/functional/pages/`.

If you want the full `visit()` surface and its relationship to request transport, read [Request clients and transport](/sounding/request-clients).

## `test()` for Inertia responses

Use `test()` when you want to test the server-side contract of an Inertia response without starting a browser.

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

Use partial reload assertions when a page only requests a subset of props.

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
