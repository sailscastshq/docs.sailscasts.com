---
head:
  - - meta
    - property: 'og:image'
      content: https://docs.sailscasts.com/slipway-social.png
title: Global Environment Variables
titleTemplate: Slipway
description: Configure instance-wide environment variables that are shared across all your deployed applications.
prev:
  text: Environment Variables
  link: /slipway/environment-variables
next:
  text: File Uploads
  link: /slipway/file-uploads
editLink: true
---

# Global Environment Variables

Global environment variables are instance-wide settings that are automatically injected into all your deployed applications. This is useful for shared credentials like S3-compatible storage, email services, or API keys.

## Why Global Variables?

Instead of setting the same R2/S3 credentials on every project:

```bash
# Without global variables - repetitive
slipway env:set app1 R2_ACCESS_KEY=abc123...
slipway env:set app1 R2_SECRET_KEY=xyz789...
slipway env:set app2 R2_ACCESS_KEY=abc123...
slipway env:set app2 R2_SECRET_KEY=xyz789...
# ... for every app
```

Set them once globally:

```bash
# With global variables - set once, use everywhere
slipway config:set R2_ACCESS_KEY=abc123...
slipway config:set R2_SECRET_KEY=xyz789...
```

## Setting Global Variables

### Via Dashboard

1. Go to **Settings**
2. Click **Global Environment**
3. Add variables
4. Click **Save**

### Via CLI

```bash
# Set a global variable
slipway config:set VAR_NAME=value

# Set multiple at once
slipway config:set \
  R2_ACCESS_KEY=abc123 \
  R2_SECRET_KEY=xyz789 \
  R2_BUCKET=my-uploads \
  R2_ENDPOINT=https://xxx.r2.cloudflarestorage.com
```

## Common Global Variables

### S3-Compatible Storage (R2, Spaces, S3)

For file uploads and backups:

```bash
# Cloudflare R2
slipway config:set \
  R2_ACCESS_KEY=your-access-key \
  R2_SECRET_KEY=your-secret-key \
  R2_BUCKET=your-bucket \
  R2_ENDPOINT=https://account-id.r2.cloudflarestorage.com

# DigitalOcean Spaces
slipway config:set \
  SPACES_ACCESS_KEY=your-access-key \
  SPACES_SECRET_KEY=your-secret-key \
  SPACES_BUCKET=your-bucket \
  SPACES_ENDPOINT=https://nyc3.digitaloceanspaces.com

# Amazon S3
slipway config:set \
  S3_ACCESS_KEY=your-access-key \
  S3_SECRET_KEY=your-secret-key \
  S3_BUCKET=your-bucket \
  S3_REGION=us-east-1
```

### Email Services

```bash
# Mailgun
slipway config:set \
  MAILGUN_API_KEY=key-xxx \
  MAILGUN_DOMAIN=mail.example.com

# SendGrid
slipway config:set \
  SENDGRID_API_KEY=SG.xxx

# Resend
slipway config:set \
  RESEND_API_KEY=re_xxx
```

### Monitoring & Error Tracking

```bash
# Sentry
slipway config:set \
  SENTRY_DSN=https://xxx@sentry.io/123
```

## Viewing Global Variables

### Via CLI

```bash
slipway config:list
```

Output:

```
Global Environment Variables

NAME              VALUE                    SET
R2_ACCESS_KEY     abc1...                  2 days ago
R2_SECRET_KEY     ********                 2 days ago
R2_BUCKET         my-uploads               2 days ago
R2_ENDPOINT       https://xxx.r2...        2 days ago
SENTRY_DSN        https://xxx@se...        1 week ago
```

### Via Dashboard

Go to **Settings → Global Environment** to see all variables.

## Variable Inheritance

Global variables are inherited by all projects, but can be overridden:

```
┌─────────────────────────────────────────────────────────┐
│  Global Variables (instance-wide)                        │
│  R2_ACCESS_KEY=abc123                                   │
│  R2_BUCKET=default-bucket                               │
└─────────────────────────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────┐
│  Project: my-app                                         │
│  Inherited: R2_ACCESS_KEY=abc123                        │
│  Override:  R2_BUCKET=my-app-bucket  ← project-specific │
└─────────────────────────────────────────────────────────┘
```

### Override Priority

1. **Project environment variables** (highest priority)
2. **Global environment variables**
3. **Slipway defaults** (PORT, NODE_ENV, etc.)

## Removing Global Variables

```bash
# Remove a global variable
slipway config:unset R2_ACCESS_KEY

# Remove multiple
slipway config:unset R2_ACCESS_KEY R2_SECRET_KEY R2_BUCKET
```

## Using in Your Sails App

Global variables are available like any environment variable:

```javascript
// config/uploads.js
module.exports.uploads = {
  adapter: require('skipper-s3'),
  key: process.env.R2_ACCESS_KEY,
  secret: process.env.R2_SECRET_KEY,
  bucket: process.env.R2_BUCKET,
  endpoint: process.env.R2_ENDPOINT
}
```

```javascript
// config/email.js
module.exports.email = {
  adapter: 'sails-hook-mail',
  apiKey: process.env.SENDGRID_API_KEY
}
```

## Security

::: warning Sensitive Values
Global variables are encrypted at rest. However, they are decrypted and injected into containers at runtime. Ensure your Slipway server is properly secured.
:::

### Who Can See Global Variables?

| Role      | Can View | Can Edit |
| --------- | -------- | -------- |
| Owner     | Yes      | Yes      |
| Admin     | Yes      | Yes      |
| Developer | Masked   | No       |
| Viewer    | No       | No       |

## Database Backups to S3

When global S3 variables are configured, database backups can be sent to S3-compatible storage:

```bash
# Enable S3 backups (uses global R2/S3 variables)
slipway db:backup mydb --to-s3

# Or configure automatic backups
slipway db:update mydb --backup-to-s3=true --backup-schedule="0 3 * * *"
```

See [Database Services](/slipway/database-services#backups) for more details.

## Best Practices

### 1. Use Descriptive Names

```bash
# Good - clear purpose
slipway config:set UPLOADS_S3_BUCKET=my-uploads
slipway config:set BACKUPS_S3_BUCKET=my-backups

# Avoid - ambiguous
slipway config:set BUCKET=something
```

### 2. Separate by Concern

Consider using different buckets/credentials for different purposes:

- `UPLOADS_*` - User-uploaded files
- `BACKUPS_*` - Database backups
- `ASSETS_*` - Static assets

### 3. Rotate Credentials

Periodically rotate your API keys:

```bash
# Update global variable (takes effect on next deploy)
slipway config:set R2_ACCESS_KEY=new-key

# Redeploy apps to pick up new credentials
slipway deploy app1
slipway deploy app2
```

## What's Next?

- Learn about [File Uploads](/slipway/file-uploads) with S3-compatible storage
- Configure [Database Services](/slipway/database-services) with S3 backups
- Set up [Environment Variables](/slipway/environment-variables) for project-specific config
