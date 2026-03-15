---
title: Trial Context
editLink: true
---

# Trial context

A **trial** is one named behavior check.
The **trial context** is the environment Sounding passes into that trial.

Every Sounding trial starts the same way:

```js
const { test } = require('sounding')

test('guest is redirected from dashboard', async ({ get, expect }) => {
  const response = await get('/dashboard')

  expect(response).toRedirectTo('/login')
})
```

That object passed into the callback is the **trial context**.

If you are looking for the higher-level definition of a trial itself, read [Trials](/sounding/trials).

The trial context is Sounding's most important design decision.

It gives each trial:

- the real Sails runtime
- the most useful testing surfaces for the current trial
- a few ergonomic aliases for common work

The goal is not to hide Sails.
It is to make the right things easy without inventing a second fake app model.

## The canonical center is `sails`

At the center of every trial is `sails`.

That means the normal Sails surfaces still matter most:

- `sails.helpers`
- `sails.models`
- `sails.config`
- `sails.hooks`
- `sails.sounding`

If you already know Sails, the testing story should feel familiar.

## What is available in the context

### `sails`

The real app runtime for the current trial.

Use it when you want the canonical surface:

```js
test('helper trial', async ({ sails, expect }) => {
  const result = await sails.helpers.user.signupWithTeam({
    fullName: 'Kelvin O',
    email: 'kelvin@example.com',
    tosAcceptedByIp: '127.0.0.1'
  })

  expect(result.team.name).toBeDefined()
})
```

### `expect`

Sounding's default assertion API.

It covers:

- generic assertions like `toBe()` and `toEqual()`
- request assertions like `toHaveStatus()` and `toRedirectTo()`
- Inertia assertions like `toBeInertiaPage()` and `toHaveProp()`
- Playwright assertions when the trial is browser-capable

### `request`

The scoped request client for the current trial.

Use it when you want the fuller request surface:

```js
const response = await request.as(current.users.subscriber).get('/dashboard')
```

### `get`, `head`, `post`, `put`, `patch`, `del`

Convenience aliases bound from `request`.

These are ideal when the trial is simple and readable with a short call:

```js
const response = await get('/dashboard')
```

### `visit`

The Inertia-aware request surface.

Use it when the real contract is an Inertia page, not just a status code.

```js
const page = await visit('/pricing')
expect(page).toBeInertiaPage('billing/pricing')
```

### `auth`

Sounding's auth helpers.

This is the lower-level auth surface for:

- resolving users
- issuing magic links
- requesting magic links through the real app flow

### `login`

A convenience alias for `auth.login`.

Use it in browser-capable trials:

```js
await login.as('subscriber', page)
```

### `world`

A convenience alias for `sails.sounding.world`.

Use it to load named business situations:

```js
const current = await world.use('issue-access')
```

### `mailbox`

A convenience alias for `sails.sounding.mailbox`.

Use it for assertions on outgoing transactional mail:

```js
const email = mailbox.latest()
expect(email.ctaUrl).toContain('/magic-link/')
```

### `page`, `browserContext`, `browser`

These are only available in **browser-capable** trials.

To get them, opt in explicitly:

```js
test(
  'reader can finish the issue',
  { browser: true },
  async ({ page, login }) => {
    await login.as('subscriber', page)
    await page.goto('/i/the-nerve-to-build')
  }
)
```

This is deliberate. The browser should only show up when the browser actually matters.

### `t`

The underlying Node test context.

This keeps Sounding grounded in the native Node test runner instead of hiding it.

## Trial options

Sounding keeps trial options intentionally small.

### `{ browser: true }`

Boots the browser surface for the trial and makes `page`, `browserContext`, and `browser` available.

### `{ transport: 'http' }`

Tells request aliases and `visit()` to use the real HTTP transport for the whole trial.

```js
test(
  'signup should run over real http',
  { transport: 'http' },
  async ({ post, expect }) => {
    const response = await post('/signup', {
      fullName: 'Kelvin O',
      emailAddress: 'kelvin@example.com'
    })

    expect(response).toHaveStatus(200)
  }
)
```

### Native Node test options

Sounding also passes through normal Node test options where appropriate.

And you still have the standard helpers:

- `test.skip()`
- `test.todo()`
- `test.only()`

## Canonical vs convenient

A good way to think about the context is:

- `sails` is canonical
- the top-level aliases are convenience

So if you are not sure which surface to reach for, use this rule:

- use `sails.helpers`, `sails.models`, and `sails.sounding` when you want the most explicit form
- use `get()`, `post()`, `visit()`, `login`, `world`, and `mailbox` when they make the trial easier to read

That balance is what keeps Sounding elegant instead of magical.
