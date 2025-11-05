---
head:
  - - meta
    - property: 'og:image'
      content: https://docs.sailscasts.com/sails-stash-social.png
title: Redis
titleTemplate: Sails Stash
description: Learn how to set up and configure Redis as your cache store with Sails Stash. Follow step-by-step instructions to optimize your Sails application's performance with lightning-fast data retrieval using Redis.
prev:
  text: Memory
  link: '/sails-stash/memory'
next:
  text: Memcached
  link: '/sails-stash/memcached'
editLink: true
---

# Redis

## Install adapter

To setup Sails Stash to use Redis as the cache store, install the [sails-redis](https://github.com/balderdash/sails-redis) Waterline adapter:

```sh
npm i sails-redis
```

## Setup datastore

Next, setup the datastore for your cache in `config/datastores.js`:

```js
module.exports.datastores = {
  default: {}
  cache: {
    adapter: 'sails-redis',
    url: 'redis://localhost:6379'
  }
}
```

That's it, your Sails app is now ready to use Redis for caching 🥳.

::: tip
In production, do make sure to replace the `url` to Redis with an environment variable like `process.env.REDIS_CACHE_URL`
:::
