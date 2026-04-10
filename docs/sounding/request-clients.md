---
title: Request Clients and Transport
editLink: true
---

# Request clients and transport

Sounding provides two closely related clients:

- `request` for endpoint and session-aware request behavior
- `visit` for Inertia-aware page contracts on top of that same request engine

Underneath those clients, Sounding can run over two transports:

- `virtual`
- `http`

## The request client

The request client is the fuller non-browser request surface in Sounding.

Every trial gets it as:

```js
test('guest is redirected from dashboard', async ({ request, expect }) => {
  const response = await request.get('/dashboard')

  expect(response).toRedirectTo('/login')
})
```

The top-level aliases like `get()` and `post()` are convenience methods bound from the same client.

## Request client methods

The request client exposes:

- `request(method, target, options?)`
- `get(target, options?)`
- `head(target, options?)`
- `post(target, payload, options?)`
- `put(target, payload, options?)`
- `patch(target, payload, options?)`
- `delete(target, payload, options?)`
- `withHeaders(headers)`
- `withSession(session)`
- `using(transport)`
- `as(actor)`

## `withHeaders()`

`withHeaders()` returns a new scoped client with default headers applied.

```js
const api = request.withHeaders({
  accept: 'application/json'
})
```

This does not mutate the original client.

## `withSession()`

`withSession()` returns a new scoped client with default session values applied.

```js
const verified = request.withSession({
  creatorEmail: 'creator@example.com'
})
```

This is especially useful in virtual request trials where session state is part of the behavior under test.

Like `withHeaders()`, it returns a new scoped client instead of mutating the original one.

## `using()`

`using()` returns a new scoped client pinned to a transport.

```js
const http = request.using('http')
const response = await http.get('/health')
```

This is how a single trial can keep most requests fast and virtual while opting one branch into real HTTP parity.

## `as()`

`as(actor)` scopes the client through a world actor.

```js
const response = await request.as(current.users.publisher).get('/dashboard')
```

Sounding looks for actor data in this order:

- `actor.headers` or `actor.sounding.headers`
- `actor.session` or `actor.sounding.session`
- otherwise it derives a session from the actor identity

When it derives a session automatically, it uses:

- the configured auth session key with `actor.id`
- `teamId` from `actor.team` or `actor.teamId` when present

This lets `request.as(actor)` follow the app's auth conventions without manual session setup.

## The visit client

`visit()` is the Inertia-aware layer built on top of the same request engine.

Use it when the contract is an Inertia page:

```js
test('pricing page returns the expected Inertia component', async ({
  visit,
  expect
}) => {
  const page = await visit('/pricing')

  expect(page).toBeInertiaPage('billing/pricing')
})
```

The visit client exposes:

- `visit(target, options?)`
- `visit.get(target, options?)`
- `visit.head(target, options?)`
- `visit.post(target, payload, options?)`
- `visit.put(target, payload, options?)`
- `visit.patch(target, payload, options?)`
- `visit.delete(target, payload, options?)`
- `visit.del(target, payload, options?)`
- `visit.using(transport)`

`visit.transport` also reflects the current transport.

## What `visit()` adds

`visit()` automatically adds the default Inertia headers:

- `x-inertia: true`
- `x-requested-with: XMLHttpRequest`
- `accept: text/html, application/xhtml+xml`

It also understands these Inertia-specific options:

- `component`
- `only`
- `except`
- `reset`
- `errorBag`
- `version`

Example:

```js
const page = await visit('/dashboard', {
  component: 'dashboard/index',
  only: ['notifications'],
  reset: ['sidebar'],
  errorBag: 'profile'
})
```

That becomes the same partial-reload headers an Inertia client would send.

Important:

- `component` is required when using `only`
- `component` is required when using `except`

## The two transports

### `virtual`

`virtual` is Sounding's default request transport.

It routes directly through the Sails app instead of going over the network.

Use it for:

- fast endpoint trials
- helper-adjacent request behavior
- session-aware auth flows
- most Inertia contract tests

Under the hood, Sounding routes these requests through the Sails router and passes along:

- headers
- a session object
- flash support

Use `http` when the test needs full network-stack parity.

### `http`

`http` sends real network requests with `fetch()`.

Use it when the test needs parity with the live HTTP stack, such as:

- cookie or CSRF behavior
- proxy-sensitive behavior
- true base URL behavior
- cases where the exact HTTP layer is the thing being proved

Sounding resolves a base URL in this order:

- `request.baseUrl`
- `browser.baseUrl`
- the lifted Sails server address
- `sails.config.port`

You can also pass an absolute URL or `baseUrl` per call.

## Choosing a transport

Transport selection happens in this order:

1. per-call override such as `get('/health', { transport: 'http' })`
2. a scoped client from `request.using('http')` or `visit.using('http')`
3. a trial-level option like `{ transport: 'http' }`
4. Sounding's configured default

If no explicit override is present, an absolute URL or `baseUrl` will also move the request onto HTTP.

Most suites should keep `virtual` as the default and opt into `http` only when the trial truly needs that stricter path.

## Payloads and query behavior

Payload handling works like this:

- `GET`, `HEAD`, and `DELETE` treat plain-object payloads like query params on virtual transport
- object and array payloads are JSON-encoded for HTTP when needed
- string and binary-like payloads pass through as-is

That means most endpoint trials can stay very close to ordinary request code.

## When to use what

Reach for:

- `get()` or `post()` when the trial is short and obvious
- `request` when you need headers, session state, actors, or transport control
- `visit()` when the response is an Inertia page contract
- browser trials when the DOM, navigation, or client runtime is the real behavior

The `request` and `visit` clients share the same transport model, headers, and scoping rules.
