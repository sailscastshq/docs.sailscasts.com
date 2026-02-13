---
head:
  - - meta
    - property: 'og:image'
      content: https://docs.sailscasts.com/slipway-social.png
title: Settings
titleTemplate: Slipway
description: Configure global settings for your Slipway instance.
prev:
  text: Custom Domain & SSL
  link: /slipway/custom-domain
next:
  text: CLI Installation
  link: /slipway/cli-installation
editLink: true
---

# Settings

Manage your Slipway instance settings from the dashboard.

## Accessing Settings

1. Log into your Slipway dashboard
2. Click your avatar (bottom left)
3. Select **Settings**

Or navigate directly to:

```
https://slipway.yourdomain.com/settings
```

## Instance Settings

### General

| Setting       | Description                               |
| ------------- | ----------------------------------------- |
| Instance Name | Display name (e.g., "Production Slipway") |
| Instance URL  | Public URL for webhooks and CLI           |
| Contact Email | Admin contact for notifications           |

### Registration

| Setting                    | Description                 | Default     |
| -------------------------- | --------------------------- | ----------- |
| Allow Signups              | Enable public registration  | `false`     |
| Require Email Verification | Verify email before access  | `true`      |
| Allowed Email Domains      | Restrict signups to domains | Empty (all) |

Example domain restriction:

```
example.com, company.org
```

## Security Settings

### Authentication

| Setting              | Description                  | Default    |
| -------------------- | ---------------------------- | ---------- |
| Session Timeout      | Auto-logout after inactivity | `24 hours` |
| Remember Me Duration | Extended session length      | `30 days`  |
| Max Sessions         | Sessions per user            | `10`       |

### Two-Factor Authentication

| Setting                | Description             | Default |
| ---------------------- | ----------------------- | ------- |
| Require 2FA            | Enforce for all users   | `false` |
| Require 2FA for Admins | Enforce for admins only | `true`  |

### Access Control

| Setting       | Description           | Default      |
| ------------- | --------------------- | ------------ |
| IP Allowlist  | Restrict access by IP | Disabled     |
| Rate Limiting | API rate limit        | `100/minute` |

#### IP Allowlist Example

```
192.168.1.0/24
10.0.0.0/8
203.0.113.50
```

## Email Settings

Configure email for notifications and password reset.

### SMTP Configuration

| Setting       | Description                    |
| ------------- | ------------------------------ |
| Transport     | `smtp`, `resend`, or `log`     |
| SMTP Host     | Mail server hostname           |
| SMTP Port     | Mail server port (usually 587) |
| SMTP User     | Authentication username        |
| SMTP Password | Authentication password        |
| From Address  | Sender email address           |
| From Name     | Sender display name            |

### Testing Email

Click **Send Test Email** to verify your configuration.

## Notification Settings

### Deployment Notifications

| Setting          | Description                 | Default |
| ---------------- | --------------------------- | ------- |
| Email on Deploy  | Send email on deployment    | `false` |
| Email on Failure | Send email on failed deploy | `true`  |

### Integrations

Configure external notification services:

- **Slack**: Webhook URL for channel notifications
- **Discord**: Webhook URL for channel notifications
- **Custom Webhook**: Your own notification endpoint

## Backup Settings

### Automatic Backups

| Setting   | Description              | Default        |
| --------- | ------------------------ | -------------- |
| Enabled   | Enable automatic backups | `true`         |
| Schedule  | Backup frequency         | Daily 2 AM UTC |
| Retention | Backups to keep          | `7`            |

### Backup Storage

| Option | Description               |
| ------ | ------------------------- |
| Local  | Store on Slipway server   |
| S3     | Store in AWS S3 bucket    |
| Custom | Store via custom endpoint |

#### S3 Configuration

```
Bucket: my-slipway-backups
Region: us-east-1
Access Key: AKIAIOSFODNN7EXAMPLE
Secret Key: wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY
```

## Log Settings

### Retention

| Log Type         | Description             | Default |
| ---------------- | ----------------------- | ------- |
| Application Logs | Runtime logs from apps  | 7 days  |
| Build Logs       | Docker build output     | 30 days |
| Deploy Logs      | Deployment process logs | 30 days |
| Audit Logs       | Security/access logs    | 90 days |

### Log Forwarding

Forward logs to external services:

- **Datadog**: API key and site
- **Logtail**: Source token
- **Custom**: Webhook endpoint

## Deployment Settings

### Global Defaults

| Setting              | Description               | Default      |
| -------------------- | ------------------------- | ------------ |
| Default Health Check | Default health check path | `/`          |
| Health Check Timeout | Default timeout           | `30 seconds` |
| Deploy Timeout       | Maximum deploy duration   | `10 minutes` |
| Deployment Retention | Deployments to keep       | `10`         |

### Resource Limits

| Setting        | Description              | Default  |
| -------------- | ------------------------ | -------- |
| Default Memory | Memory per container     | `512 MB` |
| Default CPU    | CPU shares per container | `1.0`    |
| Build Memory   | Memory for builds        | `2 GB`   |

## API Settings

### API Tokens

Manage API tokens for CI/CD and automation:

1. Go to **Settings → API Tokens**
2. Click **Generate Token**
3. Enter a name (e.g., "GitHub Actions")
4. Copy the token (shown once)

### Token Permissions

| Scope    | Description                  |
| -------- | ---------------------------- |
| `deploy` | Trigger deployments          |
| `read`   | Read project/deployment info |
| `admin`  | Full administrative access   |

## Team Settings

### Team Information

| Setting   | Description                |
| --------- | -------------------------- |
| Team Name | Display name for your team |
| Team Slug | URL identifier             |

### Default Roles

| Role      | Permissions                        |
| --------- | ---------------------------------- |
| Owner     | Full access, can delete team       |
| Admin     | Manage projects, users, settings   |
| Developer | Deploy, view logs, manage env vars |
| Viewer    | Read-only access                   |

### Invitations

1. Go to **Settings → Team**
2. Click **Invite Member**
3. Enter email and select role
4. Click **Send Invitation**

## Profile Settings

### Your Profile

| Setting   | Description                |
| --------- | -------------------------- |
| Full Name | Your display name          |
| Email     | Your login email           |
| Avatar    | Profile picture (Gravatar) |

### Change Password

1. Go to **Settings → Profile**
2. Click **Change Password**
3. Enter current and new password
4. Click **Update**

### Two-Factor Authentication

1. Go to **Settings → Profile**
2. Click **Enable 2FA**
3. Scan QR code with authenticator app
4. Enter verification code

## Export/Import Settings

### Export Settings

Download your Slipway configuration:

```bash
slipway settings:export > slipway-settings.json
```

### Import Settings

Restore settings from backup:

```bash
slipway settings:import slipway-settings.json
```

::: warning Sensitive Data
Exported settings may contain sensitive information. Handle securely.
:::

## What's Next?

- Set up [CLI Installation](/slipway/cli-installation) for your team
- Configure [Team Management](/slipway/team-management) for access control
- Enable [Auto-Deploy](/slipway/auto-deploy) for CI/CD
