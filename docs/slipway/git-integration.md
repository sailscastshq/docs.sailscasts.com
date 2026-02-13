---
head:
  - - meta
    - property: 'og:image'
      content: https://docs.sailscasts.com/slipway-social.png
title: Git Integration
titleTemplate: Slipway
description: Connect your Git repositories to Slipway for deployment.
prev:
  text: Project Configuration
  link: /slipway/project-configuration
next:
  text: How Deployments Work
  link: /slipway/how-deployments-work
editLink: true
---

# Git Integration

Slipway integrates with Git for source code management and automatic deployments.

## How It Works

Slipway supports two deployment methods:

1. **CLI Deploy** - Push code directly from your machine
2. **Webhook Deploy** - Automatic deploys when you push to GitHub/GitLab/Bitbucket

Both methods use Git to track versions and enable rollbacks.

## CLI-Based Deployment

### How It Works

When you run `slipway slide`:

1. Slipway creates an archive using `git archive`
2. Only tracked files are included
3. Untracked files and `.gitignore` entries are excluded
4. The archive is uploaded to Slipway server

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

## GitHub Integration

### Setting Up Webhooks

1. **Enable auto-deploy in Slipway:**

   ```bash
   slipway project:update myapp --auto-deploy=true --auto-deploy-branch=main
   ```

2. **Get webhook URL:**

   ```bash
   slipway project:info myapp
   # Webhook URL: https://slipway.example.com/api/v1/webhook/github/abc123
   # Webhook Secret: whsec_xyz789
   ```

3. **Configure GitHub:**
   - Go to repository → Settings → Webhooks → Add webhook
   - Payload URL: Your webhook URL
   - Content type: `application/json`
   - Secret: Your webhook secret
   - Events: Just the push event
   - Click "Add webhook"

### Verifying the Webhook

GitHub sends a ping event. Check it was received:

```bash
slipway webhook:logs myapp
```

### Push to Deploy

Now when you push:

```bash
git push origin main
```

Slipway automatically:

1. Receives the webhook
2. Pulls the code
3. Builds and deploys

## GitLab Integration

### Setting Up Webhooks

1. **Enable auto-deploy:**

   ```bash
   slipway project:update myapp --auto-deploy=true
   ```

2. **Get webhook URL:**

   ```bash
   slipway project:info myapp
   ```

3. **Configure GitLab:**
   - Go to repository → Settings → Webhooks
   - URL: Your webhook URL
   - Secret token: Your webhook secret
   - Trigger: Push events
   - Click "Add webhook"

## Bitbucket Integration

### Setting Up Webhooks

1. **Enable auto-deploy:**

   ```bash
   slipway project:update myapp --auto-deploy=true
   ```

2. **Configure Bitbucket:**
   - Go to repository → Settings → Webhooks → Add webhook
   - Title: Slipway Deploy
   - URL: Your webhook URL
   - Triggers: Repository push
   - Click "Save"

::: warning Bitbucket Limitation
Bitbucket webhooks don't support secrets. Slipway validates based on IP address.
:::

## Branch Configuration

### Single Branch Deployment

Deploy only from a specific branch:

```bash
slipway project:update myapp --auto-deploy-branch=main
```

Pushes to other branches are ignored.

### Multiple Branches

Configure different branches for different environments:

```bash
# main → production
slipway project:update myapp --auto-deploy-branch=main --env=production

# develop → staging
slipway env:create myapp staging
slipway project:update myapp --auto-deploy-branch=develop --env=staging
```

### Pattern Matching

Deploy from branches matching a pattern:

```bash
# Deploy from any release/* branch
slipway project:update myapp --auto-deploy-branch="release/*"
```

## Commit Information

Slipway tracks Git commit information:

```bash
slipway deployments myapp
```

Output:

```
ID        STATUS    COMMIT     BRANCH    MESSAGE              DEPLOYED
abc123    running   a1b2c3d    main      Fix payment bug      5 min ago
def456    stopped   e4f5g6h    main      Add feature          2 hours ago
```

### Viewing Commit Details

```bash
slipway deployment:info myapp abc123
```

Output:

```
Deployment: abc123
Status: running
Started: 2024-01-20 14:30:00
Finished: 2024-01-20 14:31:42
Duration: 1m 42s

Git:
  Commit: a1b2c3d4e5f6g7h8i9j0
  Branch: main
  Message: Fix payment bug
  Author: developer@example.com
  Committed: 2024-01-20 14:25:00
```

## Skipping Deployments

### Skip via Commit Message

Add `[skip deploy]` or `[no deploy]` to your commit message:

```bash
git commit -m "Update README [skip deploy]"
git push origin main
# No deployment triggered
```

### Skip via Files Changed

Configure Slipway to skip deployments when only certain files change:

```bash
slipway project:update myapp --skip-paths="*.md,docs/*,.github/*"
```

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

# Slipway credentials (if using hook)
.slipway-credentials

# Logs
*.log

# OS files
.DS_Store
Thumbs.db
```

### Tracked Files

These should be tracked:

```
package.json
package-lock.json
Dockerfile
app.js
api/
config/
views/
assets/ (source files)
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

### "Dirty Working Directory"

Warning when you have uncommitted changes:

```bash
slipway slide
# Warning: You have uncommitted changes. Deploy anyway? [y/N]
```

**Recommendation:** Commit your changes first:

```bash
git add .
git commit -m "Your changes"
slipway slide
```

### "Webhook Not Triggering"

1. **Check webhook is configured:**
   - Verify URL in GitHub/GitLab/Bitbucket settings

2. **Check webhook logs:**

   ```bash
   slipway webhook:logs myapp
   ```

3. **Verify branch matches:**

   ```bash
   slipway project:info myapp
   # Check auto-deploy-branch setting
   ```

4. **Check GitHub webhook deliveries:**
   - Go to repo → Settings → Webhooks → Recent Deliveries

### "Signature Verification Failed"

```bash
slipway webhook:logs myapp
# Error: Signature verification failed
```

**Solution:** Ensure the webhook secret matches:

1. Get the secret from Slipway:

   ```bash
   slipway project:info myapp
   ```

2. Update in GitHub/GitLab settings

## Best Practices

### 1. Use a CI/CD Branch Strategy

```
feature/* → develop (staging) → main (production)
```

### 2. Protect Your Main Branch

In GitHub:

- Require pull request reviews
- Require status checks to pass
- Prevent force pushes

### 3. Use Meaningful Commit Messages

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

- Learn [How Deployments Work](/slipway/how-deployments-work)
- Set up [Auto-Deploy](/slipway/auto-deploy) for full CI/CD
- Configure [Rollbacks](/slipway/rollbacks) for quick recovery
