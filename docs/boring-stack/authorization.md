---
title: Authorization
titleTemplate: The Boring JavaScript Stack 🥱
description: Authorization in The Boring JavaScript Stack
prev:
  text: Authentication
  link: '/boring-stack/authentication'
next:
  text: Database
  link: '/boring-stack/database'
editLink: true
---

# Authorization

Authorization within The Boring JavaScript Stack is orchestrated server-side through [Sails Policies](https://sailsjs.com/documentation/concepts/policies). These policies act as a shield, safeguarding your actions against unauthorized access.

A common scenario involves permitting a user to access your dashboard exclusively when authenticated. To implement this, you can establish a `api/policies/is-authenticated.js` policy and then configure the actions you wish the policy to safeguard in `config/policies.js`:

::: code-group

```js[api/policies/is-authenticated.js]
module.exports = async function (req, res, proceed) {
  if (req.session.userId) return proceed()
  return res.redirect('/signin')
}
```

```js[config/policies.js]
module.exports.policies = {
  'dashboard/*': 'is-authenticated'
}
```

:::

::: info
Learn more about using [policies](https://sailsjs.com/documentation/concepts/policies) for authorization on the Sails docs.
:::
