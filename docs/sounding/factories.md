---
title: Factories
editLink: true
---

# Factories

Factories are the primitive data layer in Sounding.

If a **scenario** is a named business situation, a **factory** is the record shape that situation is built from.

Factories answer questions like:

- what does a default user look like?
- what should change when that user is a publisher?
- how do we make a default issue, subscription, or invoice?

Factories are not the place to describe the whole product situation.
They should stay narrow and reusable.

If you want the composition layer above factories, read [Scenarios](/sounding/scenarios).

## Where factories live

By default, Sounding looks for factories under:

```text
tests/factories/
```

That default comes from the Sounding world config.
If your app needs a different location, you can override `sounding.world.factories` in `config/sounding.js`.

Sounding loads factory files recursively and understands:

- `.js`
- `.cjs`
- `.mjs`

## The simplest factory

The most direct form is a single factory definition:

```js
import { defineFactory } from 'sounding'

export default defineFactory('user', ({ sequence }) => ({
  fullName: 'Test User',
  email: sequence('user-email', (n) => `user-${n}@example.com`),
  emailStatus: 'verified'
}))
```

The factory name matters.

If the name matches a Sails model identity like `user`, `issue`, or `subscription`, then `world.create('user')` will persist through that model.

If it does not match a model identity, Sounding can still build the value, but `create()` will just return the built object.

## What the definition receives

When a factory definition is a function, Sounding calls it with a small helper object:

- `sequence`
- `fake`
- `seed`
- `sails`

### `sequence()`

`sequence()` is the default uniqueness tool.

```js
email: sequence('user-email', (n) => `user-${n}@example.com`)
slug: sequence('issue-slug', (n) => `issue-${n}`)
```

If you omit the name, Sounding uses a default sequence.

```js
email: sequence((n) => `user-${n}@example.com`)
```

This is usually better than scattering `Date.now()` and `Math.random()` helpers across test files.

### `fake`

Sounding ships a deliberately small fake-data surface today:

- `fake.person.fullName()`
- `fake.internet.email()`
- `fake.lorem.words(count)`
- `fake.lorem.sentence(count)`

Example:

```js
defineFactory('user', ({ fake, sequence }) => ({
  fullName: fake.person.fullName(),
  email: sequence('user-email', (n) => `user-${n}@example.com`)
}))
```

The fake-data API is intentionally small. The main value comes from:

- sane defaults
- deterministic uniqueness
- meaningful traits

### `seed`

Sounding's world engine also exposes a current `seed` value to factory and scenario definitions.

You can set it manually:

```js
sails.sounding.world.seed('demo-a')
```

Then factory definitions can read that value through the `seed` helper.

### `sails`

The real Sails runtime is also available.

That means a factory definition can read app helpers or configuration when it truly needs to, although most factories should stay simple and data-shaped.

## Traits

Traits add named variants to a factory.

```js
import { defineFactory } from 'sounding'

export default defineFactory('user', ({ fake, sequence }) => ({
  fullName: fake.person.fullName(),
  email: sequence('user-email', (n) => `user-${n}@example.com`),
  emailStatus: 'verified',
  isPublisher: false
}))
  .trait('publisher', { isPublisher: true })
  .trait('unverified', { emailStatus: 'unverified' })
```

A trait patch can be:

- an object
- a function

### Object traits

Object traits merge into the built value:

```js
.trait('publisher', { isPublisher: true })
```

### Function traits

Function traits receive the current built value.

```js
.trait('published', (issue) => ({
  ...issue,
  status: 'published',
  publishedAt: String(Date.now())
}))
```

Function traits replace the current value with whatever they return.
So if you do not merge the base record, you can accidentally wipe out required fields.

Dangerous:

```js
.trait('published', () => ({
  status: 'published'
}))
```

Safer:

```js
.trait('published', (issue) => ({
  ...issue,
  status: 'published'
}))
```

## Building vs creating

Factories support two different jobs:

- `build` for a value that is not persisted
- `create` for a record that should be persisted when a matching model exists

## Inside a scenario

Inside a scenario, `build()` and `create()` return a thenable builder with a small fluent API:

- `.trait(name)`
- `.traits(names)`
- `.with(overrides)`
- `.value()`

That means this works:

```js
const publisher = await create('user').trait('publisher')
const freeIssue = await create('issue', {
  author: publisher.id
})
  .trait('published')
  .trait('free')
```

And this also works:

```js
const preview = await build('user')
  .trait('publisher')
  .with({ email: 'publisher@example.com' })
```

## On the top-level world engine

The top-level world engine has the same concepts, but not the same fluent shape.

Use:

```js
const preview = world.build(
  'user',
  {},
  {
    traits: ['publisher']
  }
)

const publisher = await world.create(
  'user',
  {},
  {
    traits: ['publisher']
  }
)
```

Not:

```js
await world.create('user').trait('publisher')
```

That chaining style is for the scenario-local `build()` and `create()` helpers, not the top-level `world.build()` and `world.create()` methods.

## Building or creating many records

The world engine also provides:

- `world.buildMany(name, count, overrides, options)`
- `world.createMany(name, count, overrides, options)`

Example:

```js
const previews = await world.buildMany('user', 3)
const subscribers = await world.createMany(
  'user',
  2,
  {},
  {
    traits: ['subscriber']
  }
)
```

## Real example

Here is a practical factory set:

```js
// tests/factories/user.js
const { defineFactory } = require('sounding')

module.exports = defineFactory('user', ({ fake, sequence }) => ({
  fullName: fake.person.fullName(),
  email: sequence('user-email', (n) => `user-${n}@example.com`),
  password: 'secret123',
  tosAcceptedByIp: '127.0.0.1',
  emailStatus: 'verified',
  isPublisher: false
}))
  .trait('publisher', { isPublisher: true })
  .trait('unverified', { emailStatus: 'unverified' })

// tests/factories/issue.js
module.exports = defineFactory('issue', ({ sequence }) => ({
  slug: sequence('issue-slug', (n) => `issue-${n}`),
  title: sequence('issue-title', (n) => `Issue ${n}`),
  category: 'deep-dive',
  excerpt: 'Preview text',
  content: '<p>Full issue content</p>',
  status: 'draft',
  readingTime: 3,
  isFree: false
}))
  .trait('published', (issue) => ({
    ...issue,
    status: 'published',
    publishedAt: String(Date.now())
  }))
  .trait('free', { isFree: true, freeUntil: null })
```

Then a scenario can stay focused on the situation:

```js
const { defineScenario } = require('sounding')

module.exports = defineScenario('issue-access', async ({ create }) => {
  const publisher = await create('user').trait('publisher')
  const subscriber = await create('user')
  const freeIssue = await create('issue', { author: publisher.id })
    .trait('published')
    .trait('free')
  const gatedIssue = await create('issue', { author: publisher.id }).trait(
    'published'
  )

  return {
    users: { publisher, subscriber },
    issues: { freeIssue, gatedIssue }
  }
})
```

## File export shapes Sounding understands

Sounding's world loader accepts a few factory export shapes.

### Single definition export

```js
module.exports = defineFactory('user', ({ sequence }) => ({
  email: sequence((n) => `user-${n}@example.com`)
}))
```

### Function export using the loader API

```js
module.exports = ({ factory }) =>
  factory('user', ({ sequence }) => ({
    email: sequence((n) => `user-${n}@example.com`)
  }))
```

### Multiple definitions in one file

```js
module.exports = {
  factories: [
    defineFactory('user', ({ sequence }) => ({
      email: sequence((n) => `user-${n}@example.com`)
    })),
    defineFactory('issue', ({ sequence }) => ({
      slug: sequence((n) => `issue-${n}`)
    }))
  ]
}
```

## Practical guidance

A good factory:

- models one record shape well
- uses `sequence()` for deterministic uniqueness
- uses traits for meaningful variants
- stays small enough to inspect

A bad factory:

- tries to describe the whole business situation
- hard-codes too many unrelated relationships
- duplicates scenario-level meaning
- becomes a dumping ground for random setup

The simplest rule is:

If setup is repeating across files, add a factory.
If the setup is describing a business situation, add or reuse a scenario.
