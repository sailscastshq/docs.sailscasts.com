<script setup>
import {
  computed,
  nextTick,
  onBeforeUnmount,
  onMounted,
  ref,
  useAttrs,
  useId,
  watch
} from 'vue'
import { EditorContent, useEditor } from '@tiptap/vue-3'
import StarterKit from '@tiptap/starter-kit'
import ImageExtension from '@tiptap/extension-image'
import FileHandler from '@tiptap/extension-file-handler'
import Placeholder from '@tiptap/extension-placeholder'
import { Markdown } from '@tiptap/markdown'
import { history } from '@tiptap/pm/history'
import { twMerge } from 'tailwind-merge'
import Popover from '../popover/Popover.vue'
import Link from '../icons/Link.vue'
import Image from '../icons/Image.vue'
import {
  inspectMarkdown,
  inspectRichTextHtml,
  htmlRoundTripMatches,
  normalizeLinkUrl,
  normalizeImageUrl,
  preserveMarkdownEnvelope,
  roundTripMatches,
  sanitizeRichTextHtml
} from './rich-text.js'

defineOptions({ inheritAttrs: false })
const props = defineProps({
  modelValue: { type: String, default: undefined },
  format: {
    type: String,
    default: 'html',
    validator: (value) => ['html', 'markdown'].includes(value)
  },
  placeholder: { type: String, default: 'Start writing…' },
  disabled: Boolean,
  readonly: Boolean,
  required: Boolean,
  maxlength: { type: [Number, String], default: undefined },
  upload: { type: Function, default: undefined }
})
const emit = defineEmits(['update:modelValue', 'blur', 'mode-change'])
const attrs = useAttrs()
const generatedId = useId()
const root = ref()
const source = ref()
const toolbar = ref()
const popupAnchor = ref()
const linkInput = ref()
const imageInput = ref()
const imageFile = ref()
const ready = ref(false)
const mode = ref('visual')
const sourceValue = ref(props.modelValue ?? attrs.value ?? '')
const initialValue = sourceValue.value
const warning = ref('')
const status = ref('')
const validationError = ref('')
const popup = ref('')
const linkUrl = ref('')
const imageUrl = ref('')
const imageAlt = ref('')
const popupError = ref('')
const uploading = ref(false)
const labelText = ref('')
const toolbarIndex = ref(0)
const fieldId = computed(
  () => attrs.id ?? `klean-rich-text-${generatedId.replace(/[^\w-]/g, '')}`
)
const locked = computed(() => props.disabled || props.readonly)
const popupOpen = computed({
  get: () => Boolean(popup.value),
  set: (value) => {
    if (!value) popup.value = ''
  }
})
const description = computed(
  () =>
    [
      attrs['aria-describedby'],
      warning.value && `${fieldId.value}-warning`,
      validationError.value && `${fieldId.value}-error`
    ]
      .filter(Boolean)
      .join(' ') || undefined
)
const accessibleLabel = computed(() =>
  attrs['aria-labelledby']
    ? undefined
    : (attrs['aria-label'] ?? (labelText.value || 'Rich text'))
)
const nativeAttrs = computed(() => {
  const {
    class: _class,
    style: _style,
    value: _value,
    id: _id,
    'data-slot': _slot,
    'aria-label': _label,
    'aria-describedby': _description,
    'aria-invalid': _invalid,
    onFocus: _focus,
    ...rest
  } = attrs
  return rest
})
let syncing = false
let composing = false
let destroyed = false
let pendingExternal
let parentForm
let selectionBookmark
let selectedImage = false
let pendingUploads = new Set()
let renderedSource

const toolClass =
  'inline-flex size-9 shrink-0 cursor-pointer items-center justify-center rounded-md text-sm text-gray-600 transition-colors hover:bg-gray-100 hover:text-gray-950 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-950 aria-pressed:bg-gray-100 aria-pressed:text-gray-950 disabled:cursor-not-allowed disabled:opacity-35 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-white dark:aria-pressed:bg-gray-800 dark:aria-pressed:text-white dark:focus-visible:outline-white motion-reduce:transition-none'
const fieldClass =
  'min-h-10 w-full min-w-0 rounded-md border border-gray-300 bg-transparent px-3 py-2 text-sm outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-950 dark:border-gray-700 dark:focus-visible:outline-white'
const actionClass =
  'min-h-10 cursor-pointer rounded-md bg-gray-950 px-4 py-2 text-sm font-medium text-white hover:bg-gray-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-950 disabled:cursor-not-allowed disabled:opacity-40 dark:bg-white dark:text-gray-950 dark:hover:bg-gray-200'
const contentClass =
  'min-h-56 w-full min-w-0 px-5 py-5 text-base/7 outline-none wrap-anywhere *:first:mt-0 *:last:mb-0 [&_p]:my-3 [&_h1]:mt-7 [&_h1]:mb-3 [&_h1]:text-3xl [&_h1]:font-semibold [&_h1]:tracking-tight [&_h2]:mt-6 [&_h2]:mb-3 [&_h2]:text-2xl [&_h2]:font-semibold [&_h2]:tracking-tight [&_h3]:mt-5 [&_h3]:mb-2 [&_h3]:text-xl [&_h3]:font-semibold [&_h4]:mt-4 [&_h4]:font-semibold [&_h5]:font-semibold [&_h6]:font-semibold [&_strong]:font-semibold [&_a]:text-blue-700 [&_a]:underline [&_a]:underline-offset-3 [&_ul]:my-3 [&_ul]:list-disc [&_ul]:ps-6 [&_ol]:my-3 [&_ol]:list-decimal [&_ol]:ps-6 [&_li]:my-1 [&_li>p]:my-1 [&_blockquote]:my-4 [&_blockquote]:border-s-2 [&_blockquote]:border-gray-300 [&_blockquote]:ps-4 [&_blockquote]:text-gray-600 [&_pre]:my-4 [&_pre]:overflow-x-auto [&_pre]:rounded-lg [&_pre]:bg-gray-100 [&_pre]:p-4 [&_pre]:text-sm [&_code]:rounded [&_code]:bg-gray-100 [&_code]:px-1 [&_code]:font-mono [&_code]:text-[0.9em] [&_pre_code]:bg-transparent [&_pre_code]:p-0 [&_img]:my-4 [&_img]:max-h-96 [&_img]:max-w-full [&_img]:rounded-lg [&_img]:object-contain [&_hr]:my-6 [&_hr]:border-gray-200 [&_.ProseMirror-selectednode]:outline-2 [&_.ProseMirror-selectednode]:outline-blue-500 [&_p.is-editor-empty:first-child]:before:pointer-events-none [&_p.is-editor-empty:first-child]:before:float-start [&_p.is-editor-empty:first-child]:before:h-0 [&_p.is-editor-empty:first-child]:before:text-gray-500 [&_p.is-editor-empty:first-child]:before:content-[attr(data-placeholder)] dark:[&_a]:text-blue-400 dark:[&_blockquote]:border-gray-600 dark:[&_blockquote]:text-gray-400 dark:[&_pre]:bg-gray-900 dark:[&_code]:bg-gray-900 dark:[&_hr]:border-gray-800'

const editor = useEditor({
  immediatelyRender: false,
  content: '',
  extensions: [
    StarterKit.configure({
      underline: false,
      link: {
        openOnClick: false,
        autolink: true,
        defaultProtocol: 'https',
        isAllowedUri: (value) => Boolean(normalizeLinkUrl(value)),
        HTMLAttributes: { rel: 'noopener noreferrer', target: null }
      }
    }),
    ImageExtension.configure({ allowBase64: false }),
    Placeholder.configure({ placeholder: () => props.placeholder }),
    Markdown,
    FileHandler.configure({
      allowedMimeTypes: [
        'image/png',
        'image/jpeg',
        'image/gif',
        'image/webp',
        'image/avif'
      ],
      onPaste: (current, files) =>
        uploadFiles(files, current.state.selection.from),
      onDrop: (_current, files, position) => uploadFiles(files, position)
    })
  ],
  editorProps: {
    attributes: {
      role: 'textbox',
      'aria-multiline': 'true',
      'data-slot': 'rich-text-content',
      class: contentClass
    },
    transformPastedHTML: (html) => sanitizeRichTextHtml(html),
    handleKeyDown: (_view, event) => {
      if (event.isComposing) return false
      if (event.altKey && event.key === 'F10') {
        event.preventDefault()
        focusToolbar()
        return true
      }
      if (
        (event.metaKey || event.ctrlKey) &&
        event.key.toLowerCase() === 'k' &&
        !locked.value
      ) {
        event.preventDefault()
        openLink()
        return true
      }
      return false
    },
    handleDOMEvents: {
      focus: (_view, event) => {
        attrs.onFocus?.(event)
        return false
      },
      compositionstart: () => {
        composing = true
        return false
      },
      compositionend: () => {
        composing = false
        queueMicrotask(() => {
          if (destroyed) return
          if (pendingExternal !== undefined) flushExternal()
          else commitEditor()
        })
        return false
      }
    }
  },
  onCreate: ({ editor: current }) => {
    loadValue(sourceValue.value, current)
    syncEditorAttributes(current)
    ready.value = true
    nextTick(() => {
      syncValidity()
      syncToolbar()
    })
  },
  onUpdate: () => {
    if (!composing) commitEditor()
  },
  onTransaction: ({ transaction }) => {
    nextTick(syncToolbar)
    if (!transaction.docChanged) return
    for (const job of pendingUploads)
      job.position = transaction.mapping.map(job.position, 1)
    if (selectionBookmark)
      selectionBookmark = selectionBookmark.map(transaction.mapping)
  }
})

function serialize(current = editor.value) {
  return props.format === 'markdown'
    ? preserveMarkdownEnvelope(current.getMarkdown(), sourceValue.value)
    : current.getHTML()
}
function commitEditor() {
  if (
    !editor.value ||
    syncing ||
    locked.value ||
    mode.value !== 'visual' ||
    pendingExternal !== undefined
  )
    return
  const value = editor.value.isEmpty ? '' : serialize()
  if (value === sourceValue.value) return
  sourceValue.value = value
  renderedSource = value
  emit('update:modelValue', value)
  nextTick(syncValidity)
}
function inspect(value) {
  return props.format === 'markdown'
    ? inspectMarkdown(value)
    : inspectRichTextHtml(value)
}
function loadValue(value, current = editor.value) {
  if (!current) return false
  if (value === renderedSource) {
    warning.value = ''
    return true
  }
  const inspection = inspect(value)
  if (!inspection.supported) {
    warning.value = `Keep editing the source to preserve ${inspection.issues.map((issue) => issue.label).join(', ')}.`
    changeMode('source')
    return false
  }
  syncing = true
  renderedSource = undefined
  try {
    current.commands.setContent(
      props.format === 'html' ? sanitizeRichTextHtml(value) : value,
      { contentType: props.format, emitUpdate: false }
    )
    if (
      props.format === 'html' &&
      !htmlRoundTripMatches(value, current.getHTML())
    ) {
      warning.value =
        'This content needs source editing so none of its formatting is lost.'
      changeMode('source')
      return false
    }
    if (
      props.format === 'markdown' &&
      !roundTripMatches(
        value,
        preserveMarkdownEnvelope(current.getMarkdown(), value),
        (content) => current.markdown.parse(content)
      )
    ) {
      warning.value =
        'This content needs source editing so none of its formatting is lost.'
      changeMode('source')
      return false
    }
    warning.value = ''
    renderedSource = value
    // Loading a different document is not an author edit. Start its undo
    // history here, without retaining content from the previous record.
    const historyKey = history().spec.key
    const historyPlugin = historyKey.get(current.state)
    if (historyPlugin) {
      current.unregisterPlugin(historyKey)
      current.registerPlugin(historyPlugin)
    }
    return true
  } catch {
    warning.value =
      'This content could not be opened safely. Your source is still intact.'
    changeMode('source')
    return false
  } finally {
    syncing = false
  }
}
function changeMode(value) {
  if (mode.value === value) return
  mode.value = value
  emit('mode-change', value)
}
async function setMode(value) {
  if (
    props.disabled ||
    !['visual', 'source'].includes(value) ||
    value === mode.value
  )
    return
  abortUploads()
  popup.value = ''
  if (value === 'visual' && !loadValue(sourceValue.value)) return
  changeMode(value)
  syncEditorAttributes()
  await nextTick()
  focus()
  syncValidity()
}
function updateSource(event) {
  if (locked.value) return
  sourceValue.value = event.target.value
  if (event.isComposing || composing) return
  warning.value = ''
  emit('update:modelValue', sourceValue.value)
  syncValidity()
}
function flushExternal() {
  if (pendingExternal === undefined) return
  const value = pendingExternal
  pendingExternal = undefined
  replaceValue(value)
}
function replaceValue(value) {
  if (value === sourceValue.value) return
  if (composing || editor.value?.view.composing) {
    pendingExternal = value
    return
  }
  abortUploads()
  popup.value = ''
  sourceValue.value = value
  if (mode.value === 'visual') loadValue(value)
  warning.value = mode.value === 'source' ? warning.value : ''
  nextTick(syncValidity)
}
function syncEditorAttributes(current = editor.value) {
  if (!current || destroyed) return
  current.setEditable(!locked.value && mode.value === 'visual', false)
  current.setOptions({
    editorProps: {
      attributes: () =>
        Object.fromEntries(
          Object.entries({
            role: 'textbox',
            'aria-multiline': 'true',
            'data-slot': 'rich-text-content',
            class: contentClass,
            id: `${fieldId.value}-editor`,
            'aria-label': accessibleLabel.value,
            'aria-labelledby': attrs['aria-labelledby'],
            'aria-describedby': description.value,
            'aria-required': props.required ? 'true' : undefined,
            'aria-invalid': validationError.value
              ? 'true'
              : attrs['aria-invalid'],
            'aria-readonly': props.readonly ? 'true' : undefined,
            'aria-disabled': props.disabled ? 'true' : undefined,
            tabindex: props.disabled ? '-1' : '0',
            spellcheck: attrs.spellcheck ?? 'true',
            dir: attrs.dir
          }).filter(([, value]) => value != null)
        )
    }
  })
}
function isEmpty() {
  if (!sourceValue.value.trim()) return true
  return mode.value === 'visual' && editor.value
    ? editor.value.isEmpty
    : props.format === 'html' &&
        !sanitizeRichTextHtml(sourceValue.value)
          .replace(/<[^>]+>/g, '')
          .replace(/&nbsp;/g, ' ')
          .trim() &&
        !/<img\b/i.test(sanitizeRichTextHtml(sourceValue.value))
}
function validityMessage() {
  if (locked.value) return ''
  if (props.required && isEmpty()) return 'Please fill out this field.'
  const max = Number(props.maxlength)
  if (
    props.maxlength !== undefined &&
    Number.isFinite(max) &&
    sourceValue.value.length > max
  )
    return `Use ${max} characters or fewer, including formatting.`
  return ''
}
function syncValidity() {
  const message = validityMessage()
  source.value?.setCustomValidity(message)
  if (validationError.value) validationError.value = message
  syncEditorAttributes()
}
function invalid(event) {
  event.preventDefault()
  validationError.value =
    validityMessage() || source.value?.validationMessage || 'Check this field.'
  syncEditorAttributes()
  focus()
}
function focus(options) {
  if (props.disabled) return
  if (ready.value && mode.value === 'visual')
    editor.value?.view.dom.focus(options)
  else source.value?.focus(options)
}
function tools() {
  return [...(toolbar.value?.querySelectorAll('button:not(:disabled)') ?? [])]
}
function focusToolbar() {
  syncToolbar()
  toolbar.value?.querySelector('button[tabindex="0"]')?.focus()
}
function syncToolbar() {
  const buttons = [...(toolbar.value?.querySelectorAll('button') ?? [])]
  const current = buttons[toolbarIndex.value]
  if (!current || current.disabled)
    toolbarIndex.value = buttons.findIndex((button) => !button.disabled)
}
function toolbarKeydown(event) {
  const buttons = tools()
  const index = buttons.indexOf(event.target)
  if (index < 0) return
  if (event.key === 'Escape') {
    event.preventDefault()
    focus()
    return
  }
  const rtl = getComputedStyle(toolbar.value).direction === 'rtl'
  let target
  if (event.key === 'Home') target = 0
  else if (event.key === 'End') target = buttons.length - 1
  else if (event.key === 'ArrowRight')
    target = (index + (rtl ? -1 : 1) + buttons.length) % buttons.length
  else if (event.key === 'ArrowLeft')
    target = (index + (rtl ? 1 : -1) + buttons.length) % buttons.length
  else return
  event.preventDefault()
  toolbarIndex.value = [...toolbar.value.querySelectorAll('button')].indexOf(
    buttons[target]
  )
  buttons[target]?.focus()
}
function run(command, attributes) {
  if (locked.value || mode.value !== 'visual') return
  editor.value?.chain().focus()[command](attributes).run()
}
function rememberSelection() {
  if (!editor.value) return
  selectionBookmark = editor.value.state.selection.getBookmark()
  selectedImage = editor.value.isActive('image')
}
function restoreSelection() {
  if (!selectionBookmark || !editor.value) return
  try {
    editor.value.view.dispatch(
      editor.value.state.tr.setSelection(
        selectionBookmark.resolve(editor.value.state.doc)
      )
    )
  } catch {
    /* The selected content may have been removed. */
  }
}
async function openLink(event) {
  if (locked.value || mode.value !== 'visual') return
  rememberSelection()
  popupAnchor.value =
    event?.currentTarget ??
    root.value?.querySelector('[data-action="link"]') ??
    editor.value?.view.dom
  linkUrl.value = editor.value?.getAttributes('link').href ?? ''
  popupError.value = ''
  popup.value = 'link'
  await nextTick()
  linkInput.value?.focus()
}
async function openImage(event) {
  if (locked.value || mode.value !== 'visual') return
  rememberSelection()
  popupAnchor.value =
    event?.currentTarget ??
    root.value?.querySelector('[data-action="image"]') ??
    editor.value?.view.dom
  imageUrl.value = selectedImage ? editor.value.getAttributes('image').src : ''
  imageAlt.value = selectedImage
    ? (editor.value.getAttributes('image').alt ?? '')
    : ''
  popupError.value = ''
  popup.value = 'image'
  await nextTick()
  imageInput.value?.focus()
}
function closePopup(returnFocus = true) {
  popup.value = ''
  if (returnFocus) {
    restoreSelection()
    focus()
  }
}
function applyLink() {
  const href = normalizeLinkUrl(linkUrl.value)
  if (!href) {
    popupError.value = 'Enter a safe web, email, phone or relative link.'
    return
  }
  restoreSelection()
  const chain = editor.value.chain().focus().extendMarkRange('link')
  if (editor.value.state.selection.empty && !editor.value.isActive('link'))
    chain
      .insertContent({
        type: 'text',
        text: linkUrl.value.trim(),
        marks: [{ type: 'link', attrs: { href } }]
      })
      .run()
  else chain.setLink({ href }).run()
  closePopup()
}
function removeLink() {
  restoreSelection()
  editor.value?.chain().focus().extendMarkRange('link').unsetLink().run()
  closePopup()
}
function applyImage() {
  const src = normalizeImageUrl(imageUrl.value)
  if (!src) {
    popupError.value = 'Enter a safe image URL.'
    return
  }
  restoreSelection()
  editor.value
    ?.chain()
    .focus()
    .setImage({ src, alt: imageAlt.value.trim() })
    .run()
  closePopup()
}
function abortUploads() {
  if (pendingUploads.size) status.value = ''
  for (const job of pendingUploads) job.controller.abort()
  pendingUploads.clear()
  uploading.value = false
}
async function uploadFiles(
  files,
  position = editor.value?.state.selection.from
) {
  if (locked.value || mode.value !== 'visual' || !editor.value) return
  if (!props.upload) {
    status.value = 'Choose an image URL. File uploads are not configured.'
    return
  }
  const current = editor.value
  const controller = new AbortController()
  const job = { controller, position }
  pendingUploads.add(job)
  uploading.value = true
  status.value = 'Uploading image…'
  closePopup(false)
  try {
    for (const file of Array.from(files)) {
      if (
        ![
          'image/png',
          'image/jpeg',
          'image/gif',
          'image/webp',
          'image/avif'
        ].includes(file.type)
      )
        throw new Error('Choose a PNG, JPEG, GIF, WebP or AVIF image.')
      const result = await props.upload(file, { signal: controller.signal })
      if (
        destroyed ||
        controller.signal.aborted ||
        locked.value ||
        mode.value !== 'visual' ||
        editor.value !== current
      )
        return
      const src = normalizeImageUrl(result?.src)
      if (!src) throw new Error('The upload did not return a safe image URL.')
      const position = Math.min(job.position, current.state.doc.content.size)
      current.commands.insertContentAt(
        position,
        {
          type: 'image',
          attrs: { src, alt: result.alt ?? '', title: result.title ?? null }
        },
        { updateSelection: false }
      )
    }
    status.value = 'Image added. Select it to edit its description.'
  } catch (error) {
    if (!destroyed && !controller.signal.aborted)
      status.value =
        error.message || 'The image could not be uploaded. Try again.'
  } finally {
    pendingUploads.delete(job)
    if (!destroyed) uploading.value = pendingUploads.size > 0
  }
}
function compositeBlur(event) {
  const destination = event.relatedTarget
  if (
    destination &&
    (root.value?.contains(destination) ||
      destination.closest?.(`[data-rich-text-owner="${fieldId.value}"]`))
  )
    return
  queueMicrotask(() => {
    if (destroyed) return
    const active = root.value?.getRootNode().activeElement
    if (
      root.value?.contains(active) ||
      active?.closest?.(`[data-rich-text-owner="${fieldId.value}"]`)
    )
      return
    emit('blur', event)
  })
}
function reset(event) {
  queueMicrotask(() => {
    if (event.defaultPrevented || destroyed) return
    abortUploads()
    sourceValue.value = initialValue
    warning.value = status.value = validationError.value = ''
    popup.value = ''
    if (loadValue(initialValue)) changeMode('visual')
    emit('update:modelValue', initialValue)
    nextTick(syncValidity)
  })
}
onMounted(() => {
  labelText.value = [...(source.value?.labels ?? [])]
    .map((label) => label.textContent.trim())
    .join(' ')
  parentForm = source.value?.form
  parentForm?.addEventListener('reset', reset)
  syncEditorAttributes()
})
onBeforeUnmount(() => {
  destroyed = true
  abortUploads()
  parentForm?.removeEventListener('reset', reset)
})
watch(() => props.modelValue ?? attrs.value ?? '', replaceValue)
watch(
  () => props.format,
  () => {
    abortUploads()
    renderedSource = undefined
    loadValue(sourceValue.value)
    nextTick(syncValidity)
  }
)
watch(
  () => [
    locked.value,
    props.required,
    props.maxlength,
    props.placeholder,
    attrs['aria-label'],
    attrs['aria-labelledby'],
    attrs['aria-describedby'],
    attrs['aria-invalid'],
    attrs.id,
    attrs.dir
  ],
  () => {
    if (locked.value) {
      abortUploads()
      popup.value = ''
    }
    syncEditorAttributes()
    syncValidity()
  }
)
watch(mode, () => nextTick(syncEditorAttributes))
defineExpose({
  editor,
  focus,
  setMode,
  getMode: () => mode.value,
  checkValidity: () => {
    syncValidity()
    return source.value?.checkValidity() ?? true
  },
  reportValidity: () => {
    syncValidity()
    return source.value?.reportValidity() ?? true
  }
})
</script>

<template>
  <div
    ref="root"
    data-slot="rich-text"
    :data-mode="mode"
    :data-disabled="disabled || undefined"
    :data-readonly="readonly || undefined"
    :style="attrs.style"
    :class="
      twMerge(
        'relative w-full min-w-0 rounded-xl border border-gray-200 bg-white text-gray-950 shadow-sm focus-within:border-gray-400 focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-gray-950/15 data-disabled:opacity-50 dark:border-gray-800 dark:bg-gray-950 dark:text-gray-100 dark:focus-within:border-gray-600 dark:focus-within:outline-white/20',
        attrs.class
      )
    "
    @focusout="compositeBlur"
  >
    <slot
      name="toolbar"
      :editor="editor"
      :mode="mode"
      :set-mode="setMode"
      :open-link="openLink"
      :open-image="openImage"
    >
      <div
        data-slot="rich-text-toolbar"
        class="flex flex-wrap items-center gap-2 rounded-t-[inherit] bg-gray-50/70 p-2 dark:bg-gray-900/50"
      >
        <div
          ref="toolbar"
          role="toolbar"
          aria-label="Text formatting"
          class="flex min-w-0 flex-wrap items-center gap-0.5"
          @keydown="toolbarKeydown"
        >
          <button
            v-for="(tool, index) in [
              {
                name: 'Heading',
                text: 'H₂',
                command: 'toggleHeading',
                attributes: { level: 2 },
                active: 'heading'
              },
              {
                name: 'Bold',
                text: 'B',
                command: 'toggleBold',
                active: 'bold',
                class: 'font-bold'
              },
              {
                name: 'Italic',
                text: 'I',
                command: 'toggleItalic',
                active: 'italic',
                class: 'font-serif italic'
              },
              {
                name: 'Strikethrough',
                text: 'S',
                command: 'toggleStrike',
                active: 'strike',
                class: 'line-through'
              },
              {
                name: 'Bullet list',
                path: 'M9 6h11M9 12h11M9 18h11M4 6h.01M4 12h.01M4 18h.01',
                command: 'toggleBulletList',
                active: 'bulletList'
              },
              {
                name: 'Numbered list',
                path: 'M10 6h10M10 12h10M10 18h10M3 5l1-1v5M3 9h2M3 15a1.5 1.5 0 0 1 3 0c0 1-3 2-3 4h3',
                command: 'toggleOrderedList',
                active: 'orderedList'
              },
              {
                name: 'Quote',
                path: 'M10 6H4v6h5c0 3-2 5-5 6M20 6h-6v6h5c0 3-2 5-5 6',
                command: 'toggleBlockquote',
                active: 'blockquote'
              },
              {
                name: 'Code',
                path: 'm8 7-5 5 5 5m8-10 5 5-5 5m-3-14-2 18',
                command: 'toggleCodeBlock',
                active: 'codeBlock',
                class: 'font-mono text-xs'
              }
            ]"
            :key="tool.name"
            type="button"
            data-slot="rich-text-tool"
            :class="twMerge(toolClass, tool.class)"
            :aria-label="tool.name"
            :title="tool.name"
            :aria-pressed="
              editor?.isActive(tool.active, tool.attributes) ?? false
            "
            :disabled="!ready || locked || mode === 'source'"
            :tabindex="toolbarIndex === index ? 0 : -1"
            @focus="toolbarIndex = index"
            @mousedown.prevent
            @click="run(tool.command, tool.attributes)"
          >
            <svg
              v-if="tool.path"
              class="size-4"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="1.5"
              stroke-linecap="round"
              stroke-linejoin="round"
              aria-hidden="true"
              focusable="false"
            >
              <path :d="tool.path" />
            </svg>
            <span v-else>{{ tool.text }}</span>
          </button>
          <button
            type="button"
            data-action="link"
            data-slot="rich-text-tool"
            :class="toolClass"
            aria-label="Link"
            title="Link · Ctrl/⌘ K"
            :aria-pressed="editor?.isActive('link') ?? false"
            :disabled="!ready || locked || mode === 'source'"
            :tabindex="toolbarIndex === 8 ? 0 : -1"
            @focus="toolbarIndex = 8"
            @mousedown.prevent
            @click="openLink"
          >
            <Link class="size-4" />
          </button>
          <button
            type="button"
            data-action="image"
            data-slot="rich-text-tool"
            :class="toolClass"
            aria-label="Image"
            title="Image"
            :disabled="!ready || locked || mode === 'source'"
            :tabindex="toolbarIndex === 9 ? 0 : -1"
            @focus="toolbarIndex = 9"
            @mousedown.prevent
            @click="openImage"
          >
            <Image class="size-4" />
          </button>
          <button
            type="button"
            data-slot="rich-text-tool"
            :class="toolClass"
            aria-label="Undo"
            title="Undo"
            :disabled="
              !ready || locked || mode === 'source' || !editor?.can().undo()
            "
            :tabindex="toolbarIndex === 10 ? 0 : -1"
            @focus="toolbarIndex = 10"
            @mousedown.prevent
            @click="run('undo')"
          >
            <svg
              class="size-4"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="1.5"
              stroke-linecap="round"
              stroke-linejoin="round"
              aria-hidden="true"
              focusable="false"
            >
              <path d="m8 4-5 5 5 5M3 9h11a6 6 0 0 1 0 12h-3" />
            </svg>
          </button>
          <button
            type="button"
            data-slot="rich-text-tool"
            :class="toolClass"
            aria-label="Redo"
            title="Redo"
            :disabled="
              !ready || locked || mode === 'source' || !editor?.can().redo()
            "
            :tabindex="toolbarIndex === 11 ? 0 : -1"
            @focus="toolbarIndex = 11"
            @mousedown.prevent
            @click="run('redo')"
          >
            <svg
              class="size-4"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="1.5"
              stroke-linecap="round"
              stroke-linejoin="round"
              aria-hidden="true"
              focusable="false"
            >
              <path d="m16 4 5 5-5 5m5-5H10a6 6 0 0 0 0 12h3" />
            </svg>
          </button>
        </div>
        <div
          class="ms-auto flex shrink-0 items-center gap-0.5 rounded-md bg-gray-200/50 p-0.5 dark:bg-gray-800/70"
          role="group"
          aria-label="Editing mode"
        >
          <button
            v-for="item in [
              { value: 'visual', label: 'Write' },
              { value: 'source', label: 'Source' }
            ]"
            :key="item.value"
            type="button"
            :disabled="disabled || !ready"
            :aria-pressed="mode === item.value"
            data-slot="rich-text-mode"
            class="min-h-8 cursor-pointer rounded px-2.5 text-xs font-medium text-gray-600 hover:text-gray-950 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-950 aria-pressed:bg-white aria-pressed:text-gray-950 aria-pressed:shadow-sm disabled:cursor-not-allowed dark:text-gray-400 dark:hover:text-white dark:aria-pressed:bg-gray-700 dark:aria-pressed:text-white dark:focus-visible:outline-white"
            @click="setMode(item.value)"
          >
            {{ item.label }}
          </button>
        </div>
      </div>
    </slot>
    <p
      v-if="warning"
      :id="`${fieldId}-warning`"
      data-slot="rich-text-warning"
      class="mx-5 mt-4 rounded-md bg-amber-50 p-3 text-sm/6 text-amber-900 dark:bg-amber-950/40 dark:text-amber-200"
      role="status"
    >
      {{ warning }}
    </p>
    <EditorContent v-show="ready && mode === 'visual'" :editor="editor" />
    <textarea
      ref="source"
      v-bind="nativeAttrs"
      :id="fieldId"
      :value="sourceValue"
      :disabled="disabled"
      :readonly="readonly"
      :required="required"
      :aria-label="accessibleLabel"
      :aria-describedby="description"
      :aria-invalid="validationError ? 'true' : attrs['aria-invalid']"
      :aria-hidden="ready && mode === 'visual' ? 'true' : undefined"
      :tabindex="ready && mode === 'visual' ? -1 : undefined"
      :placeholder="placeholder"
      :spellcheck="mode === 'source' ? false : attrs.spellcheck"
      data-slot="rich-text-source"
      :class="
        ready && mode === 'visual'
          ? 'sr-only'
          : 'block min-h-56 w-full min-w-0 resize-y rounded-b-[inherit] bg-transparent p-5 font-mono text-sm/7 outline-none wrap-anywhere'
      "
      @focus="
        (event) =>
          ready && mode === 'visual' ? focus() : attrs.onFocus?.(event)
      "
      @input="updateSource"
      @compositionstart="composing = true"
      @compositionend="
        (event) => {
          composing = false
          if (pendingExternal !== undefined) flushExternal()
          else updateSource(event)
        }
      "
      @invalid="invalid"
    />
    <p
      v-if="validationError"
      :id="`${fieldId}-error`"
      data-slot="rich-text-error"
      class="px-5 pb-3 text-sm text-red-600 dark:text-red-400"
      role="alert"
    >
      {{ validationError }}
    </p>
    <p
      data-slot="rich-text-status"
      aria-live="polite"
      aria-atomic="true"
      :class="
        status
          ? 'px-5 pb-3 text-sm text-gray-600 dark:text-gray-400'
          : 'sr-only'
      "
    >
      {{ status }}
    </p>
    <Popover
      :id="`${fieldId}-popover`"
      v-model:open="popupOpen"
      :anchor="popupAnchor"
      placement="bottom-start"
      :data-rich-text-owner="fieldId"
      role="dialog"
      :aria-label="popup === 'image' ? 'Edit image' : 'Edit link'"
      class="w-80 max-w-[calc(100vw-1rem)] rounded-xl p-4"
      @focusout="compositeBlur"
      @keydown.esc="
        (event) => {
          if (!event.defaultPrevented) {
            event.preventDefault()
            closePopup()
          }
        }
      "
    >
      <div
        v-if="popup === 'link'"
        class="grid gap-3"
        @keydown.enter="
          (event) => {
            if (event.target.tagName === 'INPUT' && !event.isComposing) {
              event.preventDefault()
              applyLink()
            }
          }
        "
      >
        <label :for="`${fieldId}-link`" class="text-sm font-medium">Link</label>
        <input
          ref="linkInput"
          :id="`${fieldId}-link`"
          v-model="linkUrl"
          :class="fieldClass"
          inputmode="url"
          autocomplete="off"
          placeholder="https://example.com"
          :aria-invalid="Boolean(popupError)"
          :aria-describedby="popupError ? `${fieldId}-popup-error` : undefined"
        />
        <div class="flex flex-wrap gap-2">
          <button type="button" :class="actionClass" @click="applyLink">
            Apply link</button
          ><button
            v-if="editor?.isActive('link')"
            type="button"
            class="min-h-10 cursor-pointer px-2 text-sm text-red-600"
            @click="removeLink"
          >
            Remove</button
          ><button
            type="button"
            class="ms-auto min-h-10 cursor-pointer px-2 text-sm"
            @click="closePopup()"
          >
            Cancel
          </button>
        </div>
      </div>
      <div
        v-else-if="popup === 'image'"
        class="grid gap-3"
        @keydown.enter="
          (event) => {
            if (
              event.target.tagName === 'INPUT' &&
              event.target.type !== 'file' &&
              !event.isComposing
            ) {
              event.preventDefault()
              applyImage()
            }
          }
        "
      >
        <label :for="`${fieldId}-image-url`" class="text-sm font-medium"
          >Image URL</label
        >
        <input
          ref="imageInput"
          :id="`${fieldId}-image-url`"
          v-model="imageUrl"
          :class="fieldClass"
          inputmode="url"
          autocomplete="off"
          placeholder="https://example.com/image.png"
          :aria-invalid="Boolean(popupError)"
          :aria-describedby="popupError ? `${fieldId}-popup-error` : undefined"
        />
        <label :for="`${fieldId}-image-alt`" class="text-sm font-medium"
          >Image description</label
        >
        <input
          :id="`${fieldId}-image-alt`"
          v-model="imageAlt"
          :class="fieldClass"
          placeholder="What does this image show?"
        />
        <p class="text-xs/5 text-gray-500 dark:text-gray-400">
          Describe meaningful images. Leave empty only for decoration.
        </p>
        <div class="flex flex-wrap gap-2">
          <button type="button" :class="actionClass" @click="applyImage">
            {{ selectedImage ? 'Update image' : 'Add image' }}</button
          ><button
            type="button"
            class="ms-auto min-h-10 cursor-pointer px-2 text-sm"
            @click="closePopup()"
          >
            Cancel
          </button>
        </div>
        <template v-if="upload"
          ><input
            ref="imageFile"
            type="file"
            accept="image/png,image/jpeg,image/gif,image/webp,image/avif"
            class="hidden"
            tabindex="-1"
            @change="
              (event) => {
                const files = event.target.files
                if (files?.length)
                  uploadFiles(
                    files,
                    selectionBookmark?.resolve(editor.state.doc).from
                  )
                event.target.value = ''
              }
            "
          /><button
            type="button"
            class="min-h-10 cursor-pointer rounded-md border border-gray-200 px-3 text-sm font-medium hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-900"
            :disabled="uploading"
            @click="imageFile?.click()"
          >
            Choose image file
          </button></template
        >
      </div>
      <p
        v-if="popupError"
        :id="`${fieldId}-popup-error`"
        class="mt-3 text-sm text-red-600 dark:text-red-400"
        role="alert"
      >
        {{ popupError }}
      </p>
    </Popover>
  </div>
</template>
