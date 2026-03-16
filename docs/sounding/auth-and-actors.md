---
title: Auth and Actors
editLink: true
---

# Auth and actors

A lot of important product behavior is really about **who** is acting.

In Sounding terms:

- the **trial** states the behavior
- the **world** provides the situation
- the **actor** gives the role inside that situation

That is why Sounding treats **actors** as a first-class concept.

- what does a guest see?
- what can a subscriber open?
- what can a publisher publish?
- what email does a reader receive?

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

That is much better than carrying around anonymous test records.

## `request.as(actor)`

When a request trial needs to act as a user, use `request.as(actor)`.

```js
test('subscriber can read the issue', async ({ sails, expect }) => {
  const current = await sails.sounding.world.use('issue-access')

  const response = await sails.sounding.request
    .as(current.users.subscriber)
    .get(`/i/${current.issues.gatedIssue.slug}`)

  expect(response).toHaveStatus(200)
})
```

This keeps authenticated request trials readable without forcing every test to hand-roll session state.

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

A few useful details:

- if you pass an actor name like `'subscriber'`, Sounding will look for it in `world.current.users`
- if you pass an email address, Sounding will resolve or create that user as needed
- the default browser login path currently uses a magic-link flow under the hood

That makes the browser story realistic without making every browser test repeat auth boilerplate.

## The `auth` helper surface

The top-level `auth` object is the lower-level auth API.

Today it includes:

- `auth.resolveUser(actorOrEmail)`
- `auth.issueMagicLink(actorOrEmail)`
- `auth.requestMagicLink(actorOrEmail)`
- `auth.login.as(actorOrEmail, page)`

### `auth.resolveUser()`

Use this when you need a real user record and want Sounding to resolve either:

- a world actor name
- a user object
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

## A good pattern for actor-driven tests

A good default is:

1. load a world
2. pick an actor from the world
3. use that actor through `request.as()` or `login.as()`

That gives the trial a nice product-shaped rhythm.

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

That small choice keeps tests readable.

## The main rule

Actors are not just there to save typing.

They exist so the test can talk in product language.

A good Sounding auth test should read like:

- _subscriber can open the issue_
- _publisher can save the draft_
- _reader receives a magic link_

not like:

- _user 3 with session state x can hit route y_
