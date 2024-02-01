---
head:
  - - meta
    - property: 'og:image'
      content: https://docs.sailscasts.com/boring-stack-social.png
title: Routing
titleTemplate: The Boring JavaScript Stack 🥱
description: In The Boring JavaScript Stack, all of your application's routes are defined server-side. This means that you don't need Vue Router or React Router.
prev:
  text: 'Getting Started'
  link: '/boring-stack/getting-started'
next:
  text: Navigation
  link: '/boring-stack/navigation'
editLink: true
---

# Routing

## Defining routes

In The Boring JavaScript Stack, all of your application's routes are defined server-side. This means that you don't need Vue Router or React Router.

Instead, you can simply define [Sails routes](https://sailsjs.com/documentation/concepts/routes) and return an Inertia responses for SPA or return a server-side view for server-side rendering from those routes.

For example let's say we want to create a `/users` route, we can define the route in `config/routes.js`:

```js
module.exports.routes = {
  'GET /users': 'user/view-users' // [!code focus]
}
```

The above route definition means that when a user requests the `/users` page of your app, the `view-users` action of the `user` controller will handle that request. Let's implement `user/view-users`.

::: tip
Run `npx sails generate action user/view-users` to scaffold the action.
:::

```js
module.exports = {
  inputs: {},
  exits: {
    success: {}
  },
  fn: async function (inputs) {
    const users = await User.find()
    return sails.inertia.render('users/index', { users }) // [!code focus]
  }
}
```
