---
head:
  - - meta
    - property: 'og:image'
      content: https://docs.sailscasts.com/slipway-social.png
title: Configuration
titleTemplate: Slipway
description: Configure your Slipway server and customize its behavior.
prev:
  text: Your First Deploy
  link: /slipway/first-deploy
next:
  text: Instance URL
  link: /slipway/instance-url
editLink: true
---

# Configuration

Slipway can be configured through environment variables and the dashboard settings.

## Server Configuration

### Environment Variables

Configure Slipway via environment variables when starting the Docker container:

| Variable         | Description                         | Default                |
| ---------------- | ----------------------------------- | ---------------------- |
| `PORT`           | Port Slipway listens on             | `1337`                 |
| `NODE_ENV`       | Environment mode                    | `production`           |
| `SLIPWAY_URL`    | Public URL of your Slipway instance | Required               |
| `SLIPWAY_SECRET` | Secret key for encryption           | Required               |
| `DATABASE_PATH`  | Path to SQLite database             | `/app/data/slipway.db` |

### Example Docker Run

```bash
docker run -d \
  --name slipway \
  --network slipway \
  --restart unless-stopped \
  -p 1337:1337 \
  -v /var/run/docker.sock:/var/run/docker.sock \
  -v slipway-data:/app/data \
  -e NODE_ENV=production \
  -e PORT=1337 \
  -e SLIPWAY_URL="https://slipway.yourdomain.com" \
  -e SLIPWAY_SECRET="your-32-character-secret" \
  ghcr.io/sailscastshq/slipway:latest
```

### Generate a Secret

```bash
openssl rand -hex 32
```

::: warning Keep It Secret
Never commit your `SLIPWAY_SECRET` to version control or share it publicly.
:::

## Dashboard Settings

Access settings at **Dashboard → Settings**.

### Instance Settings

| Setting       | Description                          |
| ------------- | ------------------------------------ |
| Instance Name | Display name for your Slipway server |
| Instance URL  | Public URL for webhooks and links    |
| Allow Signups | Enable/disable new user registration |

### Default Project Settings

| Setting              | Description                          | Default      |
| -------------------- | ------------------------------------ | ------------ |
| Default Environment  | Initial environment for new projects | `production` |
| Health Check Timeout | Time to wait for health checks       | `30s`        |
| Deploy Timeout       | Maximum deployment time              | `10m`        |

### Security Settings

| Setting         | Description                       | Default  |
| --------------- | --------------------------------- | -------- |
| Session Timeout | Auto-logout after inactivity      | `24h`    |
| Require 2FA     | Enforce two-factor authentication | `false`  |
| IP Allowlist    | Restrict dashboard access by IP   | Disabled |

## Project Configuration

Projects can be configured via the CLI or dashboard:

### Via CLI

```bash
slipway project:update myapp \
  --auto-deploy=true \
  --auto-deploy-branch=main \
  --health-check-path=/health
```

### Via Dashboard

1. Go to your project
2. Click **Settings**
3. Configure options
4. Click **Save**

### Project Options

| Option                 | Description                      | Default |
| ---------------------- | -------------------------------- | ------- |
| `auto-deploy`          | Enable webhook-triggered deploys | `false` |
| `auto-deploy-branch`   | Branch to deploy from            | `main`  |
| `health-check-path`    | URL path for health checks       | `/`     |
| `health-check-timeout` | Health check timeout             | `30s`   |
| `deploy-timeout`       | Maximum deploy time              | `10m`   |

## App Configuration (config/slipway.js)

For apps using `sails-hook-slipway`, create `config/slipway.js`:

```javascript
// config/slipway.js
module.exports.slipway = {
  // Enable/disable features
  bridge: {
    enabled: true,
    path: '/slipway/bridge'
  },

  helm: {
    enabled: true,
    path: '/slipway/helm',
    readOnly: process.env.NODE_ENV === 'production'
  },

  // Quest integration (if sails-quest installed)
  quest: {
    enabled: true,
    path: '/slipway/quest'
  },

  // Telemetry (send metrics to Slipway server)
  telemetry: {
    enabled: true,
    serverUrl: process.env.SLIPWAY_URL
  }
}
```

## Docker Configuration

### Network Configuration

Slipway uses a Docker network named `slipway`:

```bash
# Create network (done by install.sh)
docker network create slipway
```

All apps and services are attached to this network for internal communication.

### Volume Configuration

Slipway data is stored in Docker volumes:

| Volume          | Purpose             | Default Path    |
| --------------- | ------------------- | --------------- |
| `slipway-data`  | Database and config | `/app/data`     |
| `slipway-certs` | SSL certificates    | `/data` (Caddy) |

### Resource Limits

Set resource limits for Slipway:

```bash
docker run -d \
  --name slipway \
  --memory=512m \
  --cpus=1 \
  ...
```

## Caddy Configuration

Caddy is configured via Docker labels on containers. Slipway sets these automatically:

```javascript
// Labels set by Slipway when deploying
{
  'caddy': 'myapp.example.com',
  'caddy.reverse_proxy': '{{upstreams 1337}}'
}
```

### Custom Caddy Settings

For advanced Caddy configuration, you can modify the Caddy container directly:

```bash
# Access Caddy config
docker exec slipway-proxy cat /etc/caddy/Caddyfile
```

## Backup Configuration

### Automatic Backups

Configure in Dashboard → Settings → Backups:

| Setting   | Description               | Default       |
| --------- | ------------------------- | ------------- |
| Enabled   | Enable automatic backups  | `true`        |
| Schedule  | Backup frequency          | Daily at 2 AM |
| Retention | Number of backups to keep | `7`           |
| Storage   | Where to store backups    | Local         |

### Manual Backup

```bash
# Backup Slipway data
docker exec slipway tar -czf /tmp/backup.tar.gz /app/data
docker cp slipway:/tmp/backup.tar.gz ./slipway-backup.tar.gz
```

## Logging Configuration

### Log Level

Set via environment variable:

```bash
-e LOG_LEVEL=debug  # silly, verbose, info, debug, warn, error
```

### Log Retention

Configure in Dashboard → Settings → Logs:

| Setting     | Description      | Default |
| ----------- | ---------------- | ------- |
| App Logs    | Retention period | 7 days  |
| Build Logs  | Retention period | 30 days |
| Deploy Logs | Retention period | 30 days |

## Email Configuration

For email notifications (password reset, alerts):

```bash
-e MAIL_TRANSPORT=smtp \
-e SMTP_HOST=smtp.gmail.com \
-e SMTP_PORT=587 \
-e SMTP_USER=your-email@gmail.com \
-e SMTP_PASS=your-app-password \
-e MAIL_FROM="Slipway <noreply@yourdomain.com>"
```

Or use Resend:

```bash
-e MAIL_TRANSPORT=resend \
-e RESEND_API_KEY=re_xxx \
-e MAIL_FROM="Slipway <noreply@yourdomain.com>"
```

## What's Next?

- Configure your [Instance URL](/slipway/instance-url) for webhooks
- Set up a [Custom Domain](/slipway/custom-domain) with SSL
- Configure [Settings](/slipway/settings) in the dashboard
