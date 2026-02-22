---
head:
  - - meta
    - property: 'og:image'
      content: https://docs.sailscasts.com/boring-stack-social.png
title: Deploy on Slipway
titleTemplate: The Boring JavaScript Stack 🥱
description: Deploy your app on Slipway — the Sails-native deployment platform
prev:
  text: 'Ascent'
  link: '/boring-stack/ascent'
next:
  text: Render
  link: '/boring-stack/render'
editLink: true
---

# Deploy on Slipway

Let's deploy your app on [Slipway](https://github.com/sailscastshq/slipway) :rocket:

::: tip Recommended for self-hosting
Slipway is our recommended deployment platform for self-hosting. It's built from the ground up for The Boring JavaScript Stack — it understands your Sails app, your Dockerfile, your database, and your Redis out of the box.

No glue code, no adapters, no translating between your stack and your platform. Just push your code and Slipway handles the rest — with push-to-deploy, automatic SSL, preview environments, database management, background jobs monitoring, and a full operational dashboard all running on your own server.
:::

## Install Slipway

Run the install script on your server (a VPS, dedicated server, or any Linux machine with Docker):

```bash
curl -fsSL https://raw.githubusercontent.com/sailscastshq/slipway/main/install.sh | bash
```

Once installed, open your Slipway dashboard and complete the setup wizard.

::: info
See the full [server installation guide](/slipway/server-installation) and [system requirements](/slipway/requirements) in the Slipway docs.
:::

## Create a project

In your Slipway dashboard, [create a new project](/slipway/creating-projects). This gives you a production environment and a place to manage your app's deployments, services, and domains.

## Follow the deployment checklist

Once your project is created, link it to your local codebase using the Slipway CLI:

```bash
slipway link <project>
```

Slipway reads your app's `package.json` and generates a **deployment checklist** tailored to your app. It detects what your app actually needs and tells you exactly what's missing:

- **Database required** — Slipway sees `sails-postgresql` (or `sails-mysql`, `sails-mongo`) in your dependencies and warns you if no database service is running
- **Redis required** — Slipway detects `@sailshq/connect-redis` and warns you if Redis isn't set up for session storage
- **SESSION_SECRET missing** — warns you if your app doesn't have a secure session secret, with a one-click **Generate** button to create one

Each checklist item comes with an actionable button — **Add database**, **Add Redis**, **Generate** — so you can fix issues directly from the checklist without hunting through settings. Once everything is configured, the checklist shows a green "Environment is configured correctly" status.

::: tip No more guesswork
On other platforms, you have to remember what env vars and services your app needs and set them up manually. Slipway inspects your code and tells you what's missing — then lets you fix it in one click.
:::

## Connect your GitHub repo

1. Go to **Settings > Git** and connect your GitHub account
2. Navigate to your project's app settings and click **Connect Repository**
3. Select the repository containing your Boring Stack app
4. Choose the branch to deploy from (e.g. `main`)

Once connected, Slipway generates a deploy key and webhook automatically — every push to your configured branch triggers a deployment.

::: info
See the [Git integration guide](/slipway/git-integration) and [auto-deploy](/slipway/auto-deploy) docs for more details on push-to-deploy configuration.
:::

## Add a database

In your project's environment, click **Add Service** and select the database you need. Slipway supports [PostgreSQL, MySQL, and MongoDB](/slipway/database-services) as one-click services.

::: tip Zero configuration
When you create a database service, Slipway automatically sets `DATABASE_URL` as an environment variable on your app. No need to copy connection strings around — it just works.
:::

## Add Redis

Click **Add Service** and select **Redis**. Slipway creates a Redis container and automatically injects `REDIS_URL` into your app's environment.

## Set up database adapter

Depending on the database you chose, [set up that adapter](/boring-stack/database) in `config/env/production.js`:

::: code-group

```js [PostgreSQL]
module.exports = {
  datastores: {
    default: {
      adapter: 'sails-postgresql',
      url: process.env.DATABASE_URL
    }
  }
}
```

```js [MySQL]
module.exports = {
  datastores: {
    default: {
      adapter: 'sails-mysql',
      url: process.env.DATABASE_URL
    }
  }
}
```

```js [MongoDB]
module.exports = {
  datastores: {
    default: {
      adapter: 'sails-mongo',
      url: process.env.DATABASE_URL
    }
  }
}
```

:::

::: warning
Don't forget to install the adapter if you haven't already. See the [database](/boring-stack/database) docs for more info.
:::

## Set up Redis

Set up the Redis adapter in `config/env/production.js`:

```js
module.exports = {
  session: {
    secret: process.env.SESSION_SECRET,
    adapter: '@sailshq/connect-redis',
    url: process.env.REDIS_URL
  }
}
```

## Set environment variables

Add any additional environment variables your app needs. You can set them in two places:

- **Environment page** — in your project's environment settings, manage all env vars for that environment
- **App settings** — set app-specific env vars that override environment-level ones

The only variable you need to add manually is:

- `SESSION_SECRET`: A unique production session secret to override the one in `config/session.js`

::: info
`DATABASE_URL` and `REDIS_URL` are already set automatically when you created the database and Redis services. See the [environment variables guide](/slipway/environment-variables) for more on how Slipway manages env vars.
:::

::: info Additional environment variables
Depending on the template you're using, you may need to set additional environment variables. For example, the [Ascent template](/boring-stack/ascent) requires additional configuration for authentication, teams, and billing features.
:::

## Set up a custom domain

In your environment settings, add your [custom domain](/slipway/custom-domain). Slipway handles SSL certificates automatically via Caddy — your app will be served over HTTPS with zero configuration.

## Deploy

Push to your configured branch and Slipway takes care of the rest — it clones your repo, builds the Docker image from your Dockerfile, runs health checks, and switches traffic with zero downtime.

You can also trigger a deployment manually from the dashboard or with the [Slipway CLI](/slipway/deploy-command):

```bash
slipway slide
```

::: tip Dockerfile included
The Boring Stack templates come with a production-ready Dockerfile, so you don't need to create one manually. Slipway detects and uses it automatically.
:::

That's it! Your app will be live on your domain as soon as the build finishes :tada:

## What you get with Slipway

Beyond deployment, Slipway gives you a full operational dashboard purpose-built for your Boring Stack app:

- **[Push-to-deploy](/slipway/auto-deploy)** — automatic deployments from GitHub on every push
- **[Preview environments](/slipway/auto-deploy)** — automatic environments for pull requests
- **[Custom domains & SSL](/slipway/custom-domain)** — HTTPS via Caddy with automatic certificate management
- **[Helm](/slipway/helm)** — a production REPL to query your Waterline models and run helpers live
- **[Bridge](/slipway/bridge)** — an auto-generated admin interface for browsing and editing your data
- **[Dock](/slipway/dock)** — a database management console with SQL editor, table browser, and migrations
- **[Quest](/slipway/quest)** — monitor and manage your sails-hook-quest background jobs
- **[Content](/slipway/content)** — a visual editor for sails-content markdown collections
- **[Lookout](/slipway/lookout)** — real-time observability with request tracing, exceptions, and metrics
- **[Rollbacks](/slipway/rollbacks)** — one-click rollback to any previous deployment
- **[Notifications](/slipway/notifications)** — get alerted on deployment status, container issues, and more

## Celebrate with a :star:

::: tip Star The Boring JavaScript Stack repo on GitHub :star:
Let's celebrate deploying your app on Slipway by giving **The Boring JavaScript Stack** [a star on GitHub](https://github.com/sailscastshq/boring-stack).
:::
