---
title: Testing Sails Hooks
editLink: true
---

# Testing Sails hooks

Test a reusable hook against a real Sails instance with `sounding-plugin-hook`.
Each trial owns a fresh fixture, applies its configuration before boot, and
closes trial resources, lowers Sails and removes the fixture afterward.

## Install in the hook package

Keep the hook package's normal entry point and `sails.isHook` metadata. Install:

```bash
npm install -D sounding@^0.3.0 sounding-plugin-hook@^0.1.0 sails@^1.5.18
```

Sounding discovers the plugin from dependencies or devDependencies. No plugin
registration array is needed. Sounding 0.2.x does not support fixture preparation.

Create `test/assets.test.js` and run `npx sounding test`, or use
`node --test test/*.test.js`. The import remains `require('sounding')`.

## Example: Shipwright asset tags

Inside the real `sails-hook-shipwright` package, test manifest consumption and
view-local integration:

```js
const { test } = require('sounding')

test(
  'emits initial asset tags without eager-loading async chunks',
  {
    hook: {
      config: { dontLift: true },
      files: {
        '.tmp/public/manifest.json': JSON.stringify({
          entries: {
            app: {
              initial: { js: ['/js/app.a1b2.js'], css: ['/css/app.c3d4.css'] },
              async: { js: ['/js/settings.e5f6.js'] }
            }
          }
        })
      }
    }
  },
  async ({ sails, hook, expect }) => {
    expect(hook.scripts()).toBe('<script src="/js/app.a1b2.js"></script>')
    expect(hook.styles()).toBe(
      '<link rel="stylesheet" href="/css/app.c3d4.css">'
    )
    expect(sails.config.views.locals.shipwright.scripts()).toBe(hook.scripts())
    expect(sails.config.dontLift).toBe(true)
  }
)
```

The exact HTML assertions also prove that async chunks are not eagerly emitted.
The manifest is test input; this test does not perform an Rsbuild build or browser
navigation. Shipwright checks `dontLift: true` before starting its build/dev server,
so provide that flag explicitly even when the fixture uses Sails.load.

This contract was verified with Shipwright 1.5.1, Sails 1.5.18 and Node 24.14.1.
The plugin owns setup and cleanup; the callback focuses on public hook behavior.

## Context and configuration

`hook` is the actual `sails.hooks[hook.identity]`. `hook.name` is a read-only alias
of its identity. `hookApp` contains the package root/name, identity, generated
app path and direct mount metadata. Normal context helpers such as `sails`,
`expect` and request clients remain available.

Root defaults are optional, in the hook package's `config/sounding.js`:

```js
module.exports.sounding = {
  hook: {
    config: { example: { enabled: true } },
    files: {
      'config/routes.js':
        "module.exports.routes={'GET /health':(req,res)=>res.json({ok:true})}"
    }
  }
}
```

A trial's `hook.config` and `hook.files` override those defaults:

```js
test(
  'serves the configured route',
  { transport: 'http' },
  async ({ get, expect }) => {
    expect(await get('/health')).toHaveStatus(200)
  }
)
```

The fixture uses load by default. HTTP trials promote to lift and bind to loopback
with an ephemeral port. Default hooks are moduleloader, userconfig, helpers,
the target and Sounding; HTTP adds its request/response dependencies.

Hooks requiring ORM, views or other services must supply `hook.loadHooks` and
configuration/dependencies explicitly. The default excludes ORM and connects no
database. It supplies a placeholder datastore configuration required by the core
runtime. Browser/socket integrations require their own dependencies and validation.

## Fixture options

| Option      | Purpose                                                                         |
| ----------- | ------------------------------------------------------------------------------- |
| `name`      | Override identity inferred from installedHooks, sails.hookName or package name. |
| `module`    | Factory function or project-relative module path; defaults to package entry.    |
| `config`    | Sails boot configuration overrides.                                             |
| `files`     | Relative file paths mapped to string contents.                                  |
| `app`       | `load` or `lift`.                                                               |
| `loadHooks` | Select explicit hook dependencies before boot.                                  |
| `appPath`   | Copy existing fixture content into a fresh temporary app.                       |
| `mount`     | Only `direct` is supported.                                                     |

File paths cannot escape the fixture or write into `.git`/`node_modules`. Existing
fixture copying excludes `.git`, `.tmp` and `node_modules`, rejects symlinks, and
recreates package/config for the harness. Source fixtures are untouched.

## Isolation and failures

Each trial receives a fresh app and hook instance. Concurrent hook trials reject
with `E_SOUNDING_HOOK_CONCURRENCY`: Sails and Sounding use process globals, so
independent fixture directories do not establish safe parallel lifecycles.

Cleanup runs after handler and runtime boot failures. If a trial and cleanup both
fail, AggregateError retains both errors. Cleanup errors are visible test failures.
Manually managed app managers must await `lower()` and handle its rejection.

`test.hookFails`, `test.hookFactory`, package/api-hooks discovery mounts, warm
fixture reuse and `reload: false` are not supported by this release. Unsupported
options reject instead of silently doing nothing.

## Choose the smallest useful lane

Use factory unit tests for pure logic and fresh hook fixtures for lifecycle,
configuration and furnishing contracts. Use HTTP trials when an actual listener
matters, and a separate browser lane for browser behavior. Shared app reuse has a
lower startup cost but shares hook state; this plugin prioritizes fresh instances.
The current benchmark found no meaningful overall speedup. See the repository's
[measured lifecycle audit](https://github.com/sailscastshq/sounding/tree/main/bench)
for reproducible commands and its measurement limits.
