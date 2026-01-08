---
title: Source Maps
editLink: true
prev:
  text: 'Context & Breadcrumbs'
  link: '/sentry-sails/context'
---

# Source Maps

Source maps allow Sentry to display readable stack traces instead of minified code. This is especially useful when you bundle or transpile your code.

## Using the Sentry Wizard

The easiest way to set up source maps is using the Sentry wizard:

```bash
npx @sentry/wizard@latest -i sourcemaps
```

The wizard will:

1. Guide you through authentication
2. Detect your build setup
3. Configure automatic source map uploads

### For Specific Organizations

If you have multiple Sentry organizations, specify yours:

```bash
npx @sentry/wizard@latest -i sourcemaps --saas --org your-org --project your-project
```

## Manual Setup

If you prefer manual configuration or the wizard doesn't detect your setup:

### 1. Install the Sentry CLI

```bash
npm install @sentry/cli --save-dev
```

### 2. Create a `.sentryclirc` file

```ini
[defaults]
org=your-org
project=your-project

[auth]
token=your-auth-token
```

:::warning
Never commit your auth token. Use environment variables instead:

```bash
export SENTRY_AUTH_TOKEN=your-auth-token
```

:::

### 3. Add Upload Script

Add to your `package.json`:

```json
{
  "scripts": {
    "sentry:sourcemaps": "sentry-cli sourcemaps inject ./dist && sentry-cli sourcemaps upload ./dist"
  }
}
```

### 4. Run After Build

```bash
npm run build && npm run sentry:sourcemaps
```

## CI/CD Integration

### GitHub Actions

```yaml
- name: Upload source maps to Sentry
  env:
    SENTRY_AUTH_TOKEN: ${{ secrets.SENTRY_AUTH_TOKEN }}
    SENTRY_ORG: your-org
    SENTRY_PROJECT: your-project
  run: |
    npx @sentry/cli sourcemaps inject ./dist
    npx @sentry/cli sourcemaps upload ./dist
```

### Environment Variables

Set these in your CI environment:

| Variable            | Description                   |
| ------------------- | ----------------------------- |
| `SENTRY_AUTH_TOKEN` | Your Sentry auth token        |
| `SENTRY_ORG`        | Your Sentry organization slug |
| `SENTRY_PROJECT`    | Your Sentry project slug      |
| `SENTRY_RELEASE`    | (Optional) Release version    |

## Releases

Associate source maps with releases for better tracking:

```bash
# Create a release
sentry-cli releases new v1.0.0

# Upload source maps
sentry-cli releases files v1.0.0 upload-sourcemaps ./dist

# Finalize the release
sentry-cli releases finalize v1.0.0
```

Then configure your app to use the same release:

```javascript
// config/sentry.js
module.exports.sentry = {
  dsn: process.env.SENTRY_DSN,
  release: process.env.SENTRY_RELEASE || 'v1.0.0'
}
```

## Sails-Specific Notes

For most Sails applications that don't use a bundler, source maps may not be necessary since you're running the original source code directly on the server.

Source maps are most useful when you:

- Use TypeScript with Sails
- Bundle your backend code
- Use Babel or other transpilers

If you're running plain JavaScript without transpilation, Sentry will show your original source code in stack traces automatically.
