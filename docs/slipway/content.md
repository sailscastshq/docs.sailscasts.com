---
head:
  - - meta
    - property: 'og:image'
      content: https://docs.sailscasts.com/slipway-social.png
title: Content
titleTemplate: Slipway
description: Manage sails-content Markdown and JSON files from a visual, Git-backed editor in Slipway.
prev:
  text: Bridge
  link: /slipway/bridge
next:
  text: Quest
  link: /slipway/quest
editLink: true
---

# Content

Content is Slipway's Git-backed editor for
[sails-content](https://docs.sailscasts.com/sails-content) applications. It lets
an editor manage Markdown, frontmatter, images, and JSON without leaving the
dashboard while keeping the repository as the source of truth.

## Requirements

Install `sails-content` in the application:

```bash
npm install sails-content
```

Slipway detects the hook during deployment and enables Content for that
application. A connected Git repository is recommended: it gives every change
a durable commit and lets **Save & Deploy** deploy the exact revision that was
just saved.

## Open Content

1. Open the project and environment.
2. Choose **Content**.
3. Select the application when the environment contains more than one app.
4. Open a collection and document.

The production environment uses:

```text
/projects/:projectSlug/content
```

Other environments include the environment slug:

```text
/projects/:projectSlug/environments/:environmentSlug/content
```

Content follows the normal `sails-content` directory structure:

```text
content/
├── blog/
│   ├── hello-world.md
│   └── getting-started.md
├── docs/
│   └── installation.md
└── settings/
    └── site.json
```

Each directory is shown as a collection. Markdown and JSON files appear as
records inside it.

## Create a document

Choose **New content** from a collection, then enter a slug and optional title.
The slug becomes the filename. For example, `getting-started` creates
`getting-started.md`.

Slipway creates a Markdown document with initial frontmatter and commits it as:

```text
chore(content): create blog/getting-started
```

Use meaningful, URL-safe slugs because applications commonly use them in public
routes.

## Visual Markdown editor

Markdown files open in a minimal TipTap editor. The document still remains
Markdown on disk; the visual editor is an authoring surface, not a proprietary
content format.

You can:

- write headings, paragraphs, lists, blockquotes, links, code, and horizontal
  rules;
- use Markdown shortcuts such as `## ` for a heading or `- ` for a list;
- select text to open the compact formatting menu for bold, italic,
  strikethrough, inline code, and links;
- press `Cmd/Ctrl + K` to add a link to selected text;
- press `Cmd/Ctrl + S` to save;
- paste a public image URL, or paste and drop image files when uploads are
  configured.

Choose **Markdown** in the header whenever you want to edit the source directly.
Choose **Visual** to return to the TipTap surface.

### Safe Markdown round trips

Slipway checks that TipTap can parse and serialize the document without changing
its meaning. If a file contains syntax the visual editor cannot preserve
exactly, Slipway keeps it in Markdown mode and explains why. The source remains
editable and is not silently rewritten.

This protection is important for hand-written Markdown that uses custom HTML,
unusual extensions, or other constructs outside the visual editor's supported
set.

## Metadata

Frontmatter appears in a collapsed **Metadata** section above the document.
Open it to edit values such as title, description, author, publication date, or
tags.

```markdown
---
title: Getting Started with Sails
description: Build and deploy your first Sails application.
published: true
tags: ['sails', 'deployment']
---
```

String, number, boolean, array, and object values are serialized back to valid
frontmatter. Use Markdown mode when a document needs advanced YAML formatting
that the form cannot represent safely.

## Images

When upload storage is configured in Slipway settings, paste or drop an image
into the visual editor. Slipway:

1. accepts AVIF, GIF, JPEG, PNG, and WebP files up to 5 MB;
2. uploads the file through the authenticated Content endpoint;
3. validates the returned URL;
4. inserts the image URL and editable alt text into the Markdown.

If uploads are not configured, paste a public image URL instead. Storage
credentials stay in Slipway settings and are never written into the content
file.

## Save and deploy

The main **Save** action records the change without deploying. Its menu also
offers **Save & Deploy**.

With a connected GitHub repository, saving:

1. checks that the file has not changed since the editor loaded it;
2. commits the update to the application's configured branch;
3. refreshes Slipway's local build context only after the repository write
   succeeds.

Updates use a conventional commit such as:

```text
chore(content): update blog/getting-started
```

**Save & Deploy** then queues a deployment pinned to that commit SHA. A later
push to the branch cannot change what that deployment builds.

For applications without a writable repository source, Slipway can keep the
local content source in sync, but durable repository history and exact Git
revisions require a connected repository.

::: tip Static content
Applications that compile content at build time need **Save & Deploy** before
the change appears in the running release.
:::

## Concurrent edits

The editor remembers the Git blob SHA that was loaded. If another person or
process changes the file first, Slipway rejects the stale save instead of
overwriting the newer content.

Reload the document, review the newer version, reapply the intended edit, and
save again.

## Delete a document

Open the save menu, choose **Delete**, and confirm the destructive action.
Slipway checks the loaded blob SHA before deleting and records a commit such as:

```text
chore(content): delete blog/getting-started
```

The repository history remains the recovery path for Git-backed content.
Deleting local-only content cannot be undone from the dashboard.

## JSON files

JSON records use a source editor rather than the visual Markdown surface:

```json
{
  "title": "Site configuration",
  "navigation": [
    { "label": "Home", "url": "/" },
    { "label": "About", "url": "/about" }
  ]
}
```

Slipway preserves the raw JSON file and applies the same Git conflict protection
when saving it.

## Troubleshooting

### Content is not available

1. Confirm `sails-content` is installed in the application.
2. Deploy the application so Slipway can detect its features.
3. Confirm you are viewing the correct application and environment.

### Visual mode is unavailable

Read the warning above the Markdown source. The file contains syntax that
Slipway cannot round-trip safely. Continue in Markdown mode or simplify the
unsupported construct.

### A save conflicts

The repository version changed after the editor loaded. Reload before making
another save so the newer change is not overwritten.

### A saved change is not live

Use **Save & Deploy** and wait for the pinned deployment to become healthy.
Saving alone does not rebuild an application that compiles content at build
time.

## What's next?

- Configure [file uploads](/slipway/file-uploads) for pasted and dropped images.
- Use [Auto-Deploy](/slipway/auto-deploy) for other repository changes.
- Learn more about [sails-content](https://docs.sailscasts.com/sails-content).
