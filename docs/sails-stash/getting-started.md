---
head:
  - - meta
    - property: 'og:image'
      content: https://docs.sailscasts.com/sails-stash-social.png
title: Getting started
titleTemplate: Sails Stash
description: Getting started with Sails Content in a Sails application
next:
  text: Redis
  link: '/sails-stash/redis'
editLink: true
---

# Introduction

Caching plays a crucial role in optimizing the performance of web applications by storing frequently accessed data in a fast data store.

Sails Stash offers a streamlined API across multiple cache backends like [Redis](/sails-stash/redis), empowering you to harness their lightning-fast data retrieval capabilities and speed up your Sails web application.

## Installation

To get started with Sails Stash, simply run the following command in your Sails applications

```sh
npm i sails-stash
```

## Zero Configuration

As of version **0.0.2**, Sails Stash works out of the box with **no configuration required**. It uses an in-memory store by default, making it perfect for getting started quickly without needing to set up Redis or any other cache backend.

```js
await sails.cache.fetch(
  'posts',
  async function () {
    return await Post.find()
  },
  6000
)
```

::: info
You can optionally configure Redis or other cache stores for any environment. The memory store is just the default to help you get started quickly.
:::

## Supported stores

Sails Stash supports the following cache backends:

- **Memory** (default) - Zero-config in-memory caching
- [Redis](/sails-stash/redis) - Persistent, distributed caching
- Memcached <Badge type="warning" text="coming soon" />

You can configure any of these stores for development or production. Follow the instructions to setup [Redis](/sails-stash/redis) for persistent caching in your Sails apps.

## Star the repo :star:

::: tip Star the Sails Stash repo on GitHub :star:
If you like Sails Stash, show it some love with [a star on GitHub](https://github.com/sailscastshq/sails-stash).
:::
