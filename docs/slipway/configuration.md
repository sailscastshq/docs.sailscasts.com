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

Configure Slipway itself separately from the apps it deploys. Instance settings belong to the host; environment and app settings belong to the selected project target.

## Server Configuration

### Environment Variables

The installer persists server settings in `/etc/slipway/.env`. Prefer
rerunning the installer with explicit environment overrides because it also
keeps Docker bindings and active firewall rules consistent.

| Variable                 | Description                            | Default        |
| ------------------------ | -------------------------------------- | -------------- |
| `PORT`                   | Internal Slipway application port      | `1337`         |
| `NODE_ENV`               | Environment mode                       | `production`   |
| `SLIPWAY_URL`            | Public URL of your Slipway instance    | Detected       |
| `SLIPWAY_INGRESS`        | `public` or `cloudflare-tunnel`        | `public`       |
| `SLIPWAY_PROXY_HOST`     | Host interface for Caddy               | Mode-dependent |
| `SLIPWAY_DASHBOARD_HOST` | Host interface for the dashboard port  | `127.0.0.1`    |
| `SLIPWAY_APP_PORT_HOST`  | Host interface for allocated app ports | `127.0.0.1`    |
| `SESSION_SECRET`         | Session-signing secret                 | Generated      |
| `DATA_ENCRYPTION_KEY`    | Encryption key for stored credentials  | Generated      |

### Explicit direct app access

```bash
curl -fsSL https://raw.githubusercontent.com/sailscastshq/slipway/main/install.sh -o /tmp/install-slipway.sh
sudo env SLIPWAY_APP_PORT_HOST=0.0.0.0 bash /tmp/install-slipway.sh
```

::: warning Public boundary
`0.0.0.0` means every server interface. It is an explicit opt-in, not a safer
replacement for Caddy. Read [Ingress and Firewall](/slipway/ingress-and-firewall)
before opening the app port range at your VPS provider.
:::

## Dashboard and project settings

Open [Settings](/slipway/settings) for instance, team, developer, and operational configuration. Use [Project Configuration](/slipway/project-configuration) for app Dockerfiles, health paths, resources, variables, and deployment sources.

`project:update` only changes project identity fields. There is no CLI global settings command, log-forwarding configuration command, or settings import/export interface.

## App Configuration (config/slipway.js)

`sails-hook-slipway` is zero-config when deployed by Slipway. Create
`config/slipway.js` only when the app needs identity or telemetry behavior
overrides:

```javascript
// config/slipway.js
module.exports.slipway = {
  bridge: {
    loginPath: '/login',
    identity: {
      model: 'user',
      sessionKey: 'userId',
      emailAttribute: 'email',
      nameAttribute: 'fullName',
      emailStatusAttribute: 'emailStatus',
      verifiedEmailStatuses: ['verified', 'confirmed']
    }
  },

  lookout: {
    enabled: true,
    captureQueries: true,
    captureExceptions: true,
    slowQueryThreshold: 100
  }
}
```

Enable the app-local `/bridge` route from the app's **Bridge access** page and
redeploy. Slipway injects its app-scoped credential; never commit it to
`config/slipway.js`. Read [Bridge app-local access](/slipway/bridge#app-local-access)
for the invitation and custom identity-helper flow.

## Persist and recover

The installer preserves the instance database volume at `/app/db` and persists server secrets in `/etc/slipway/.env`. Keep the database and its encryption keys together in the recovery plan. Use consistent database backups rather than copying a live SQLite file blindly.

Configure application database backups through [Database Services](/slipway/database-services#backups) and [Private Backup Storage](/slipway/backup-storage). Instance database recovery is a separate operation. Read [Updates](/slipway/updates) before changing images or schema compatibility.

For public routes and Caddy behavior, follow [Ingress and Firewall](/slipway/ingress-and-firewall), [Instance URL](/slipway/instance-url), and [Custom Domain](/slipway/custom-domain). Verify the actual route after changing configuration.
