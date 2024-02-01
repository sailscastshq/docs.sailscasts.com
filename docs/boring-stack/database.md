---
title: Database
titleTemplate: The Boring JavaScript Stack 🥱
description: Database in The Boring JavaScript Stack
prev:
  text: Authorization
  link: '/boring-stack/authorization'
next:
  text: Email
  link: '/boring-stack/email'
editLink: true
---

# Database

## Sails Disk

During development, The Boring JavaScript Stack utilizes the [Sails Disk](https://sailsjs.com/documentation/concepts/extending-sails/adapters/available-adapters#sails-disk) adapter for Waterline, allowing you to kickstart your app without worrying about setting up a database.

::: info
Learn more about [Sails Disk](https://sailsjs.com/documentation/concepts/extending-sails/adapters/available-adapters#?sailsdisk) on the Sails docs.
:::

## Setting up a database

To set up a database, you can choose the adapter for your chosen database and follow the setup steps.

## PostgreSQL

::: code-group

```sh [terminal]
npm i sails-postgresql --save
```

```js [config/datastores.js]
module.exports.datastores = {
  default: {
    adapter: 'sails-postgresql', // [!code focus]
    url: 'postgresql://user:password@host:port/database' // [!code focus]
  }
}
```

:::

## MySQL

::: code-group

```sh [terminal]
npm i sails-mysql --save
```

```js [config/datastores.js]
module.exports.datastores = {
  default: {
    adapter: 'sails-mysql', // [!code focus]
    url: 'mysql://user:password@host:port/database' // [!code focus]
  }
}
```

:::

## MongoDB

::: code-group

```sh [terminal]
npm i sails-mongo --save
```

```js [config/datastores.js]
module.exports.datastores = {
  default: {
    adapter: 'sails-mongo', // [!code focus]
    url: 'mongodb://user:password@host:port/database' // [!code focus]
  }
}
```

:::

## SQLite

::: info Coming soon
The SQLite adapter is under development. You can keep an eye on the [repo](https://github.com/sailscastshq/sails-sqlite).
:::
