---
head:
  - - meta
    - property: 'og:image'
      content: https://docs.sailscasts.com/boring-stack-social.png
title: Deploy on Render
titleTemplate: The Boring JavaScript Stack 🥱
description: Deploy your app on Render
prev:
  text: 'Slipway'
  link: '/boring-stack/slipway'
next:
  text: Railway
  link: '/boring-stack/railway'
editLink: true
---

# Deploy on Render

Let's deploy your app on [Render](https://render.com) :rocket:

## GitHub Repo

Push your app to a repo on GitHub.

## Create database

Create the database you want to use for production on Render and take note of the connection url.
::: info Database creation guides
See guides for [MySQL](https://docs.render.com/deploy-mysql), [PostgreSQL](https://docs.render.com/databases), and, [MongoDB](https://docs.render.com/deploy-mongodb) on the Render docs.
:::

## Create Redis instance

Create the production Redis instance and take note of the connection url.
::: info Redis instance guide
See the [guide to create a Redis instance](https://docs.render.com/redis#creating-a-redis-instance) on the Render docs.
:::

## Set up database

Depending on the database you want to use for production, [set up that adapter](/boring-stack/database) in `config/environment/production.js`
::: code-group

```js [PostgreSQL]
module.exports = {
  datastores: {
    default: {
      adapter: 'sails-postgresql',
      url: process.env.DATABASE_URL
    }
  }
}
```

```js [MySQL]
module.exports = {
  datastores: {
    default: {
      adapter: 'sails-mysql',
      url: process.env.DATABASE_URL
    }
  }
}
```

```js [MongoDB]
module.exports = {
  datastores: {
    default: {
      adapter: 'sails-mongo',
      url: process.env.DATABASE_URL
    }
  }
}
```

:::

::: warning
Don't forget to install the adapter if you haven't already. See the [database](/boring-stack/database) docs for more info.
:::

## Set up Redis

::: info
[Create a new Redis instance](https://docs.render.com/redis) on Render by following the Render docs.
:::
Set up the Redis adapter in `config/environment/production.js`

```js
module.exports = {
  session: {
    secret: process.env.SESSION_SECRET
    adapter: '@sailshq/connect-redis',
    url: process.env.REDIS_URL
  }
}
```

## Create a web service

Create a new Node.js [Web Service](https://docs.render.com/web-services) on Render, and give Render permission to access the repo of your app.

Use the following values during creation:

- **Runtime**: `Node`
- **Build command**: `npm i`
- **Start command**: `npm start`

## Set environment variables

Add the following evironment variables to your web service:

- `DATABASE_URL`: This should point to the connection string of the database you created.
- `REDIS_URL`: This should point to the connection string to the Redis instance you created.
- `SESSION_SECRET`: A unique production session secret to override the one in `config/session.js`.

That’s it! Your app will be live on your Render URL as soon as the build finishes :tada:

## Celebrate with a :star:

::: tip Star The Boring JavaScript Stack repo on GitHub :star:
Let's celebrate deploying your app on Render by giving **The Boring JavaScript Stack** [a star on GitHub](https://github.com/sailscastshq/boring-stack).
:::
