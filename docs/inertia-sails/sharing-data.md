---
title: Sharing Data
editLink: true
prev:
  text: Redirects
  link: '/inertia-sails/redirects'
next:
  text: Flash messages
  link: '/inertia-sails/flash-messages'
---

# Sharing Data

inertia-sails provides multiple ways to share data with your frontend components.

## Request-Scoped Sharing

Use `sails.inertia.share()` to share data with the current request only:

```js
sails.inertia.share('flash', { success: 'Profile updated!' })
sails.inertia.share('user', currentUser)
```

This is request-scoped using AsyncLocalStorage, so data won't leak between concurrent requests.

### Sharing in Custom Hooks

A common pattern is sharing authenticated user data across all requests:

```js
// api/hooks/custom/index.js
module.exports = function defineCustomHook(sails) {
  return {
    routes: {
      before: {
        'GET /*': {
          skipAssets: true,
          fn: async function (req, res, next) {
            if (req.session.userId) {
              const user = await User.findOne({ id: req.session.userId })
              sails.inertia.share('loggedInUser', user)
            }
            return next()
          }
        }
      }
    }
  }
}
```

## Global Sharing

Use `sails.inertia.shareGlobally()` for app-wide data that doesn't change per request:

```js
// In hook initialization
sails.inertia.shareGlobally('appName', 'My Application')
sails.inertia.shareGlobally('supportEmail', 'support@example.com')
```

Global data is included in every Inertia response.

::: warning
Use `shareGlobally()` sparingly. For user-specific data, always use `share()` to prevent data leaks between users.
:::

## Accessing Shared Data

All shared data is available in your frontend component via page props:

```vue
<script setup>
import { usePage } from '@inertiajs/vue3'

const page = usePage()

// Access shared data
const user = page.props.loggedInUser
const appName = page.props.appName
</script>
```

In React:

```jsx
import { usePage } from '@inertiajs/react'

function Layout({ children }) {
  const { loggedInUser, appName } = usePage().props

  return (
    <div>
      <nav>Welcome, {loggedInUser?.fullName}</nav>
      {children}
    </div>
  )
}
```

## Lazy Evaluation

Share callbacks are lazily evaluated, allowing you to share expensive computations that are only executed when needed:

```js
sails.inertia.share('permissions', async () => {
  return await Permission.find({ user: req.session.userId })
})
```

For cached lazy props, see [Once Props](/inertia-sails/once-props).
