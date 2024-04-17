---
head:
  - - meta
    - property: 'og:image'
      content: https://docs.sailscasts.com/sails-wish-social.png
title: Google OAuth
editLink: true
---

# Google OAuth

To setup up a Google OAuth for your app, Wish expects the following key and property in either `config/local.js` or `config/custom.js`.

For example you can have a development Google `clientId` and `clientSecret` in `config/local.js`

> Do make sure to get the needed `clientId` and `clientSecret` credentials from the Google Console. You can see [here](https://developers.google.com/identity/protocols/oauth2) for instructions on how to get those credentials

```js
google: {
    clientId: 'CLIENT_ID',
    clientSecret: 'CLIENT_SECRET',
    redirect: 'http://localhost:1337/auth/callback',
  },
```

You can override this value for production in either `custom.js` or in an environment specific `custom.js`. I personally set this up for https://sailscasts.com to override the `local.js` value so I can have 3 environments with 3 different `clientId`, `clientSecret`, and `redirect` values.

```js
// custom.js
google: {
    clientId: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    redirect: 'https://example.com/auth/callback',
  },
```

> Notice I am using environment variables as it's best practice not to commit your secret credentials. In the case of `local.js` that's okay because that file is never committed to version control.

## The redirect

A typical flow is to have a button on your website say like "Sign in with Google". A good example is implemented in [The Boring JavaScript Stack](https://sailscasts.com/boring) mellow template

Clicking that button should call a redirect route you've set in `routes.js`

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
    return sails.wish.provider('google').redirect()
  }
}
```

Notice the redirect is a one-line of code and when this action is called, it will redirect to GitHub to begin the OAuth process.

## The callback

Note the callback URL we set above that Wish will callback? Let's also implement that starting from the route in `routes.js`

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
    const googleUser = await sails.wish.provider('google').user(code)

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
      // And then update the email change candidate which will be used be used to prompt the user to update their email
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
      // (This will be persisted when the response is sent.)
      req.session.userId = user.id
      return exits.success('/')
    })
  }
}
```

There you have it, a Google OAuth flow with just two routes and one line of code each to both redirect to Google and get the OAuth user details.
