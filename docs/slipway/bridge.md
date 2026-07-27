---
head:
  - - meta
    - property: 'og:image'
      content: https://docs.sailscasts.com/slipway-social.png
title: Bridge
titleTemplate: Slipway
description: Manage Waterline records through a server-enforced, configurable resource interface.
prev:
  text: Helm
  link: /slipway/helm
next:
  text: Content
  link: /slipway/content
editLink: true
---

# Bridge

Bridge is Slipway's data management interface for Sails applications. It discovers the Waterline models in a running app and provides list, detail, create, edit, and delete surfaces without requiring a second admin schema.

Use the zero-configuration interface for internal tools and early applications. Add a resource contract when Bridge should become a deliberately curated operational or content-management surface.

## Requirements

- The target Sails app must be running.
- The models you want to manage must be available through `sails.models`.
- The signed-in Slipway user must have access to the project and environment.

Open an app in Slipway, use its ellipsis menu, and select **Bridge**.

## Zero-configuration discovery

Without Bridge configuration, Slipway derives sensible defaults from Waterline metadata:

- labels from model and attribute names;
- a compact list of useful columns;
- search across visible string attributes;
- create and edit forms for writable attributes;
- relationship selectors for `model` associations;
- related-record lists for `collection` associations; and
- the model's actual primary key for record routes.

Encrypted and protected attributes are not exposed by the default visible surfaces.

Bridge introspects the running container and caches the normalized contract for 10 minutes. Redeploy the app or wait for the cache to refresh after changing model metadata or `config/slipway.js`.

## Configure the resource contract

Create `config/slipway.js` in the application repository:

```js
module.exports.slipway = {
  bridge: {
    schemaVersion: 1,
    resources: {
      course: {
        label: 'Courses',
        singularLabel: 'Course',
        group: 'Content',
        title: 'title',
        search: ['title'],
        list: ['title', 'published', 'createdAt'],
        show: [
          'id',
          'title',
          'description',
          'thumbnailUrl',
          'published',
          'creator'
        ],
        create: [
          'title',
          'description',
          'thumbnailUrl',
          'published',
          'creator'
        ],
        edit: ['title', 'description', 'thumbnailUrl', 'published', 'creator'],
        filters: ['published'],
        sort: {
          field: 'createdAt',
          direction: 'DESC'
        },
        actions: {
          bulkDelete: false
        },
        fields: {
          title: {
            label: 'Course title',
            placeholder: 'A clear, specific course title'
          },
          description: {
            label: 'Course description',
            type: 'richtext',
            format: 'markdown',
            help: 'The public description shown on the course page.'
          },
          thumbnailUrl: {
            label: 'Thumbnail',
            type: 'upload',
            upload: {
              kind: 'image',
              storage: 'bridge',
              directory: 'courses/thumbnails',
              store: 'url'
            }
          }
        }
      },

      auditLog: false
    }
  }
}
```

`schemaVersion: 1` is the current contract. Slipway rejects unsupported versions, unknown resource options, and references to fields that do not exist. This makes configuration mistakes visible instead of silently exposing a different surface.

## Discovery modes

`discover` defaults to `true`. Configured resources are merged over discovered Waterline metadata, while unconfigured models retain generated defaults.

Set `discover: false` to expose only explicitly listed resources:

```js
module.exports.slipway = {
  bridge: {
    schemaVersion: 1,
    discover: false,
    resources: {
      course: {
        group: 'Content'
      }
    }
  }
}
```

Hide one resource by setting it to `false`:

```js
resources: {
  course: {},
  auditLog: false
}
```

You can also use `{ hidden: true }` when a complete resource object is easier to generate programmatically.

## Resource options

| Option          | Purpose                                                        |
| --------------- | -------------------------------------------------------------- |
| `label`         | Plural name shown in navigation                                |
| `singularLabel` | Singular name used by forms and record pages                   |
| `group`         | Navigation group, such as `Content` or `People`                |
| `title`         | Attribute used to identify a record in menus and relationships |
| `search`        | Attributes included in text search                             |
| `list`          | Columns selected and rendered in the list                      |
| `show`          | Attributes selected for the detail page                        |
| `create`        | Attributes accepted when creating records                      |
| `edit`          | Attributes accepted when updating records                      |
| `filters`       | Attributes available to filter controls                        |
| `sort`          | Default `{ field, direction }` ordering                        |
| `hidden`        | Remove the resource from Bridge                                |
| `actions`       | Enable or disable resource operations                          |
| `fields`        | Presentation metadata for individual attributes                |

Bridge always includes the model's primary key in `list` and `show`, even when it is omitted from the configured arrays.

## Actions

Every action defaults to `true`:

```js
actions: {
  viewAny: true,
  view: true,
  create: true,
  update: true,
  delete: true,
  bulkDelete: false
}
```

Disabled actions are removed from the interface and rejected by the server. Hiding a button is not the security boundary.

## Field options

| Option        | Purpose                                         |
| ------------- | ----------------------------------------------- |
| `label`       | Human-readable field name                       |
| `type`        | Explicit input renderer                         |
| `format`      | Stored format, such as `markdown`               |
| `help`        | Short guidance shown below the field            |
| `placeholder` | Empty input hint                                |
| `readOnly`    | Display the field without accepting mutations   |
| `sortable`    | Allow or prevent list sorting                   |
| `options`     | Values for a select field                       |
| `default`     | Literal create value or primary-key helper      |
| `currency`    | Serializable currency display metadata          |
| `relation`    | Serializable relationship metadata              |
| `upload`      | Upload behaviour and canonical storage metadata |

The form supports text, email, password, number, select, toggle, JSON, and long-form inputs. Set `type: 'richtext'` and `format: 'markdown'` to activate the TipTap visual editor while keeping the model value as Markdown.

The editor supports Markdown shortcuts, a compact formatting menu when text is selected, and direct Markdown source editing. Before entering visual mode, Bridge verifies that the value can round-trip safely. Unsupported Markdown stays in source mode instead of being silently rewritten. Rich-text fields without the explicit `markdown` format continue to use a multiline input.

Raw HTML is denied automatically. You do not need another field option. Bridge disables the save with an inline error and repeats the validation on the server before running the target application's mutation. Normal Markdown and autolinks continue to work.

Treat the stored Markdown as untrusted when the application displays it. Parse it with raw HTML disabled and sanitize the generated HTML before rendering. Editor validation protects the Bridge mutation boundary; output sanitization protects the application's readers.

Unrecognized field types use a safe text fallback.

All field metadata must be serializable because the normalized contract is sent to the Bridge client. Functions, symbols, cyclic objects, and secrets are rejected or must remain outside the contract.

## Primary keys

Bridge treats record identifiers as opaque values:

- numeric IDs work normally, including `0`;
- UUID and other string primary keys are preserved and URL-encoded;
- long identifiers are compacted visually but remain available in full; and
- queries use the model's configured `primaryKey`, not an assumed `id` column.

Bridge also derives every belongs-to selector from the related model's primary
key. It converts a submitted relationship value only when that primary key is
numeric. UUIDs and other string foreign keys remain unchanged through create
and update operations.

Auto-incrementing primary keys and model-level `defaultsTo` values stay
server-managed. A required primary key without either default appears on the
create form so Bridge does not invent your application's identifier format.

If the application generates IDs with a Sails helper, configure that helper as
the primary-key default:

```js
module.exports.slipway = {
  bridge: {
    resources: {
      course: {
        fields: {
          id: {
            default: {
              helper: 'getUuid'
            }
          }
        }
      }
    }
  }
}
```

Namespaced identities such as `ids.getUuid` also work. Slipway resolves the
helper inside the target app, calls it without client-controlled inputs, and
passes the result through the target Waterline model's validation before
creating the record. The generated primary key is not rendered in the form and
cannot be replaced by a forged mutation value.

Do not parse a Bridge URL to infer that an application's records use integers.

## Server enforcement

The resource contract is an authorization boundary as well as UI configuration:

- list queries select only configured `list` fields;
- detail and edit queries select only their configured surfaces;
- create and update payloads reject attributes outside `create` or `edit`;
- Markdown-backed rich-text mutations reject raw HTML by default;
- hidden resources and disabled actions cannot be reached by calling their endpoints directly;
- sort fields and directions are allowlisted; and
- search values are serialized as data before execution in the target container.

Unknown resources, fields, actions, and configuration options fail closed.

::: warning Keep credentials out of the contract
Never place R2, S3, database, or API credentials in `config/slipway.js` field metadata. Use app, environment, or instance environment variables. Bridge upload providers use `BRIDGE_`-prefixed variables so each app can override an environment or instance default without exposing credentials to the browser.
:::

## Upload field boundary

An upload field describes what a future or installed upload renderer should do; it does not contain provider credentials:

```js
thumbnailUrl: {
  type: 'upload',
  upload: {
    kind: 'image',
    storage: 'bridge',
    directory: 'courses/thumbnails',
    store: 'url'
  }
}
```

The stored model value should be the canonical public URL. Configure provider credentials with `BRIDGE_`-prefixed environment variables at the app level for an app-specific bucket, at the environment level for shared project defaults, or globally for instance defaults.

## Troubleshooting

### Models do not appear

1. Confirm the app is running.
2. Confirm the model is loaded in `sails.models`.
3. Check `discover` and the resource's `hidden` value.
4. Check the deployment logs for an unsupported contract option.
5. Redeploy or allow the 10-minute introspection cache to refresh.

### A form field is missing

Check the correct surface: `create`, `edit`, or `show`. Protected, encrypted, generated timestamp, and read-only fields are not writable by default. Primary keys remain hidden when they are auto-incrementing, have a model default, or use a configured helper default; otherwise a required primary key is available on the create surface.

### A save is rejected

Bridge rejects forged or stale attributes before executing the mutation. Reload the page and compare the submitted field with the resource contract.

## What's next?

- Use [Helm](/slipway/helm) for one-off model and helper exploration.
- Use [Content](/slipway/content) for Git-backed Markdown collections.
- Configure [Team Management](/slipway/team-management) to control access to the Slipway project.
