---
layout: home
features:
  - title: Modern SPA Experience
    details: Build single-page apps without building an API. Server-side routing with client-side rendering.
  - title: Full-Stack JavaScript
    details: Use Vue, React, or Svelte with Sails.js. One codebase, one language, one deployment.
  - title: Request-Scoped State
    details: AsyncLocalStorage ensures data isolation between concurrent requests. No race conditions.
  - title: Smart Caching
    details: Once props cache expensive data across navigations. Refresh when you need to.
  - title: Deferred Loading
    details: Load expensive props after the initial render for faster perceived performance.
  - title: Infinite Scroll
    details: Built-in pagination with merge behavior. Load more data without replacing existing content.

hero:
  name: inertia-sails
  text: The Sails adapter for Inertia.js
  tagline: Build modern single-page Vue, React, and Svelte apps using classic server-side routing and controllers.
  actions:
    - theme: brand
      text: Get Started
      link: /inertia-sails/installation
    - theme: alt
      text: View on GitHub
      link: https://github.com/sailscastshq/boring-stack
---

## Quick Start

```bash
# Create a new app with everything set up
npx create-sails my-app
```

Or add to an existing Sails app:

```bash
npm install inertia-sails
```

## Example Action

```js
// api/controllers/dashboard/view-dashboard.js
module.exports = {
  exits: {
    success: { responseType: 'inertia' }
  },

  fn: async function () {
    return {
      page: 'dashboard/index',
      props: {
        user: await User.findOne({ id: this.req.session.userId }),
        stats: await Stats.find()
      }
    }
  }
}
```

## Key Features

### Shared Data

```js
// Share with current request
sails.inertia.share('user', currentUser)

// Flash messages
sails.inertia.flash('success', 'Saved!')
```

### Once Props (Cached)

```js
sails.inertia.share(
  'loggedInUser',
  sails.inertia.once(async () => {
    return await User.findOne({ id: req.session.userId })
  })
)

// Refresh when data changes
sails.inertia.refreshOnce('loggedInUser')
```

### Deferred Props

```js
props: {
  user: currentUser,  // Loads immediately
  analytics: sails.inertia.defer(() => getAnalytics())  // Loads after render
}
```

### Infinite Scroll

```js
props: {
  invoices: sails.inertia.scroll(() => invoices, {
    page,
    perPage,
    total,
    wrapper: 'data'
  })
}
```
