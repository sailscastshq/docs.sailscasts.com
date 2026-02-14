---
head:
  - - meta
    - property: 'og:image'
      content: https://docs.sailscasts.com/slipway-social.png
title: Auto-Deploy
titleTemplate: Slipway
description: Set up automatic deployments with GitHub webhooks for continuous deployment.
prev:
  text: Dock
  link: /slipway/dock
next:
  text: Team Management
  link: /slipway/team-management
editLink: true
---

# Auto-Deploy

Automatically deploy your Sails app when you push to GitHub. No manual deploys, no waiting.

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
3. Slipway pulls the code and deploys
4. You get notified of success or failure

## Setting Up Auto-Deploy

### 1. Enable Auto-Deploy in Slipway

#### Via CLI

```bash
slipway project:update myapp --auto-deploy=true --auto-deploy-branch=main
```

#### Via Dashboard

1. Go to your project
2. Click **Settings**
3. Enable **Auto-Deploy**
4. Set the **Deploy Branch** (e.g., `main`)
5. Click **Save**

### 2. Get the Webhook URL

```bash
slipway project:info myapp
```

Output includes:

```
Webhook URL: https://slipway.example.com/api/v1/webhook/github/abc123
Webhook Secret: whsec_xyz789
```

Or find it in the Dashboard under **Settings → Webhooks**.

### 3. Configure GitHub Webhook

1. Go to your GitHub repository
2. Click **Settings → Webhooks → Add webhook**
3. Configure:

| Field        | Value                                                      |
| ------------ | ---------------------------------------------------------- |
| Payload URL  | `https://slipway.example.com/api/v1/webhook/github/abc123` |
| Content type | `application/json`                                         |
| Secret       | Your webhook secret from Slipway                           |
| Events       | Just the push event                                        |

4. Click **Add webhook**

### 4. Test the Webhook

GitHub will send a ping. Check it was received:

```bash
slipway webhook:logs myapp
```

Or push a commit to trigger a real deployment:

```bash
git commit --allow-empty -m "Test auto-deploy"
git push origin main
```

## Branch Configuration

### Deploy Only from Main

```bash
slipway project:update myapp --auto-deploy-branch=main
```

Pushes to `main` trigger deploys. Other branches are ignored.

### Deploy from Multiple Branches

Configure different environments for different branches:

```bash
# main → production
slipway project:update myapp \
  --auto-deploy=true \
  --auto-deploy-branch=main \
  --env=production

# develop → staging
slipway env:create myapp staging
slipway project:update myapp \
  --auto-deploy=true \
  --auto-deploy-branch=develop \
  --env=staging
```

### Branch Pattern Matching

Deploy from branches matching a pattern:

```bash
# Deploy from any release/* branch
slipway project:update myapp --auto-deploy-branch="release/*"
```

## Deploy Conditions

### Skip Deployment

Add `[skip deploy]` or `[no deploy]` to your commit message to skip auto-deploy:

```bash
git commit -m "Update README [skip deploy]"
git push origin main
# No deployment triggered
```

### Force Deployment

Add `[force deploy]` to deploy even if there are no code changes:

```bash
git commit --allow-empty -m "Force rebuild [force deploy]"
git push origin main
```

## Webhook Security

### Signature Verification

Slipway verifies GitHub's webhook signature using HMAC-SHA256. This ensures:

- The webhook is from GitHub
- The payload wasn't tampered with

### IP Allowlisting

For extra security, restrict webhook endpoints to GitHub's IPs:

```bash
# GitHub's webhook IPs (check GitHub docs for current list)
192.30.252.0/22
185.199.108.0/22
140.82.112.0/20
```

## Notifications

Get notified of auto-deploy results:

### Slack Integration

```bash
slipway notifications:add myapp slack https://hooks.slack.com/services/xxx
```

You'll receive messages for:

- Deploy started
- Deploy succeeded
- Deploy failed

### Discord Integration

```bash
slipway notifications:add myapp discord https://discord.com/api/webhooks/xxx
```

### Email Notifications

Configure in Dashboard under **Settings → Notifications**.

## Viewing Auto-Deploy History

```bash
slipway deployments myapp
```

Auto-deploys are marked with their trigger:

```
ID        STATUS    TRIGGER    COMMIT     BRANCH    DEPLOYED
def456    running   webhook    a1b2c3d    main      2 minutes ago
abc123    success   webhook    e4f5g6h    main      1 hour ago
xyz789    success   manual     i7j8k9l    main      1 day ago
```

## Multi-App Auto-Deploy

In [multi-app environments](/slipway/multi-app), a webhook push triggers deployments for **all apps** in the environment. Each app gets its own deployment record, build, and container.

```
Push to main
  ├── Deploy: web app     (Dockerfile)
  └── Deploy: worker app  (Dockerfile.worker)
```

Each deployment runs independently — if the web app build succeeds but the worker fails, the web app still goes live.

## Deploy Queue

If multiple pushes happen quickly:

1. Slipway queues them
2. Deploys happen sequentially
3. Only the latest code is deployed if pushes are rapid

```
Push 1 → Queued
Push 2 → Queued (replaces push 1 in queue)
Push 3 → Queued (replaces push 2 in queue)
Deploy starts with Push 3's code
```

## Troubleshooting

### Webhook Not Received

1. **Check GitHub webhook status**:
   - Go to repo → Settings → Webhooks
   - Click your webhook
   - Check "Recent Deliveries"

2. **Verify URL is correct**:
   - Should include `https://`
   - Check for typos

3. **Check firewall**:
   - Slipway must be accessible from the internet
   - Port 443 must be open

### Deployment Not Starting

1. **Check branch matches**:

   ```bash
   slipway project:info myapp
   # Verify auto-deploy-branch setting
   ```

2. **Check webhook logs**:

   ```bash
   slipway webhook:logs myapp
   ```

3. **Verify webhook secret**:
   - Must match between GitHub and Slipway

### Deployment Failing

1. **Check deployment logs**:

   ```bash
   slipway logs myapp --deployment=latest
   ```

2. **Test locally**:
   ```bash
   docker build -t test .
   docker run test
   ```

### Wrong Branch Deploying

1. **Check branch configuration**:

   ```bash
   slipway project:info myapp
   ```

2. **Update if needed**:
   ```bash
   slipway project:update myapp --auto-deploy-branch=main
   ```

## GitHub Actions Alternative

If you prefer more control, use GitHub Actions instead of webhooks:

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

### Benefits of GitHub Actions

- More control over the deploy process
- Can run tests before deploying
- Conditional deploys based on paths changed
- Integration with other workflows

### Setting Up

1. Generate a Slipway API token in Dashboard → Settings → API Tokens
2. Add secrets to GitHub repo:
   - `SLIPWAY_TOKEN`
   - `SLIPWAY_SERVER`

## GitLab CI/CD

For GitLab repositories:

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

## Bitbucket Pipelines

For Bitbucket repositories:

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

## Best Practices

### 1. Protect Your Main Branch

Require pull requests before merging to `main`:

- Code review
- CI passing
- No direct pushes

### 2. Use Staging First

Configure two environments:

- `develop` → staging (test first)
- `main` → production (after staging is verified)

### 3. Add Health Checks

Configure health checks so Slipway can verify deployments:

```javascript
// api/controllers/health/check.js
module.exports = {
  fn: async function () {
    // Check database connection
    await User.count()

    // Check Redis
    await sails.helpers.cache.get('health')

    return { status: 'healthy' }
  }
}
```

Then configure in Slipway:

```bash
slipway project:update myapp --health-check-path=/health/check
```

### 4. Set Up Notifications

Never miss a failed deploy:

```bash
slipway notifications:add myapp slack https://hooks.slack.com/services/xxx
```

### 5. Use Deploy Locks

Prevent deploys during critical periods:

```bash
# Lock deployments
slipway deploy:lock myapp --reason="Database migration in progress"

# Unlock when done
slipway deploy:unlock myapp
```

## What's Next?

- Set up [Environment Variables](/slipway/environment-variables) for different environments
- Configure [Rollbacks](/slipway/rollbacks) for quick recovery
- Learn about [Team Management](/slipway/team-management) for access control
