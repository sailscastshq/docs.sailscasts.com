---
head:
  - - meta
    - property: 'og:image'
      content: https://docs.sailscasts.com/sails-content-social.png
title: Partials
titleTemplate: Sails Content
description: Using partials to share UI components between your content layouts and views.
prev:
  text: Configurations
  link: '/content/configuration'
next: false
editLink: true
---

# Partials

Sails Content supports EJS partials, allowing you to share UI components between your content layouts and your Sails views. This helps reduce code duplication for common elements like headers, footers, and navigation.

## Using partials

In your layout files, use the `partial()` function to include reusable template fragments:

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <title><%= data.title %> | Blog</title>
    <%- shipwright.styles() %>
  </head>
  <body>
    <%- partial('../partials/header.ejs') %>

    <main>
      <h1><%= data.title %></h1>
      <%- content %>
    </main>

    <%- partial('../partials/footer.ejs') %> <%- shipwright.scripts() %>
  </body>
</html>
```

## Passing data to partials

You can pass local variables to partials as a second argument:

```html
<%- partial('../partials/header.ejs', { currentUrl: '/blog' }) %>
```

Then access them in your partial:

```html
<!-- views/partials/header.ejs -->
<nav>
  <a href="/blog" class="<%= currentUrl === '/blog' ? 'active' : '' %>">
    Blog
  </a>
</nav>
```

## Path resolution

Partial paths are resolved relative to the layout file. For example, if your layout is at `views/layouts/blog-post.ejs`:

```
views/
├── layouts/
│   └── blog-post.ejs
└── partials/
    ├── header.ejs
    └── footer.ejs
```

You would use `../partials/header.ejs` to navigate up from `layouts/` to `views/` and then into `partials/`.

## Available variables in partials

Partials have access to all the same variables as your layout:

| Variable          | Description                                         |
| ----------------- | --------------------------------------------------- |
| `data`            | Frontmatter properties from your Markdown file      |
| `content`         | The rendered HTML content from your Markdown        |
| `shipwright`      | Shipwright utilities for script and style injection |
| `partial`         | The partial function itself (for nested partials)   |
| Any custom locals | Variables passed via `config.views.locals`          |

## Nested partials

Partials can include other partials:

```html
<!-- views/partials/header.ejs -->
<header>
  <%- partial('./nav.ejs', { currentUrl }) %> <%- partial('./logo.ejs') %>
</header>
```

## Sharing with Sails views

The `partial()` function in Sails Content is designed to be compatible with Sails.js view conventions. This means you can use the same partial files in both:

- **Sails Content layouts** - for static content generation
- **Sails views** - for dynamic server-rendered pages

This allows you to maintain a single source of truth for shared UI components like headers and footers across your entire application.
