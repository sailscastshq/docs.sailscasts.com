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

Quest is Slipway's operational view of the jobs defined by
[sails-hook-quest](https://docs.sailscasts.com/sails-quest). The job definition
stays in the application repository; Slipway discovers it from the deployed
application and provides live status, manual execution, pause and resume
controls, and recent run history.

Use the `sails-hook-quest` documentation to design schedules and job code. Use
this page to understand how Slipway operates those jobs after deployment.

## How the pieces connect

```text
scripts/*.js + quest config
          │
          ▼
  deployed Sails app ── runtime state ──► Quest dashboard
          │                                  │
          └── job telemetry ────────────────► run history
```

Slipway does not copy the scheduler into its own process. It loads the target
application in its running container to read `sails.quest`, and it executes a
manual run with the application's normal `sails run <job>` command. Models,
helpers, environment variables, and datastore connections are therefore the
ones belonging to that deployment.

## Requirements

Install the hook in the target Sails application:

```bash
npm install sails-hook-quest
```

Then deploy the application. Feature detection happens from the deployed
source, so adding the dependency without deploying it does not enable Quest in
an existing environment.

For run history, also install `sails-hook-slipway`. Slipway injects its
telemetry URL and token during deployment, and the hook reports Quest lifecycle
events when `captureQuestEvents` is enabled. Manual runs triggered from the
dashboard are recorded by Slipway even when no scheduled event has arrived yet.

## Open Quest

Choose **Quest** from the application actions in the selected environment.
Production uses:

```text
/projects/:projectSlug/quest
```

Other environments include the environment slug:

```text
/projects/:projectSlug/environments/:environmentSlug/quest
```

The target application must be running. When it is stopped, still deploying,
or missing `sails-hook-quest`, the page explains which prerequisite is absent
instead of presenting stale controls.

## Define a job

Jobs live in the application's `scripts/` directory. A normal Sails script
becomes scheduled when it includes a `quest` definition:

```javascript
// scripts/cleanup-sessions.js
module.exports = {
  friendlyName: 'Clean up sessions',
  description: 'Remove sessions that have expired.',

  quest: {
    interval: '1 hour',
    withoutOverlapping: true
  },

  fn: async function () {
    const expiredBefore = Date.now() - 30 * 24 * 60 * 60 * 1000
    const removed = await Session.destroy({
      lastActiveAt: { '<': expiredBefore }
    }).fetch()

    sails.log.info(`Removed ${removed.length} expired sessions.`)
    return { removed: removed.length }
  }
}
```

Common schedule forms are:

```javascript
quest: {
  interval: '5 minutes'
}
quest: {
  cron: '0 2 * * *'
}
quest: {
  timeout: '10 minutes'
}
```

The configured Quest timezone controls cron interpretation. Schedule parsing,
overlap locks, retries, and startup behavior belong to `sails-hook-quest`; the
Slipway dashboard reports the resulting runtime state without redefining those
rules.

Scripts without a `quest` definition can still appear as manual jobs when they
were detected in the deployment. Their schedule is shown as `manual`.

## Read the dashboard

The page combines configuration, live runtime state, and recent telemetry.

| Information                        | Source                         | Meaning                                                      |
| ---------------------------------- | ------------------------------ | ------------------------------------------------------------ |
| Name and description               | `scripts/*.js`                 | The script identity and its human-facing metadata            |
| Schedule and no-overlap state      | `script.quest`                 | The configured cron, interval, timeout, and overlap behavior |
| Paused or running                  | `sails.quest` in the container | Current state of this running deployment                     |
| Next and last run                  | Quest runtime                  | Scheduler timestamps when the hook exposes them              |
| Success, failure, duration, output | telemetry                      | Recent completed runs retained by Slipway                    |

The summary cards show completed and failed runs from the last 24 hours. An
expanded job shows up to 20 of its most recent completed or failed runs from
the loaded history. Slipway queries at most 500 Quest telemetry records from the
last seven days for the environment.

### Live refresh

The **Live** indicator means the browser has an authenticated Server-Sent
Events connection to Slipway. Slipway sends an initial snapshot and refreshes
the target application's job state and history every 30 seconds. The stream is
scoped to the signed-in user's team, project, and environment.

If the stream disconnects, the page keeps the last snapshot visible and marks
it offline. Reconnect or use **Try again** after fixing a container or
introspection error.

When runtime introspection fails, Slipway can fall back to the scripts detected
during deployment. Those fallback rows are intentionally conservative: they
show the script as manual and do not pretend to know live paused or running
state.

## Run a job now

Choose **Run now** to execute the script immediately in the running app
container. Slipway:

1. resolves the current project, environment, application, and container;
2. runs `npx sails run <job-name>` inside that container;
3. waits for the process to exit, with a five-minute execution timeout;
4. strips terminal color codes from captured output;
5. returns stdout, stderr, exit code, and success state; and
6. records a manual Quest telemetry event for history.

The output panel belongs to that manual run. Closing it does not delete the
telemetry record. A manual run also does not change the configured schedule.

::: warning A manual run is real application work
The script has the same models, helpers, credentials, and side effects it has
when Quest runs it on schedule. There is no dry-run sandbox. Make destructive
jobs idempotent and use `withoutOverlapping` where concurrent work would be
unsafe.
:::

### Inputs and automation

The dashboard currently runs the job without an input form. An authenticated
client can call the run endpoint and pass `jobInputs`; each key becomes a Sails
script argument such as `--daysOld=7`:

```http
POST /api/v1/projects/:projectSlug/quest/jobs/:name/run
Content-Type: application/json

{
  "jobInputs": {
    "daysOld": 7,
    "dryRun": true
  }
}
```

For a non-production environment, use:

```text
/api/v1/projects/:projectSlug/environments/:environmentSlug/quest/jobs/:name/run
```

This endpoint uses the same Slipway session and team authorization as the
dashboard. It is not an unauthenticated webhook or a substitute for a queue.

## Pause and resume

**Pause** and **Resume** call `sails.quest.pause(name)` and
`sails.quest.resume(name)` against the selected running deployment. They change
the scheduler state exposed by that application; they do not edit the script or
commit configuration to Git.

Treat pausing as an operational control for maintenance or diagnosis. A
container replacement, restart, or redeployment can rebuild scheduler state
from the application's committed Quest configuration. If a job must stay
disabled across releases, change its application configuration and deploy that
change.

Pause and resume are dashboard form actions, not the `/api/v1/.../jobs` REST
endpoints previously described by these docs.

## History and retention

Quest history is application telemetry, not a second job database. A history
entry can contain:

- job name and lifecycle event;
- manual or scheduled trigger;
- duration and recorded time;
- bounded stdout and stderr from a manual run; and
- a bounded error message for failed work.

Application telemetry is retained for seven days by default and pruned by
Lookout maintenance. See [Lookout](/slipway/lookout) for the retention controls
and collector health. Container logs remain useful when a failure occurred
outside the captured run envelope.

## Production job design

### Prevent overlap intentionally

```javascript
quest: {
  interval: '5 minutes',
  withoutOverlapping: true
}
```

Use overlap protection when a second run could charge twice, send duplicate
mail, process the same queue item, or compete for the same external resource.

### Make work idempotent

Select a bounded set of pending records, claim or mark them atomically, and make
retries safe. A process can stop after performing an external side effect but
before updating the database.

### Bound each run

Use query limits, batches, and checkpoints. The dashboard's five-minute wait
for a manual invocation is not a replacement for application-level timeouts on
HTTP calls or database operations.

### Return and log useful summaries

Return counts or identifiers that help an operator understand the run, and log
progress without emitting secrets or whole customer records.

## Troubleshooting

### Quest is unavailable

1. Confirm `sails-hook-quest` is in the deployed application's dependencies.
2. Deploy the revision that added it.
3. Confirm you opened the correct app and environment.
4. Confirm the application is running.

### A job is missing or shown as manual

Confirm the script is a top-level `.js` file in `scripts/` and can be required
without throwing. Then inspect the app logs for errors while loading the script
or `sails.quest`. A manual fallback row means deployment detection found the
script but Slipway could not confirm its live schedule.

### Live state is stale

Check the **Live** indicator. If it is offline, reload after confirming that the
Slipway instance and target container are reachable. A connected stream still
refreshes full job state every 30 seconds, so a scheduler transition is not
instantaneous in the browser.

### A manual run fails

Expand its output first. Then inspect the target app's logs and run the same
script locally with `npx sails run <job-name>`. Verify required inputs and
environment variables, and remember that Slipway stops waiting after five
minutes.

### History is empty

Install `sails-hook-slipway`, redeploy so telemetry credentials are injected,
and confirm `captureQuestEvents` is enabled. Scheduled history appears after a
job emits its first lifecycle event; manual runs from Slipway are recorded
directly.

## What's next?

- Configure job behavior with
  [sails-hook-quest](https://docs.sailscasts.com/sails-quest).
- Use [Lookout](/slipway/lookout) to inspect telemetry health and retention.
- Use [Helm](/slipway/helm) for bounded application-aware diagnosis.
