---
title: Klean UI
titleTemplate: Sailscasts
description: World-class UI. Source you own. Tailwind you know. Kelvin's Lean UI for Vue, React, and Svelte.
outline: [2, 3]
---

<script setup>
import KleanButton from '../.vitepress/theme/components/klean/Button.vue'
import KleanInstallation from '../.vitepress/theme/components/KleanInstallation.vue'
import KleanPreview from '../.vitepress/theme/components/KleanPreview.vue'
import buttonSource from '../.vitepress/theme/components/klean/Button.vue?raw'
import quickUsage from './snippets/introduction/usage.vue?raw'
</script>

# Klean UI

**World-class UI. Source you own. Tailwind you know.**

Framework-native, accessible components for Vue, React, and Svelte. Built for The Boring JavaScript Stack.

Klean UI means **Kelvin's Lean UI**. It is the source-owned component system for The Boring JavaScript Stack: accessible markup, Durable UI behavior, neutral defaults, and Tailwind left directly in your hands.

**Vue, React, and Svelte. Three framework-native sources, one Klean contract.**

Each framework provides the same component behavior, accessibility, and styling choices through its own conventions.

<KleanPreview id="klean-introduction" :source="quickUsage" filename="usage.vue">
  <template #preview>
    <KleanButton>Continue</KleanButton>
    <KleanButton
      as="a"
      href="/klean-ui/components/button"
      class="bg-white text-gray-950 ring-1 ring-inset ring-gray-300 hover:bg-gray-100 dark:bg-gray-900 dark:text-white dark:ring-gray-700 dark:hover:bg-gray-800"
    >
      Read Button docs
    </KleanButton>
  </template>
  <template #source>

<<< ./snippets/introduction/usage.vue

  </template>
  <template #caption>
    Style the component directly with ordinary Tailwind classes.
  </template>
</KleanPreview>

## Installation

Add a component with one command. Klean infers the framework and conventional Boring Stack paths; the files it adds become application source.

<KleanInstallation id="klean-installation" :source="buttonSource" />

Already using Klean source? [Check, review, and update it safely](/klean-ui/updating).

## The contract

- **Own the source.** Components land in the application as readable files.
- **Use the platform.** Actions are buttons; navigation is an anchor or the Boring Stack Link.
- **Style with Tailwind.** There are no visual `variant`, `size`, `tone`, or `radius` props.
- **Prefer conventions.** Klean detects your Boring Stack framework and component directory.
- **Treat accessibility as correctness.** Keyboard behavior, focus, naming, state, and reduced motion are release requirements.
- **Implement Durable UI.** Useful state survives, navigation remains shareable, focus recovers, and failed work rolls back.

## Start with Button

Button is the first documented component, not the definition of the library. Its API is intentionally small: choose the truthful element, pass behavioral state, and write the product's design in `class`.

[Explore Button →](/klean-ui/components/button)

## Make it yours

Edit the installed source, style it with Tailwind, and compose it with your application's own markup.

Read the [Doctrine](/klean-ui/doctrine) for the boundaries behind those choices, [Updating](/klean-ui/updating) for source-aware upgrades, or the [CLI reference](/klean-ui/cli) for the complete command contract.
