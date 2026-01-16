---
head:
  - - meta
    - property: 'og:image'
      content: https://docs.sailscasts.com/boring-stack-social.png
title: Once props
titleTemplate: The Boring JavaScript Stack
description: Once props let you send expensive data to the client just once, then skip it on subsequent navigations until you say otherwise.
prev:
  text: Merging props
  link: '/boring-stack/merging-props'
next:
  text: Flash data
  link: '/boring-stack/flash-data'
editLink: true
---

# Once props

Some data is expensive to compute but rarely changes. Think user permissions, feature flags, or app configuration. You don't want to fetch these on every single page load - that's wasteful.

Once props solve this. They're sent to the client on the first request, then automatically skipped on subsequent navigations. The client tells the server "I already have these" via headers, and the server respects that.

## When to use once props

Once props are ideal for:

- **User permissions** - Fetched once at login, skipped until they change
- **Feature flags** - App-wide settings that rarely update
- **Navigation menus** - Dynamic menus based on user role
- **App configuration** - Settings that apply across pages

## Basic usage

Wrap any prop value with `sails.inertia.once()`:

```js
module.exports = {
  exits: {
    success: {
      responseType: 'inertia'
    }
  },
  fn: async function () {
    const user = await User.findOne({ id: this.req.session.userId }).populate(
      'permissions'
    )

    return {
      page: 'dashboard/index',
      props: {
        // Sent every time
        stats: await sails.helpers.dashboard.getStats(user.id),

        // Sent once, then skipped
        permissions: sails.inertia.once(() => user.permissions),
        featureFlags: sails.inertia.once(() => sails.config.features)
      }
    }
  }
}
```

On the first visit, `permissions` and `featureFlags` are sent. On subsequent navigations, the client includes them in the `X-Inertia-Except-Once-Props` header, and the server skips resolving them entirely.

## Sharing once props globally

For data needed across your entire app, use `sails.inertia.shareOnce()` in a policy or hook:

```js
// api/policies/share-global-data.js
module.exports = async function (req, res, proceed) {
  const user = req.session.userId
    ? await User.findOne({ id: req.session.userId }).populate('permissions')
    : null

  sails.inertia.shareOnce('permissions', () => user?.permissions || [])
  sails.inertia.shareOnce('featureFlags', () => sails.config.features)

  return proceed()
}
```

Now every Inertia response includes these props automatically - but only when the client doesn't already have them.

## Forcing fresh data

Sometimes you need to bust the cache. Maybe the user just updated their profile, or you deployed new feature flags.

### Using `fresh()`

Mark a once prop as "always fresh" for specific responses:

```js
// After user updates their profile
module.exports = {
  exits: {
    success: {
      responseType: 'inertia'
    }
  },
  fn: async function () {
    const user = await User.findOne({ id: this.req.session.userId }).populate(
      'permissions'
    )

    return {
      page: 'settings/profile',
      props: {
        user,
        // Force fresh data this one time
        permissions: sails.inertia.once(() => user.permissions).fresh()
      }
    }
  }
}
```

### Using `until()`

Set a time-to-live. The prop refreshes after the duration expires:

```js
sails.inertia
  .shareOnce('featureFlags', () => sails.config.features)
  .until('1 hour')

sails.inertia
  .shareOnce('exchangeRates', () => sails.helpers.getExchangeRates())
  .until('15 minutes')
```

Supported formats: `'30 seconds'`, `'5 minutes'`, `'2 hours'`, `'1 day'`

### Using `expiresAt()`

Set an exact expiration time:

```js
const midnight = new Date()
midnight.setHours(24, 0, 0, 0)

sails.inertia
  .shareOnce('dailyQuota', () => user.remainingQuota)
  .expiresAt(midnight)
```

## Naming once props

By default, once props use their key name for tracking. Use `as()` to set a custom identifier:

```js
// In one action
sails.inertia.once(() => user.permissions).as('user-permissions-v2')

// In another action - same identifier means same caching behavior
sails.inertia
  .once(() => sails.helpers.computePermissions(user))
  .as('user-permissions-v2')
```

This is useful when the same logical data is computed differently in different actions.

## How it works under the hood

1. **First request**: Server sends once props with metadata (name, expiration)
2. **Subsequent requests**: Client includes `X-Inertia-Except-Once-Props` header listing props it has
3. **Server skips**: Props in that header aren't resolved - their callbacks never run
4. **Expiration**: When a prop expires, client stops sending it in the header, server sends fresh data

The client-side Inertia adapter handles all the header management automatically.

## Real-world example

Here's a complete example for a SaaS dashboard:

```js
// api/policies/share-app-data.js
module.exports = async function (req, res, proceed) {
  if (!req.session.userId) return proceed()

  const user = await User.findOne({ id: req.session.userId })
    .populate('organization')
    .populate('permissions')

  // User permissions - refresh on profile update
  sails.inertia.shareOnce('permissions', () => user.permissions)

  // Organization settings - cache for 5 minutes
  sails.inertia
    .shareOnce('orgSettings', () => user.organization.settings)
    .until('5 minutes')

  // Feature flags - cache for 1 hour
  sails.inertia
    .shareOnce('features', () => sails.config.features)
    .until('1 hour')

  // Navigation based on permissions
  sails.inertia.shareOnce('navigation', () =>
    sails.helpers.buildNavigation(user)
  )

  return proceed()
}
```

```js
// api/controllers/settings/update-profile.js
module.exports = {
  exits: {
    success: {
      responseType: 'redirect'
    }
  },
  fn: async function () {
    await User.updateOne({ id: this.req.session.userId }).set(this.req.body)

    // Permissions might have changed - force refresh
    const user = await User.findOne({ id: this.req.session.userId }).populate(
      'permissions'
    )

    sails.inertia.shareOnce('permissions', () => user.permissions).fresh()

    this.req.flash('success', 'Profile updated')
    return '/settings/profile'
  }
}
```

On the client, access these like any other prop:

```vue
<script setup>
import { usePage } from '@inertiajs/vue3'

const { permissions, features, navigation } = usePage().props
</script>
```
