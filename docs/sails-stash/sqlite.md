---
head:
  - - meta
    - property: 'og:image'
      content: https://docs.sailscasts.com/sails-stash-social.png
title: SQLite
titleTemplate: Sails Stash
description: Learn how to set up and configure SQLite as your cache store with Sails Stash. A persistent, file-based cache store that requires no external services.
prev:
  text: Redis
  link: '/sails-stash/redis'
next:
  text: Memcached
  link: '/sails-stash/memcached'
editLink: true
---

# SQLite

The SQLite store provides a persistent, file-based cache backend for Sails Stash. It's a great option when you need cache persistence without running an external service like Redis.

## Install adapter

To setup Sails Stash to use SQLite as the cache store, install the [sails-sqlite](https://github.com/sailscastshq/sails-sqlite) adapter:

```sh
npm i sails-sqlite
```

## Setup datastore

Next, setup the datastore for your cache in `config/datastores.js`:

```js
module.exports.datastores = {
  default: {},
  cache: {
    adapter: 'sails-sqlite',
    url: 'db/cache.sqlite'
  }
}
```

## Setup cache store

Then configure Sails Stash to use the SQLite store in `config/cachestores.js`:

```js
module.exports.cachestores = {
  default: {
    store: 'sqlite',
    datastore: 'cache'
  }
}
```

That's it, your Sails app is now ready to use SQLite for caching 🥳.

## When to Use SQLite Store

The SQLite store is ideal for:

- **Single-server deployments**: When you don't need distributed caching across multiple servers
- **Persistent caching**: Cache survives application restarts without running an external service
- **Existing SQLite apps**: If your Sails app already uses `sails-sqlite`, you can reuse it for caching
- **Simple setups**: No need to install, configure, or maintain a separate Redis server

## Limitations

Keep in mind these limitations of the SQLite store:

- **Not distributed**: Each server maintains its own separate cache file
- **Single-writer**: SQLite supports one writer at a time, which may bottleneck under heavy concurrent writes
- **Disk-bound**: Slower than in-memory caching for read-heavy workloads

::: tip
For applications that need distributed caching across multiple servers, consider using [Redis](/sails-stash/redis) instead.
:::
