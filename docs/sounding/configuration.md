---
title: Configuration
editLink: true
---

# Configuration

Sounding can be configured through `config/sounding.js`, but the file is optional. Most apps can rely on the defaults and add it only when they need an override.

That means there are two layers:

- `config/env/test.js` defines how your app behaves in test mode
- optional `config/sounding.js` overrides how Sounding runs trials against that app

## The recommended split

### `config/env/test.js`

Use `config/env/test.js` for app-level test settings:

- model migration strategy
- mail transport
- log level
- port / host settings
- any test-only app config

If you stay on Sounding's managed datastore defaults, you usually do not need to declare a datastore here at all.

```js
module.exports = {
  port: 3333,

  models: {
    migrate: 'drop'
  },

  mail: {
    default: 'log'
  },

  log: {
    level: 'error'
  }
}
```

### `config/sounding.js`

Add `config/sounding.js` only when you want to override Sounding's defaults:

```js
module.exports.sounding = {
  environments: ['test'],

  datastore: 'inherit',

  browser: {
    defaultProject: 'mobile'
  }
}
```

## Default values

Sounding defaults to:

- `environments = ['test']`
- `datastore.mode = 'managed'`
- `datastore.identity = 'default'`
- `datastore.adapter = 'sails-sqlite'`
- `datastore.root = '.tmp/db'`
- `datastore.isolation = 'worker'`
- `world.factories = 'tests/factories'`
- `world.scenarios = 'tests/scenarios'`
- `mail.capture = true`
- `request.transport = 'virtual'`
- `browser.projects = ['desktop']`

These are the starting defaults for a new Sounding setup.

## `environments`

The `environments` section tells Sounding which Sails environments are allowed to boot the hook.

The default is:

- `['test']`

That means Sounding stays dark in other app boot paths like `development`, `console`, or `production` unless you opt in deliberately.

Use this when you intentionally need Sounding outside the normal test lane:

```js
module.exports.sounding = {
  environments: ['test', 'console']
}
```

Or, if you truly want it in production-like boots:

```js
module.exports.sounding = {
  environments: ['test', 'production']
}
```

## `world`

The `world` section tells Sounding where to find factories and scenarios and how to seed deterministic data.

- `factories` - path to your factory definitions
- `scenarios` - path to your scenario definitions
- `seed` - default deterministic seed for reproducible data

## `datastore`

The `datastore` section tells Sounding how to work with your app's Sails datastore configuration.

### `mode`

`mode` controls the relationship between Sounding and your app's test datastore.

#### `inherit`

Use `inherit` when the app already defines its own test datastore in `config/env/test.js` and Sounding should use it as-is.

#### `managed`

`managed` is the default. Sounding provisions a temporary datastore before the app lifts, using `sails-sqlite` and storing files under `.tmp/db`.

#### `external`

Use `external` when a separate process manages the test datastore, such as a dedicated Postgres instance.

### `identity`

The datastore identity Sounding should target, usually `default`.

### `adapter`

The adapter Sounding should provision when `mode` is `managed`. In `0.0.1`, the supported default is `sails-sqlite`.

### `isolation`

How Sounding isolates managed datastores.

A strong default is `worker`, which gives each worker its own temporary datastore.

### `root`

Where Sounding should place managed SQLite files. The default is `.tmp/db`, and most apps should not need to override it.

## `request`

The `request` section tells Sounding how non-browser trials should talk to the app.

If you want the full request client API on top of these settings, read [Request clients and transport](/sounding/request-clients).

### `transport`

Default:

- `virtual`

That means request helpers like `get()` and `post()` are powered by `sails.request()`.

This is the default for helper-adjacent endpoint trials, JSON API trials, and many Inertia-style trials.

When you need stricter parity with the live HTTP stack, Sounding should also support:

- `http`

In that mode, Sounding talks to a listening app over the network.

### `baseUrl`

Optional base URL for HTTP transport when you want Sounding to target a lifted server explicitly.

```js
request: {
  transport: 'http',
  baseUrl: 'http://127.0.0.1:3333',
}
```

### Transport override order

Transport overrides are applied in this order:

1. request helper call options such as `get('/health', { transport: 'http' })`
2. trial options such as `test('...', { transport: 'http' }, async (...) => {})`
3. the Sounding defaults or your optional `config/sounding.js` override

For one-off needs inside a trial, you should also be able to scope a client directly:

```js
const http = sails.sounding.request.using('http')
const response = await http.get('/health')
```

That keeps one request API while still letting a trial opt into true HTTP parity when it matters.

Most Sounding trials should still be written in terms of:

- helpers
- Waterline records
- requests
- Inertia responses
- Playwright flows

not raw adapter details.
