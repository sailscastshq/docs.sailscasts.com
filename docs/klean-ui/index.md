---
title: Klean UI
titleTemplate: Sailscasts
description: World-class UI. Source you own. Tailwind you know. Accessible, framework-native components for Vue, React, and Svelte.
outline: [2, 2]
---

<script setup>
import KleanPreview from '../.vitepress/theme/components/KleanPreview.vue'
import KleanWelcome from '../.vitepress/theme/components/KleanWelcome.vue'
import welcomeSource from '../.vitepress/theme/components/KleanWelcome.vue?raw'
</script>

<div class="klean-intro">

<p class="klean-intro__eyebrow">KELVIN'S LEAN UI</p>

# World-class UI.<br>Source you own.<br>Tailwind you know.

<p class="klean-intro__lead">Accessible, framework-native components for Vue, React, and Svelte. Built for The Boring JavaScript Stack. Made to feel like your code.</p>

<div class="klean-intro__actions">
  <a class="klean-intro__primary" href="/klean-ui/installation">Get started <span aria-hidden="true">→</span></a>
  <a class="klean-intro__secondary" href="/klean-ui/components/">Explore components <span aria-hidden="true">↗</span></a>
</div>

<div class="klean-intro__frameworks" aria-label="Supported frameworks"><span>Vue</span><span>React</span><span>Svelte</span><span>Native source. No Klean runtime.</span></div>

</div>

<KleanPreview id="klean-welcome" :source="welcomeSource" filename="NotificationPreferences.vue">
  <template #preview><KleanWelcome /></template>
  <template #caption>Real components, ordinary markup. Choose the emails you want, then save your preferences in this demo.</template>
</KleanPreview>

## Start small. Make it yours.

Add just the component you need. The CLI detects your framework, copies readable source into your application, and installs its direct dependencies.

```sh
npx klean-ui add button
```

<div class="klean-start-grid">
  <a href="/klean-ui/installation"><span>01</span><strong>Add a component</strong><p>Use the CLI or copy the matching framework source.</p><b aria-hidden="true">↗</b></a>
  <a href="/klean-ui/theming"><span>02</span><strong>Write your design</strong><p>Use Tailwind classes, familiar markup, and your product's own language.</p><b aria-hidden="true">↗</b></a>
  <a href="/klean-ui/updating"><span>03</span><strong>Keep ownership</strong><p>Edit the source. Review upstream changes when you're ready.</p><b aria-hidden="true">↗</b></a>
</div>

## A lean contract

Klean means **Kelvin's Lean UI**. The name reflects a simple approach: give the platform the work it already does well, and keep the rest easy to understand.

- **Source you own.** Vue, React, and Svelte each get native, readable files. There is no shared Klean runtime between your app and your framework.
- **HTML first.** A button is an action. A link is navigation. Forms and dialogs keep their native semantics.
- **Tailwind is the visual API.** Appearance lives in your classes. Props earn their place through behavior.
- **Accessibility is correctness.** Naming, keyboard control, focus, state, and reduced motion are part of the component contract.
- **Durable interaction.** Useful state survives interruptions, navigation stays shareable, and failed work can recover.

[Read the doctrine →](/klean-ui/doctrine)

## Build the next screen

Start with [Button](/klean-ui/components/button), compose a form with [Input](/klean-ui/components/input) and [Select](/klean-ui/components/select), or add a focused workflow with [Dialog](/klean-ui/components/dialog).

[Explore the component library →](/klean-ui/components/)

<style>
.klean-docs .klean-intro { padding-top: 7px; }
.klean-docs .klean-intro__eyebrow { margin: 0 0 18px; font-size: 10px; font-weight: 650; letter-spacing: 0.14em; color: var(--vp-c-brand-1); }
.klean-docs .klean-intro h1 { font-size: clamp(34px, 3.8vw, 49px); line-height: 1.13; font-weight: 650; letter-spacing: -0.055em; }
.klean-docs .klean-intro__lead { max-width: 34rem; margin: 22px 0; font-size: 16px; line-height: 1.75; color: var(--vp-c-text-2); }
.klean-intro__actions { display: flex; flex-wrap: wrap; gap: 10px; margin: 25px 0; }
.klean-docs .klean-intro__actions a { display: flex; align-items: center; gap: 16px; min-height: 43px; padding: 0 16px; border: 1px solid var(--vp-c-divider); border-radius: 7px; font-size: 12px; font-weight: 600; text-decoration: none; }
.klean-docs .klean-intro__primary { color: #fff; background: #07162d; border-color: #07162d !important; }
.dark .klean-docs .klean-intro__primary { color: #07162d; background: #fecb05; border-color: #fecb05 !important; }
.klean-docs .klean-intro__secondary { color: var(--vp-c-text-1); }
.klean-docs .klean-intro__actions a:hover { box-shadow: 0 0 0 2px var(--vp-c-brand-soft); }
.klean-intro__frameworks { display: flex; flex-wrap: wrap; gap: 8px 18px; padding: 4px 0 12px; font-size: 11px; font-weight: 600; color: var(--vp-c-text-2); }
.klean-intro__frameworks > span:last-child { color: var(--vp-c-text-3); font-weight: 400; }
.klean-start-grid { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 10px; margin: 25px 0; }
.klean-docs .klean-start-grid a { position: relative; padding: 18px; border: 1px solid var(--vp-c-divider); border-radius: 8px; text-decoration: none; }
.klean-start-grid a:hover { background: var(--vp-c-bg-soft); }
.klean-start-grid span { display: block; font-size: 11px; color: var(--vp-c-text-3); font-family: var(--vp-font-family-mono); }
.klean-start-grid strong { display: block; margin: 16px 0 6px; color: var(--vp-c-text-1); font-size: 13px; }
.klean-docs .klean-start-grid p { margin: 0; color: var(--vp-c-text-2); font-size: 12px; line-height: 1.7; font-weight: 400; }
.klean-start-grid b { position: absolute; top: 14px; right: 14px; font-weight: 400; color: var(--vp-c-text-3); }
@media (max-width: 639px) { .klean-start-grid { grid-template-columns: 1fr; } .klean-start-grid strong { margin-top: 8px; } }
</style>
