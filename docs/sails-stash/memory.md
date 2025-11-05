# Memory

The Memory store is the default cache backend for Sails Stash. It provides a simple, zero-configuration solution for caching data in memory, making it perfect for development and getting started quickly.

## Features

- **Zero Configuration**: Works out of the box with no setup required
- **Fast**: Direct memory access provides the fastest possible cache operations
- **Simple**: No external dependencies or services to manage
- **Automatic**: Enabled by default when you install Sails Stash
- **TTL Support**: Per-key time-to-live with automatic cleanup

## Usage

Since Memory is the default store, you can start using Sails Stash immediately after installation without any configuration:

```js
await sails.cache.fetch(
  'posts',
  async function () {
    return await Post.find()
  },
  6000
)
```

## How It Works

The Memory store uses a JavaScript `Map` to store cached values in memory. Each cached item can have an optional TTL (time-to-live), and expired entries are automatically cleaned up every minute.

## When to Use Memory Store

The Memory store is ideal for:

- **Development environments**: Quick setup with no external dependencies
- **Single-instance applications**: When you don't need distributed caching
- **Short-lived data**: Data that can be regenerated if lost on restart
- **Testing**: Fast and predictable cache behavior for tests

## Limitations

Keep in mind these limitations of the Memory store:

- **Not persistent**: Cache is cleared when the application restarts
- **Not distributed**: Each instance maintains its own separate cache
- **Memory-bound**: Limited by available server memory
- **Single-process**: Doesn't share cache between clustered processes

## For Production

While the Memory store works in production, consider using [Redis](/sails-stash/redis) for production environments that require:

- Persistent caching across restarts
- Distributed caching across multiple servers
- Larger cache sizes
- Shared cache between clustered processes

::: tip
You can use the Memory store in production for simple applications or as a fallback option. Just be aware of its limitations regarding persistence and distribution.
:::
