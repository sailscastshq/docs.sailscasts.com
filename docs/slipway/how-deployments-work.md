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

Every deployment—CLI, Git, dashboard, API, or Content—enters the same coordinated pipeline:

```
Source readiness → Queue → Build image → Start candidate
       → Health check → Transactional traffic cutover → Finalize
```

Slipway keeps the current release serving traffic until the candidate is healthy and the proxy update has been verified.

## Step-by-Step

### 1. Verify source readiness

Before creating active work, Slipway confirms that the target app has deployable source:

- a connected Git repository and branch;
- a source archive previously pushed by the Slipway CLI; or
- an exact commit created by the Content Manager.

Dashboard redeploys work for both Git-connected and CLI-pushed applications. If no source is available, Slipway stops during preflight and displays the actionable reason instead of creating an unexplained failed deployment.

### 2. Queue and coordinate

Only one deployment can build or change traffic for an app at a time. Additional deployments remain **Queued** and start in order after the active deployment reaches a terminal state.

This prevents two builds, rollbacks, or proxy updates for the same app from racing each other. Different apps can still deploy independently.

Slipway records the queue and lease in its database. After a Slipway or host restart, reconciliation:

- resumes eligible queued work;
- marks interrupted work with an accurate terminal state;
- removes abandoned candidate containers and proxy transactions; and
- restores the app's status from the running Docker container.

### 3. Package or fetch source code

```bash
$ slipway slide

  ▶ Packaging source...
    → Creating archive from git (respects .gitignore)
    → Archive size: 2.3 MB
```

Slipway packages your code using `git archive`:

- Only files in committed HEAD are included
- Uncommitted edits are excluded
- Tracked files remain included even if later added to `.gitignore`
- Untracked files are excluded

### 4. Upload to Server

```bash
  ▶ Uploading to server...
    → Uploading slipway-myapp-abc123.tar.gz
    → Upload complete (2.3 MB in 1.2s)
```

The archive is uploaded to your Slipway server via HTTPS.

### 5. Build Docker Image

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

### 6. Start a candidate release

```bash
  ▶ Starting zero-downtime deployment...
    → Starting new container alongside old...
```

For zero-downtime deploys:

1. New container starts alongside old
2. Health checks run on new container
3. Once healthy, traffic switches
4. Old container stops

### 7. Verify candidate health

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

### 8. Cut over traffic transactionally

```bash
  ▶ Updating proxy routes...
    → Configuring Caddy for myapp.example.com
    → Route updated ✓
```

Caddy is updated to route traffic to the new container:

- Domain → New container port
- WebSocket support enabled
- SSL termination active

The cutover is a transaction:

1. Slipway snapshots the current route.
2. It writes the candidate route.
3. Caddy validates and reloads the configuration.
4. Slipway verifies that the expected route is active.
5. Only then does it finalize the new release and stop the previous container.

If writing, reloading, or verifying the route fails, Slipway restores the previous route and keeps the previous release serving traffic.

### 9. Cleanup

```bash
  ▶ Cleaning up...
    → Stopping old container
    → Removing old container
    → Keeping last 10 images for rollback

  ✓ Deployed myapp (abc123) in 42s
    https://myapp.example.com
```

## Cancelling a deployment

Cancelling is cooperative process termination, not only a status change. Slipway stops an active Docker build, health check, source operation, or rollback; removes candidate artifacts; releases the app's deployment lease; and starts the next queued deployment when appropriate.

If cancellation happens before traffic cutover, the current release remains untouched. If a cutover transaction has begun, Slipway restores the previous verified route before cleanup.

The deployment page records who cancelled the work and whether any candidate release was removed.

## Deployment history

Deployment history is ordered from the app's actual current and active state:

1. executing work;
2. current releases;
3. queued deployments in queue order; and
4. completed history from newest to oldest.

Each row identifies the app, status, source, actor, branch, commit, and creation time. The history updates active statuses without requiring a full page refresh.

## Prepare and verify the application

Follow [Your First Deploy](/slipway/first-deploy) for the Dockerfile, port, listening address, required variables, and configured health path. Read [Deploy Command](/slipway/deploy-command) for committed source packaging and supported flags.

After the deployment reaches a terminal state, inspect its stored output:

```bash
slipway deployments --env staging --limit 5
slipway logs --deployment DEPLOYMENT_ID
```

Verify both the expected public route and application behavior. A candidate health check does not prove every business operation is healthy. If a request times out or disconnects, inspect history before retrying; the client stopping does not cancel server work.

Use [Rollbacks](/slipway/rollbacks) to select a retained app image and [Operations and API](/slipway/operations) for recovery boundaries.
