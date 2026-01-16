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

inertia-sails provides `sails.inertia.scroll()` for implementing infinite scroll with pagination metadata.

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

| Option    | Type   | Description                   |
| --------- | ------ | ----------------------------- |
| `page`    | number | Current page (0-indexed)      |
| `perPage` | number | Items per page                |
| `total`   | number | Total item count              |
| `wrapper` | string | Optional wrapper key for data |

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
      page: 0,
      perPage: 20,
      total: 150,
      totalPages: 8,
      hasMore: true
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
import { router } from '@inertiajs/vue3'
import { ref, computed } from 'vue'

const props = defineProps({
  invoices: Object,
  status: String
})

const loading = ref(false)

const hasMore = computed(() => props.invoices.meta.hasMore)

function loadMore() {
  if (loading.value || !hasMore.value) return

  loading.value = true
  router.reload({
    data: {
      page: props.invoices.meta.page + 1
    },
    preserveState: true,
    preserveScroll: true,
    only: ['invoices'],
    onFinish: () => {
      loading.value = false
    }
  })
}
</script>

<template>
  <div>
    <div v-for="invoice in invoices.data" :key="invoice.id">
      {{ invoice.invoiceNumber }} - {{ invoice.totalAmount }}
    </div>

    <button v-if="hasMore" @click="loadMore" :disabled="loading">
      {{ loading ? 'Loading...' : 'Load More' }}
    </button>

    <p v-if="!hasMore">No more invoices</p>
  </div>
</template>
```

### Frontend (React)

```jsx
import { router } from '@inertiajs/react'
import { useState } from 'react'

export default function Invoices({ invoices, status }) {
  const [loading, setLoading] = useState(false)

  function loadMore() {
    if (loading || !invoices.meta.hasMore) return

    setLoading(true)
    router.reload({
      data: { page: invoices.meta.page + 1 },
      preserveState: true,
      preserveScroll: true,
      only: ['invoices'],
      onFinish: () => setLoading(false)
    })
  }

  return (
    <div>
      {invoices.data.map((invoice) => (
        <div key={invoice.id}>
          {invoice.invoiceNumber} - {invoice.totalAmount}
        </div>
      ))}

      {invoices.meta.hasMore && (
        <button onClick={loadMore} disabled={loading}>
          {loading ? 'Loading...' : 'Load More'}
        </button>
      )}
    </div>
  )
}
```

## Scroll vs Merge

| Feature             | `scroll()`      | `merge()`     |
| ------------------- | --------------- | ------------- |
| Pagination metadata | Yes             | No            |
| Auto-merge behavior | Yes             | Yes           |
| Wrapper support     | Yes             | No            |
| Use case            | Full pagination | Simple append |

Use `scroll()` when you need pagination info (page count, has more). Use `merge()` for simple append scenarios.
