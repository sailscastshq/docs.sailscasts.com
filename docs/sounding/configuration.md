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
- `sockets.timeout = 1000`
- `sockets.transports = ['websocket']`
- `sockets.path = '/socket.io'`
- `browser.projects = ['desktop']`
- `browser.artifacts.outputDir = '.tmp/sounding/artifacts'`
- `browser.artifacts.screenshot = true`
- `browser.artifacts.currentUrl = true`
- `browser.artifacts.trace = false`
- `browser.artifacts.video = false`

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

Use either the shorthand form:

```js
module.exports.sounding = {
  datastore: 'inherit'
}
```

or the canonical object form:

```js
module.exports.sounding = {
  datastore: {
    mode: 'managed',
    identity: 'default',
    adapter: 'sails-sqlite',
    root: '.tmp/db',
    isolation: 'worker'
  }
}
```

Legacy nested managed config is no longer supported:

```js
// No longer supported.
module.exports.sounding = {
  datastore: {
    managed: {
      directory: '.tmp/db'
    }
  }
}
```

Use `mode: 'managed'` and `root` instead of `managed.directory`.

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

## `browser`

The `browser` section controls Playwright-backed browser trials.

The default project is `desktop`, and browser support is enabled by default:

```js
module.exports.sounding = {
  browser: {
    enabled: true,
    type: 'chromium',
    projects: ['desktop'],
    defaultProject: 'desktop'
  }
}
```

Most apps can leave this alone and opt into browser behavior trial by trial:

```js
test(
  'subscriber can read a gated issue',
  { browser: true },
  async ({ page }) => {
    await page.goto('/issues/the-nerve-to-build')
  }
)
```

Select a configured project with a string:

```js
test('mobile navigation works', { browser: 'mobile' }, async ({ page }) => {
  await page.goto('/dashboard')
})
```

Or use the object form when you also need trial-level browser options:

```js
test(
  'checkout works in WebKit',
  {
    browser: {
      project: 'safari'
    }
  },
  async ({ page }) => {
    await page.goto('/checkout')
  }
)
```

### `projects`

The simplest project list is still an array of names:

```js
module.exports.sounding = {
  browser: {
    projects: ['desktop', 'mobile'],
    defaultProject: 'desktop'
  }
}
```

Use named project objects when a project needs its own Playwright device, browser type, viewport, context options, or launch options:

```js
module.exports.sounding = {
  browser: {
    projects: {
      desktop: {},
      mobile: {
        device: 'iPhone 13'
      },
      safari: {
        type: 'webkit',
        viewport: {
          width: 1280,
          height: 720
        },
        contextOptions: {
          colorScheme: 'dark'
        },
        launchOptions: {
          slowMo: 25
        }
      }
    },
    defaultProject: 'desktop'
  }
}
```

Supported project fields:

- `type` - Playwright browser type: `chromium`, `firefox`, or `webkit`
- `device` - Playwright device name, such as `iPhone 13`
- `viewport` - `{ width, height }`
- `contextOptions` - options passed to `browser.newContext()`
- `launchOptions` - options merged into the browser launch call

The project-specific options are merged before per-trial overrides, so a trial can still fine-tune one run:

```js
test(
  'publisher can edit on mobile dark mode',
  {
    browser: {
      project: 'mobile',
      contextOptions: {
        colorScheme: 'dark'
      }
    }
  },
  async ({ page }) => {
    await page.goto('/publisher/issues/42/edit')
  }
)
```

If a trial names a project that is not configured, Sounding fails with the requested project and the list of available projects.

### `artifacts`

The `browser.artifacts` section controls what Sounding keeps when browser trials fail.

Defaults:

```js
module.exports.sounding = {
  browser: {
    artifacts: {
      outputDir: '.tmp/sounding/artifacts',
      screenshot: true,
      currentUrl: true,
      trace: false,
      video: false
    }
  }
}
```

By default, failed browser trials keep the current URL and a full-page screenshot.
The files are written under:

```txt
.tmp/sounding/artifacts/<trial-name>/<browser-project>/
```

For example:

```txt
.tmp/sounding/artifacts/subscriber-can-read-a-gated-issue/desktop/current-url.txt
.tmp/sounding/artifacts/subscriber-can-read-a-gated-issue/desktop/screenshot.png
```

### Artifact settings

Each artifact setting accepts a boolean:

- `true` keeps the artifact when the trial fails
- `false` disables the artifact

For trace and video, that gives a concise opt-in:

```js
module.exports.sounding = {
  browser: {
    artifacts: {
      trace: true,
      video: true
    }
  }
}
```

Artifact settings also accept explicit modes:

- `off`
- `on-failure`
- `on`

Use `on` when you want evidence from successful browser trials too:

```js
module.exports.sounding = {
  browser: {
    artifacts: {
      trace: 'on'
    }
  }
}
```

### Per-trial artifact overrides

A trial can override artifact settings without changing the app-wide defaults:

```js
test(
  'checkout keeps the cart after refresh',
  {
    browser: {
      artifacts: {
        trace: true,
        video: true
      }
    }
  },
  async ({ page }) => {
    await page.goto('/checkout')
  }
)
```

Use `artifacts: false` as a trial-level off switch:

```js
test(
  'fast browser smoke test',
  { browser: { artifacts: false } },
  async ({ page }) => {
    await page.goto('/health')
  }
)
```

### Artifact cleanup

Sounding writes browser artifacts to `.tmp/sounding/artifacts` by default, which keeps them out of source control in typical Sails apps.

Clean them whenever you want a fresh debug directory:

```sh
rm -rf .tmp/sounding/artifacts
```

If your CI uploads artifacts, upload `.tmp/sounding/artifacts` after failed test runs.
If your CI workspace is persistent, add a cleanup step before or after the test command.

## Diagnostics

Sounding keeps failure diagnostics concise by default. Response assertion failures show the request, response status, key headers, and a short body excerpt.

When a failing response needs more inspection, set:

```sh
SOUNDING_DIAGNOSTICS=verbose npm test
```

That expands response excerpts in assertion failures without changing `config/sounding.js`.

## `sockets`

The `sockets` section configures Sounding's Sails websocket helpers.

Most apps do not need to set this manually. Sounding can usually discover the lifted Sails server and connect to the conventional Sails socket path.

```js
module.exports.sounding = {
  sockets: {
    timeout: 1000,
    transports: ['websocket'],
    path: '/socket.io'
  }
}
```

Available options:

- `enabled`
- `timeout`
- `transports`
- `path`
- `baseUrl`
- `headers`
- `initialConnectionHeaders`

Use `baseUrl` when Sounding should connect to a socket server that is not the lifted Sails app it can discover automatically.

Use `headers` for headers sent with each Sails socket request.
Use `initialConnectionHeaders` for headers sent during the Socket.IO handshake, such as cookies or origin-sensitive test headers.

For examples, read [Websocket testing](/sounding/websocket-testing).
