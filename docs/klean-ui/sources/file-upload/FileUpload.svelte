<script>
  import { untrack } from "svelte";

  let {
    file = $bindable(null),
    onchange,
    onreject,
    accept,
    capture,
    multiple = false,
    disabled = false,
    validate = () => true,
    class: className,
    children,
    "data-slot": _dataSlot,
    "data-state": _dataState,
    "data-dragging": _dataDragging,
    "data-disabled": _dataDisabled,
    ...props
  } = $props();

  let root = $state();
  let input = $state();
  let previewEntries = $state([]);
  let dragging = $state(false);
  let dragDepth = 0;
  let files = $derived(
    multiple
      ? Array.isArray(file)
        ? file.filter(Boolean)
        : file
          ? [file]
          : []
      : file
        ? [file]
        : [],
  );
  let singleFile = $derived(multiple ? null : (files[0] ?? null));
  let previews = $derived(
    previewEntries.map((entry) => ({
      file: entry.file,
      previewUrl: entry.url,
    })),
  );
  let previewUrl = $derived(previews[0]?.previewUrl ?? "");

  function resetInput() {
    if (input) input.value = "";
  }

  function revokeEntry(entry) {
    if (entry?.url) URL.revokeObjectURL?.(entry.url);
  }

  function createPreviewEntry(candidate) {
    const canPreview =
      candidate &&
      typeof Blob !== "undefined" &&
      candidate instanceof Blob &&
      typeof URL.createObjectURL === "function";
    return {
      file: candidate,
      url: canPreview ? URL.createObjectURL(candidate) : "",
    };
  }

  function syncPreviews(candidates) {
    const remaining = [...previewEntries];
    const next = candidates.map((candidate) => {
      const index = remaining.findIndex((entry) =>
        Object.is(entry.file, candidate),
      );
      if (index === -1) return createPreviewEntry(candidate);
      return remaining.splice(index, 1)[0];
    });
    for (const entry of remaining) revokeEntry(entry);
    previewEntries = next;
  }

  function revokePreviews() {
    for (const entry of previewEntries) revokeEntry(entry);
    previewEntries = [];
  }

  function acceptedByAttribute(candidate) {
    const rules = accept
      ?.split(",")
      .map((rule) => rule.trim().toLowerCase())
      .filter(Boolean);
    if (!rules?.length) return true;

    const type = candidate.type?.toLowerCase() ?? "";
    const filename = candidate.name?.toLowerCase() ?? "";
    return rules.some((rule) => {
      if (rule.startsWith(".")) return filename.endsWith(rule);
      if (rule.endsWith("/*")) return type.startsWith(rule.slice(0, -1));
      return type === rule;
    });
  }

  function reject(candidate, reason, message, files = undefined) {
    const detail = { file: candidate ?? null, reason, message };
    if (files) detail.files = files;
    onreject?.(detail);
    resetInput();
    return false;
  }

  function setSelection(selection) {
    file = selection;
    onchange?.(selection);
    resetInput();
    return true;
  }

  function select(selection) {
    if (disabled) return false;
    const candidates = Array.from(selection ?? []);
    if (!candidates.length) return false;
    if (!multiple && candidates.length > 1) {
      reject(
        candidates[0],
        "multiple",
        "Choose one file at a time.",
        candidates,
      );
      resetInput();
      return false;
    }

    const accepted = [];
    const current = multiple ? [...files] : [];
    for (const candidate of candidates) {
      if (!acceptedByAttribute(candidate)) {
        reject(candidate, "accept", "That file type is not accepted.");
        continue;
      }

      let result;
      try {
        result = validate(candidate, {
          files: [...current, ...accepted],
          multiple,
        });
      } catch {
        reject(candidate, "validate", "That file could not be validated.");
        continue;
      }

      if (result !== true && result !== undefined) {
        reject(
          candidate,
          typeof result === "object" && result?.reason
            ? result.reason
            : "validate",
          typeof result === "string" && result
            ? result
            : typeof result === "object" && result?.message
              ? result.message
              : "That file is not valid.",
        );
        continue;
      }

      accepted.push(candidate);
    }

    if (!accepted.length) {
      resetInput();
      return false;
    }

    return setSelection(multiple ? [...current, ...accepted] : accepted[0]);
  }

  export function choose() {
    if (disabled || !input) return;
    resetInput();
    if (typeof input.showPicker === "function") {
      try {
        input.showPicker();
        return;
      } catch {
        // The native click path covers browsers that restrict showPicker().
      }
    }
    input.click();
  }

  export function clear() {
    if (!disabled) setSelection(multiple ? [] : null);
  }

  export function remove(candidate) {
    if (disabled) return false;
    if (!multiple) return setSelection(null);
    const index = files.findIndex((entry) => Object.is(entry, candidate));
    if (index === -1) return false;
    const next = [...files];
    next.splice(index, 1);
    return setSelection(next);
  }

  export function getRoot() {
    return root;
  }

  function hasFiles(event) {
    return Array.from(event.dataTransfer?.types ?? []).includes("Files");
  }

  function handleDragEnter(event) {
    if (disabled || !hasFiles(event)) return;
    event.preventDefault();
    dragDepth += 1;
    dragging = true;
  }

  function handleDragOver(event) {
    if (disabled || !hasFiles(event)) return;
    event.preventDefault();
    if (event.dataTransfer) event.dataTransfer.dropEffect = "copy";
    dragging = true;
  }

  function handleDragLeave(event) {
    if (disabled || !hasFiles(event)) return;
    event.preventDefault();
    dragDepth = Math.max(0, dragDepth - 1);
    if (dragDepth === 0) dragging = false;
  }

  function handleDrop(event) {
    if (!hasFiles(event)) return;
    event.preventDefault();
    dragDepth = 0;
    dragging = false;
    if (!disabled) select(event.dataTransfer?.files);
  }

  let dropzone = $derived({
    "data-dragging": dragging ? "" : undefined,
    "data-disabled": disabled ? "" : undefined,
    ondragenter: handleDragEnter,
    ondragover: handleDragOver,
    ondragleave: handleDragLeave,
    ondrop: handleDrop,
  });

  let api = {
    get file() {
      return singleFile;
    },
    get previewUrl() {
      return previewUrl;
    },
    get files() {
      return files;
    },
    get previews() {
      return previews;
    },
    get dragging() {
      return dragging;
    },
    get dropzone() {
      return dropzone;
    },
    choose,
    clear,
    remove,
  };

  $effect(() => {
    const candidates = files;
    untrack(() => syncPreviews(candidates));
  });

  $effect(() => {
    return () => untrack(revokePreviews);
  });
</script>

<div
  {...props}
  bind:this={root}
  data-slot="file-upload"
  data-state={files.length ? "ready" : "empty"}
  data-dragging={dragging ? "" : undefined}
  data-disabled={disabled ? "" : undefined}
  class={className}
>
  <input
    bind:this={input}
    type="file"
    hidden
    data-part="input"
    {accept}
    {capture}
    {multiple}
    {disabled}
    onchange={(event) => select(event.currentTarget.files)}
  />
  {@render children?.(api)}
</div>
