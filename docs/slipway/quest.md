---
head:
  - - meta
    - property: 'og:image'
      content: https://docs.sailscasts.com/slipway-social.png
title: Quest
titleTemplate: Slipway
description: Operate sails-hook-quest jobs from Slipway, including live state, manual runs, pause and resume controls, and bounded run history.
prev:
  text: Content
  link: /slipway/content
next:
  text: Dock
  link: /slipway/dock
editLink: true
---

# Quest

Quest connects Slipway operations to jobs defined with [sails-hook-quest](/sails-quest/). Keep job code, inputs, and schedules in the application repository; use Slipway to inspect the selected deployed app.

## Define and deploy a job

Install the scheduler in the application:

```bash
npm install sails-hook-quest
```

For a bounded job, define a script and its schedule in source:

```javascript
// scripts/count-orders.js
module.exports = {
  friendlyName: 'Count orders',
  quest: { interval: '1 hour', withoutOverlapping: true },
  fn: async function () {
    const count = await Order.count()
    sails.log.info('Order count', count)
    return { count }
  }
}
```

Review the job locally and deploy the application. Choose **Quest** from that app's tools in the intended environment. Confirm which deployment is being inspected.

## Release compatibility

::: info Published app-hook requirements
For the full resident workspace documented here, use **sails-hook-quest 0.0.8** and **sails-hook-slipway 0.0.13**, Node 22+ and Sails ^1.5.0, with a compatible server such as 0.0.120. These hooks are published separately. Updating Slipway alone does not update a deployed app or enable its controls.
:::

Older hooks can retain bounded legacy history without authoritative resident controls. The earlier temporary-process interface cannot pause the scheduler in an already running application. Live state remains **Unavailable** when the dashboard cannot identify one compatible resident process. Worker apps use the same bridge and do not need an HTTP listener.

## Upgrade and enable

1. Review job source, schemas, schedules and effective inputs, then install the compatible package pair:

   ```sh
   npm install sails-hook-quest@0.0.8 sails-hook-slipway@0.0.13
   ```

2. Commit the lockfile. Merge these opt-ins into the app's existing configuration; retain its existing telemetry endpoint, token and deployment identity:

   ```javascript
   // config/quest.js
   module.exports.quest = { runtimeControls: true }

   // config/slipway.js
   module.exports.slipway = {
     quest: {
       enabled: true,
       delivery: { directory: '/app/data/quest-receipts-APP-DEPLOYMENT' }
     }
   }
   ```

3. Replace the directory placeholder with a private persistent directory unique to this app/deployment, owned by the app UID with mode `0700`. Use exactly one resident writer per directory; replicas need separate directories. Ephemeral container storage does not preserve receipts across removal.
4. Rebuild and deploy through the normal application workflow. Verify the workspace identifies exactly one compatible resident process for the intended app and deployment.
5. Exercise a bounded diagnostic job in staging and inspect its actual result before production use.

Controls remain opt-in and capability-gated. Cancellation requires Linux with observable `/proc` ownership evidence; opaque process ownership remains unconfirmed. A version string or dashboard switch alone cannot grant unavailable capabilities. See [Updates](/slipway/updates#release-compatibility).

## Operate the workspace

### Review a manual run

Run now reviews the current job schema, effective input values, and exact app/environment. Owner/admin authorization and a production acknowledgement are required. A manual input override affects that invocation only; it does not change the committed schedule or its inputs.

Secret inputs are not reusable rerun defaults. Keep source, inputs, results, and logs free of private customer data even when redaction is enabled.

### Read outcome evidence

Distinguish request admission, process completion, and the job's returned result. A successful process exit does not prove a named Sails exit or business operation succeeded. The workspace keeps structured returned values separate from stdout and stderr; JSON-looking log text is still a log.

An unavailable, unsupported, truncated, or unconfirmed result stays explicitly labelled. Do not infer a missing value from an empty output panel. Open Logs to view retained output. With the compatible pair and opt-ins, live logs provide bounded cumulative tails. Truncation and replay gaps explicitly mean earlier output is unavailable. Reconnecting reattaches the viewer; it never restarts or cancels execution.

### Pause and resume

Pause controls future admission in the verified resident process. It does not cancel active work and does not survive deployment or restart. To disable a job durably, change its source configuration and deploy that change.

### Cancel a running invocation

When the resident advertises cancellation, review the explicit cancellation request for that exact run. **Cancelling** means the request was admitted; **Cancelled** requires verified owned-process termination. A naturally completed job remains Completed. Changed ownership, unreadable process evidence or a confirmation timeout remain **Unconfirmed**, because work may still be running.

Cancellation cannot undo external side effects. There is no distributed overlap guarantee, missed-run replay or automatic retry of business work. Reconcile side effects before using **Run again**, which is a deliberate new invocation with fresh input review.

## Receipt delivery and retention

The configured private directory retains sanitized terminal evidence for bounded retry to Slipway. It holds at most 256 receipts / 4 MiB, with a 32 KiB event limit and seven-day retention. Missing acknowledgement retries evidence only; it never executes the job again. Credentials are not written into this spool.

Live replay is memory-backed: at most 32 runs and 16 snapshots / 128 KiB per run. Resident restart loses replay memory; terminal receipt delivery is separate. Full or expired storage, disk errors and removed deployment volumes can lose evidence. This is not a distributed queue or an exactly-once execution guarantee.

## History and diagnosis

Legacy history contains telemetry events, not a reconstructed run ledger. Application telemetry is retained for seven days by default. Scheduled history requires the application hook and configured Quest event capture; empty history does not prove no job ran.

When a job is missing or live state is unavailable, confirm the deployed revision, hooks, opt-in setting, running process, and exact app/environment. Check logs for startup or schema errors. A newly installed dependency must be included in a deployed image before it can change the running app.

Use [Lookout](/slipway/lookout) for telemetry health, [Helm](/slipway/helm) for application diagnosis, and [Operations and API](/slipway/operations) for shared recovery rules. Dedicated Quest CLI commands are not available.
