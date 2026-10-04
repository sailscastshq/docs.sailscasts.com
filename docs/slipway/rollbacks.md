---
head:
  - - meta
    - property: 'og:image'
      content: https://docs.sailscasts.com/slipway-social.png
title: Rollbacks
titleTemplate: Slipway
description: Quickly rollback to a previous deployment when things go wrong.
prev:
  text: Deployment Logs
  link: /slipway/deployment-logs
next:
  text: Environment Variables
  link: /slipway/environment-variables
editLink: true
---

# Rollbacks

Use rollback when a previously working application image is safer than the current release. A rollback changes application code; it does not undo database migrations, restore records, or reverse external side effects.

## Select a known deployment

```bash
slipway deployments --env production --limit 10
```

In the dashboard, open the project, environment, and intended app. In its deployment history, choose the retained deployment and **Rollback to this version**, then review and confirm the target.

There is no `slipway rollback` command. The deployment must still have a usable retained image. Check that its code remains compatible with the current database and environment variables before starting.

## What happens

Rollback enters the same coordinated deployment pipeline as a new release. Slipway starts a candidate from the selected image, checks health, and verifies the proxy change before finalizing traffic cutover. The running release remains the fallback while those checks are in progress.

This is an app-specific operation. Rolling back one app does not roll back other apps, databases, uploads, or services in the environment. Read [How Deployments Work](/slipway/how-deployments-work) for queueing, cancellation, and recovery behavior.

## Wait and verify

Keep the new rollback deployment ID. Inspect its terminal state and [deployment logs](/slipway/deployment-logs), then verify the public health route and the user flow that failed:

```bash
slipway deployments --env production --limit 5
slipway logs --deployment ROLLBACK_DEPLOYMENT_ID
curl --fail https://APP_DOMAIN/health
```

If the request disconnects, inspect history before starting another rollback. An interrupted client is not proof that the server stopped.

## Data changes

If the previous image expects an older schema, assess a forward fix or a planned restore. Take a current backup, pause writers where required, and use the [database recovery procedure](/slipway/database-services#backups). Restoring data can lose writes made after the backup; an app rollback alone cannot resolve that.
