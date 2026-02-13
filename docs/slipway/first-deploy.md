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

Let's deploy your first Sails.js application with Slipway.

## Prerequisites

Before deploying, make sure:

1. You have a Sails.js application ready
2. Your app has a `Dockerfile` in the root directory
3. The Slipway CLI is installed and authenticated

::: info Need a Dockerfile?
If your Sails app doesn't have a Dockerfile yet, here's a simple one to get started:

```dockerfile
FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --production

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
2. Check for a Dockerfile
3. Create the project in Slipway
4. Save a `.slipway.json` config file locally

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

## Set Environment Variables

Most Sails apps need environment variables. Set them before or after deploying:

```bash
# Set individual variables
slipway env:set myapp DATABASE_URL=postgres://...
slipway env:set myapp SESSION_SECRET=your-secret-key
slipway env:set myapp NODE_ENV=production

# Or set multiple at once
slipway env:set myapp \
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

Give your app a proper domain:

```bash
slipway domain:add myapp myapp.example.com
```

Then point your DNS to your Slipway server's IP address. SSL will be provisioned automatically via Caddy.

## View Logs

Check your application logs:

```bash
# View recent logs
slipway logs myapp

# Tail logs in real-time
slipway logs myapp -t
```

## Open the Helm (REPL)

Need to debug or query your production data? Open the Helm:

```bash
slipway helm myapp
```

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
