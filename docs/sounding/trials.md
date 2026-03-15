---
title: Trials
editLink: true
---

# Trials

A **trial** is the smallest meaningful behavior Sounding asks your app to prove.

It is one named claim about how the product should behave in a real Sails runtime.

Examples:

- a guest is redirected from the dashboard
- a subscriber can read a members-only issue
- a publisher can save a draft
- requesting a magic link sends a usable email

That idea should feel familiar if you have used tools like Jest or Pest: a file contains a suite of related checks, and each named check proves one thing.

Sounding keeps that familiar shape, but gives it a more intentional name.

Why **trial**?

Because Sounding is part of a maritime ecosystem.
Before a ship commits to the voyage, it is tested against reality.
A trial is where you learn whether the app can safely proceed.

In practice, a trial is still written with `test()`:

```js
const { test } = require('sounding')

test('guest is redirected from dashboard', async ({ get, expect }) => {
  const response = await get('/dashboard')

  expect(response).toRedirectTo('/login')
})
```

So Sounding does **not** invent a strange new function name.
It uses the familiar `test()` API, while the docs use **trial** to describe what that test is doing inside the Sounding model.

## What makes a good trial

A good trial is:

- **named after behavior**, not implementation
- **small enough to understand quickly**
- **real enough to trust**
- **written at the right layer** for what it is proving

Good trial names:

- `guest is redirected from dashboard`
- `publisher can save draft changes`
- `requesting a magic link sends a usable email`

Weak trial names:

- `dashboard test`
- `issue test 2`
- `works correctly`
- `can call helper`

The title should read like a product truth.

## A trial is not the same thing as a world

These concepts are close, but they do different jobs.

- a **trial** is the behavior being proven
- a **world** is the business situation the trial lives inside
- an **actor** is the role the trial operates through
- the **trial context** is the object Sounding passes into `test()`

That means a single world can power many trials.

For example, `issue-access` might support all of these:

- guest sees the paywall state
- subscriber can read the full issue
- reader with an unlock can finish the story
- requesting a magic link from the issue page sends the right email

The world stays the same.
The trials change because the behaviors being proved are different.

## A trial should choose the right layer

Sounding is designed so the same `test()` shape works across multiple layers.

A helper-level trial:

```js
test('signupWithTeam creates a team', async ({ sails, expect }) => {
  const result = await sails.helpers.user.signupWithTeam({
    fullName: 'Kelvin O',
    email: 'kelvin@example.com',
    tosAcceptedByIp: '127.0.0.1'
  })

  expect(result.team.name).toBeDefined()
})
```

An endpoint-level trial:

```js
test('guest is redirected from dashboard', async ({ get, expect }) => {
  const response = await get('/dashboard')

  expect(response).toRedirectTo('/login')
})
```

An Inertia trial:

```js
test('pricing returns the right page props', async ({ visit, expect }) => {
  const page = await visit('/pricing')

  expect(page).toBeInertiaPage('billing/pricing')
  expect(page).toHaveProp('plans')
})
```

A browser-capable trial:

```js
test(
  'subscriber can finish the issue',
  { browser: true },
  async ({ login, page, expect }) => {
    await login.as('subscriber', page)
    await page.goto('/i/the-nerve-to-build')

    await expect(page.getByText("There's more to this story")).toHaveCount(0)
  }
)
```

The behavior decides the layer.
Not the other way around.

## A trial context is the environment of the trial

Every Sounding trial receives one object.
That object is the **trial context**.

It includes the real Sails runtime and the most useful test surfaces for the current layer, such as:

- `sails`
- `expect`
- `get()` / `post()`
- `visit()`
- `login`
- `world`
- `mailbox`
- `page` in browser-capable trials

If you want the full shape, read [Trial context](/sounding/trial-context).

## Trials, files, and suites

Sounding keeps the larger structure simple:

- a **trial** is one named behavior check
- a **file** groups related trials
- a **suite** is the whole test tree for the app

That is intentionally close to the mental model developers already know from Jest, Pest, and the native Node test runner.

What Sounding adds is a better Sails-native runtime under that familiar shape.

## The main rule

A Sounding trial should read like a product truth being proved inside a real Sails app.

That is the bar.
