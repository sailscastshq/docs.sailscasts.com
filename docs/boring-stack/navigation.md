---
title: Navigation
titleTemplate: The Boring JavaScript Stack 🥱
description: To navigate in your SPA use the provided Links component for your UI framework.
prev:
  text: 'Routing'
  link: '/boring-stack/routing'
next:
  text: 'Redirects'
  link: '/boring-stack/redirects'
editLink: true
---

# Navigation

## Standard navigation

To navigate in pages/views that are not controlled by Inertia, use the standard `<a>`. Not surprisingly it works really well :wink:.

## Inertia navigation

To navigate in pages, use the Inertia `<Link>` component. The `<Link>` component is a light wrapper around a standard anchor `<a>` tag that intercepts click events and prevent full page reloads.

::: info
Learn more about [how Inertia provide an SPA experience](https://inertiajs.com/how-it-works) in the Inertia docs.
:::

## Creating links

To create an Inertia link, use the Inertia `<Link>` component. Any attributes you provide to this component will be proxied to the underlying HTML tag.

::: code-group

```vue [Vue]
<script setup>
import { Link } from '@inertiajs/vue3'
</script>

<template><Link href="/">Home</Link> // [!code focus]</template>
```

```jsx [React]
import { Link } from '@inertiajs/react'

function Nav() {
  return <Link href="/">Home</Link> // [!code focus]
}
```

```svelte [Svelte]
import { inertia, Link } from '@inertiajs/svelte'

<a href="/" use:inertia>Home</a>

<Link href="/">Home</Link>
```

:::
