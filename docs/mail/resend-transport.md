---
title: Resend Transport
editLink: true
prev:
  text: 'SMTP Transport'
  link: '/mail/smtp-transport'
next:
  text: 'Local Development'
  link: '/mail/local-development'
---

# {{ $frontmatter.title }}

To use the [Resend](https://resend.com) transport, install `resend` via NPM:

```sh
npm i resend --save
```

Next, setup a mailer in the `mailers` object in `config/mail.js`, the name of the mailer can be anything but you can use `smtp` as well:

```js
// config/mail.js
mailers: {
  resend: {
    transport: 'resend'
  }
}
```

Also set the `default` option in `config/mails.js` to `resend` or whatever name you call the mailer above.

```js
// config/mails.js
default: 'resend'
```

## Resend credentials

To set the Resend credentials, you have a couple of options:

## Environment variables

Set the following environment variable:

```
RESEND_API_KEY=re_skskagnagnak
```

## local.js

Set an object in `config/local.js` matching the mailer you've set in `config/mails.js`:

```js
// config/local.js
resend: {
  apiKey: 're_skskagnagnak',
}
```

## config/mail.js

You can set your credentials within the mailer defintion as well:

```js
// config/mail.js
mailers: {
  resend: {
    transport: 'resend',
    apiKey: process.env.RESEND_API_KEY
  }
}
```

Notice that for the `apiKey` in `config/mail.js` we are still using environment variables as its best practice not to add secrets to your codebase.
