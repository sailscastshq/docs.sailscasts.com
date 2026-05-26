---
title: Scenarios
editLink: true
---

# Scenarios

If a **factory** describes one record shape, a **scenario** composes those records into a named business situation.

Scenario names usually describe the setup they provide:

- `issue-access`
- `publisher-editor`
- `billing-upgrade`
- `team-invite`

The output of a scenario is the **world** your trial will read from.

If you want the broader concept model around worlds and actors, read [Worlds](/sounding/worlds).

## Where scenarios live

By default, Sounding looks for scenarios under:

```text
tests/scenarios/
```

That default comes from `sounding.world.scenarios`.
If your app needs a different location, you can override it in `config/sounding.js`.

Sounding loads scenario files recursively and understands:

- `.js`
- `.cjs`
- `.mjs`

## The simplest scenario

```js
import { defineScenario } from 'sounding'

export default defineScenario('issue-access', async ({ create }) => {
  const publisher = await create('user').trait('publisher')
  const subscriber = await create('user').trait('subscriber')
  const gatedIssue = await create('issue', {
    author: publisher.id
  }).trait('published')

  return {
    users: { publisher, subscriber },
    issues: { gatedIssue }
  }
})
```

That return value is the resolved world.

A good scenario return shape should give the trial readable handles like:

- `current.users.publisher`
- `current.users.subscriber`
- `current.issues.gatedIssue`

Avoid vague keys like:

- `user1`
- `record2`
- `data`

## What the definition receives

When a scenario definition is a function, Sounding calls it with a small helper object:

- `build`
- `create`
- `defineFactory`
- `defineScenario`
- `sails`
- `sequence`
- `seed`
- `context`

### `build()`

`build(name, overrides)` resolves a factory value without persisting it.

### `create()`

`create(name, overrides)` resolves a factory and persists it when a matching Sails model identity exists.

If there is no matching model, Sounding returns the built object.

### `defineFactory()` and `defineScenario()`

These advanced helpers let a scenario file register additional world definitions when it truly needs to.

Most apps should prefer static top-level definitions and only reach for this when the file is intentionally composing related world definitions together.

### `sails`

The real Sails runtime.

This is useful when a scenario needs to call a real helper, inspect config, or intentionally create part of its state through application behavior instead of plain model creation.

### `sequence`

The same deterministic sequence helper factories use.

This is handy when a scenario needs one more unique value without falling back to `Date.now()` or `Math.random()`.

### `seed`

The current world seed.

If you set one through `sails.sounding.world.seed(value)`, Sounding exposes it here for deterministic scenario behavior.

### `context`

The optional input passed to `world.use(name, context)`.

That lets a trial parameterize the scenario without inventing a second scenario for a small but meaningful variation.

```js
const current = await world.use('team-invite', {
  inviterRole: 'owner'
})
```

Then the scenario can read:

```js
export default defineScenario('team-invite', async ({ context, create }) => {
  const inviter = await create('user').trait(context.inviterRole)

  return { users: { inviter } }
})
```

## Scenario-local builders

Inside a scenario, `build()` and `create()` return thenable builders with a small fluent API:

- `.trait(name)`
- `.traits(names)`
- `.with(overrides)`
- `.value()`

That means all of these work:

```js
const publisher = await create('user').trait('publisher')

const unlockedReader = await create('user')
  .traits(['subscriber', 'active'])
  .with({ email: 'reader@example.com' })

const preview = await build('issue')
  .trait('published')
  .with({ title: 'Preview only' })
```

This fluent builder exists on the scenario-local helpers.
It does **not** exist on top-level `world.create()` or `world.build()`.

## Loading a scenario in a trial

Trials usually load a scenario through the world engine:

```js
import { test } from 'sounding'

test('subscriber can read a members-only issue', async ({ world, expect }) => {
  const current = await world.use('issue-access')

  expect(current.users.subscriber).toBeDefined()
  expect(current.issues.gatedIssue).toBeDefined()
})
```

After `use()`, the resolved world is also available on:

```js
world.current
```

This is mainly useful when a helper needs to inspect the current resolved world after the initial load.

## Scenario helpers

Sometimes a scenario needs more than direct factory creation.

For example:

- a real signup helper that creates a user, team, and membership together
- a billing bootstrap helper that calls application code on purpose
- a small helper that keeps a scenario readable without becoming a reusable factory

In those cases:

- factories own primitive record shapes
- scenarios own business situations
- scenario-local helpers keep a scenario readable when the setup is more than one record

When a helper only exists to support scenario composition, keep it in a clearly named world-helper area near the scenarios.

One useful layout is:

```text
tests/
  world-helpers/
    create-user-with-team.js
  scenarios/
  publisher-editor.js
  issue-access.js
```

Keep these helpers outside `tests/scenarios/` itself.
Sounding recursively loads JavaScript files under the configured scenario directory, so plain helper modules should live nearby, not inside the auto-loaded tree.

## Supported export shapes

Sounding's world loader understands a few shapes today.

### A direct definition

```js
import { defineScenario } from 'sounding'

export default defineScenario('issue-access', async ({ create }) => {
  // ...
})
```

### A function export

If a file exports a function, Sounding calls it with a loader API containing:

- `sails`
- `world`
- `defineFactory`
- `defineScenario`
- `factory`
- `scenario`
- `registerFactory`
- `registerScenario`

That means this is also valid:

```js
module.exports = ({ scenario }) =>
  scenario('issue-access', async ({ create }) => {
    // ...
  })
```

### An array

```js
module.exports = [
  defineScenario('issue-access', async () => ({})),
  defineScenario('publisher-editor', async () => ({}))
]
```

### An object group

```js
module.exports = {
  scenarios: [
    defineScenario('issue-access', async () => ({})),
    defineScenario('publisher-editor', async () => ({}))
  ]
}
```

Object groups can also include `factories`.

## What makes a good scenario

A strong scenario:

- is named after a business situation
- returns readable handles
- uses traits and overrides before inventing one-off setup
- stays small enough to trust
- works across multiple related trials

A weak scenario:

- tries to model the whole app
- returns generic names
- duplicates factory work
- creates data the trial never uses
- exists only because one trial needed one more field value

## When to create a new scenario

Create a new scenario when the trial needs a new named business situation.

Prefer a trait, override, or small scenario helper when:

- the actors are the same
- the relationships are basically the same
- only one or two fields change
- the difference does not need a new scenario name

Factories answer "what is one of these records like?"

Scenarios answer "what situation is this trial living inside?"
