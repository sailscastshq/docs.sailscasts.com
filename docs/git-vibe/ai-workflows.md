---
title: AI workflows
titleTemplate: Git Vibe
description: Why Git Vibe is especially useful when humans and AI agents work in parallel.
prev:
  text: Daily workflow
  link: /git-vibe/daily-workflow
next:
  text: CLI reference
  link: /git-vibe/cli-reference
editLink: true
---

# AI workflows

Git Vibe is more than a wrapper around `git worktree`. It is a workflow designed for the way developers and teams now work across terminals, editors, bots, and AI agents.

## Why AI-assisted work gets difficult in plain Git

Without explicit isolation, AI-assisted development often leads to:

- unrelated diffs mixed into one checkout
- multiple prompts targeting the same branch unintentionally
- uncertainty about which editor window has the authoritative context
- reluctance to explore because an experiment may affect the current checkout

Git Vibe addresses that by making isolation the default.

## One worktree per task

When you open a vibe, Git Vibe creates a dedicated `feat/*` branch and worktree for that task. That means:

- one agent can work on issue 42
- another agent can explore a documentation change
- your `main` checkout remains clean for review, release, or urgent work

This is the central idea behind Git Vibe: each task receives its own isolated workspace.

## Session memory for agents

You can attach a label and task description when you open a vibe:

```sh
git vibe code --agent codex --task "stabilize release versioning" 11
```

Later, `git vibe check`, `git vibe enter`, and `git vibe open` can surface that same context again. This metadata is useful when you return to a vibe later and need to understand why it exists.

## Better editor handoff

Git Vibe can reopen a vibe in your workspace app and reprint the exact branch context you care about:

```sh
git vibe open 11
git vibe diff 11
git vibe check 11
```

That keeps Codex Desktop and VS Code aligned with the worktree even when the shell or editor does not visibly switch in the way you expect.

## Safe parallelism

The main benefit is operational as much as technical: isolated worktrees make it practical to run multiple AI-assisted tasks in parallel.

Instead of wondering whether an experiment will interfere with your current branch, you can open a separate vibe and keep the work contained.

That is what makes Git Vibe useful for solo developers and teams using AI. It turns parallel AI work into a manageable Git workflow.
