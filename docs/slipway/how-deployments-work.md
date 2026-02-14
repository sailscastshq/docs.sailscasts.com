---
head:
  - - meta
    - property: 'og:image'
      content: https://docs.sailscasts.com/slipway-social.png
title: How Deployments Work
titleTemplate: Slipway
description: Understand what happens when you deploy your Sails application with Slipway.
prev:
  text: Git Integration
  link: /slipway/git-integration
next:
  text: Deploy Command
  link: /slipway/deploy-command
editLink: true
---

# How Deployments Work

Understanding the deployment process helps you debug issues and optimize your workflow.

## The Deployment Pipeline

When you run `slipway slide`, here's what happens:

```
┌──────────────┐    ┌──────────────┐    ┌──────────────┐
│   Package    │ -> │    Build     │ -> │    Push      │
│   Source     │    │    Image     │    │   to Server  │
└──────────────┘    └──────────────┘    └──────────────┘
                                               │
                                               ▼
┌──────────────┐    ┌──────────────┐    ┌──────────────┐
│   Update     │ <- │    Start     │ <- │    Stop      │
│   Proxy      │    │    New       │    │    Old       │
└──────────────┘    └──────────────┘    └──────────────┘
```

## Step-by-Step

### 1. Package Source Code

```bash
$ slipway slide

  ▶ Packaging source...
    → Creating archive from git (respects .gitignore)
    → Archive size: 2.3 MB
```

Slipway packages your code using `git archive`:

- Only tracked files are included
- `.gitignore` is respected
- `node_modules/` is excluded (installed during build)
- Untracked files are excluded

### 2. Upload to Server

```bash
  ▶ Uploading to server...
    → Uploading slipway-myapp-abc123.tar.gz
    → Upload complete (2.3 MB in 1.2s)
```

The archive is uploaded to your Slipway server via HTTPS.

### 3. Build Docker Image

```bash
  ▶ Building image...
    → docker build -t slipway/myapp:abc123 .
    → Step 1/8: FROM node:22-alpine
    → Step 2/8: WORKDIR /app
    → Step 3/8: COPY package*.json ./
    → Step 4/8: RUN npm ci
    → Step 5/8: COPY . .
    → Step 6/8: RUN npm run build
    → Step 7/8: EXPOSE 1337
    → Step 8/8: CMD ["node", "app.js"]
    → Image built: slipway/myapp:abc123 (245 MB)
```

Slipway builds a Docker image using your `Dockerfile`:

- Dependencies installed with `npm ci`
- Assets compiled (if using Shipwright/Vite)
- Image tagged with deployment ID

### 4. Stop Old Container (Zero-Downtime)

```bash
  ▶ Starting zero-downtime deployment...
    → Starting new container alongside old...
```

For zero-downtime deploys:

1. New container starts alongside old
2. Health checks run on new container
3. Once healthy, traffic switches
4. Old container stops

### 5. Start New Container

```bash
  ▶ Starting new container...
    → docker run -d --name myapp slipway/myapp:abc123
    → Container started: myapp-abc123
    → Waiting for health check...
    → Health check passed ✓
```

The new container:

- Connects to the Slipway network
- Receives environment variables
- Links to database services
- Starts the Sails application

### 6. Update Proxy Routes

```bash
  ▶ Updating proxy routes...
    → Configuring Caddy for myapp.example.com
    → Route updated ✓
```

Caddy is updated to route traffic to the new container:

- Domain → New container port
- WebSocket support enabled
- SSL termination active

### 7. Cleanup

```bash
  ▶ Cleaning up...
    → Stopping old container
    → Removing old container
    → Keeping last 10 images for rollback

  ✓ Deployed myapp (abc123) in 42s
    https://myapp.example.com
```

## The Dockerfile

Slipway requires a `Dockerfile` in your project root. Here's a recommended structure for Sails apps:

### Basic Dockerfile

```dockerfile
FROM node:22-alpine

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm ci --production

# Copy application
COPY . .

# Expose Sails port
EXPOSE 1337

# Start the application
CMD ["node", "app.js"]
```

### Production Dockerfile (with build step)

```dockerfile
# Build stage
FROM node:22-alpine AS builder

WORKDIR /app

# Install all dependencies (including devDependencies)
COPY package*.json ./
RUN npm ci

# Copy source
COPY . .

# Build assets (Shipwright, Vite, etc.)
RUN npm run build

# Production stage
FROM node:22-alpine

WORKDIR /app

# Install tini for proper signal handling
RUN apk add --no-cache tini

# Install production dependencies only
COPY package*.json ./
RUN npm ci --production

# Copy built assets and application
COPY --from=builder /app/.tmp/public ./.tmp/public
COPY --from=builder /app/api ./api
COPY --from=builder /app/config ./config
COPY --from=builder /app/views ./views
COPY --from=builder /app/app.js ./

# Create non-root user
RUN addgroup -g 1001 -S sails && \
    adduser -S sails -u 1001 -G sails
USER sails

EXPOSE 1337

# Use tini as init
ENTRYPOINT ["/sbin/tini", "--"]
CMD ["node", "app.js"]
```

### Key Dockerfile Best Practices

1. **Use Alpine for smaller images**

   ```dockerfile
   FROM node:22-alpine  # ~180MB vs ~1GB for full node
   ```

2. **Leverage layer caching**

   ```dockerfile
   COPY package*.json ./
   RUN npm ci
   COPY . .  # Source changes don't invalidate npm cache
   ```

3. **Use tini for signal handling**

   ```dockerfile
   RUN apk add --no-cache tini
   ENTRYPOINT ["/sbin/tini", "--"]
   ```

4. **Run as non-root**

   ```dockerfile
   USER sails
   ```

5. **Set NODE_ENV**
   ```dockerfile
   ENV NODE_ENV=production
   ```

## Environment Variables

During deployment, Slipway injects environment variables using a three-tier cascade:

### Variable Cascade

Variables are merged in order, with later levels overriding earlier ones:

1. **Global variables** — shared across all apps (set in Settings)
2. **Environment variables** — per environment (set via `slipway env:set`)
3. **App variables** — per app ([multi-app environments](/slipway/multi-app) only)

### Built-in Variables

| Variable                | Description              |
| ----------------------- | ------------------------ |
| `PORT`                  | Port to listen on (1337) |
| `NODE_ENV`              | Environment (production) |
| `SLIPWAY_APP`           | App name                 |
| `SLIPWAY_ENV`           | Environment name         |
| `SLIPWAY_DEPLOYMENT_ID` | Current deployment ID    |

### Your Variables

Variables set via `slipway env:set` are also injected:

```bash
DATABASE_URL=postgres://...
SESSION_SECRET=...
STRIPE_KEY=...
```

### Linked Services

When you link a database, Slipway sets:

```bash
DATABASE_URL=postgres://user:pass@host:5432/db
REDIS_URL=redis://host:6379
```

## Health Checks

Slipway checks your app is healthy before routing traffic:

### Default Health Check

Slipway checks the root URL returns 200:

```bash
curl http://container:1337/
```

### Custom Health Check

Configure a dedicated health endpoint:

```javascript
// api/controllers/health/check.js
module.exports = {
  fn: async function () {
    // Check database
    await User.count()

    // Check Redis (if used)
    // await sails.helpers.cache.get('health');

    return { status: 'healthy', timestamp: new Date() }
  }
}
```

Then configure in Slipway:

```bash
slipway project:update myapp --health-check-path=/health/check
```

### Health Check Settings

| Setting  | Default | Description             |
| -------- | ------- | ----------------------- |
| Path     | `/`     | URL to check            |
| Timeout  | 30s     | Max wait for response   |
| Interval | 5s      | Time between checks     |
| Retries  | 3       | Attempts before failing |

## Zero-Downtime Deployment

Slipway achieves zero-downtime through:

### 1. Rolling Deployment

```
Time 0:  [Old Container] ← Traffic
Time 1:  [Old Container] ← Traffic
         [New Container] starting...
Time 2:  [Old Container]
         [New Container] health check...
Time 3:               → [New Container] ← Traffic
         [Old Container] stopping...
Time 4:               → [New Container] ← Traffic
```

### 2. Connection Draining

Before stopping the old container:

- Existing connections are allowed to complete
- New connections go to new container
- Grace period: 30 seconds

### 3. Graceful Shutdown

Sails apps should handle `SIGTERM`:

```javascript
// app.js or config/bootstrap.js
process.on('SIGTERM', async () => {
  sails.log.info('Received SIGTERM, shutting down gracefully...')

  // Close database connections
  await sails.lower()

  process.exit(0)
})
```

## Build Caching

Slipway caches Docker layers for faster builds:

### Cached Layers

- Base image (`FROM node:22-alpine`)
- Dependencies (`npm ci` layer)

### Cache Invalidation

Cache is invalidated when:

- `package.json` or `package-lock.json` changes
- Dockerfile changes
- Base image updates

### Forcing Fresh Build

```bash
slipway slide --no-cache
```

## Build Logs

View build logs for debugging:

```bash
# During deployment
slipway slide  # Logs stream automatically

# After deployment
slipway logs myapp --deployment=abc123 --build
```

### Common Build Errors

**npm install fails:**

```
npm ERR! code ERESOLVE
```

Fix: Check `package-lock.json` is committed

**Build step fails:**

```
Error: Cannot find module 'vite'
```

Fix: Ensure build tools are in `dependencies`, not `devDependencies`

**Out of memory:**

```
FATAL ERROR: Heap out of memory
```

Fix: Add `--max-old-space-size` or use multi-stage build

## Deployment History

View past deployments:

```bash
slipway deployments myapp
```

Output:

```
ID        STATUS    COMMIT     MESSAGE              DEPLOYED
abc123    running   a1b2c3d    Fix payment bug      2 minutes ago
def456    stopped   e4f5g6h    Add feature          2 hours ago
ghi789    stopped   i7j8k9l    Update deps          1 day ago
```

Each deployment keeps:

- Docker image (for rollback)
- Build logs
- Deploy logs
- Git commit info

## Troubleshooting

### Deployment Stuck

```bash
# Check deployment status
slipway deployment:status myapp

# View logs
slipway logs myapp --deployment=current
```

### Container Won't Start

```bash
# Check container logs
slipway logs myapp

# Common issues:
# - Missing environment variables
# - Database not connected
# - Port already in use
```

### Health Check Failing

```bash
# Test health endpoint manually
curl https://myapp.example.com/health/check

# Check app logs
slipway logs myapp -t
```

## Multi-App Deployments

Slipway supports running [multiple apps](/slipway/multi-app) in a single environment — for example, a web server and a background worker, or a frontend and API.

Each app in an environment:

- Has its own `Dockerfile` (configurable per app, default: `Dockerfile`)
- Runs in its own Docker container with a unique name
- Gets its own deployment record and build/deploy logs
- Receives the merged environment variables plus any app-specific overrides

When you deploy with `slipway slide`, the **default app** is deployed. To target a specific app:

```bash
slipway slide --app=worker
```

When a webhook triggers an auto-deploy, **all apps** in the environment are deployed — each gets its own container rebuild and deployment record.

See [Multi-App Environments](/slipway/multi-app) for the full guide.

## What's Next?

- Learn the [Deploy Command](/slipway/deploy-command) options
- View [Deployment Logs](/slipway/deployment-logs) for debugging
- Set up [Auto-Deploy](/slipway/auto-deploy) for CI/CD
