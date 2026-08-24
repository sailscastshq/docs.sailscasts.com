<script>
  import { tick } from "svelte";
  import { twMerge } from "tailwind-merge";

  const BASE_CLASSES =
    "flex min-h-12 w-full flex-wrap items-center gap-3 rounded-lg border border-gray-200 bg-white px-3 py-2 text-gray-950 shadow-sm dark:border-gray-800 dark:bg-gray-950 dark:text-white";

  let {
    count = 0,
    label = "Bulk actions",
    busy = false,
    clearLabel = "Clear selection",
    summary,
    children,
    onclear,
    class: className,
    "data-slot": _dataSlot,
    ...rootProps
  } = $props();

  let element = $state();
  let selectedCount = $derived(Math.max(0, Math.trunc(Number(count) || 0)));
  let previousCount = 0;

  function focusTarget(root) {
    return root?.querySelector?.("[data-bulk-actions-focus]");
  }

  function clearSelection() {
    if (!busy) onclear?.();
  }

  $effect.pre(() => {
    const nextCount = selectedCount;
    if (previousCount > 0 && nextCount <= 0) {
      const rootElement = element;
      const root = rootElement?.getRootNode?.() ?? document;
      const activeElement = root.activeElement ?? document.activeElement;
      const shouldRestore = rootElement?.contains(activeElement);

      tick().then(() => {
        if (shouldRestore) focusTarget(root)?.focus?.({ preventScroll: true });
      });
    }
    previousCount = nextCount;
  });

  export function clear() {
    clearSelection();
  }

  export function getElement() {
    return element;
  }
</script>

{#if selectedCount > 0}
  <div
    {...rootProps}
    bind:this={element}
    role="region"
    aria-label={label}
    aria-busy={busy || undefined}
    data-slot="bulk-actions"
    class={twMerge(BASE_CLASSES, className)}
  >
    <span
      role="status"
      aria-live="polite"
      aria-atomic="true"
      data-slot="bulk-actions-summary"
      class="mr-auto text-sm font-medium tabular-nums"
    >
      {#if summary}
        {@render summary({ count: selectedCount, busy, clear: clearSelection })}
      {:else}
        {selectedCount} selected
      {/if}
    </span>

    {@render children?.({ count: selectedCount, busy, clear: clearSelection })}

    <button
      type="button"
      disabled={busy}
      data-slot="bulk-actions-clear"
      class="min-h-9 cursor-pointer rounded-md px-3 text-sm font-medium text-gray-600 hover:bg-gray-100 hover:text-gray-950 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-950 disabled:cursor-not-allowed disabled:opacity-50 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-white dark:focus-visible:outline-white"
      onclick={clearSelection}
    >
      {clearLabel}
    </button>
  </div>
{/if}
