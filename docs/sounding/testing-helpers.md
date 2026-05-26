---
title: Testing Helpers
editLink: true
---

# Testing helpers

Helper trials are the lightest way to exercise business logic in a real Sails app context.

Use `test()` when you want to test helper-driven business logic like:

- reusable helpers
- domain logic
- policy-like checks in isolation
- model-adjacent rules that do not need a full browser flow

## Example

```js
import { test } from 'sounding'

test('signupWithTeam creates a user and team', async ({ sails, expect }) => {
  const result = await sails.helpers.user.signupWithTeam({
    fullName: 'Kelvin O',
    email: 'kelvin@example.com',
    tosAcceptedByIp: '127.0.0.1'
  })

  expect(result.user.email).toBe('kelvin@example.com')
  expect(result.team.name).toBeDefined()
})
```

Many Sails apps keep important business logic in helpers, so this layer usually covers behavior more cheaply than a request or browser trial.

## What helper trials should expose

Helper trials should give you:

- `sails.helpers.user.signupWithTeam(inputs)` as the ergonomic happy path
- `sails.sounding.helpers('user.signupWithTeam', inputs)` as the dynamic fallback when the helper identity is not known ahead of time
- `expect` for clean assertions
- access to the current app runtime when needed
- world helpers for setup when the helper depends on existing records, usually kept in a nearby folder like `tests/world-helpers/`

If the helper needs world setup, read [Scenarios](/sounding/scenarios) and [Worlds](/sounding/worlds).

## Canonical first, dynamic second

The canonical helper surface in Sounding is still the normal Sails one:

- `sails.helpers.user.signupWithTeam(...)`

Sounding also keeps a dynamic fallback on `sails.sounding.helpers(name, inputs)` for cases where the helper identity is data-driven.

That fallback is useful for framework internals and a few advanced situations, but the happy path should still read like ordinary Sails.
