---
title: Release and versioning
titleTemplate: Git Vibe
description: Cut releases from main and choose how Git Vibe handles version files.
prev:
  text: AI workflows
  link: /git-vibe/ai-workflows
next:
  text: Configuration
  link: /git-vibe/configuration
editLink: true
---

# Release and versioning

Git Vibe keeps release boring on purpose. There is no `develop` branch and no release branch ceremony. You merge work into `main`, then cut the release directly from `main`.

## Basic release flow

```sh
git switch main
git pull --ff-only origin main
git vibe release 0.0.4 --push
```

That creates:

- a release commit like `chore(release): v0.0.4`
- an annotated tag `v0.0.4`
- an optional push of `main` and the tag when you pass `--push`

## Versioning modes

Git Vibe supports three release versioning modes:

- `none` to skip version file updates entirely
- `file` to update a plain-text version file like `VERSION`
- `npm` to update `package.json` and any existing npm lockfile

### `none`

Use this when you want to bump version files manually before release.

```toml
[release]
versioning = "none"
```

### `file`

Use this when your repo keeps the version in a plain text file.

```toml
[release]
versioning = "file"
file = "VERSION"
```

### `npm`

Use this when your version lives in `package.json`.

```toml
[release]
versioning = "npm"
```

Git Vibe will update `package.json` and any existing npm lockfile before it creates the release commit.

## The convenience default

If your repo already has a top-level `VERSION` file, Git Vibe treats that as file versioning automatically. Otherwise it defaults to `none` until you configure another mode.

::: tip
Git Vibe handles version files. It does not publish your package to npm, push to a registry, or deploy your app. The release command is about version state, Git history, and tags.
:::
