---
head:
  - - meta
    - property: 'og:image'
      content: https://docs.sailscasts.com/boring-stack-social.png
title: Pages
titleTemplate: The Boring JavaScript Stack 🥱
description: Learn how to create and organize pages in The Boring JavaScript Stack
prev:
  text: Navigation
  link: /boring-stack/navigation
next:
  text: Layouts
  link: /boring-stack/layouts
editLink: true
---

# Pages

Pages are the building blocks of your Boring Stack application. They represent the views that users interact with and are rendered by Inertia.js on the frontend.

## Creating pages

Pages in The Boring Stack are frontend components (Vue, React, or Svelte) that live in your `assets/js/pages/` directory. Each page component is rendered by a backend action that uses Inertia.js.

### Page structure

::: code-group

```vue [Vue]
<script setup>
import { Head } from '@inertiajs/vue3'

defineProps({
  blogPosts: Array
})
</script>

<template>
  <Head title="Blog" />
  <section>
    <h1>Blog</h1>
    <article v-for="post in blogPosts" :key="post.id">
      <h2>{{ post.title }}</h2>
      <p>{{ post.description }}</p>
    </article>
  </section>
</template>
```

```jsx [React]
import { Head } from '@inertiajs/react'

export default function Blog({ blogPosts }) {
  return (
    <>
      <Head title="Blog" />
      <section>
        <h1>Blog</h1>
        {blogPosts.map((post) => (
          <article key={post.id}>
            <h2>{post.title}</h2>
            <p>{post.description}</p>
          </article>
        ))}
      </section>
    </>
  )
}
```

```svelte [Svelte]
<script>
  import { inertia } from '@inertiajs/svelte'

  export let blogPosts
</script>

<svelte:head>
  <title>Blog</title>
</svelte:head>

<section>
  <h1>Blog</h1>
  {#each blogPosts as post (post.id)}
    <article>
      <h2>{post.title}</h2>
      <p>{post.description}</p>
    </article>
  {/each}
</section>
```

:::

## Rendering pages

To render a page, you need to create a Sails action that returns data with the `inertia` response type.

### Basic page action

Create an action in `api/controllers/`:

```js path=/api/controllers/blog/view-blog.js start=1
module.exports = {
  friendlyName: 'View blog',

  description: 'Display blog listing page.',

  exits: {
    success: {
      responseType: 'inertia'
    }
  },

  fn: async function () {
    return {
      page: 'blog'
    }
  }
}
```

The `page` property specifies which component to render. In this example, Inertia will look for `assets/js/pages/blog.vue` (or `.jsx`, `.svelte` depending on your frontend).

### Passing data to pages

To pass data to your page component, include a `props` object:

```js path=/api/controllers/blog/view-blog.js start=1
module.exports = {
  friendlyName: 'View blog',

  description: 'Display blog listing page.',

  exits: {
    success: {
      responseType: 'inertia'
    }
  },

  fn: async function () {
    const blogPosts = await Blog.find({
      select: ['title', 'description', 'publishedOn', 'slug']
    })

    blogPosts.sort((a, b) => new Date(b.publishedOn) - new Date(a.publishedOn))

    return {
      page: 'blog',
      props: {
        blogPosts
      }
    }
  }
}
```

These props will be available in your page component as props.

## Organizing pages

As your application grows, you'll want to organize pages into subdirectories:

```
assets/js/pages/
├── index.vue
├── features.vue
├── contact.vue
├── blog/
│   ├── index.vue
│   └── post.vue
├── auth/
│   ├── login.vue
│   ├── signup.vue
│   └── forgot-password.vue
└── dashboard/
    ├── index.vue
    └── settings.vue
```

When using nested directories, specify the path in your action:

```js
return {
  page: 'blog/post',
  props: {
    post
  }
}
```

::: tip
The page path is relative to `assets/js/pages/` and should not include the file extension.
:::

## Setting page metadata

Use the `Head` component from Inertia to set page-specific metadata like titles, descriptions, and Open Graph tags:

::: code-group

```vue [Vue]
<script setup>
import { Head } from '@inertiajs/vue3'
</script>

<template>
  <Head title="About Us">
    <meta name="description" content="Learn more about our company" />
    <meta property="og:title" content="About Us" />
  </Head>
  <!-- Page content -->
</template>
```

```jsx [React]
import { Head } from '@inertiajs/react'

export default function About() {
  return (
    <>
      <Head title="About Us">
        <meta name="description" content="Learn more about our company" />
        <meta property="og:title" content="About Us" />
      </Head>
      {/* Page content */}
    </>
  )
}
```

```svelte [Svelte]
<svelte:head>
  <title>About Us</title>
  <meta name="description" content="Learn more about our company">
  <meta property="og:title" content="About Us">
</svelte:head>

<!-- Page content -->
```

:::

## Page-specific styles

You can add scoped styles directly in your page components:

::: code-group

```vue [Vue]
<template>
  <section class="hero">
    <h1>Welcome</h1>
  </section>
</template>

<style scoped>
.hero {
  background: linear-gradient(to right, #667eea, #764ba2);
  padding: 4rem 2rem;
}
</style>
```

```jsx [React]
export default function Home() {
  return (
    <section className="hero">
      <h1>Welcome</h1>
      <style jsx>{`
        .hero {
          background: linear-gradient(to right, #667eea, #764ba2);
          padding: 4rem 2rem;
        }
      `}</style>
    </section>
  )
}
```

```svelte [Svelte]
<section class="hero">
  <h1>Welcome</h1>
</section>

<style>
.hero {
  background: linear-gradient(to right, #667eea, #764ba2);
  padding: 4rem 2rem;
}
</style>
```

:::

## Next steps

- Learn about [layouts](/boring-stack/layouts) to create consistent page structures
- Explore [routing](/boring-stack/routing) to map URLs to your pages
- Discover [shared data](/boring-stack/sharing-data) for passing common data to all pages
