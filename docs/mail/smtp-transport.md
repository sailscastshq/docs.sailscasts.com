---
head:
  - - meta
    - property: 'og:image'
      content: https://docs.sailscasts.com/sails-mail-social.png
title: SMTP Transport
editLink: true
prev:
  text: 'Configuration'
  link: '/mail/configuration'
next:
  text: 'Resend Transport'
  link: '/mail/resend-transport'
---

# SMTP Transport

To use the SMTP transport, which is a protocol several email services supports, install `nodemailer` via NPM:

```sh
npm i nodemailer --save
```

Next, setup a mailer in the `mailers` object in `config/mail.js`, the name of the mailer can be anything but you can use `smtp` as well:

```js
// config/mail.js
mailers: {
  smtp: {
    transport: 'smtp'
  }
}
```

Also set the `default` option in `config/mails.js` to `smtp` or whatever name you call the mailer above.

```js
// config/mails.js
default: 'smtp'
```

## SMTP credentials

To set the SMTP credentials, you have a couple of options:

## Environment variables

Set the following environment variables:

```
MAIL_HOST=sandbox.smtp.mailtrap.io
MAIL_PORT=2525
MAIL_USERNAME=username
MAIL_PASSWORD=password
```

## local.js

In development, you can specify a mailer of the same name in local.js so as to override the credentials like `username`, `port` etc specified in config/mail.js

```js
// config/local.js
mail: {
  mailers: {
    smtp: {
      host: 'sandbox.smtp.mailtrap.io',
      username: 'username',
      password: 'password',
      port: 2525
    }
  }
}
```

## config/mail.js

You can set your credentials within the mailer defintion as well:

```js
// config/mail.js
mailers: {
  smtp: {
    transport: 'smtp',
    host: 'sandbox.smtp.mailtrap.io',
    username: process.env.MAIL_USERNAME,
    password: process.env.MAIL_PASSWORD,
    port: 2525
  }
}
```

Notice that for the `username` and `password` credentials we are still using environment variables as its best practice not to add secrets to your codebase.
