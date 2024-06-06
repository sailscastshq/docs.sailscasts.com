---
head:
  - - meta
    - property: 'og:image'
      content: https://docs.sailscasts.com/boring-stack-social.png
title: Getting started
titleTemplate: The Boring JavaScript Stack 🥱
description: The Boring JavaScript Stack let's you build full-stack JavaScript apps with Vue, React, or Svelte.
prev:
  text: What's in the stack?
  link: /boring-stack/whats-in-the-stack
next:
  text: Routing
  link: /boring-stack/routing
editLink: true
---

# Getting started

To get started with The Boring JavaScript Stack, use `create-sails` — a CLI tool that scaffolds a new Sails project, configured as a full-stack JavaScript application with The Boring Stack conventions:

::: code-group

```sh [Vue]
npx create-sails project-name --vue
```

```sh [React]
npx create-sails project-name --react
```

```sh [Svelte]
npx create-sails project-name --svelte
```

:::

::: info
Make sure to replace `project-name` with the name of your project.
:::

Then `cd` into your project and run `npm i`:

```sh
cd project-name && npm i
```

## Start your app

To start you app simply run:

```sh
npm run dev
```

::: info sails lift
You can also run your app with `npx sails l`.
:::

## What's next?

For next steps, you have two options:

1. Open your project in your code editor and explore.
2. Begin by learning the basics, such as [routing](/boring-stack/routing) and [navigation](/boring-stack/navigation).

::: info Sailboat VS Code extension
Install the [Sailboat extension](https://marketplace.visualstudio.com/items?itemName=dominuskelvin.sailboat) which provides tooling for Sails.
:::

## Star the repo :star:

::: tip Star The Boring JavaScript Stack repo on GitHub :star:
If The Boring JavaScript Stack speaks to you, show it some love with [a star on GitHub](https://github.com/sailscastshq/boring-stack).
:::
