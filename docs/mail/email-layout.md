---
title: Email Layout
editLink: true
prev:
  text: 'Email Template'
  link: '/mail/email-template'
next:
  text: 'Send Helper'
  link: '/mail/send-helper'
---

# {{ $frontmatter.title }}

You can create layouts for the emails in your Sails application. This layout file, like [templates](/mail/email-template) is expected to be an EJS template.

## Default layout

By default, Mail will look for a layout file in `views/layouts` called `layout-email.ejs` to use as the default layout for all your email templates.

## Example

Here is an example email layout that's in `views/layouts/layout-email.ejs`:

```html
<% /* Default layout for email templates */ %>
<div
  style="width: 100%; font-family: 'Inter','Helvetica','arial', sans-serif; box-sizing: border-box; padding: 0; margin: 0;"
>
  <div
    style="color: #192147; font-size: 16px; box-sizing: border-box; padding: 40px 60px 80px 28px; width: 100%; max-width: 600px; margin-left: auto; margin-right: auto;"
  >
    <div style="background: transparent; text-align: left;"></div>
    <%- body %>
    <hr style="color: #E2E4EA;" />
    <div
      style="text-align: left; padding-top: 15px; font-size: 12px; color: #3E4771;"
    >
      <p>
        © 2023 The Boring JavaScript Stack<br />
        All trademarks, service marks, and company names are the property of
        their respective owners.
      </p>
    </div>
  </div>
</div>
```

Your email templates will be injected in the spot marked by `<%- body %>` above.
