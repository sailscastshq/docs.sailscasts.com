---
title: Asset Versioning
editLink: true
prev:
  text: Root view
  link: '/inertia-sails/root-view'
---

# Asset Versioning

Asset versioning ensures clients always receive fresh assets after deployments. When the version changes, Inertia triggers a full page reload to fetch updated assets.

## Automatic Versioning

inertia-sails automatically handles asset versioning with zero configuration:

### With Shipwright

When using [Shipwright](https://github.com/sailscastshq/sails-hook-shipwright), inertia-sails reads the `.tmp/public/manifest.json` file and generates an MD5 hash. The version automatically changes when any bundled asset changes.

```
Your assets change → manifest.json updates → version hash changes → clients get fresh assets
```

### Without Shipwright

When Shipwright isn't available, inertia-sails uses the server startup timestamp as the version. This ensures fresh assets on each server restart.

## How It Works

1. inertia-sails generates a version string
2. The version is included in every Inertia response
3. The client compares the version with its cached version
4. If different, Inertia triggers a full page reload
5. The browser fetches fresh assets

## Custom Version

Override automatic versioning with a custom version:

```js
// config/inertia.js
module.exports.inertia = {
  version: 'v2.1.0'
}
```

Or use a function for dynamic versioning:

```js
module.exports.inertia = {
  version: () => require('./package.json').version
}
```

## Version Strategies

| Strategy                | Pros                 | Cons                     |
| ----------------------- | -------------------- | ------------------------ |
| Manifest hash (default) | Precise, automatic   | Requires Shipwright      |
| Timestamp (fallback)    | Simple, automatic    | Reloads on every restart |
| Package version         | Semantic, controlled | Manual updates           |
| Custom function         | Flexible             | More complexity          |

## Best Practices

### 1. Use Automatic Versioning

For most apps, the automatic versioning is sufficient:

```js
// config/inertia.js
module.exports.inertia = {
  rootView: 'app'
  // version is auto-detected
}
```

### 2. Avoid Manual Version Bumps

Don't manually update version numbers. Let the manifest hash handle it:

```js
// Don't do this
module.exports.inertia = {
  version: 1 // Have to remember to bump this
}
```

### 3. Use Package Version for Major Releases

If you want version numbers that match your releases:

```js
module.exports.inertia = {
  version: () => {
    const pkg = require('./package.json')
    return pkg.version
  }
}
```

## Debugging

Check the current version in your browser's Network tab. Look for the `X-Inertia-Version` header in responses.

If versions mismatch, you'll see a full page reload instead of an Inertia visit.

## Production Considerations

In production:

1. Build your assets with Shipwright
2. The manifest.json is generated with hashed filenames
3. inertia-sails reads this manifest to generate the version
4. Deploying new assets automatically updates the version

```bash
# Build for production
NODE_ENV=production npm run build

# Start server - version is auto-detected from manifest
npm start
```
