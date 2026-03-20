---
title: Testing JSON APIs and Endpoints
editLink: true
---

# Testing JSON APIs and endpoints

Sounding should be just as good for API-only Sails apps as it is for full browser flows.

That is why endpoint testing is a first-class part of the framework.

## `test()` for JSON and endpoint behavior

Use `test()` for real HTTP behavior:

- status codes
- headers
- redirects
- JSON bodies
- guest vs authenticated access
- policy interaction

```js
import { test } from 'sounding'

test('guest gets 401 on a private JSON endpoint', async ({ get, expect }) => {
  const response = await get('/api/issues')

  expect(response).toHaveStatus(401)
})
```

Most endpoint trials should use Sounding's virtual request transport by default. That means `get()` and `post()` are usually powered by `sails.request()`.

When parity with the real HTTP stack matters more, opt in deliberately:

```js
test(
  'csrf-sensitive signup works over real http',
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

If only one part of the trial needs that stricter path, scope it locally instead:

```js
test('mix virtual speed with one real-http check', async ({
  sails,
  expect
}) => {
  const response = await sails.sounding.request.using('http').get('/health')

  expect(response).toHaveStatus(200)
})
```

## Authenticated endpoint trials

```js
import { test } from 'sounding'

test('publisher can create an issue', async ({ sails, expect }) => {
  const current = await sails.sounding.world.use('publisher-team')

  const response = await sails.sounding.request
    .as(current.users.publisher)
    .post('/api/issues', {
      title: 'New issue'
    })

  expect(response).toHaveStatus(201)
  expect(response).toHaveJsonPath('title', 'New issue')
})
```

When the app's real password login action matters, use the first-party request auth helper instead of inventing session setup by hand:

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

Sounding should also keep `request.as(actor)` aligned with the app's auth conventions, including
`User` / `userId` and `Creator` / `creatorId`.

## The two request surfaces

Sounding gives you the same request engine in two shapes:

- top-level aliases like `get()` and `post()` for the common path
- the fuller `sails.sounding.request` client when you want to scope headers, sessions, actors, or transports

A good rule is:

- start with `get()` / `post()` when the trial is simple
- reach for `sails.sounding.request` when you need more control

## Useful endpoint matchers

Sounding's request story currently leans on a small set of matchers that map cleanly to product behavior:

- `toHaveStatus()`
- `toRedirectTo()`
- `toHaveJsonPath()`
- `toHaveHeader()`

That keeps endpoint trials precise without making them feel low-level.
