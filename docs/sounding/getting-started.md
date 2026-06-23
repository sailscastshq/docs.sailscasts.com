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
  { browser: true, world: 'issue-access' },
  async ({ page, login, expect }) => {
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
test(
  'subscriber can read the issue',
  { world: 'issue-access' },
  async ({ world, request, expect }) => {
    const response = await request
      .as('subscriber')
      .get(`/i/${world.current.issues.gatedIssue.slug}`)

    expect(response).toHaveStatus(200)
  }
)
```

Use worlds when several trials need the same business state.

## 7. Run the suite

```bash
npx sounding test
```

Most generated apps wire `npm test` to the same command.

By default, `sounding test` uses Sounding's readable reporter. Small passing
runs list the trial names and end with a compact summary:

```txt
PASS  tests/arch.test.js

  ✓ request helpers stay response-shaped  1ms
  ✓ JSON paths read like product facts    0ms

PASS  Tests: 2 passed, 2 total

      Duration: 94ms
```

When a trial fails, Sounding keeps the first application frame in view and
groups the context that usually explains the behavior:

```txt
FAIL  tests/billing.test.js

  × creator sees billing summary

  Expected response status 200, received 500.

  Request
    GET /api/billing/summary (http) -> http://localhost:1337/api/billing/summary
    headers: accept: application/json

  Response
    500 Server Error
    headers: content-type: application/json

  Body
    {"message":"boom"}

  at tests/billing.test.js:25

  -> 25    expect(response).toHaveStatus(200)

FAIL  Tests: 1 failed, 1 total

      Duration: 70ms
```

Use `--verbose` when you want full stacks and expanded diagnostics:

```bash
npx sounding test --verbose
```

Use `--raw-error` when formatted output hides something you need. Raw mode keeps
the readable failure first, then prints the original Node test error, its
`cause`, Sounding metadata, and the primary frame payload:

```bash
npx sounding test --raw-error
```

Use `--compact` for failure-focused output in CI. Passing trials stay quiet, but
the final summary and the full Sounding failure block remain readable:

```bash
npx sounding test --compact
```

Use `--profile` when a suite starts feeling slow. The reporter prints the
slowest trials before the final summary so you can see whether time is going
into browser flows, app boot, auth setup, or request trials:

```bash
npx sounding test --profile
npx sounding test --profile --slow=10
```

`--slow` controls how many trials appear in the profile list and implies
`--profile`.

For larger suites, split the same discovered test files across CI jobs with
`--shard=part/total`:

```bash
npx sounding test --shard=1/4
npx sounding test --shard=2/4 --parallel
```

Sharding composes with the normal Sounding filters:

```bash
npx sounding test --lane browser --shard=1/4
npx sounding test --file tests/sounding/examples.test.js --shard=2/4
```

A GitHub Actions matrix can pass the shard number directly:

```yaml
strategy:
  matrix:
    shard: [1, 2, 3, 4]

steps:
  - run: npx sounding test --shard=${{ matrix.shard }}/4 --profile --slow=10
```

## What to add next

Once the basic runtime is in place, most apps will want to add:

- factories under `tests/factories`
- scenarios under `tests/scenarios`
- a few named actors like `guest`, `subscriber`, and `publisher`
- at least one endpoint, Inertia, and browser trial for a mission-critical flow
- a mobile browser project once the core journeys are stable
