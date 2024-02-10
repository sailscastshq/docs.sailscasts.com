---
head:
  - - meta
    - property: 'og:image'
      content: https://docs.sailscasts.com/sails-stash-social.png
title: Cache usage
titleTemplate: Sails Stash
description: Discover the expressive API Sails Stash exposes for caching
prev:
  text: Memcached
  link: '/sails-stash/memcached'
next:
  text: Configuration
  link: '/sails-stash/configuration'
editLink: true
---

# Cache usage

## Obtaining a cache instance

To obtain a cache store instance, use `sails.cache`. The `sails.cache` object provides convenient, terse access to the underlying implementations of cache stores in Sails Stash.

```js
module.exports = {
  fn: async function () {
    const value = await sails.cache.get('key')
    return { value }
  }
}
```

## Accessing multiple cache stores

Using the `sails.cache` object, you may access various cache stores via the `store` method. The key passed to the store method should correspond to one of the stores listed in [`sails.config.cachestores`](/sails-stash/configuration#cachestores) in your `config/cachestores.js` configuration file.

```js
const value = sails.cache.store('memcached').get('foo')

sails.cache.store('redis').set('bar', 'baz', 1200) // 20 Minutes
```

## Retrieving items from the cache

The `get` method is used to retrieve items from the cache. If the item does not exist in the cache, `undefined` will be returned. If you wish, you may pass a second argument to the get method specifying the default value you wish to be returned if the item doesn't exist:

```js
let value = sails.cache.get('key')

value = sails.cache.get('key', 'default')
```

You may even pass a callback as the default value. The result of the callback will be returned if the specified item does not exist in the cache. Passing a callback allows you to defer the retrieval of default values from a database or other external service:

```js
const users = await sails.cache.get('key', async () => {
  return await User.find()
})
```

## Checking if an item exists

The `has` method allows you to check if an item exists in the cache. It will return false even if the item exists but its value is null.

```js
const keyExist = sails.cache.has('key')
```

## Get and store

At times, you might need to fetch an item from the cache while also setting a default value if the requested item is not found.

For instance, you may want to fetch users from the cache, or if absent, retrieve them from the database and cache them. This can be accomplished using the `fetch` method.

```js
const users = sails.cache.fetch('users', ttlInSeconds, async function () {
  return await User.find()
})
```

If the item is not found in the cache, the callback provided to the `fetch` method will be invoked, and its result will be stored in the cache.

::: info
if you don't pass `ttlInSeconds` - a time to expire - the item will be cached forever.
:::

## Get and remove

If you want to fetch an item from the cache and subsequently delete it, you can utilize the `pull` method. Similar to the `get` method, if the item doesn't exist in the cache, it will return `undefined`.

```js
const value = sails.cache.pull('key')
```

## Removing item From the cache

You may remove items from the cache using the `delete` method:

```js
sails.cache.delete('key') // Remove a single item

sails.cache.delete(['key1', 'key2', , 'key3']) // Remove multipe items
```

You may also remove items by providing a zero or negative number of expiration seconds:

```js
sails.cache.set('key', 'value', 0)

sails.cache.set('key', 'value', -10)
```

You may clear the entire cache using the `destroy` method:

```js
sails.cache.destroy()
```

::: warning
Clearing a cache will remove all its data. It's generally not recommended in production, especially if other parts of your application, such as user sessions, rely on the same store.
:::
