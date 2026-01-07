---
head:
  - - meta
    - property: 'og:image'
      content: https://docs.sailscasts.com/sails-wish-social.png
title: Google OAuth
editLink: true
---

# Google OAuth

To set up Google OAuth for your app, you'll need to get your `clientId` and `clientSecret` credentials from the Google Console. See [Google OAuth 2.0](https://developers.google.com/identity/protocols/oauth2) for instructions.

## Configuration

Add your Google credentials under the `wish` namespace in `config/local.js`:

```js
// config/local.js
module.exports = {
  wish: {
    google: {
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
  google: {
    clientId: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    redirect:
      process.env.GOOGLE_CALLBACK_URL || 'https://example.com/auth/callback'
  }
}
```

::: tip
Notice we are using environment variables as it's best practice not to commit your secret credentials. In the case of `local.js` that's okay because that file is never committed to version control.
:::

### Environment Variables

| Variable               | Description                             |
| ---------------------- | --------------------------------------- |
| `GOOGLE_CLIENT_ID`     | Your Google OAuth Client ID             |
| `GOOGLE_CLIENT_SECRET` | Your Google OAuth Client Secret         |
| `GOOGLE_CALLBACK_URL`  | The callback URL registered with Google |

## Set Default Provider (Optional)

If Google is your only OAuth provider, set it as the default in `config/wish.js`:

```js
// config/wish.js
module.exports.wish = {
  provider: 'google'
}
```

This allows you to use the simpler API without specifying the provider each time.

## The Redirect

A typical flow is to have a button on your website like "Sign in with Google". A good example is implemented in [The Boring JavaScript Stack](https://sailscasts.com/boring) mellow template.

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
    // return sails.wish.provider('google').redirect()
  }
}
```

::: info
Notice the redirect is a one-line of code and when this action is called, it will redirect to Google to begin the OAuth process.
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

    // Get the Google user info
    const googleUser = await sails.wish.user(code)
    // Or: await sails.wish.provider('google').user(code)

    User.findOrCreate(
      { googleId: googleUser.id },
      {
        id: sails.helpers.getUuid(),
        googleId: googleUser.id,
        email: googleUser.email,
        name: googleUser.name,
        googleAvatarUrl: googleUser.picture,
        googleAccessToken: googleUser.accessToken,
        googleIdToken: googleUser.idToken
      }
    ).exec(async (error, user, wasCreated) => {
      if (error) throw error

      // Checks if the user email has changed since last log in
      if (!wasCreated && user.email !== googleUser.email) {
        await User.updateOne({ id: user.id }).set({
          emailChangeCandidate: googleUser.email
        })
      }

      if (!wasCreated && user.name !== googleUser.name) {
        await User.updateOne({ id: user.id }).set({
          name: googleUser.name
        })
      }

      if (!wasCreated && user.googleAvatarUrl !== googleUser.picture) {
        await User.updateOne({ id: user.id }).set({
          googleAvatarUrl: googleUser.picture
        })
      }

      if (!wasCreated && user.googleAccessToken !== googleUser.accessToken) {
        await User.updateOne({ id: user.id }).set({
          googleAccessToken: googleUser.accessToken
        })
      }

      if (!wasCreated && user.googleIdToken !== googleUser.idToken) {
        await User.updateOne({ id: user.id }).set({
          googleIdToken: googleUser.idToken
        })
      }

      // Modify the active session instance.
      req.session.userId = user.id
      return exits.success('/')
    })
  }
}
```

There you have it, a Google OAuth flow with just two routes!
