---
head:
  - - meta
    - property: 'og:image'
      content: https://docs.sailscasts.com/boring-stack-social.png
title: Merging props
titleTemplate: The Boring JavaScript Stack 🥱
description: By default, Inertia overwrites props with the same name when reloading a page. However, there are instances, such as pagination or infinite scrolling, where that is not the desired behavior. In these cases, you can merge props instead of overwriting them.
prev:
  text: Deferred props
  link: '/boring-stack/deferred-props'
next:
  text: Authentication
  link: '/boring-stack/authentication'
editLink: true
---

Inertia replaces props with identical names when a page reloads. For pagination, infinite scrolling, notifications, or chat messages, you usually want new data to merge with what is already on the page.

Prop merging only applies during Inertia visits and partial reloads. Full page visits replace props entirely.

## Server side

Use `sails.inertia.merge()` to mark a prop as mergeable. By default, arrays are appended at the prop root.

```js
module.exports = {
  inputs: {
    page: {
      type: 'number',
      defaultsTo: 0
    },
    perPage: {
      type: 'number',
      defaultsTo: 10
    }
  },
  exits: {
    success: {
      responseType: 'inertia'
    }
  },
  fn: async function ({ page }) {
    const servers = await Server.find({ isRunning: true }).paginate(
      page,
      perPage
    )
    return {
      page: 'servers',
      props: { servers: sails.inertia.merge(() => servers) }
    }
  }
}
```

On the client side, Inertia automatically applies the merge metadata returned by the server.

## Append, prepend, and nested paths

Use `.append()` or `.prepend()` when you need to control the merge direction:

```js
props: {
  messages: sails.inertia.merge(() => olderMessages).prepend(),
  notifications: sails.inertia.merge(() => newNotifications).append()
}
```

For paginated objects, target the nested array and replace the rest of the object:

```js
props: {
  users: sails.inertia.merge(() => paginatedUsers).append('data')
}
```

When items have stable IDs, add `matchOn` so the client updates matching items instead of duplicating them:

```js
props: {
  users: sails.inertia
    .merge(() => paginatedUsers)
    .append('data', {
      matchOn: 'id'
    })
}
```

You can also target several nested arrays at once:

```js
props: {
  dashboard: sails.inertia
    .merge(() => dashboardData)
    .append({
      'users.data': 'id',
      activities: 'uuid'
    })
}
```

Additionally, you can combine [deferred props](/boring-stack/deferred-props) with mergeable props. This allows you to defer the loading of a prop and mark it as mergeable once it has been loaded.

```js
module.exports = {
  inputs: {
    page: {
      type: 'number',
      defaultsTo: 0
    },
    perPage: {
      type: 'number',
      defaultsTo: 10
    }
  },
  exits: {
    success: {
      responseType: 'inertia'
    }
  },
  fn: async function ({ page }) {
    const servers = sails.inertia.defer(
      async () => await Server.find({ isRunning: true }).paginate(page, perPage)
    )
    return {
      page: 'servers',
      props: {
        servers: sails.inertia
          .merge(() => servers)
          .append('data', { matchOn: 'id' })
      }
    }
  }
}
```

## Deep merging

By default, `merge()` performs a shallow merge - arrays are appended and objects are merged at the top level. For nested objects that need recursive merging, use `deepMerge()`:

```js
module.exports = {
  exits: {
    success: {
      responseType: 'inertia'
    }
  },
  fn: async function ({ page }) {
    const settings = await Settings.findOne({ userId: this.req.session.userId })

    return {
      page: 'settings/index',
      props: {
        // Deep merge nested settings object
        settings: sails.inertia.deepMerge(() => settings)
      }
    }
  }
}
```

### When to use deep merge

Use `deepMerge()` when your data has nested objects that should be recursively merged:

```js
// With merge() - shallow merge
// Old: { notifications: { email: true, push: false } }
// New: { notifications: { sms: true } }
// Result: { notifications: { sms: true } }  // email and push lost!

// With deepMerge() - recursive merge
// Old: { notifications: { email: true, push: false } }
// New: { notifications: { sms: true } }
// Result: { notifications: { email: true, push: false, sms: true } }
```

Use targeted `merge().append(path)` or `merge().prepend(path)` for paginated lists. Use `deepMerge()` for nested configuration objects, user preferences, or any deeply nested data structures where the entire object should merge recursively.

## Resetting props

On the client side, you can instruct the server to reset a prop. This is useful when you need to clear the prop value before merging new data, such as when a user enters a new search query in a paginated list.

The reset request option accepts an array of prop keys that you want to reset.

```js
router.reload({
  reset: ['servers']
})
```
