---
head:
  - - meta
    - property: 'og:image'
      content: https://docs.sailscasts.com/boring-stack-social.png
title: Layouts
titleTemplate: The Boring JavaScript Stack 🥱
description: Learn how to create and use persistent layouts in The Boring JavaScript Stack
prev:
  text: Pages
  link: /boring-stack/pages
next:
  text: Redirects
  link: /boring-stack/redirects
editLink: true
---

# Layouts

Layouts allow you to wrap your pages with common UI elements like navigation bars, footers, and sidebars. Instead of duplicating these elements across every page, you define them once in a layout component.

**Layouts in The Boring Stack are persistent** - they are not destroyed and recreated when navigating between pages. This means you can maintain state like scroll position, audio player state, or open/closed sidebar toggles as users navigate your application.

## Creating layouts

Layouts in The Boring Stack are frontend components that live in your `assets/js/layouts/` directory. They wrap page components and provide shared UI structure.

### Basic layout

::: code-group

```vue [Vue]
<script setup>
import { Link } from '@inertiajs/vue3'
</script>

<template>
  <div class="min-h-screen flex flex-col">
    <header class="bg-white border-b">
      <nav class="max-w-7xl mx-auto px-4 py-4">
        <Link href="/" class="font-bold text-xl">My App</Link>
        <div class="flex space-x-4">
          <Link href="/features">Features</Link>
          <Link href="/pricing">Pricing</Link>
          <Link href="/blog">Blog</Link>
        </div>
      </nav>
    </header>

    <main class="flex-1">
      <slot />
    </main>

    <footer class="bg-gray-900 text-white py-8">
      <div class="max-w-7xl mx-auto px-4">
        <p>© 2025 My App. All rights reserved.</p>
      </div>
    </footer>
  </div>
</template>
```

```jsx [React]
import { Link } from '@inertiajs/react'

export default function AppLayout({ children }) {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-white border-b">
        <nav className="max-w-7xl mx-auto px-4 py-4">
          <Link href="/" className="font-bold text-xl">
            My App
          </Link>
          <div className="flex space-x-4">
            <Link href="/features">Features</Link>
            <Link href="/pricing">Pricing</Link>
            <Link href="/blog">Blog</Link>
          </div>
        </nav>
      </header>

      <main className="flex-1">{children}</main>

      <footer className="bg-gray-900 text-white py-8">
        <div className="max-w-7xl mx-auto px-4">
          <p>© 2025 My App. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
```

```svelte [Svelte]
<script>
  import { inertia } from '@inertiajs/svelte'
</script>

<div class="min-h-screen flex flex-col">
  <header class="bg-white border-b">
    <nav class="max-w-7xl mx-auto px-4 py-4">
      <a href="/" use:inertia class="font-bold text-xl">My App</a>
      <div class="flex space-x-4">
        <a href="/features" use:inertia>Features</a>
        <a href="/pricing" use:inertia>Pricing</a>
        <a href="/blog" use:inertia>Blog</a>
      </div>
    </nav>
  </header>

  <main class="flex-1">
    <slot />
  </main>

  <footer class="bg-gray-900 text-white py-8">
    <div class="max-w-7xl mx-auto px-4">
      <p>© 2025 My App. All rights reserved.</p>
    </div>
  </footer>
</div>
```

:::

## Applying persistent layouts

Persistent layouts are not destroyed and recreated between page visits. This is the recommended way to use layouts in The Boring Stack.

### Using defineOptions (Vue)

For Vue 3 pages, use the `defineOptions` compiler macro:

```vue
<script setup>
import { Head } from '@inertiajs/vue3'
import AppLayout from '@/layouts/AppLayout.vue'

defineOptions({
  layout: AppLayout
})

defineProps({
  features: Array
})
</script>

<template>
  <Head title="Features" />
  <section>
    <h1>Features</h1>
    <!-- Page content -->
  </section>
</template>
```

::: tip Vue 3.3+ Required
The `defineOptions` macro requires Vue 3.3 or higher. All Boring Stack templates use Vue 3.3+.
:::

### Setting layout property (React/Svelte)

For React and Svelte, assign the layout to the page component:

::: code-group

```jsx [React]
import { Head } from '@inertiajs/react'
import AppLayout from '@/layouts/AppLayout'

export default function Features({ features }) {
  return (
    <>
      <Head title="Features" />
      <section>
        <h1>Features</h1>
        {/* Page content */}
      </section>
    </>
  )
}

Features.layout = (page) => <AppLayout children={page} />
```

```svelte [Svelte]
<script context="module">
  import AppLayout from '@/layouts/AppLayout.svelte'

  export const layout = AppLayout
</script>

<script>
  export let features
</script>

<svelte:head>
  <title>Features</title>
</svelte:head>

<section>
  <h1>Features</h1>
  <!-- Page content -->
</section>
```

:::

## Why persistent layouts?

Persistent layouts provide several benefits:

### Maintaining state between pages

Since the layout component is not destroyed when navigating, any state in the layout persists:

```vue
<script setup>
import { Link } from '@inertiajs/vue3'
import { ref } from 'vue'

const sidebarOpen = ref(true)
const audioPlaying = ref(false)

function toggleSidebar() {
  sidebarOpen.value = !sidebarOpen.value
}
</script>

<template>
  <div class="flex">
    <aside v-show="sidebarOpen" class="w-64">
      <!-- Sidebar stays in same scroll position when navigating -->
      <nav class="overflow-y-auto">
        <Link href="/page-1">Page 1</Link>
        <Link href="/page-2">Page 2</Link>
        <Link href="/page-3">Page 3</Link>
      </nav>
    </aside>

    <main class="flex-1">
      <button @click="toggleSidebar">Toggle Sidebar</button>
      <slot />
    </main>

    <audio-player v-model:playing="audioPlaying" />
  </div>
</template>
```

When users navigate between pages, the sidebar remains open/closed based on their preference, and the audio player continues playing.

### Better performance

Since the layout is not recreated, there's less DOM manipulation and component initialization on each page visit, resulting in faster page transitions.

## Multiple layouts

You can create different layouts for different sections of your application.

### Example: Public vs. authenticated layouts

```
assets/js/layouts/
├── AppLayout.vue          # Public-facing pages
└── DashboardLayout.vue    # Authenticated dashboard pages
```

::: code-group

```vue [AppLayout.vue]
<script setup>
import { Link } from '@inertiajs/vue3'
</script>

<template>
  <div>
    <header>
      <nav>
        <Link href="/">Home</Link>
        <Link href="/features">Features</Link>
        <Link href="/login">Login</Link>
      </nav>
    </header>
    <main>
      <slot />
    </main>
  </div>
</template>
```

```vue [DashboardLayout.vue]
<script setup>
import { Link, usePage, router } from '@inertiajs/vue3'
import { computed } from 'vue'

const page = usePage()
const user = computed(() => page.props.loggedInUser)
</script>

<template>
  <div class="flex min-h-screen">
    <aside class="w-64 bg-gray-900 text-white">
      <nav class="p-4 space-y-2">
        <Link href="/dashboard">Dashboard</Link>
        <Link href="/dashboard/projects">Projects</Link>
        <Link href="/dashboard/settings">Settings</Link>
      </nav>
    </aside>

    <div class="flex-1">
      <header class="border-b p-4">
        <div class="flex justify-between items-center">
          <h1>Dashboard</h1>
          <button @click="router.delete('/logout')">
            Logout {{ user.name }}
          </button>
        </div>
      </header>
      <main class="p-6">
        <slot />
      </main>
    </div>
  </div>
</template>
```

:::

Then apply them to different pages:

::: code-group

```vue [pages/features.vue]
<script setup>
import AppLayout from '@/layouts/AppLayout.vue'

defineOptions({
  layout: AppLayout
})
</script>

<template>
  <section>
    <h1>Features</h1>
  </section>
</template>
```

```vue [pages/dashboard/index.vue]
<script setup>
import DashboardLayout from '@/layouts/DashboardLayout.vue'

defineOptions({
  layout: DashboardLayout
})
</script>

<template>
  <section>
    <h1>Dashboard Overview</h1>
  </section>
</template>
```

:::

## Nested layouts

You can nest layouts to create more complex UI hierarchies. Nested layouts are also persistent:

::: code-group

```vue [Vue]
<script setup>
import AppLayout from '@/layouts/AppLayout.vue'
import AccountLayout from '@/layouts/AccountLayout.vue'

defineOptions({
  layout: [AppLayout, AccountLayout]
})
</script>

<template>
  <section>
    <h1>Profile Settings</h1>
  </section>
</template>
```

```jsx [React]
import AppLayout from '@/layouts/AppLayout'
import AccountLayout from '@/layouts/AccountLayout'

export default function Profile() {
  return (
    <section>
      <h1>Profile Settings</h1>
    </section>
  )
}

Profile.layout = (page) => (
  <AppLayout>
    <AccountLayout children={page} />
  </AppLayout>
)
```

:::

With nested layouts, both the outer `AppLayout` and inner `AccountLayout` persist between page visits.

## Layout props

You can pass data to layouts through shared data or page props:

::: code-group

```vue [Vue]
<script setup>
import { Link, usePage } from '@inertiajs/vue3'
import { computed } from 'vue'

const page = usePage()
const loggedInUser = computed(() => page.props.loggedInUser)
</script>

<template>
  <div>
    <header>
      <nav>
        <Link href="/">Home</Link>
        <div v-if="loggedInUser">
          <span>{{ loggedInUser.name }}</span>
          <Link href="/logout" method="delete">Logout</Link>
        </div>
        <Link v-else href="/login">Login</Link>
      </nav>
    </header>
    <main>
      <slot />
    </main>
  </div>
</template>
```

```jsx [React]
import { Link, usePage } from '@inertiajs/react'

export default function AppLayout({ children }) {
  const { loggedInUser } = usePage().props

  return (
    <div>
      <header>
        <nav>
          <Link href="/">Home</Link>
          {loggedInUser ? (
            <div>
              <span>{loggedInUser.name}</span>
              <Link href="/logout" method="delete">
                Logout
              </Link>
            </div>
          ) : (
            <Link href="/login">Login</Link>
          )}
        </nav>
      </header>
      <main>{children}</main>
    </div>
  )
}
```

:::

Learn more about passing data to all pages in the [sharing data](/boring-stack/sharing-data) documentation.

## Active navigation links

You can highlight the current page in your navigation by checking the current URL:

::: code-group

```vue [Vue]
<script setup>
import { Link, usePage } from '@inertiajs/vue3'

function isCurrentUrl(...urls) {
  const currentUrl = usePage().url
  if (urls[0] === '/') {
    return currentUrl === '/'
  }
  return urls.some((url) => currentUrl.startsWith(url))
}
</script>

<template>
  <nav>
    <Link href="/" :class="{ 'text-blue-600 font-bold': isCurrentUrl('/') }">
      Home
    </Link>
    <Link
      href="/features"
      :class="{ 'text-blue-600 font-bold': isCurrentUrl('/features') }"
    >
      Features
    </Link>
    <Link
      href="/blog"
      :class="{ 'text-blue-600 font-bold': isCurrentUrl('/blog') }"
    >
      Blog
    </Link>
  </nav>
</template>
```

```jsx [React]
import { Link, usePage } from '@inertiajs/react'

export default function AppLayout({ children }) {
  const { url } = usePage()

  const isCurrentUrl = (...urls) => {
    if (urls[0] === '/') return url === '/'
    return urls.some((u) => url.startsWith(u))
  }

  return (
    <div>
      <nav>
        <Link
          href="/"
          className={isCurrentUrl('/') ? 'text-blue-600 font-bold' : ''}
        >
          Home
        </Link>
        <Link
          href="/features"
          className={isCurrentUrl('/features') ? 'text-blue-600 font-bold' : ''}
        >
          Features
        </Link>
        <Link
          href="/blog"
          className={isCurrentUrl('/blog') ? 'text-blue-600 font-bold' : ''}
        >
          Blog
        </Link>
      </nav>
      <main>{children}</main>
    </div>
  )
}
```

:::

## Flash messages in layouts

You can display flash messages in your layout by using the flash-to-toast composable:

::: code-group

```vue [Vue]
<script setup>
import { Link } from '@inertiajs/vue3'
import Toast from 'primevue/toast'
import { useFlashToast } from '@/composables/flashToast'

useFlashToast()
</script>

<template>
  <div>
    <header>
      <nav>
        <Link href="/">Home</Link>
      </nav>
    </header>
    <main>
      <slot />
    </main>
    <Toast />
  </div>
</template>
```

```jsx [React]
import { Link } from '@inertiajs/react'
import { Toast } from 'primereact/toast'
import { useFlashToast } from '@/hooks/flashToast'

export default function AppLayout({ children }) {
  useFlashToast()

  return (
    <div>
      <header>
        <nav>
          <Link href="/">Home</Link>
        </nav>
      </header>
      <main>{children}</main>
      <Toast />
    </div>
  )
}
```

:::

Learn more in the [flash messages](/boring-stack/flash-messages) documentation.

## Next steps

- Learn about [routing](/boring-stack/routing) to map URLs to pages
- Explore [navigation](/boring-stack/navigation) for client-side transitions
- Discover [shared data](/boring-stack/sharing-data) for passing common data to layouts
