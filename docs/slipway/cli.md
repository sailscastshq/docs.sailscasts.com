---
title: CLI Workflow
titleTemplate: Slipway
description: Inspect a target, diagnose a problem, make a reviewed change, and verify the result.
editLink: true
---

# CLI Workflow

Use the CLI to deploy source and inspect your Slipway projects. Start with a specific server, project, environment, and app so each command has an intentional target.

```bash
slipway whoami
slipway projects
slipway link harbor
slipway environments
slipway deployments --env staging --limit 5
```

[Install](/slipway/cli-installation) and [authenticate](/slipway/cli-authentication) first. `link` writes `.slipway.json` in the current directory; it does not deploy. Most commands use that linked project. Environment-aware mutation commands generally default to production: pass `--env staging` explicitly when practicing.

## Inspect before changing anything

Review the selected environment and services:

```bash
slipway services --env staging
slipway env --env staging
slipway push
slipway readiness --env staging --app worker --json
```

`push` uploads source without deploying it. In a Git repository it packages **committed HEAD**, not uncommitted edits or untracked files. Review and commit the intended application revision before uploading. A readiness report describes the uploaded source and effective configuration; it is not a dry run and cannot prove the next deployment will be healthy.

Variable masking is a convenience, not a guarantee that arbitrary values are safe to share. `db:url` reveals a credential-bearing URL. Keep both outputs private.

## Diagnose with logs

::: info Unreleased capability
Live application logs and remote `run` below require the next CLI **and** next Slipway server. The latest verified server release is v0.0.86. Earlier application `logs` and `run` implementations print Docker instructions instead of performing these operations. Stored deployment logs remain available through `logs --deployment ID`.
:::

With a compatible unreleased build:

```bash
slipway logs --project harbor --env staging --app worker --tail 200 --json
slipway logs --project harbor --env staging --app worker --follow --ndjson
```

`--project` is available for `logs` and `run`; it avoids a linked directory. Omitting `--app` selects the environment's default app. An explicit app does not fall back to a different one. Stop a log follower with Ctrl-C; its exit code is 130.

For a failed deployment, inspect its actual ID:

```bash
slipway logs --deployment DEPLOYMENT_ID
```

Read [Deployment Logs](/slipway/deployment-logs) for the distinction between stored build/deploy output and a running container's logs.

## Make a reviewed change

For source changes, run your application checks locally, commit the intended revision, then deploy it to the selected environment:

```bash
slipway slide --env staging --app worker --message "Fix worker startup"
```

For a diagnostic command on a compatible unreleased build:

```bash
printf '%s' 'node --version' | slipway run --project harbor --env staging --app worker --stdin --ndjson
```

This runs a command in the app container through [Helm's command API](/slipway/helm). It is not the JavaScript model console. Quote a complete command when its internal argument quoting matters, or use `--file ./command.txt`.

Every production command requires an existing, single-use write arm bound to the exact command and deployment. An unarmed request fails with `HELM_WRITES_NOT_ARMED`. The CLI has no arm-creation command; `--write-arm-file` only supplies an already approved arm from a private file. Do not remove the production guard to make automation pass.

Use [Dock](/slipway/dock) for database queries and migrations, and [Quest](/slipway/quest) for job operations. Dedicated Dock and Quest CLI commands are not available.

## Wait for an outcome

`slide` watches deployment progress through a stream, with polling fallback. Keep the printed deployment ID and verify its terminal state in deployment history. Do not interpret a timeout, disconnect, or a zero shell exit alone as proof that the app is running.

`run --ndjson` emits accepted, stdout, stderr, and result events. Acceptance means the request was admitted; the final result is the completion evidence. `run --json` waits and returns one object containing `executionId` and `result`.

A run transport waits at most ten minutes; a snapshot request waits at most 30 seconds. A stream that ends without its required result is unconfirmed. Interrupting a run does **not** prove remote termination. There is no CLI execution lookup, resume, or cancel command.

## Verify before retrying

```bash
slipway deployments --env staging --limit 5
curl --fail https://STAGING_APP_DOMAIN/health
```

Check the expected app behavior and, after a data change, its actual persisted outcome. A healthy HTTP endpoint is only one check; it does not establish that a background worker or business operation succeeded.

After a timeout or disconnect, inspect the app and server before repeating a change. The CLI does not automatically replay commands or provide an idempotency key. Blind retries can repeat side effects. [Rollbacks](/slipway/rollbacks) are selected and confirmed in the dashboard.

## Machine output and exit codes

| Mode            | Output                                                |
| --------------- | ----------------------------------------------------- |
| `logs --json`   | One snapshot object: `{ "logs": [...] }` for app logs |
| `logs --ndjson` | One JSON event per line; suitable for `--follow`      |
| `run --json`    | One `{ "executionId": "…", "result": { … } }` object  |
| `run --ndjson`  | Ordered accepted/output/result events                 |

JSON and NDJSON are mutually exclusive. `logs --json --follow` is rejected. Snapshot JSON is bounded to 16 MiB; use NDJSON for larger outputs. Machine-mode request and usage errors are JSON records on stderr:

```json
{
  "type": "error",
  "error": {
    "code": "HELM_WRITES_NOT_ARMED",
    "message": "Every production command requires a single-use write arm for this exact command and deployment.",
    "status": 409
  }
}
```

A confirmed successful run exits 0. A confirmed command failure propagates exit codes 1–255; missing receipts, unconfirmed outcomes, and request errors exit 1. Keep stderr separate when consuming stdout. Other CLI commands do not inherit this structured contract; only use machine flags listed in the [command reference](/slipway/cli-commands).

See [Operations and API](/slipway/operations) for shared target, authorization, and recovery rules.
