---
head:
  - - meta
    - property: 'og:image'
      content: https://docs.sailscasts.com/slipway-social.png
title: Deployment Logs
titleTemplate: Slipway
description: View and understand deployment logs for debugging and monitoring.
prev:
  text: Deploy Command
  link: /slipway/deploy-command
next:
  text: Rollbacks
  link: /slipway/rollbacks
editLink: true
---

# Deployment Logs

Start with the deployment that failed. Copy its ID from the app's deployment history or list recent deployments from the linked project:

```bash
slipway deployments --env staging --limit 5
slipway logs --deployment DEPLOYMENT_ID
```

## Build and deployment output

The deployment detail page and `logs --deployment` expose retained build and deployment output. Build output explains Dockerfile, dependency, and asset compilation failures; deployment output explains startup and health-check failures. A deployment ID identifies a particular attempt, not a project name or the word `current`.

Stored output is separate from the running app's container logs. Read it even when the candidate failed to start and no running container exists.

## Application logs

Open the app's logs in the selected environment to inspect runtime output. Include the app when several apps share one environment.

::: info CLI compatibility
In v0.0.86 source, application `logs` prints a `docker logs` instruction. Fetching and following application logs through the CLI requires the unreleased next CLI and server. The examples below are for that compatible build.
:::

```bash
slipway logs --project harbor --env staging --app worker --tail 200
slipway logs --project harbor --env staging --app worker --follow --ndjson
```

`--tail` accepts 0–10000 and defaults to 100. `--follow` streams until you stop it; Ctrl-C exits 130. Use `--json` for a bounded snapshot, or `--ndjson` for an event stream. See [CLI Workflow](/slipway/cli#machine-output-and-exit-codes) for output and error handling.

There are no CLI `--build`, `--deploy`, `--since`, `--until`, `--level`, `--grep`, or `--raw` filters. Process the returned output locally if you need filtering; review it for sensitive data before saving or sharing it.

## Diagnose a failure

1. Confirm project, environment, app, and deployment ID.
2. Read the earliest relevant build or startup error.
3. Check the [readiness report](/slipway/first-deploy#check-deployment-readiness), required variables, datastore access, listening address, and health path.
4. Reproduce the problem locally with the same committed source and Dockerfile.
5. Deploy the reviewed fix and verify both the public route and the app's behavior.

A disconnected stream does not prove the operation stopped. Inspect deployment history before retrying.

## Keep logs useful

Log bounded operational summaries, counts, and safe identifiers. Avoid passwords, tokens, connection strings, request bodies, or complete customer records. Slipway cannot guarantee that arbitrary application log text is redacted.

Use [Lookout](/slipway/lookout) for telemetry and resource diagnosis, [Helm](/slipway/helm) for bounded application inspection, and [Rollbacks](/slipway/rollbacks) when the running revision must be replaced.
