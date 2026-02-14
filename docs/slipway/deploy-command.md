---
head:
  - - meta
    - property: 'og:image'
      content: https://docs.sailscasts.com/slipway-social.png
title: Deploy Command
titleTemplate: Slipway
description: Learn how to use the slipway slide command to deploy your applications.
prev:
  text: How Deployments Work
  link: /slipway/how-deployments-work
next:
  text: Deployment Logs
  link: /slipway/deployment-logs
editLink: true
---

# Deploy Command

The `slipway slide` command deploys your Sails application to production. It's the primary way to get your code running.

## Basic Usage

```bash
cd my-sails-app
slipway slide
```

This deploys to the default environment (usually `production`).

## Command Aliases

All these commands do the same thing:

```bash
slipway slide      # Primary - "slide into production"
slipway deploy     # Alias
slipway launch     # Alias
```

## Options

### Environment

Deploy to a specific environment:

```bash
# Deploy to staging
slipway slide --env=staging

# Deploy to production (explicit)
slipway slide --env=production
```

### App

In [multi-app environments](/slipway/multi-app), target a specific app by slug:

```bash
# Deploy the API app
slipway slide --app=api

# Deploy the worker app to staging
slipway slide --env=staging --app=worker
```

If omitted, the default app in the environment is deployed.

### Message

Add a deployment message:

```bash
slipway slide --message="Fix login bug"
slipway slide -m "Add new feature"
```

This message appears in deployment history.

### Force Rebuild

Ignore Docker cache and rebuild everything:

```bash
slipway slide --no-cache
```

Useful when:

- Dependencies changed but `package-lock.json` didn't
- Build is behaving unexpectedly
- Base image updated

### Dry Run

See what would happen without actually deploying:

```bash
slipway slide --dry-run
```

Output:

```
Dry run - no changes will be made

Would deploy:
  Project: my-sails-app
  Environment: production
  Source: 15 files (2.3 MB)
  Dockerfile: ./Dockerfile

Steps:
  1. Package source code
  2. Upload to server
  3. Build Docker image
  4. Run health checks
  5. Switch traffic
  6. Remove old container
```

### Verbose Output

See detailed output:

```bash
slipway slide --verbose
```

Shows:

- Full Docker build output
- Container logs during startup
- Health check details

### Quiet Mode

Minimal output:

```bash
slipway slide --quiet
slipway slide -q
```

Only shows errors and the final URL.

## Output

### Normal Output

```bash
$ slipway slide

  Sliding my-sails-app into production

  ✓ Packaging source (2.3 MB)
  ✓ Uploading to server
  ✓ Building image (slipway/myapp:abc123)
  ✓ Starting container
  ✓ Health check passed
  ✓ Updating routes

  ✓ Deployment successful

  Deployment ID: abc123
  URL: https://myapp.example.com
  Duration: 1m 42s
```

### Verbose Output

```bash
$ slipway slide --verbose

  Sliding my-sails-app into production

  ▶ Packaging source...
    → Using git archive (respects .gitignore)
    → Files: api/, config/, views/, app.js, Dockerfile, package.json
    → Archive: 2.3 MB
    ✓ Package created

  ▶ Uploading to server...
    → Server: https://slipway.example.com
    → Progress: 100%
    ✓ Upload complete (1.2s)

  ▶ Building image...
    → docker build -t slipway/myapp:abc123 .
    Step 1/8 : FROM node:22-alpine
     ---> abc123def456
    Step 2/8 : WORKDIR /app
     ---> Using cache
    ...
    Successfully built xyz789
    ✓ Image built (45s)

  ▶ Starting container...
    → docker run -d --name myapp-abc123 slipway/myapp:abc123
    → Container ID: container123
    ✓ Container started

  ▶ Running health check...
    → GET http://myapp-abc123:1337/health
    → Attempt 1/3: waiting...
    → Attempt 2/3: 200 OK (healthy)
    ✓ Health check passed (12s)

  ▶ Switching traffic...
    → Updating Caddy routes
    → myapp.example.com → myapp-abc123:1337
    ✓ Traffic switched

  ▶ Cleaning up...
    → Stopping old container myapp-def456
    → Removing old container
    ✓ Cleanup complete

  ✓ Deployment successful

  Deployment ID: abc123
  URL: https://myapp.example.com
  Duration: 1m 42s
```

## Exit Codes

| Code | Meaning              |
| ---- | -------------------- |
| `0`  | Success              |
| `1`  | General error        |
| `2`  | Build failed         |
| `3`  | Health check failed  |
| `4`  | Upload failed        |
| `5`  | Authentication error |

Use in scripts:

```bash
slipway slide && echo "Deploy succeeded" || echo "Deploy failed"
```

## Environment Variables

### Required Configuration

The CLI needs to know your server:

```bash
# Option 1: Login (stores credentials)
slipway login

# Option 2: Environment variables
export SLIPWAY_SERVER=https://slipway.example.com
export SLIPWAY_TOKEN=your-api-token
slipway slide
```

### CI/CD Example

```yaml
# .github/workflows/deploy.yml
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Install Slipway CLI
        run: npm install -g slipway

      - name: Deploy
        env:
          SLIPWAY_SERVER: ${{ secrets.SLIPWAY_SERVER }}
          SLIPWAY_TOKEN: ${{ secrets.SLIPWAY_TOKEN }}
        run: slipway slide --message "Deploy from GitHub Actions"
```

## Common Workflows

### Deploy and Watch Logs

```bash
slipway slide && slipway logs myapp -t
```

### Deploy with Test First

```bash
npm test && slipway slide
```

### Deploy to Staging, Then Production

```bash
# Deploy to staging
slipway slide --env=staging

# Test staging manually...

# Deploy to production
slipway slide --env=production
```

### Rollback on Failure

```bash
slipway slide || slipway rollback myapp
```

## Troubleshooting

### "Project Not Found"

```bash
slipway slide
# Error: Project not found. Run 'slipway init' first.
```

**Solution:**

```bash
# Check if .slipway.json exists
cat .slipway.json

# If not, initialize
slipway init

# Or link to existing project
slipway link my-project-slug
```

### "Not Authenticated"

```bash
slipway slide
# Error: Not authenticated. Run 'slipway login' first.
```

**Solution:**

```bash
slipway login
```

### "Build Failed"

```bash
slipway slide
# Error: Build failed at step 4
```

**Solution:**

1. Check build logs:

   ```bash
   slipway logs myapp --build
   ```

2. Test locally:

   ```bash
   docker build -t test .
   ```

3. Common fixes:
   - Check `package-lock.json` is committed
   - Verify Dockerfile syntax
   - Check for missing files

### "Health Check Failed"

```bash
slipway slide
# Error: Health check failed after 3 attempts
```

**Solution:**

1. Check app logs:

   ```bash
   slipway logs myapp
   ```

2. Test health endpoint locally:

   ```bash
   curl http://localhost:1337/health
   ```

3. Common fixes:
   - Ensure app starts within timeout
   - Check database connections
   - Verify environment variables

### "Upload Failed"

```bash
slipway slide
# Error: Upload failed: connection refused
```

**Solution:**

1. Check server is accessible:

   ```bash
   curl https://slipway.example.com/health
   ```

2. Check your network connection

3. Verify server URL:
   ```bash
   slipway whoami
   ```

## Best Practices

### 1. Always Use Messages

```bash
slipway slide -m "Fix payment processing"
```

Makes deployment history meaningful.

### 2. Check Status Before Deploying

```bash
slipway app:status myapp
slipway slide
```

### 3. Use --dry-run for Important Deploys

```bash
slipway slide --dry-run --env=production
# Review output, then:
slipway slide --env=production
```

### 4. Script Complex Deployments

```bash
#!/bin/bash
# deploy.sh

set -e

echo "Running tests..."
npm test

echo "Deploying to staging..."
slipway slide --env=staging -m "$1"

echo "Waiting for staging to be ready..."
sleep 30

echo "Running smoke tests..."
curl -f https://staging.myapp.example.com/health

echo "Deploying to production..."
slipway slide --env=production -m "$1"

echo "Done!"
```

Usage:

```bash
./deploy.sh "New feature release"
```

## What's Next?

- View [Deployment Logs](/slipway/deployment-logs) for debugging
- Set up [Rollbacks](/slipway/rollbacks) for quick recovery
- Configure [Auto-Deploy](/slipway/auto-deploy) for CI/CD
