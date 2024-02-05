---
head:
  - - meta
    - property: 'og:image'
      content: https://docs.sailscasts.com/sails-content-social.png
title: Getting started
titleTemplate: Sails Content
description: Getting started with Sails Content in a Sails application
prev:
  text: Motivation
  link: '/content/motivation'
next:
  text: Content collections
  link: '/content/collections'
editLink: true
---

# Getting started

Simply add the following dependencies to your Sails project:

```sh
npm i sails-content sails-hook-content --save
```

::: info
A key piece of Sails Content is the `plugin-sails-content` plugin which you can only use in Sails apps that has Shipwright installed. Learn more by checking out [getting started](/boring-stack/getting-started) on The Boring Stack docs.
:::

## Register the adapter

Open up `config/datastores.js` to register the `sails-content` adapter:

```js
module.exports.datastores = {
  default: {},
  content: {
    adapter: 'sails-content'
  }
}
```

::: tip
You can call your content datastore anything you want.
:::

## Create the content directory

To start writing your content, you need a content directory. Sails Content by default expect the content directory to be at the top-level of your project and called `content`:

```sh
mkdir content
```

## Create a view template

Sails Content needs a view template to provide the layout to build your HTML files with. By default your view template will be in `.ejs` so create one in `view/layouts`. For example we can create `views/layouts/blog-post.ejs`:

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <title><%= data.title %> | Blog</title>
  </head>
  <body>
    <h1><%= data.title %></h1>
    <%- content %>
  </body>
</html>
```

::: info
Notice the `content` variable and `data` object. The data object contains your parsed frontmatter properties.
:::

## Create your first collection

Since we already have a blog post view template, we might as well just create our first blog post.

To do so create a `blog` collection in your `content` directory.

A collection is simply a top-level folder which will contain your content files and it also maps to your content model. Now, let's create `content/blog/hello-world.md`:

```md
---
 layout: './views/layouts/blog-post.ejs'
 title: 'Hello Sails Content',
---

# Hello World

This is my first blog using Sails Content!
```

Now lift your Sails application with `npx sails l` and your blog post should be live at `localhost:1337/blog/hello-world` 🚀

## Star the repo :star:

::: tip Star the Sails Content repo on GitHub :star:
If you like Sails Content, show it some love with [a star on GitHub](https://github.com/sailscastshq/sails-content).
:::
