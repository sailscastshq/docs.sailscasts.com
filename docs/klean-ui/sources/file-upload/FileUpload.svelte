<script>
  let {
    file = $bindable(null),
    onchange,
    onreject,
    accept,
    capture,
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
  let previewUrl = $state("");
  let dragging = $state(false);
  let dragDepth = 0;

  function resetInput() {
    if (input) input.value = "";
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

  function setFile(candidate) {
    file = candidate;
    onchange?.(candidate);
    resetInput();
    return true;
  }

  function select(files) {
    if (disabled) return false;
    const candidates = Array.from(files ?? []);
    if (!candidates.length) return false;
    if (candidates.length > 1) {
      return reject(
        candidates[0],
        "multiple",
        "Choose one file at a time.",
        candidates,
      );
    }

    const candidate = candidates[0];
    if (!acceptedByAttribute(candidate)) {
      return reject(candidate, "accept", "That file type is not accepted.");
    }

    let result;
    try {
      result = validate(candidate);
    } catch {
      return reject(candidate, "validate", "That file could not be validated.");
    }

    if (result !== true && result !== undefined) {
      return reject(
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
    }

    return setFile(candidate);
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
    if (!disabled) setFile(null);
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
      return file;
    },
    get previewUrl() {
      return previewUrl;
    },
    get dragging() {
      return dragging;
    },
    get dropzone() {
      return dropzone;
    },
    choose,
    clear,
  };

  $effect(() => {
    const candidate = file;
    if (
      !candidate ||
      typeof Blob === "undefined" ||
      !(candidate instanceof Blob) ||
      typeof URL.createObjectURL !== "function"
    ) {
      previewUrl = "";
      return;
    }

    const url = URL.createObjectURL(candidate);
    previewUrl = url;
    return () => URL.revokeObjectURL?.(url);
  });
</script>

<div
  {...props}
  bind:this={root}
  data-slot="file-upload"
  data-state={file ? "ready" : "empty"}
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
    {disabled}
    onchange={(event) => select(event.currentTarget.files)}
  />
  {@render children?.(api)}
</div>
