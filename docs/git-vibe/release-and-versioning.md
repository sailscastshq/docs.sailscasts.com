---
title: Release and versioning
titleTemplate: Git Vibe
description: Cut releases from main and choose how Git Vibe handles version files.
prev:
  text: CLI reference
  link: /git-vibe/cli-reference
next:
  text: Configuration
  link: /git-vibe/configuration
editLink: true
---

# Release and versioning

Git Vibe keeps releases intentionally straightforward. There is no `develop` branch and no release branch ceremony. You merge work into `main`, then cut the release directly from `main`.

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

Use this when you want to update version files manually before release.

```toml
[release]
versioning = "none"
```

### `file`

Use this when your repository keeps the version in a plain text file.

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

If you prefer to set it globally through Git config:

```sh
git config --global vibe.releaseVersioning npm
```

Git Vibe will update `package.json` and any existing npm lockfile before it creates the release commit.

## The convenience default

If your repository already has a top-level `VERSION` file, Git Vibe treats that as file versioning automatically. Otherwise it defaults to `none` until you configure another mode.

::: tip
Git Vibe handles version files. It does not publish your package to npm, push to a registry, or deploy your application. The release command is about version state, Git history, and tags.
:::
