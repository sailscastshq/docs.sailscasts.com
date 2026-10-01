<script>
  import { twMerge } from "tailwind-merge";
  import { countryName, flagSource } from "./flags.js";

  const BASE_CLASSES =
    "inline-flex aspect-3/2 w-6 shrink-0 items-center justify-center overflow-hidden bg-gray-100 object-cover select-none dark:bg-gray-800";
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
    country = "",
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
  let resolvedAlt = $derived(
    alt === undefined ? (src ? "" : countryName(country)) : alt,
  );
  let imageSource = $derived(flagSource(country, src));
  let showImage = $derived(
    Boolean(imageSource) && failedSource !== imageSource,
  );

  $effect(() => {
    imageSource;
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
    hasCallerFallbackSemantics ? props.role : resolvedAlt ? "img" : undefined,
  );
  let fallbackLabel = $derived(
    hasCallerFallbackSemantics ? props["aria-label"] : resolvedAlt || undefined,
  );
  let fallbackHidden = $derived(
    hasCallerFallbackSemantics
      ? props["aria-hidden"]
      : resolvedAlt
        ? undefined
        : true,
  );

  function handleError(event) {
    failedSource = imageSource;
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
    data-slot="flag"
    data-state="image"
    src={imageSource}
    alt={resolvedAlt}
    class={twMerge(BASE_CLASSES, className)}
    onerror={handleError}
    onload={handleLoad}
  />
{:else}
  <span
    {...fallbackProps}
    bind:this={element}
    data-slot="flag"
    data-state="fallback"
    role={fallbackRole}
    aria-label={fallbackLabel}
    aria-hidden={fallbackHidden}
    class={twMerge(BASE_CLASSES, className)}
  >
    {@render children?.()}
  </span>
{/if}
