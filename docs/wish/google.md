---
head:
  - - meta
    - property: 'og:image'
      content: https://docs.sailscasts.com/sails-wish-social.png
title: Google
editLink: true
---

# Google

To set up Google OAuth for your app, you'll need to get your `clientId` and `clientSecret` credentials from the Google Console. See [Google OAuth 2.0](https://developers.google.com/identity/protocols/oauth2) for instructions.

## Configuration

Add your Google provider in `config/wish.js`:

```js
// config/wish.js
module.exports.wish = {
  provider: 'google',
  providers: {
    google: {
      clientId: 'your-client-id',
      clientSecret: 'your-client-secret',
      redirect: 'http://localhost:1337/auth/callback'
    }
  }
}
```

Or use environment variables (Wish automatically detects these):

| Variable               | Description                             |
| ---------------------- | --------------------------------------- |
| `GOOGLE_CLIENT_ID`     | Your Google OAuth Client ID             |
| `GOOGLE_CLIENT_SECRET` | Your Google OAuth Client Secret         |
| `GOOGLE_CALLBACK_URL`  | The callback URL registered with Google |

```js
// config/wish.js - credentials loaded from env vars
module.exports.wish = {
  provider: 'google',
  providers: {
    google: {}
  }
}
```

### Customizing Scopes

To request additional permissions from Google:

```js
// config/wish.js
module.exports.wish = {
  provider: 'google',
  providers: {
    google: {
      scopes: [
        'https://www.googleapis.com/auth/userinfo.profile',
        'https://www.googleapis.com/auth/userinfo.email',
        'https://www.googleapis.com/auth/calendar.readonly'
      ]
    }
  }
}
```

See [Google OAuth Scopes](https://developers.google.com/identity/protocols/oauth2/scopes) for available scopes.

### Defaults

Wish provides these defaults for Google (override only what you need):

| Option           | Default                                                  |
| ---------------- | -------------------------------------------------------- |
| `scopes`         | `['...userinfo.profile', '...userinfo.email']`           |
| `scopeSeparator` | ` ` (space)                                              |
| `tokenUrl`       | `https://oauth2.googleapis.com/token`                    |
| `userUrl`        | `https://www.googleapis.com/oauth2/v2/userinfo?alt=json` |

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
    return sails.wish.redirect()
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
