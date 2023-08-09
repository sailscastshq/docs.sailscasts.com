---
title: Configuration
editLink: true
prev:
  text: 'Getting Started'
  link: '/mail/getting-started'
next:
  text: 'SMTP Transport'
  link: '/mail/smtp-transport'
---

# {{ $frontmatter.title }}

To configure mail, create a `config/mail.js` configuration file. Let's look at all the possible configurations you can have in `config/mail.js`

## default

The `default` config in `config/mail.js` tells Mail which mailer to use by default. The string passed to `default` must be the name of a registered mailer in the `mailers` object

```js[config/mail.js]
module.exports.mail =  {
  default: 'log' // replace 'log' with any configured mailer you've set
}
```

You can also set the `default` mailer with the `MAIL_MAILER` environment variable and Mail will automatically detect it.

This is handy for specifying different default mailers in different environments your application will be running in.

Also in `config/local.js` you specify a `mailer` which will be used as the default mailer in development.

```js
//config/local.js
mailer: 'nodemailer'
```

## mailers

The `mailers` configuration object contains

```js
  mailers: {
   log: {
      transport: 'log'
    },
    mailtrap: {
      transport: 'smtp'
    },
    resend: {
      transport: 'resend'
    }
  },
```

:::info What's a mailer?

In Mail, a mailer is a configuration object that is registered in the `mailers` object in `config/mails.js` that specifies at the very least a transport that Mail will use in sending your emails.
:::

## from

This config let you set a global from address for all your emails. It's really useful if your application sends emails from the same from address.

By default Mail will use this address if no address is passed when you send an email with `sails.helpers.mail.send`

```js
from: {
    address: 'boring@sailscasts.com',
    name: 'The Boring JavaScript Stack'
}
```

You can also set this config by specifying these two environment variables: `MAIL_FROM_NAME` and `MAIL_FROM_ADDRESS`.
