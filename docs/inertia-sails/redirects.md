---
title: Redirects
editLink: true
prev:
  text: Inertia responses
  link: '/inertia-sails/responses'
next:
  text: Sharing data
  link: '/inertia-sails/sharing-data'
---

# Redirects

inertia-sails provides helpers for Inertia-compatible redirects.

## Inertia Redirect Response

To redirect using Inertia, use the `inertiaRedirect` response type:

```js
module.exports = {
  exits: {
    success: {
      responseType: 'inertiaRedirect'
    }
  },

  fn: async function () {
    await User.create({ ... })
    return '/users'  // Redirect to /users
  }
}
```

## Back Navigation

Use `sails.inertia.back()` to redirect to the previous page:

```js
module.exports = {
  exits: {
    success: {
      responseType: 'inertiaRedirect'
    }
  },

  fn: async function () {
    await Profile.updateOne({ id: this.req.session.userId }).set({
      fullName: inputs.fullName
    })

    sails.inertia.flash('success', 'Profile updated!')
    return sails.inertia.back('/dashboard')
  }
}
```

The `back()` helper accepts a fallback URL that's used when there's no referrer (e.g., direct navigation):

```js
// If referrer exists, redirects there
// Otherwise, redirects to /dashboard
return sails.inertia.back('/dashboard')
```

::: info
Express 5 deprecated `res.redirect('back')`, so inertia-sails provides this explicit helper instead.
:::

## Preserving URL Fragments

Use `sails.inertia.preserveFragment()` when a standard Inertia redirect should
carry the current URL hash to the redirected page.

```js
module.exports = {
  exits: {
    success: {
      responseType: 'redirect'
    }
  },

  fn: async function () {
    const article = await Article.findOne({ slug: this.req.param('slug') })

    sails.inertia.preserveFragment()
    return `/articles/${article.canonicalSlug}`
  }
}
```

If the user starts from `/articles/old-slug#comments`, the Inertia client can
carry `#comments` to `/articles/new-slug#comments` after the redirect.

Use this with normal `redirect` responses. The `inertiaRedirect` response is a
full page visit and should be reserved for external redirects or cases where you
intentionally want to reset the page.

## External Redirects

For external redirects that require a full page load:

```js
fn: async function () {
  // This triggers a full page redirect, not an Inertia visit
  return this.res.redirect('https://external-site.com/callback')
}
```

## Redirect After Form Submission

A common pattern is redirecting back with a flash message after form submission:

```js
module.exports = {
  inputs: {
    email: { type: 'string', required: true }
  },

  exits: {
    success: {
      responseType: 'inertiaRedirect'
    }
  },

  fn: async function ({ email }) {
    await Newsletter.subscribe(email)

    sails.inertia.flash('success', 'Thanks for subscribing!')
    return sails.inertia.back('/newsletter')
  }
}
```
