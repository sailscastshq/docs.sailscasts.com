import createDOMPurify from 'dompurify'
import { marked } from 'marked'

const SAFE_LINK_PROTOCOLS = new Set(['http:', 'https:', 'mailto:', 'tel:'])
const SAFE_IMAGE_PROTOCOLS = new Set(['http:', 'https:'])
const HTML_TAGS = [
  'p',
  'br',
  'blockquote',
  'pre',
  'code',
  'strong',
  'b',
  'em',
  'i',
  's',
  'strike',
  'del',
  'u',
  'h1',
  'h2',
  'h3',
  'h4',
  'h5',
  'h6',
  'ul',
  'ol',
  'li',
  'hr',
  'a',
  'img'
]
const HTML_ATTRIBUTES = {
  a: new Set(['href', 'title', 'rel', 'target']),
  img: new Set(['src', 'alt', 'title', 'width', 'height']),
  ol: new Set(['start']),
  code: new Set(['class'])
}

function browserWindow(options = {}) {
  return Object.hasOwn(options, 'window')
    ? options.window
    : typeof window === 'undefined'
      ? undefined
      : window
}

function issue(code, label) {
  return { code, label }
}

function inspection(issues) {
  return {
    supported: issues.length === 0,
    issues: [...new Map(issues.map((item) => [item.code, item])).values()]
  }
}

function visitTokens(tokens, visit) {
  for (const token of tokens) {
    visit(token)
    if (token.tokens) visitTokens(token.tokens, visit)
    if (token.items) visitTokens(token.items, visit)
  }
}

/** Detect syntax that the default visual schema cannot preserve. Code is literal. */
export function inspectMarkdown(markdown = '') {
  const source = String(markdown)
  const issues = []
  if (
    /^\uFEFF?(?:---|\+\+\+)\r?\n[\s\S]*?\r?\n(?:---|\+\+\+)(?:\r?\n|$)/.test(
      source
    )
  ) {
    issues.push(issue('frontmatter', 'frontmatter'))
  }
  let tokens
  try {
    tokens = marked.lexer(source, { gfm: true })
  } catch {
    return inspection([issue('parse', 'syntax Visual mode cannot read')])
  }
  if (Object.keys(tokens.links ?? {}).length) {
    issues.push(issue('reference-links', 'reference-style links'))
  }
  if (Object.keys(tokens.links ?? {}).some((label) => label.startsWith('^'))) {
    issues.push(issue('footnotes', 'footnotes'))
  }
  visitTokens(tokens, (token) => {
    if (token.type === 'html') {
      issues.push(
        issue(
          /<!--/.test(token.raw) ? 'html-comments' : 'raw-html',
          /<!--/.test(token.raw) ? 'HTML comments' : 'embedded HTML'
        )
      )
    }
    if (token.type === 'table') issues.push(issue('tables', 'tables'))
    if (token.type === 'list_item' && token.task) {
      issues.push(issue('task-lists', 'task lists'))
    }
    if (token.type === 'link' && !normalizeLinkUrl(token.href)) {
      issues.push(issue('unsafe-links', 'unsafe links'))
    }
    if (token.type === 'image' && !normalizeImageUrl(token.href)) {
      issues.push(issue('unsafe-images', 'unsupported image URLs'))
    }
    // Checking leaf text tokens excludes fenced, indented, and inline code.
    if (token.type !== 'text' || token.tokens) return
    if (/(^|\n)\s*(?:::[:\w-]*|\{\{)/.test(token.text)) {
      issues.push(issue('directives', 'custom directives'))
    }
    if (
      /(^|\n)\s*(?:import\s.+["']|export\s+(?:default|const|let|var|function|class|\{))/.test(
        token.text
      )
    ) {
      issues.push(issue('mdx', 'MDX or component syntax'))
    }
    if (/(?<!\\)\[\^[^\]]+\]/.test(token.text)) {
      issues.push(issue('footnotes', 'footnotes'))
    }
  })
  return inspection(issues)
}

export function normalizeMarkdownBoundary(markdown = '') {
  return String(markdown)
    .replace(/^\uFEFF/, '')
    .replace(/\r\n?/g, '\n')
    .replace(/^\n+|\n+$/g, '')
}

export function preserveMarkdownEnvelope(serialized, source = '') {
  const original = String(source)
  let output = normalizeMarkdownBoundary(serialized)
  if (!output) return ''
  const normalized = original.replace(/^\uFEFF/, '').replace(/\r\n?/g, '\n')
  output =
    (normalized.match(/^\n*/)?.[0] ?? '') +
    output +
    (normalized.match(/\n*$/)?.[0] ?? '')
  if (original.includes('\r\n')) output = output.replace(/\n/g, '\r\n')
  return original.startsWith('\uFEFF') ? `\uFEFF${output}` : output
}

function decodeEntities(value) {
  const ownerWindow = browserWindow()
  if (!ownerWindow?.document) return value
  const element = ownerWindow.document.createElement('textarea')
  element.innerHTML = value
  return element.value
}

function semanticTokens(tokens) {
  const output = []
  for (const token of tokens) {
    let next
    switch (token.type) {
      case 'space':
        continue
      case 'text':
      case 'escape':
        if (token.tokens) {
          output.push(...semanticTokens(token.tokens))
          continue
        }
        next = { type: 'text', text: decodeEntities(token.text) }
        break
      case 'paragraph':
      case 'blockquote':
      case 'strong':
      case 'em':
      case 'del':
        next = {
          type: token.type,
          children: semanticTokens(token.tokens ?? [])
        }
        break
      case 'heading':
        next = {
          type: 'heading',
          depth: token.depth,
          children: semanticTokens(token.tokens)
        }
        break
      case 'list':
        next = {
          type: 'list',
          ordered: token.ordered,
          start: token.ordered ? token.start : null,
          loose: token.loose,
          children: semanticTokens(token.items)
        }
        break
      case 'list_item':
        next = {
          type: 'list_item',
          loose: token.loose,
          children: semanticTokens(token.tokens)
        }
        break
      case 'link':
        next = {
          type: 'link',
          href: token.href,
          title: token.title ?? null,
          children: semanticTokens(token.tokens)
        }
        break
      case 'image':
        next = {
          type: 'image',
          href: token.href,
          title: token.title ?? null,
          text: token.text
        }
        break
      case 'codespan':
      case 'code':
        next = { type: token.type, text: token.text, lang: token.lang ?? '' }
        break
      case 'br':
      case 'hr':
        next = { type: token.type }
        break
      default:
        // Unknown tokens remain significant rather than disappearing in a schema.
        next = token
    }
    const previous = output.at(-1)
    if (previous?.type === 'text' && next.type === 'text')
      previous.text += next.text
    else output.push(next)
  }
  return output
}

/** Compare independent Markdown semantics before the optional editor-schema check. */
export function roundTripMatches(source, serialized, parseMarkdown) {
  if (
    !inspectMarkdown(source).supported ||
    !inspectMarkdown(serialized).supported
  )
    return false
  const original = normalizeMarkdownBoundary(source)
  const next = normalizeMarkdownBoundary(serialized)
  if (original === next) return true
  try {
    const before = semanticTokens(marked.lexer(original, { gfm: true }))
    const after = semanticTokens(marked.lexer(next, { gfm: true }))
    if (JSON.stringify(before) !== JSON.stringify(after)) return false
    return (
      typeof parseMarkdown !== 'function' ||
      JSON.stringify(parseMarkdown(original)) ===
        JSON.stringify(parseMarkdown(next))
    )
  } catch {
    return false
  }
}

function safeUrl(value, protocols, { images = false } = {}) {
  const url = String(value ?? '').trim()
  if (!url || /[\u0000-\u0020\u007F-\u009F\s\\]/.test(url)) return null
  if (url.startsWith('//')) return null
  const relative = /^(?:\/|\.\.?\/|#|\?)/.test(url)
  const hasProtocol = /^[a-z][a-z\d+.-]*:/i.test(url)
  let candidate = url
  if (!relative && !hasProtocol && !images && /^[^/?#]+\.[^/?#]+/.test(url)) {
    candidate = `https://${url}`
  }
  try {
    const parsed = new URL(candidate, 'https://klean.invalid/')
    if (!protocols.has(parsed.protocol)) return null
    if (
      hasProtocol &&
      ['http:', 'https:'].includes(parsed.protocol) &&
      !parsed.hostname
    )
      return null
    if (['mailto:', 'tel:'].includes(parsed.protocol) && !parsed.pathname)
      return null
    if (images && /\.svgz?$/i.test(decodeURIComponent(parsed.pathname)))
      return null
    return candidate
  } catch {
    return null
  }
}

export function normalizeLinkUrl(value) {
  return safeUrl(value, SAFE_LINK_PROTOCOLS)
}

export function normalizeImageUrl(value) {
  return safeUrl(value, SAFE_IMAGE_PROTOCOLS, { images: true })
}

function allowedAttribute(tag, name, value) {
  if (!HTML_ATTRIBUTES[tag]?.has(name)) return false
  if (tag === 'code' && name === 'class')
    return /^language-[\w+-]+$/.test(value)
  if (['width', 'height', 'start'].includes(name)) return /^\d+$/.test(value)
  return true
}

/** Check incoming HTML before loading it into a narrower visual editor schema. */
export function inspectRichTextHtml(html = '', options = {}) {
  const ownerWindow = browserWindow(options)
  if (!ownerWindow?.document)
    return inspection([issue('dom-unavailable', 'HTML requiring a browser')])
  const source = String(html)
  const issues = []
  if (/<!--|<!doctype|<\?/i.test(source))
    issues.push(issue('html-metadata', 'HTML comments or document metadata'))
  for (const match of source.matchAll(/<\/?([a-z][\w:-]*)\b/gi)) {
    if (!HTML_TAGS.includes(match[1].toLowerCase()))
      issues.push(issue('html-elements', 'unsupported HTML elements'))
  }
  const template = ownerWindow.document.createElement('template')
  template.innerHTML = source
  for (const element of template.content.querySelectorAll('*')) {
    const tag = element.localName
    if (tag === 'img' && !normalizeImageUrl(element.getAttribute('src'))) {
      issues.push(issue('unsafe-urls', 'unsafe or unsupported URLs'))
    }
    for (const attribute of element.attributes) {
      if (!allowedAttribute(tag, attribute.name, attribute.value)) {
        issues.push(
          issue(
            'html-attributes',
            'HTML attributes Visual mode cannot preserve'
          )
        )
      }
      if (
        (attribute.name === 'href' && !normalizeLinkUrl(attribute.value)) ||
        (attribute.name === 'src' && !normalizeImageUrl(attribute.value))
      ) {
        issues.push(issue('unsafe-urls', 'unsafe or unsupported URLs'))
      }
    }
  }
  return inspection(issues)
}

const HTML_ALIASES = { b: 'strong', i: 'em', del: 's', strike: 's' }
const BLOCK_TAGS = new Set([
  'p',
  'blockquote',
  'pre',
  'h1',
  'h2',
  'h3',
  'h4',
  'h5',
  'h6',
  'ul',
  'ol',
  'li',
  'hr'
])

function htmlSemantics(container, literal = false) {
  const children = []
  for (const node of container.childNodes) {
    if (node.nodeType === 3) {
      const text = literal ? node.data : node.data.replace(/[\t\n\r\f ]+/g, ' ')
      if (text) children.push({ text })
      continue
    }
    if (node.nodeType !== 1) continue
    const tag = HTML_ALIASES[node.localName] ?? node.localName
    const attributes = {}
    for (const attribute of [...node.attributes].sort((a, b) =>
      a.name.localeCompare(b.name)
    )) {
      let value = attribute.value
      // Security protections added by the editor do not change document content.
      if (tag === 'a' && attribute.name === 'rel') {
        value = value
          .toLowerCase()
          .split(/\s+/)
          .filter(
            (token) => token && !['noopener', 'noreferrer'].includes(token)
          )
          .sort()
          .join(' ')
        if (!value) continue
      }
      if (tag === 'a' && attribute.name === 'target' && value === '_self')
        continue
      if (tag === 'ol' && attribute.name === 'start' && Number(value) === 1)
        continue
      attributes[attribute.name] = value
    }
    let contents = htmlSemantics(
      node,
      literal || tag === 'code' || tag === 'pre'
    )
    // ProseMirror wraps list-item text in a paragraph without changing the list.
    if (
      (tag === 'li' || tag === 'blockquote') &&
      contents.length === 1 &&
      contents[0].tag === 'p'
    ) {
      contents = contents[0].children
    }
    children.push({ tag, attributes, children: contents })
  }
  if (!literal) {
    const blockContext =
      container.nodeType === 11 || BLOCK_TAGS.has(container.localName)
    // Indentation between blocks is not visible; spaces between inline marks are.
    for (let index = children.length - 1; index >= 0; index--) {
      const item = children[index]
      if (!Object.hasOwn(item, 'text')) continue
      const before = children[index - 1]
      const after = children[index + 1]
      if ((!before && blockContext) || BLOCK_TAGS.has(before?.tag))
        item.text = item.text.trimStart()
      if ((!after && blockContext) || BLOCK_TAGS.has(after?.tag))
        item.text = item.text.trimEnd()
      if (!item.text) children.splice(index, 1)
    }
  }
  return children
}

function htmlDocumentSemantics(fragment) {
  const nodes = htmlSemantics(fragment)
  if (
    nodes.length &&
    nodes.every((node) => !BLOCK_TAGS.has(node.tag) && node.tag !== 'img')
  ) {
    return [{ tag: 'p', attributes: {}, children: nodes }]
  }
  return nodes
}

/** Preserve meaningful HTML the editor schema cannot represent, including attributes. */
export function htmlRoundTripMatches(source, serialized, options = {}) {
  if (
    !inspectRichTextHtml(source, options).supported ||
    !inspectRichTextHtml(serialized, options).supported
  )
    return false
  const ownerWindow = browserWindow(options)
  const original = ownerWindow.document.createElement('template')
  const output = ownerWindow.document.createElement('template')
  original.innerHTML = String(source)
  output.innerHTML = String(serialized)
  const before = htmlDocumentSemantics(original.content)
  const after = htmlDocumentSemantics(output.content)
  // The editor appends one empty paragraph after terminal non-paragraph blocks.
  // Permit that editing affordance, but never discard an existing source block.
  if (
    before.length &&
    after.length === before.length + 1 &&
    before.at(-1).tag !== 'p' &&
    after.at(-1).tag === 'p' &&
    after.at(-1).children.length === 0
  )
    after.pop()
  const empty = (nodes) =>
    nodes.length === 0 ||
    (nodes.length === 1 &&
      nodes[0].tag === 'p' &&
      nodes[0].children.length === 0)
  if (empty(before) && empty(after)) return true
  return JSON.stringify(before) === JSON.stringify(after)
}

/** Sanitize pasted or rendered HTML. Never use this to auto-emit a rewritten value. */
export function sanitizeRichTextHtml(html = '', options = {}) {
  const ownerWindow = browserWindow(options)
  if (!ownerWindow?.document) return ''
  const purifier = createDOMPurify(ownerWindow)
  if (typeof purifier.sanitize !== 'function') return ''
  purifier.addHook('uponSanitizeAttribute', (node, data) => {
    if (!allowedAttribute(node.localName, data.attrName, data.attrValue)) {
      data.keepAttr = false
      return
    }
    if (data.attrName === 'href' || data.attrName === 'src') {
      const url =
        data.attrName === 'href'
          ? normalizeLinkUrl(data.attrValue)
          : normalizeImageUrl(data.attrValue)
      if (!url) data.keepAttr = false
      else data.attrValue = url
    }
  })
  purifier.addHook('afterSanitizeAttributes', (node) => {
    if (node.localName === 'a' && node.getAttribute('target') === '_blank') {
      const values = new Set(
        (node.getAttribute('rel') ?? '').split(/\s+/).filter(Boolean)
      )
      values.add('noopener')
      values.add('noreferrer')
      node.setAttribute('rel', [...values].join(' '))
    }
  })
  return purifier.sanitize(String(html), {
    ALLOWED_TAGS: HTML_TAGS,
    ALLOWED_ATTR: [
      'href',
      'title',
      'rel',
      'target',
      'src',
      'alt',
      'width',
      'height',
      'start',
      'class'
    ],
    ALLOW_DATA_ATTR: false,
    ALLOW_ARIA_ATTR: false,
    ALLOW_UNKNOWN_PROTOCOLS: false
  })
}
