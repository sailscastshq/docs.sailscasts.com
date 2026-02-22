---
head:
  - - meta
    - property: 'og:image'
      content: https://docs.sailscasts.com/slipway-social.png
title: Git Integration
titleTemplate: Slipway
description: Connect your GitHub repository to Slipway for push-to-deploy.
prev:
  text: Project Configuration
  link: /slipway/project-configuration
next:
  text: How Deployments Work
  link: /slipway/how-deployments-work
editLink: true
---

# Git Integration

Slipway integrates with GitHub for source code management and automatic deployments. Connect your repository and Slipway handles the rest — deploy keys, webhooks, and push-to-deploy are all configured automatically.

## How It Works

Slipway supports two deployment methods:

1. **Push-to-deploy** — Connect a GitHub repository and Slipway deploys automatically on every push
2. **CLI deploy** — Push code directly from your machine with `slipway slide`

Both methods track Git commit information (branch, commit hash, message) and enable [rollbacks](/slipway/rollbacks).

## Connecting GitHub

### 1. Configure GitHub OAuth

Before connecting repositories, you need to set up a GitHub OAuth app so Slipway can access your repos.

1. Go to **Settings > Git** in your Slipway dashboard
2. Follow the link to [create a GitHub OAuth app](https://github.com/settings/developers)
3. Set the **Authorization callback URL** to the one shown in the Slipway dashboard
4. Enter the **Client ID** and **Client Secret** and save

### 2. Connect your GitHub account

On the same **Settings > Git** page, click **Connect GitHub**. This authorizes Slipway to list your repositories and create deploy keys and webhooks on your behalf.

### 3. Connect a repository to your app

1. Navigate to your app's settings page: **Project > Environment > App > Settings**
2. Under **Git Integration**, search for and select the repository you want to connect
3. Choose the branch to deploy from (defaults to the repository's default branch)
4. Click **Connect**

Slipway automatically:

- **Generates an SSH deploy key** and adds it to the GitHub repository (for cloning private repos)
- **Creates a webhook** on the repository so GitHub notifies Slipway on every push, pull request, and branch delete
- **Enables auto-deploy** by default — pushes to your configured branch trigger deployments immediately

::: tip Zero manual setup
You don't need to copy webhook URLs, create secrets, or add deploy keys manually. Slipway provisions everything via the GitHub API when you click Connect.
:::

### 4. Verify the connection

Push a commit to your configured branch:

```bash
git commit --allow-empty -m "Test auto-deploy"
git push origin main
```

You should see a new deployment appear in your Slipway dashboard within seconds.

## Disconnecting a Repository

In your app's settings page under **Git Integration**, click **Disconnect**. Slipway removes the deploy key and webhook from GitHub and deletes the repository connection.

You can reconnect the same or a different repository at any time.

## CLI-Based Deployment

You can also deploy without connecting a GitHub repository by using the Slipway CLI.

### How It Works

When you run `slipway slide`:

1. Slipway creates an archive using `git archive`
2. Only tracked files are included (untracked files and `.gitignore` entries are excluded)
3. The archive is uploaded to your Slipway server
4. Slipway builds and deploys

### Requirements

- Git repository initialized (`git init`)
- At least one commit
- Clean working directory (recommended)

### Example

```bash
cd my-sails-app
git add .
git commit -m "New feature"
slipway slide
```

See the [deploy command](/slipway/deploy-command) docs for more details.

## CI/CD Integration

If you prefer to deploy from a CI/CD pipeline instead of push-to-deploy, you can use the Slipway CLI with deploy tokens.

### Generate a deploy token

In **Settings > Git**, create a deploy token. You can scope it to a specific project for security.

### GitHub Actions

```yaml
# .github/workflows/deploy.yml
name: Deploy to Slipway

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Install Slipway CLI
        run: npm install -g slipway

      - name: Deploy
        env:
          SLIPWAY_TOKEN: ${{ secrets.SLIPWAY_TOKEN }}
          SLIPWAY_SERVER: ${{ secrets.SLIPWAY_SERVER }}
        run: slipway slide --message "Deploy from GitHub Actions"
```

### GitLab CI/CD

```yaml
# .gitlab-ci.yml
deploy:
  stage: deploy
  image: node:22
  only:
    - main
  script:
    - npm install -g slipway
    - slipway slide --message "Deploy from GitLab CI"
  variables:
    SLIPWAY_TOKEN: $SLIPWAY_TOKEN
    SLIPWAY_SERVER: $SLIPWAY_SERVER
```

### Bitbucket Pipelines

```yaml
# bitbucket-pipelines.yml
pipelines:
  branches:
    main:
      - step:
          name: Deploy to Slipway
          image: node:22
          script:
            - npm install -g slipway
            - slipway slide --message "Deploy from Bitbucket"
```

::: info
CI/CD deployment works with any Git provider — GitHub, GitLab, Bitbucket, or self-hosted. Push-to-deploy webhooks currently support GitHub only.
:::

## Commit Information

Slipway tracks Git metadata for every webhook-triggered deployment:

- **Commit hash** — the exact commit that was deployed
- **Branch** — the branch the push was made to
- **Commit message** — the head commit message (truncated to 200 characters)

This information is visible on the deployment detail page in your dashboard and is used to identify deployments in the activity feed.

## Git Requirements

### .gitignore

Ensure these are in your `.gitignore`:

```
# Dependencies
node_modules/

# Build output
.tmp/

# Environment files
.env
.env.local
.env.*.local

# Logs
*.log

# OS files
.DS_Store
Thumbs.db
```

### Tracked Files

These should be tracked in Git:

```
package.json
package-lock.json
Dockerfile
app.js
api/
config/
views/
assets/
```

## Troubleshooting

### "Not a Git Repository"

```bash
slipway slide
# Error: Not a git repository
```

**Solution:**

```bash
git init
git add .
git commit -m "Initial commit"
```

### "No Commits"

```bash
slipway slide
# Error: No commits found
```

**Solution:**

```bash
git add .
git commit -m "Initial commit"
```

### Webhook Not Triggering

1. **Check the repository is connected** — go to your app's settings and verify the repository shows as connected with auto-deploy enabled

2. **Check the branch** — Slipway only deploys pushes to branches that match your [branch configuration](/slipway/auto-deploy#branch-configuration). Pushes to other branches are ignored.

3. **Check GitHub webhook deliveries** — go to your GitHub repository → Settings → Webhooks → Recent Deliveries to see if GitHub is sending the webhook and what response it's getting

4. **Reconnect the repository** — if the webhook or deploy key was deleted from GitHub, disconnect and reconnect the repository in Slipway to regenerate them

### Signature Verification Failed

This means the webhook secret doesn't match. The most likely cause is that the webhook was manually modified on GitHub.

**Solution:** Disconnect and reconnect the repository in Slipway. This regenerates the webhook with a fresh secret.

## Best Practices

### 1. Use a Branch Strategy

```
feature/* → develop (staging) → main (production)
```

### 2. Protect Your Main Branch

In GitHub:

- Require pull request reviews
- Require status checks to pass
- Prevent force pushes

### 3. Use Meaningful Commit Messages

Commit messages appear in the Slipway dashboard, so make them descriptive:

```bash
# Good
git commit -m "Fix payment processing for international cards"

# Bad
git commit -m "fix"
```

### 4. Test Before Merging to Main

```yaml
# .github/workflows/test.yml
on:
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: npm ci
      - run: npm test
```

## What's Next?

- Set up [Auto-Deploy](/slipway/auto-deploy) with branch mappings and preview environments
- Learn [How Deployments Work](/slipway/how-deployments-work)
- Configure [Rollbacks](/slipway/rollbacks) for quick recovery
