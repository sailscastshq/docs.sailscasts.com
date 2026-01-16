---
head:
  - - meta
    - property: 'og:image'
      content: https://docs.sailscasts.com/boring-stack-social.png
title: Mergings props
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

Inertia, by default, replaces props with identical names when a page reloads. However, in scenarios like pagination or infinite scrolling, this behavior might not be ideal. To address this, you can opt to merge props rather than overwrite them.

## Server side

To ensure that a prop is merged rather than overwritten, use the `sails.inertia.merge()` method on the prop value. This method signals Inertia to combine the new data with the existing data, which is particularly useful for scenarios like pagination or infinite scrolling.

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

On the client side, Inertia automatically detects when a prop should be merged. If the prop is an array, the new data will be appended to the existing array. If the prop is an object, the new data will be merged with the existing object.

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
      props: { servers: sails.inertia.merge(() => servers) }
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

Use regular `merge()` for arrays and flat objects. Use `deepMerge()` for nested configuration objects, user preferences, or any deeply nested data structures.

## Resetting props

On the client side, you can instruct the server to reset a prop. This is useful when you need to clear the prop value before merging new data, such as when a user enters a new search query in a paginated list.

The reset request option accepts an array of prop keys that you want to reset.

```js
router.reload({
  reset: ['servers']
})
```
