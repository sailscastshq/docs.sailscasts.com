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

When a deployment goes wrong, Slipway makes it easy to rollback to a previous version. No downtime, no panic.

## How Rollbacks Work

Slipway keeps Docker images for your recent deployments. A rollback:

1. Stops the current container
2. Starts a container using the previous image
3. Updates proxy routing
4. All in seconds, with zero downtime

## Rolling Back

### Via CLI

```bash
# Rollback to the previous deployment
slipway rollback myapp

# Rollback to a specific deployment
slipway rollback myapp --deployment=abc123

# Rollback to a specific version tag
slipway rollback myapp --version=v1.2.0
```

### Via Dashboard

1. Go to your project
2. Click the **Deployments** tab
3. Find the deployment you want to restore
4. Click **Rollback to this version**
5. Confirm the rollback

## Rollback Output

```bash
$ slipway rollback myapp

Rolling back myapp to deployment abc123...

  Current: def456 (deployed 5 minutes ago)
  Target:  abc123 (deployed 2 hours ago)

  ▶ Pulling image...
  ▶ Stopping current container...
  ▶ Starting rollback container...
  ▶ Updating proxy routes...

  ✓ Rollback complete

  myapp is now running deployment abc123
  https://myapp.example.com
```

## Viewing Deployment History

Before rolling back, check your deployment history:

```bash
slipway deployments myapp
```

Output:

```
ID        STATUS    COMMIT     MESSAGE              DEPLOYED
def456    running   a1b2c3d    Fix payment bug      5 minutes ago
abc123    stopped   e4f5g6h    Add new feature      2 hours ago
xyz789    stopped   i7j8k9l    Update dependencies  1 day ago
uvw012    stopped   m0n1o2p    Initial deploy       3 days ago
```

## Rollback Scenarios

### 1. Bug in Production

You deployed and users report a critical bug:

```bash
# Quick rollback to previous version
slipway rollback myapp

# Verify the app is working
slipway logs myapp -t
```

### 2. Performance Regression

New code is slow:

```bash
# Check recent deployments
slipway deployments myapp

# Rollback to last known good version
slipway rollback myapp --deployment=abc123
```

### 3. Failed Migration

A database migration failed mid-deploy:

```bash
# Rollback the app
slipway rollback myapp

# Restore database backup if needed
slipway db:restore mydb backup-before-migration.sql

# Fix the migration, then redeploy
slipway slide
```

## Deployment Retention

Slipway retains the last **10 deployments** by default. This includes:

- Docker images
- Build logs
- Deployment metadata

### Configuring Retention

In the dashboard under **Settings → Deployments**:

- **Retention Count**: Number of deployments to keep (default: 10)
- **Retention Days**: Maximum age of kept deployments (default: 30)

::: warning Storage
More retained deployments = more disk space used. Monitor your server's disk usage.
:::

## Rollback vs. Redeploy

| Action       | When to Use                                  |
| ------------ | -------------------------------------------- |
| **Rollback** | Immediate fix needed, previous version works |
| **Redeploy** | Fix the code, deploy the fix                 |

### When to Rollback

- Critical bug in production
- Performance regression
- Breaking change affecting users
- Need immediate fix while investigating

### When to Redeploy

- Bug fix is quick
- Need to move forward, not back
- Previous version also has issues

## Rollback Limitations

### 1. Database Migrations

Rollbacks don't automatically reverse database migrations. If your new deployment ran migrations:

1. The database schema is still updated
2. Rolling back the code may cause errors

**Best Practice**: Make migrations backward-compatible:

```javascript
// Good: Additive migration (safe to rollback code)
await knex.schema.alterTable('users', (table) => {
  table.string('middle_name').nullable() // New column
})

// Risky: Destructive migration (rollback may break)
await knex.schema.alterTable('users', (table) => {
  table.dropColumn('legacy_field') // Removed column
})
```

### 2. Environment Variables

Rollbacks don't change environment variables. If your new deployment required new variables:

1. Those variables are still set
2. The rolled-back code may not use them (fine)
3. Or it may expect different values (check)

### 3. External Services

Changes to external services (Stripe webhooks, third-party APIs) aren't rolled back.

## Emergency Rollback

For critical production issues, use the quick rollback:

```bash
slipway rollback myapp --force
```

This skips confirmation prompts and rolls back immediately.

::: danger Use With Caution
`--force` skips safety checks. Only use in genuine emergencies.
:::

## Rollback Hooks

Configure actions to run on rollback:

```javascript
// config/slipway.js
module.exports.slipway = {
  hooks: {
    onRollback: async (deployment) => {
      // Notify team
      await slack.send(`Rollback: ${deployment.app} to ${deployment.id}`)

      // Clear caches
      await redis.flushdb()
    }
  }
}
```

## Monitoring After Rollback

After rolling back, monitor your app:

### 1. Check Logs

```bash
slipway logs myapp -t
```

### 2. Check Health

```bash
slipway app:status myapp
```

### 3. Test Critical Paths

Manually test key functionality:

- User login
- Core features
- Payment flows

## Preventing Rollback Needs

### 1. Staging Environment

Always deploy to staging first:

```bash
# Deploy to staging
slipway slide --env=staging

# Test thoroughly

# Then deploy to production
slipway slide --env=production
```

### 2. Feature Flags

Use feature flags for risky changes:

```javascript
if (sails.config.custom.newFeatureEnabled) {
  // New code path
} else {
  // Safe fallback
}
```

### 3. Gradual Rollouts

Deploy to a percentage of users first (coming soon):

```bash
slipway slide --canary=10%  # 10% of traffic to new version
```

### 4. Automated Testing

Run tests before every deploy:

```bash
npm test && slipway slide
```

## Rollback API

For CI/CD integration:

```bash
# Rollback via API
curl -X POST https://slipway.example.com/api/v1/apps/myapp/rollback \
  -H "Authorization: Bearer $SLIPWAY_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"deploymentId": "abc123"}'
```

## Troubleshooting

### "No Previous Deployment Found"

This is your first deployment. There's nothing to rollback to.

**Solution**: Fix the issue and redeploy.

### "Image Not Found"

The Docker image for the target deployment was cleaned up.

**Solution**: Increase retention settings or redeploy a fixed version.

### "Rollback Failed"

Check the rollback logs:

```bash
slipway logs myapp --deployment=rollback
```

Common causes:

- Port conflicts
- Missing environment variables
- Database incompatibility

## What's Next?

- Set up [Auto-Deploy](/slipway/auto-deploy) with rollback triggers
- Configure [Environment Variables](/slipway/environment-variables) properly
- Learn about [Helm](/slipway/helm) for debugging issues
