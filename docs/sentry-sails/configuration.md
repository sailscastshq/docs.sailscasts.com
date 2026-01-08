---
title: Configuration
editLink: true
prev:
  text: 'Getting Started'
  link: '/sentry-sails/getting-started'
next:
  text: 'Capturing Errors'
  link: '/sentry-sails/capturing-errors'
---

# Configuration

Sentry Sails can be configured via environment variables or a configuration file.

## Configuration File

Create `config/sentry.js` in your Sails application:

```javascript
module.exports.sentry = {
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV || 'development',
  tracesSampleRate: 1.0,
  profilesSampleRate: 1.0,
  sendDefaultPii: true
}
```

## Options

| Option               | Type    | Default                      | Description                                      |
| -------------------- | ------- | ---------------------------- | ------------------------------------------------ |
| `dsn`                | string  | `process.env.SENTRY_DSN`     | Your Sentry Data Source Name                     |
| `environment`        | string  | `process.env.NODE_ENV`       | Environment name (e.g., 'production', 'staging') |
| `release`            | string  | `process.env.SENTRY_RELEASE` | Release version for tracking deployments         |
| `tracesSampleRate`   | number  | `1.0`                        | Sample rate for performance tracing (0.0 to 1.0) |
| `profilesSampleRate` | number  | `1.0`                        | Sample rate for profiling (0.0 to 1.0)           |
| `sendDefaultPii`     | boolean | `true`                       | Capture request headers and IP addresses         |

## DSN Resolution

The hook resolves the DSN in the following order:

1. `sails.config.sentry.dsn` (from `config/sentry.js`)
2. `SENTRY_DSN` environment variable

If neither is set, the hook will log a warning and skip initialization.

## Sample Rates

### Traces Sample Rate

Controls what percentage of requests are traced for performance monitoring:

```javascript
module.exports.sentry = {
  dsn: process.env.SENTRY_DSN,
  // Trace 10% of requests in production
  tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0
}
```

### Profiles Sample Rate

Controls profiling frequency (relative to traced requests):

```javascript
module.exports.sentry = {
  dsn: process.env.SENTRY_DSN,
  tracesSampleRate: 0.1,
  // Profile 50% of traced requests
  profilesSampleRate: 0.5
}
```

## Environment-Specific Configuration

You can create environment-specific configuration files:

**config/env/production.js**

```javascript
module.exports.sentry = {
  tracesSampleRate: 0.1,
  profilesSampleRate: 0.1
}
```

**config/env/development.js**

```javascript
module.exports.sentry = {
  tracesSampleRate: 1.0,
  profilesSampleRate: 1.0
}
```

## Releases

Track deployments by setting a release version:

```javascript
module.exports.sentry = {
  dsn: process.env.SENTRY_DSN,
  release: process.env.SENTRY_RELEASE || 'v1.0.0'
}
```

Or set via environment variable:

```bash
SENTRY_RELEASE=v1.2.3
```

Releases help you:

- Track which version introduced a bug
- See regression data across deployments
- Associate source maps with specific versions

See [Source Maps](/sentry-sails/source-maps) for uploading source maps tied to releases.

## Additional Sentry Options

Any additional options passed to `config/sentry.js` are forwarded to `Sentry.init()`:

```javascript
module.exports.sentry = {
  dsn: process.env.SENTRY_DSN,
  maxBreadcrumbs: 50,
  debug: process.env.NODE_ENV === 'development'
}
```

See the [Sentry Node.js SDK documentation](https://docs.sentry.io/platforms/javascript/guides/node/configuration/options/) for all available options.
