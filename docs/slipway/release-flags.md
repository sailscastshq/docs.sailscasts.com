---
head:
  - - meta
    - property: 'og:image'
      content: https://docs.sailscasts.com/slipway-social.png
title: Release Flags
titleTemplate: Slipway
description: Release Sails features safely with app-scoped switches, percentage rollouts, typed allowlists, and Lookout comparisons.
prev:
  text: Deployment Logs
  link: /slipway/deployment-logs
next:
  text: Rollbacks
  link: /slipway/rollbacks
editLink: true
---

# Release Flags

Release flags let you ship code before you release its behavior. A flag belongs
to one app in one environment, so a production rollout cannot accidentally
change staging or another app in the same project.

Slipway keeps the contract deliberately small:

- a master switch that acts as an immediate kill switch;
- a stable percentage rollout from 0–100%;
- an optional typed allowlist for users, accounts, tenants, or teams;
- request telemetry in Lookout, split by flag on and off.

There are no variants or nested rule builders. A flag always evaluates to a
boolean.

## Create a flag

Open an app, expand **Release flags**, enter a lowercase key such as
`new-checkout`, and select **Add**. New flags start off with a 0% rollout, so
creating one cannot expose unfinished behavior.

Use the switch to release or kill the flag. Use the ellipsis menu to set its
description, percentage, and allowlist.

Allowlist entries are typed, one per line:

```text
user:42
account:acme
tenant:north
team:staff
```

The master switch must be on before either the percentage or allowlist can
return `true`.

## Evaluate a flag in Sails

Install the Slipway hook in the deployed application:

```bash
npm install sails-hook-slipway
```

Then evaluate the flag from an action, helper, policy, or hook:

```javascript
const useNewCheckout = await sails.helpers.flags.enabled.with({
  key: 'new-checkout',
  req: this.req,
  defaultValue: false
})

if (useNewCheckout) {
  // Run the new behavior.
}
```

`flags.enabled` is a regular Sails helper machine. The hook waits for the
built-in helpers hook and furnishes the helper through the same Sails API used
by hooks such as `sails-hook-mail`. Sails therefore validates the declared
`key`, `req`, `context`, and `defaultValue` inputs before flag evaluation runs.
If the application already defines `sails.helpers.flags.enabled`, Slipway keeps
the application-owned helper and logs a warning instead of replacing it.

Always choose the default explicitly. Slipway returns that value when the flag
is unknown or the control plane has never been reachable. Flag evaluation does
not make the application request fail.

For work without an HTTP request, supply the stable context yourself:

```javascript
const enabled = await sails.helpers.flags.enabled.with({
  key: 'new-checkout',
  context: {
    account: invoice.account,
    user: invoice.owner
  },
  defaultValue: false
})
```

For an Inertia page, evaluate on the server and share only the boolean result:

```javascript
return {
  page: 'checkout/show',
  props: {
    useNewCheckout: await sails.helpers.flags.enabled.with({
      key: 'new-checkout',
      req: this.req,
      defaultValue: false
    })
  }
}
```

```vue
<NewCheckout v-if="useNewCheckout" />
<CurrentCheckout v-else />
```

The browser receives no flag credential or rule list.

With `req`, the hook looks for user, account, tenant, team, and session
identifiers in the request identity and session. An explicit `context` takes
precedence.

## Evaluation order

Slipway evaluates a flag in this order:

1. An off master switch returns `false`.
2. A matching typed allowlist entry returns `true`.
3. A 100% rollout returns `true`; a 0% rollout returns `false`.
4. A partial rollout hashes the first stable user, account, tenant, team, or
   session identifier.
5. A partial rollout without stable context returns `false`.

The hash is deterministic. The same identity stays in the same cohort as the
percentage moves, rather than randomly changing on every request.

## Changes without redeploying

The hook caches the last valid flag configuration and refreshes it in the
background every 15 seconds by default. A switch, percentage, or allowlist
change therefore reaches a running app without a new deployment. If Slipway is
temporarily unavailable, the hook continues using its last valid snapshot.

You can tune the cache in `config/slipway.js`:

```javascript
module.exports.slipway = {
  flags: {
    enabled: true,
    refreshInterval: 15000,
    requestTimeout: 3000
  }
}
```

Slipway injects the private flag endpoint and environment credential during a
normal deployment and a rollback. Do not expose `SLIPWAY_FLAGS_TOKEN` to
browser code. Existing apps need one deployment after upgrading Slipway and
`sails-hook-slipway`; flag changes after that do not require redeploying.

## Measure the rollout in Lookout

When a request evaluates a flag, the hook attaches the boolean result to that
request span. In **Lookout → Requests**, Slipway compares the request count,
average latency, 5xx error rate, and trace-linked exceptions for the on and off
cohorts. Individual request details also show the evaluated flag values.

The comparison only appears when requests have evaluated a flag. Applications
that do not use release flags get the same Lookout interface as before.

## Safe rollout sequence

A practical production rollout is:

1. Deploy the new code with `defaultValue: false`.
2. Create the flag off and verify the old path.
3. Allowlist the team or a test account.
4. Move through a small percentage, then 25%, 50%, and 100% while watching
   Lookout.
5. Turn the switch off immediately if errors or latency regress.
6. After the new path is stable, remove the old path and then delete the flag.

Release flags reduce rollout risk; they do not replace database compatibility.
Keep schema changes backward-compatible while old and new code can both run.
