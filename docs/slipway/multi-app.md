---
head:
  - - meta
    - property: 'og:image'
      content: https://docs.sailscasts.com/slipway-social.png
title: Multi-App Environments
titleTemplate: Slipway
description: Run multiple apps in a single environment — web servers, workers, APIs, and more.
prev:
  text: Database Services
  link: /slipway/database-services
next:
  text: Helm
  link: /slipway/helm
editLink: true
---

# Multi-App Environments

By default, each Slipway environment runs a single Sails app. Multi-app environments let you run several Sails processes side by side from the same codebase — a web server and a background worker, or the same app serving different route prefixes.

::: info All Apps Are Sails Apps
Slipway is purpose-built for [The Boring JavaScript Stack](https://docs.sailscasts.com/boring-stack/getting-started). Every app in a multi-app environment is a Sails application — they all share the same project source code and are built from the same codebase. The difference is _how_ each app is configured to run (web vs. worker, different Sails environments, different route paths).

This means all apps get full access to Slipway's platform features: [Helm](/slipway/helm) REPL, [Bridge](/slipway/bridge) admin, [Quest](/slipway/quest) job dashboard, [Dock](/slipway/dock) migrations, and more.
:::

## Why Multi-App?

Common scenarios:

- **Web + Worker** — Your Sails app handling HTTP requests, plus the same codebase lifted as a worker to process background jobs via [Quest](/slipway/quest)
- **Web + API** — The same Sails app serving the frontend at `/` and the API at `/api` with different resource limits or environment configurations
- **Main App + Admin** — Your public-facing app and a separate Sails process for admin operations

All apps in an environment share the same:

- Project source code (same Sails codebase)
- Database services (PostgreSQL, Redis, etc.)
- Environment-level variables
- Domain and SSL certificate

Each app has its own:

- Docker container (separate Sails process)
- Dockerfile (configurable per app)
- Route path (URL prefix)
- App-specific environment variables (e.g., `sails_environment`)
- Resource limits (CPU, memory)
- Deployment history

## Creating Apps

### Via Dashboard

1. Go to your project's environment page
2. In the **Apps** section, click **Add App**
3. Fill in:
   - **Name** — Human-readable name (e.g., "Worker")
   - **Dockerfile** — Path to the Dockerfile (e.g., `Dockerfile.worker`)
   - **Route Path** — URL prefix this app handles (e.g., `/api`, `/`, or none for workers)
4. Click **Create**

## App Slugs

Every app has a **slug** — a URL-safe identifier unique within its environment.

- The first (default) app always has slug `app`
- Additional apps get slugs derived from their name: "API Server" becomes `api-server`
- Slugs must match `[a-z0-9-]`
- The slug is used in CLI commands, container names, and API routes

```bash
# Deploy the default app
slipway slide

# Deploy the worker app
slipway slide --app=worker
```

## The Default App

One app per environment is marked as the **default**. This is always the first app created.

The default app is used when no `--app` flag is provided:

```bash
slipway slide           # deploys the default app
slipway logs            # shows default app logs
slipway terminal        # opens shell in default app container
```

For single-app environments, you never need to think about this — it just works.

## Route Paths

Each app can serve a URL path prefix. Slipway configures Caddy to route requests accordingly.

| Route Path | Behavior                                                   |
| ---------- | ---------------------------------------------------------- |
| `/`        | Catch-all — handles all requests not matched by other apps |
| `/api`     | Only requests starting with `/api`                         |
| `/admin`   | Only requests starting with `/admin`                       |
| `null`     | No HTTP routing — for workers and background jobs          |

### Example: Web + API

```
myapp.example.com/         → web app (routePath: "/")
myapp.example.com/api/     → api app (routePath: "/api")
```

### Example: Web + Worker

```
myapp.example.com/         → web app (routePath: "/")
worker app                 → no route (routePath: null), runs background jobs
```

More specific paths are matched first. The `/` path acts as a catch-all for anything not matched by other apps.

## Per-App Dockerfiles

Each app can use a different Dockerfile. Since all apps share the same Sails codebase, different Dockerfiles typically differ only in the `CMD` or the Sails environment they lift with:

```
my-project/
├── Dockerfile              ← default app (web)
├── Dockerfile.worker       ← worker app (same code, different CMD)
├── api/
├── config/
│   └── env/
│       ├── production.js
│       └── worker.js       ← worker-specific Sails config
└── ...
```

All Dockerfiles share the same build context (your project root), so they all `COPY` from the same source.

### Example: Worker Dockerfile

A worker runs the same Sails app but lifts with a different environment that disables HTTP listening and focuses on background job processing:

```dockerfile
FROM node:22-slim

WORKDIR /app

COPY package*.json ./
RUN npm ci --production

COPY . .

# Lift Sails in the "worker" environment
# (configure config/env/worker.js to disable HTTP, enable Quest, etc.)
ENV NODE_ENV=worker
CMD ["node", "app.js"]
```

Your `config/env/worker.js` might look like:

```javascript
module.exports = {
  port: 0, // Don't listen on HTTP
  hooks: {
    http: false, // Disable HTTP server
    session: false, // Not needed for workers
    sockets: false // Not needed for workers
  }
}
```

## Environment Variables

Apps inherit variables through a three-tier cascade:

```
Global Variables          (shared across all apps, all environments)
  └── Environment Variables   (shared across apps in this environment)
        └── App Variables         (specific to this app)
```

Later levels override earlier ones. This means:

- **Global**: S3 credentials, Sentry DSN — same everywhere
- **Environment**: `DATABASE_URL`, `SESSION_SECRET` — shared by web and worker
- **App**: `WORKER_CONCURRENCY=5` — only the worker needs this

### Setting App Variables

App-specific variables are managed on the app settings page in the dashboard. Navigate to the environment, click the app, and configure its variables.

## Deploying

### CLI

```bash
# Deploy the default app
slipway slide

# Deploy a specific app
slipway slide --app=worker

# Deploy to staging
slipway slide --env=staging --app=api
```

### Auto-Deploy (Webhooks)

When a GitHub webhook triggers a deployment, **all apps** in the environment are deployed. Each gets its own:

- Build process (using its Dockerfile)
- Container
- Deployment record with build/deploy logs

### Dashboard

The environment page shows all apps with their status. Each app has its own **Deploy** button.

## Container Naming

Slipway generates container names automatically:

| Scenario             | Container Name                        |
| -------------------- | ------------------------------------- |
| Default app (`app`)  | `slipway-myproject-production`        |
| Named app (`worker`) | `slipway-myproject-production-worker` |
| Named app (`api`)    | `slipway-myproject-production-api`    |

The default app omits the suffix for backward compatibility with single-app deployments.

## CLI Commands

All container-targeting commands support `--app`:

```bash
# Logs
slipway logs --app=worker
slipway logs --app=api --follow

# Terminal access
slipway terminal --app=worker

# Run a command
slipway run --app=worker node scripts/migrate.js

# Rollback
slipway rollback myapp --app=api
```

## Deleting an App

Delete an app via the dashboard on the app settings page. Restrictions:

- You cannot delete the **default** app
- You cannot delete the **last** app in an environment
- Deleting stops the container and removes routing

To remove an environment entirely, use the environment destroy action instead.

## Best Practices

### 1. Start Simple

Begin with a single app. Add more only when you genuinely need separate processes:

```bash
# Start with one app
slipway init
slipway slide

# Later, add a worker when needed
# (via dashboard → Add App)
```

### 2. Use Null Routes for Workers

Workers and background job processors don't serve HTTP traffic. Set their route path to `null` so they don't consume a Caddy route:

### 3. Share Database Connections

All apps in an environment automatically share the same `DATABASE_URL` and `REDIS_URL` from environment variables. No extra configuration needed.

### 4. Use App Variables Sparingly

Only set app-specific variables when they truly differ between apps. Most configuration should live at the environment level where all apps can share it.

### 5. Monitor All Apps

Use [Lookout](/slipway/settings) to monitor resource usage across all containers in an environment. A worker consuming too much memory affects the whole server.

## What's Next?

- Learn about [Environment Variables](/slipway/environment-variables) and the three-tier cascade
- Set up [Auto-Deploy](/slipway/auto-deploy) for continuous deployment
- Use [Helm](/slipway/helm) for live debugging
