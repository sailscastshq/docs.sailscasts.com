---
prev:
  text: 'Configuration'
  link: '/connect-sqlite/configuration'
next: false
---

# API Reference

Connect SQLite implements the standard Express session store interface plus additional utility methods.

## Required Methods

These methods are part of the session store interface and are called automatically by Express/Sails.

### get(sid, callback)

Retrieve session data by session ID.

```javascript
store.get('abc123', (err, session) => {
  if (err) console.error(err)
  console.log(session) // { user: { id: 1 }, cookie: { ... } }
})
```

### set(sid, session, callback)

Store session data for a session ID.

```javascript
store.set('abc123', { user: { id: 1 } }, (err) => {
  if (err) console.error(err)
  console.log('Session saved')
})
```

### destroy(sid, callback)

Delete a session by ID.

```javascript
store.destroy('abc123', (err, count) => {
  if (err) console.error(err)
  console.log(`Deleted ${count} session(s)`)
})
```

### touch(sid, session, callback)

Refresh a session's TTL without modifying its data. Used for sliding session expiration.

```javascript
store.touch('abc123', session, (err, result) => {
  if (err) console.error(err)
  console.log(result) // 'OK' or 'EXPIRED'
})
```

## Optional Methods

These methods are not required by the session store interface but are useful for session management.

### length(callback)

Get the count of all active sessions.

```javascript
store.length((err, count) => {
  console.log(`Active sessions: ${count}`)
})
```

### clear(callback)

Delete all sessions.

```javascript
store.clear((err, count) => {
  console.log(`Cleared ${count} sessions`)
})
```

### ids(callback)

Get all active session IDs.

```javascript
store.ids((err, ids) => {
  console.log(ids) // ['abc123', 'def456', ...]
})
```

### all(callback)

Get all active sessions with their data.

```javascript
store.all((err, sessions) => {
  sessions.forEach((session) => {
    console.log(session.id, session.user)
  })
})
```

### close()

Close the database connection. Call this when shutting down to clean up resources.

```javascript
store.close()
```

::: warning
After calling `close()`, the store can no longer be used.
:::

## TTL Behavior

Session TTL (time-to-live) is determined in this order:

1. **`cookie.expires`** - If the session has a cookie with an expires date
2. **`cookie.maxAge`** - If the session has a cookie with maxAge (in milliseconds)
3. **`ttl` option** - The default TTL configured when creating the store

```javascript
// TTL from cookie.expires
store.set(
  'abc',
  {
    cookie: { expires: new Date(Date.now() + 3600000) } // 1 hour
  },
  callback
)

// TTL from cookie.maxAge
store.set(
  'abc',
  {
    cookie: { maxAge: 3600000 } // 1 hour in ms
  },
  callback
)

// Falls back to default TTL (86400 seconds = 1 day)
store.set('abc', { user: { id: 1 } }, callback)
```

## Expired Sessions

When a session with a negative TTL is set (i.e., it's already expired), the store will automatically destroy it instead of saving it.

```javascript
// This will destroy the session, not save it
store.set(
  'abc',
  {
    cookie: { expires: new Date(Date.now() - 1000) } // In the past
  },
  callback
)
```
