---
title: Deferred Props
editLink: true
prev:
  text: Once props
  link: '/inertia-sails/once-props'
next:
  text: Merge props
  link: '/inertia-sails/merge-props'
---

# Deferred Props

Deferred props load after the initial page render, allowing the page to display quickly while expensive data loads in the background.

## Basic Usage

Use `sails.inertia.defer()` to defer a prop:

```js
module.exports = {
  exits: {
    success: { responseType: 'inertia' }
  },

  fn: async function () {
    return {
      page: 'dashboard/index',
      props: {
        // Loads immediately
        user: await User.findOne({ id: this.req.session.userId }),

        // Loads after render
        analytics: sails.inertia.defer(async () => {
          return await Analytics.getExpensiveReport()
        }),

        // Another deferred prop
        notifications: sails.inertia.defer(async () => {
          return await Notification.find({ user: this.req.session.userId })
        })
      }
    }
  }
}
```

## How It Works

1. The initial page loads with immediate props
2. The frontend component renders
3. Inertia automatically fetches deferred props
4. Your component updates with the new data

## Frontend Handling

### Vue

```vue
<script setup>
import { Deferred } from '@inertiajs/vue3'

defineProps({
  user: Object,
  analytics: Object,
  notifications: Array
})
</script>

<template>
  <div>
    <h1>Welcome, {{ user.fullName }}</h1>

    <Deferred data="analytics">
      <template #fallback>
        <div class="skeleton">Loading analytics...</div>
      </template>
      <div>
        <h2>Your Stats</h2>
        <p>Views: {{ analytics.views }}</p>
      </div>
    </Deferred>
  </div>
</template>
```

### React

```jsx
import { Deferred } from '@inertiajs/react'

export default function Dashboard({ user, analytics, notifications }) {
  return (
    <div>
      <h1>Welcome, {user.fullName}</h1>

      <Deferred data="analytics" fallback={<LoadingSkeleton />}>
        <div>
          <h2>Your Stats</h2>
          <p>Views: {analytics.views}</p>
        </div>
      </Deferred>
    </div>
  )
}
```

## Deferred Groups

Defer multiple props together so they load in a single request:

```js
props: {
  stats: sails.inertia.defer(() => getStats(), 'dashboard'),
  chart: sails.inertia.defer(() => getChartData(), 'dashboard'),
  recent: sails.inertia.defer(() => getRecentActivity(), 'dashboard')
}
```

All props in the `'dashboard'` group load together.

## Use Cases

### Dashboard Analytics

```js
return {
  page: 'dashboard',
  props: {
    user: currentUser, // Show immediately
    analytics: sails.inertia.defer(async () => {
      return await Analytics.aggregate([
        { $match: { userId: currentUser.id } },
        { $group: { _id: null, total: { $sum: '$views' } } }
      ])
    })
  }
}
```

### Activity Feed

```js
return {
  page: 'profile',
  props: {
    profile: user, // Show immediately
    activityFeed: sails.inertia.defer(async () => {
      return await Activity.find({ user: user.id })
        .sort('createdAt DESC')
        .limit(50)
    })
  }
}
```

## Deferred vs Regular Props

| Feature         | Regular Props      | Deferred Props     |
| --------------- | ------------------ | ------------------ |
| Initial render  | Blocks             | Non-blocking       |
| User experience | Slower first paint | Faster first paint |
| Use case        | Critical data      | Non-critical data  |

Use deferred props for:

- Analytics and statistics
- Activity feeds
- Secondary content
- Expensive aggregations

Use regular props for:

- Core page content
- User information
- Data needed immediately
