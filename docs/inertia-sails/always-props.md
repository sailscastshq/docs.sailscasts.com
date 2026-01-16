---
title: Always Props
editLink: true
prev:
  text: Optional props
  link: '/inertia-sails/optional-props'
next:
  text: Infinite scroll
  link: '/inertia-sails/infinite-scroll'
---

# Always Props

Always props are included in every response, even during partial reloads. This ensures critical data is always available.

## Basic Usage

Use `sails.inertia.always()` to mark a prop as always included:

```js
module.exports = {
  exits: {
    success: { responseType: 'inertia' }
  },

  fn: async function () {
    return {
      page: 'dashboard',
      props: {
        // Normal props - excluded during partial reloads unless requested
        stats: await Stats.find(),

        // Always included, even in partial reloads
        csrf: sails.inertia.always(() => this.req.csrfToken()),
        flash: sails.inertia.always(() => this.req.flash())
      }
    }
  }
}
```

## Use Cases

### CSRF Tokens

```js
props: {
  csrf: sails.inertia.always(() => this.req.csrfToken())
}
```

Ensures forms always have a valid CSRF token.

### Flash Messages

```js
props: {
  flash: sails.inertia.always(() => ({
    success: this.req.flash('success'),
    error: this.req.flash('error')
  }))
}
```

### Current User State

```js
props: {
  isAuthenticated: sails.inertia.always(() => !!this.req.session.userId)
}
```

## In Custom Hooks

Share always-included data globally:

```js
// api/hooks/custom/index.js
module.exports = function defineCustomHook(sails) {
  return {
    routes: {
      before: {
        'GET /*': {
          skipAssets: true,
          fn: async function (req, res, next) {
            sails.inertia.share(
              'csrf',
              sails.inertia.always(() => req.csrfToken?.() || null)
            )
            return next()
          }
        }
      }
    }
  }
}
```

## Always vs Regular Props

| Feature        | Regular Props | Always Props           |
| -------------- | ------------- | ---------------------- |
| Full page load | Included      | Included               |
| Partial reload | Excluded\*    | Included               |
| Use case       | Page data     | Security tokens, state |

\*Unless explicitly requested via `only`

## When to Use Always Props

Use `always()` for:

- CSRF tokens
- Flash messages
- Authentication state
- Critical security data

Avoid `always()` for:

- Large data sets
- Page-specific content
- Data that rarely changes

Keep always props small to minimize payload size on partial reloads.
