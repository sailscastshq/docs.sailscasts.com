---
head:
  - - meta
    - property: 'og:image'
      content: https://docs.sailscasts.com/slipway-social.png
title: Project Configuration
titleTemplate: Slipway
description: Configure project-specific settings for deployment and runtime behavior.
prev:
  text: Creating Projects
  link: /slipway/creating-projects
next:
  text: Git Integration
  link: /slipway/git-integration
editLink: true
---

# Project Configuration

Each project in Slipway can be customized with specific deployment and runtime settings.

## Viewing Configuration

### Via CLI

```bash
slipway project:info myapp
```

Output:

```
Project: My Sails App
Slug: my-sails-app
Created: January 15, 2024

Configuration:
  Auto-Deploy: enabled
  Deploy Branch: main
  Health Check Path: /health
  Health Check Timeout: 30s
  Deploy Timeout: 10m

Environments:
  production
    Domain: myapp.example.com
    Status: running
  staging
    Domain: staging.myapp.example.com
    Status: running
```

### Via Dashboard

1. Go to your project
2. Click **Settings**
3. View current configuration

## Updating Configuration

### Via CLI

```bash
slipway project:update myapp \
  --auto-deploy=true \
  --auto-deploy-branch=main \
  --health-check-path=/health \
  --health-check-timeout=45s \
  --deploy-timeout=15m
```

### Via Dashboard

1. Go to your project → **Settings**
2. Modify settings
3. Click **Save Changes**

## Configuration Options

### General Settings

| Option        | Description         | Default             |
| ------------- | ------------------- | ------------------- |
| `name`        | Display name        | From `package.json` |
| `slug`        | URL identifier      | Auto-generated      |
| `description` | Project description | Empty               |

### Deployment Settings

| Option          | CLI Flag               | Description            | Default        |
| --------------- | ---------------------- | ---------------------- | -------------- |
| Auto-Deploy     | `--auto-deploy`        | Enable webhook deploys | `false`        |
| Deploy Branch   | `--auto-deploy-branch` | Branch to deploy from  | `main`         |
| Dockerfile Path | `--dockerfile`         | Path to Dockerfile     | `./Dockerfile` |
| Build Context   | `--build-context`      | Docker build context   | `.`            |

### Health Check Settings

| Option   | CLI Flag                  | Description          | Default |
| -------- | ------------------------- | -------------------- | ------- |
| Path     | `--health-check-path`     | Health check URL     | `/`     |
| Timeout  | `--health-check-timeout`  | Max wait time        | `30s`   |
| Interval | `--health-check-interval` | Check frequency      | `5s`    |
| Retries  | `--health-check-retries`  | Attempts before fail | `3`     |

### Resource Settings

| Option   | CLI Flag     | Description            | Default |
| -------- | ------------ | ---------------------- | ------- |
| Memory   | `--memory`   | Container memory limit | `512m`  |
| CPU      | `--cpu`      | CPU shares             | `1.0`   |
| Replicas | `--replicas` | Number of instances    | `1`     |

### Timeout Settings

| Option          | CLI Flag            | Description         | Default |
| --------------- | ------------------- | ------------------- | ------- |
| Deploy Timeout  | `--deploy-timeout`  | Max deploy duration | `10m`   |
| Build Timeout   | `--build-timeout`   | Max build duration  | `15m`   |
| Startup Timeout | `--startup-timeout` | Max container start | `60s`   |

## Environment-Specific Configuration

Each environment can have its own settings:

```bash
# Production settings
slipway project:update myapp --env=production \
  --memory=1g \
  --replicas=2 \
  --health-check-path=/health

# Staging settings (less resources)
slipway project:update myapp --env=staging \
  --memory=256m \
  --replicas=1
```

## The Dockerfile

Your Dockerfile controls how the app is built:

### Basic Dockerfile

```dockerfile
FROM node:22-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --production

COPY . .

EXPOSE 1337

CMD ["node", "app.js"]
```

### Multi-Stage Dockerfile

```dockerfile
# Build stage
FROM node:22-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Production stage
FROM node:22-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --production
COPY --from=builder /app/.tmp/public ./.tmp/public
COPY --from=builder /app/api ./api
COPY --from=builder /app/config ./config
COPY --from=builder /app/views ./views
COPY --from=builder /app/app.js ./
EXPOSE 1337
CMD ["node", "app.js"]
```

### Custom Dockerfile Location

```bash
slipway project:update myapp --dockerfile=docker/production.Dockerfile
```

::: tip Per-App Dockerfiles
In [multi-app environments](/slipway/multi-app), each app can have its own Dockerfile path. Configure it on the app settings page or when creating an app. This lets you use `Dockerfile` for the web app and `Dockerfile.worker` for a background worker, for example.
:::

## Build Arguments

Pass build-time arguments:

### Setting Build Args

```bash
slipway project:update myapp \
  --build-arg NODE_VERSION=22 \
  --build-arg BUILD_DATE=$(date -u +%Y-%m-%dT%H:%M:%SZ)
```

### Using in Dockerfile

```dockerfile
ARG NODE_VERSION=22
FROM node:${NODE_VERSION}-alpine

ARG BUILD_DATE
LABEL build-date=${BUILD_DATE}
```

## Port Configuration

### Default Port

Sails apps typically use port 1337. Slipway sets `PORT=1337` automatically.

### Custom Port

If your app uses a different port:

```bash
slipway project:update myapp --port=3000
```

Or set via environment variable:

```bash
slipway env:set myapp PORT=3000
```

## Healthcheck Configuration

### Custom Health Endpoint

Create a dedicated health check endpoint:

```javascript
// api/controllers/health/check.js
module.exports = {
  fn: async function () {
    // Check database
    await User.count()

    // Check external services
    // await redis.ping();

    return {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      version: sails.config.custom.version
    }
  }
}
```

### Configure in Slipway

```bash
slipway project:update myapp \
  --health-check-path=/health/check \
  --health-check-timeout=10s
```

### Health Check Response

Slipway considers these responses healthy:

- HTTP 200-299 status
- Response within timeout

## .slipway.json

The `.slipway.json` file links your repo to the project:

```json
{
  "project": "my-sails-app",
  "projectId": 1
}
```

### Extended Configuration

You can add local overrides:

```json
{
  "project": "my-sails-app",
  "projectId": 1,
  "defaults": {
    "environment": "staging"
  }
}
```

Now `slipway slide` deploys to staging by default.

## sails-hook-slipway Configuration

For apps using the Slipway hook:

```javascript
// config/slipway.js
module.exports.slipway = {
  // Bridge (admin panel)
  bridge: {
    enabled: true,
    path: '/slipway/bridge',
    roles: ['admin']
  },

  // Helm (REPL)
  helm: {
    enabled: true,
    path: '/slipway/helm',
    readOnly: process.env.NODE_ENV === 'production'
  },

  // Quest dashboard (if sails-quest installed)
  quest: {
    enabled: true,
    path: '/slipway/quest'
  },

  // Telemetry
  telemetry: {
    enabled: process.env.SLIPWAY_URL ? true : false,
    serverUrl: process.env.SLIPWAY_URL
  }
}
```

## Validation

Slipway validates configuration before saving:

### Common Validation Errors

**Invalid health check path:**

```
Error: Health check path must start with /
```

**Invalid timeout format:**

```
Error: Invalid timeout format. Use: 30s, 5m, 1h
```

**Invalid memory format:**

```
Error: Invalid memory format. Use: 256m, 1g, 2g
```

## Best Practices

### 1. Use Health Checks

Always configure a proper health check:

```bash
slipway project:update myapp --health-check-path=/health
```

### 2. Set Appropriate Timeouts

Don't use defaults blindly:

```bash
# Fast app - shorter timeouts
slipway project:update myapp --deploy-timeout=5m --health-check-timeout=15s

# Slow startup - longer timeouts
slipway project:update myapp --deploy-timeout=20m --startup-timeout=120s
```

### 3. Environment-Specific Resources

```bash
# Production - more resources
slipway project:update myapp --env=production --memory=1g --cpu=2

# Staging - less resources
slipway project:update myapp --env=staging --memory=256m --cpu=0.5
```

### 4. Document Configuration

Add comments in your Dockerfile:

```dockerfile
# Build stage for asset compilation
FROM node:22-alpine AS builder
# ... build steps with explanation ...

# Production stage - minimal image
FROM node:22-alpine
# Why we use these specific commands...
```

## What's Next?

- Set up [Git Integration](/slipway/git-integration) for deployments
- Configure [Auto-Deploy](/slipway/auto-deploy) for CI/CD
- Learn [How Deployments Work](/slipway/how-deployments-work)
