---
title: Optional Props
editLink: true
prev:
  text: Merge props
  link: '/inertia-sails/merge-props'
next:
  text: Always props
  link: '/inertia-sails/always-props'
---

# Optional Props

Optional props are only included in the response when explicitly requested via a partial reload. This reduces payload size for data that's not always needed.

## Basic Usage

Use `sails.inertia.optional()` to mark a prop as optional:

```js
module.exports = {
  exits: {
    success: { responseType: 'inertia' }
  },

  fn: async function () {
    return {
      page: 'products/index',
      props: {
        // Always included
        products: await Product.find(),

        // Only included when requested
        categories: sails.inertia.optional(() => Category.find()),
        filters: sails.inertia.optional(() => Filter.find())
      }
    }
  }
}
```

## Requesting Optional Props

Use Inertia's `only` option to request specific optional props:

### Vue

```vue
<script setup>
import { router } from '@inertiajs/vue3'

function loadFilters() {
  router.reload({
    only: ['filters']
  })
}
</script>
```

### React

```jsx
import { router } from '@inertiajs/react'

function loadFilters() {
  router.reload({
    only: ['filters']
  })
}
```

## Use Cases

### Expensive Data

```js
props: {
  posts: await Post.find().limit(20),
  totalCount: sails.inertia.optional(async () => {
    return await Post.count()  // Only fetch when needed
  })
}
```

### Conditional UI Elements

```js
props: {
  user: currentUser,
  // Only load when user opens settings modal
  userSettings: sails.inertia.optional(() => Settings.findOne({ user: userId }))
}
```

### Filter Options

```js
props: {
  products: filteredProducts,
  // Only load when user opens filter panel
  availableFilters: sails.inertia.optional(async () => ({
    categories: await Category.find(),
    brands: await Brand.find(),
    priceRanges: getPriceRanges()
  }))
}
```

## Optional vs Deferred

| Feature                   | Optional       | Deferred           |
| ------------------------- | -------------- | ------------------ |
| Loaded automatically      | No             | Yes                |
| Requires explicit request | Yes            | No                 |
| Use case                  | On-demand data | Background loading |

Use `optional()` when:

- Data is rarely needed
- User must take action to view it
- You want to minimize initial payload

Use `defer()` when:

- Data will likely be needed
- You want automatic background loading
- Improving perceived performance
