---
title: Configuration
editLink: true
---

# Configuration

Sounding can be configured through `config/sounding.js`, but the file is optional. Most apps can ride the defaults and only add it when they need an override.

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
  datastore: 'inherit',

  browser: {
    defaultProject: 'mobile'
  }
}
```

## Good defaults

Sounding should ship with defaults that feel calm and predictable:

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

These defaults make it easy to install Sounding and go, while still leaving room for deliberate overrides later.

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

This is the advanced option for apps that already have a serious test datastore story in `config/env/test.js` and want Sounding to respect it as-is.

#### `managed`

This is the default. Sounding provisions a temporary datastore for the run before the app lifts, using `sails-sqlite` and storing files under `.tmp/db`.

Use this for the normal zero-ceremony Sounding experience.

#### `external`

Sounding validates and uses a separately managed test datastore, such as a dedicated Postgres instance.

Use this when you need database-specific behavior without giving Sounding responsibility for provisioning it.

### `identity`

The datastore identity Sounding should target, usually `default`.

### `adapter`

The adapter Sounding should provision when `mode` is `managed`. In `0.0.1`, the first-class choice is `sails-sqlite`.

### `isolation`

How Sounding isolates managed datastores.

A strong default is `worker`, which gives each worker its own temporary datastore.

### `root`

Where Sounding should place managed SQLite files. The default is `.tmp/db`, and most apps should not need to override it.

## `request`

The `request` section tells Sounding how non-browser trials should talk to the app.

### `transport`

A calm default is:

- `virtual`

That means request helpers like `get()` and `post()` are powered by `sails.request()`.

This is the most Sails-native default for helper-adjacent endpoint trials, JSON API trials, and many Inertia-style trials.

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

### Switching transport cleanly

Sounding should let transport choice stay boring and explicit.

The override order should be:

1. request helper call options such as `get('/health', { transport: 'http' })`
2. trial options such as `test('...', { transport: 'http' }, async (...) => {})`
3. the Sounding defaults or your optional `config/sounding.js` override

For one-off needs inside a trial, you should also be able to scope a client directly:

```js
const http = sails.sounding.request.using('http')
const response = await http.get('/health')
```

That keeps one request API while still letting a trial opt into true HTTP parity when it matters.

## Why this design matters

The goal is not to make datastore choice irrelevant.

The goal is to make datastore choice affect as little test code as possible.

Most Sounding trials should still be written in terms of:

- helpers
- Waterline records
- requests
- Inertia responses
- Playwright flows

not raw adapter details.

That is how Sounding stays elegant while still respecting real Sails infrastructure.
