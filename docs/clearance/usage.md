---
head:
  - - meta
    - property: 'og:image'
      content: https://docs.sailscasts.com/sails-clearane-social.png
title: Usage
titleTemplate: Sails Clearance
description: Learn how to effectively use Sails Clearance to manage user authentication and authorization in your Sails.js applications.
next: false
editLink: true
---

# Usage

To use Clearance roles and permissions in your app, simply map actions to the `has-clearance` policy you created earlier.

```js
// config/policies.js
module.exports.policies = {
  'admin/*': 'has-clearance',
  'api/v1/*': 'has-clearance',
  'api/v1/posts/*': 'has-clearance'
}
```

::: tip
Your user's role should be stored in the session as either `req.session.userRole` or `req.session.user.role`.
:::
