---
title: Configuration
titleTemplate: Git Vibe
description: Configure Git Vibe with checked-in vibe.toml settings, shared runtime plumbing, release versioning, and lifecycle hooks.
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

This gives teams a shared repository-level source of truth while still working well for solo developers who want one place to set the defaults.

## Example `vibe.toml`

```toml
[vibe]
mode = "worktree"
baseBranch = "main"
branchPrefix = "feat/"
worktreeRoot = "../.vibe"
openEditor = "auto"
openWorkspaceWith = "auto"
deleteRemoteOnFinish = true
issueBranchStyle = "number-and-title"
sharedPaths = "node_modules, .venv"

[release]
versioning = "npm"

[hooks]
post-create = "npm install"
pre-finish = "npm test"
pre-release = "npm test"
```

## Core `vibe` settings

- `mode`
- `baseBranch`
- `branchPrefix`
- `worktreeRoot`
- `openEditor`
- `openWorkspaceWith`
- `deleteRemoteOnFinish`
- `issueBranchStyle`
- `sharedPaths`

## Release settings

- `versioning`
- `file`

Git config versions of the same release settings look like this:

```sh
git config vibe.releaseVersioning npm
git config vibe.releaseVersioning file
git config vibe.releaseFile VERSION
```

## Workspace behavior

`vibe.mode=worktree|solo` controls whether Git Vibe opens vibes in separate worktrees or in the current checkout.

- `worktree` is the built-in default and is the right choice for parallel human or AI lanes
- `solo` is the better fit when you usually have one active branch at a time and want the editor to stay on the same checkout

Examples:

```sh
git config --global vibe.mode solo
git config vibe.mode worktree
```

`vibe.openEditor=auto|always|never` controls whether Git Vibe tries to launch a workspace app after opening a vibe. In `solo`, that applies to `git vibe code` and `git vibe enter`; in `worktree`, it applies to the vibe-opening commands while `enter` stays shell-oriented unless you explicitly force a launch.

`vibe.openWorkspaceWith=auto|codex|vscode` controls which workspace app Git Vibe prefers.

In `auto`, Git Vibe prefers Codex Desktop inside a Codex shell and otherwise uses VS Code when the `code` CLI is available. If your solo flow should usually reopen in VS Code, set `vibe.openWorkspaceWith=vscode`.

## Shared runtime paths

`vibe.sharedPaths` is a comma-separated list of relative repo paths that Git Vibe should symlink from the primary checkout into a fresh worktree-backed vibe before `post-create` runs.

By default, Git Vibe uses:

```sh
git config --global vibe.sharedPaths node_modules
```

That default makes a practical difference for Node projects: if your main checkout already has `node_modules`, a fresh vibe can usually run `npm run dev`, `npm test`, and local CLIs immediately.

Useful examples:

```toml
[vibe]
sharedPaths = "node_modules, .venv"
```

```sh
git config vibe.sharedPaths "node_modules,.direnv"
git config vibe.sharedPaths none
```

Use `none` when you want to disable automatic runtime plumbing for a repo.

## Lifecycle hooks

Hooks live under `[hooks]` and run through `sh -c`.

- `post-create` runs after Git Vibe creates or attaches a fresh worktree-backed vibe and after shared path plumbing is linked
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
git config vibe.mode solo
git config vibe.openEditor never
git config vibe.openWorkspaceWith codex
git config vibe.issueBranchStyle number-only
git config vibe.deleteRemoteOnFinish true
```

The result is a shared workflow with predictable defaults and room for local overrides where needed.
