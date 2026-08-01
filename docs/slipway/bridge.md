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

## App-local access

By default, Bridge is available to the Slipway team from the app page. You can
also expose a secure Bridge entry at the deployed application's own
`/bridge` route for editors and operators who should manage application data
without receiving access to deployments, secrets, logs, servers, or other
Slipway infrastructure.

Install `sails-hook-slipway`, open **App → Bridge access**, enable Bridge, and
redeploy the app. The redeploy injects a dedicated credential scoped to that
app. Do not add that credential to `config/slipway.js`.

### Invite a host-app user

Bridge access is deliberately separate from Slipway team membership:

1. A Slipway owner or administrator invites an email and chooses `Viewer`,
   `Editor`, or `Administrator`.
2. The recipient opens the invitation and signs in through the deployed
   application's normal login.
3. `sails-hook-slipway` resolves the signed-in host-app user on the server.
4. Slipway activates the invitation only when the authenticated account has a
   verified email that exactly matches the invitation.
5. A short-lived, single-use handoff opens the app-scoped Bridge session.

The account does not need to exist when the invitation is sent. The recipient
may create it through the application's normal sign-up flow, but Bridge remains
unavailable until that account verifies the invited email address.

Someone who only possesses the invitation link cannot activate it with a
different account. Invitations expire after seven days. Use the access menu to
resend an invitation, change a role, or revoke access. Revocation and disabling
Bridge are enforced on the next server request, even if the person already has
Bridge open.

### Default identity convention

The Boring JavaScript Stack works without application code. The hook uses:

- `User` as the identity model;
- `req.session.userId` as the authenticated ID;
- `email` and `fullName` as identity attributes; and
- `emailStatus` equal to `verified` or `confirmed` as proof of verification.

For a conventional model-backed session with different names, map the
attributes:

```js
// config/slipway.js
module.exports.slipway = {
  bridge: {
    loginPath: '/sign-in',
    identity: {
      model: 'member',
      sessionKey: 'memberId',
      emailAttribute: 'emailAddress',
      nameAttribute: 'name',
      emailVerifiedAttribute: 'hasVerifiedEmail'
    }
  }
}
```

If authentication is not model-backed, configure one Sails helper:

```js
// config/slipway.js
module.exports.slipway = {
  bridge: {
    loginPath: '/sign-in',
    identity: {
      helper: 'bridge.identity'
    }
  }
}
```

```js
// api/helpers/bridge/identity.js
module.exports = {
  friendlyName: 'Resolve Bridge identity',

  inputs: {
    req: { type: 'ref', required: true }
  },

  exits: {
    success: { outputType: 'ref' }
  },

  fn: async function ({ req }) {
    const member = await Member.findOne({ id: req.session.memberId })
    if (!member) return null

    return {
      id: member.id,
      email: member.email,
      fullName: member.name,
      emailVerified: member.emailVerified === true
    }
  }
}
```

The helper executes inside the host app and must return
`emailVerified: true`. Slipway fails closed when it cannot prove verification.

### Role ceilings and application authorization

App-local roles form a platform ceiling:

| Role            | Platform ceiling                                       |
| --------------- | ------------------------------------------------------ |
| `Viewer`        | Open dashboards, lists, and records                    |
| `Editor`        | Viewer access plus create, update, upload, and actions |
| `Administrator` | Editor access plus single and bulk deletion            |

The resource `authorization.helper` described below still runs inside the
target app. Its decision can narrow a role but never widen it. For example, an
`Editor` can be denied one course by the application's policy, and cannot gain
delete permission even if a custom helper mistakenly allows it.

### Security lifecycle

- Bridge is disabled per app by default.
- Its encrypted app credential is separate from Lookout telemetry.
- Enabling Bridge rotates that credential, so a stale container cannot
  activate access before the required redeploy.
- Invitation and launch tokens are stored as hashes.
- Launch codes expire after two minutes and are consumed atomically once.
- The handoff regenerates the session before granting Bridge authorization.
- Dedicated Bridge sessions expire after eight hours.
- Disabling Bridge, revoking a grant, or rotating the app credential
  invalidates authorization server-side.

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
        list: ['title', 'price', 'published', 'createdAt'],
        show: [
          'id',
          'title',
          'description',
          'thumbnailUrl',
          'price',
          'published',
          'creator'
        ],
        create: [
          'title',
          'description',
          'thumbnailUrl',
          'price',
          'published',
          'creator'
        ],
        edit: [
          'title',
          'description',
          'thumbnailUrl',
          'price',
          'published',
          'creator'
        ],
        filters: ['title', 'price', 'published', 'creator', 'createdAt'],
        lenses: {
          published: {
            label: 'Published courses',
            filters: {
              published: true
            },
            columns: ['title', 'creator', 'published', 'createdAt'],
            sort: {
              field: 'createdAt',
              direction: 'DESC'
            }
          },
          drafts: {
            label: 'Draft courses',
            filters: {
              published: false
            },
            columns: ['title', 'creator', 'createdAt'],
            sort: {
              field: 'createdAt',
              direction: 'DESC'
            }
          }
        },
        sort: {
          field: 'createdAt',
          direction: 'DESC'
        },
        actions: {
          bulkDelete: false
        },
        authorization: {
          helper: 'bridge.authorize'
        },
        relationships: {
          chapters: {
            fields: ['id', 'title'],
            search: ['title'],
            limit: 8
          },
          lessons: {
            fields: ['id', 'title'],
            search: ['title'],
            limit: 12,
            attach: true,
            detach: true
          }
        },
        fields: {
          price: {
            label: 'Price',
            type: 'currency',
            currency: {
              code: 'USD',
              storage: 'minor',
              submit: 'major'
            }
          },
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
          },
          creator: {
            relation: {
              label: 'Creator',
              search: ['fullName', 'email'],
              limit: 20
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
| `lenses`        | Named list views with fixed filters, columns, and ordering     |
| `sort`          | Default `{ field, direction }` ordering                        |
| `hidden`        | Remove the resource from Bridge                                |
| `actions`       | Enable or disable resource operations                          |
| `authorization` | Target Sails helper for actor-aware action decisions           |
| `fields`        | Presentation metadata for individual attributes                |
| `relationships` | Collection display and explicit attach/detach behavior         |

Bridge always includes the model's primary key in `list` and `show`, even when it is omitted from the configured arrays.

## Filters

Bridge does not expose arbitrary database filtering. A field appears in the
filter menu only when its resource includes that attribute in `filters`.
Bridge then derives the control and permitted operators from the normalized
Waterline field:

| Field type                         | Available filtering                  |
| ---------------------------------- | ------------------------------------ |
| text, textarea, rich text, URL     | contains or exact match              |
| boolean and select                 | exact match                          |
| number and currency                | exact value or range                 |
| date, datetime, and timestamp      | exact value or range                 |
| belongs-to relationship            | authorized, searchable record picker |
| nullable fields of supported types | `is empty` and `is not empty`        |

Global search remains separate and uses only the fields in `search`. Search,
filters, sorting, pagination, and the selected lens live in the page URL. An
authorized teammate can therefore bookmark or share an exact list view without
Bridge keeping hidden browser state.

Bridge validates the field, operator, value type, relationship, and bounded
input length before serializing Waterline criteria for the target app. A
forged URL cannot add an encrypted, protected, hidden, or unconfigured field.

## Saved lenses

A lens is a named list view for a resource. Use one when the team repeatedly
needs the same segment, columns, and ordering:

```js
resources: {
  lesson: {
    search: ['title', 'slug'],
    filters: ['title', 'published', 'creator', 'createdAt'],
    lenses: {
      published: {
        label: 'Published lessons',
        filters: { published: true },
        columns: ['title', 'creator', 'published', 'createdAt'],
        sort: { field: 'createdAt', direction: 'DESC' }
      },
      drafts: {
        label: 'Draft lessons',
        filters: { published: false },
        columns: ['title', 'creator', 'createdAt'],
        sort: { field: 'createdAt', direction: 'DESC' }
      }
    }
  }
}
```

A Bridge user can still search and add an allowed filter while a lens is
active. Set `default: true` on at most one lens when that should be the
resource's initial view. The **All records** option remains available.

### Custom lens queries

Most lenses should use fixed filters because the contract stays easy to read.
For a view that requires aggregates, joins, or application-specific logic,
point the lens at a target-app Sails helper:

```js
recentSignups: {
  label: 'Recent signups',
  columns: ['fullName', 'email', 'createdAt'],
  helper: 'bridge.lenses.recentSignups'
}
```

```js
// api/helpers/bridge/lenses/recent-signups.js
module.exports = {
  friendlyName: 'Load recent Bridge signups',

  inputs: {
    actor: { type: 'ref', required: true },
    resource: { type: 'ref', required: true },
    query: { type: 'ref', required: true }
  },

  fn: async function ({ query }) {
    const records = await User.find(query.criteria)
    const total = await User.count(query.where)
    return { records, total }
  }
}
```

The helper runs inside the target application and receives the authenticated
actor, a small resource description, and the normalized query. It must return
`{ records, total }`. Bridge applies the lens column allowlist and field
redaction before rendering the result, so extra properties returned by the
helper do not become visible.

## Dashboards

Bridge can give an application its own operational landing page without adding
an analytics service or maintaining a second admin schema. Dashboard
configuration lives beside the resource contract in the target application's
`config/slipway.js`. Slipway resolves its data server-side and sends ordinary
Inertia props to the existing Bridge page.

Use `dashboard` for one dashboard:

```js
module.exports.slipway = {
  bridge: {
    dashboard: {
      label: 'Content overview',
      description: 'The content and audience signals that need attention.',
      cards: {
        users: {
          type: 'metric',
          label: 'Total users',
          resource: 'user',
          aggregate: 'count'
        },
        courses: {
          type: 'metric',
          label: 'Published courses',
          resource: 'course',
          aggregate: 'count',
          where: { published: true }
        },
        recentLessons: {
          type: 'recent',
          resource: 'lesson',
          fields: ['title', 'createdAt'],
          limit: 5
        },
        recentSignups: {
          type: 'recent',
          resource: 'user',
          fields: ['fullName', 'email', 'createdAt'],
          limit: 5
        },
        newCourse: {
          type: 'action',
          label: 'New Course',
          resource: 'course'
        },
        newChapter: {
          type: 'action',
          label: 'New Chapter',
          resource: 'chapter'
        },
        newLesson: {
          type: 'action',
          label: 'New Lesson',
          resource: 'lesson'
        }
      }
    }
  }
}
```

Card keys must be safe JavaScript-style identifiers and remain stable across
deployments. Bridge uses them to match configuration with the server result.
Cards are displayed in their configured order. A contract may contain up to 12
dashboards and 24 cards per dashboard.

### Dashboard contract

`dashboard` is shorthand for a single dashboard named `overview`. Use either
`dashboard` or `dashboards`, never both. A dashboard must contain at least one
card.

| Option        | Required           | Default                      | Contract                                                    |
| ------------- | ------------------ | ---------------------------- | ----------------------------------------------------------- |
| `label`       | No                 | Humanized dashboard key      | String, at most 80 characters                               |
| `description` | No                 | None                         | String, at most 240 characters                              |
| `default`     | No                 | First dashboard in its scope | Boolean; only one default per scope and resource            |
| `scope`       | No                 | `environment`                | `global`, `project`, `environment`, or `resource`           |
| `resource`    | For resource scope | None                         | Visible Bridge resource identity; rejected for other scopes |
| `cards`       | Yes                | —                            | Non-empty object with at most 24 cards                      |

Dashboard and card keys must begin with a letter and contain only letters and
numbers. Use stable camelCase keys such as `contentHealth` and `recentLessons`.
Unknown configuration keys fail validation instead of being silently ignored.

### Multiple dashboards and scope

Use `dashboards` instead of `dashboard` when the app needs multiple views:

```js
bridge: {
  dashboards: {
    overview: {
      default: true,
      scope: 'environment',
      cards: {
        users: {
          type: 'metric',
          resource: 'user'
        }
      }
    },

    courseHealth: {
      scope: 'resource',
      resource: 'course',
      cards: {
        published: {
          type: 'metric',
          resource: 'course',
          aggregate: 'count',
          where: { published: true }
        }
      }
    }
  }
}
```

`scope` accepts `global`, `project`, `environment`, or `resource`. Global,
project, and environment dashboards appear on the Bridge landing page. A
resource dashboard appears above that resource's records and must declare its
`resource`. Mark one dashboard per scope as `default: true`; otherwise Bridge
uses the first configured dashboard for that scope. When a scope has multiple
dashboards, Bridge shows a compact selector.

Defaults are grouped by scope and, for resource dashboards, by resource. A
course dashboard and a lesson dashboard can therefore each be their own
default. Two course dashboards cannot both be marked default.

### Card contract

Every card has a `type` and can use these common options:

| Option        | Required        | Contract                                                                 |
| ------------- | --------------- | ------------------------------------------------------------------------ |
| `type`        | Yes             | `metric`, `recent`, `action`, `trend`, `partition`, or `custom`          |
| `label`       | No              | String up to 80 characters; otherwise derived from the card key and type |
| `description` | No              | String up to 240 characters                                              |
| `resource`    | Depends on type | Must name a visible resource in the same Bridge contract                 |

`metric`, `recent`, and `action` require a resource. On a resource-scoped
dashboard they inherit the dashboard resource when the card omits it. Helper
cards may declare a resource to participate in normal resource authorization,
or omit it and make their domain authorization decision inside the helper.

The six card types are intentionally narrow:

| Type        | Data source            | Required options                       | Result                              |
| ----------- | ---------------------- | -------------------------------------- | ----------------------------------- |
| `metric`    | Waterline aggregate    | `resource`; `field` except for `count` | One finite number                   |
| `recent`    | Bounded Waterline find | `resource`                             | Up to 10 redacted records           |
| `action`    | Built-in Bridge route  | `resource`                             | Link to the create form             |
| `trend`     | Target-app helper      | `helper`                               | Up to 31 labelled numeric points    |
| `partition` | Target-app helper      | `helper`                               | Up to 12 labelled numeric segments  |
| `custom`    | Target-app helper      | `helper`                               | Primitive value and optional detail |

Bridge normalizes the complete contract when it loads the target application.
An unknown resource, hidden resource, unavailable field, unsupported option, or
unsafe helper identity rejects the invalid contract instead of becoming a
partially trusted browser configuration.

### Metrics

Metric cards use Waterline directly:

```js
revenue: {
  type: 'metric',
  label: 'Revenue',
  resource: 'order',
  aggregate: 'sum',
  field: 'total',
  where: { status: 'paid' },
  format: 'currency',
  currency: 'USD'
}
```

| Option      | Values                                                        |
| ----------- | ------------------------------------------------------------- |
| `aggregate` | `count`, `sum`, `average`, `min`, or `max`                    |
| `field`     | Numeric field required by every aggregate except `count`      |
| `where`     | Waterline criteria using fields on the list or filter surface |
| `format`    | `number`, `compact`, `currency`, or `percent`                 |
| `currency`  | Three-letter code required by `currency`                      |
| `prefix`    | Short text placed before the formatted value                  |
| `suffix`    | Short text placed after the formatted value                   |

`percent` follows `Intl.NumberFormat` semantics, so store `0.42` to display
`42%`.

`aggregate` defaults to `count`, and `format` defaults to `number`. A count card
must not provide `field`; every other aggregate requires a readable numeric
field. Currency codes are normalized to uppercase. Prefixes and suffixes can
be at most 20 characters.

`where` accepts serializable Waterline criteria using only fields on the
resource's list or filter surface. Nested `and` and `or` branches are supported.
Functions, dates, class instances, prototype keys, non-finite numbers, and
unbounded structures are rejected. Configuration is limited to eight nested
levels, 50 keys per object, and 100 items per array.

### Recent records and quick actions

A `recent` card performs one bounded Waterline query. `limit` defaults to `5`
and cannot exceed `10`. `fields` must be fields already available to the
resource, and Bridge always includes the real primary key so links work for
integer, string, and UUID identifiers.

```js
recentLessons: {
  type: 'recent',
  resource: 'lesson',
  fields: ['title', 'published', 'createdAt'],
  limit: 5,
  sort: {
    field: 'createdAt',
    direction: 'DESC'
  }
}
```

When `fields` is omitted, Bridge starts with the resource primary key, title,
and list fields and keeps the first four unique fields. The real primary key is
always selected even when it was not requested explicitly.

`sort` defaults to the resource's configured sort. A custom sort must contain a
readable `field`; `direction` defaults to `DESC` and accepts `ASC` or `DESC`.
Recent cards do not accept arbitrary criteria. Use the resource contract to
define the intended record surface or a helper-backed card for a domain-specific
selection.

An `action` card currently supports the built-in `create` action. Bridge
derives the route from the project, environment, and resource:

```js
newLesson: {
  type: 'action',
  label: 'New Lesson',
  resource: 'lesson',
  action: 'create'
}
```

`action` defaults to `create`; no other action value is accepted. The card is
removed when the resource's server-normalized `create` action is disabled.

### Helper-backed cards

Use target-app Sails helpers for domain-specific values, trends, and
partitions:

```js
signupTrend: {
  type: 'trend',
  label: 'Signups this week',
  resource: 'user',
  helper: 'bridge.dashboard.signups'
},
lessonStatus: {
  type: 'partition',
  label: 'Lesson status',
  resource: 'lesson',
  helper: 'bridge.dashboard.lessonStatus'
},
releaseHealth: {
  type: 'custom',
  label: 'Release health',
  helper: 'bridge.dashboard.releaseHealth'
}
```

Helper identities use normal Sails dot notation such as
`bridge.dashboard.signups`. The helper must exist in the running target app.
It receives the authenticated `actor`, the selected `dashboard`, and a small
serializable `card` description:

```js
// api/helpers/bridge/dashboard/signups.js
module.exports = {
  friendlyName: 'Bridge signup trend',

  inputs: {
    actor: { type: 'ref', required: true },
    dashboard: { type: 'ref', required: true },
    card: { type: 'ref', required: true }
  },

  fn: async function ({ actor }) {
    const member = await User.findOne({ email: actor.email })
    if (!member || member.role !== 'admin') {
      throw new Error('This metric is unavailable.')
    }

    return {
      points: [
        { label: 'Mon', value: 18 },
        { label: 'Tue', value: 26 },
        { label: 'Wed', value: 21 }
      ]
    }
  }
}
```

Trend helpers return `{ points: [{ label, value }] }` with at most 31 points.
Partition helpers return `{ segments: [{ label, value }] }` with at most 12
segments. Custom helpers return `{ value, detail }`; `value` must be a string,
finite number, or boolean. Slipway truncates labels and detail text,
re-normalizes all helper results, and never accepts helper-provided HTML.

The exact helper inputs are:

| Input       | Shape                                                                                             |
| ----------- | ------------------------------------------------------------------------------------------------- |
| `actor`     | Verified Bridge identity and role context for the current request                                 |
| `dashboard` | `{ id, label, scope, resource }`                                                                  |
| `card`      | `{ id, type, label, resource }`, where `resource` is a safe summary rather than the full contract |

For a helper card with a resource, the summary contains its identity, primary
key, title, labels, and attribute type metadata. It does not contain database
records or credentials.

Helper output is normalized twice: once inside the target app execution and
again by Slipway before it becomes an Inertia prop. Trend and partition labels
are limited to 80 characters. Custom string values are limited to 160
characters and detail to 240. Non-finite numbers and malformed points are
dropped.

All visible cards for a dashboard are resolved in one isolated target-app
execution. Each card has its own error boundary. A failed helper or query
produces a generic unavailable state for that card while the remaining cards
continue to render; internal exception details remain in Slipway logs.

### Dashboard authorization

Dashboard cards use the same server-enforced resource authorization as CRUD:

- a metric or recent-record card requires `viewAny`;
- a quick action requires `create`;
- hidden or denied resources remove the card entirely;
- recent records select configured fields and are redacted again before they
  become Inertia props; and
- resource-free custom cards must make their domain-specific decision inside
  the helper using `actor`.

The browser never receives a denied card, count, or record. A helper or query
failure affects only that card; the rest of the dashboard remains usable.

For sensitive business metrics, prefer both layers: associate the card with a
resource so Bridge applies `viewAny`, then recheck the host application's
domain role inside the helper. Do not treat a hidden UI card as an authorization
rule—the helper is the final authority for resource-free domain data.

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

### Actor-aware authorization

Use a target app helper when permissions depend on the person using Bridge:

```js
course: {
  authorization: {
    helper: 'bridge.authorize'
  }
}
```

Slipway calls the helper inside the running target application for `viewAny`, `view`, `create`, `update`, `delete`, `bulkDelete`, and configured custom action names. The helper receives:

- `actor`: the signed-in Slipway user's ID, email, full name, team role, and current project/environment identifiers;
- `action`: the operation being checked;
- `resource`: the resource identity, primary key, and labels; and
- `recordId`: the normalized primary key when a record is in scope.

The target application should map `actor.email` or another stable identifier to its own user record and make the domain-specific decision:

```js
// api/helpers/bridge/authorize.js
const levels = {
  user: 0,
  editor: 1,
  admin: 2
}

module.exports = {
  friendlyName: 'Authorize Bridge',

  inputs: {
    actor: { type: 'ref', required: true },
    action: { type: 'string', required: true },
    resource: { type: 'ref', required: true },
    recordId: { type: 'ref' }
  },

  fn: async function ({ actor, action }) {
    const user = await User.findOne({ email: actor.email })
    if (!user) return false

    const requiredLevel = ['update', 'delete', 'bulkDelete'].includes(action)
      ? levels.admin
      : levels.editor

    return (levels[user.role] ?? -1) >= requiredLevel
  }
}
```

This gives the same split as the existing Sailscasts Nexus clearance: editors can discover, read, and create; admins can also update and delete. Return `true` or `{ allowed: true }` to permit the action. A falsey result, missing helper, thrown error, or malformed result fails closed.

The existing Slipway team/project check remains the outer gate. The target helper is the application-specific gate; receiving an actor object is not authorization by itself.

### Custom actions

Custom actions connect a small, declarative Bridge UI contract to a Sails
helper in the target application. They use the same authorization helper as
the built-in actions.

```js
course: {
  authorization: 'bridge.authorize',
  actions: {
    bulkDelete: false,

    syncCatalog: {
      scope: 'resource',
      helper: 'bridge.syncCatalog',
      label: 'Sync catalog',
      success: 'Catalog synchronized.'
    },

    publish: {
      scope: 'record',
      helper: 'bridge.publishCourse',
      label: 'Publish course',
      description: 'Make this course available to students.',
      confirm: 'Publish this course now?',
      success: 'Course published.',
      fields: {
        notifyStudents: {
          type: 'boolean',
          label: 'Notify students',
          default: true
        },
        releaseNote: {
          type: 'textarea',
          label: 'Release note',
          help: 'Included in the student notification.',
          required: true,
          minLength: 3,
          maxLength: 280
        }
      }
    },

    regenerateLicenses: {
      scope: 'bulk',
      helper: 'bridge.regenerateLicenses',
      label: 'Regenerate licenses',
      destructive: true,
      confirm: 'Existing license links will stop working.',
      fields: {
        reason: {
          type: 'select',
          required: true,
          default: 'security',
          options: [
            { label: 'Security rotation', value: 'security' },
            { label: 'Content update', value: 'content' }
          ]
        }
      }
    }
  }
}
```

The scope controls where an action appears and which identifiers its helper
receives:

| Scope      | UI location                             | Helper context |
| ---------- | --------------------------------------- | -------------- |
| `resource` | Resource list toolbar                   | No record IDs  |
| `record`   | Record detail action menu               | `recordId`     |
| `bulk`     | Selected-record action menu on the list | `recordIds`    |

Bulk actions accept at most 100 selected records per execution. Slipway
normalizes and deduplicates every identifier against the resource primary key
before authorization or execution.

An action without fields, confirmation, or destructive behavior runs directly
from the menu. Fields and confirmation use one focused dialog. A destructive
action gets the red confirmation treatment and a safe default confirmation
message when `confirm` is omitted.

Action fields reuse Bridge's browser and server field validation. They support
`text`, `textarea`, `richtext`, `email`, `url`, `number`, `currency`,
`boolean`, `select`, `json`, `date`, `datetime`, and `timestamp`. Fields may
define `label`, `help`, `placeholder`, `required`, `default`, `options`, `min`,
`max`, `minLength`, `maxLength`, `format`, and `currency`.

Defaults and select options are checked while Bridge normalizes the resource
contract. Rich text supports the explicit Markdown format and repeats the
raw-HTML check on the server. Relationship and upload fields remain record-form
workflows rather than action inputs.

The target helper declares the context it needs:

```js
// api/helpers/bridge/publish-course.js
module.exports = {
  friendlyName: 'Publish course',

  inputs: {
    actor: { type: 'ref', required: true },
    resource: { type: 'ref', required: true },
    values: { type: 'ref', required: true },
    recordId: { type: 'ref', required: true }
  },

  fn: async function ({ actor, values, recordId }) {
    await Course.updateOne({ id: recordId }).set({ published: true })

    if (values.notifyStudents) {
      await sails.helpers.course.notifyStudents.with({
        courseId: recordId,
        note: values.releaseNote,
        triggeredBy: actor.email
      })
    }

    return { message: 'Course published and students notified.' }
  }
}
```

Resource helpers omit `recordId`. Bulk helpers declare
`recordIds: { type: 'ref', required: true }`. A helper may return a string or
`{ message }`; other return data stays in the target application. Slipway
normalizes feedback to plain text and limits it to 500 characters.

Execution is synchronous with Bridge's existing target-container timeout. For
long-running work, start a Quest job or another background task in the helper
and return a message that the job was queued.

Authorization is evaluated when rendering the action and again immediately
before execution. A denied action is absent from the UI and a forged request
still fails closed. Successful and failed helper executions create a Slipway
audit event containing the actor, project, environment, action, scope, and
affected record identifiers. Submitted field values and helper return data are
not stored in the audit log.

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
| `sensitive`   | Mark an additional field as hidden by default   |
| `visibility`  | Per-surface field visibility                    |
| `currency`    | Serializable currency display metadata          |
| `relation`    | Serializable relationship metadata              |
| `upload`      | Upload behaviour and canonical storage metadata |
| `component`   | Registered field component extension point      |

`visibility` accepts boolean values for `list`, `show`, `create`, `edit`, and `filter`:

```js
fields: {
  internalNote: {
    sensitive: true,
    visibility: {
      show: true,
      edit: true
    }
  },
  githubAccessToken: {
    visibility: {
      list: false,
      show: false,
      create: false,
      edit: false,
      filter: false
    }
  }
}
```

A `false` value is a hard deny for that surface, including direct requests. A `true` value explicitly opts a sensitive-name field into that surface. Listing a field in the resource-level `list`, `show`, `create`, `edit`, or `filters` array is also an explicit opt-in.

Bridge hides encrypted and protected attributes, plus names that look like passwords, tokens, secrets, API keys, credentials, recovery codes, `emailChangeCandidate`, `planCode`, or `subscriptionCode`. This prevents zero-configuration discovery from turning private operational fields into an accidental admin form. Set `sensitive: true` for application-specific private data.

The field engine supports `text`, `textarea`, `richtext`, `email`, `url`,
`number`, `currency`, `boolean`, `select`, `belongsTo`, `json`, `date`,
`datetime`, `timestamp`, `password`, `secret`, `file`, `image`, and `upload`.
Bridge infers email, URL, enum, boolean, JSON, relationship, timestamp,
encrypted, and long-text behavior from Waterline metadata. Use an explicit
`type` when the stored Waterline type does not describe the intended editor.

JSON is validated before submit and hydrated into an object before the target
model mutation. Email and URL values receive native browser input behavior plus
server validation. URLs must use HTTP or HTTPS. Required fields keep the create
or save button disabled until the current values are valid.

Select fields accept Waterline `isIn` values or labeled options:

```js
status: {
  type: 'select',
  options: [
    { label: 'Draft', value: 'draft' },
    { label: 'Published', value: 'published' }
  ]
}
```

### Currency fields

Currency configuration separates display hydration from mutation hydration:

```js
price: {
  type: 'currency',
  currency: {
    code: 'USD',
    locale: 'en-US',
    storage: 'minor',
    submit: 'major'
  }
}
```

This displays a stored value of `3499` as `$34.99`, then submits `34.99` to the
target Waterline model. Existing `beforeCreate` and `beforeUpdate` callbacks
can therefore keep converting dollars to cents. Use `submit: 'minor'` when the
model expects Bridge to submit `3499` directly, or `storage: 'major'` when the
database already stores `34.99`.

The fraction digit options default to `2` and can be changed with
`minimumFractionDigits` and `maximumFractionDigits`.

### Markdown fields

Set `type: 'richtext'` and `format: 'markdown'` to activate the TipTap visual
editor while keeping the model value as Markdown.

The editor supports Markdown shortcuts, a compact formatting menu when text is selected, and direct Markdown source editing. Before entering visual mode, Bridge verifies that the value can round-trip safely. Unsupported Markdown stays in source mode instead of being silently rewritten. Rich-text fields without the explicit `markdown` format continue to use a multiline input.

Add an image upload contract to let an editor paste or drop an image directly
into Markdown:

```js
description: {
  type: 'richtext',
  format: 'markdown',
  upload: {
    kind: 'image',
    storage: 'bridge',
    directory: 'descriptions',
    store: 'url',
    accept: ['image/avif', 'image/jpeg', 'image/png', 'image/webp'],
    maxBytes: 10485760
  }
}
```

Bridge streams the image through the same authorized R2/S3 boundary as an
ordinary upload field, inserts its canonical URL as Markdown image syntax, and
keeps the model value as Markdown. Pasted public image URLs continue to work
without an upload.

Raw HTML is denied automatically. You do not need another field option. Bridge disables the save with an inline error and repeats the validation on the server before running the target application's mutation. Normal Markdown and autolinks continue to work.

Treat the stored Markdown as untrusted when the application displays it. Parse it with raw HTML disabled and sanitize the generated HTML before rendering. Editor validation protects the Bridge mutation boundary; output sanitization protects the application's readers.

Unrecognized field types use a safe text fallback.

All field metadata must be serializable because the normalized contract is sent to the Bridge client. Functions, symbols, cyclic objects, and secrets are rejected or must remain outside the contract.

The optional `component` field value names a component registered in
Slipway's Bridge field registry. A registration may provide separate `form`,
`list`, and `show` components. The target application's contract carries only
the safe component name, never executable UI code.

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

## Relationships

Bridge understands both Waterline `model` and `collection` associations.
Belongs-to fields render as searchable selectors using the related resource's
primary key and `title` field, so UUIDs stay opaque while people see useful
names.

Override the generated selector under the field's `relation` key:

```js
lesson: {
  fields: {
    chapter: {
      relation: {
        label: 'Chapter',
        search: ['title', 'slug'],
        limit: 20
      }
    },
    creator: {
      relation: {
        search: ['fullName', 'email']
      }
    }
  }
}
```

Bridge sends only the first bounded page with the form. The selector searches
and paginates through a dedicated JSON transport as the user types, instead of
placing an entire user, course, or chapter table in the Inertia page.

Create and update requests repeat the related resource's `viewAny`
authorization and verify that each submitted belongs-to ID still exists.
Hiding a selector therefore cannot be bypassed with a forged form payload.

Collection associations appear as compact related-record lists on the detail
page. Configure their safe columns and page size with `relationships`:

```js
course: {
  relationships: {
    chapters: {
      label: 'Chapters',
      fields: ['id', 'title', 'position'],
      search: ['title'],
      limit: 8
    },
    lessons: {
      fields: ['id', 'title'],
      search: ['title'],
      limit: 12,
      attach: true,
      detach: true
    }
  }
}
```

`fields` and `search` may contain only attributes already allowed by the
related resource contract. `limit` must be between 1 and 50. Hidden resources
and denied `viewAny` decisions do not appear.

::: warning Collection mutation is opt-in
Bridge never enables collection mutation from Waterline discovery alone.
`attach` and `detach` must be explicitly set to `true` for each collection.
:::

Attach and detach call Waterline's `addToCollection()` and
`removeFromCollection()` methods; they never delete the related record. A
mutation proceeds only when:

1. the exact operation is enabled in `relationships`;
2. the target authorization helper permits `update` on the parent resource;
   and
3. it permits `viewAny` on the related resource.

Waterline remains responsible for association semantics. For example, a
one-to-many detach is rejected when it would clear a required foreign key, and
Bridge reports that failure instead of forcing invalid data.

## Server enforcement

The resource contract is an authorization boundary as well as UI configuration:

- list queries select only configured `list` fields;
- detail and edit queries select only their configured surfaces;
- records are redacted again after parsing and before becoming Inertia props;
- create and update payloads reject attributes outside `create` or `edit`;
- Markdown-backed rich-text mutations reject raw HTML by default;
- hidden resources and disabled actions cannot be reached by calling their endpoints directly;
- actor-aware authorization uses the same server decision that hides unavailable controls;
- sort fields and directions are allowlisted; and
- search values are serialized as data before execution in the target container.

Unknown resources, fields, actions, and configuration options fail closed.

::: warning Keep credentials out of the contract
Never place R2, S3, database, or API credentials in `config/slipway.js` field metadata. Use app, environment, or instance environment variables. Bridge can reuse conventional app-scoped R2/S3 credentials or use explicit `BRIDGE_` overrides without exposing credentials to the browser.
:::

## Upload field boundary

An upload field describes its file constraints and stores the resulting public
URL. It does not contain provider credentials:

```js
thumbnailUrl: {
  type: 'upload',
  upload: {
    kind: 'image',
    storage: 'bridge',
    directory: 'courses/thumbnails',
    store: 'url',
    accept: ['image/avif', 'image/jpeg', 'image/png', 'image/webp'],
    maxBytes: 5242880
  }
}
```

The stored model value should be the canonical public URL. Configure provider
credentials at the app level for an app-specific bucket, at the environment
level for shared project defaults, or globally for instance defaults.

For Cloudflare R2:

```text
BRIDGE_STORAGE_PROVIDER=r2
BRIDGE_R2_ACCESS_KEY=...
BRIDGE_R2_SECRET_KEY=...
BRIDGE_R2_BUCKET=...
BRIDGE_R2_ENDPOINT=https://ACCOUNT_ID.r2.cloudflarestorage.com
BRIDGE_R2_PUBLIC_URL=https://cdn.example.com
BRIDGE_R2_REGION=auto
```

For S3-compatible storage, use `BRIDGE_STORAGE_PROVIDER=s3` and the equivalent
`BRIDGE_S3_ACCESS_KEY`, `BRIDGE_S3_SECRET_KEY`, `BRIDGE_S3_BUCKET`,
`BRIDGE_S3_ENDPOINT`, `BRIDGE_S3_PUBLIC_URL`, and `BRIDGE_S3_REGION` names.

### Reuse an app's existing storage

Bridge detects a complete conventional R2 credential set:

```text
R2_ACCESS_KEY=...
R2_SECRET_KEY=...
R2_BUCKET=...
R2_ENDPOINT=https://ACCOUNT_ID.r2.cloudflarestorage.com
```

When those values already belong to the app, add only its canonical public
origin:

```text
BRIDGE_R2_PUBLIC_URL=https://assets.example.com
```

R2 region defaults to `auto`; neither duplicate credentials nor a region
variable is required. A complete conventional `S3_` set works the same way.
If both providers are configured, set `BRIDGE_STORAGE_PROVIDER` explicitly.

App values override environment values; environment values override
instance-global values. Within each scope, explicit `BRIDGE_R2_*` or
`BRIDGE_S3_*` values override the corresponding conventional value. This lets
Bridge use a separate bucket without changing the app's own upload setup.

### Preserve an existing bucket hierarchy

Uploads remain isolated under a team/project/environment namespace by default.
An app with a dedicated bucket can explicitly write into an established
bucket-root hierarchy:

```js
videoUrl: {
  type: 'upload',
  upload: {
    kind: 'file',
    storage: 'bridge',
    scope: 'bucket',
    directory: '{course.title|slug}/{chapter.title|slug}',
    filename: '{title|slug}',
    store: 'url',
    accept: ['video/mp4', 'video/quicktime', 'video/webm'],
    maxBytes: 2 * 1024 * 1024 * 1024
  }
}
```

This produces an object key such as:

```text
building-durable-uis/introduction/course-assumptions.mp4
```

Use `{field}` for a scalar field and `{relationship.field}` for a scalar field
on a belongs-to record. Add `|slug` to create a lowercase URL-safe segment.
`filename` is an extension-free stem; Bridge derives the extension from the
accepted file type.

Path templates are declarative and reusable—none of the field or relationship
names are hardcoded in Slipway. Bridge validates every reference against the
normalized resource contract, rejects sensitive or non-scalar fields, loads
related records from the target app, blocks uploads until required selections
exist, sanitizes every segment, and rejects traversal. `scope: 'bucket'` must
be explicit because it intentionally omits Slipway's normal namespace.

Bridge authorizes the actor and target resource before streaming the file to
object storage. It enforces the MIME allowlist and size limit without buffering
the entire upload in application memory. The response contains the public URL
and a short-lived receipt signed by Slipway. A create or update accepts that
URL only when the receipt matches the current actor, project, environment,
resource, and field, so a browser cannot substitute an arbitrary remote URL or
reuse a receipt on another app.

Use a dedicated asset origin and configure an object-store lifecycle rule for
abandoned objects under the default `bridge/` prefix or the bucket-root prefix
selected by the application. A user can upload a file and leave the form
before saving; the short-lived receipt protects the mutation boundary, while
the lifecycle rule controls storage left by abandoned forms.

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
