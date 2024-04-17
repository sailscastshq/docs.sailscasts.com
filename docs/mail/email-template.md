---
head:
  - - meta
    - property: 'og:image'
      content: https://docs.sailscasts.com/sails-mail-social.png
title: Email Template
editLink: true
prev:
  text: 'Local Development'
  link: '/mail/local-development'
next:
  text: 'Email Layout'
  link: '/mail/email-layout'
---

# Email Template

Mail expects your email templates to be written in EJS template files or whatever template engine you've setup in your Sails project. These files are expected to be in the `views/emails` directory.

## Naming convention

When writing your email templates, you should prepend the file name with `email-` for example for an email template to send the account verification email to a user, the template can be named as `email-confirm-account.ejs`

## Example

Here is an example email template that's in `views/emails/email-verify-account.ejs`:

```html
<h2
  style="margin-bottom: 32px; font-size: 24px; font-style: normal; font-weight: 700; line-height: 33px; letter-spacing: 0em; text-align: left;"
>
  Welcome, <%= fullName %>!
</h2>
<p style="margin-bottom: 32px;">
  You're almost ready to get started. Just click the button below to verify the
  email address for your account:
</p>
<div
  style="background: #6C25C1; display: inline-block; color: white; text-decoration: none; border-radius: 4px; text-align: center; width: 151px; padding: 8px 16px 8px 16px"
>
  <a
    style="margin: auto; font-size: 16px; text-decoration: none; color: white; line-height: 22px;"
    href="<%= url.resolve(sails.config.custom.baseUrl,'/verify-email')+'?token='+encodeURIComponent(token) %>"
    >Verify email</a
  >
</div>
<p style="margin-bottom: 25px;">
  If you have any trouble, try pasting this link in your browser:
  <a
    style="color: #00ACC4; word-wrap: break-word;"
    href="<%= url.resolve(sails.config.custom.baseUrl,'/verify-email')+'?token='+encodeURIComponent(token) %>"
    ><%=
    url.resolve(sails.config.custom.baseUrl,'/verify-email')+'?token='+encodeURIComponent(token)
    %></a
  >
</p>
<p style="margin-bottom: 5px;">Sincerely,</p>
<p style="margin-top: 0px;">The Boring JavaScript Stack Team</p>
```
