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

For Sails websocket requests and realtime event assertions, use [Websocket testing](/sounding/websocket-testing). Socket trials have HTTP-shaped helpers too, but they exercise Sails' socket request interpreter instead of the normal request transports on this page.

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

## Failure diagnostics

When a response assertion fails, Sounding includes the request and response context that usually explains what happened.

```js
const response = await request.get('/health')

expect(response).toHaveStatus(200)
```

If the app returned `500`, the failure includes a compact diagnostic block:

```txt
Expected response status 200, received 500.

Sounding response diagnostics:
- Request: GET /health (virtual)
- Response: 500 Server Error
- Headers: content-type: application/json, x-request-id: req_123
- Body: {"message":"Database unavailable","detail":"Connection pool exhausted"}
```

The same response diagnostics are used by request, visit, Inertia, validation, and socket request assertions when the response shape is available.

By default, Sounding keeps the body excerpt concise. When you need the full response body while debugging a failure, run the trial with:

```sh
SOUNDING_DIAGNOSTICS=verbose npm test
```

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

## Inspecting virtual session state

Virtual request responses expose the final `req.session` snapshot as `response.session`.

```js
const response = await request.post('/login', {
  email: 'ada@example.com',
  password: 'secret123'
})

expect(response.session.userId).toBe(user.id)
expect(response.session.returnTo).toBe('/dashboard')
```

This is useful for request-level auth flows where the important behavior is stored in session before the next redirect or page visit.

`response.session` is a snapshot taken after the route handler finishes. Later requests on the same client can keep mutating the shared virtual session, but earlier response snapshots do not change.

For example:

```js
const login = await request.post('/login', credentials)
const logout = await request.post('/logout')

expect(login.session.userId).toBe(user.id)
expect(logout.session.userId).toBeUndefined()
```

Real HTTP responses leave `response.session` undefined because server-side session state is hidden behind cookies and the app's session store.

## `using()`

`using()` returns a new scoped client pinned to a transport.

```js
const http = request.using('http')
const response = await http.get('/health')
```

This is how a single trial can keep most requests fast and virtual while opting one branch into real HTTP parity.

## `as()`

`as(actor)` scopes the client through an actor.

```js
const response = await request.as(current.users.publisher).get('/dashboard')
```

When a named world has been loaded, you can pass the actor alias directly:

```js
await world.use('publisher-dashboard')

const response = await request.as('publisher').get('/dashboard')
```

You can also pass an email address when the app's configured auth model can resolve it:

```js
const response = await request.as('reader@example.com').get('/me')
```

Sounding looks for actor data in this order:

- an actor alias in the current world, such as `world.current.users.publisher`
- an existing auth model record when the actor is an email string
- `actor.headers` or `actor.sounding.headers`
- `actor.session` or `actor.sounding.session`
- otherwise it derives a session from the actor identity

When it derives a session automatically, it uses:

- the configured auth session key with `actor.id`
- `teamId` from `actor.team` or `actor.teamId` when present

This lets `request.as(actor)` follow the app's auth conventions without manual session setup.

If an alias cannot be resolved, Sounding lists the available actor names from the current world.

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
- `visit.as(actor)`

`visit.transport` also reflects the current transport.

`visit.as(actor)` mirrors `request.as(actor)`, so Inertia contract trials can use world actor aliases too:

```js
await world.use('billing-dashboard')

const page = await visit.as('owner')('/billing')

expect(page).toBeInertiaPage('billing/show')
```

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
