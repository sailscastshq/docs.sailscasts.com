---
head:
  - - meta
    - property: 'og:image'
      content: https://docs.sailscasts.com/boring-stack-social.png
title: Infinite scroll
titleTemplate: The Boring JavaScript Stack
description: Load additional content as users scroll with Inertia's infinite scroll component.
prev:
  text: Once props
  link: '/boring-stack/once-props'
next:
  text: Authentication
  link: '/boring-stack/authentication'
editLink: true
---

# Infinite scroll

Inertia's infinite scroll feature loads additional pages of content as users scroll, replacing traditional pagination controls. This works great for feeds, product listings, chat interfaces, and anywhere you want seamless content loading.

## Server side

Use `sails.inertia.scroll()` to configure paginated data for infinite scrolling. This method wraps your data with proper merge behavior and normalizes Waterline pagination metadata for Inertia's `<InfiniteScroll>` component.

```js
module.exports = {
  inputs: {
    page: {
      type: 'number',
      defaultsTo: 0
    },
    perPage: {
      type: 'number',
      defaultsTo: 20
    }
  },
  exits: {
    success: {
      responseType: 'inertia'
    }
  },
  fn: async function ({ page, perPage }) {
    const users = await User.find().paginate(page, perPage)
    const total = await User.count()

    return {
      page: 'users/index',
      props: {
        users: sails.inertia.scroll(() => users, { page, perPage, total })
      }
    }
  }
}
```

::: tip
Waterline's `.paginate()` uses 0-based page indexes. The scroll helper automatically converts this to 1-based for the Inertia client.
:::

## Client side

Inertia provides the `<InfiniteScroll>` component to automatically load additional pages as users scroll. The component accepts a `data` prop specifying which prop contains your paginated data.

::: code-group

```vue [Vue]
<script setup>
import { InfiniteScroll } from '@inertiajs/vue3'

defineProps(['users'])
</script>

<template>
  <InfiniteScroll data="users">
    <div v-for="user in users.data" :key="user.id">
      {{ user.name }}
    </div>
  </InfiniteScroll>
</template>
```

```jsx [React]
import { InfiniteScroll } from '@inertiajs/react'

export default function Users({ users }) {
  return (
    <InfiniteScroll data="users">
      {users.data.map((user) => (
        <div key={user.id}>{user.name}</div>
      ))}
    </InfiniteScroll>
  )
}
```

```svelte [Svelte]
<script>
  import { InfiniteScroll } from '@inertiajs/svelte'

  export let users
</script>

<InfiniteScroll data="users">
  {#each users.data as user (user.id)}
    <div>{user.name}</div>
  {/each}
</InfiniteScroll>
```

:::

The component uses intersection observers to detect when users scroll near the end and automatically requests the next page. New data is merged with existing content.

## Loading buffer

Control how early content begins loading by setting a buffer distance in pixels:

::: code-group

```vue [Vue]
<InfiniteScroll data="users" :buffer="500">
  <!-- Content loads 500px before reaching the end -->
</InfiniteScroll>
```

```jsx [React]
<InfiniteScroll data="users" buffer={500}>
  {/* ... */}
</InfiniteScroll>
```

:::

## URL synchronization

The component updates the browser URL's query string (`?page=...`) as users scroll. This lets users bookmark or share links to specific pages. Disable this with `preserve-url`:

::: code-group

```vue [Vue]
<InfiniteScroll data="users" preserve-url>
  <!-- URL won't change as user scrolls -->
</InfiniteScroll>
```

```jsx [React]
<InfiniteScroll data="users" preserveUrl>
  {/* ... */}
</InfiniteScroll>
```

:::

## Resetting on filter changes

When filters change, reset the data to start fresh instead of merging with existing content:

::: code-group

```vue [Vue]
<script setup>
import { router } from '@inertiajs/vue3'

const filterByRole = (role) => {
  router.visit('/users', {
    data: { filter: { role } },
    only: ['users'],
    reset: ['users']
  })
}
</script>

<template>
  <button @click="filterByRole('admin')">Show admins</button>
  <button @click="filterByRole('customer')">Show customers</button>

  <InfiniteScroll data="users">
    <div v-for="user in users.data" :key="user.id">
      {{ user.name }}
    </div>
  </InfiniteScroll>
</template>
```

```jsx [React]
import { router, InfiniteScroll } from '@inertiajs/react'

export default function Users({ users }) {
  const filterByRole = (role) => {
    router.visit('/users', {
      data: { filter: { role } },
      only: ['users'],
      reset: ['users']
    })
  }

  return (
    <>
      <button onClick={() => filterByRole('admin')}>Show admins</button>
      <button onClick={() => filterByRole('customer')}>Show customers</button>

      <InfiniteScroll data="users">
        {users.data.map((user) => (
          <div key={user.id}>{user.name}</div>
        ))}
      </InfiniteScroll>
    </>
  )
}
```

:::

## Reverse mode (chat interfaces)

For chat applications where newest content is at the bottom, enable reverse mode:

::: code-group

```vue [Vue]
<InfiniteScroll data="messages" reverse>
  <div v-for="message in messages.data" :key="message.id">
    {{ message.content }}
  </div>
</InfiniteScroll>
```

```jsx [React]
<InfiniteScroll data="messages" reverse>
  {messages.data.map((message) => (
    <div key={message.id}>{message.content}</div>
  ))}
</InfiniteScroll>
```

:::

In reverse mode, scrolling up loads older content. The component auto-scrolls to the bottom on initial load - disable with `:auto-scroll="false"`.

## Manual mode

Disable automatic loading and show a "Load more" button instead:

::: code-group

```vue [Vue]
<template>
  <InfiniteScroll data="users" manual>
    <template #previous="{ loading, fetch, hasMore }">
      <button v-if="hasMore" @click="fetch" :disabled="loading">
        {{ loading ? 'Loading...' : 'Load previous' }}
      </button>
    </template>

    <div v-for="user in users.data" :key="user.id">
      {{ user.name }}
    </div>

    <template #next="{ loading, fetch, hasMore }">
      <button v-if="hasMore" @click="fetch" :disabled="loading">
        {{ loading ? 'Loading...' : 'Load more' }}
      </button>
    </template>
  </InfiniteScroll>
</template>
```

```jsx [React]
<InfiniteScroll
  data="users"
  manual
  next={({ loading, fetch, hasMore }) =>
    hasMore && (
      <button onClick={fetch} disabled={loading}>
        {loading ? 'Loading...' : 'Load more'}
      </button>
    )
  }
>
  {users.data.map((user) => (
    <div key={user.id}>{user.name}</div>
  ))}
</InfiniteScroll>
```

:::

Switch to manual mode after a certain number of pages with `manualAfter`:

```vue
<InfiniteScroll data="users" :manual-after="3">
  <!-- Auto-loads first 3 pages, then shows "Load more" -->
</InfiniteScroll>
```

## Multiple scroll containers

When you have multiple paginated lists on one page, use different page parameter names:

```js
module.exports = {
  inputs: {
    usersPage: { type: 'number', defaultsTo: 0 },
    ordersPage: { type: 'number', defaultsTo: 0 }
  },
  exits: {
    success: { responseType: 'inertia' }
  },
  fn: async function ({ usersPage, ordersPage }) {
    const perPage = 20

    const users = await User.find().paginate(usersPage, perPage)
    const usersTotal = await User.count()

    const orders = await Order.find().paginate(ordersPage, perPage)
    const ordersTotal = await Order.count()

    return {
      page: 'dashboard',
      props: {
        users: sails.inertia.scroll(() => users, {
          page: usersPage,
          perPage,
          total: usersTotal,
          pageName: 'usersPage'
        }),
        orders: sails.inertia.scroll(() => orders, {
          page: ordersPage,
          perPage,
          total: ordersTotal,
          pageName: 'ordersPage'
        })
      }
    }
  }
}
```

This results in URLs like `?usersPage=2&ordersPage=3` instead of conflicting `?page=` parameters.

## Options reference

The `sails.inertia.scroll()` method accepts these options:

| Option     | Type   | Default  | Description                                |
| ---------- | ------ | -------- | ------------------------------------------ |
| `page`     | number | `0`      | Current page index (0-based for Waterline) |
| `perPage`  | number | `10`     | Items per page                             |
| `total`    | number | `0`      | Total number of items                      |
| `pageName` | string | `'page'` | Query parameter name for pagination        |
| `wrapper`  | string | `'data'` | Key to wrap the data array in              |
