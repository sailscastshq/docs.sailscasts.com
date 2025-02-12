---
head:
  - - meta
    - property: 'og:image'
      content: https://docs.sailscasts.com/boring-stack-social.png
title: Deferred props
titleTemplate: The Boring JavaScript Stack 🥱
description: Inertia's deferred props feature enhances the performance of your app by deferring the loading of specific page data until after the initial render. This approach ensures a faster initial page load, improving the user experience in The Boring JavaScript Stack.
prev:
  text: Sharing data
  link: '/boring-stack/sharing-data'
next:
  text: Merging props
  link: '/boring-stack/merging-props'
editLink: true
---

# Deferred props

Inertia's deferred props feature enhances the performance of your app by deferring the loading of specific page data until after the initial render.

This approach ensures a faster initial page load, improving the user experience in The Boring JavaScript Stack.

## Server side

To defer a prop, use the `sails.inertia.defer()` method in your response. This method takes a callback that fetches the prop data. The callback runs in a separate request after the initial page render.

```js
module.exports = {
  exits: {
    success: {
      responseType: 'inertia'
    }
  },
  fn: async function (inputs, exits) {
    const users = await User.find()
    const roles = await Role.find()

    const permissions = sails.inertia.defer(async () => {
      return await Permission.find()
    })

    return {
      page: 'users/index',
      props: {
        users,
        roles,
        permissions
      }
    }
  }
}
```

## Grouping requests

By default, all deferred props are fetched in a single request after the initial page render. However, you can optimize performance by grouping props together, allowing them to be fetched in parallel.

```js
module.exports = {
  exits: {
    success: {
      responseType: 'inertia'
    }
  },
  fn: async function (inputs, exits) {
    const users = await User.find()
    const roles = await Role.find()

    const permissions = sails.inertia.defer(async () => {
      return await Permission.find()
    })

    const teams = sails.inertia.defer(async () => {
      return await Team.find()
    }, 'attributes')

    const projects = sails.inertia.defer(async () => {
      return await Project.find()
    }, 'attributes')

    const tasks = sails.inertia.defer(async () => {
      return await Task.find()
    }, 'attributes')

    return {
      page: 'users/index',
      props: {
        users,
        roles,
        permissions,
        teams,
        projects,
        tasks
      }
    }
  }
}
```

In the example above, the `teams`, `projects`, and `tasks` props are grouped together and fetched in a single request, while the `permissions` prop is fetched separately in parallel.

You can use any arbitrary string as a group name to organize your deferred props as needed.

## Client side

On the client side, Inertia.js offers a `Deferred` component to handle deferred props seamlessly.

This component ensures that your app waits for the specified deferred props to be ready before rendering its children, providing a smooth and efficient user experience.

::: code-group

```vue [Vue]
<script setup>
import { Deferred } from '@inertiajs/vue3'
</script>

<template>
  <Deferred data="permissions">
    <template #fallback>
      <div>Loading...</div>
    </template>

    <div v-for="permission in permissions">
      <!-- ... -->
    </div>
  </Deferred>
</template>
```

```jsx [React]
import { Deferred } from '@inertiajs/react'

export default () => (
  <Deferred data="permissions" fallback={<div>Loading...</div>}>
    <PermissionsChildComponent />
  </Deferred>
)
```

```svelte [Svelte]
<script>
    import { Deferred } from '@inertiajs/svelte'

    let { permissions } = $props()
</script>

<Deferred data="permissions">
    {#snippet fallback()}
        <div>Loading...</div>
    {/snippet}

    {#each permissions as permission}
        <!-- ... -->
    {/each}
</Deferred>
```

:::code-group

## Waiting for multiple deferred props

If you need to wait for multiple deferred props to become available, you can specify an array to the data prop.

::: code-group

```vue [Vue]
<script setup>
import { Deferred } from '@inertiajs/vue3'
</script>

<template>
  <Deferred data="permissions">
    <template #fallback>
      <div>Loading...</div>
    </template>

    <div v-for="permission in permissions">
      <!-- ... -->
    </div>
  </Deferred>
</template>
```

```jsx [React]
import { Deferred } from '@inertiajs/react'

export default () => (
  <Deferred data={['teams', 'users']} fallback={<div>Loading...</div>}>
    <ChildComponent />
  </Deferred>
)
```

```svelte [Svelte]
<script>
    import { Deferred } from '@inertiajs/svelte'

    let { teams, users } = $props()
</script>

<Deferred data={['teams', 'users']}>
    {#snippet fallback()}
        <div>Loading...</div>
    {/snippet}

    <!-- Props are now loaded -->
</Deferred>
```

:::code-group
