---
head:
  - - meta
    - property: 'og:image'
      content: https://docs.sailscasts.com/sails-wish-social.png
title: Installation
editLink: true
---

# Installation

In your Sails project run the below command to install wish:

```sh
npm i sails-hook-wish
```

::: info Node.js 18+ required
Wish uses native `fetch` which is available in Node.js 18 and later.
:::

## Configuration

All Wish configuration lives under the `wish` namespace. Create a `config/wish.js` file in your Sails project:

```js
// config/wish.js
module.exports.wish = {
  // Set a default provider for single-provider apps (optional)
  // This allows you to call sails.wish.redirect() without specifying a provider
  provider: 'github'
}
```

Then add your provider credentials in `config/local.js` (for development):

```js
// config/local.js
module.exports = {
  wish: {
    github: {
      clientId: 'your-client-id',
      clientSecret: 'your-client-secret',
      redirect: 'http://localhost:1337/auth/callback'
    }
  }
}
```

::: tip
Credentials in `config/local.js` are under the `wish` namespace, making it clear they belong to Wish. The `local.js` file is never committed to version control, so it's safe to put development credentials there.
:::

## Environment Variables

For production, use environment variables. Wish works with these common conventions:

| Provider | Environment Variable   | Description             |
| -------- | ---------------------- | ----------------------- |
| GitHub   | `GITHUB_CLIENT_ID`     | OAuth App Client ID     |
| GitHub   | `GITHUB_CLIENT_SECRET` | OAuth App Client Secret |
| GitHub   | `GITHUB_CALLBACK_URL`  | OAuth callback URL      |
| Google   | `GOOGLE_CLIENT_ID`     | OAuth Client ID         |
| Google   | `GOOGLE_CLIENT_SECRET` | OAuth Client Secret     |
| Google   | `GOOGLE_CALLBACK_URL`  | OAuth callback URL      |

```js
// config/custom.js (production)
module.exports.wish = {
  github: {
    clientId: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
    redirect:
      process.env.GITHUB_CALLBACK_URL || 'https://example.com/auth/callback'
  }
}
```

## Default Provider

For apps that only use a single OAuth provider, you can set a default provider in `config/wish.js`:

```js
// config/wish.js
module.exports.wish = {
  provider: 'github' // or 'google'
}
```

This enables a simpler API:

```js
// Instead of:
sails.wish.provider('github').redirect()
sails.wish.provider('github').user(code)

// You can simply use:
sails.wish.redirect()
sails.wish.user(code)
```

## Multi-Provider Apps

For apps that support multiple OAuth providers, you have two options:

### Option 1: Use the `.provider()` method

```js
// In your redirect action
fn: async function ({ provider }) {
  return sails.wish.provider(provider).redirect()
}

// In your callback action
fn: async function ({ code, provider }) {
  const user = await sails.wish.provider(provider).user(code)
}
```

### Option 2: Separate routes for each provider

```js
// config/routes.js
'GET /auth/github/redirect': 'auth/github-redirect',
'GET /auth/github/callback': 'auth/github-callback',
'GET /auth/google/redirect': 'auth/google-redirect',
'GET /auth/google/callback': 'auth/google-callback',
```
