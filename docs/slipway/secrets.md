---
head:
  - - meta
    - property: 'og:image'
      content: https://docs.sailscasts.com/slipway-social.png
title: Secrets
titleTemplate: Slipway
description: Securely manage sensitive configuration like API keys and passwords.
prev:
  text: Global Environment Variables
  link: /slipway/global-environment-variables
next:
  text: File Uploads
  link: /slipway/file-uploads
editLink: true
---

# Secrets

Secrets are sensitive environment variables like API keys, passwords, and tokens. Slipway provides enhanced security for these values.

## Secrets vs. Environment Variables

| Feature              | Environment Variables | Secrets |
| -------------------- | --------------------- | ------- |
| Encrypted at rest    | ✓                     | ✓       |
| Masked in logs       | ✓                     | ✓       |
| Masked in CLI output | ✗                     | ✓       |
| Audit logging        | ✗                     | ✓       |
| Access restrictions  | ✗                     | ✓       |
| Rotation support     | ✗                     | ✓       |

## Creating Secrets

### Via CLI

```bash
# Mark a variable as a secret
slipway secret:set myapp STRIPE_KEY=sk_live_xxx

# Set multiple secrets
slipway secret:set myapp \
  STRIPE_KEY=sk_live_xxx \
  DATABASE_PASSWORD=supersecret \
  JWT_SECRET=random-string
```

### Via Dashboard

1. Go to your project
2. Click **Secrets** tab
3. Click **Add Secret**
4. Enter name and value
5. Click **Save**

## Viewing Secrets

Secrets are always masked:

```bash
slipway secret:list myapp
```

Output:

```
NAME                VALUE
STRIPE_KEY          ••••••••••••••••
DATABASE_PASSWORD   ••••••••••••••••
JWT_SECRET          ••••••••••••••••
```

::: warning No --show Flag
Unlike environment variables, secrets cannot be revealed via CLI. This is intentional for security.
:::

## Updating Secrets

```bash
slipway secret:set myapp STRIPE_KEY=sk_live_new_key
```

The old value is overwritten and logged in the audit trail.

## Deleting Secrets

```bash
slipway secret:unset myapp OLD_SECRET
```

## Secret Rotation

For enhanced security, rotate secrets regularly:

### Manual Rotation

```bash
# 1. Set new secret with temporary name
slipway secret:set myapp STRIPE_KEY_NEW=sk_live_new

# 2. Update your app to use new key
# 3. Deploy
slipway slide

# 4. Verify app works with new key
# 5. Update to final name
slipway secret:set myapp STRIPE_KEY=sk_live_new
slipway secret:unset myapp STRIPE_KEY_NEW

# 6. Redeploy
slipway slide
```

### Automated Rotation (Coming Soon)

```bash
slipway secret:rotate myapp STRIPE_KEY --interval=30d
```

## Audit Logging

All secret access is logged:

```bash
slipway secret:audit myapp
```

Output:

```
TIMESTAMP            USER                ACTION    SECRET
2024-01-20 14:30     admin@example.com   SET       STRIPE_KEY
2024-01-20 14:25     admin@example.com   SET       DATABASE_PASSWORD
2024-01-19 10:00     ci@slipway          READ      JWT_SECRET
2024-01-18 09:00     admin@example.com   UNSET     OLD_KEY
```

## Access Control

### Role-Based Access

Configure who can manage secrets:

| Role      | View | Set | Unset |
| --------- | ---- | --- | ----- |
| Owner     | ✓    | ✓   | ✓     |
| Admin     | ✓    | ✓   | ✓     |
| Developer | ✗    | ✗   | ✗     |
| Viewer    | ✗    | ✗   | ✗     |

### Custom Permissions

In Dashboard → Settings → Permissions:

```javascript
{
  "secrets": {
    "view": ["owner", "admin"],
    "manage": ["owner", "admin"]
  }
}
```

## Security Best Practices

### 1. Use Secrets for Sensitive Data

**Should be secrets:**

- API keys (Stripe, SendGrid, etc.)
- Database passwords
- JWT/session secrets
- OAuth client secrets
- Encryption keys

**Can be regular env vars:**

- Feature flags
- Log levels
- Non-sensitive URLs
- Configuration options

### 2. Generate Strong Secrets

```bash
# Generate random secret
openssl rand -hex 32
# Output: 8f4e3d2c1b0a9f8e7d6c5b4a3f2e1d0c9b8a7f6e5d4c3b2a1f0e9d8c7b6a5f4e

# Or in Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### 3. Never Commit Secrets

```
# .gitignore
.env
.env.local
.env.*.local
*.pem
*.key
secrets.json
```

### 4. Use Different Secrets per Environment

```bash
# Production
slipway secret:set myapp STRIPE_KEY=sk_live_xxx --env=production

# Staging (test key)
slipway secret:set myapp STRIPE_KEY=sk_test_xxx --env=staging
```

### 5. Rotate Secrets Regularly

- Database passwords: Every 90 days
- API keys: Every 180 days
- JWT secrets: Every 30 days

### 6. Limit Secret Scope

Only set secrets for apps that need them:

```bash
# Only the payment service needs Stripe
slipway secret:set payment-service STRIPE_KEY=sk_live_xxx

# Don't set it for every app
```

## Using Secrets in Your App

Secrets are injected as environment variables:

```javascript
// config/custom.js
module.exports.custom = {
  stripeKey: process.env.STRIPE_KEY,
  jwtSecret: process.env.JWT_SECRET
}
```

### Validating Secrets Exist

```javascript
// config/bootstrap.js
module.exports.bootstrap = async function () {
  const requiredSecrets = ['STRIPE_KEY', 'DATABASE_PASSWORD', 'JWT_SECRET']

  const missing = requiredSecrets.filter((key) => !process.env[key])

  if (missing.length > 0) {
    throw new Error(`Missing required secrets: ${missing.join(', ')}`)
  }
}
```

## Secrets in CI/CD

### GitHub Actions

Store secrets in GitHub:

1. Go to repo → Settings → Secrets
2. Add `SLIPWAY_TOKEN`
3. Use in workflow:

```yaml
# .github/workflows/deploy.yml
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - name: Deploy
        env:
          SLIPWAY_TOKEN: ${{ secrets.SLIPWAY_TOKEN }}
        run: slipway slide
```

### GitLab CI

```yaml
# .gitlab-ci.yml
deploy:
  script:
    - slipway slide
  variables:
    SLIPWAY_TOKEN: $SLIPWAY_TOKEN # From GitLab CI/CD variables
```

## Importing/Exporting Secrets

### Export (Encrypted)

```bash
# Export encrypted secrets (for backup)
slipway secret:export myapp --encrypted > secrets.enc
```

### Import

```bash
# Import from encrypted backup
slipway secret:import myapp secrets.enc
```

::: warning Keep Backups Secure
Encrypted exports still contain sensitive data. Store them securely.
:::

## Troubleshooting

### "Secret Not Found"

1. Check the secret exists:

   ```bash
   slipway secret:list myapp
   ```

2. Check you're in the right environment:
   ```bash
   slipway secret:list myapp --env=production
   ```

### "Permission Denied"

You don't have access to manage secrets. Contact your team owner.

### "Secret Value Appears Empty"

1. Verify the secret was set correctly:

   ```bash
   slipway secret:audit myapp | grep SECRET_NAME
   ```

2. Redeploy to pick up new secrets:
   ```bash
   slipway slide
   ```

### "Secrets Visible in Logs"

Check your logging configuration. Never log:

```javascript
// BAD - Don't do this!
sails.log.info('Config:', process.env)
sails.log.info('Stripe key:', process.env.STRIPE_KEY)
```

## What's Next?

- Set up [Database Services](/slipway/database-services) with secure credentials
- Configure [Auto-Deploy](/slipway/auto-deploy) with CI/CD secrets
- Learn about [Helm](/slipway/helm) for secure debugging
