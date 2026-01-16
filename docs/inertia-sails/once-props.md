---
title: Once Props
editLink: true
prev:
  text: View data
  link: '/inertia-sails/view-data'
next:
  text: Deferred props
  link: '/inertia-sails/deferred-props'
---

# Once Props

Once props are cached on the client and skipped during subsequent navigations. This is useful for expensive data that doesn't change often, like user profiles or permission lists.

## Basic Usage

Use `sails.inertia.once()` to create a cached prop:

```js
sails.inertia.share(
  'loggedInUser',
  sails.inertia.once(async () => {
    return await User.findOne({ id: req.session.userId })
  })
)
```

The callback is only executed on the first page load. On subsequent navigations, the client uses its cached version.

## Chainable Methods

### `.as(key)`

Set a custom cache key:

```js
sails.inertia.once(() => fetchPermissions()).as('user-permissions')
```

### `.until(seconds)`

Set a TTL (time-to-live) expiration:

```js
sails.inertia.once(() => fetchCountries()).until(3600) // Cache for 1 hour
```

### `.fresh(condition)`

Force refresh when a condition is true:

```js
sails.inertia.once(() => fetchUser()).fresh(req.query.refresh === 'true')
```

### Combining Methods

Methods are chainable:

```js
sails.inertia
  .once(() => fetchPermissions())
  .as('user-permissions')
  .until(3600)
  .fresh(req.query.refresh === 'true')
```

## Shorthand: shareOnce

`shareOnce()` is a shorthand for `share()` + `once()`:

```js
// These are equivalent:
sails.inertia.share(
  'countries',
  sails.inertia.once(() => Country.find())
)
sails.inertia.shareOnce('countries', () => Country.find())
```

## Refreshing from Actions

Use `sails.inertia.refreshOnce()` to invalidate cached props after data changes:

```js
// api/controllers/profile/update-profile.js
module.exports = {
  inputs: {
    fullName: { type: 'string', required: true }
  },

  exits: {
    success: { responseType: 'inertiaRedirect' }
  },

  fn: async function ({ fullName }) {
    await User.updateOne({ id: this.req.session.userId }).set({ fullName })

    // Force client to re-fetch the cached user
    sails.inertia.refreshOnce('loggedInUser')
    sails.inertia.flash('success', 'Profile updated!')

    return sails.inertia.back('/profile')
  }
}
```

Refresh multiple keys at once:

```js
sails.inertia.refreshOnce(['loggedInUser', 'teams', 'currentTeam'])
```

## Custom Hook Example

A complete example sharing user data with caching:

```js
// api/hooks/custom/index.js
module.exports = function defineCustomHook(sails) {
  return {
    routes: {
      before: {
        'GET /*': {
          skipAssets: true,
          fn: async function (req, res, next) {
            if (req.session.userId) {
              sails.inertia.share(
                'loggedInUser',
                sails.inertia.once(async () => {
                  return await User.findOne({ id: req.session.userId }).select([
                    'id',
                    'email',
                    'fullName',
                    'avatarUrl'
                  ])
                })
              )
            }
            return next()
          }
        }
      }
    }
  }
}
```

## When to Use Once Props

| Scenario                               | Use `once()` |
| -------------------------------------- | ------------ |
| User profile data                      | Yes          |
| Permission lists                       | Yes          |
| Reference data (countries, categories) | Yes          |
| Page-specific data                     | No           |
| Frequently changing data               | No           |

Once props shine for data that's:

- Expensive to fetch
- Used across multiple pages
- Changes infrequently

For data that changes often, use regular props or [Deferred Props](/inertia-sails/deferred-props).
