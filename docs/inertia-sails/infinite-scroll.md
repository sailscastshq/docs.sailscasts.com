---
title: Infinite Scroll
editLink: true
prev:
  text: Always props
  link: '/inertia-sails/always-props'
next:
  text: History encryption
  link: '/inertia-sails/history-encryption'
---

# Infinite Scroll

inertia-sails provides `sails.inertia.scroll()` for implementing infinite scroll with pagination metadata. It wraps your data for Inertia's `<InfiniteScroll>` component, marks the wrapped array path for merging, and emits the `scrollProps` metadata the client needs.

## Basic Usage

```js
module.exports = {
  inputs: {
    page: {
      type: 'number',
      defaultsTo: 0
    }
  },

  exits: {
    success: { responseType: 'inertia' }
  },

  fn: async function ({ page }) {
    const perPage = 20
    const invoices = await Invoice.find()
      .sort('createdAt DESC')
      .paginate(page, perPage)
    const total = await Invoice.count()

    return {
      page: 'invoices/index',
      props: {
        invoices: sails.inertia.scroll(() => invoices, {
          page,
          perPage,
          total
        })
      }
    }
  }
}
```

## Options

| Option     | Type   | Description                                  |
| ---------- | ------ | -------------------------------------------- |
| `page`     | number | Current page (0-indexed for Waterline)       |
| `perPage`  | number | Items per page                               |
| `total`    | number | Total item count                             |
| `pageName` | string | Query parameter name for pagination          |
| `wrapper`  | string | Optional wrapper key for data                |
| `matchOn`  | string | Optional field used to update matching items |

## With Wrapper

Use the `wrapper` option to structure data with metadata:

```js
invoices: sails.inertia.scroll(() => invoices, {
  page,
  perPage,
  total,
  wrapper: 'data'
})
```

This produces:

```js
{
  invoices: {
    data: [...],  // The invoice items
    meta: {
      current_page: 1,
      per_page: 20,
      total: 150,
      last_page: 8,
      next_page: 2,
      prev_page: null,
      page_name: 'page'
    }
  }
}
```

## Complete Example

### Backend

```js
// api/controllers/invoice/view-invoices.js
module.exports = {
  inputs: {
    page: {
      type: 'number',
      defaultsTo: 0
    },
    status: {
      type: 'string',
      defaultsTo: 'sent'
    }
  },

  exits: {
    success: { responseType: 'inertia' }
  },

  fn: async function ({ page, status }) {
    const perPage = 20
    const currentCreatorId = this.req.session.creatorId

    const invoices = await Invoice.find({
      creator: currentCreatorId,
      status
    })
      .populate('client')
      .sort('updatedAt DESC')
      .paginate(page, perPage)

    const total = await Invoice.count({
      creator: currentCreatorId,
      status
    })

    return {
      page: 'invoices/index',
      props: {
        status,
        invoices: sails.inertia.scroll(() => invoices, {
          page,
          perPage,
          total,
          wrapper: 'data'
        })
      }
    }
  }
}
```

### Frontend (Vue)

```vue
<script setup>
import { InfiniteScroll } from '@inertiajs/vue3'

const props = defineProps({
  invoices: Object,
  status: String
})
</script>

<template>
  <InfiniteScroll data="invoices">
    <div v-for="invoice in invoices.data" :key="invoice.id">
      {{ invoice.invoiceNumber }} - {{ invoice.totalAmount }}
    </div>
  </InfiniteScroll>
</template>
```

### Frontend (React)

```jsx
import { InfiniteScroll } from '@inertiajs/react'

export default function Invoices({ invoices, status }) {
  return (
    <InfiniteScroll data="invoices">
      {invoices.data.map((invoice) => (
        <div key={invoice.id}>
          {invoice.invoiceNumber} - {invoice.totalAmount}
        </div>
      ))}
    </InfiniteScroll>
  )
}
```

The component decides whether the next request should append or prepend and sends that intent to the server. inertia-sails uses that intent to emit either `mergeProps` or `prependProps` for the wrapped array path.

## Scroll vs Merge

| Feature             | `scroll()`      | `merge()`     |
| ------------------- | --------------- | ------------- |
| Pagination metadata | Yes             | No            |
| Auto-merge behavior | Yes             | Yes           |
| Wrapper support     | Yes             | Yes           |
| Use case            | Full pagination | Simple append |

Use `scroll()` when you need pagination info (page count, has more). Use `merge()` for simple append scenarios.
