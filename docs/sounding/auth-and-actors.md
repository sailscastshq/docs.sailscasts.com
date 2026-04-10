---
title: Auth and Actors
editLink: true
---

# Auth and actors

Actors let request and browser helpers resolve auth state from a named role in the current world.

In Sounding terms:

- the **trial** states the behavior
- the **world** provides the situation
- the **actor** gives the role inside that situation

## What an actor is

An actor is the role a trial operates through inside a world.

Examples:

- `guest`
- `subscriber`
- `publisher`
- `unlockedReader`
- `teamOwner`

Actors usually come from a scenario:

```js
const current = await sails.sounding.world.use('issue-access')
```

Then the trial can reference them clearly:

- `current.users.subscriber`
- `current.users.publisher`
- `current.users.unlockedReader`

## `request.as(actor)`

When a request trial needs to act as an authenticated actor, use `request.as(actor)`.

```js
test('subscriber can read the issue', async ({ sails, expect }) => {
  const current = await sails.sounding.world.use('issue-access')

  const response = await sails.sounding.request
    .as(current.users.subscriber)
    .get(`/i/${current.issues.gatedIssue.slug}`)

  expect(response).toHaveStatus(200)
})
```

This lets request trials act as an authenticated user without manual session setup.

Sounding resolves common auth conventions such as:

- `User` with `req.session.userId`
- `Creator` with `req.session.creatorId`
- explicit overrides in `config/sounding.js` when an app uses custom naming

## `login.as(actorOrEmail, page)`

For browser-capable trials, Sounding gives you a higher-level login helper.

```js
test(
  'subscriber can finish the issue',
  { browser: true },
  async ({ sails, login, page, expect }) => {
    const current = await sails.sounding.world.use('issue-access')

    await login.as('subscriber', page)
    await page.goto(`/i/${current.issues.gatedIssue.slug}`)

    await expect(
      page.getByText(current.issues.gatedIssue.premiumDetail)
    ).toBeVisible()
  }
)
```

Useful details:

- if you pass an actor name like `'subscriber'`, Sounding will look for it in `world.current.users`
- if you pass an email address, Sounding will resolve or create that actor as needed
- the default browser login path currently uses a magic-link flow under the hood

## `login.withPassword(actorOrEmail, page, options)`

For apps that use real password login forms, Sounding should let the browser follow that flow instead of faking session state.

```js
test(
  'creator reaches invoices after password login',
  { browser: true },
  async ({ login, page, expect }) => {
    await login.withPassword('creator@example.com', page, {
      password: 'secret123',
      returnUrl: '/invoices'
    })

    await expect(page).toHaveURL(/\/invoices$/)
  }
)
```

This helper should:

- load the configured login page
- fill the app's real email and password fields
- respect extras like `rememberMe` and `returnUrl`
- work for both `User` and `Creator` style apps

## The `auth` helper surface

The top-level `auth` object is the lower-level auth API.

Today it includes:

- `auth.resolveActor(actorOrEmail)`
- `auth.issueMagicLink(actorOrEmail)`
- `auth.requestMagicLink(actorOrEmail)`
- `auth.request.withPassword(actorOrEmail, options)`
- `auth.login.as(actorOrEmail, page)`
- `auth.login.withPassword(actorOrEmail, page, options)`

### `auth.resolveActor()`

Use this when you need a real actor record and want Sounding to resolve either:

- a world actor name
- a user or creator object
- an email address

### `auth.issueMagicLink()`

Use this when you want the magic-link token and URL directly.

```js
const link = await auth.issueMagicLink('reader@example.com')
await page.goto(link.url)
```

### `auth.requestMagicLink()`

Use this when you want to exercise the actual app flow that requests a magic link and sends mail.

```js
test('requesting a magic link sends a usable email', async ({
  auth,
  mailbox,
  expect
}) => {
  const result = await auth.requestMagicLink('reader@example.com')
  const email = mailbox.latest()

  expect(result.response).toHaveStatus(302)
  expect(email.ctaUrl).toContain('/magic-link/')
})
```

### `auth.request.withPassword()`

Use this when you want to exercise the app's real password login action at the request layer.

```js
test('creator password login redirects to invoices', async ({
  auth,
  expect
}) => {
  const result = await auth.request.withPassword('creator@example.com', {
    password: 'secret123',
    returnUrl: '/invoices'
  })

  expect(result.response).toHaveStatus(302)
  expect(result.response).toRedirectTo('/invoices')
})
```

## A common pattern for actor-driven tests

A common flow is:

1. load a world
2. pick an actor from the world
3. use that actor through `request.as()` or `login.as()`

```js
test('publisher can create an issue', async ({ sails, expect }) => {
  const current = await sails.sounding.world.use('publisher-editor')

  const response = await sails.sounding.request
    .as(current.users.publisher)
    .post('/issues', {
      title: 'New issue'
    })

  expect(response).toHaveStatus(200)
})
```

## When to use actor names vs explicit emails

Use an **actor name** when the user is part of a named business situation:

- `'subscriber'`
- `'publisher'`
- `'unlockedReader'`

Use an **explicit email** when the trial is really about the auth path itself and you want to name the identity directly:

- `'reader@example.com'`
- `'browser-reader@example.com'`

## The main rule

Prefer actor names for named roles in a world. Use explicit emails when the test is about a specific identity.

A Sounding auth test should read like:

- _subscriber can open the issue_
- _publisher can save the draft_
- _reader receives a magic link_

not like:

- _user 3 with session state x can hit route y_
