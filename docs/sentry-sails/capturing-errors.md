---
title: Capturing Errors
editLink: true
prev:
  text: 'Configuration'
  link: '/sentry-sails/configuration'
next:
  text: 'Context & Breadcrumbs'
  link: '/sentry-sails/context'
---

# Capturing Errors

While Sentry Sails automatically captures unhandled errors, you can also manually capture errors and messages.

## Accessing Sentry

The Sentry SDK is available via `sails.sentry`:

```javascript
// Available globally after hook initialization
sails.sentry
```

## Capturing Exceptions

Use `captureException` to manually report errors:

```javascript
// In a controller action
module.exports = {
  fn: async function () {
    try {
      await riskyOperation()
    } catch (error) {
      sails.sentry.captureException(error)
      throw error // Re-throw to trigger your error handling
    }
  }
}
```

### With Additional Context

```javascript
try {
  await processPayment(orderId)
} catch (error) {
  sails.sentry.captureException(error, {
    tags: {
      section: 'payments'
    },
    extra: {
      orderId: orderId
    }
  })
  throw error
}
```

## Capturing Messages

Use `captureMessage` for non-error events you want to track:

```javascript
// Log an informational message
sails.sentry.captureMessage('User completed onboarding')

// With severity level
sails.sentry.captureMessage('Payment retry attempted', 'warning')
```

### Severity Levels

- `fatal` - Application crash
- `error` - Error condition
- `warning` - Warning condition
- `info` - Informational message
- `debug` - Debug information

## Scoped Error Capture

Use `withScope` to add context to a specific error:

```javascript
sails.sentry.withScope((scope) => {
  scope.setTag('transaction', 'checkout')
  scope.setLevel('error')
  scope.setExtra('cart', cartItems)

  sails.sentry.captureException(new Error('Checkout failed'))
})
```

## Helper Pattern

Create a helper for consistent error capture:

**api/helpers/capture-error.js**

```javascript
module.exports = {
  friendlyName: 'Capture error',

  inputs: {
    error: {
      type: 'ref',
      required: true
    },
    context: {
      type: 'ref',
      defaultsTo: {}
    }
  },

  fn: async function ({ error, context }) {
    sails.sentry.withScope((scope) => {
      if (context.tags) {
        Object.entries(context.tags).forEach(([key, value]) => {
          scope.setTag(key, value)
        })
      }
      if (context.extra) {
        scope.setExtras(context.extra)
      }
      if (context.user) {
        scope.setUser(context.user)
      }
      sails.sentry.captureException(error)
    })
  }
}
```

Usage:

```javascript
await sails.helpers.captureError(error, {
  tags: { feature: 'checkout' },
  extra: { orderId: order.id },
  user: { id: req.session.userId }
})
```
