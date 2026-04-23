---
layout: home
title: Git Vibe
titleTemplate: Worktree-first Git with an opt-in solo mode
description: Git Vibe stays worktree-first for parallel human and AI work, while letting solo developers use the same `feat/*` workflow in a single checkout.
hero:
  name: Git Vibe
  text: Parallel lanes when you need them, one checkout when you do not.
  tagline: Keep the worktree-first Git Vibe flow for parallel AI work, then switch to solo mode when you just want to stay in one checkout and keep moving.
  actions:
    - theme: brand
      text: Get Started
      link: /git-vibe/getting-started
    - theme: alt
      text: Star on GitHub
      link: https://github.com/sailscastshq/git-vibe
features:
  - icon: 🤖
    title: Worktree-first by default
    details: Each task can still get its own `feat/*` branch and worktree when you need isolated experiments, reviews, or AI lanes.
  - icon: 🪶
    title: Solo mode when simpler is better
    details: If you usually have one active branch at a time, `vibe.mode=solo` keeps the same `feat/*` workflow in your current checkout.
  - icon: ✅
    title: Stable main branch
    details: Keep in-progress work off `main`, release directly from it, and always know what is ready to ship.
  - icon: ⚡
    title: Integrated workflow
    details: Start from an issue, inspect context and diffs, open the pull request, and finish with cleanup built in whether the vibe lives in a worktree or your current checkout.
---
