---
head:
  - - meta
    - property: 'og:image'
      content: https://docs.sailscasts.com/sails-clearane-social.png
title: Getting started
titleTemplate: Sails Clearance
description: Learn how to get started with Sails Clearance, a powerful tool for managing user authentication and authorization in your Sails.js applications.
next:
  text: Usage
  link: '/clearance/usage'
editLink: true
---

# Getting started

Sails Clerance is a Sails hook for managing role-based access control (RBAC) with numeric clearance levels with numeric clearance levels.

## Installation

To get started with Sails Clearance, install it via NPM

```sh
npm install sails-hook-clearance
```

## Configuration

After installation, create a `config/clearance.js` file in your Sails app to setup up `roles` and `permissions` for your application.

```js
// config/clearance.js
module.exports.clearance = {
  roles: {
    guest: 0,
    user: 1,
    admin: 2,
    superadmin: 3
  },
  permissions: {
    'admin/*': { level: 2 },
    'api/v1/users/create': { level: 2 },
    'api/v1/posts/*': { level: 1 }
  }
}
```

## `has-clearance` policy

Create a `has-clearance` [policy](https://sailsjs.com/documentation/concepts/policies) in `api/policies`:

```js
// api/policies/has-clearance.js
module.exports = function (req, res, next) {
  return sails.hooks.clearance.check(req, res, next)
}
```

Create a policy preferably called `has-clearance` in `api/policies` and add the following code:

And that's it, you've setup RBAC for your applicatoin with Clearance.
