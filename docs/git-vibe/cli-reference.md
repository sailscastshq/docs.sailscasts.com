---
title: CLI reference
titleTemplate: Git Vibe
description: Commands, flags, aliases, and examples for Git Vibe.
prev:
  text: AI workflows
  link: /git-vibe/ai-workflows
next:
  text: Release and versioning
  link: /git-vibe/release-and-versioning
editLink: true
---

# CLI reference

Git Vibe keeps the command surface compact, but each command has a specific role.

If you need the built-in summary, run:

```sh
git vibe help
```

## Start work

### `git vibe code <name>`

Open or create a vibe for a task name.

```sh
git vibe code fix-login-redirect
```

Options:

- `--solo`: force the vibe to open in the current checkout
- `--worktree`: force the vibe to open in its own worktree
- `--editor`: always open the workspace app after opening the vibe
- `--no-editor`: never open the workspace app
- `--codex`: prefer Codex Desktop for workspace opening
- `--vscode`: prefer VS Code for workspace opening
- `--agent <agent>`: attach session metadata such as `codex`
- `--task <task>`: attach a short task description

`worktree` is the default mode. In `solo`, the command creates or switches the vibe branch in your current checkout instead. Fresh worktree-backed vibes also inherit shared runtime paths from the primary checkout before any `post-create` hook runs. By default that means `node_modules`, which helps a new vibe feel immediately runnable when the base checkout is already set up.

### `git vibe issue <number>`

Open or create a vibe from a GitHub issue number.

```sh
git vibe issue 42
```

Options:

- same flags as `git vibe code`

### `git vibe start <name>`

Alias for opening a vibe without launching the editor.

```sh
git vibe start fix-login-redirect
```

## Session and context

### `git vibe session [name]`

Show or update session metadata for a vibe.

```sh
git vibe session 42
git vibe session --agent codex --task "polish the docs" 42
```

Options:

- `--agent <agent>`: set or replace the agent label
- `--task <task>`: set or replace the task description
- `--clear`: remove stored session metadata

### `git vibe enter [--editor|--no-editor] [--codex|--vscode] [name]`

Re-enter a vibe and print its context.

```sh
git vibe enter 42
git vibe enter --vscode 42
```

In `worktree` mode, `enter` jumps back into the worktree path. In `solo` mode, it switches the current checkout back to the vibe branch, keeps the same path, and honors the normal editor-launch policy unless shell integration is driving it through `--shell-output`.

### `git vibe open [name]`

Open an existing vibe in Codex Desktop or VS Code.

```sh
git vibe open 42
git vibe open --codex 42
git vibe open --vscode 42
```

Options:

- `--codex`: force Codex Desktop
- `--vscode`: force VS Code

In `solo` mode, `open` switches the branch first and then reopens the same checkout in the selected workspace app.

### `git vibe diff [name]`

Show the vibe diff against its merge base, plus untracked files.

```sh
git vibe diff 42
```

### `git vibe status [name]`

### `git vibe check [name]`

Show branch, path, backing, compare target, PR state, check summary, session context, shared path plumbing, mode, and repository settings.

```sh
git vibe check
git vibe status 42
```

`check` is an alias for `status`.

### `git vibe checks [name]`

Show detailed PR checks for a vibe.

```sh
git vibe checks 42
```

### `git vibe path <name>`

Print the filesystem path for a vibe.

```sh
git vibe path 42
```

## PR flow

### `git vibe pr [name]`

### `git vibe submit [name]`

Create a pull request for the vibe branch.

```sh
git vibe pr
git vibe submit 42
```

Options:

- `--draft`: create a draft PR
- `--web`: open GitHub's PR creation flow in the browser
- `--title <title>`: set the PR title explicitly
- `--body <body>`: set the PR body explicitly

`submit` is an alias for `pr`.

## Finish and cleanup

### `git vibe finish [name]`

Finish a vibe after it has merged.

```sh
git vibe finish --sync 42
```

Options:

- `--sync`: fetch before checking merge state
- `--local`: fast-forward merge the vibe into the base branch locally before cleanup
- `--delete-remote`: delete the remote vibe branch after merge verification
- `--keep-remote`: keep the remote vibe branch even if repository config says to delete it

### `git vibe list`

Show all active vibes with branch, state, ahead/behind, session summary, changes, and path.

```sh
git vibe list
```

### `git vibe doctor`

Check for missing or stale worktrees.

```sh
git vibe doctor
git vibe doctor --repair
```

Options:

- `--repair`: run worktree repair and prune stale metadata

### `git vibe prune`

Prune stale worktree metadata.

```sh
git vibe prune
```

## Release flow

### `git vibe release <version>`

### `git vibe ship <version>`

Create the release commit and tag from `main`.

```sh
git vibe release 0.0.4
git vibe ship 0.0.4 --push
```

Options:

- `--push`: push `main` and the new tag after the release is created

`ship` is an alias for `release`.

## Utilities

### `git vibe version`

Print the installed Git Vibe version.

```sh
git vibe version
```

### `git vibe hook <pre-commit|commit-msg|pre-push> [args...]`

Internal hook entrypoint used by the installed Git hooks.

Most users do not run this directly.

## A few common commands

```sh
git vibe issue 42
git vibe check
git vibe diff
git vibe pr
git vibe finish --sync 42
git vibe release 0.0.4 --push
```
