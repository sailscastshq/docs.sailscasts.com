---
head:
  - - meta
    - property: 'og:image'
      content: https://docs.sailscasts.com/slipway-social.png
title: Environment Variables
titleTemplate: Slipway
description: Manage environment variables and secrets for your Slipway applications.
prev:
  text: Rollbacks
  link: /slipway/rollbacks
next:
  text: Global Environment Variables
  link: /slipway/global-environment-variables
editLink: true
---

# Environment Variables

Environment variables configure your application without changing code. Slipway makes it easy to manage variables across environments.

## Setting Variables

### Via CLI

```bash
# Set a single variable
slipway env:set myapp DATABASE_URL=postgres://...

# Set multiple variables
slipway env:set myapp \
  NODE_ENV=production \
  SESSION_SECRET=your-secret-key \
  STRIPE_KEY=sk_live_xxx
```

### Via Dashboard

1. Go to your project
2. Click the **Environment** tab
3. Select the environment (production, staging, etc.)
4. Click **Add Variable**
5. Enter key and value
6. Click **Save**

## Viewing Variables

### List All Variables

```bash
slipway env:list myapp
```

Output (values masked by default):

```
KEY              VALUE
NODE_ENV         production
DATABASE_URL     ••••••••••••
SESSION_SECRET   ••••••••••••
STRIPE_KEY       ••••••••••••
LOG_LEVEL        debug
```

### Show Values

To reveal actual values:

```bash
slipway env:list myapp --show
```

::: warning Security
Only use `--show` in secure environments. Values will be visible in terminal history.
:::

### Get Single Variable

```bash
slipway env:get myapp DATABASE_URL
```

## Removing Variables

```bash
slipway env:unset myapp UNUSED_VAR
```

## Variable Cascade

When a container starts, Slipway merges variables from three levels. Later levels override earlier ones:

```
┌─────────────────────────────────────────────────────────┐
│  1. Global Variables (instance-wide)                     │
│     R2_ACCESS_KEY=abc123                                │
│     LOG_LEVEL=info                                      │
├─────────────────────────────────────────────────────────┤
│  2. Environment Variables (per environment)              │
│     DATABASE_URL=postgres://...                         │
│     LOG_LEVEL=debug          ← overrides global         │
├─────────────────────────────────────────────────────────┤
│  3. App Variables (per app, multi-app only)              │
│     WORKER_CONCURRENCY=5                                │
│     LOG_LEVEL=warn           ← overrides environment    │
└─────────────────────────────────────────────────────────┘
```

**Override priority** (highest wins):

1. **App-specific variables** (set per app in [multi-app environments](/slipway/multi-app))
2. **Environment variables** (set via `slipway env:set` or dashboard)
3. **Global variables** (set in Settings → Global Environment)
4. **Slipway defaults** (`PORT`, `NODE_ENV`, etc.)

For single-app environments, levels 1 and 2 are all you need. App-specific variables only matter when running [multiple apps](/slipway/multi-app) in the same environment.

## When Changes Take Effect

Environment variable changes require a **redeploy** to take effect:

```bash
# Set variables
slipway env:set myapp NEW_VAR=value

# Redeploy to apply
slipway slide
```

::: tip Automatic Restart Coming Soon
Future versions will support automatic container restarts when variables change.
:::

## Environment-Specific Variables

### Multiple Environments

Each environment (production, staging, etc.) has its own variables:

```bash
# Production
slipway env:set myapp --env=production \
  DATABASE_URL=postgres://prod-db/myapp \
  LOG_LEVEL=warn

# Staging
slipway env:set myapp --env=staging \
  DATABASE_URL=postgres://staging-db/myapp \
  LOG_LEVEL=debug
```

### Copying Between Environments

Copy variables from one environment to another:

```bash
slipway env:copy myapp --from=production --to=staging
```

This copies all variables. You'll typically want to update database URLs and API keys afterward.

## Common Variables for Sails Apps

### Required Variables

| Variable   | Description                  | Example      |
| ---------- | ---------------------------- | ------------ |
| `NODE_ENV` | Environment mode             | `production` |
| `PORT`     | Server port (set by Slipway) | `1337`       |

### Database

| Variable       | Description      | Example                             |
| -------------- | ---------------- | ----------------------------------- |
| `DATABASE_URL` | Primary database | `postgres://user:pass@host:5432/db` |
| `REDIS_URL`    | Redis connection | `redis://host:6379`                 |

::: tip Automatic Database URLs
When you link a database with `slipway db:link`, these are set automatically.
:::

### Security

| Variable         | Description            | Example                 |
| ---------------- | ---------------------- | ----------------------- |
| `SESSION_SECRET` | Session encryption key | `random-32-char-string` |
| `CSRF_SECRET`    | CSRF token secret      | `another-random-string` |

### Email (sails-hook-mail)

| Variable         | Description    | Example            |
| ---------------- | -------------- | ------------------ |
| `MAIL_TRANSPORT` | Email provider | `resend`, `smtp`   |
| `RESEND_API_KEY` | Resend API key | `re_xxx`           |
| `SMTP_HOST`      | SMTP server    | `smtp.gmail.com`   |
| `SMTP_PORT`      | SMTP port      | `587`              |
| `SMTP_USER`      | SMTP username  | `user@example.com` |
| `SMTP_PASS`      | SMTP password  | `app-password`     |

### Third-Party Services

| Variable                | Description            | Example                     |
| ----------------------- | ---------------------- | --------------------------- |
| `STRIPE_KEY`            | Stripe secret key      | `sk_live_xxx`               |
| `STRIPE_WEBHOOK_SECRET` | Stripe webhook signing | `whsec_xxx`                 |
| `SENTRY_DSN`            | Sentry error tracking  | `https://xxx@sentry.io/xxx` |
| `AWS_ACCESS_KEY_ID`     | AWS credentials        | `AKIA...`                   |
| `AWS_SECRET_ACCESS_KEY` | AWS credentials        | `xxx`                       |
| `S3_BUCKET`             | S3 bucket name         | `myapp-uploads`             |

## Best Practices

### 1. Never Commit Secrets

Add `.env` to `.gitignore`:

```
# .gitignore
.env
.env.local
.env.*.local
```

### 2. Use Descriptive Names

```bash
# Good
DATABASE_URL=...
STRIPE_SECRET_KEY=...
MAIL_FROM_ADDRESS=...

# Avoid
DB=...
KEY=...
EMAIL=...
```

### 3. Use Different Values per Environment

```bash
# Production
STRIPE_KEY=sk_live_xxx   # Live key

# Staging
STRIPE_KEY=sk_test_xxx   # Test key
```

### 4. Generate Strong Secrets

Use cryptographically secure random strings:

```bash
# Generate a 32-character secret
openssl rand -hex 32
```

Or in Node.js:

```javascript
require('crypto').randomBytes(32).toString('hex')
```

### 5. Document Required Variables

Create a `.env.example` file in your repo:

```bash
# .env.example - Copy to .env and fill in values

# Required
NODE_ENV=development
DATABASE_URL=
SESSION_SECRET=

# Email (optional)
MAIL_TRANSPORT=log
RESEND_API_KEY=

# Payments (optional)
STRIPE_KEY=
STRIPE_WEBHOOK_SECRET=
```

### 6. Validate Variables on Startup

In your Sails app, validate required variables:

```javascript
// config/bootstrap.js
module.exports.bootstrap = async function () {
  const required = ['DATABASE_URL', 'SESSION_SECRET']

  for (const key of required) {
    if (!process.env[key]) {
      throw new Error(`Missing required environment variable: ${key}`)
    }
  }
}
```

## Secrets Management

For highly sensitive values like API keys and passwords, Slipway provides additional security:

### Encrypted Storage

All environment variables are encrypted at rest in Slipway's database.

### Audit Logging

Changes to environment variables are logged:

```bash
slipway env:audit myapp
```

Output:

```
TIMESTAMP            USER              ACTION         KEY
2024-01-20 14:30     admin@example.com SET           STRIPE_KEY
2024-01-20 14:25     admin@example.com SET           DATABASE_URL
2024-01-19 10:00     admin@example.com UNSET         OLD_VAR
```

### Access Control

Environment variable access can be restricted by role:

- **Owners/Admins**: Full access (view, set, unset)
- **Developers**: Set and unset (values hidden)
- **Viewers**: No access

## Importing and Exporting

### Export to File

```bash
slipway env:export myapp > .env.production
```

### Import from File

```bash
slipway env:import myapp .env.production
```

::: warning Review Before Import
Always review the file contents before importing to avoid overwriting critical variables.
:::

### Format

The export format is standard `.env`:

```bash
NODE_ENV=production
DATABASE_URL=postgres://user:pass@host:5432/db
SESSION_SECRET=abc123
```

## Built-in Variables

Slipway automatically sets these variables:

| Variable                | Description                   | Example      |
| ----------------------- | ----------------------------- | ------------ |
| `PORT`                  | Port the app should listen on | `1337`       |
| `NODE_ENV`              | Environment name              | `production` |
| `SLIPWAY_APP`           | App name in Slipway           | `myapp`      |
| `SLIPWAY_ENV`           | Environment name              | `production` |
| `SLIPWAY_DEPLOYMENT_ID` | Current deployment ID         | `abc123`     |

## Troubleshooting

### Variable Not Available

1. **Did you redeploy?** Changes require a redeploy:

   ```bash
   slipway slide
   ```

2. **Check the variable exists:**

   ```bash
   slipway env:list myapp
   ```

3. **Check for typos** in the variable name

### Value Looks Wrong

1. **Check escaping** — Special characters may need escaping:

   ```bash
   # Correct
   slipway env:set myapp 'PASSWORD=p@ss$word!'

   # May have issues
   slipway env:set myapp PASSWORD=p@ss$word!
   ```

2. **Check for trailing whitespace** — Values are trimmed, but check your source

### Variables from Database Link Missing

1. **Verify the link exists:**

   ```bash
   slipway db:list
   ```

2. **Re-link the database:**
   ```bash
   slipway db:unlink mydb myapp
   slipway db:link mydb myapp
   ```

## What's Next?

- Set up [Database Services](/slipway/database-services) with automatic URL injection
- Configure [Auto-Deploy](/slipway/auto-deploy) for CI/CD
- Learn about [Rollbacks](/slipway/rollbacks) if something goes wrong
