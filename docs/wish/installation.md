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

All Wish configuration lives under the `wish.providers` namespace in `config/wish.js`.

### Basic Setup

For most apps, you just need to set your default provider and add credentials:

```js
// config/wish.js
module.exports.wish = {
  // Set a default provider for single-provider apps
  provider: 'github',

  providers: {
    github: {
      clientId: 'your-client-id',
      clientSecret: 'your-client-secret',
      redirect: 'http://localhost:1337/auth/callback'
    }
  }
}
```

::: tip
For development, you can put credentials in `config/local.js` instead (which is gitignored).
:::

### Environment Variables

Wish automatically detects these environment variables as fallbacks:

| Provider | Environment Variable   | Description             |
| -------- | ---------------------- | ----------------------- |
| GitHub   | `GITHUB_CLIENT_ID`     | OAuth App Client ID     |
| GitHub   | `GITHUB_CLIENT_SECRET` | OAuth App Client Secret |
| GitHub   | `GITHUB_CALLBACK_URL`  | OAuth callback URL      |
| Google   | `GOOGLE_CLIENT_ID`     | OAuth Client ID         |
| Google   | `GOOGLE_CLIENT_SECRET` | OAuth Client Secret     |
| Google   | `GOOGLE_CALLBACK_URL`  | OAuth callback URL      |

This means for production, you can set the environment variables and use near-zero config - just specify the redirect URL (since Wish can't know where your app handles callbacks):

```js
// config/wish.js
module.exports.wish = {
  provider: 'github',
  providers: {
    github: {
      redirect: 'https://myapp.com/auth/callback'
    }
  }
}
```

Credentials are automatically loaded from `GITHUB_CLIENT_ID` and `GITHUB_CLIENT_SECRET` environment variables.

### Config Resolution Order

Wish merges configuration in this order (later values override earlier):

1. **Built-in defaults** - scopes, OAuth URLs, etc.
2. **Environment variables** - `GITHUB_CLIENT_ID`, etc.
3. **Your config** - values in `config/wish.js` or `config/local.js`

This means you only need to configure what you want to change.

### Provider Defaults

Wish comes with sensible defaults for each provider type. You only need to override values you want to change:

```js
// config/wish.js
module.exports.wish = {
  provider: 'github',
  providers: {
    github: {
      // These are the defaults - only specify if you need to change them
      scopeSeparator: ',',
      scopes: ['user:email'],
      tokenUrl: 'https://github.com/login/oauth/access_token',
      userUrl: 'https://api.github.com/user'
    }
  }
}
```

### Customizing Scopes

To request additional permissions:

```js
// config/wish.js
module.exports.wish = {
  provider: 'github',
  providers: {
    github: {
      scopes: ['user:email', 'read:user', 'repo']
    }
  }
}
```

## Default Provider

For apps that only use a single OAuth provider, set a default provider in `config/wish.js`:

```js
// config/wish.js
module.exports.wish = {
  provider: 'github', // or 'google'
  providers: {
    github: {
      redirect: 'https://myapp.com/auth/callback'
    }
  }
}
```

With environment variables set (`GITHUB_CLIENT_ID`, `GITHUB_CLIENT_SECRET`), this is all you need - Wish will use the env vars for credentials and built-in defaults for everything else.

This also enables a simpler API:

```js
// Instead of:
sails.wish.provider('github').redirect()
sails.wish.provider('github').user(code)

// You can simply use:
sails.wish.redirect()
sails.wish.user(code)
```

## Multi-Provider Apps

For apps that support multiple OAuth providers:

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

## Multiple Instances of Same Provider

Need multiple OAuth apps for the same provider (e.g., separate Google apps for different purposes)? Use the `type` property:

```js
// config/wish.js
module.exports.wish = {
  providers: {
    // Standard Google OAuth
    google: {
      clientId: 'consumer-app-client-id',
      clientSecret: 'consumer-app-secret',
      redirect: 'http://localhost:1337/auth/google/callback'
    },

    // Google Workspace OAuth (same provider type, different credentials)
    'google-workspace': {
      type: 'google', // Tells Wish this uses Google OAuth
      clientId: 'workspace-client-id',
      clientSecret: 'workspace-secret',
      redirect: 'http://localhost:1337/auth/workspace/callback',
      scopes: [
        'https://www.googleapis.com/auth/userinfo.profile',
        'https://www.googleapis.com/auth/userinfo.email',
        'https://www.googleapis.com/auth/admin.directory.user.readonly'
      ]
    }
  }
}
```

Then use the provider key when redirecting:

```js
// Redirect to standard Google
sails.wish.provider('google').redirect()

// Redirect to Google Workspace
sails.wish.provider('google-workspace').redirect()
```

::: tip
When `type` is not specified, Wish infers the provider type from the key name. Use `type` when your key doesn't match a supported provider name.
:::
