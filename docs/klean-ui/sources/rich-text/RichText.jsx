import { EditorContent, useEditor } from '@tiptap/react'
import FileHandler from '@tiptap/extension-file-handler'
import { history } from '@tiptap/pm/history'
import StarterKit from '@tiptap/starter-kit'
import Image from '@tiptap/extension-image'
import Placeholder from '@tiptap/extension-placeholder'
import { Markdown } from '@tiptap/markdown'
import {
  forwardRef,
  useEffect,
  useId,
  useImperativeHandle,
  useRef,
  useState
} from 'react'
import { twMerge } from 'tailwind-merge'
import Popover from '../popover/Popover.jsx'
import Link from '../icons/Link.jsx'
import ImageIcon from '../icons/Image.jsx'
import {
  inspectMarkdown,
  inspectRichTextHtml,
  normalizeImageUrl,
  normalizeLinkUrl,
  preserveMarkdownEnvelope,
  roundTripMatches,
  sanitizeRichTextHtml,
  htmlRoundTripMatches
} from './rich-text.js'

const ROOT =
  'relative w-full min-w-0 rounded-xl border border-gray-200 bg-white text-gray-950 shadow-sm focus-within:border-gray-400 focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-gray-950/15 data-disabled:opacity-50 dark:border-gray-800 dark:bg-gray-950 dark:text-gray-100 dark:focus-within:border-gray-600 dark:focus-within:outline-white/20'
const CONTENT =
  'min-h-56 w-full min-w-0 px-5 py-5 text-base/7 outline-none wrap-anywhere *:first:mt-0 *:last:mb-0 [&_p]:my-3 [&_h1]:mt-7 [&_h1]:mb-3 [&_h1]:text-3xl [&_h1]:font-semibold [&_h1]:tracking-tight [&_h2]:mt-6 [&_h2]:mb-3 [&_h2]:text-2xl [&_h2]:font-semibold [&_h2]:tracking-tight [&_h3]:mt-5 [&_h3]:mb-2 [&_h3]:text-xl [&_h3]:font-semibold [&_h4]:mt-4 [&_h4]:font-semibold [&_h5]:font-semibold [&_h6]:font-semibold [&_strong]:font-semibold [&_a]:text-blue-700 [&_a]:underline [&_a]:underline-offset-3 [&_ul]:my-3 [&_ul]:list-disc [&_ul]:ps-6 [&_ol]:my-3 [&_ol]:list-decimal [&_ol]:ps-6 [&_li]:my-1 [&_li>p]:my-1 [&_blockquote]:my-4 [&_blockquote]:border-s-2 [&_blockquote]:border-gray-300 [&_blockquote]:ps-4 [&_blockquote]:text-gray-600 [&_pre]:my-4 [&_pre]:overflow-x-auto [&_pre]:rounded-lg [&_pre]:bg-gray-100 [&_pre]:p-4 [&_pre]:text-sm [&_code]:rounded [&_code]:bg-gray-100 [&_code]:px-1 [&_code]:font-mono [&_code]:text-[0.9em] [&_pre_code]:bg-transparent [&_pre_code]:p-0 [&_img]:my-4 [&_img]:max-h-96 [&_img]:max-w-full [&_img]:rounded-lg [&_img]:object-contain [&_hr]:my-6 [&_hr]:border-gray-200 [&_.ProseMirror-selectednode]:outline-2 [&_.ProseMirror-selectednode]:outline-blue-500 [&_p.is-editor-empty:first-child]:before:pointer-events-none [&_p.is-editor-empty:first-child]:before:float-start [&_p.is-editor-empty:first-child]:before:h-0 [&_p.is-editor-empty:first-child]:before:text-gray-500 [&_p.is-editor-empty:first-child]:before:content-[attr(data-placeholder)] dark:[&_a]:text-blue-400 dark:[&_blockquote]:border-gray-600 dark:[&_blockquote]:text-gray-400 dark:[&_pre]:bg-gray-900 dark:[&_code]:bg-gray-900 dark:[&_hr]:border-gray-800'
const TOOL =
  'inline-flex size-9 shrink-0 cursor-pointer items-center justify-center rounded-md text-sm text-gray-600 transition-colors hover:bg-gray-100 hover:text-gray-950 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-950 aria-pressed:bg-gray-100 aria-pressed:text-gray-950 disabled:cursor-not-allowed disabled:opacity-35 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-white dark:aria-pressed:bg-gray-800 dark:aria-pressed:text-white dark:focus-visible:outline-white motion-reduce:transition-none'
const FIELD =
  'min-h-10 w-full min-w-0 rounded-md border border-gray-300 bg-transparent px-3 py-2 text-sm outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-950 dark:border-gray-700 dark:focus-visible:outline-white'
const ACTION =
  'min-h-10 cursor-pointer rounded-md bg-gray-950 px-4 py-2 text-sm font-medium text-white hover:bg-gray-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-950 disabled:cursor-not-allowed disabled:opacity-40 dark:bg-white dark:text-gray-950 dark:hover:bg-gray-200'
const COMMANDS = [
  ['Heading', 'H₂', 'heading', 'toggleHeading', { level: 2 }],
  ['Bold', 'B', 'bold', 'toggleBold', undefined, 'font-bold'],
  ['Italic', 'I', 'italic', 'toggleItalic', undefined, 'font-serif italic'],
  ['Strikethrough', 'S', 'strike', 'toggleStrike', undefined, 'line-through'],
  ['Bullet list', '• ≡', 'bulletList', 'toggleBulletList'],
  ['Numbered list', '1. ≡', 'orderedList', 'toggleOrderedList'],
  ['Quote', '❞', 'blockquote', 'toggleBlockquote'],
  [
    'Code',
    '</>',
    'codeBlock',
    'toggleCodeBlock',
    undefined,
    'font-mono text-xs'
  ]
]

function ToolGlyph({ name, children }) {
  const path = {
    'Bullet list': 'M9 6h11M9 12h11M9 18h11M4 6h.01M4 12h.01M4 18h.01',
    'Numbered list':
      'M10 6h10M10 12h10M10 18h10M3 5l1-1v5M3 9h2M3 15a1.5 1.5 0 0 1 3 0c0 1-3 2-3 4h3',
    Quote: 'M10 6H4v6h5c0 3-2 5-5 6M20 6h-6v6h5c0 3-2 5-5 6',
    Code: 'm8 7-5 5 5 5m8-10 5 5-5 5m-3-14-2 18',
    Undo: 'm8 4-5 5 5 5M3 9h11a6 6 0 0 1 0 12h-3',
    Redo: 'm16 4 5 5-5 5m5-5H10a6 6 0 0 0 0 12h3'
  }[name]
  return path ? (
    <svg
      className="size-4"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      <path d={path} />
    </svg>
  ) : (
    <span>{children}</span>
  )
}

const RichText = forwardRef(function RichText(
  {
    value = '',
    onValueChange,
    format = 'html',
    id,
    name,
    form,
    required = false,
    disabled = false,
    readOnly = false,
    maxLength,
    placeholder = 'Start writing…',
    upload,
    renderToolbar,
    className,
    style,
    onBlur,
    onFocus,
    onInput,
    onModeChange,
    ...attributes
  },
  ref
) {
  const generatedId = useId().replace(/[^a-zA-Z0-9_-]/g, '')
  const fieldId = id ?? `klean-rich-text-${generatedId}`
  const root = useRef(null)
  const textarea = useRef(null)
  const editorRef = useRef(null)
  const linkPopover = useRef(null)
  const imagePopover = useRef(null)
  const linkButton = useRef(null)
  const imageButton = useRef(null)
  const linkInput = useRef(null)
  const imageInput = useRef(null)
  const fileInput = useRef(null)
  const toolbar = useRef(null)
  const initial = useRef(String(value ?? ''))
  const syncing = useRef(false)
  const alive = useRef(false)
  const jobs = useRef(new Set())
  const selection = useRef(null)
  const composing = useRef(false)
  const pendingExternal = useRef(undefined)
  const lastRenderedValue = useRef(undefined)
  const [source, setSource] = useState(String(value ?? ''))
  const sourceRef = useRef(source)
  const [mode, setModeState] = useState('source')
  const modeRef = useRef(mode)
  const [revision, setRevision] = useState(0)
  const [compatibility, setCompatibility] = useState('')
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')
  const [pending, setPending] = useState(0)
  const [linkUrl, setLinkUrl] = useState('')
  const [linkError, setLinkError] = useState('')
  const [imageUrl, setImageUrl] = useState('')
  const [imageAlt, setImageAlt] = useState('')
  const [imageError, setImageError] = useState('')
  const [selectedImage, setSelectedImage] = useState(false)
  const [toolbarIndex, setToolbarIndex] = useState(0)
  const latest = useRef(null)
  latest.current = {
    value,
    onValueChange,
    format,
    required,
    disabled,
    readOnly,
    maxLength,
    placeholder,
    upload,
    attributes,
    onBlur,
    onFocus,
    onInput,
    onModeChange
  }

  function assignSource(next, emit = false) {
    sourceRef.current = next
    setSource(next)
    if (textarea.current) textarea.current.value = next
    if (emit) latest.current.onValueChange?.(next)
  }

  function cancelUploads() {
    if (jobs.current.size) setMessage('')
    for (const job of jobs.current) job.controller.abort()
    jobs.current.clear()
    setPending(0)
  }

  function changeMode(next) {
    if (modeRef.current === next) return
    modeRef.current = next
    setModeState(next)
    latest.current.onModeChange?.(next)
  }

  function loadSource(next, current = editorRef.current) {
    if (!current) return false
    if (next === lastRenderedValue.current) {
      setCompatibility('')
      return true
    }
    const inspection =
      latest.current.format === 'markdown'
        ? inspectMarkdown(next)
        : inspectRichTextHtml(next)
    if (!inspection.supported) {
      setCompatibility(
        `Keep editing the source to preserve ${inspection.issues.map((issue) => issue.label).join(', ')}.`
      )
      changeMode('source')
      return false
    }
    syncing.current = true
    lastRenderedValue.current = undefined
    try {
      current.commands.setContent(
        latest.current.format === 'markdown'
          ? next
          : sanitizeRichTextHtml(next),
        { contentType: latest.current.format, emitUpdate: false }
      )
      if (
        latest.current.format === 'html' &&
        !htmlRoundTripMatches(next, current.getHTML())
      ) {
        setCompatibility(
          'This content needs source editing so none of its formatting is lost.'
        )
        changeMode('source')
        return false
      }
      if (
        latest.current.format === 'markdown' &&
        !roundTripMatches(next, current.getMarkdown(), (content) =>
          current.markdown.parse(content)
        )
      ) {
        setCompatibility(
          'This content needs source editing so none of its formatting is lost.'
        )
        changeMode('source')
        return false
      }
      const historyKey = history().spec.key
      const historyPlugin = historyKey.get(current.state)
      if (historyPlugin) {
        current.unregisterPlugin(historyKey)
        current.registerPlugin(historyPlugin)
      }
      lastRenderedValue.current = next
      setCompatibility('')
      return true
    } catch {
      setCompatibility(
        'This content could not be opened safely. Your source is still intact.'
      )
      changeMode('source')
      return false
    } finally {
      syncing.current = false
    }
  }

  function focusEditor() {
    if (latest.current.disabled) return
    if (modeRef.current === 'visual')
      editorRef.current?.view.dom.focus({ preventScroll: true })
    else textarea.current?.focus({ preventScroll: true })
  }

  function setMode(next) {
    if (latest.current.disabled || !['visual', 'source'].includes(next))
      return false
    if (next === modeRef.current) return true
    cancelUploads()
    linkPopover.current?.close({ restoreFocus: false })
    imagePopover.current?.close({ restoreFocus: false })
    if (next === 'visual' && !loadSource(sourceRef.current)) return false
    changeMode(next)
    requestAnimationFrame(focusEditor)
    return true
  }

  function validate() {
    const current = latest.current
    let empty = !sourceRef.current.trim()
    if (modeRef.current === 'visual' && editorRef.current)
      empty = editorRef.current.isEmpty
    else if (current.format === 'html' && typeof document !== 'undefined') {
      const template = document.createElement('template')
      template.innerHTML = sanitizeRichTextHtml(sourceRef.current)
      empty =
        !template.content.textContent.replace(/[\s\u200B-\u200D\uFEFF]/g, '') &&
        !template.content.querySelector('img[src],hr')
    }
    const message =
      current.disabled || current.readOnly
        ? ''
        : current.required && empty
          ? 'Please fill out this field.'
          : Number.isFinite(Number(current.maxLength)) &&
              current.maxLength != null &&
              sourceRef.current.length > Number(current.maxLength)
            ? `Use ${current.maxLength} characters or fewer, including formatting.`
            : ''
    textarea.current?.setCustomValidity(message)
    return message
  }

  function command(method, argument) {
    if (
      latest.current.disabled ||
      latest.current.readOnly ||
      modeRef.current !== 'visual'
    )
      return
    editorRef.current?.chain().focus()[method](argument).run()
  }

  function saveSelection() {
    selection.current = editorRef.current?.state.selection.getBookmark()
  }

  function restoreSelection() {
    const current = editorRef.current
    if (!current || !selection.current) return
    try {
      current.view.dispatch(
        current.state.tr.setSelection(
          selection.current.resolve(current.state.doc)
        )
      )
    } catch {
      /* The selected content may have been replaced. */
    }
  }

  function openLink(event) {
    if (
      !editorRef.current ||
      latest.current.disabled ||
      latest.current.readOnly ||
      modeRef.current !== 'visual'
    )
      return
    saveSelection()
    setLinkUrl(editorRef.current.getAttributes('link').href ?? '')
    setLinkError('')
    linkPopover.current?.open(
      event?.currentTarget ?? linkButton.current ?? editorRef.current.view.dom
    )
    requestAnimationFrame(() => linkInput.current?.focus())
  }

  function openImage(event) {
    if (
      !editorRef.current ||
      latest.current.disabled ||
      latest.current.readOnly ||
      modeRef.current !== 'visual'
    )
      return
    saveSelection()
    const isImage = editorRef.current.isActive('image')
    setSelectedImage(isImage)
    setImageUrl(isImage ? editorRef.current.getAttributes('image').src : '')
    setImageAlt(
      isImage ? (editorRef.current.getAttributes('image').alt ?? '') : ''
    )
    setImageError('')
    imagePopover.current?.open(
      event?.currentTarget ?? imageButton.current ?? editorRef.current.view.dom
    )
    requestAnimationFrame(() => imageInput.current?.focus())
  }

  function applyLink(remove = false) {
    if (latest.current.disabled || latest.current.readOnly) return
    const url = normalizeLinkUrl(linkUrl)
    if (!remove && !url) {
      setLinkError('Enter a safe web, email, phone, or relative URL.')
      return
    }
    restoreSelection()
    if (remove)
      editorRef.current
        ?.chain()
        .focus()
        .extendMarkRange('link')
        .unsetLink()
        .run()
    else if (
      editorRef.current.state.selection.empty &&
      !editorRef.current.isActive('link')
    )
      editorRef.current
        .chain()
        .focus()
        .insertContent({
          type: 'text',
          text: linkUrl.trim(),
          marks: [{ type: 'link', attrs: { href: url } }]
        })
        .run()
    else
      editorRef.current
        ?.chain()
        .focus()
        .extendMarkRange('link')
        .setLink({ href: url })
        .run()
    linkPopover.current?.close({ restoreFocus: false })
  }

  function applyImage() {
    if (latest.current.disabled || latest.current.readOnly) return
    const src = normalizeImageUrl(imageUrl)
    if (!src) {
      setImageError('Enter a safe image URL.')
      return
    }
    restoreSelection()
    editorRef.current
      ?.chain()
      .focus()
      .setImage({ src, alt: imageAlt.trim() })
      .run()
    imagePopover.current?.close({ restoreFocus: false })
  }

  async function uploadFiles(
    files,
    position = editorRef.current?.state.selection.from
  ) {
    if (
      latest.current.disabled ||
      latest.current.readOnly ||
      modeRef.current !== 'visual' ||
      !editorRef.current
    )
      return
    if (!latest.current.upload) {
      setMessage('Choose an image URL. File uploads are not configured.')
      return
    }
    const current = editorRef.current
    const job = { controller: new AbortController(), position }
    jobs.current.add(job)
    setPending(jobs.current.size)
    setMessage('Uploading image…')
    imagePopover.current?.close({ restoreFocus: false })
    try {
      for (const file of files) {
        if (!/^image\/(avif|gif|jpeg|png|webp)$/.test(file.type))
          throw new Error('Choose a PNG, JPEG, GIF, WebP or AVIF image.')
        const result = await latest.current.upload(file, {
          signal: job.controller.signal
        })
        if (
          !alive.current ||
          !jobs.current.has(job) ||
          job.controller.signal.aborted ||
          latest.current.disabled ||
          latest.current.readOnly ||
          modeRef.current !== 'visual' ||
          editorRef.current !== current
        )
          return
        const src = normalizeImageUrl(result?.src)
        if (!src) throw new Error('The upload did not return a safe image URL.')
        current.commands.insertContentAt(
          Math.min(job.position, current.state.doc.content.size),
          {
            type: 'image',
            attrs: { src, alt: result.alt ?? '', title: result.title ?? null }
          },
          { updateSelection: false }
        )
      }
      setMessage('Image added. Select it to edit its description.')
    } catch (cause) {
      if (
        alive.current &&
        jobs.current.has(job) &&
        !job.controller.signal.aborted
      )
        setMessage(
          cause?.message || 'The image could not be uploaded. Try again.'
        )
    } finally {
      jobs.current.delete(job)
      if (alive.current) setPending(jobs.current.size)
    }
  }

  function focusToolbar() {
    toolbar.current?.querySelector('button[tabindex="0"]')?.focus()
  }
  function toolbarKeys(event) {
    if (event.key === 'Escape') {
      event.preventDefault()
      focusEditor()
      return
    }
    if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return
    const buttons = [
      ...event.currentTarget.querySelectorAll('button:not(:disabled)')
    ]
    const index = buttons.indexOf(event.target)
    if (index < 0) return
    event.preventDefault()
    const rtl = getComputedStyle(event.currentTarget).direction === 'rtl'
    const direction = (event.key === 'ArrowLeft' ? -1 : 1) * (rtl ? -1 : 1)
    const next =
      event.key === 'Home'
        ? 0
        : event.key === 'End'
          ? buttons.length - 1
          : (index + direction + buttons.length) % buttons.length
    setToolbarIndex(
      [...event.currentTarget.querySelectorAll('button')].indexOf(buttons[next])
    )
    buttons[next].focus()
  }

  function commitEditor(current = editorRef.current) {
    if (
      !current ||
      syncing.current ||
      composing.current ||
      pendingExternal.current !== undefined ||
      modeRef.current !== 'visual' ||
      latest.current.disabled ||
      latest.current.readOnly
    )
      return
    const next = current.isEmpty
      ? ''
      : latest.current.format === 'markdown'
        ? preserveMarkdownEnvelope(current.getMarkdown(), sourceRef.current)
        : current.getHTML()
    if (next === sourceRef.current) return
    lastRenderedValue.current = next
    assignSource(next, true)
    if (!validate()) setError('')
  }

  function replaceValue(next) {
    if (next === sourceRef.current) return
    if (composing.current || editorRef.current?.view.composing) {
      pendingExternal.current = next
      return
    }
    cancelUploads()
    assignSource(next)
    setError('')
    linkPopover.current?.close({ restoreFocus: false })
    imagePopover.current?.close({ restoreFocus: false })
    if (modeRef.current === 'visual') loadSource(next)
  }

  function flushExternal() {
    if (pendingExternal.current === undefined) return
    const next = pendingExternal.current
    pendingExternal.current = undefined
    replaceValue(next)
  }

  function updateSource(event) {
    if (latest.current.disabled || latest.current.readOnly) return
    setSource(event.target.value)
    if (event.nativeEvent?.isComposing || composing.current) return
    cancelUploads()
    assignSource(event.target.value, true)
    setCompatibility('')
    if (!validate()) setError('')
    latest.current.onInput?.(event)
  }

  const editor = useEditor({
    immediatelyRender: false,
    content: '',
    editable: !latest.current.disabled && !latest.current.readOnly,
    extensions: [
      StarterKit.configure({
        underline: false,
        link: {
          openOnClick: false,
          autolink: true,
          defaultProtocol: 'https',
          isAllowedUri: (url, context) =>
            context.defaultValidate(url) && normalizeLinkUrl(url) !== null,
          HTMLAttributes: { target: null, rel: 'noopener noreferrer' }
        }
      }),
      Image.configure({ allowBase64: false }),
      Placeholder.configure({
        placeholder: () => latest.current.placeholder
      }),
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
      transformPastedHTML: (html) => sanitizeRichTextHtml(html),
      handleKeyDown: (_view, event) => {
        if (event.altKey && event.key === 'F10') {
          event.preventDefault()
          focusToolbar()
          return true
        }
        if (
          !event.isComposing &&
          (event.ctrlKey || event.metaKey) &&
          event.key.toLowerCase() === 'k'
        ) {
          event.preventDefault()
          openLink()
          return true
        }
        return false
      },
      handleDOMEvents: {
        focus: (_view, event) => {
          latest.current.onFocus?.(event)
          return false
        },
        compositionstart: () => {
          composing.current = true
          return false
        },
        compositionend: () => {
          composing.current = false
          queueMicrotask(() => {
            if (alive.current) {
              if (pendingExternal.current !== undefined) flushExternal()
              else commitEditor()
            }
          })
          return false
        }
      }
    },
    onCreate: ({ editor: current }) => {
      alive.current = true
      editorRef.current = current
      if (loadSource(sourceRef.current, current)) changeMode('visual')
    },
    onUpdate: ({ editor: current }) => commitEditor(current),
    onTransaction: ({ transaction }) => {
      for (const job of jobs.current)
        job.position = transaction.mapping.map(job.position, 1)
      if (selection.current)
        selection.current = selection.current.map(transaction.mapping)
      setRevision((value) => value + 1)
    }
  })
  useEffect(() => {
    alive.current = true
    return () => {
      alive.current = false
      cancelUploads()
      editorRef.current = null
    }
  }, [])

  useEffect(() => {
    replaceValue(String(value ?? ''))
  }, [value])

  const previousFormat = useRef(format)
  useEffect(() => {
    if (previousFormat.current === format) return
    previousFormat.current = format
    cancelUploads()
    lastRenderedValue.current = undefined
    loadSource(sourceRef.current)
  }, [format])

  useEffect(() => {
    if (disabled || readOnly) {
      cancelUploads()
      linkPopover.current?.close({ restoreFocus: false })
      imagePopover.current?.close({ restoreFocus: false })
    }
    editor?.setEditable(!disabled && !readOnly && mode === 'visual', false)
  }, [disabled, readOnly, editor, mode])

  useEffect(() => {
    if (!editor) return
    const aria = Object.fromEntries(
      Object.entries(attributes)
        .filter(
          ([key, value]) =>
            (key.startsWith('aria-') ||
              ['title', 'lang', 'dir', 'spellcheck'].includes(key)) &&
            value != null
        )
        .map(([key, value]) => [key, String(value)])
    )
    editor.setOptions({
      editorProps: {
        ...editor.options.editorProps,
        attributes: () =>
          Object.fromEntries(
            Object.entries({
              ...aria,
              id: `${fieldId}-editor`,
              class: CONTENT,
              role: 'textbox',
              'aria-multiline': 'true',
              'aria-required': String(required),
              'aria-disabled': String(disabled),
              'aria-readonly': String(readOnly),
              tabindex: disabled ? '-1' : '0',
              spellcheck: attributes.spellCheck ?? 'true',
              'aria-invalid': String(
                Boolean(error) ||
                  attributes['aria-invalid'] === true ||
                  attributes['aria-invalid'] === 'true'
              ),
              'aria-label':
                aria['aria-label'] ??
                (aria['aria-labelledby']
                  ? undefined
                  : [...(textarea.current?.labels ?? [])]
                      .map((label) => label.textContent.trim())
                      .join(' ') || 'Rich text'),
              'aria-describedby':
                [
                  aria['aria-describedby'],
                  compatibility ? `${fieldId}-warning` : '',
                  error ? `${fieldId}-error` : ''
                ]
                  .filter(Boolean)
                  .join(' ') || undefined,
              'data-slot': 'rich-text-content'
            }).filter(([, value]) => value != null)
          )
      }
    })
    validate()
  }, [
    editor,
    source,
    mode,
    required,
    disabled,
    readOnly,
    maxLength,
    error,
    compatibility,
    fieldId,
    attributes['aria-label'],
    attributes['aria-labelledby'],
    attributes['aria-describedby'],
    attributes['aria-invalid'],
    attributes.dir,
    attributes.lang,
    attributes.spellCheck,
    revision
  ])

  useEffect(() => {
    const owner = textarea.current?.form
    if (!owner) return
    const reset = (event) =>
      queueMicrotask(() => {
        if (!alive.current || event.defaultPrevented) return
        cancelUploads()
        assignSource(initial.current, true)
        setError('')
        setCompatibility('')
        setMessage('')
        linkPopover.current?.close({ restoreFocus: false })
        imagePopover.current?.close({ restoreFocus: false })
        if (loadSource(initial.current)) changeMode('visual')
        validate()
      })
    owner.addEventListener('reset', reset)
    return () => owner.removeEventListener('reset', reset)
  }, [form, editor])

  useEffect(() => {
    const buttons = [...(toolbar.current?.querySelectorAll('button') ?? [])]
    if (!buttons[toolbarIndex] || buttons[toolbarIndex].disabled)
      setToolbarIndex(buttons.findIndex((button) => !button.disabled))
  }, [revision, mode, disabled, readOnly, editor, toolbarIndex])

  useImperativeHandle(ref, () => ({
    editor,
    focus: focusEditor,
    setMode,
    getMode: () => modeRef.current,
    checkValidity: () => {
      validate()
      return textarea.current?.checkValidity() ?? true
    },
    reportValidity: () => {
      validate()
      return textarea.current?.reportValidity() ?? true
    }
  }))

  function compositeBlur(event) {
    if (root.current?.contains(event.relatedTarget)) return
    queueMicrotask(() => {
      if (
        alive.current &&
        !root.current?.contains(root.current?.getRootNode().activeElement)
      )
        latest.current.onBlur?.(event)
    })
  }

  function closePopup(popover) {
    restoreSelection()
    popover.current?.close({ restoreFocus: false })
    focusEditor()
  }
  function popupKeys(event, apply, popover) {
    if (event.key === 'Escape' && !event.defaultPrevented) {
      event.preventDefault()
      closePopup(popover)
    } else if (
      event.key === 'Enter' &&
      !event.nativeEvent.isComposing &&
      event.target.tagName === 'INPUT' &&
      event.target.type !== 'file'
    ) {
      event.preventDefault()
      apply()
    }
  }

  const inactive = !editor || mode !== 'visual' || disabled || readOnly
  const context = { editor, mode, setMode, openLink, openImage }
  const description =
    [
      attributes['aria-describedby'],
      compatibility && `${fieldId}-warning`,
      error && `${fieldId}-error`
    ]
      .filter(Boolean)
      .join(' ') || undefined
  return (
    <div
      ref={root}
      data-slot="rich-text"
      data-mode={mode}
      data-disabled={disabled || undefined}
      data-readonly={readOnly || undefined}
      style={style}
      className={twMerge(ROOT, className)}
      onBlur={compositeBlur}
    >
      {renderToolbar ? (
        renderToolbar(context)
      ) : (
        <div
          data-slot="rich-text-toolbar"
          className="flex flex-wrap items-center gap-2 rounded-t-[inherit] bg-gray-50/70 p-2 dark:bg-gray-900/50"
        >
          <div
            ref={toolbar}
            role="toolbar"
            aria-label="Text formatting"
            className="flex min-w-0 flex-wrap items-center gap-0.5"
            onKeyDown={toolbarKeys}
          >
            {COMMANDS.map(
              ([label, glyph, active, method, argument, toolClass], index) => (
                <button
                  key={label}
                  type="button"
                  data-slot="rich-text-tool"
                  className={twMerge(TOOL, toolClass)}
                  aria-label={label}
                  title={label}
                  aria-pressed={editor?.isActive(active, argument) ?? false}
                  disabled={inactive}
                  tabIndex={toolbarIndex === index ? 0 : -1}
                  onFocus={() => setToolbarIndex(index)}
                  onMouseDown={(event) => event.preventDefault()}
                  onClick={() => command(method, argument)}
                >
                  <ToolGlyph name={label}>{glyph}</ToolGlyph>
                </button>
              )
            )}
            <button
              ref={linkButton}
              type="button"
              data-action="link"
              data-slot="rich-text-tool"
              className={TOOL}
              aria-label="Link"
              title="Link · Ctrl/⌘ K"
              aria-pressed={editor?.isActive('link') ?? false}
              disabled={inactive}
              tabIndex={toolbarIndex === 8 ? 0 : -1}
              onFocus={() => setToolbarIndex(8)}
              onMouseDown={(event) => event.preventDefault()}
              onClick={openLink}
            >
              <Link className="size-4" />
            </button>
            <button
              ref={imageButton}
              type="button"
              data-action="image"
              data-slot="rich-text-tool"
              className={TOOL}
              aria-label="Image"
              title="Image"
              disabled={inactive}
              tabIndex={toolbarIndex === 9 ? 0 : -1}
              onFocus={() => setToolbarIndex(9)}
              onMouseDown={(event) => event.preventDefault()}
              onClick={openImage}
            >
              <ImageIcon className="size-4" />
            </button>
            <button
              type="button"
              data-slot="rich-text-tool"
              className={TOOL}
              aria-label="Undo"
              title="Undo"
              disabled={inactive || !editor?.can().undo()}
              tabIndex={toolbarIndex === 10 ? 0 : -1}
              onFocus={() => setToolbarIndex(10)}
              onMouseDown={(event) => event.preventDefault()}
              onClick={() => command('undo')}
            >
              <ToolGlyph name="Undo" />
            </button>
            <button
              type="button"
              data-slot="rich-text-tool"
              className={TOOL}
              aria-label="Redo"
              title="Redo"
              disabled={inactive || !editor?.can().redo()}
              tabIndex={toolbarIndex === 11 ? 0 : -1}
              onFocus={() => setToolbarIndex(11)}
              onMouseDown={(event) => event.preventDefault()}
              onClick={() => command('redo')}
            >
              <ToolGlyph name="Redo" />
            </button>
          </div>
          <div
            className="ms-auto flex shrink-0 items-center gap-0.5 rounded-md bg-gray-200/50 p-0.5 dark:bg-gray-800/70"
            role="group"
            aria-label="Editing mode"
          >
            {[
              { value: 'visual', label: 'Write' },
              { value: 'source', label: 'Source' }
            ].map((item) => (
              <button
                key={item.value}
                type="button"
                disabled={disabled || !editor}
                aria-pressed={mode === item.value}
                data-slot="rich-text-mode"
                className="min-h-8 cursor-pointer rounded px-2.5 text-xs font-medium text-gray-600 hover:text-gray-950 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-950 aria-pressed:bg-white aria-pressed:text-gray-950 aria-pressed:shadow-sm disabled:cursor-not-allowed dark:text-gray-400 dark:hover:text-white dark:aria-pressed:bg-gray-700 dark:aria-pressed:text-white dark:focus-visible:outline-white"
                onClick={() => setMode(item.value)}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>
      )}
      {compatibility && (
        <p
          id={`${fieldId}-warning`}
          data-slot="rich-text-warning"
          className="mx-5 mt-4 rounded-md bg-amber-50 p-3 text-sm/6 text-amber-900 dark:bg-amber-950/40 dark:text-amber-200"
          role="status"
        >
          {compatibility}
        </p>
      )}
      <div hidden={mode !== 'visual'}>
        <EditorContent editor={editor} />
      </div>
      <textarea
        {...attributes}
        ref={textarea}
        id={fieldId}
        name={name}
        form={form}
        value={source}
        required={required}
        disabled={disabled}
        readOnly={readOnly}
        placeholder={placeholder}
        data-slot="rich-text-source"
        aria-hidden={mode === 'visual' ? 'true' : undefined}
        aria-describedby={description}
        aria-invalid={error ? 'true' : attributes['aria-invalid']}
        tabIndex={mode === 'visual' ? -1 : undefined}
        spellCheck={mode === 'source' ? false : attributes.spellCheck}
        className={
          mode === 'visual'
            ? 'sr-only'
            : 'block min-h-56 w-full min-w-0 resize-y rounded-b-[inherit] bg-transparent p-5 font-mono text-sm/7 outline-none wrap-anywhere'
        }
        onFocus={(event) => {
          if (modeRef.current === 'visual') focusEditor()
          else onFocus?.(event)
        }}
        onChange={updateSource}
        onCompositionStart={() => {
          composing.current = true
        }}
        onCompositionEnd={(event) => {
          composing.current = false
          if (pendingExternal.current !== undefined) flushExternal()
          else updateSource(event)
        }}
        onInvalid={(event) => {
          event.preventDefault()
          setError(
            validate() ||
              textarea.current?.validationMessage ||
              'Check this field.'
          )
          focusEditor()
        }}
      />
      {error && (
        <p
          id={`${fieldId}-error`}
          data-slot="rich-text-error"
          className="px-5 pb-3 text-sm text-red-600 dark:text-red-400"
          role="alert"
        >
          {error}
        </p>
      )}
      <p
        data-slot="rich-text-status"
        aria-live="polite"
        aria-atomic="true"
        className={
          message
            ? 'px-5 pb-3 text-sm text-gray-600 dark:text-gray-400'
            : 'sr-only'
        }
      >
        {message}
      </p>
      <Popover
        ref={linkPopover}
        anchor={linkButton.current}
        role="dialog"
        aria-label="Edit link"
        data-rich-text-owner={fieldId}
        className="w-80 max-w-[calc(100vw-1rem)] rounded-xl p-4"
        onKeyDown={(event) => popupKeys(event, () => applyLink(), linkPopover)}
      >
        <div className="grid gap-3">
          <label htmlFor={`${fieldId}-link`} className="text-sm font-medium">
            Link
          </label>
          <input
            ref={linkInput}
            id={`${fieldId}-link`}
            inputMode="url"
            autoComplete="off"
            className={FIELD}
            value={linkUrl}
            onChange={(event) => setLinkUrl(event.target.value)}
            placeholder="https://example.com"
            aria-invalid={!!linkError}
            aria-describedby={linkError ? `${fieldId}-link-error` : undefined}
          />
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              className={ACTION}
              onClick={() => applyLink()}
            >
              Apply link
            </button>
            {editor?.isActive('link') && (
              <button
                type="button"
                className="min-h-10 cursor-pointer px-2 text-sm text-red-600"
                onClick={() => applyLink(true)}
              >
                Remove
              </button>
            )}
            <button
              type="button"
              className="ms-auto min-h-10 cursor-pointer px-2 text-sm"
              onClick={() => closePopup(linkPopover)}
            >
              Cancel
            </button>
          </div>
          {linkError && (
            <p
              id={`${fieldId}-link-error`}
              className="text-sm text-red-600 dark:text-red-400"
              role="alert"
            >
              {linkError}
            </p>
          )}
        </div>
      </Popover>
      <Popover
        ref={imagePopover}
        anchor={imageButton.current}
        role="dialog"
        aria-label="Edit image"
        data-rich-text-owner={fieldId}
        className="w-80 max-w-[calc(100vw-1rem)] rounded-xl p-4"
        onKeyDown={(event) => popupKeys(event, applyImage, imagePopover)}
      >
        <div className="grid gap-3">
          <label
            htmlFor={`${fieldId}-image-url`}
            className="text-sm font-medium"
          >
            Image URL
          </label>
          <input
            ref={imageInput}
            id={`${fieldId}-image-url`}
            inputMode="url"
            autoComplete="off"
            className={FIELD}
            value={imageUrl}
            onChange={(event) => setImageUrl(event.target.value)}
            placeholder="https://example.com/image.png"
            aria-invalid={!!imageError}
            aria-describedby={imageError ? `${fieldId}-image-error` : undefined}
          />
          <label
            htmlFor={`${fieldId}-image-alt`}
            className="text-sm font-medium"
          >
            Image description
          </label>
          <input
            id={`${fieldId}-image-alt`}
            className={FIELD}
            value={imageAlt}
            onChange={(event) => setImageAlt(event.target.value)}
            placeholder="What does this image show?"
          />
          <p className="text-xs/5 text-gray-500 dark:text-gray-400">
            Describe meaningful images. Leave empty only for decoration.
          </p>
          <div className="flex flex-wrap gap-2">
            <button type="button" className={ACTION} onClick={applyImage}>
              {selectedImage ? 'Update image' : 'Add image'}
            </button>
            <button
              type="button"
              className="ms-auto min-h-10 cursor-pointer px-2 text-sm"
              onClick={() => closePopup(imagePopover)}
            >
              Cancel
            </button>
          </div>
          {upload && (
            <>
              <input
                ref={fileInput}
                type="file"
                accept="image/png,image/jpeg,image/gif,image/webp,image/avif"
                className="hidden"
                tabIndex={-1}
                disabled={disabled || readOnly}
                onChange={(event) => {
                  const files = [...event.target.files]
                  event.target.value = ''
                  restoreSelection()
                  void uploadFiles(files)
                }}
              />
              <button
                type="button"
                className="min-h-10 cursor-pointer rounded-md border border-gray-200 px-3 text-sm font-medium hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-900"
                disabled={pending > 0}
                onClick={() => fileInput.current?.click()}
              >
                Choose image file
              </button>
            </>
          )}
          {imageError && (
            <p
              id={`${fieldId}-image-error`}
              className="text-sm text-red-600 dark:text-red-400"
              role="alert"
            >
              {imageError}
            </p>
          )}
        </div>
      </Popover>
    </div>
  )
})

export default RichText
