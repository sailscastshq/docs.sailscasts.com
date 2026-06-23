---
title: Plugins
editLink: true
---

# Plugins

Sounding keeps core small and lets heavier capabilities live in installable
plugins.

That means a normal Sails app can keep using the core testing runtime, while
features such as stress testing, mutation testing, or future specialized
reporters can bring their own dependencies only when an app asks for them.

## Install-only setup

Install a Sounding plugin as a dev dependency:

```bash
npm install -D sounding-plugin-stress
```

Then use the API it adds:

```bash
npx sounding stress /api/health --duration=10 --concurrency=25
```

There is no `plugins` array and no `config/sounding.js` registration step. The
dev dependency is the registration: Sounding discovers plugin packages from the
app's `package.json`.

`config/sounding.js` is still available for core Sounding runtime overrides, such
as datastore, auth, browser projects, or diagnostics. It is not where users
register plugins.

## Discovery

Sounding discovers package names that match either of these patterns:

- `sounding-plugin-*`
- `@sounding/plugin-*`

For local monorepo development, Sounding also discovers plugins under
`plugins/*` when each plugin folder has its own `package.json` with a matching
package name.

For example:

```txt
my-sails-app/
  package.json
  plugins/
    stress/
      package.json
      index.js
```

If `plugins/stress/package.json` is named `sounding-plugin-stress`, Sounding can
load it while you work locally.

## What plugins can add

A plugin can add three public surfaces:

- CLI commands, such as `sounding stress`
- focused test methods, such as `test.stress(...)`
- trial context helpers, such as `{ stress }`

The plugin returns those surfaces from its factory:

```js
module.exports = function stressPlugin(api) {
  return {
    name: 'stress',

    commands: {
      stress(argv, context) {
        return runStressCommand(argv, {
          ...context,
          api
        })
      }
    },

    testMethods: {
      stress: {
        mode: 'stress',
        options: {
          transport: 'http'
        }
      }
    },

    trial({ sails, config, world, appPath, events }) {
      return {
        stress: createStressClient({
          api,
          sails,
          getConfig: () => config,
          world,
          appPath,
          events
        })
      }
    }
  }
}
```

That shape is intentionally close to Sails' hook idea: install a package, let it
extend the runtime, and keep the app-facing API calm.

## Commands

Commands are registered under `commands`.

```js
commands: {
  example(argv, context) {
    context.stdout.write('Hello from Sounding\n')

    return {
      status: 0
    }
  }
}
```

If a plugin registers `example`, users can run:

```bash
npx sounding example
```

Command handlers receive:

- `argv`, the command arguments after the command name
- `context.appPath`, the Sails app path
- `context.stdout`
- `context.stderr`
- `context.api`, the Sounding plugin API

Commands should return an object with a numeric `status` when they want to
control the process exit code.

## Test methods

Plugins can add focused test methods when a feature deserves its own lane.

The stress plugin adds `test.stress(...)`:

```js
test.stress(
  'billing summary stays fast',
  { world: 'subscribed-creator' },
  async ({ stress, expect }) => {
    const result = await stress
      .get('/api/billing/summary')
      .as('owner')
      .concurrently(20)
      .for(10)
      .seconds()

    expect(result.requests.failed().count()).toBe(0)
  }
)
```

`test.stress()` is still a Sounding trial. The plugin only sets helpful defaults
for that lane, such as `transport: 'http'`.

## Trial helpers

Plugins can add keys to the trial context through `trial()`.

```js
trial({ sails, config, world, events }) {
  return {
    example: createExampleClient({
      sails,
      config,
      world,
      events
    })
  }
}
```

The returned object is merged into the trial context:

```js
test('uses a plugin helper', async ({ example }) => {
  await example.run()
})
```

Keep trial helpers small and product-facing. If a helper needs a heavy engine,
put that engine dependency in the plugin package instead of Sounding core.

## Plugin API

The plugin factory receives a small Sails-aware API:

```js
module.exports = function myPlugin(api) {
  // ...
}
```

Available helpers include:

| API                                            | Purpose                                                        |
| ---------------------------------------------- | -------------------------------------------------------------- |
| `api.appPath`                                  | The resolved app path Sounding is running against.             |
| `api.events`                                   | Shared plugin event bus.                                       |
| `api.createAppManager()`                       | Load or lift the Sails app for command-style plugins.          |
| `api.createSessionCookie(sails, session)`      | Create a real Sails session cookie for HTTP runs.              |
| `api.createSoundingError(details)`             | Create a structured Sounding error.                            |
| `api.resolveAuthConfig(input)`                 | Resolve the app's auth convention.                             |
| `api.resolveWorldActor(input)`                 | Resolve an actor alias from the active world.                  |
| `api.resolveActorHeaders(actor)`               | Read actor-provided request headers.                           |
| `api.resolveActorSession(actor, auth)`         | Build session data from an actor and auth convention.          |
| `api.resolveBaseUrl(input)`                    | Resolve a base URL from app config.                            |
| `api.resolveUrl(input)`                        | Resolve a request target to an absolute URL.                   |
| `api.createRequestActorUnresolvedError(input)` | Build the same actor resolution error used by request clients. |
| `api.loadDependencyFromApp(input)`             | Load a dependency from the app with a friendly install error.  |

That API lets plugins feel native without duplicating Sounding internals.

## Events

Sounding exposes an `EventEmitter` as a lifecycle and observability channel.

Core emits:

- `plugin:loaded`
- `trial:plugin:before`
- `trial:plugin:after`

Plugins can emit their own events:

```js
events.emit('stress:start', options)
events.emit('stress:done', result)
```

Events are good for:

- progress output
- custom reporters
- logging
- optional plugin-to-plugin integrations
- future streaming dashboards

Events should not be the main registration mechanism for public APIs. Commands,
test methods, and trial helpers should stay explicit so users can understand what
a plugin adds by reading its returned object.

## Missing plugins

When a known plugin command is missing, Sounding should explain the setup instead
of forcing that feature into core.

For example, running `sounding stress` without the stress plugin points users to:

```bash
npm install -D sounding-plugin-stress
```

That is the whole point of the plugin split: the API can feel first-party, while
the dependency stays optional.

## First plugin

The first official plugin is [Stress testing](/sounding/stress-testing).
