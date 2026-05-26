---
title: Getting Started
editLink: true
---

# Getting started

Install Sounding, keep your Sails test environment in `config/env/test.js`, and add `config/sounding.js` only when you need overrides.

## 1. Install Sounding

```bash
npm install -D sounding @playwright/test sails-sqlite
```

### Install the Sounding skill for AI agents

If you use Codex, Claude Code, Cursor, or another coding agent, install the Sounding skill too.
That gives the agent guidance for worlds, actors, transports, mailbox assertions,
browser trials, and Sounding's auth helpers.

```bash
npx skills add sailscastshq/sounding/skills
```

## 2. Set up your test environment

Sounding does not replace Sails test config.

Your app still defines its test environment in `config/env/test.js`, and Sounding builds on top of that.

One common setup is to let Sounding manage the datastore and keep `config/env/test.js` focused on app behavior.

```js
// config/env/test.js
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

If your app already has a good test datastore strategy, Sounding can still respect it through `datastore.mode = 'inherit'`.

## 3. Add `config/sounding.js` only if you need overrides

```js
module.exports.sounding = {
  environments: ['test'],
  datastore: 'inherit'
}
```

Most apps can skip this file entirely. Sounding already defaults to:

- `environments = ['test']`
- `datastore.mode = 'managed'`
- `datastore.identity = 'default'`
- `datastore.adapter = 'sails-sqlite'`
- `datastore.root = '.tmp/db'`
- `datastore.isolation = 'worker'`
- `mail.capture = true`
- `request.transport = 'virtual'`
- browser projects start with `desktop`

Only add `config/sounding.js` when your app needs a real override, such as `datastore: 'inherit'`, `datastore: 'external'`, custom browser behavior, or widening Sounding beyond the default test-only environment.

If you intentionally need Sounding in another boot path, widen the allowlist explicitly:

```js
module.exports.sounding = {
  environments: ['test', 'console']
}
```

## 4. Write your first trial

If you are new to Sounding's callback shape, read [Trials](/sounding/trials) and [Trial context](/sounding/trial-context) alongside this guide. They explain what a trial is, what arrives inside `test()`, and when things like `page` and `login` appear.

```js
import { test } from 'sounding'

test('signupWithTeam creates a team and membership', async ({
  sails,
  expect
}) => {
  const result = await sails.helpers.user.signupWithTeam({
    fullName: 'Kelvin O',
    email: 'kelvin@example.com',
    tosAcceptedByIp: '127.0.0.1'
  })

  expect(result.user.email).toBe('kelvin@example.com')
  expect(result.team.name).toBeDefined()
})
```

## 5. Use the same trial surface for endpoints

```js
import { test } from 'sounding'

test('guest is redirected from the dashboard', async ({ get, expect }) => {
  const response = await get('/dashboard')

  expect(response).toRedirectTo('/login')
})
```

## 6. Write your first browser trial

```js
import { test } from 'sounding'

test(
  'subscriber can read a members-only issue',
  { browser: true },
  async ({ sails, page, login, expect }) => {
    await sails.sounding.world.use('issue-access')
    await login.as('subscriber', page)

    await page.goto('/issues/the-nerve-to-build')

    await expect(page.getByText('The rest of the story')).toBeVisible()
  }
)
```

## 6.1 Define your first world

Define a named world for repeatable setup. Common starting points are:

- a signed-out guest
- a subscriber with active access
- a publisher with a draft
- a reader waiting on a magic link

For example:

```js
import { defineScenario } from 'sounding'

export default defineScenario('issue-access', async ({ create }) => {
  const publisher = await create('user').trait('publisher')
  const subscriber = await create('user').trait('subscriber')
  const issue = await create('issue', {
    author: publisher.id,
    isFree: false
  })

  return {
    users: { publisher, subscriber },
    issues: { gatedIssue: issue }
  }
})
```

Then the trial can read from the product situation directly:

```js
test('subscriber can read the issue', async ({ sails, expect }) => {
  const current = await sails.sounding.world.use('issue-access')

  const response = await sails.sounding.request
    .as(current.users.subscriber)
    .get(`/i/${current.issues.gatedIssue.slug}`)

  expect(response).toHaveStatus(200)
})
```

Use worlds when several trials need the same business state.

## 7. Run the suite

```bash
npm run test
```

## What to add next

Once the basic runtime is in place, most apps will want to add:

- factories under `tests/factories`
- scenarios under `tests/scenarios`
- a few named actors like `guest`, `subscriber`, and `publisher`
- at least one endpoint, Inertia, and browser trial for a mission-critical flow
- a mobile browser project once the core journeys are stable
