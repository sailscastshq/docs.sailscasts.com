---
title: Merge Props
editLink: true
prev:
  text: Deferred props
  link: '/inertia-sails/deferred-props'
next:
  text: Optional props
  link: '/inertia-sails/optional-props'
---

# Merge Props

Merge props combine new data with existing client-side data instead of replacing it. This is useful for features like load-more lists, infinite scroll, chat messages, notifications, and updating nested objects.

Prop merging only applies during Inertia visits and partial reloads. Full page visits replace the page props entirely.

## Shallow Merge

Use `sails.inertia.merge()` for shallow merging. By default, arrays are appended at the prop root:

```js
messages: sails.inertia.merge(() => newMessages)
```

## Append and Prepend

Use `.append()` or `.prepend()` when you need to control where new items go:

```js
// Append at the root level
messages: sails.inertia.merge(() => olderMessages).append()

// Prepend at the root level
notifications: sails.inertia.merge(() => newestNotifications).prepend()
```

You can also target nested arrays while replacing the rest of the object. This is the common shape for paginated data:

```js
users: sails.inertia.merge(() => paginatedUsers).append('data')
```

Target several nested arrays by passing an array or object:

```js
dashboard: sails.inertia
  .merge(() => dashboardData)
  .append(['activities', 'notifications'])
  .prepend('announcements')
```

## Matching Items

When items have stable IDs, use `matchOn` so Inertia updates existing items instead of appending duplicates:

```js
users: sails.inertia
  .merge(() => paginatedUsers)
  .append('data', {
    matchOn: 'id'
  })
```

For several nested arrays, pass a path-to-field map:

```js
dashboard: sails.inertia
  .merge(() => dashboardData)
  .append({
    'users.data': 'id',
    messages: 'uuid'
  })
```

## Deep Merge

Use `sails.inertia.deepMerge()` when the entire nested object should be recursively merged:

```js
settings: sails.inertia.deepMerge(() => updatedSettings)
```

For nested arrays inside a deep merge, add `.matchOn()`:

```js
chat: sails.inertia.deepMerge(() => chatState).matchOn('messages.id')
```

## Example: Chat Messages

```js
// api/controllers/chat/load-messages.js
module.exports = {
  inputs: {
    before: { type: 'number' } // Load messages before this timestamp
  },

  exits: {
    success: { responseType: 'inertia' }
  },

  fn: async function ({ before }) {
    const messages = await Message.find({
      createdAt: { '<': before }
    })
      .sort('createdAt DESC')
      .limit(20)

    return {
      page: 'chat/index',
      props: {
        // Prepend older messages above the existing list
        messages: sails.inertia.merge(() => messages).prepend()
      }
    }
  }
}
```

## Example: Settings Update

```js
// api/controllers/settings/update-notifications.js
module.exports = {
  inputs: {
    emailNotifications: { type: 'boolean' }
  },

  exits: {
    success: { responseType: 'inertia' }
  },

  fn: async function ({ emailNotifications }) {
    const settings = await Settings.updateOne({
      user: this.req.session.userId
    }).set({
      notifications: { email: emailNotifications }
    })

    return {
      page: 'settings/index',
      props: {
        // Deep merge preserves other settings
        settings: sails.inertia.deepMerge(() => settings)
      }
    }
  }
}
```

## Merge vs Replace

| Operation | `props.items`  | `merge(() => items)`        |
| --------- | -------------- | --------------------------- |
| Behavior  | Replaces array | Appends to array            |
| Use case  | Full page load | Load more / infinite scroll |

## Frontend Integration

Your frontend handles merge props automatically. The Inertia client merges the data before updating your component.

```vue
<script setup>
defineProps({
  messages: Array // Automatically merged with existing messages
})
</script>

<template>
  <div v-for="message in messages" :key="message.id">
    {{ message.content }}
  </div>
  <button @click="loadMore">Load More</button>
</template>
```

For comprehensive infinite scroll with pagination metadata, see [Infinite Scroll](/inertia-sails/infinite-scroll).

## Resetting Props

When filters change, ask Inertia to reset the merged prop before loading the next payload:

```js
router.reload({
  only: ['users'],
  reset: ['users']
})
```
