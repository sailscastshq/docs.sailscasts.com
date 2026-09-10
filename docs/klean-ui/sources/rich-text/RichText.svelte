<script>
  import { onMount, tick, untrack } from "svelte";
  import { Editor } from "@tiptap/core";
  import { history } from "@tiptap/pm/history";
  import FileHandler from "@tiptap/extension-file-handler";
  import StarterKit from "@tiptap/starter-kit";
  import ImageExtension from "@tiptap/extension-image";
  import Placeholder from "@tiptap/extension-placeholder";
  import { Markdown } from "@tiptap/markdown";
  import { twMerge } from "tailwind-merge";
  import Popover from "../popover/Popover.svelte";
  import Link from "../icons/Link.svelte";
  import Image from "../icons/Image.svelte";
  import {
    inspectMarkdown,
    inspectRichTextHtml,
    normalizeLinkUrl,
    normalizeImageUrl,
    preserveMarkdownEnvelope,
    roundTripMatches,
    sanitizeRichTextHtml,
    htmlRoundTripMatches,
  } from "./rich-text.js";

  let {
    value = $bindable(""),
    onValueChange,
    format = "html",
    placeholder = "Start writing…",
    disabled = false,
    readonly = false,
    required = false,
    maxlength,
    upload,
    toolbar: customToolbar,
    class: className,
    style,
    id,
    name,
    form,
    onblur,
    onfocus,
    onModeChange,
    ...attributes
  } = $props();
  const generatedId = $props.id();
  const fieldId = $derived(
    id ?? `klean-rich-text-${generatedId.replace(/[^\w-]/g, "")}`,
  );
  let root, mount, source, popover;
  let toolbar = $state.raw(null);
  let linkInput = $state.raw(null);
  let imageInput = $state.raw(null);
  let imageFile = $state.raw(null);
  let editor = $state.raw(null);
  let ready = $state(false);
  let mode = $state("visual");
  let sourceValue = $state(String(value ?? ""));
  const initialValue = String(value ?? "");
  let warning = $state("");
  let status = $state("");
  let validationError = $state("");
  let popup = $state("");
  let popupAnchor = $state.raw(null);
  let linkUrl = $state("");
  let imageUrl = $state("");
  let imageAlt = $state("");
  let popupError = $state("");
  let uploading = $state(false);
  let selectedImage = $state(false);
  let labelText = $state("");
  let toolbarIndex = $state(0);
  let revision = $state(0);
  let syncing = false,
    composing = false,
    destroyed = false,
    pendingExternal,
    selectionBookmark;
  const pendingUploads = new Set();
  let lastRenderedValue;
  const locked = $derived(disabled || readonly);
  const description = $derived(
    [
      attributes["aria-describedby"],
      warning && `${fieldId}-warning`,
      validationError && `${fieldId}-error`,
    ]
      .filter(Boolean)
      .join(" ") || undefined,
  );
  const accessibleLabel = $derived(
    attributes["aria-labelledby"]
      ? undefined
      : (attributes["aria-label"] ?? (labelText || "Rich text")),
  );

  const toolClass =
    "inline-flex size-9 shrink-0 cursor-pointer items-center justify-center rounded-md text-sm text-gray-600 transition-colors hover:bg-gray-100 hover:text-gray-950 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-950 aria-pressed:bg-gray-100 aria-pressed:text-gray-950 disabled:cursor-not-allowed disabled:opacity-35 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-white dark:aria-pressed:bg-gray-800 dark:aria-pressed:text-white dark:focus-visible:outline-white motion-reduce:transition-none";
  const fieldClass =
    "min-h-10 w-full min-w-0 rounded-md border border-gray-300 bg-transparent px-3 py-2 text-sm outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-950 dark:border-gray-700 dark:focus-visible:outline-white";
  const actionClass =
    "min-h-10 cursor-pointer rounded-md bg-gray-950 px-4 py-2 text-sm font-medium text-white hover:bg-gray-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-950 disabled:cursor-not-allowed disabled:opacity-40 dark:bg-white dark:text-gray-950 dark:hover:bg-gray-200";
  const contentClass =
    "min-h-56 w-full min-w-0 px-5 py-5 text-base/7 outline-none wrap-anywhere *:first:mt-0 *:last:mb-0 [&_p]:my-3 [&_h1]:mt-7 [&_h1]:mb-3 [&_h1]:text-3xl [&_h1]:font-semibold [&_h1]:tracking-tight [&_h2]:mt-6 [&_h2]:mb-3 [&_h2]:text-2xl [&_h2]:font-semibold [&_h2]:tracking-tight [&_h3]:mt-5 [&_h3]:mb-2 [&_h3]:text-xl [&_h3]:font-semibold [&_h4]:mt-4 [&_h4]:font-semibold [&_h5]:font-semibold [&_h6]:font-semibold [&_strong]:font-semibold [&_a]:text-blue-700 [&_a]:underline [&_a]:underline-offset-3 [&_ul]:my-3 [&_ul]:list-disc [&_ul]:ps-6 [&_ol]:my-3 [&_ol]:list-decimal [&_ol]:ps-6 [&_li]:my-1 [&_li>p]:my-1 [&_blockquote]:my-4 [&_blockquote]:border-s-2 [&_blockquote]:border-gray-300 [&_blockquote]:ps-4 [&_blockquote]:text-gray-600 [&_pre]:my-4 [&_pre]:overflow-x-auto [&_pre]:rounded-lg [&_pre]:bg-gray-100 [&_pre]:p-4 [&_pre]:text-sm [&_code]:rounded [&_code]:bg-gray-100 [&_code]:px-1 [&_code]:font-mono [&_code]:text-[0.9em] [&_pre_code]:bg-transparent [&_pre_code]:p-0 [&_img]:my-4 [&_img]:max-h-96 [&_img]:max-w-full [&_img]:rounded-lg [&_img]:object-contain [&_hr]:my-6 [&_hr]:border-gray-200 [&_.ProseMirror-selectednode]:outline-2 [&_.ProseMirror-selectednode]:outline-blue-500 [&_p.is-editor-empty:first-child]:before:pointer-events-none [&_p.is-editor-empty:first-child]:before:float-start [&_p.is-editor-empty:first-child]:before:h-0 [&_p.is-editor-empty:first-child]:before:text-gray-500 [&_p.is-editor-empty:first-child]:before:content-[attr(data-placeholder)] dark:[&_a]:text-blue-400 dark:[&_blockquote]:border-gray-600 dark:[&_blockquote]:text-gray-400 dark:[&_pre]:bg-gray-900 dark:[&_code]:bg-gray-900 dark:[&_hr]:border-gray-800";
  const commands = [
    {
      name: "Heading",
      text: "H₂",
      command: "toggleHeading",
      attributes: { level: 2 },
      active: "heading",
    },
    {
      name: "Bold",
      text: "B",
      command: "toggleBold",
      active: "bold",
      class: "font-bold",
    },
    {
      name: "Italic",
      text: "I",
      command: "toggleItalic",
      active: "italic",
      class: "font-serif italic",
    },
    {
      name: "Strikethrough",
      text: "S",
      command: "toggleStrike",
      active: "strike",
      class: "line-through",
    },
    {
      name: "Bullet list",
      path: "M9 6h11M9 12h11M9 18h11M4 6h.01M4 12h.01M4 18h.01",
      command: "toggleBulletList",
      active: "bulletList",
    },
    {
      name: "Numbered list",
      path: "M10 6h10M10 12h10M10 18h10M3 5l1-1v5M3 9h2M3 15a1.5 1.5 0 0 1 3 0c0 1-3 2-3 4h3",
      command: "toggleOrderedList",
      active: "orderedList",
    },
    {
      name: "Quote",
      path: "M10 6H4v6h5c0 3-2 5-5 6M20 6h-6v6h5c0 3-2 5-5 6",
      command: "toggleBlockquote",
      active: "blockquote",
    },
    {
      name: "Code",
      path: "m8 7-5 5 5 5m8-10 5 5-5 5m-3-14-2 18",
      command: "toggleCodeBlock",
      active: "codeBlock",
      class: "font-mono text-xs",
    },
  ];
  const activeTools = $derived.by(() => {
    revision;
    return commands.map(
      (tool) => editor?.isActive(tool.active, tool.attributes) ?? false,
    );
  });
  const canUndo = $derived.by(() => {
    revision;
    return editor?.can().undo() ?? false;
  });
  const canRedo = $derived.by(() => {
    revision;
    return editor?.can().redo() ?? false;
  });
  const linkActive = $derived.by(() => {
    revision;
    return editor?.isActive("link") ?? false;
  });
  const toolbarContext = $derived.by(() => {
    revision;
    return { editor, mode, setMode, openLink, openImage };
  });

  function emitValue(next) {
    sourceValue = next;
    value = next;
    if (source) source.value = next;
    onValueChange?.(next);
  }
  function commitEditor() {
    if (
      !editor ||
      syncing ||
      locked ||
      mode !== "visual" ||
      composing ||
      pendingExternal !== undefined
    )
      return;
    const next = editor.isEmpty
      ? ""
      : format === "markdown"
        ? preserveMarkdownEnvelope(editor.getMarkdown(), sourceValue)
        : editor.getHTML();
    if (next === sourceValue) return;
    lastRenderedValue = next;
    emitValue(next);
    tick().then(syncValidity);
  }
  function loadValue(next, current = editor) {
    if (!current) return false;
    if (next === lastRenderedValue) {
      warning = "";
      return true;
    }
    const inspection =
      format === "markdown" ? inspectMarkdown(next) : inspectRichTextHtml(next);
    if (!inspection.supported) {
      warning = `Keep editing the source to preserve ${inspection.issues.map((issue) => issue.label).join(", ")}.`;
      changeMode("source");
      return false;
    }
    syncing = true;
    lastRenderedValue = undefined;
    try {
      current.commands.setContent(
        format === "html" ? sanitizeRichTextHtml(next) : next,
        { contentType: format, emitUpdate: false },
      );
      if (format === "html" && !htmlRoundTripMatches(next, current.getHTML())) {
        warning =
          "This content needs source editing so none of its formatting is lost.";
        changeMode("source");
        return false;
      }
      if (
        format === "markdown" &&
        !roundTripMatches(
          next,
          preserveMarkdownEnvelope(current.getMarkdown(), next),
          (content) => current.markdown.parse(content),
        )
      ) {
        warning =
          "This content needs source editing so none of its formatting is lost.";
        changeMode("source");
        return false;
      }
      const historyKey = history().spec.key;
      const historyPlugin = historyKey.get(current.state);
      if (historyPlugin) {
        current.unregisterPlugin(historyKey);
        current.registerPlugin(historyPlugin);
      }
      lastRenderedValue = next;
      warning = "";
      return true;
    } catch {
      warning =
        "This content could not be opened safely. Your source is still intact.";
      changeMode("source");
      return false;
    } finally {
      syncing = false;
    }
  }
  function changeMode(next) {
    if (mode !== next) {
      mode = next;
      onModeChange?.(next);
    }
  }
  export async function setMode(next) {
    if (disabled || !["visual", "source"].includes(next) || next === mode)
      return;
    abortUploads();
    popup = "";
    if (next === "visual" && !loadValue(sourceValue)) return;
    changeMode(next);
    syncEditorAttributes();
    await tick();
    focus();
    syncValidity();
  }
  function updateSource(event) {
    if (locked) return;
    sourceValue = event.target.value;
    if (event.isComposing || composing) return;
    abortUploads();
    emitValue(event.target.value);
    warning = "";
    syncValidity();
  }
  function flushExternal() {
    if (pendingExternal !== undefined) {
      const next = pendingExternal;
      pendingExternal = undefined;
      replaceValue(next);
    }
  }
  function replaceValue(next) {
    if (next === sourceValue) return;
    if (composing || editor?.view.composing) {
      pendingExternal = next;
      return;
    }
    abortUploads();
    popup = "";
    sourceValue = next;
    if (mode === "visual") loadValue(next);
    if (mode !== "source") warning = "";
    tick().then(syncValidity);
  }
  function syncEditorAttributes() {
    if (!editor || destroyed) return;
    editor.setEditable(!locked && mode === "visual", false);
    const aria = Object.fromEntries(
      Object.entries(attributes)
        .filter(
          ([key, value]) =>
            (key.startsWith("aria-") ||
              ["lang", "dir", "title"].includes(key)) &&
            value != null,
        )
        .map(([key, value]) => [key, String(value)]),
    );
    editor.setOptions({
      editorProps: {
        attributes: () =>
          Object.fromEntries(
            Object.entries({
              ...aria,
              role: "textbox",
              "aria-multiline": "true",
              "data-slot": "rich-text-content",
              class: contentClass,
              id: `${fieldId}-editor`,
              "aria-label": accessibleLabel,
              "aria-labelledby": attributes["aria-labelledby"],
              "aria-describedby": description,
              "aria-required": required ? "true" : undefined,
              "aria-invalid": validationError
                ? "true"
                : attributes["aria-invalid"],
              "aria-readonly": readonly ? "true" : undefined,
              "aria-disabled": disabled ? "true" : undefined,
              tabindex: disabled ? "-1" : "0",
              spellcheck: attributes.spellcheck ?? "true",
              dir: attributes.dir,
            }).filter(([, value]) => value != null),
          ),
      },
    });
  }
  function isEmpty() {
    if (!sourceValue.trim()) return true;
    if (mode === "visual" && editor) return editor.isEmpty;
    if (format !== "html" || !source) return false;
    const template = source.ownerDocument.createElement("template");
    template.innerHTML = sanitizeRichTextHtml(sourceValue);
    return (
      !template.content.textContent.replace(/[\s\u200B-\u200D\uFEFF]/g, "") &&
      !template.content.querySelector("img[src],hr")
    );
  }
  function validityMessage() {
    if (locked) return "";
    if (required && isEmpty()) return "Please fill out this field.";
    const max = Number(maxlength);
    if (
      maxlength !== undefined &&
      Number.isFinite(max) &&
      sourceValue.length > max
    )
      return `Use ${max} characters or fewer, including formatting.`;
    return "";
  }
  function syncValidity() {
    if (destroyed) return;
    const message = validityMessage();
    source?.setCustomValidity(message);
    if (validationError) validationError = message;
    syncEditorAttributes();
  }
  function invalid(event) {
    event.preventDefault();
    validationError =
      validityMessage() || source?.validationMessage || "Check this field.";
    syncEditorAttributes();
    focus();
  }
  export function focus(options) {
    if (disabled) return;
    if (ready && mode === "visual") editor?.view.dom.focus(options);
    else source?.focus(options);
  }
  export function getEditor() {
    return editor;
  }
  export function getMode() {
    return mode;
  }
  export function checkValidity() {
    syncValidity();
    return source?.checkValidity() ?? true;
  }
  export function reportValidity() {
    syncValidity();
    return source?.reportValidity() ?? true;
  }
  function tools() {
    return [...(toolbar?.querySelectorAll("button:not(:disabled)") ?? [])];
  }
  function focusToolbar() {
    syncToolbar();
    toolbar?.querySelector('button[tabindex="0"]')?.focus();
  }
  function syncToolbar() {
    const buttons = [...(toolbar?.querySelectorAll("button") ?? [])];
    if (!buttons[toolbarIndex] || buttons[toolbarIndex].disabled)
      toolbarIndex = buttons.findIndex((button) => !button.disabled);
  }
  function toolbarKeydown(event) {
    const buttons = tools(),
      index = buttons.indexOf(event.target);
    if (index < 0) return;
    if (event.key === "Escape") {
      event.preventDefault();
      focus();
      return;
    }
    const rtl = getComputedStyle(toolbar).direction === "rtl";
    let target;
    if (event.key === "Home") target = 0;
    else if (event.key === "End") target = buttons.length - 1;
    else if (event.key === "ArrowRight")
      target = (index + (rtl ? -1 : 1) + buttons.length) % buttons.length;
    else if (event.key === "ArrowLeft")
      target = (index + (rtl ? 1 : -1) + buttons.length) % buttons.length;
    else return;
    event.preventDefault();
    toolbarIndex = [...toolbar.querySelectorAll("button")].indexOf(
      buttons[target],
    );
    buttons[target]?.focus();
  }
  function run(command, args) {
    if (!locked && mode === "visual")
      editor?.chain().focus()[command](args).run();
  }
  function rememberSelection() {
    if (editor) {
      selectionBookmark = editor.state.selection.getBookmark();
      selectedImage = editor.isActive("image");
    }
  }
  function restoreSelection() {
    if (!selectionBookmark || !editor) return;
    try {
      editor.view.dispatch(
        editor.state.tr.setSelection(
          selectionBookmark.resolve(editor.state.doc),
        ),
      );
    } catch {
      /* The selected content may have been removed. */
    }
  }
  async function openLink(event) {
    if (!editor || locked || mode !== "visual") return;
    rememberSelection();
    popupAnchor =
      event?.currentTarget ??
      root?.querySelector('[data-action="link"]') ??
      editor.view.dom;
    linkUrl = editor.getAttributes("link").href ?? "";
    popupError = "";
    popup = "link";
    await tick();
    linkInput?.focus();
  }
  async function openImage(event) {
    if (!editor || locked || mode !== "visual") return;
    rememberSelection();
    popupAnchor =
      event?.currentTarget ??
      root?.querySelector('[data-action="image"]') ??
      editor.view.dom;
    imageUrl = selectedImage ? editor.getAttributes("image").src : "";
    imageAlt = selectedImage ? (editor.getAttributes("image").alt ?? "") : "";
    popupError = "";
    popup = "image";
    await tick();
    imageInput?.focus();
  }
  function closePopup(returnFocus = true) {
    popup = "";
    if (returnFocus) {
      restoreSelection();
      focus();
    }
  }
  function applyLink() {
    if (locked) return;
    const href = normalizeLinkUrl(linkUrl);
    if (!href) {
      popupError = "Enter a safe web, email, phone or relative link.";
      return;
    }
    restoreSelection();
    const chain = editor.chain().focus().extendMarkRange("link");
    if (editor.state.selection.empty && !editor.isActive("link"))
      chain
        .insertContent({
          type: "text",
          text: linkUrl.trim(),
          marks: [{ type: "link", attrs: { href } }],
        })
        .run();
    else chain.setLink({ href }).run();
    closePopup();
  }
  function removeLink() {
    if (locked) return;
    restoreSelection();
    editor?.chain().focus().extendMarkRange("link").unsetLink().run();
    closePopup();
  }
  function applyImage() {
    if (locked) return;
    const src = normalizeImageUrl(imageUrl);
    if (!src) {
      popupError = "Enter a safe image URL.";
      return;
    }
    restoreSelection();
    editor?.chain().focus().setImage({ src, alt: imageAlt.trim() }).run();
    closePopup();
  }
  function abortUploads() {
    if (pendingUploads.size) status = "";
    for (const job of pendingUploads) job.controller.abort();
    pendingUploads.clear();
    uploading = false;
  }
  async function uploadFiles(files, position = editor?.state.selection.from) {
    if (locked || mode !== "visual" || !editor) return;
    if (!upload) {
      status = "Choose an image URL. File uploads are not configured.";
      return;
    }
    const current = editor,
      controller = new AbortController(),
      job = { controller, position };
    pendingUploads.add(job);
    uploading = true;
    status = "Uploading image…";
    closePopup(false);
    try {
      for (const file of Array.from(files)) {
        if (
          ![
            "image/png",
            "image/jpeg",
            "image/gif",
            "image/webp",
            "image/avif",
          ].includes(file.type)
        )
          throw new Error("Choose a PNG, JPEG, GIF, WebP or AVIF image.");
        const result = await upload(file, { signal: controller.signal });
        if (
          destroyed ||
          controller.signal.aborted ||
          locked ||
          mode !== "visual" ||
          editor !== current
        )
          return;
        const src = normalizeImageUrl(result?.src);
        if (!src)
          throw new Error("The upload did not return a safe image URL.");
        current.commands.insertContentAt(
          Math.min(job.position, current.state.doc.content.size),
          {
            type: "image",
            attrs: { src, alt: result.alt ?? "", title: result.title ?? null },
          },
          { updateSelection: false },
        );
      }
      status = "Image added. Select it to edit its description.";
    } catch (error) {
      if (!destroyed && !controller.signal.aborted)
        status = error.message || "The image could not be uploaded. Try again.";
    } finally {
      pendingUploads.delete(job);
      if (!destroyed) uploading = pendingUploads.size > 0;
    }
  }
  function compositeBlur(event) {
    if (root?.contains(event.relatedTarget)) return;
    queueMicrotask(() => {
      if (!destroyed && !root?.contains(root?.getRootNode().activeElement))
        onblur?.(event);
    });
  }
  function popupKeydown(event) {
    if (event.key === "Escape" && !event.defaultPrevented) {
      event.preventDefault();
      closePopup();
    } else if (
      event.key === "Enter" &&
      !event.isComposing &&
      event.target.tagName === "INPUT" &&
      event.target.type !== "file"
    ) {
      event.preventDefault();
      if (popup === "link") applyLink();
      else applyImage();
    }
  }

  onMount(() => {
    destroyed = false;
    labelText = [...(source?.labels ?? [])]
      .map((label) => label.textContent.trim())
      .join(" ");
    const current = new Editor({
      element: mount,
      content: "",
      editable: !locked,
      extensions: [
        StarterKit.configure({
          underline: false,
          link: {
            openOnClick: false,
            autolink: true,
            defaultProtocol: "https",
            isAllowedUri: (url, context) =>
              context.defaultValidate(url) && Boolean(normalizeLinkUrl(url)),
            HTMLAttributes: { rel: "noopener noreferrer", target: null },
          },
        }),
        ImageExtension.configure({ allowBase64: false }),
        Placeholder.configure({ placeholder: () => placeholder }),
        Markdown,
        FileHandler.configure({
          allowedMimeTypes: [
            "image/png",
            "image/jpeg",
            "image/gif",
            "image/webp",
            "image/avif",
          ],
          onPaste: (current, files) =>
            uploadFiles(files, current.state.selection.from),
          onDrop: (_current, files, position) => uploadFiles(files, position),
        }),
      ],
      editorProps: {
        attributes: {
          role: "textbox",
          "aria-multiline": "true",
          "data-slot": "rich-text-content",
          class: contentClass,
        },
        transformPastedHTML: (html) => sanitizeRichTextHtml(html),
        handleKeyDown: (_view, event) => {
          if (event.isComposing) return false;
          if (event.altKey && event.key === "F10") {
            event.preventDefault();
            focusToolbar();
            return true;
          }
          if (
            (event.ctrlKey || event.metaKey) &&
            event.key.toLowerCase() === "k" &&
            !locked
          ) {
            event.preventDefault();
            openLink();
            return true;
          }
          return false;
        },
        handleDOMEvents: {
          focus: (_view, event) => {
            onfocus?.(event);
            return false;
          },
          compositionstart: () => {
            composing = true;
            return false;
          },
          compositionend: () => {
            composing = false;
            queueMicrotask(() => {
              if (!destroyed) {
                if (pendingExternal !== undefined) flushExternal();
                else commitEditor();
              }
            });
            return false;
          },
        },
      },
      onUpdate: commitEditor,
      onTransaction: ({ transaction }) => {
        if (transaction.docChanged) {
          for (const job of pendingUploads)
            job.position = transaction.mapping.map(job.position, 1);
          if (selectionBookmark)
            selectionBookmark = selectionBookmark.map(transaction.mapping);
        }
        revision += 1;
      },
    });
    editor = current;
    loadValue(sourceValue, current);
    ready = true;
    syncEditorAttributes();
    tick().then(syncValidity);
    return () => {
      destroyed = true;
      abortUploads();
      current.destroy();
      editor = null;
    };
  });
  $effect(() => {
    const next = String(value ?? "");
    if (ready) untrack(() => replaceValue(next));
  });
  let previousFormat;
  $effect(() => {
    if (previousFormat === undefined) {
      previousFormat = format;
      return;
    }
    if (format !== previousFormat) {
      previousFormat = format;
      abortUploads();
      lastRenderedValue = undefined;
      loadValue(sourceValue);
      tick().then(syncValidity);
    }
  });
  $effect(() => {
    revision;
    locked;
    mode;
    ready;
    tick().then(() => {
      if (!destroyed) untrack(syncToolbar);
    });
  });
  $effect(() => {
    sourceValue;
    mode;
    locked;
    required;
    maxlength;
    placeholder;
    fieldId;
    description;
    accessibleLabel;
    attributes["aria-invalid"];
    attributes.dir;
    if (!ready) return;
    if (locked) {
      abortUploads();
      popup = "";
    }
    syncEditorAttributes();
    syncValidity();
  });
  $effect(() => {
    form;
    if (!ready) return;
    const owner = source?.form;
    if (!owner) return;
    function reset(event) {
      queueMicrotask(() => {
        if (event.defaultPrevented || destroyed) return;
        abortUploads();
        sourceValue = initialValue;
        warning = status = validationError = "";
        popup = "";
        if (loadValue(initialValue)) changeMode("visual");
        emitValue(initialValue);
        tick().then(syncValidity);
      });
    }
    owner.addEventListener("reset", reset);
    return () => owner.removeEventListener("reset", reset);
  });
</script>

<div
  bind:this={root}
  data-slot="rich-text"
  data-mode={mode}
  data-disabled={disabled || undefined}
  data-readonly={readonly || undefined}
  {style}
  class={twMerge(
    "relative w-full min-w-0 rounded-xl border border-gray-200 bg-white text-gray-950 shadow-sm focus-within:border-gray-400 focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-gray-950/15 data-disabled:opacity-50 dark:border-gray-800 dark:bg-gray-950 dark:text-gray-100 dark:focus-within:border-gray-600 dark:focus-within:outline-white/20",
    className,
  )}
  onfocusout={compositeBlur}
>
  {#if customToolbar}
    {@render customToolbar(toolbarContext)}
  {:else}
    <div
      data-slot="rich-text-toolbar"
      class="flex flex-wrap items-center gap-2 rounded-t-[inherit] bg-gray-50/70 p-2 dark:bg-gray-900/50"
    >
      <div
        bind:this={toolbar}
        role="toolbar"
        tabindex="-1"
        aria-label="Text formatting"
        class="flex min-w-0 flex-wrap items-center gap-0.5"
        onkeydown={toolbarKeydown}
      >
        {#each commands as tool, index (tool.name)}
          <button
            type="button"
            data-slot="rich-text-tool"
            class={twMerge(toolClass, tool.class)}
            aria-label={tool.name}
            title={tool.name}
            aria-pressed={activeTools[index]}
            disabled={!ready || locked || mode === "source"}
            tabindex={toolbarIndex === index ? 0 : -1}
            onfocus={() => (toolbarIndex = index)}
            onmousedown={(event) => event.preventDefault()}
            onclick={() => run(tool.command, tool.attributes)}
            >{#if tool.path}<svg
                class="size-4"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="1.5"
                stroke-linecap="round"
                stroke-linejoin="round"
                aria-hidden="true"
                focusable="false"><path d={tool.path} /></svg
              >{:else}<span>{tool.text}</span>{/if}</button
          >
        {/each}
        <button
          type="button"
          data-action="link"
          data-slot="rich-text-tool"
          class={toolClass}
          aria-label="Link"
          title="Link · Ctrl/⌘ K"
          aria-pressed={linkActive}
          disabled={!ready || locked || mode === "source"}
          tabindex={toolbarIndex === 8 ? 0 : -1}
          onfocus={() => (toolbarIndex = 8)}
          onmousedown={(event) => event.preventDefault()}
          onclick={openLink}><Link class="size-4" /></button
        >
        <button
          type="button"
          data-action="image"
          data-slot="rich-text-tool"
          class={toolClass}
          aria-label="Image"
          title="Image"
          disabled={!ready || locked || mode === "source"}
          tabindex={toolbarIndex === 9 ? 0 : -1}
          onfocus={() => (toolbarIndex = 9)}
          onmousedown={(event) => event.preventDefault()}
          onclick={openImage}><Image class="size-4" /></button
        >
        <button
          type="button"
          data-slot="rich-text-tool"
          class={toolClass}
          aria-label="Undo"
          title="Undo"
          disabled={!ready || locked || mode === "source" || !canUndo}
          tabindex={toolbarIndex === 10 ? 0 : -1}
          onfocus={() => (toolbarIndex = 10)}
          onmousedown={(event) => event.preventDefault()}
          onclick={() => run("undo")}
          ><svg
            class="size-4"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="1.5"
            stroke-linecap="round"
            stroke-linejoin="round"
            aria-hidden="true"
            focusable="false"
            ><path d="m8 4-5 5 5 5M3 9h11a6 6 0 0 1 0 12h-3" /></svg
          ></button
        >
        <button
          type="button"
          data-slot="rich-text-tool"
          class={toolClass}
          aria-label="Redo"
          title="Redo"
          disabled={!ready || locked || mode === "source" || !canRedo}
          tabindex={toolbarIndex === 11 ? 0 : -1}
          onfocus={() => (toolbarIndex = 11)}
          onmousedown={(event) => event.preventDefault()}
          onclick={() => run("redo")}
          ><svg
            class="size-4"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="1.5"
            stroke-linecap="round"
            stroke-linejoin="round"
            aria-hidden="true"
            focusable="false"
            ><path d="m16 4 5 5-5 5m5-5H10a6 6 0 0 0 0 12h3" /></svg
          ></button
        >
      </div>
      <div
        class="ms-auto flex shrink-0 items-center gap-0.5 rounded-md bg-gray-200/50 p-0.5 dark:bg-gray-800/70"
        role="group"
        aria-label="Editing mode"
      >
        {#each [{ value: "visual", label: "Write" }, { value: "source", label: "Source" }] as item (item.value)}
          <button
            type="button"
            disabled={disabled || !ready}
            aria-pressed={mode === item.value}
            data-slot="rich-text-mode"
            class="min-h-8 cursor-pointer rounded px-2.5 text-xs font-medium text-gray-600 hover:text-gray-950 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-950 aria-pressed:bg-white aria-pressed:text-gray-950 aria-pressed:shadow-sm disabled:cursor-not-allowed dark:text-gray-400 dark:hover:text-white dark:aria-pressed:bg-gray-700 dark:aria-pressed:text-white dark:focus-visible:outline-white"
            onclick={() => setMode(item.value)}>{item.label}</button
          >
        {/each}
      </div>
    </div>
  {/if}
  {#if warning}<p
      id={`${fieldId}-warning`}
      data-slot="rich-text-warning"
      class="mx-5 mt-4 rounded-md bg-amber-50 p-3 text-sm/6 text-amber-900 dark:bg-amber-950/40 dark:text-amber-200"
      role="status"
    >
      {warning}
    </p>{/if}
  <div bind:this={mount} hidden={!ready || mode !== "visual"}></div>
  <textarea
    {...attributes}
    bind:this={source}
    id={fieldId}
    {name}
    {form}
    value={sourceValue}
    {disabled}
    {readonly}
    {required}
    aria-label={accessibleLabel}
    aria-describedby={description}
    aria-invalid={validationError ? "true" : attributes["aria-invalid"]}
    aria-hidden={ready && mode === "visual" ? "true" : undefined}
    tabindex={ready && mode === "visual" ? -1 : undefined}
    {placeholder}
    spellcheck={mode === "source" ? false : attributes.spellcheck}
    data-slot="rich-text-source"
    class={ready && mode === "visual"
      ? "sr-only"
      : "block min-h-56 w-full min-w-0 resize-y rounded-b-[inherit] bg-transparent p-5 font-mono text-sm/7 outline-none wrap-anywhere"}
    onfocus={(event) => {
      if (mode === "visual" && ready) focus();
      else onfocus?.(event);
    }}
    oninput={updateSource}
    oncompositionstart={() => (composing = true)}
    oncompositionend={(event) => {
      composing = false;
      if (pendingExternal !== undefined) flushExternal();
      else updateSource(event);
    }}
    oninvalid={invalid}></textarea>
  {#if validationError}<p
      id={`${fieldId}-error`}
      data-slot="rich-text-error"
      class="px-5 pb-3 text-sm text-red-600 dark:text-red-400"
      role="alert"
    >
      {validationError}
    </p>{/if}
  <p
    data-slot="rich-text-status"
    aria-live="polite"
    aria-atomic="true"
    class={status
      ? "px-5 pb-3 text-sm text-gray-600 dark:text-gray-400"
      : "sr-only"}
  >
    {status}
  </p>
  <Popover
    bind:this={popover}
    id={`${fieldId}-popover`}
    open={Boolean(popup)}
    onOpenChange={(open) => {
      if (!open) popup = "";
    }}
    anchor={popupAnchor}
    placement="bottom-start"
    data-rich-text-owner={fieldId}
    role="dialog"
    aria-label={popup === "image" ? "Edit image" : "Edit link"}
    class="w-80 max-w-[calc(100vw-1rem)] rounded-xl p-4"
    onfocusout={compositeBlur}
    onkeydown={popupKeydown}
  >
    {#if popup === "link"}
      <div class="grid gap-3">
        <label for={`${fieldId}-link`} class="text-sm font-medium">Link</label>
        <input
          bind:this={linkInput}
          id={`${fieldId}-link`}
          bind:value={linkUrl}
          class={fieldClass}
          inputmode="url"
          autocomplete="off"
          placeholder="https://example.com"
          aria-invalid={Boolean(popupError)}
          aria-describedby={popupError ? `${fieldId}-popup-error` : undefined}
        />
        <div class="flex flex-wrap gap-2">
          <button type="button" class={actionClass} onclick={applyLink}
            >Apply link</button
          >{#if linkActive}<button
              type="button"
              class="min-h-10 cursor-pointer px-2 text-sm text-red-600"
              onclick={removeLink}>Remove</button
            >{/if}<button
            type="button"
            class="ms-auto min-h-10 cursor-pointer px-2 text-sm"
            onclick={() => closePopup()}>Cancel</button
          >
        </div>
      </div>
    {:else if popup === "image"}
      <div class="grid gap-3">
        <label for={`${fieldId}-image-url`} class="text-sm font-medium"
          >Image URL</label
        >
        <input
          bind:this={imageInput}
          id={`${fieldId}-image-url`}
          bind:value={imageUrl}
          class={fieldClass}
          inputmode="url"
          autocomplete="off"
          placeholder="https://example.com/image.png"
          aria-invalid={Boolean(popupError)}
          aria-describedby={popupError ? `${fieldId}-popup-error` : undefined}
        />
        <label for={`${fieldId}-image-alt`} class="text-sm font-medium"
          >Image description</label
        >
        <input
          id={`${fieldId}-image-alt`}
          bind:value={imageAlt}
          class={fieldClass}
          placeholder="What does this image show?"
        />
        <p class="text-xs/5 text-gray-500 dark:text-gray-400">
          Describe meaningful images. Leave empty only for decoration.
        </p>
        <div class="flex flex-wrap gap-2">
          <button type="button" class={actionClass} onclick={applyImage}
            >{selectedImage ? "Update image" : "Add image"}</button
          ><button
            type="button"
            class="ms-auto min-h-10 cursor-pointer px-2 text-sm"
            onclick={() => closePopup()}>Cancel</button
          >
        </div>
        {#if upload}
          <input
            bind:this={imageFile}
            type="file"
            accept="image/png,image/jpeg,image/gif,image/webp,image/avif"
            class="hidden"
            tabindex="-1"
            disabled={locked}
            onchange={(event) => {
              const files = event.target.files;
              if (files?.length) {
                restoreSelection();
                void uploadFiles(files);
              }
              event.target.value = "";
            }}
          />
          <button
            type="button"
            class="min-h-10 cursor-pointer rounded-md border border-gray-200 px-3 text-sm font-medium hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-900"
            disabled={uploading}
            onclick={() => imageFile?.click()}>Choose image file</button
          >
        {/if}
      </div>
    {/if}
    {#if popupError}<p
        id={`${fieldId}-popup-error`}
        class="mt-3 text-sm text-red-600 dark:text-red-400"
        role="alert"
      >
        {popupError}
      </p>{/if}
  </Popover>
</div>
