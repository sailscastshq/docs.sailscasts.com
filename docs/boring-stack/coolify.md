---
head:
  - - meta
    - property: 'og:image'
      content: https://docs.sailscasts.com/boring-stack-social.png
title: Deploy on Coolify
titleTemplate: The Boring JavaScript Stack 🥱
description: Deploy your app on Coolify
prev:
  text: 'Railway'
  link: '/boring-stack/railway'
next:
  text: Type checking JS files
  link: '/boring-stack/type-checking-js-files'
editLink: true
---

# Deploy on Coolify

Let's deploy your app on [Coolify](https://coolify.io) :rocket:

## GitHub Repo

Push your app to a repo on GitHub.

## Create database

In your Coolify dashboard, create a PostgreSQL database as a one-click resource and take note of the connection url.

## Create Redis instance

In your Coolify dashboard, create a Redis instance as a one-click resource and take note of the connection url.

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

Set up the Redis adapter in `config/environment/production.js`

```js
module.exports = {
  session: {
    secret: process.env.SESSION_SECRET,
    adapter: '@sailshq/connect-redis',
    url: process.env.REDIS_URL
  }
}
```

## Create application

1. In your Coolify dashboard, create a new **Application** from your Git repository
2. Select the repository containing your app
3. Choose **Dockerfile** as the build pack

::: tip Dockerfile included
The Boring Stack templates come with a production-ready Dockerfile, so you don't need to create one manually.
:::

## Set environment variables

In your Node application settings on Coolify, add the following environment variables:

- `DATABASE_URL`: Use the connection string from the PostgreSQL database you created
- `REDIS_URL`: Use the connection string from the Redis instance you created
- `SESSION_SECRET`: A unique production session secret to override the one in `config/session.js`

::: tip Getting connection URLs
You can find the connection URLs for your PostgreSQL and Redis services in their respective settings pages on Coolify. Use the internal URLs for better performance and security.
:::

::: info Additional environment variables
Depending on the template you're using, you may need to set additional environment variables. For example, the [Ascent template](/boring-stack/ascent) requires additional configuration for authentication, teams, and billing features.
:::

## Deploy

Click **Deploy** in Coolify. Your app will be built using the Dockerfile and deployed automatically.

That's it! Your app will be live on your Coolify domain as soon as the build finishes :tada:

## Celebrate with a :star:

::: tip Star The Boring JavaScript Stack repo on GitHub :star:
Let's celebrate deploying your app on Coolify by giving **The Boring JavaScript Stack** [a star on GitHub](https://github.com/sailscastshq/boring-stack).
:::
