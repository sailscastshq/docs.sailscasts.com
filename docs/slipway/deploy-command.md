---
head:
  - - meta
    - property: 'og:image'
      content: https://docs.sailscasts.com/slipway-social.png
title: Deploy Command
titleTemplate: Slipway
description: Learn how to use the slipway slide command to deploy your applications.
prev:
  text: How Deployments Work
  link: /slipway/how-deployments-work
next:
  text: Deployment Logs
  link: /slipway/deployment-logs
editLink: true
---

# Deploy Command

Deploy from the directory linked to your Slipway project:

```bash
slipway whoami
slipway environments
slipway slide --env staging --app web --message "Fix login validation"
```

`slide` packages source, uploads it, starts a deployment, and watches progress. `deploy` and `launch` are aliases.

## Target and options

| Option            | Meaning                                             |
| ----------------- | --------------------------------------------------- |
| `--env`, `-e`     | Environment slug; defaults to `production`          |
| `--app`, `-a`     | App slug; defaults to the environment's default app |
| `--message`, `-m` | A note stored with the deployment                   |

The project comes from `.slipway.json`; use `slipway link PROJECT_SLUG` when deploying an existing project from another directory. The server comes from [saved credentials](/slipway/cli-authentication), not a global `--server` option.

The command does not support `--dry-run`, `--no-cache`, `--verbose`, `--quiet`, or `--canary`. Use the [readiness report](/slipway/first-deploy#check-deployment-readiness) to inspect uploaded source before deployment.

## What source is deployed?

In a Git repository, `slide` and `push` package `git archive HEAD`. Commit the intended files first: uncommitted changes and untracked files are not uploaded. Outside a Git repository, packaging uses `tar` and excludes `node_modules`, `.git`, `.env`, `.DS_Store`, and log files. Inspect your source for credentials before uploading; exclusions do not make arbitrary source safe.

## Inspect, deploy, verify

```bash
npm test
slipway push
slipway readiness --env staging --app web --json
slipway slide --env staging --app web --message "Reviewed startup fix"
slipway deployments --env staging --limit 5
curl --fail https://STAGING_APP_DOMAIN/health
```

The readiness report must correspond to the intended source and configuration. After a change, refresh it. `slide` uploads its source again and records that revision for the deployment.

The CLI prints a deployment ID and watches the attempt through a stream, falling back to polling. Check the final deployment state and the app's expected behavior. A zero process exit alone does not establish success: timeout or cancelled states may be reported without the app becoming healthy.

## Recovery

For build or startup failure:

```bash
slipway logs --deployment DEPLOYMENT_ID
```

If the transport times out or disconnects, inspect that deployment before retrying. Upload requests have a two-minute deadline; normal API requests have a 30-second deadline. A client timeout does not cancel server work.

There is no CLI rollback or deployment-cancel command. Use the selected app's deployment history for [rollback](/slipway/rollbacks), and the dashboard's deployment controls for supported cancellation. See [How Deployments Work](/slipway/how-deployments-work).

For automatic deployment, use [Git Integration](/slipway/git-integration). Review [Deploy Tokens](/slipway/deploy-tokens) before choosing pipeline credentials; `SLIPWAY_TOKEN` is not implemented as CLI authentication.
