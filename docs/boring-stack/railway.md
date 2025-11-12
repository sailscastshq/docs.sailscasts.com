---
head:
  - - meta
    - property: 'og:image'
      content: https://docs.sailscasts.com/boring-stack-social.png
title: Deploy on Railway
titleTemplate: The Boring JavaScript Stack 🥱
description: Deploy your app on Railway
prev:
  text: 'Render'
  link: '/boring-stack/render'
next:
  text: Type checking JS files
  link: '/boring-stack/render'
editLink: true
---

# Deploy on Railway

Let's deploy your app on [Railway](https://railway.com) :rocket:

You have two options to deploy your app on Railway...

- Use the **[One-click deploy](#one-click-deploy-with-railway-templates)** if you're just starting out.
- Or follow the **[GitHub Repo](#github-repo)** steps if you’ve already started building your app.

## One-click deploy mellow-vue

Simply click the button, and Railway will set up everything you need to get your new app live using the `mellow-vue` Railway template.

[![Deploy Mellow Vue on Railway](https://railway.com/button.svg)](https://railway.com/template/zB55Xl?referralCode=orSqKL)

This template includes:

- **Mellow Vue**: The Boring Stack Mellow template with Vue.js.
- **PostgreSQL**: A pre-configured PostgreSQL database.
- **Redis**: A pre-configured Redis instance.

## One-click deploy mellow-react

Simply click the button, and Railway will set up everything you need to get your new app live using the `mellow-react` Railway template.

[![Deploy Mellow React on Railway](https://railway.com/button.svg)](https://railway.com/template/Yqisvu?referralCode=orSqKL)

This template includes:

- **Mellow React**: The Boring Stack Mellow template with React.js.
- **PostgreSQL**: A pre-configured PostgreSQL database.
- **Redis**: A pre-configured Redis instance.

## One-click deploy mellow-svelte

Simply click the button, and Railway will set up everything you need to get your new app live using the `mellow-svelte` Railway template.

[![Deploy Mellow Svelte on Railway](https://railway.com/button.svg)](https://railway.com/template/K-dheh?referralCode=orSqKL)

This template includes:

- **Mellow Svelte**: The Boring Stack Mellow template with Svelte.js.
- **PostgreSQL**: A pre-configured PostgreSQL database.
- **Redis**: A pre-configured Redis instance.

## One-click deploy ascent-react

Simply click the button, and Railway will set up everything you need to get your new production-ready SaaS app live using the `ascent-react` Railway template.

[![Deploy on Railway](https://railway.com/button.svg)](https://railway.com/deploy/K62uLo?referralCode=orSqKL&utm_medium=integration&utm_source=template&utm_campaign=generic)

This template includes:

- **Ascent React**: The Boring Stack production-ready SaaS template with React, authentication, teams, and billing.
- **PostgreSQL**: A pre-configured PostgreSQL database.
- **Redis**: A pre-configured Redis instance.

## One-click deploy ascent-vue

Simply click the button, and Railway will set up everything you need to get your new production-ready SaaS app live using the `ascent-vue` Railway template.

[![Deploy on Railway](https://railway.com/button.svg)](https://railway.com/deploy/3Hjrjs?referralCode=orSqKL&utm_medium=integration&utm_source=template&utm_campaign=generic)

This template includes:

- **Ascent Vue**: The Boring Stack production-ready SaaS template with Vue, authentication, teams, and billing.
- **PostgreSQL**: A pre-configured PostgreSQL database.
- **Redis**: A pre-configured Redis instance.

## GitHub Repo

Push your app to a repo on GitHub.

## Create database

Create the database you want to use for production on Railway and take note of the connection url.
::: info Database creation guides
See guides for [MySQL](https://docs.railway.com/guides/mysql), [PostgreSQL](https://docs.railway.com/guides/postgresql), and, [MongoDB](https://docs.railway.com/guides/mongodb) on the Railway docs.
:::

## Create Redis instance

Create the production Redis instance and take note of the connection url.
::: info Redis instance guide
See the [guide to create a Redis instance](https://docs.railway.com/guides/redis) on the Railway docs.
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
[Create a new Redis instance](https://docs.railway.com/guides/redis) on Railway by following the Railway docs.
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

Create a new [Web Service](https://docs.railway.com/quick-start) on Railway, and give Railway permission to access the repo of your app.

If necessary, use the following values during creation:

- **Runtime**: `Node`
- **Build command**: `npm i`
- **Start command**: `npm start`

However, Railway is capable of configuring things automatically for you.

## Set environment variables

Add the following evironment variables to your web service:

- `DATABASE_URL`: This should point to the connection string of the database you created.
- `REDIS_URL`: This should point to the connection string to the Redis instance you created.
- `SESSION_SECRET`: A unique production session secret to override the one in `config/session.js`.

That’s it! Your app will be live on your Railway URL as soon as the build finishes :tada:

## Celebrate with a :star:

::: tip Star The Boring JavaScript Stack repo on GitHub :star:
Let's celebrate deploying your app on Railway by giving **The Boring JavaScript Stack** [a star on GitHub](https://github.com/sailscastshq/boring-stack).
:::
