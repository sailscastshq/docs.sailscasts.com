---
title: Context & Breadcrumbs
editLink: true
prev:
  text: 'Capturing Errors'
  link: '/sentry-sails/capturing-errors'
next:
  text: 'Source Maps'
  link: '/sentry-sails/source-maps'
---

# Context & Breadcrumbs

Add context to your errors to make debugging easier. Sentry Sails provides access to the full Sentry SDK for managing user context, tags, and breadcrumbs.

## User Context

Associate errors with specific users:

```javascript
// In a policy or hook that runs after authentication
sails.sentry.setUser({
  id: req.session.userId,
  email: req.session.userEmail,
  username: req.session.username
})
```

### Clear User Context

Clear user context on logout:

```javascript
// In your logout action
sails.sentry.setUser(null)
```

### Policy Example

Create a policy to automatically set user context:

**api/policies/sentry-user.js**

```javascript
module.exports = async function (req, res, proceed) {
  if (req.session && req.session.userId) {
    sails.sentry.setUser({
      id: req.session.userId,
      email: req.session.userEmail
    })
  }
  return proceed()
}
```

Add to your policies:

```javascript
// config/policies.js
module.exports.policies = {
  '*': ['sentry-user']
}
```

## Tags

Tags are indexed key-value pairs for filtering and searching:

```javascript
// Set a tag
sails.sentry.setTag('feature', 'checkout')

// Set multiple tags
sails.sentry.setTags({
  feature: 'checkout',
  tier: 'premium'
})
```

Common tags to consider:

- `feature` - Which feature area
- `tier` - User subscription tier
- `version` - App version
- `region` - Geographic region

## Extra Data

Attach arbitrary data to errors:

```javascript
// Set extra context
sails.sentry.setExtra('order', {
  id: order.id,
  total: order.total,
  items: order.items.length
})

// Set multiple extras
sails.sentry.setExtras({
  orderId: order.id,
  cartItems: cart.items
})
```

## Breadcrumbs

Breadcrumbs are a trail of events leading up to an error:

```javascript
// Add a breadcrumb
sails.sentry.addBreadcrumb({
  category: 'auth',
  message: 'User logged in',
  level: 'info'
})
```

### Breadcrumb Categories

```javascript
// Navigation
sails.sentry.addBreadcrumb({
  category: 'navigation',
  message: 'Navigated to checkout',
  level: 'info'
})

// User action
sails.sentry.addBreadcrumb({
  category: 'user',
  message: 'Added item to cart',
  level: 'info',
  data: {
    productId: product.id
  }
})

// HTTP request
sails.sentry.addBreadcrumb({
  category: 'http',
  message: 'API call to payment provider',
  level: 'info',
  data: {
    url: '/api/charge',
    method: 'POST',
    status_code: 200
  }
})
```

### Breadcrumb Levels

- `fatal`
- `error`
- `warning`
- `info`
- `debug`

## Scoped Context

Use `withScope` for context that should only apply to a single error:

```javascript
sails.sentry.withScope((scope) => {
  scope.setUser({ id: userId })
  scope.setTag('action', 'password-reset')
  scope.setExtra('attempts', attemptCount)

  sails.sentry.captureException(error)
})
// Context is automatically cleared after the scope
```

## Clearing Context

```javascript
// Clear specific context
sails.sentry.setUser(null)
sails.sentry.setTag('feature', undefined)

// Clear all context on the current scope
sails.sentry.getCurrentScope().clear()
```
