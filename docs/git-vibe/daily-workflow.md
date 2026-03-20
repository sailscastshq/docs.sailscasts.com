---
title: Daily workflow
titleTemplate: Git Vibe
description: The issue-to-PR loop that Git Vibe is designed to make feel natural.
prev:
  text: Getting started
  link: /git-vibe/getting-started
next:
  text: AI workflows
  link: /git-vibe/ai-workflows
editLink: true
---

# Daily workflow

Git Vibe works best when you let it own the branch and worktree lifecycle for one task at a time.

## Start from an issue

```sh
git vibe issue 42
```

Git Vibe reads the issue title, creates a deterministic branch, and opens the worktree for that lane.

## Do the work inside the vibe

Useful commands while a vibe is active:

```sh
git vibe diff
git vibe check
git vibe checks
git vibe enter 42
git vibe open 42
```

- `diff` shows the cumulative change for the lane
- `check` shows branch, compare target, PR, checks, and session context
- `enter` jumps your shell back into the vibe
- `open` reopens the same vibe in Codex Desktop or VS Code

## Open the pull request

```sh
git vibe pr
```

For issue-driven vibes, Git Vibe can carry the issue title into the PR title and add `Closes #<issue>` to the body.

## Finish the lane after merge

```sh
git vibe finish --sync 42
```

That is the default happy path when the PR merged on GitHub and your local refs might be stale.

## Recover from weird worktree state

If you moved or deleted a worktree manually, use:

```sh
git vibe list
git vibe doctor
git vibe doctor --repair
```

The goal is not to make Git clever. The goal is to make the safe path obvious and repeatable.

## A full example

```sh
git switch main
git pull --ff-only origin main
git vibe issue 42
git commit -m "feat: implement the fix"
git vibe pr
git vibe check
git vibe finish --sync 42
```

That is the whole rhythm: open a lane, do the work, ship the PR, clean the lane.
