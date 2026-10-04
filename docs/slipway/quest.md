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

::: info Resident controls are unreleased
The next Quest workspace requires compatible **resident runtime contract v1** support in `sails-hook-quest`, the matching `sails-hook-slipway` bridge, and the next Slipway server. Published Quest **0.0.5** and Slipway hook **0.0.11** do not supply this combined contract. No minimum published versions have been assigned to the new controls. Installing those published packages does not enable them.
:::

The earlier Slipway implementation loads a temporary Sails process for introspection and manual execution. Its pause/resume result does not prove the scheduler in the already running application changed. Do not rely on that interface to stop production scheduling. Scheduled telemetry and detected scripts remain useful evidence, but are not authoritative resident state.

On the next workspace, incompatible apps retain bounded legacy history and diagnostics. Live state is **Unavailable**, and Run, Pause, and Resume remain disabled rather than pretending a temporary process owns the scheduler.

## Upgrade when compatible releases exist

1. Review the coordinated Slipway, scheduler, and application-hook release notes.
2. Upgrade both hooks in the application and review job source, schemas, schedules, and effective inputs.
3. Explicitly enable the bridge in app-owned configuration:

   ```javascript
   // config/slipway.js
   module.exports.slipway = { quest: { enabled: true } }
   ```

4. Deploy the normal application image; updating Slipway alone does not update app dependencies.
5. Verify the workspace identifies exactly one compatible resident process for the intended app and deployment before using controls.
6. Try a bounded diagnostic job in staging and verify its receipt and actual outcome before production use.

The setting defaults to false and requires compatible source. It is not a switch that makes released hooks compatible. Worker apps use the same resident bridge; they do not need an HTTP listener. See [Updates](/slipway/updates#release-compatibility).

## Operate the next workspace

The following behavior is available only in the compatible unreleased builds described above.

### Review a manual run

Run now reviews the current job schema, effective input values, and exact app/environment. Owner/admin authorization and a production acknowledgement are required. A manual input override affects that invocation only; it does not change the committed schedule or its inputs.

Secret inputs are not reusable rerun defaults. Keep source, inputs, results, and logs free of private customer data even when redaction is enabled.

### Read outcome evidence

Distinguish request admission, process completion, and the job's returned result. A successful process exit does not prove a named Sails exit or business operation succeeded. The workspace keeps structured returned values separate from stdout and stderr; JSON-looking log text is still a log.

An unavailable, unsupported, truncated, or unconfirmed result stays explicitly labelled. Do not infer a missing value from an empty output panel. Logs are loaded when opened; the next workspace does not provide live log replay.

### Pause and resume

Pause controls future admission in the verified resident process. It does not cancel active work and does not survive deployment or restart. To disable a job durably, change its source configuration and deploy that change.

There is no supported Stop/cancel control, distributed overlap guarantee, missed-run replay, or automatic retry of business work. A disconnect or missing receipt does not establish process termination. Verify external side effects before retrying.

## History and diagnosis

Legacy history contains telemetry events, not a reconstructed run ledger. Application telemetry is retained for seven days by default. Scheduled history requires the application hook and configured Quest event capture; empty history does not prove no job ran.

When a job is missing or live state is unavailable, confirm the deployed revision, hooks, opt-in setting, running process, and exact app/environment. Check logs for startup or schema errors. A newly installed dependency must be included in a deployed image before it can change the running app.

Use [Lookout](/slipway/lookout) for telemetry health, [Helm](/slipway/helm) for application diagnosis, and [Operations and API](/slipway/operations) for shared recovery rules. Dedicated Quest CLI commands are not available.
