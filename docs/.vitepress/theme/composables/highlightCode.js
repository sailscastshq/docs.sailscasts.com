const languageByExtension = {
  bash: 'shellscript',
  css: 'css',
  html: 'html',
  js: 'javascript',
  json: 'json',
  jsx: 'jsx',
  mjs: 'javascript',
  sh: 'shellscript',
  svelte: 'svelte',
  ts: 'typescript',
  tsx: 'tsx',
  vue: 'vue'
}

const highlightedCode = new Map()
let shiki

function loadShiki() {
  shiki ??= import('shiki')
  return shiki
}

export function inferCodeLanguage(label) {
  if (label === 'Terminal') return 'shellscript'

  const extension = label.split('.').at(-1)?.toLowerCase()
  return languageByExtension[extension] ?? 'text'
}

export function highlightCode(code, language) {
  const key = `${language}\u0000${code}`

  if (!highlightedCode.has(key)) {
    highlightedCode.set(
      key,
      loadShiki()
        .then(({ codeToHtml }) =>
          codeToHtml(code, {
            lang: language,
            theme: 'github-dark'
          })
        )
        .then((html) => html.match(/<code>([\s\S]*)<\/code>/)?.[1] ?? '')
    )
  }

  return highlightedCode.get(key)
}
