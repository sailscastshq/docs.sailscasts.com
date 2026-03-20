---
title: Configuration
titleTemplate: Git Vibe
description: Configure Git Vibe with checked-in vibe.toml settings, release versioning, and lifecycle hooks.
prev:
  text: Release and versioning
  link: /git-vibe/release-and-versioning
editLink: true
---

# Configuration

Git Vibe reads configuration in this order:

1. local repo Git config
2. checked-in `vibe.toml`
3. global Git config
4. built-in defaults

That gives teams a shared repo-level source of truth while still letting individual developers override a few preferences locally.

## Example `vibe.toml`

```toml
[vibe]
baseBranch = "main"
branchPrefix = "feat/"
worktreeRoot = "../.vibe"
openEditor = "auto"
openWorkspaceWith = "auto"
deleteRemoteOnFinish = true
issueBranchStyle = "number-and-title"

[release]
versioning = "npm"

[hooks]
post-create = "npm install"
pre-finish = "npm test"
pre-release = "npm test"
```

## Core `vibe` settings

- `baseBranch`
- `branchPrefix`
- `worktreeRoot`
- `openEditor`
- `openWorkspaceWith`
- `deleteRemoteOnFinish`
- `issueBranchStyle`

## Release settings

- `versioning`
- `file`

Git config versions of the same release settings look like this:

```sh
git config vibe.releaseVersioning npm
git config vibe.releaseVersioning file
git config vibe.releaseFile VERSION
```

## Lifecycle hooks

Hooks live under `[hooks]` and run through `sh -c`.

- `post-create` runs after Git Vibe creates or attaches a fresh worktree
- `pre-finish` runs after merge verification and before cleanup
- `pre-release` runs after release validation and before version updates, commit creation, and tagging

Environment variables available to hooks:

- `GIT_VIBE_HOOK`
- `GIT_VIBE_REPO_ROOT`
- `GIT_VIBE_BASE_BRANCH`
- `GIT_VIBE_BRANCH`
- `GIT_VIBE_WORKTREE_PATH`
- `GIT_VIBE_VERSION`
- `GIT_VIBE_ISSUE_NUMBER`

## A few useful local overrides

```sh
git config vibe.openEditor never
git config vibe.openWorkspaceWith codex
git config vibe.issueBranchStyle number-only
git config vibe.deleteRemoteOnFinish true
```

The result is simple: one shared workflow for the repo, with room for each developer and each AI tool to tune the edges.
