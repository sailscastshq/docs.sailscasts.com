---
head:
  - - meta
    - property: 'og:image'
      content: https://docs.sailscasts.com/boring-stack-social.png
title: Redirects
titleTemplate: The Boring JavaScript Stack 🥱
description: Redirecting in The Boring JavaScript Stack
prev:
  text: Navigation
  link: '/boring-stack/navigation'
next:
  text: Validation
  link: '/boring-stack/validation'
editLink: true
---

# Redirects {#redirects}

## Route target redirect

You can set up one route to redirect to another route within your app or even to another absolute URL in your `config/routes.js`.

```js
module.exports.routes = {
  '/chat': '/community',
  'GET /docs': 'https://docs.sailscasts.com'
}
```

::: info
Learn more about [Route target redirect](https://sailsjs.com/documentation/concepts/routes/custom-routes#?redirect-target-syntax) on the Sails docs.
:::

## Exit signal redirect

You can also set an exit to signal a redirect in your action.

```js
module.exports = {
  exits: {
    success: {
      responseType: 'redirect'
    }
  },
  fn: async function (inputs) {
    return '/'
  }
}
```

Notice we set the `responseType` to `redirect` and then we can return a URL string.

::: info
Learn more about [Actions and Controllers](https://sailsjs.com/documentation/concepts/actions-and-controllers) on the Sails docs.
:::

## 303 response code for SPAs

When redirecting after a `PUT`, `PATCH`, or `DELETE` request from your SPA, you must use a `303` response code, otherwise the subsequent request will not be treated as a `GET` request. A `303` redirect is very similar to a `302` redirect; however, the follow-up request is explicitly changed to a `GET` request.

The Boring Stack provides you with the `inertiaRedirect` custom response to do that in your controller actions:

```js
module.exports = {
  exits: {
    success: {
      responseType: 'inertiaRedirect'
    }
  },
  fn: async function (inputs) {
    return '/users'
  }
}
```

::: info
Learn more about [303 response code](https://inertiajs.com/redirects#303-response-code) on the Inertia docs.
:::

## External redirects

Sometimes it's necessary to redirect to an external website, or even another page in your app that's not an SPA. This can be accomplished using a server-side initiated `window.location` visit via the `inertiaRedirect` custom response.

```js
module.exports = {
  exits: {
    success: {
      responseType: 'inertiaRedirect'
    }
  },
  fn: async function (inputs) {
    return 'https://sailsjs.com'
  }
}
```

The `inertiaRedirect` custom response will generate a `409` Conflict response if the redirect request is coming from a `POST` or `GET` method and include the destination URL in the `X-Inertia-Location` header. When this response is received client-side, Inertia will automatically perform a `window.location = url` visit.
