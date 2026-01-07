---
head:
  - - meta
    - property: 'og:image'
      content: https://docs.sailscasts.com/sails-wish-social.png
title: GitHub OAuth
editLink: true
---

# GitHub OAuth

To set up GitHub OAuth for your app, you'll need to get your `clientId` and `clientSecret` credentials from GitHub. See [Creating an OAuth App](https://docs.github.com/en/apps/oauth-apps/building-oauth-apps/creating-an-oauth-app) for instructions.

## Configuration

Add your GitHub credentials under the `wish` namespace in `config/local.js`:

```js
// config/local.js
module.exports = {
  wish: {
    github: {
      clientId: 'CLIENT_ID',
      clientSecret: 'CLIENT_SECRET',
      redirect: 'http://localhost:1337/auth/callback'
    }
  }
}
```

For production, use environment variables in `config/custom.js`:

```js
// config/custom.js
module.exports.wish = {
  github: {
    clientId: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
    redirect:
      process.env.GITHUB_CALLBACK_URL || 'https://example.com/auth/callback'
  }
}
```

::: tip
Notice we are using environment variables as it's best practice not to commit your secret credentials. In the case of `local.js` that's okay because that file is never committed to version control.
:::

### Environment Variables

| Variable               | Description                             |
| ---------------------- | --------------------------------------- |
| `GITHUB_CLIENT_ID`     | Your GitHub OAuth App Client ID         |
| `GITHUB_CLIENT_SECRET` | Your GitHub OAuth App Client Secret     |
| `GITHUB_CALLBACK_URL`  | The callback URL registered with GitHub |

## Set Default Provider (Optional)

If GitHub is your only OAuth provider, set it as the default in `config/wish.js`:

```js
// config/wish.js
module.exports.wish = {
  provider: 'github'
}
```

This allows you to use the simpler API without specifying the provider each time.

## The Redirect

A typical flow is to have a button on your website like "Sign in with GitHub". A good example can be found [here](https://sailscasts.com/signin).

Clicking that button should call a redirect route you've set in `routes.js`:

```js
'GET /auth/redirect': 'auth/redirect',
```

Now let's author this `auth/redirect` action:

```js
module.exports = {
  friendlyName: 'Redirect',

  description: 'Redirect auth.',

  inputs: {},

  exits: {
    success: {
      responseType: 'redirect'
    }
  },

  fn: async function () {
    // If you set a default provider in config/wish.js:
    return sails.wish.redirect()

    // Or explicitly specify the provider:
    // return sails.wish.provider('github').redirect()
  }
}
```

::: info
Notice the redirect is a one-line of code and when this action is called, it will redirect to GitHub to begin the OAuth process.
:::

## The Callback

Note the callback URL we set above that Wish will callback? Let's also implement that starting from the route in `routes.js`:

```js
'GET /auth/callback': 'auth/callback',
```

```js
module.exports = {
  friendlyName: 'Callback',

  description: 'Callback auth.',

  inputs: {
    code: {
      type: 'string',
      required: true
    }
  },

  exits: {
    success: {
      responseType: 'redirect'
    }
  },

  fn: async function ({ code }, exits) {
    const req = this.req

    // Get the GitHub user info
    const githubUser = await sails.wish.user(code)
    // Or: await sails.wish.provider('github').user(code)

    User.findOrCreate(
      { githubId: githubUser.id },
      {
        id: sails.helpers.getUuid(),
        githubId: githubUser.id,
        email: githubUser.email,
        name: githubUser.name,
        githubAvatarUrl: githubUser.avatar_url,
        githubAccessToken: githubUser.accessToken
      }
    ).exec(async (error, user, wasCreated) => {
      if (error) throw error

      // Checks if the user email has changed since last log in
      if (!wasCreated && user.email !== githubUser.email) {
        await User.updateOne({ id: user.id }).set({
          emailChangeCandidate: githubUser.email
        })
      }

      // Checks if the user name has changed since last log in
      if (!wasCreated && user.name !== githubUser.name) {
        await User.updateOne({ id: user.id }).set({
          name: githubUser.name
        })
      }

      if (!wasCreated && user.githubAvatarUrl !== githubUser.avatar_url) {
        await User.updateOne({ id: user.id }).set({
          githubAvatarUrl: githubUser.avatar_url
        })
      }

      if (!wasCreated && user.githubAccessToken !== githubUser.accessToken) {
        await User.updateOne({ id: user.id }).set({
          githubAccessToken: githubUser.accessToken
        })
      }

      // Modify the active session instance.
      req.session.userId = user.id
      return exits.success('/')
    })
  }
}
```

The above is an actual real world use case of Wish in [https://sailscasts.com](https://sailscasts.com). You can perform any business logic you want.

There you have it, a GitHub OAuth flow with just two routes!
