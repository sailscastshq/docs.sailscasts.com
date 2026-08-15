<script>
  import { twMerge } from "tailwind-merge";

  const BASE_CLASSES =
    "inline-flex size-10 shrink-0 items-center justify-center overflow-hidden rounded-full bg-gray-100 object-cover text-sm font-medium text-gray-700 select-none dark:bg-gray-800 dark:text-gray-300";
  const IMAGE_ONLY_ATTRIBUTES = new Set([
    "loading",
    "decoding",
    "crossorigin",
    "referrerpolicy",
    "fetchpriority",
    "sizes",
    "srcset",
    "usemap",
    "ismap",
  ]);

  let {
    src = "",
    alt,
    children,
    class: className,
    onerror,
    onload,
    "data-slot": _dataSlot,
    "data-state": _dataState,
    ...props
  } = $props();

  let element = $state();
  let failedSource = $state(null);
  let showImage = $derived(Boolean(src) && failedSource !== src);

  $effect(() => {
    src;
    failedSource = null;
  });

  let fallbackProps = $derived.by(() =>
    Object.fromEntries(
      Object.entries(props).filter(
        ([name]) => !IMAGE_ONLY_ATTRIBUTES.has(name),
      ),
    ),
  );
  let hasCallerFallbackSemantics = $derived(
    props.role !== undefined ||
      props["aria-label"] !== undefined ||
      props["aria-hidden"] !== undefined,
  );
  let fallbackRole = $derived(
    hasCallerFallbackSemantics ? props.role : alt ? "img" : undefined,
  );
  let fallbackLabel = $derived(
    hasCallerFallbackSemantics ? props["aria-label"] : alt || undefined,
  );
  let fallbackHidden = $derived(
    hasCallerFallbackSemantics ? props["aria-hidden"] : alt ? undefined : true,
  );

  function handleError(event) {
    failedSource = src;
    onerror?.(event);
  }

  function handleLoad(event) {
    failedSource = null;
    onload?.(event);
  }

  export function getElement() {
    return element;
  }
</script>

{#if showImage}
  <img
    {...props}
    bind:this={element}
    data-slot="avatar"
    data-state="image"
    {src}
    {alt}
    class={twMerge(BASE_CLASSES, className)}
    onerror={handleError}
    onload={handleLoad}
  />
{:else}
  <span
    {...fallbackProps}
    bind:this={element}
    data-slot="avatar"
    data-state="fallback"
    role={fallbackRole}
    aria-label={fallbackLabel}
    aria-hidden={fallbackHidden}
    class={twMerge(BASE_CLASSES, className)}
  >
    {@render children?.()}
  </span>
{/if}
