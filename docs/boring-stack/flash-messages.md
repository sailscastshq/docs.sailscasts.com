---
head:
  - - meta
    - property: 'og:image'
      content: https://docs.sailscasts.com/boring-stack-social.png
title: Flash messages
titleTemplate: The Boring JavaScript Stack
description: Flash messages in The Boring JavaScript Stack
prev:
  text: Validation
  link: '/boring-stack/validation'
next:
  text: Sharing data
  link: '/boring-stack/sharing-data'
editLink: true
---

# Flash messages

Flash messages let you send one-time data to users after redirects. Unlike regular props, flash data isn't persisted in browser history - when a user clicks the back button, they won't see old flash messages reappear.

This makes flash perfect for success notifications, error messages, newly created IDs, or any temporary values.

## Sending flash messages

Use `sails.inertia.flash()` in your action:

```js
module.exports = {
  exits: {
    success: {
      responseType: 'redirect'
    }
  },
  fn: async function () {
    await User.updateOne({ id: this.req.session.userId }).set({
      timezone: this.req.body.timezone
    })

    sails.inertia.flash('success', 'Timezone updated successfully')

    return '/settings'
  }
}
```

## Flash with redirects

Flash data survives redirects. Set the flash, redirect, and the data appears on the next page:

```js
module.exports = {
  exits: {
    success: {
      responseType: 'redirect'
    }
  },
  fn: async function () {
    const project = await Project.create(this.req.body).fetch()

    sails.inertia.flash('success', 'Project created!')
    sails.inertia.flash('highlightId', project.id)

    return '/projects'
  }
}
```

## Flash with render

You can also use flash when rendering a page directly:

```js
module.exports = {
  exits: {
    success: {
      responseType: 'inertia'
    }
  },
  fn: async function () {
    const projects = await Project.find()

    sails.inertia.flash('toast', {
      type: 'info',
      message: 'Welcome back!'
    })

    return {
      page: 'projects/index',
      props: { projects }
    }
  }
}
```

## Reading flash messages

Flash data is available on `page.props.flash`:

::: code-group

```vue [Vue]
<script setup>
import { usePage } from '@inertiajs/vue3'

const page = usePage()
</script>

<template>
  <div v-if="page.props.flash?.success" class="alert alert-success">
    {{ page.props.flash.success }}
  </div>

  <div v-if="page.props.flash?.error" class="alert alert-error">
    {{ page.props.flash.error }}
  </div>
</template>
```

```jsx [React]
import { usePage } from '@inertiajs/react'

export default function Layout({ children }) {
  const { flash } = usePage().props

  return (
    <>
      {flash?.success && (
        <div className="alert alert-success">{flash.success}</div>
      )}
      {flash?.error && <div className="alert alert-error">{flash.error}</div>}
      {children}
    </>
  )
}
```

```svelte [Svelte]
<script>
  import { page } from '@inertiajs/svelte'
</script>

{#if $page.props.flash?.success}
  <div class="alert alert-success">{$page.props.flash.success}</div>
{/if}

{#if $page.props.flash?.error}
  <div class="alert alert-error">{$page.props.flash.error}</div>
{/if}
```

:::

## Global flash event

You can listen for flash data globally using Inertia's event system:

::: code-group

```vue [Vue]
<script setup>
import { router } from '@inertiajs/vue3'
import { onMounted, onUnmounted } from 'vue'

let removeListener

onMounted(() => {
  removeListener = router.on('flash', (event) => {
    if (event.detail.flash.toast) {
      showToast(event.detail.flash.toast)
    }
  })
})

onUnmounted(() => {
  removeListener?.()
})
</script>
```

```jsx [React]
import { router } from '@inertiajs/react'
import { useEffect } from 'react'

export default function Layout({ children }) {
  useEffect(() => {
    return router.on('flash', (event) => {
      if (event.detail.flash.toast) {
        showToast(event.detail.flash.toast)
      }
    })
  }, [])

  return children
}
```

:::

## Real-world examples

### Toast notifications

```js
// api/controllers/tasks/create.js
module.exports = {
  exits: {
    success: {
      responseType: 'redirect'
    }
  },
  fn: async function () {
    const task = await Task.create(this.req.body).fetch()

    sails.inertia.flash('toast', {
      type: 'success',
      message: 'Task created successfully'
    })

    return `/tasks/${task.id}`
  }
}
```

### Highlight newly created items

```js
// api/controllers/projects/create.js
module.exports = {
  exits: {
    success: {
      responseType: 'redirect'
    }
  },
  fn: async function () {
    const project = await Project.create(this.req.body).fetch()

    sails.inertia.flash('highlightId', project.id)

    return '/projects'
  }
}
```

```vue
<script setup>
import { usePage } from '@inertiajs/vue3'

defineProps({ projects: Array })

const highlightId = usePage().props.flash?.highlightId
</script>

<template>
  <div
    v-for="project in projects"
    :key="project.id"
    :class="{ 'bg-yellow-100': project.id === highlightId }"
  >
    {{ project.name }}
  </div>
</template>
```

### Multiple flash values

```js
sails.inertia.flash('success', 'Project created!')
sails.inertia.flash('highlightId', project.id)
sails.inertia.flash('scrollTo', 'projects-section')
```

All values are merged into the `flash` object on the response.

## `sails.inertia.flash()` vs `req.flash()`

The Boring JavaScript Stack provides two flash mechanisms:

| Method                  | Use case              | Available at              |
| ----------------------- | --------------------- | ------------------------- |
| `sails.inertia.flash()` | Inertia apps          | `page.props.flash`        |
| `req.flash()`           | Server-rendered views | Session (via sails-flash) |

**For Inertia apps, always use `sails.inertia.flash()`**. It:

- Stores flash in the session (survives redirects)
- Automatically includes flash in `page.props.flash`
- Works without passing `req` (uses AsyncLocalStorage internally)
- Prevents "phantom" messages when users navigate back

The `req.flash()` method (from sails-flash) is for traditional server-rendered pages and is not automatically included in Inertia responses.
