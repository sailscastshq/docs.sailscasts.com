<script>
  import { Link } from "@inertiajs/svelte";
  import { twMerge } from "tailwind-merge";

  let {
    items = [],
    class: className,
    "aria-label": ariaLabel = "Breadcrumb",
    "data-slot": _dataSlot,
    ...navProps
  } = $props();

  const LINK_CLASSES =
    "inline-flex min-h-11 min-w-0 max-w-48 cursor-pointer items-center rounded-sm px-1 text-gray-500 no-underline transition-colors hover:text-gray-950 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-950 dark:text-gray-400 dark:hover:text-white dark:focus-visible:outline-white";
  const LABEL_CLASSES =
    "inline-flex min-h-11 min-w-0 max-w-48 items-center px-1 text-gray-500 dark:text-gray-400";
  const CURRENT_CLASSES =
    "inline-flex min-h-11 min-w-0 max-w-64 items-center px-1 font-medium text-gray-950 dark:text-white";

  let lastIndex = $derived(items.length - 1);
  let collapses = $derived(items.length > 3);

  function itemClass(index) {
    return twMerge(
      "flex min-w-0 shrink-0 items-center gap-1.5",
      collapses && index > 0 && index < lastIndex - 1
        ? "hidden @lg:flex"
        : undefined,
      index === lastIndex ? "shrink" : undefined,
    );
  }
</script>

{#snippet Separator()}
  <svg
    data-slot="separator"
    aria-hidden="true"
    class="size-3.5 shrink-0 text-gray-400 dark:text-gray-600"
    viewBox="0 0 16 16"
    fill="none"
  >
    <path
      d="m6 3.5 4.5 4.5L6 12.5"
      stroke="currentColor"
      stroke-width="1.5"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
  </svg>
{/snippet}

{#if items.length}
  <nav
    {...navProps}
    data-slot="breadcrumb"
    aria-label={ariaLabel}
    class={twMerge("@container min-w-0", className)}
  >
    <ol data-slot="list" class="flex min-w-0 items-center gap-1.5 overflow-hidden text-sm">
      {#each items as item, index (`${index}-${item.label}`)}
        {#if collapses && index === lastIndex - 1}
          <li
            data-slot="ellipsis"
            class="flex shrink-0 items-center gap-1.5 @lg:hidden"
          >
            {@render Separator()}
            <span class="inline-flex min-h-11 items-center px-1 text-gray-400 dark:text-gray-500">
              <span aria-hidden="true">…</span>
              <span class="sr-only">Collapsed breadcrumb items</span>
            </span>
          </li>
        {/if}

        <li
          data-slot="item"
          data-index={index}
          data-state={index === lastIndex ? "current" : undefined}
          class={itemClass(index)}
        >
          {#if index > 0}{@render Separator()}{/if}

          {#if index === lastIndex}
            <span
              data-slot="current"
              aria-current="page"
              title={item.title}
              class={CURRENT_CLASSES}
            >
              <span class="truncate">{item.label}</span>
            </span>
          {:else if item.href}
            <Link
              href={item.href}
              data-slot="link"
              title={item.title}
              class={LINK_CLASSES}
            >
              <span class="truncate">{item.label}</span>
            </Link>
          {:else}
            <span data-slot="label" title={item.title} class={LABEL_CLASSES}>
              <span class="truncate">{item.label}</span>
            </span>
          {/if}
        </li>
      {/each}
    </ol>
  </nav>
{/if}
