---
title: Worlds and Actors
editLink: true
---

# Worlds and actors

If a **trial** is the behavior being proved, a **world** is the business situation that trial lives inside.

A world is the named, deterministic state returned by a scenario.

It contains the actors, records, and relationships a trial needs. For example:

- a guest trying to open a gated issue
- a subscriber with active access
- a publisher editing a draft
- a reader requesting a magic link

Use worlds to represent business situations instead of anonymous seed data.

## The four building blocks

There are four closely related concepts here:

### Factory

A **factory** describes how to build or create one kind of record.

Factories answer questions like:

- what does a default user look like?
- how do we make a default issue?
- what changes when the user is a publisher?

### Scenario

A **scenario** composes factories into a business situation.

Scenarios answer questions like:

- what does issue access look like?
- what does a publisher editor session need?
- what should exist before a billing upgrade flow?

### Actor

An **actor** is the role a trial operates through inside a world.

Examples:

- `guest`
- `subscriber`
- `publisher`
- `unlockedReader`
- `teamOwner`

Actors matter because many behaviors are role-sensitive.

### World

A **world** is the resolved state returned by a scenario.

It includes:

- the actors
- the records they need
- the relationships between those records
- the business situation the trial actually cares about

So the hierarchy looks like this:

- factories build records
- scenarios compose records
- actors give those records meaning
- the resulting world is what the trial uses

## Why worlds matter

Without worlds, tests usually drift toward one of two patterns:

- giant setup blocks that hide the point of the trial
- tiny fixtures that omit important relationships

Worlds help by keeping setup:

- realistic enough to trust
- named clearly enough to understand
- reusable across related trials

## Factories are the primitive layer

A factory describes one record shape.

If you want the full factory surface, read [Factories](/sounding/factories).

```js
import { defineFactory } from 'sounding'

export default defineFactory('user', ({ fake, sequence }) => ({
  fullName: fake.person.fullName(),
  email: sequence((n) => `user${n}@example.com`),
  emailStatus: 'verified'
}))
  .trait('publisher', { isPublisher: true })
  .trait('subscriber', { subscriptionStatus: 'active' })
```

The key part is the **traits**.

Traits add named variants such as:

- `publisher`
- `subscriber`
- `expired`
- `foundingSupporter`

## Scenarios compose a business situation

A scenario is where separate records become a named business situation.

If you want the full scenario surface, loading behavior, and file export shapes, read [Scenarios](/sounding/scenarios).

```js
import { defineScenario } from 'sounding'

export default defineScenario('issue-access', async ({ create }) => {
  const publisher = await create('user').trait('publisher')
  const subscriber = await create('user').trait('subscriber')
  const freeIssue = await create('issue', {
    author: publisher.id,
    isFree: true
  })
  const gatedIssue = await create('issue', {
    author: publisher.id,
    isFree: false
  })

  return {
    users: { publisher, subscriber },
    issues: { freeIssue, gatedIssue }
  }
})
```

The return value is the world. It should be something a test can read without opening the scenario first.

## What makes a good scenario name

Scenario names should sound like a product conversation, not a seed script.

Good names:

- `issue-access`
- `publisher-editor`
- `magic-link-signin`
- `billing-upgrade`
- `reader-dashboard`

Weak names:

- `users-and-issues`
- `seed-1`
- `default-data`
- `test-case-a`

The rule is simple:

If the name does not tell you what business situation exists, it is probably not a good scenario name.

## A world should expose readable handles

```js
import { test } from 'sounding'

test('subscriber can read a members-only issue', async ({ sails, expect }) => {
  const current = await sails.sounding.world.use('issue-access')

  const response = await sails.sounding.request
    .as(current.users.subscriber)
    .get(`/i/${current.issues.gatedIssue.slug}`)

  expect(response).toHaveStatus(200)
})
```

The world gives the trial meaningful handles such as:

- `current.users.subscriber`
- `current.issues.gatedIssue`

## Good worlds vs bad worlds

A good world:

- is named after a business situation
- returns readable handles
- avoids unnecessary data
- works across multiple trial types
- stays stable enough to be trusted

A bad world:

- tries to model the whole app at once
- leaks low-level implementation detail into every test
- returns vague keys like `user1` and `item2`
- creates too much data just because it can
- is only understandable if you read 100 lines of setup first

If a scenario starts looking like a production snapshot, it is too big.

## Use the same world across multiple trial types

One of the best things about Sounding worlds is that the same scenario can support different layers of testing.

### Request-level trial

```js
test('guest sees the paywall state', async ({ sails, visit, expect }) => {
  const current = await sails.sounding.world.use('issue-access')
  const page = await visit(`/i/${current.issues.gatedIssue.slug}`)

  expect(page).toHaveProp('hasSubscription', false)
})
```

### Browser-capable trial

```js
test(
  'subscriber can read the issue in full',
  { browser: true },
  async ({ sails, login, page, expect }) => {
    const current = await sails.sounding.world.use('issue-access')

    await login.as('subscriber', page)
    await page.goto(`/i/${current.issues.gatedIssue.slug}`)

    await expect(
      page.getByText(current.issues.gatedIssue.premiumDetail)
    ).toBeVisible()
  }
)
```

### Mail trial

```js
test('reader gets a magic link email', async ({ sails, auth, expect }) => {
  await sails.sounding.world.use('magic-link-signin')
  await auth.requestMagicLink('reader@example.com')

  const email = sails.sounding.mailbox.latest()
  expect(email.ctaUrl).toContain('/magic-link/')
})
```

The same world can support multiple trial types.

## When to create a new scenario

Create a new scenario when the **trial** needs a new named business situation.

A good scenario earns its existence by making many related trials easier to read.
Create one when:

- the business situation is meaningfully different
- the actors or permissions are different
- the data relationships change in a real way
- reusing another world would make the trial harder to understand

Do **not** create a new scenario just because one trial needs a tiny data variation.
In those cases, prefer:

- a trait
- a small override
- a small helper inside the scenario

If that helper only exists to support scenario composition, keep it near the scenarios in a named helper area such as `tests/world-helpers/`, not inside the auto-loaded `tests/scenarios/` tree.

## The relationship between trials, worlds, and actors

A useful way to hold these ideas together is:

- the **trial** states the behavior being proved
- the **world** provides the business situation
- the **actor** provides the role operating inside that situation
- the **trial context** provides the runtime and tools

This is the relationship between the main Sounding concepts.

## A simple naming pattern that works well

A practical pattern for most codebases is:

- `noun-capability`
- `role-situation`
- `feature-state`

Examples:

- `issue-access`
- `publisher-editor`
- `reader-dashboard`
- `billing-upgrade`
- `team-invite`

This keeps naming consistent across the suite.

## Summary

Use worlds to represent reusable business situations, not just shorter setup.
