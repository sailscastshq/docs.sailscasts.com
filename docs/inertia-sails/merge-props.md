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

Merge props combine new data with existing client-side data instead of replacing it. This is useful for features like infinite scroll or updating nested objects.

## Shallow Merge

Use `sails.inertia.merge()` for shallow merging:

```js
messages: sails.inertia.merge(() => newMessages)
```

New items are appended to the existing array.

## Deep Merge

Use `sails.inertia.deepMerge()` for nested objects:

```js
settings: sails.inertia.deepMerge(() => updatedSettings)
```

Nested properties are merged recursively.

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
        // Merge with existing messages instead of replacing
        messages: sails.inertia.merge(() => messages)
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
