---
title: AI workflows
titleTemplate: Git Vibe
description: Why Git Vibe is especially useful when humans and AI agents work in parallel.
prev:
  text: Daily workflow
  link: /git-vibe/daily-workflow
next:
  text: Release and versioning
  link: /git-vibe/release-and-versioning
editLink: true
---

# AI workflows

Git Vibe is not just a nicer alias for `git worktree`. It is a workflow designed around the reality that modern teams work with multiple terminals, editors, bots, and AI agents at the same time.

## Why AI work gets messy in plain Git

Without explicit lanes, AI-assisted development often turns into:

- one checkout with unrelated diffs mixed together
- multiple prompts targeting the same branch by accident
- confusion about which editor window has the real context
- hesitation about asking an agent to explore because it might pollute your current state

Git Vibe solves that by making isolation the default.

## One worktree per task

When you open a vibe, Git Vibe creates a dedicated `feat/*` branch and worktree for that task. That means:

- one agent can work on issue 42
- another agent can explore a docs change
- your `main` checkout stays clean for review, release, or hotfix work

This is the AI-native idea at the center of Git Vibe: every task gets its own room.

## Session memory for agents

You can attach a label and task description when you open a vibe:

```sh
git vibe code --agent codex --task "stabilize release versioning" 11
```

Later, `git vibe check`, `git vibe enter`, and `git vibe open` can show that same context again. That lightweight memory matters when you come back to a vibe hours later and want to remember what the lane was for.

## Better editor handoff

Git Vibe can reopen a vibe in your workspace app and reprint the exact branch context you care about:

```sh
git vibe open 11
git vibe diff 11
git vibe check 11
```

That keeps Codex Desktop and VS Code feeling anchored even when the shell or editor does not visibly switch the way you expect.

## Safe parallelism

The biggest win is psychological as much as technical: when each vibe is isolated, it feels safe to ask an AI agent to try something bold.

You are no longer thinking:

> I hope this experiment does not contaminate my current branch.

You are thinking:

> Open a new vibe and try it there.

That is what makes Git Vibe useful for AI teams. It turns multi-agent work from a scary Git problem into a normal project habit.
