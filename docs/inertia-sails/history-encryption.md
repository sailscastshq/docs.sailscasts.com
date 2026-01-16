---
title: History Encryption
editLink: true
prev:
  text: Infinite scroll
  link: '/inertia-sails/infinite-scroll'
next:
  text: Root view
  link: '/inertia-sails/root-view'
---

# History Encryption

History encryption protects sensitive data from being exposed in the browser's history state. When enabled, page data is encrypted before being stored in `history.state`.

## Basic Usage

Enable encryption for a specific request:

```js
module.exports = {
  exits: {
    success: { responseType: 'inertia' }
  },

  fn: async function () {
    // Enable encryption for this response
    sails.inertia.encryptHistory()

    return {
      page: 'settings/security',
      props: {
        twoFactorSecret: await generateSecret(),
        backupCodes: await generateBackupCodes()
      }
    }
  }
}
```

## Global Configuration

Enable encryption for all responses:

```js
// config/inertia.js
module.exports.inertia = {
  history: {
    encrypt: true
  }
}
```

## Clear History

Clear the history state to remove sensitive data:

```js
module.exports = {
  exits: {
    success: { responseType: 'inertia' }
  },

  fn: async function () {
    // Clear history state
    sails.inertia.clearHistory()

    return {
      page: 'auth/logged-out',
      props: {}
    }
  }
}
```

## Use Cases

### Sensitive User Data

```js
fn: async function () {
  sails.inertia.encryptHistory()

  return {
    page: 'account/billing',
    props: {
      paymentMethods: await PaymentMethod.find({ user: userId }),
      lastFourDigits: true  // Only show last 4 digits
    }
  }
}
```

### Two-Factor Setup

```js
fn: async function () {
  sails.inertia.encryptHistory()

  const secret = authenticator.generateSecret()

  return {
    page: 'settings/two-factor',
    props: {
      qrCode: authenticator.keyuri(user.email, 'MyApp', secret),
      secret: secret
    }
  }
}
```

### Post-Logout

```js
fn: async function () {
  // Clear session
  delete this.req.session.userId

  // Clear browser history state
  sails.inertia.clearHistory()

  return {
    page: 'auth/signed-out',
    props: {}
  }
}
```

## How It Works

When history encryption is enabled:

1. The Inertia page data is encrypted before storage
2. Encrypted data is stored in `history.state`
3. When navigating back, data is decrypted
4. Without the key, the data is unreadable

This prevents sensitive data from being exposed if:

- Someone inspects browser history
- A user shares their screen
- Browser state is exported

## Encryption vs Not Encrypting

| Scenario            | Without Encryption | With Encryption |
| ------------------- | ------------------ | --------------- |
| DevTools inspection | Visible            | Encrypted       |
| Screen sharing      | Visible            | Encrypted       |
| Browser history     | Visible            | Encrypted       |
| Performance         | Faster             | Slight overhead |

## Best Practices

1. **Encrypt sensitive pages**: Payment info, security settings, personal data
2. **Clear on logout**: Remove any encrypted state when user logs out
3. **Don't over-use**: Only encrypt when necessary to avoid performance overhead
4. **Consider alternatives**: Sometimes it's better to not store sensitive data at all
