---
head:
  - - meta
    - property: 'og:image'
      content: https://docs.sailscasts.com/sails-mail-social.png
title: Mailtrap Transport
editLink: true
prev:
  text: 'SMTP Transport'
  link: '/mail/smtp-transport'
next:
  text: 'Resend'
  link: '/mail/resend-transport'
---

# Mailtrap Transport

To use the [Mailtrap](https://mailtrap.io?utm_source=sails-hook-mail) transport, install `mailtrap` via NPM:

```sh
npm i mailtrap --save
```

Next, setup a mailer in the `mailers` object in `config/mail.js`, the name of the mailer can be anything but you can use `mailtrap` as well:

```js
// config/mail.js
mailers: {
  mailtrap: {
    transport: 'mailtrap'
  }
}
```

Also set the `default` option in `config/mails.js` to `mailtrap` or whatever name you call the mailer above.

```js
// config/mails.js
default: 'mailtrap'
```

## Mailtrap credentials

To set the Mailtrap credentials, you have a couple of options:

## Environment variables

Set the following environment variable:

```
MAILTRAP_TOKEN=f4k3t0k3n123
MAILTRAP_ACCOUNT_ID=2335532
MAILTRAP_TEST_INBOX_ID= 49469292 // Optional for email testing
```

## local.js

In development, you can specify a mailer of the same name in `local.js` so as to override the credentials like `apiKey` specified in `config/mail.js`

```js
// config/local.js
mail: {
  mailers: {
    mailtrap: {
      token: 'f4k3t0k3n123',
      accountId: 49495395,
      testInboxId: 493923439 // Optional for email testing
      }
  }
}
```

## config/mail.js

You can set your credentials within the mailer defintion as well:

```js
// config/mail.js
mailers: {
  mailtrap: {
    transport: 'mailtrap',
    token: process.env.MAILTRAP_TOKEN,
    accountId: process.env.MAILTRAP_ACCOUNT_ID,
    testInboxId: process.env.MAILTRAP_TEST_INBOX_ID // optional for email testing
  }
}
```

Notice that for the `token`, `accountId`, and, `testInboxId`, in `config/mail.js` we are still using environment variables as its best practice not to add secrets to your codebase.
