---
head:
  - - meta
    - property: 'og:image'
      content: https://docs.sailscasts.com/sails-stash-social.png
title: Configuration
titleTemplate: Sails Stash
description: Learn how to configure Sails Stash in your Sails applications.
prev:
  text: Cache usage
  link: '/sails-stash/cache-usage'
next: false
editLink: true
---

# Configuration

## `cachestores`

- Default: `{ default: { store: 'redis', datastore: 'cache'}}`

You can configure one or more cache stores in `config/cachestores.js`. If this file does not exist do well to create it.

```js
module.exports.cachestores = {
  default: {
    store: 'redis',
    datastore: 'myCache'
  }
}
```

::: warning
Make sure there is a datastore set in `config/datastores.js` or equivalent config file that has the name `myCache`
:::

You can have more than one cache store:

```js
module.exports.cachestores = {
  default: {
    store: 'redis',
    datastore: 'myCache'
  },
  redis: {
    store: 'redis',
    datastore: 'anotherRedisCache'
  }
}
```

## `stash`

- Default: ` { cachestore: 'default', }`

An object with properties to configure Sails Stash. You can create a `config/stash.js` to set these properties.

```js
module.exports.stash = {
  cachestore: 'redis'
}
```

## `cachestore`

- Default: `default`

Specify the default cache store to use for accessing a cache instance. Specify this config in `sails.config.stash`

```js
module.exports.stash = {
  cachestore: 'memcached'
}
```
