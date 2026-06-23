---
title: Stress Testing
editLink: true
---

# Stress testing

Sounding stress testing lives in `sounding-plugin-stress`.

The plugin adds a Sails-native load-testing surface without making every
Sounding install carry a load engine dependency.

## What Sounding learned from Pest

Pest's stress testing has two nice ideas:

- a terminal command for quick checks
- an expectation-friendly API for tests that should guard performance over time

Sounding keeps those ideas, then makes them Sails-native.

The command is:

```bash
npx sounding stress /api/health
```

The trial API is:

```js
test.stress('health endpoint stays fast', async ({ stress, expect }) => {
  const result = await stress
    .get('/api/health')
    .concurrently(10)
    .for(5)
    .seconds()

  expect(result.requests.failed().count()).toBe(0)
  expect(result.requests.duration().p95()).toBeLessThan(250)
})
```

The Sails-native parts are where Sounding becomes its own thing:

- relative paths can lift and stress the local Sails app
- worlds can prepare product state before the load run
- actor aliases can become real Sails session cookies
- deployed URLs can still be stressed directly
- the load engine stays in a plugin instead of core

## Install

Install the plugin in a Sails app that already uses Sounding:

```bash
npm install -D sounding-plugin-stress
```

No `config/sounding.js` registration is required. Once installed, Sounding
discovers the plugin automatically from `package.json`.

Think of the dev dependency as the registration:

```json
{
  "devDependencies": {
    "sounding": "^0.2.0",
    "sounding-plugin-stress": "^0.1.0"
  }
}
```

There is no `plugins` array to maintain.

The plugin adds:

- `npx sounding stress`
- `test.stress(...)`
- a `stress` trial helper

## Autocannon

The first engine behind `sounding-plugin-stress` is
[`autocannon`](https://github.com/mcollina/autocannon).

`autocannon` is a Node.js HTTP benchmarking tool with a programmatic API. That
matters for Sounding because Sails, Sounding, and the test runner are already in
Node. The plugin can call the engine directly, pass normalized options, and turn
the raw result into a stable Sounding result object.

Sounding maps its API to `autocannon` like this:

| Sounding                                     | Engine option                                |
| -------------------------------------------- | -------------------------------------------- |
| `.concurrently(25)` / `--concurrency=25`     | `connections: 25`                            |
| `.for(10).seconds()` / `--duration=10`       | `duration: 10`                               |
| `.post('/api/invoices')` / `--method=POST`   | `method: 'POST'`                             |
| `.headers({...})` / `--header "Name: value"` | `headers`                                    |
| `.json(payload)` / `--json`                  | `body` plus `content-type: application/json` |

The trial result is not an `autocannon` object. It is a Sounding result with
stable metrics:

```js
result.requests.count()
result.requests.rate()
result.requests.failed().count()
result.requests.duration().p95()
result.testRun.concurrency()
```

The raw engine output is still available at `result.raw` when you need to debug
engine-specific details.

This keeps the dependency boundary honest: `autocannon` gives us a proven load
engine, while Sounding owns the Sails-aware API, actor/session setup, result
shape, and docs.

## CLI

Use `sounding stress <target>` for ad hoc checks, CI smoke load, and quick
performance baselines.

Stress an external or deployed URL directly:

```bash
npx sounding stress https://staging.example.com/api/health \
  --duration=10 \
  --concurrency=25
```

Stress a local Sails route:

```bash
npx sounding stress /api/health \
  --duration=10 \
  --concurrency=25
```

When the target is a relative path and no `--base-url` is provided, Sounding
lifts the local Sails app and stresses the real HTTP route.

Stress a Sails-shaped path against a chosen host:

```bash
npx sounding stress /api/health \
  --base-url=https://staging.example.com \
  --duration=10 \
  --concurrency=25
```

That mode does not lift the local app. It resolves the path against the host you
provided.

## Worlds and actors

Local Sails stress runs can load a world and use actor aliases:

```bash
npx sounding stress /api/billing/summary \
  --world=subscribed-creator \
  --as=owner \
  --duration=10 \
  --concurrency=20
```

Sounding lifts the app, loads the world, resolves `owner`, creates the matching
Sails session cookie, and runs real HTTP traffic through the route.

Remote and `--base-url` runs cannot use `--world` or `--as` because the remote
server does not share the local test world. Use headers or tokens instead:

```bash
npx sounding stress https://staging.example.com/api/me \
  --header "Authorization: Bearer $TOKEN" \
  --duration=10 \
  --concurrency=25
```

## Methods, bodies, and headers

Use `--method` for any HTTP method:

```bash
npx sounding stress /api/events \
  --method=POST \
  --json '{"name":"invoice.created"}'
```

Method shorthands are available:

```bash
npx sounding stress /api/health --get
npx sounding stress /api/invoices --post='{"plan":"pro"}'
npx sounding stress /api/invoices/1 --patch='{"memo":"updated"}'
npx sounding stress /api/session --delete
```

Add headers with `--header`. Repeat it when you need more than one header:

```bash
npx sounding stress /api/invoices \
  --post='{"plan":"pro"}' \
  --header "Authorization: Bearer $TOKEN" \
  --header "x-test-lane: stress"
```

Use `--json` for JSON payloads and `--body` for raw bodies:

```bash
npx sounding stress /api/events \
  --method=POST \
  --json '{"kind":"checkout.completed"}'

npx sounding stress /api/upload-token \
  --put \
  --body raw-payload
```

## CLI reference

```txt
sounding stress <target> [options]

Targets:
  /api/health                         Lift the local Sails app and stress a route.
  https://example.com/api/health      Stress an external URL directly.
  /api/health --base-url=<url>        Stress a path on a chosen host.

Options:
  --duration <seconds>                Duration in seconds. Defaults to 10.
  --concurrency <requests>            Concurrent requests. Defaults to 1.
  --connections <requests>            Alias for --concurrency.
  --method <method>                   HTTP method.
  --get, --head, --options            Method shorthands.
  --post, --put, --patch, --delete    Method shorthands. Body-capable flags accept JSON.
  --header "Name: value"              Add a request header. May be repeated.
  --json '<payload>'                  Send a JSON body.
  --body <payload>                    Send a raw body.
  --base-url <url>                    Resolve a relative target against this host.
  --world <scenario>                  Load a Sounding world before stressing a local app.
  --as <actor>                        Use a world actor alias for local Sails auth/session.
```

## Trial API

Use `test.stress()` when load is the behavior being proven.

```js
const { test } = require('sounding')

test.stress(
  'billing summary stays fast under creator load',
  { world: 'subscribed-creator' },
  async ({ stress, expect }) => {
    const result = await stress
      .get('/api/billing/summary')
      .as('owner')
      .concurrently(20)
      .for(10)
      .seconds()

    expect(result.requests.failed().count()).toBe(0)
    expect(result.requests.duration().p95()).toBeLessThan(250)
  }
)
```

`test.stress()` is still a normal Sounding trial. The plugin gives it an HTTP
transport default, then adds the `stress` helper to the trial context.

It belongs to the same declaration family as `test.it()`, `test.only()`,
`test.skip()`, and `test.concurrent()`. Use it when the trial itself is about
load behavior. Use `test.it()` for ordinary behavior trials.

You can also use the helper from an explicitly HTTP trial:

```js
test(
  'health endpoint has no failed requests',
  { transport: 'http' },
  async ({ stress, expect }) => {
    const result = await stress
      .get('/api/health')
      .concurrently(25)
      .for(10)
      .seconds()

    expect(result.requests.failed().count()).toBe(0)
  }
)
```

## Fluent stress client

The stress client supports common HTTP methods:

```js
stress.request(method, target, payload)
stress.get(target)
stress.head(target)
stress.options(target, payload)
stress.post(target, payload)
stress.put(target, payload)
stress.patch(target, payload)
stress.delete(target, payload)
```

Chains are promise-like. Awaiting a chain runs it:

```js
const result = await stress.get('/api/health')
```

Use `.run()` when you want the execution point to be explicit:

```js
const result = await stress.get('/api/health').concurrently(10).run()
```

Chain helpers:

```js
const result = await stress
  .post('/api/invoices')
  .as('owner')
  .baseUrl('https://staging.example.com')
  .header('x-test-lane', 'stress')
  .headers({ accept: 'application/json' })
  .json({ plan: 'pro' })
  .concurrently(20)
  .for(10)
  .seconds()
```

Available chain helpers:

| API                     | Purpose                                     |
| ----------------------- | ------------------------------------------- |
| `.as(actor)`            | Use an actor object or world actor alias.   |
| `.baseUrl(url)`         | Resolve a relative target against a host.   |
| `.header(name, value)`  | Add one request header.                     |
| `.headers(object)`      | Merge request headers.                      |
| `.json(payload)`        | Send a JSON payload and set `content-type`. |
| `.body(payload)`        | Send a raw payload.                         |
| `.concurrently(count)`  | Set concurrent requests.                    |
| `.for(count).seconds()` | Run for a duration in seconds.              |
| `.run()`                | Execute the chain explicitly.               |

## Actor auth

`as(actor)` accepts:

- an actor object
- a world actor alias, such as `owner`
- an actor object with `headers` or `sounding.headers`
- an actor object whose identity can be converted into the configured auth session

For local Sails runs, Sounding can turn the actor into a real Sails session
cookie before the load run starts.

For remote targets, use request headers:

```js
const result = await stress
  .get('https://staging.example.com/api/me')
  .header('authorization', `Bearer ${token}`)
  .concurrently(10)
  .for(5)
  .seconds()
```

## Metrics

The result object is built for assertions:

```js
result.requests.count()
result.requests.rate()
result.requests.failed().count()
result.requests.failed().rate()
result.requests.duration().min()
result.requests.duration().med()
result.requests.duration().median()
result.requests.duration().mean()
result.requests.duration().average()
result.requests.duration().p90()
result.requests.duration().p95()
result.requests.duration().p99()
result.requests.duration().max()
result.requests.ttfb().duration().p95()
result.requests.download().data().count()
result.requests.download().data().rate()
result.requests.upload().data().count()
result.requests.upload().data().rate()
result.testRun.concurrency()
result.testRun.duration()
result.toJSON()
result.raw
```

For example:

```js
expect(result.requests.failed().count()).toBe(0)
expect(result.requests.duration().p95()).toBeLessThan(250)
expect(result.requests.rate()).toBeGreaterThan(100)
```

## Output

The CLI prints a compact summary:

```txt
STRESS GET http://127.0.0.1:1337/api/health
Requests: 6088 total, 6090/s, 0 failed
Latency: med 0ms, p95 0ms, max 6ms
Run: 1s, concurrency 1
```

The command exits with status `1` when failed requests are detected.

## Engine

The first engine is `autocannon`, owned by `sounding-plugin-stress`.

Sounding owns the public API and normalized result model. That keeps trial code
stable if the plugin adds another engine later.

This is different from making `autocannon` a direct Sounding dependency. The
plugin boundary keeps core installs light and makes heavier future features, such
as mutation testing, follow the same shape.

## When to use stress testing

Use stress trials for lightweight performance contracts:

- an endpoint should not return failed requests under expected concurrency
- p95 latency should stay below a known threshold
- authenticated hot paths should survive realistic local load
- a deployed staging endpoint should stay healthy before release

Do not use stress trials as a full production capacity plan by themselves. They
are a fast feedback loop for regressions and obvious bottlenecks.

## Plugin details

Read [Plugins](/sounding/plugins) for how Sounding discovers plugins and how a
plugin can register commands, focused test methods, trial helpers, and events.
