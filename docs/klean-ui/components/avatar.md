---
title: Avatar
titleTemplate: Klean UI
description: One resilient identity image with an accessible fallback, browser-native image behavior, and caller-owned Tailwind across Vue, React, and Svelte.
outline: [2, 3]
---

<script setup>
import CopyCode from '../../.vitepress/theme/components/CopyCode.vue'
import KleanInstallation from '../../.vitepress/theme/components/KleanInstallation.vue'
import KleanPreview from '../../.vitepress/theme/components/KleanPreview.vue'
import KleanAvatar from '../../.vitepress/theme/components/klean/avatar/Avatar.vue'
import AvatarRecipes from '../../.vitepress/theme/components/klean/avatar/AvatarRecipes.vue'
import avatarSource from '../../.vitepress/theme/components/klean/avatar/Avatar.vue?raw'
import reactSource from '../sources/avatar/Avatar.jsx?raw'
import svelteSource from '../sources/avatar/Avatar.svelte?raw'
import vueUsage from '../snippets/avatar/usage.vue?raw'
import reactUsage from '../snippets/avatar/usage.jsx?raw'
import svelteUsage from '../snippets/avatar/usage.svelte?raw'
import compositionSource from '../snippets/avatar/composition.vue?raw'
import productSource from '../snippets/avatar/products.vue?raw'

const portraitMarkup = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 160">
  <rect width="160" height="160" fill="#dbeafe"/>
  <circle cx="80" cy="69" r="35" fill="#70412f"/>
  <path d="M35 160c4-34 20-53 45-53s41 19 45 53" fill="#172554"/>
  <path d="M47 66c0-31 15-47 34-47 24 0 36 17 34 49-8-3-15-9-20-18-13 12-28 18-48 16Z" fill="#0a0a0a"/>
  <circle cx="68" cy="72" r="3" fill="#111827"/>
  <circle cx="93" cy="72" r="3" fill="#111827"/>
  <path d="M70 89c8 6 16 6 23 0" fill="none" stroke="#4c291f" stroke-width="3" stroke-linecap="round"/>
</svg>`
const portrait = `data:image/svg+xml,${encodeURIComponent(portraitMarkup)}`
</script>

# Avatar

Avatar represents one person, team, or other application identity. Give it a source, an explicit accessible name, and fallback content. It uses the image when available and the fallback when the source is absent or fails.

That is the whole contract. Size, shape, color, typography, borders, rings, presence, grouping, and upload state remain visible Tailwind and application markup.

<KleanPreview id="avatar-source" :source="avatarSource" filename="Avatar.vue">
  <template #preview>
    <div class="flex flex-wrap items-center justify-center gap-6">
      <KleanAvatar :src="portrait" alt="Kelvin Omereshone" class="size-16">KO</KleanAvatar>
      <KleanAvatar src="" alt="Ada Okafor" class="size-16 bg-violet-100 text-violet-900 dark:bg-violet-950 dark:text-violet-200">
        AO
      </KleanAvatar>
      <KleanAvatar src="/missing-avatar.webp" alt="Slipway team" class="size-16 rounded-xl bg-gray-950 font-mono text-white dark:bg-white dark:text-gray-950">
        SW
      </KleanAvatar>
    </div>
  </template>
  <template #source>

<<< ../../.vitepress/theme/components/klean/avatar/Avatar.vue

  </template>
</KleanPreview>

## Installation

One command detects Vue, React, or Svelte and writes the matching one-file source into the conventional component directory:

<KleanInstallation
  id="avatar-installation"
  component="avatar"
  :source="avatarSource"
  filename="Avatar.vue"
  destination="assets/js/components/ui/avatar/Avatar.vue"
  :dependencies="['tailwind-merge']"
/>

There is no initializer, provider, `klean-ui.json`, class helper, barrel file, Avatar anatomy package, image service, or runtime Klean dependency.

## Usage

The fallback is ordinary slot or child content. It is visible only when the source is absent or unavailable.

### Vue

<CopyCode :code="vueUsage" label="CreatorLink.vue" />

### React

<CopyCode :code="reactUsage" label="CreatorLink.jsx" />

### Svelte

<CopyCode :code="svelteUsage" label="CreatorLink.svelte" />

## API

| Input                          | Default  | Purpose                                                                                          |
| ------------------------------ | -------- | ------------------------------------------------------------------------------------------------ |
| `src`                          | `''`     | Native image source. An absent or unavailable source reveals the fallback.                       |
| `alt`                          | required | Accessible name for standalone identity, or `''` when nearby visible text already names it.      |
| default slot / children        | —        | Initials, an icon, or other compact fallback content owned by the application.                   |
| `class` / `className`          | —        | Ordinary Tailwind merged after the neutral circular baseline.                                    |
| native image/global attributes | —        | `loading`, `decoding`, `srcset`, `sizes`, IDs, titles, data hooks, and native image event hooks. |
| element reference              | —        | Framework-native access to the current image or fallback element when genuinely needed.          |

There is no `AvatarImage`, `AvatarFallback`, `AvatarBadge`, `AvatarGroup`, `as`, `variant`, `tone`, `color`, `size`, `shape`, `radius`, `status`, `presence`, or delay API.

The slot already is the fallback. Tailwind already expresses the visuals. A Button, anchor, or framework Link already expresses interaction. Adding more parts would only rename those tools.

## Accessible identity

Use an informative `alt` when the Avatar stands alone:

```vue
<Avatar :src="creator.avatarUrl" :alt="creator.name">
  {{ creator.initials }}
</Avatar>
```

When visible text next to the Avatar already names the subject, use `alt=""` so the name is not announced twice:

```vue
<a href="/settings/profile" class="flex items-center gap-3">
  <Avatar :src="creator.avatarUrl" alt="">{{ creator.initials }}</Avatar>
  <span>{{ creator.name }}</span>
</a>
```

The same `alt` decision applies after image failure. An informative fallback is announced as one image with that name; a decorative fallback stays out of the accessibility tree.

Do not use initials as the accessible name when the complete name is known. “KO” is useful visually; “Kelvin Omereshone” is useful to a screen reader.

## Interaction belongs outside

Avatar is not clickable. Put it inside the semantic owner:

- use a real anchor or Boring Stack Link for a profile or team destination;
- use a real Button for an account menu or team switcher;
- keep the Avatar decorative with `alt=""` when that control already has visible naming text;
- give an icon-only parent control a complete `aria-label` that describes its action.

This preserves URLs, modified clicks, keyboard activation, focus rings, disabled state, and browser history without teaching Avatar about routing or commands.

## Styling with Tailwind

The default is intentionally neutral: `size-10`, circular, monochrome fallback, and `object-cover`. Replace any of it directly:

```vue
<Avatar
  :src="team.logoUrl"
  :alt="team.name"
  class="size-16 rounded-xl border border-gray-200 bg-white object-contain p-1"
>
  {{ team.initials }}
</Avatar>
```

Small comment marks, square team logos, bordered profile images, and high-contrast Hagfish initials are class recipes—not component variants. If a recipe repeats throughout one application, keep a tiny application-owned wrapper or shared class next to that product.

## Presence and progress are composition

Presence and upload progress describe application state around identity. They do not change what Avatar is.

<KleanPreview id="avatar-composition" :source="compositionSource" filename="AvatarUpload.vue">
  <template #preview>
    <span class="relative inline-flex">
      <KleanAvatar :src="portrait" alt="Kelvin Omereshone" class="size-20 rounded-xl">KO</KleanAvatar>
      <span class="absolute -right-1 -bottom-1 grid size-5 place-items-center rounded-full border-2 border-white bg-emerald-500 dark:border-gray-950">
        <span class="sr-only">Online</span>
      </span>
    </span>
  </template>
</KleanPreview>

Use visible text or screen-reader text to name a meaningful presence mark. During upload, the application owns a `role="status"` region and [Spinner](/klean-ui/components/spinner); Avatar continues to show the current server value or local preview.

## Hagfish and Slipway recipes

These examples come from the actual adoption seams. They prove that one primitive can preserve both products without acquiring either product's vocabulary.

<KleanPreview id="avatar-products" :source="productSource" filename="ProductAvatars.vue">
  <template #preview>
    <AvatarRecipes />
  </template>
  <template #caption>
    <span>Hagfish owns comment color, density, and creator presence. Slipway owns team switching and upload progress. Avatar owns only resilient identity.</span>
  </template>
</KleanPreview>

Hagfish can replace its Volt Avatar, creator mark, and repeated comment fallback branches while retaining its deterministic color classes and neo-brutalist treatment. Slipway can replace repeated team image-or-initial branches while retaining its quiet sidebar, current-team logic, and profile upload overlay.

## Accessibility

- Always pass `alt`. Choose a complete informative name or the deliberately empty string based on surrounding visible text.
- Keep Avatar static and out of the tab order. The surrounding button or link owns focus and interaction.
- Do not encode presence, role, account state, or notification count through image color alone.
- Keep fallback text legible at every caller-selected size and preserve contrast in light, dark, and forced-colors modes.
- Give upload and async state its own visible or screen-reader status text; the image itself is not a live region.
- Avoid repeating the same identity name in the image, adjacent text, and parent accessible label.

## Durable behavior

Identity comes from server data or application state. It is not copied into local storage or query parameters. The same `src`, `alt`, and fallback content therefore reproduce the same identity on reload, navigation, SSR, and another device.

Image availability is ephemeral: if a source fails, Avatar shows the supplied fallback; if the application supplies a different source, Avatar tries it. That transient browser outcome is not persisted because it can change independently of the identity record.

The surrounding control owns any durable concern:

- profile and team destinations stay real URLs in anchors or Inertia Links;
- current team and creator data stay server-owned;
- upload progress, optimistic preview, retry, and rollback stay with the upload flow;
- menu open state remains ephemeral in Menu or Popover;
- presence comes from the application's realtime or server truth.

## When to use

Use Avatar for compact identity in account controls, team switchers, member lists, comments, activity feeds, assignment rows, profile previews, and other places where an image can degrade to a recognizable fallback.

Use it when the source and fallback should occupy the same visual space and share caller-owned styling.

## When not to use

- Use a plain `img` for editorial images, invoice logos, screenshots, illustrations, or content whose intrinsic ratio matters.
- Use [Badge](/klean-ui/components/badge) for status or compact metadata beside identity.
- Use [Spinner](/klean-ui/components/spinner) and a real status region for upload or loading feedback.
- Use [Button](/klean-ui/components/button), [Menu](/klean-ui/components/menu), or a real Link for interaction around an Avatar.
- Keep initials generation, deterministic colors, image URL transformation, privacy rules, cropping, and storage in the application.
- Do not use Avatar as a file upload, image editor, presence service, or account menu.

## Complete framework source

Copy, inspect, and change the complete one-file source for your framework.

### Vue source

<CopyCode :code="avatarSource" label="Avatar.vue" />

### React source

<CopyCode :code="reactSource" label="Avatar.jsx" />

### Svelte source

<CopyCode :code="svelteSource" label="Avatar.svelte" />

## Related components

- [Button](/klean-ui/components/button) and [Menu](/klean-ui/components/menu) — own account and team-switcher interaction around identity.
- [Badge](/klean-ui/components/badge) — adds visible role, status, or count metadata beside an Avatar without changing it.
- [Spinner](/klean-ui/components/spinner) — supplies the decorative mark inside an app-owned upload status overlay.
- [Card](/klean-ui/components/card) and [Table](/klean-ui/components/table) — provide richer member, team, comment, and activity layouts.
- [Popover](/klean-ui/components/popover) and [Tooltip](/klean-ui/components/tooltip) — add supplementary floating content to the real parent control, never to Avatar itself.
