---
head:
  - - meta
    - property: 'og:image'
      content: https://docs.sailscasts.com/boring-stack-social.png
title: Session
titleTemplate: The Boring JavaScript Stack 🥱
description: The Boring JavaScript Stack ships with Session based authentication
prev:
  text: 'Email'
  link: '/boring-stack/email'
next:
  text: 'File uploads'
  link: '/boring-stack/file-uploads'
editLink: true
---

# Session

A session is a mechanism that enables websites to store and retrieve user-specific information temporarily. It allows for personalized and stateful interactions during a user's visit.

### Example use cases

- **User authentication:** Keeping track of whether a user is logged in or not.
- **Shopping cart persistence:** Retaining items in a user's shopping cart across different pages.
- **Personalized preferences:** Storing and recalling user-specific settings or preferences.

## In memory session store

**The Boring JavaScript Stack** ships with the tried and tested session-based authentication. In development you can rely on the in-memory Sails session store that works out of the box.

Because the default session store is in memory, when you close the Sails server, the current session store disappears.

::: info
Learn more about [how sessions work](https://sailsjs.com/documentation/concepts/sessions) on the Sails docs.
:::

## Persistent session store

Redis is a popular choice to use as a persistent session store. To set it up, install `@sailshq/connect-redis` and then update `config/session.js`:

::: code-group

```sh [terminal]
npm i @sailshq/connect-redis --save
```

```js [config/session.js]
module.exports.session = {
  adapter: '@sailshq/connect-redis',
  url: 'redis://localhost:6379'
}
```

:::

## Accessing the session store

In **The Boring JavaScript Stack**, the session store is accessed in your actions via `this.req.session`. This provides a convenient way to interact with user session data within your application. Below is an example of logging in a user:

```js
module.exports = {
  fn: async function ({ email, password, rememberMe }) {
    const user = await User.findOne({
      email: email.toLowerCase()
    })

    if (!user) {
      throw 'badCombo'
    }

    await sails.helpers.passwords
      .checkPassword(password, user.password)
      .intercept('incorrect', 'badCombo')

    if (rememberMe) {
      this.req.session.cookie.maxAge =
        sails.config.custom.rememberMeCookieMaxAge
    }

    this.req.session.userId = user.id
    return '/'
  }
}
```
