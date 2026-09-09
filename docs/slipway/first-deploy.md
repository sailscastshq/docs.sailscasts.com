---
head:
  - - meta
    - property: 'og:image'
      content: https://docs.sailscasts.com/slipway-social.png
title: Your First Deploy
titleTemplate: Slipway
description: Deploy your first Sails.js application with Slipway.
prev:
  text: Initial Setup
  link: /slipway/initial-setup
next:
  text: Configuration
  link: /slipway/configuration
editLink: true
---

# Your First Deploy

This page walks through deploying your first Sails.js application with Slipway.

## Prerequisites

Before deploying, make sure:

1. You have a Sails.js application ready
2. Your app has a `Dockerfile` in the root directory
3. The Slipway CLI is installed and authenticated

::: info Need a Dockerfile?
If your Sails app doesn't have a Dockerfile yet, here's a simple one to get started:

```dockerfile
FROM node:24-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --omit=dev

COPY . .

EXPOSE 1337

CMD ["node", "app.js"]
```

:::

## Initialize Your Project

Navigate to your Sails project and initialize it with Slipway:

```bash
cd ~/projects/my-sails-app

slipway init
```

This will:

1. Prompt you for a project name (defaults to your package.json name)
2. Create the project in Slipway
3. Save a `.slipway.json` config file locally
4. Show the initial server-owned deployment readiness report

```
  Initialize Slipway Project

  Project name: my-sails-app

  ✓ Project created

  Project: My Sails App
  Slug: my-sails-app
  Environment: production

  Run slipway slide to deploy your app.
```

::: tip Linking to Existing Projects
If the project already exists in Slipway (e.g., created via the dashboard), use `slipway link` instead:

```bash
slipway link my-sails-app
```

:::

## Check deployment readiness

Push the source you want to inspect, then request its readiness report:

```bash
slipway push
slipway readiness --env production
```

The app and environment pages show the same server-owned report. Use `--app web` to select an app, or `--json` for the structured result. The report identifies its source fingerprint and configured health path. Refresh it after source or configuration changes.

**Required checks** block a deployment when a problem is proven, such as a missing Dockerfile, an unsupported Node runtime, or a missing explicitly required variable. **Recommendations** do not disable deployment. **Optional capabilities** describe packages such as `sails-hook-slipway`, which unlocks configured Bridge and Lookout features but is not required just to deploy.

Managed databases and Redis are optional. A configured external connection is accepted without requiring a managed service; the app must still establish that connection during startup. Redis guidance follows the app's production session/socket configuration. Apps that need sessions to survive restarts should use an appropriate durable session store.

The app must honor `PORT=1337`, bind to `0.0.0.0`, and serve a successful HTTP response at its configured health path (default `/health`). Slipway checks the actual deployment snapshot and probes the candidate before switching traffic. A previous successful probe does not verify changed source or settings.

To make specific variables required, declare their names in package.json:

```json
{
  "slipway": {
    "readiness": {
      "requiredEnv": ["DATABASE_URL", "PAYMENT_KEY"]
    }
  }
}
```

Only explicitly declared requirements are blockers. Missing names can appear in the report; secret values never do. Dynamic configuration that cannot be verified remains advisory. Use an actively supported Node LTS release; the example above uses Node 24.

## Deploy Your App

Navigate to your Sails project directory and deploy:

```bash
cd ~/projects/my-sails-app

slipway slide
```

You'll see the deployment progress:

```
$ slipway slide

  Sliding my-sails-app into production

  ✓ Deployment started

  Deployment ID: abc12345

  Building...
  Deploying...

  ✓ Deployment successful

  URL: https://my-sails-app.example.com
```

## Verify the public route

Open the URL reported by the successful deployment or request its health path:

```bash
curl -I https://YOUR_APP_DOMAIN/health
```

Fresh installations keep the allocated container port on loopback and route
public traffic through Caddy. If you deliberately need a raw
`http://SERVER_IP:PORT` diagnostic URL, enable the documented direct-access
mode first.

::: tip Ingress modes
See [Ingress and Firewall](/slipway/ingress-and-firewall) for Caddy defaults,
explicit raw-port access, and optional Cloudflare Tunnel mode.
:::

## Set Environment Variables

Most Sails apps need environment variables. Set them before or after deploying:

```bash
# Set individual variables
slipway env:set DATABASE_URL=postgres://...
slipway env:set SESSION_SECRET=your-secret-key
slipway env:set NODE_ENV=production

# Or set multiple at once
slipway env:set \
  DATABASE_URL=postgres://... \
  SESSION_SECRET=your-secret-key \
  NODE_ENV=production
```

::: tip Redeploy After Env Changes
After changing environment variables, redeploy your app for the changes to take effect:

```bash
slipway slide
```

:::

## Add a Custom Domain

Assign one custom hostname to the production environment from your linked project directory:

```bash
slipway environment:update production --domain myapp.example.com
```

Point DNS to your Slipway server's public IP and allow ports 80 and 443. Saving verifies the proxy route, not DNS propagation or certificate issuance. Open the HTTPS URL to verify it. See [Custom Domain & SSL](/slipway/custom-domain) for removal, fallback access, and troubleshooting.

## View Logs

Check your application logs:

```bash
# View recent logs
slipway logs --env production

# Tail logs in real-time
slipway logs --env production --follow
```

## Open the Helm (REPL)

Need to debug or query your production data? Open the Helm:

Open the deployed app in the dashboard and choose **Helm** from its tools menu.

```javascript
Slipway Helm (myapp production)
Type .help for available commands

> await User.count()
42

> await User.find({ role: 'admin' })
[
  { id: 1, email: 'admin@example.com', role: 'admin' }
]
```

## Deploy from Dashboard

You can also trigger deployments from the Slipway dashboard:

1. Go to your project
2. Click the **Deploy** tab
3. Slide to deploy (or click the deploy button)

The dashboard shows deployment history, logs, and status.

## What's Next?

Congratulations! Your first Sails app is deployed. Next steps:

- [Set up a database](/slipway/creating-projects) with one-click provisioning
- [Configure rollbacks](/slipway/rollbacks) for quick recovery
- [Explore the Bridge](/slipway/bridge) for data management
- [Learn more CLI commands](/slipway/cli-commands)
