---
head:
  - - meta
    - property: 'og:image'
      content: https://docs.sailscasts.com/slipway-social.png
title: Deployment Logs
titleTemplate: Slipway
description: View and understand deployment logs for debugging and monitoring.
prev:
  text: Deploy Command
  link: /slipway/deploy-command
next:
  text: Rollbacks
  link: /slipway/rollbacks
editLink: true
---

# Deployment Logs

Logs are essential for debugging deployments and monitoring your application. Slipway provides comprehensive logging at every stage.

## Types of Logs

### 1. Build Logs

Output from Docker image building:

```bash
slipway logs myapp --build
```

Includes:

- Dockerfile step execution
- `npm install` output
- Asset compilation
- Build errors

### 2. Deploy Logs

Output from the deployment process:

```bash
slipway logs myapp --deploy
```

Includes:

- Container start/stop
- Health check results
- Proxy configuration
- Deployment status changes

### 3. Application Logs

Runtime output from your Sails app:

```bash
slipway logs myapp
```

Includes:

- `sails.log.*` output
- HTTP request logs
- Error stack traces
- Custom logging

## Viewing Logs

### Current Deployment

```bash
# View recent logs
slipway logs myapp

# Stream logs in real-time
slipway logs myapp -t

# Last N lines
slipway logs myapp -n 500
```

### Specific Deployment

```bash
# View logs for a specific deployment
slipway logs myapp --deployment=abc123

# Build logs for that deployment
slipway logs myapp --deployment=abc123 --build
```

### All Deployment History

```bash
slipway deployments myapp
```

Output:

```
ID        STATUS    COMMIT     MESSAGE              DEPLOYED
def456    running   a1b2c3d    Fix payment bug      5 minutes ago
abc123    stopped   e4f5g6h    Add new feature      2 hours ago
xyz789    failed    i7j8k9l    Update deps          1 day ago
```

## Log Output

### Application Logs

```
2024-01-20T14:30:00.123Z [info] Server lifted in `production` environment
2024-01-20T14:30:00.456Z [info] Listening on port 1337
2024-01-20T14:30:01.789Z [debug] GET /api/users (200) - 45ms
2024-01-20T14:30:02.012Z [debug] POST /api/login (200) - 123ms
2024-01-20T14:30:05.345Z [warn] Rate limit approaching for IP 192.168.1.100
2024-01-20T14:30:10.678Z [error] Database connection lost, reconnecting...
```

### Build Logs

```
Step 1/8 : FROM node:22-alpine
 ---> abc123def456
Step 2/8 : WORKDIR /app
 ---> Using cache
 ---> 789ghi012jkl
Step 3/8 : COPY package*.json ./
 ---> mno345pqr678
Step 4/8 : RUN npm ci
npm WARN deprecated package@1.0.0: Use newer version
added 234 packages in 15.432s
 ---> stu901vwx234
...
Successfully built xyz567abc890
```

### Deploy Logs

```
[deploy] Starting deployment abc123
[deploy] Pulling image slipway/myapp:abc123
[deploy] Creating container myapp-abc123
[deploy] Starting container
[health] Checking http://myapp-abc123:1337/health
[health] Attempt 1/3: waiting...
[health] Attempt 2/3: waiting...
[health] Health check passed ✓
[proxy] Updating routes for myapp.example.com
[proxy] Route updated ✓
[deploy] Stopping old container myapp-def456
[deploy] Removing old container
[deploy] Deployment complete in 42s
```

## Filtering Logs

### By Log Level

```bash
# Errors only
slipway logs myapp --level=error

# Warnings and above
slipway logs myapp --level=warn

# All levels (default)
slipway logs myapp --level=debug
```

### By Time Range

```bash
# Last hour
slipway logs myapp --since=1h

# Last 24 hours
slipway logs myapp --since=24h

# Specific time range
slipway logs myapp --since="2024-01-20T10:00:00" --until="2024-01-20T12:00:00"
```

### By Search Term

```bash
# Search for specific text
slipway logs myapp --grep="error"

# Case-insensitive search
slipway logs myapp --grep="payment" -i

# Regex search
slipway logs myapp --grep="user_[0-9]+"
```

## Log Formats

### Default Format

Human-readable with colors:

```bash
slipway logs myapp
```

### JSON Format

Machine-readable for processing:

```bash
slipway logs myapp --json
```

Output:

```json
{"timestamp":"2024-01-20T14:30:00.123Z","level":"info","message":"Server lifted"}
{"timestamp":"2024-01-20T14:30:01.789Z","level":"debug","message":"GET /api/users","status":200,"duration":45}
```

### Raw Format

Unprocessed container output:

```bash
slipway logs myapp --raw
```

## Log Streaming

### Real-Time Streaming

```bash
slipway logs myapp -t
```

Features:

- Automatic reconnection
- Buffering during network issues
- Ctrl+C to stop

### Multiple Apps

In [multi-app environments](/slipway/multi-app), use `--app` to view logs for a specific app:

```bash
# View logs for the API app
slipway logs --app=api

# Stream worker logs
slipway logs --app=worker -t

# In separate terminals for all apps
slipway logs --app=web -t
slipway logs --app=api -t
slipway logs --app=worker -t
```

If `--app` is omitted, logs are shown for the default app.

## Dashboard Logs

### Viewing in Dashboard

1. Go to your project
2. Click **Logs** tab
3. Select deployment or live logs
4. Use filters and search

### Features

- Real-time streaming
- Full-text search
- Log level filtering
- Time range selection
- Download logs

## Configuring Sails Logging

### Log Levels

In `config/log.js`:

```javascript
module.exports.log = {
  // Level: 'silly', 'verbose', 'info', 'debug', 'warn', 'error', 'silent'
  level: process.env.LOG_LEVEL || 'info'
}
```

### Structured Logging

For better log parsing:

```javascript
// Use structured logging
sails.log.info('User created', { userId: user.id, email: user.email })

// Instead of
sails.log.info(`User created: ${user.id}`)
```

### Request Logging

In `config/http.js`:

```javascript
module.exports.http = {
  middleware: {
    requestLogger: function (req, res, next) {
      const start = Date.now()

      res.on('finish', () => {
        sails.log.debug({
          method: req.method,
          url: req.url,
          status: res.statusCode,
          duration: Date.now() - start
        })
      })

      next()
    },

    order: [
      'requestLogger',
      'cookieParser',
      'session',
      'bodyParser',
      'compress',
      'router',
      'www'
    ]
  }
}
```

## Log Retention

### Default Retention

| Log Type         | Retention |
| ---------------- | --------- |
| Application logs | 7 days    |
| Build logs       | 30 days   |
| Deploy logs      | 30 days   |

### Configuring Retention

In Dashboard → Settings → Logs:

- **Application logs**: 1-30 days
- **Build logs**: 1-90 days
- **Deployment logs**: 1-90 days

## Exporting Logs

### Download via CLI

```bash
# Export to file
slipway logs myapp --since=24h > logs.txt

# Export as JSON
slipway logs myapp --since=24h --json > logs.json
```

### Download via Dashboard

1. Go to Logs tab
2. Set filters
3. Click **Export**
4. Choose format (TXT, JSON, CSV)

## Troubleshooting with Logs

### Deployment Failed

```bash
# Check build logs first
slipway logs myapp --deployment=abc123 --build

# Then deploy logs
slipway logs myapp --deployment=abc123 --deploy
```

Common build errors:

- `npm ERR!` - Dependency issues
- `COPY failed` - Missing files
- `ENOMEM` - Out of memory

### Application Crashing

```bash
# Stream logs to see crash
slipway logs myapp -t

# Check recent errors
slipway logs myapp --level=error --since=1h
```

Common runtime errors:

- Database connection failures
- Missing environment variables
- Port conflicts

### Performance Issues

```bash
# Look for slow requests
slipway logs myapp --grep="duration.*[0-9]{4,}ms"

# Check for warnings
slipway logs myapp --level=warn --since=24h
```

## Integrations

### Sending to External Services

Configure log forwarding in Dashboard → Settings → Integrations:

**Supported services:**

- Datadog
- Logtail
- Papertrail
- Custom webhook

### Example: Datadog

```bash
slipway integrations:add myapp datadog \
  --api-key=your-datadog-api-key \
  --site=datadoghq.com
```

### Example: Custom Webhook

```bash
slipway integrations:add myapp webhook \
  --url=https://your-server.com/logs \
  --headers='{"Authorization": "Bearer token"}'
```

## Best Practices

### 1. Use Appropriate Log Levels

```javascript
// Production
sails.log.info('Important event')
sails.log.warn('Potential issue')
sails.log.error('Error occurred', { error: err })

// Development
sails.log.debug('Debug info')
sails.log.verbose('Verbose details')
```

### 2. Include Context

```javascript
// Good
sails.log.error('Payment failed', {
  userId: user.id,
  orderId: order.id,
  error: err.message
})

// Bad
sails.log.error('Payment failed')
```

### 3. Don't Log Sensitive Data

```javascript
// Bad
sails.log.info('User login', { password: user.password })

// Good
sails.log.info('User login', { userId: user.id, email: user.email })
```

### 4. Set LOG_LEVEL per Environment

```bash
# Production
slipway env:set myapp LOG_LEVEL=info --env=production

# Staging
slipway env:set myapp LOG_LEVEL=debug --env=staging
```

## What's Next?

- Learn about [Rollbacks](/slipway/rollbacks) when issues occur
- Configure [Auto-Deploy](/slipway/auto-deploy) for CI/CD
- Set up [Helm](/slipway/helm) for live debugging
