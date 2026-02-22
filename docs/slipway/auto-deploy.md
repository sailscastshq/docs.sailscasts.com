---
head:
  - - meta
    - property: 'og:image'
      content: https://docs.sailscasts.com/slipway-social.png
title: Auto-Deploy
titleTemplate: Slipway
description: Automatic deployments on every push to GitHub and preview environments for pull requests.
prev:
  text: Dock
  link: /slipway/dock
next:
  text: Team Management
  link: /slipway/team-management
editLink: true
---

# Auto-Deploy

Automatically deploy your app when you push to GitHub. No manual deploys, no waiting.

## How It Works

```
┌──────────┐     push     ┌──────────┐    webhook    ┌──────────┐
│  Local   │ ──────────▶ │  GitHub  │ ────────────▶ │ Slipway  │
│   Dev    │              │          │               │          │
└──────────┘              └──────────┘               └────┬─────┘
                                                          │
                                                          ▼
                                                    ┌──────────┐
                                                    │  Deploy  │
                                                    │  Started │
                                                    └──────────┘
```

1. You push code to GitHub
2. GitHub sends a webhook to Slipway
3. Slipway clones the code using the deploy key, builds the Docker image, and deploys
4. You get [notified](/slipway/notifications) of success or failure

## Setting Up Auto-Deploy

Auto-deploy is enabled automatically when you [connect a GitHub repository](/slipway/git-integration) to your app. There's nothing extra to configure — just connect your repo and push.

If you haven't connected a repository yet:

1. Go to **Settings > Git** and [connect your GitHub account](/slipway/git-integration#connecting-github)
2. Navigate to your app's settings page
3. Under **Git Integration**, select your repository and branch
4. Click **Connect**

That's it. Every push to your configured branch now triggers a deployment.

### Toggling Auto-Deploy

You can enable or disable auto-deploy from your app's settings page using the **Auto-deploy** toggle. When disabled, pushes to GitHub are received but no deployments are triggered.

## Branch Configuration

When you connect a repository, you choose a branch to deploy from. By default, Slipway deploys pushes to your repository's default branch (usually `main`).

### Branch Mappings

You can map different branches to different environments. For example, deploy `main` to production and `develop` to staging:

```json
{
  "main": "production",
  "develop": "staging"
}
```

When branch mappings are configured:

- Pushes to **mapped branches** trigger a deployment to the corresponding environment
- Pushes to **unmapped branches** are ignored

When no branch mappings are configured:

- Pushes to the **default branch** trigger a deployment
- Pushes to **other branches** are ignored

::: info
Branch matching is exact — `main` matches `main`, not `main-v2` or `release/main`. Each branch maps to exactly one environment.
:::

## Preview Environments

Slipway can automatically create preview environments for pull requests. When enabled, every PR gets its own isolated environment so you can test changes before merging.

### How It Works

| PR Event                         | What Happens                                                    |
| -------------------------------- | --------------------------------------------------------------- |
| **Opened**                       | Slipway creates a preview environment and deploys the PR branch |
| **Updated** (new commits pushed) | Slipway redeploys the preview environment with the latest code  |
| **Reopened**                     | Same as opened — creates/updates the preview environment        |
| **Closed** (merged or not)       | Slipway destroys the preview environment and its resources      |

### Toggling Preview Environments

Preview environments are enabled by default when you connect a repository. You can control this via the **Auto-deploy previews** setting on the repository.

### Branch Cleanup

When a branch is deleted on GitHub (e.g., after merging a PR), Slipway automatically cleans up any associated preview environments.

## Multi-App Auto-Deploy

In [multi-app environments](/slipway/multi-app), a webhook push triggers deployments for **all apps** in the environment. Each app gets its own deployment record, build, and container.

```
Push to main
  ├── Deploy: web app     (Dockerfile)
  └── Deploy: worker app  (Dockerfile.worker)
```

Each deployment runs independently — if the web app build succeeds but the worker fails, the web app still goes live.

If a repository is connected to a **specific app** (rather than the whole environment), only that app is deployed on push.

## Webhook Security

### Signature Verification

Slipway verifies every incoming webhook using HMAC-SHA256 signature verification. When you connect a repository, Slipway generates a random secret and registers it with the GitHub webhook. This ensures:

- The webhook is genuinely from GitHub
- The payload wasn't tampered with in transit

The webhook secret is encrypted at rest in Slipway's database and never exposed in the UI.

### Supported Events

Slipway's webhook listens for three GitHub events:

- **push** — triggers deployments
- **pull_request** — manages preview environments
- **delete** — cleans up preview environments when branches are deleted

## Viewing Auto-Deploy History

Every webhook-triggered deployment is visible in your Slipway dashboard. Auto-deploys are identified by their **Git** trigger label (as opposed to **Manual** or **CLI**), and include:

- The branch that was pushed to
- The commit hash and message
- Who pushed the code

You can view this on the project overview, the environment page, or the individual deployment detail page.

## Troubleshooting

### Webhook Not Received

1. **Check GitHub webhook status:**
   - Go to your GitHub repo → Settings → Webhooks
   - Click the Slipway webhook
   - Check "Recent Deliveries" for errors

2. **Check your server is accessible:**
   - Slipway must be reachable from the internet
   - Port 443 (HTTPS) must be open

3. **Reconnect the repository:**
   - If the webhook was deleted from GitHub, disconnect and reconnect the repository in Slipway to regenerate it

### Deployment Not Starting

1. **Check auto-deploy is enabled** — look for the auto-deploy toggle in your app's settings

2. **Check the branch** — if you have branch mappings configured, only mapped branches trigger deploys. Pushes to unmapped branches are silently ignored.

3. **Check the deploy key** — if the deploy key was removed from GitHub, the clone will fail. Disconnect and reconnect to regenerate it.

### Wrong Branch Deploying

Check your branch mappings. If no mappings are configured, Slipway deploys pushes to the repository's **default branch** only. If mappings are configured, Slipway deploys **only** to mapped branches.

### Deployment Failing

1. **Check deployment logs** in the Slipway dashboard — click on the failed deployment to see the build output

2. **Test your Dockerfile locally:**

   ```bash
   docker build -t test .
   docker run test
   ```

3. **Check health checks** — if the build succeeds but the container fails to start, your app might not be responding on the expected port

## Best Practices

### 1. Protect Your Main Branch

Require pull requests before merging to `main`:

- Code review
- CI passing
- No direct pushes

### 2. Use Staging First

Map two branches to two environments:

- `develop` → staging (test first)
- `main` → production (after staging is verified)

### 3. Use Preview Environments

Enable auto-deploy previews so every PR gets its own environment. This lets reviewers test changes in isolation before merging.

### 4. Set Up Notifications

Never miss a failed deploy — configure [notifications](/slipway/notifications) to get alerted on deployment status changes.

## What's Next?

- Set up [Environment Variables](/slipway/environment-variables) for different environments
- Configure [Rollbacks](/slipway/rollbacks) for quick recovery
- Learn about [Team Management](/slipway/team-management) for access control
