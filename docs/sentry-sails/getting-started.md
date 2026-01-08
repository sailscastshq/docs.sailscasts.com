---
title: Getting started
editLink: true
next:
  text: 'Configuration'
  link: '/sentry-sails/configuration'
---

# Getting Started

Sentry Sails is a Sails hook that integrates [Sentry](https://sentry.io) error tracking and performance monitoring into your Sails.js applications.

## Installation

Install the package via npm:

```bash
npm install sentry-sails
```

## Configuration

### Using Environment Variables

The simplest way to configure Sentry Sails is via the `SENTRY_DSN` environment variable:

```bash
SENTRY_DSN=https://your-dsn@sentry.io/project
```

That's it! The hook will automatically initialize Sentry when your Sails app lifts.

### Using Configuration File

For more control, create a `config/sentry.js` file:

```javascript
module.exports.sentry = {
  dsn: process.env.SENTRY_DSN
}
```

## Verify Installation

Once configured, you should see the following log message when your Sails app starts:

```
info: sentry-sails: Initialized successfully
```

To test that errors are being captured, you can trigger a test error:

```javascript
// In any controller or action
throw new Error('Test Sentry error')
```

Check your Sentry dashboard to confirm the error was captured.

## Requirements

- Node.js >= 18.0.0
- Sails.js >= 1.0.0

## Next Steps

- Learn about [configuration options](/sentry-sails/configuration)
- See how to [capture errors manually](/sentry-sails/capturing-errors)
- Add [user context and breadcrumbs](/sentry-sails/context)
