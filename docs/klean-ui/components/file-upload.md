---
title: FileUpload
titleTemplate: Klean UI
description: One native file-selection bridge with honest validation, previews, drop behavior, and caller-owned Tailwind across Vue, React, and Svelte.
outline: [2, 3]
---

<script setup>
import CopyCode from '../../.vitepress/theme/components/CopyCode.vue'
import KleanInstallation from '../../.vitepress/theme/components/KleanInstallation.vue'
import KleanPreview from '../../.vitepress/theme/components/KleanPreview.vue'
import FileUploadRecipes from '../../.vitepress/theme/components/klean/file-upload/FileUploadRecipes.vue'
import fileUploadSource from '../../.vitepress/theme/components/klean/file-upload/FileUpload.vue?raw'
import reactSource from '../sources/file-upload/FileUpload.jsx?raw'
import svelteSource from '../sources/file-upload/FileUpload.svelte?raw'
import vueUsage from '../snippets/file-upload/usage.vue?raw'
import reactUsage from '../snippets/file-upload/usage.jsx?raw'
import svelteUsage from '../snippets/file-upload/usage.svelte?raw'
import logoSource from '../snippets/file-upload/logo.vue?raw'
import receiptSource from '../snippets/file-upload/receipt.vue?raw'
</script>

# FileUpload

FileUpload turns one native file picker into calm application state. It chooses or drops one file, keeps the last accepted value when a candidate is rejected, supplies a temporary preview URL, and cleans that preview up when it is replaced or removed.

The application writes every visible element: the real choose button, drop surface, filename, preview, remove action, error, and Tailwind classes. It also owns the eventual upload request. There is no visual variant, upload runtime, anatomy package, or hidden storage decision.

<KleanPreview id="file-upload-basic" :source="vueUsage" filename="ReceiptField.vue">
  <template #preview>
    <FileUploadRecipes />
  </template>
  <template #caption>
    Browse and drop feed the same one-file contract. The visible button remains the keyboard and screen-reader path.
  </template>
</KleanPreview>

## Installation

One command detects Vue, React, or Svelte and writes the matching one-file source into the conventional component directory:

<KleanInstallation
  id="file-upload-installation"
  component="file-upload"
  :source="fileUploadSource"
  filename="FileUpload.vue"
  destination="assets/js/components/ui/file-upload/FileUpload.vue"
/>

There is no provider, initializer, `klean-ui.json`, upload SDK, class helper, barrel file, or Klean runtime dependency.

## Usage

The framework-native binding contains a `File` or `null`. The content slot or render function receives the same small API in each framework.

### Vue

<CopyCode :code="vueUsage" label="ReceiptField.vue" />

### React

<CopyCode :code="reactUsage" label="ReceiptField.jsx" />

### Svelte

<CopyCode :code="svelteUsage" label="ReceiptField.svelte" />

## API

### Inputs and events

| Input or event           | Default | Purpose                                                                                                       |
| ------------------------ | ------- | ------------------------------------------------------------------------------------------------------------- |
| bound file               | `null`  | Vue `v-model`, React `value`/`onChange`, or Svelte `bind:file`; the selected `File` is the application truth. |
| `accept`                 | —       | Native accept expression, also checked for dropped files: MIME types, wildcards such as `image/*`, or `.ext`. |
| `capture`                | —       | Native mobile capture hint such as `environment`.                                                             |
| `disabled`               | `false` | Prevents browse, drop, replace, and clear.                                                                    |
| `validate(file)`         | accept  | Returns `true`/`undefined` to accept, a message to reject, or `{ reason, message }` for a named policy.       |
| `change` / `onChange`    | —       | Receives the accepted `File` or `null` after clear.                                                           |
| `reject` / `onReject`    | —       | Receives `{ file, reason, message }`; a multiple drop also includes `files`.                                  |
| `class` / `className`    | —       | Ordinary classes on the neutral FileUpload root.                                                              |
| native/global attributes | —       | IDs, titles, data hooks, and accessible relationships for the root.                                           |

### Content API

| Value        | Purpose                                                                                                               |
| ------------ | --------------------------------------------------------------------------------------------------------------------- |
| `file`       | The current accepted `File` or `null`.                                                                                |
| `previewUrl` | A temporary local URL for the current file. Render it only in an element appropriate for the file type.               |
| `dragging`   | Whether a file drag is currently over the bound drop surface.                                                         |
| `choose()`   | Opens the platform file picker. Call it from a real visible button.                                                   |
| `clear()`    | Returns the bound file to `null` and releases its preview.                                                            |
| `dropzone`   | Additive drag/drop event and data bindings for an ordinary caller-owned element. It does not invent button semantics. |

There is deliberately no `variant`, `multiple`, `maxSize`, `upload`, `progress`, `retry`, `endpoint`, `existingUrl`, or preview-kind prop. Validation and visible presentation are clearer where the product rule is written.

## Browse and drop are one path

`accept` affects the platform picker and is also checked when a file is dropped. A drop of several files is rejected instead of silently choosing one. A rejected candidate never destroys the current accepted file.

Drop remains additive. The drop surface is not given a button role or tab stop because a real visible button already invokes `choose()`. Users who cannot or do not drag receive the same capability with native keyboard activation and an honest accessible name.

Client checks are convenience, not trust. MIME metadata and filenames can be wrong. Repeat file type, size, authorization, and content checks on the server before storing or serving an upload.

## Native form boundary

FileUpload resets its internal picker after selection so choosing the same file again is observable. The bound `File` is therefore the source of truth and the application builds the multipart request explicitly.

That is why FileUpload does not accept `name`, `form`, or `required`: those props would falsely imply that the browser submits the hidden picker for you. Keep required validation next to the rest of the form state. Use [Input](/klean-ui/components/input) with `type="file"` when ordinary native form serialization—not a custom preview or drop experience—is the actual requirement.

Upload progress, cancellation, retry, scanning, storage, and server errors also belong to the request layer. Compose [Spinner](/klean-ui/components/spinner), [Alert](/klean-ui/components/alert), and a real status region around FileUpload when those states exist.

## Hagfish business logo

The persisted logo remains server-owned. FileUpload owns only the new local candidate; the wrapper decides whether “Remove” clears that candidate or requests deletion of the current server asset.

<KleanPreview id="file-upload-logo" :source="logoSource" filename="BusinessLogoField.vue">
  <template #preview>
    <FileUploadRecipes recipe="logo" />
  </template>
  <template #caption>
    Existing remote state and a new local File are different truths. The recipe keeps that distinction visible.
  </template>
</KleanPreview>

The square tile, initials, remote fallback, border, and actions are ordinary markup. Avatar is not used here because an invoice logo is editable content, not compact person-or-team identity.

## Hagfish receipt

The receipt flow accepts camera-friendly images and PDF documents, validates the product size limit, previews only images, and leaves multipart submission to the expense form.

<KleanPreview id="file-upload-receipt" :source="receiptSource" filename="ReceiptField.vue">
  <template #preview>
    <FileUploadRecipes recipe="receipt" />
  </template>
  <template #caption>
    Image preview, PDF metadata, replace, remove, drop, and rejection all come from one bound File without product props in FileUpload.
  </template>
</KleanPreview>

`capture="environment"` is a hint to capable mobile browsers, not a requirement to open the camera. The ordinary picker remains available when the browser or device ignores it.

## Durable behavior

An unsubmitted local `File` cannot be reconstructed after refresh, Back/Forward restoration, SSR, or on another device. FileUpload does not pretend otherwise. On refresh, show the server-owned current asset or ask the user to select the file again.

Form drafts may safely remember application metadata such as “a receipt still needs to be reselected,” but must not persist a temporary preview URL or fake a file handle. When a candidate is replaced, cleared, externally changed, or its owner unmounts, its temporary preview is released.

Persisted assets become durable only after the server accepts them and returns authoritative record data or a URL. Navigation and rollback should then use that server truth.

## Accessibility

- Always provide a real visible `button type="button"` for `choose()`; drag and drop is never the only path.
- Name the button for the action and context: “Choose receipt,” “Replace business logo,” or equivalent visible text.
- Keep rejection text visible and use `role="alert"` when it appears as the immediate result of the user's choice.
- Give image previews useful alt text such as “Selected receipt preview.” Do not use an image element for PDFs or unknown file types.
- Include filename and size as text. Do not rely on a thumbnail, color, or icon alone.
- Keep disabled styling and behavior aligned on the visible controls and FileUpload.
- Preserve visible focus and at least a 44-pixel target on choose, replace, and remove buttons.
- Motion for drag feedback is optional and must respect reduced-motion preferences.

## Styling with Tailwind

FileUpload renders no opinionated visible surface. Style the application markup directly: a quiet rounded dropzone, a compact logo tile, a Hagfish border and shadow, or a dense receipt row are all Tailwind recipes.

When one product repeats the same treatment, keep a small product wrapper such as `ReceiptField.vue`. That wrapper may own copy and policy without turning them into global Klean variants.

## When not to use

- Use [Input](/klean-ui/components/input) with `type="file"` for an ordinary native file field submitted by its form.
- Use [Avatar](/klean-ui/components/avatar) to render resilient identity, not to select or upload its source.
- Use a dedicated evidenced component for multiple-file queues, reorderable galleries, image cropping, or resumable uploads.
- Keep upload transport, storage SDKs, antivirus scanning, and server validation outside FileUpload.
- Do not persist `File`, blob URLs, or client MIME metadata as durable truth.

## Complete framework source

Copy, inspect, and change the complete one-file source for your framework.

### Vue source

<CopyCode :code="fileUploadSource" label="FileUpload.vue" />

### React source

<CopyCode :code="reactSource" label="FileUpload.jsx" />

### Svelte source

<CopyCode :code="svelteSource" label="FileUpload.svelte" />

## Related components

- [Button](/klean-ui/components/button) — provides the real visible browse, replace, and remove actions.
- [Input](/klean-ui/components/input) — handles an ordinary native `type="file"` field when custom orchestration is unnecessary.
- [Avatar](/klean-ui/components/avatar) — renders identity after the application has a persisted image source.
- [Alert](/klean-ui/components/alert) — presents recoverable upload or server-validation failures.
- [Spinner](/klean-ui/components/spinner) — supplements visible pending upload status.
