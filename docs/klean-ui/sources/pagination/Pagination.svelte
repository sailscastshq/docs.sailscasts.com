<script>
  import { Link, usePage } from "@inertiajs/svelte";
  import { twMerge } from "tailwind-merge";

  let {
    page,
    pages,
    only = [],
    class: className,
    "aria-label": ariaLabel = "Pagination",
    "aria-busy": _ariaBusy,
    "data-slot": _dataSlot,
    ...navProps
  } = $props();

  const inertiaPage = usePage();
  const LINK_CLASSES =
    "inline-flex min-h-11 min-w-11 cursor-pointer items-center justify-center gap-2 rounded-md border border-gray-200 bg-white px-3 text-sm font-medium text-gray-700 no-underline transition-colors hover:bg-gray-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-950 dark:border-gray-700 dark:bg-gray-950 dark:text-gray-200 dark:hover:bg-gray-900 dark:focus-visible:outline-white";
  const CURRENT_CLASSES =
    "border-gray-950 bg-gray-950 text-white hover:bg-gray-950 dark:border-white dark:bg-white dark:text-gray-950 dark:hover:bg-white";
  const DISABLED_CLASSES =
    "inline-flex min-h-11 min-w-11 cursor-not-allowed items-center justify-center gap-2 rounded-md border border-gray-200 bg-gray-50 px-3 text-sm font-medium text-gray-400 opacity-70 dark:border-gray-800 dark:bg-gray-950 dark:text-gray-600";

  let rootElement = $state();
  let pendingPage = $state();
  let lastIntent;
  let previousPage;

  function positiveInteger(value, fallback = 1) {
    const number = Math.trunc(Number(value));
    return Number.isFinite(number) && number > 0 ? number : fallback;
  }

  function pageWindow(current, total) {
    if (total <= 7)
      return Array.from({ length: total }, (_, index) => index + 1);

    const visible = new Set([1, total, current - 1, current, current + 1]);
    if (current <= 4) [2, 3, 4, 5].forEach((value) => visible.add(value));
    if (current >= total - 3) {
      [total - 4, total - 3, total - 2, total - 1].forEach((value) =>
        visible.add(value),
      );
    }

    const ordered = [...visible]
      .filter((value) => value >= 1 && value <= total)
      .sort((a, b) => a - b);

    return ordered.flatMap((value, index) => {
      const previous = ordered[index - 1];
      return index > 0 && value - previous > 1 ? [null, value] : [value];
    });
  }

  function browserUrl() {
    if (typeof window === "undefined") return "/";
    return `${window.location.pathname}${window.location.search}${window.location.hash}`;
  }

  function hrefFor(source, target) {
    const raw = source || "/";
    const absolute = /^[a-z][a-z\d+.-]*:/i.test(raw);
    const url = new URL(raw, "http://klean.invalid");

    if (target === 1) url.searchParams.delete("page");
    else url.searchParams.set("page", String(target));

    return absolute ? url.href : `${url.pathname}${url.search}${url.hash}`;
  }

  let totalPages = $derived(positiveInteger(pages));
  let currentPage = $derived(Math.min(positiveInteger(page), totalPages));
  let items = $derived(pageWindow(currentPage, totalPages));
  let currentUrl = $derived(inertiaPage.url || browserUrl());

  function isPlainActivation(event) {
    return (
      (event.button === undefined || event.button === 0) &&
      !event.metaKey &&
      !event.ctrlKey &&
      !event.shiftKey &&
      !event.altKey
    );
  }

  function rememberIntent(event, target) {
    if (!isPlainActivation(event)) return;
    if (pendingPage === target) {
      event.preventDefault();
      return;
    }
    lastIntent = target;
  }

  function finish(target) {
    if (pendingPage === target) pendingPage = undefined;
  }

  function linkProps(target) {
    return {
      href: hrefFor(currentUrl, target),
      only,
      preserveScroll: true,
      preserveState: true,
    };
  }

  $effect(() => {
    const nextPage = currentPage;
    if (
      previousPage !== undefined &&
      previousPage !== nextPage &&
      lastIntent === nextPage
    ) {
      queueMicrotask(() => {
        if (typeof document === "undefined") return;
        if (!rootElement?.contains(document.activeElement)) {
          rootElement
            ?.querySelector(`[data-slot="page"][data-page="${nextPage}"]`)
            ?.focus({ preventScroll: true });
        }
        lastIntent = undefined;
      });
    }
    previousPage = nextPage;
  });
</script>

{#snippet Chevron(direction)}
  <svg aria-hidden="true" class="size-4" viewBox="0 0 20 20" fill="none">
    <path
      d={direction === "previous" ? "m12.5 15-5-5 5-5" : "m7.5 5 5 5-5 5"}
      stroke="currentColor"
      stroke-width="1.75"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
  </svg>
{/snippet}

{#if totalPages > 1}
  <nav
    {...navProps}
    bind:this={rootElement}
    data-slot="pagination"
    aria-label={ariaLabel}
    aria-busy={pendingPage ? "true" : undefined}
    class={twMerge("w-full", className)}
  >
    <ul class="flex items-center justify-between gap-2 sm:justify-center">
      <li>
        {#if currentPage > 1}
          <Link
            {...linkProps(currentPage - 1)}
            data-slot="previous"
            data-page={currentPage - 1}
            data-pending={pendingPage === currentPage - 1 ? "" : undefined}
            aria-label={`Go to page ${currentPage - 1}`}
            class={LINK_CLASSES}
            onclick={(event) => rememberIntent(event, currentPage - 1)}
            onstart={() => (pendingPage = currentPage - 1)}
            onfinish={() => finish(currentPage - 1)}
            oncancel={() => finish(currentPage - 1)}
            onerror={() => finish(currentPage - 1)}
          >
            {@render Chevron("previous")}
            <span class="hidden sm:inline">Previous</span>
          </Link>
        {:else}
          <span
            data-slot="previous"
            aria-disabled="true"
            class={DISABLED_CLASSES}
          >
            {@render Chevron("previous")}
            <span class="hidden sm:inline">Previous</span>
          </span>
        {/if}
      </li>

      <li class="sm:hidden">
        <span
          data-slot="summary"
          aria-current="page"
          class="px-2 text-sm text-gray-600 tabular-nums dark:text-gray-300"
        >
          Page {currentPage} of {totalPages}
        </span>
      </li>

      {#each items as item, index (item ?? `ellipsis-${index}`)}
        <li class="hidden sm:block">
          {#if item === null}
            <span
              data-slot="ellipsis"
              class="inline-flex min-h-11 min-w-8 items-center justify-center text-sm text-gray-400 dark:text-gray-500"
            >
              <span aria-hidden="true">…</span>
              <span class="sr-only">More pages</span>
            </span>
          {:else}
            <Link
              {...linkProps(item)}
              data-slot="page"
              data-page={item}
              data-state={item === currentPage ? "current" : undefined}
              data-pending={pendingPage === item ? "" : undefined}
              aria-current={item === currentPage ? "page" : undefined}
              aria-label={item === currentPage
                ? `Page ${item}, current page`
                : `Go to page ${item}`}
              class={twMerge(
                LINK_CLASSES,
                item === currentPage && CURRENT_CLASSES,
              )}
              onclick={(event) => rememberIntent(event, item)}
              onstart={() => (pendingPage = item)}
              onfinish={() => finish(item)}
              oncancel={() => finish(item)}
              onerror={() => finish(item)}
            >
              {item}
            </Link>
          {/if}
        </li>
      {/each}

      <li>
        {#if currentPage < totalPages}
          <Link
            {...linkProps(currentPage + 1)}
            data-slot="next"
            data-page={currentPage + 1}
            data-pending={pendingPage === currentPage + 1 ? "" : undefined}
            aria-label={`Go to page ${currentPage + 1}`}
            class={LINK_CLASSES}
            onclick={(event) => rememberIntent(event, currentPage + 1)}
            onstart={() => (pendingPage = currentPage + 1)}
            onfinish={() => finish(currentPage + 1)}
            oncancel={() => finish(currentPage + 1)}
            onerror={() => finish(currentPage + 1)}
          >
            <span class="hidden sm:inline">Next</span>
            {@render Chevron("next")}
          </Link>
        {:else}
          <span data-slot="next" aria-disabled="true" class={DISABLED_CLASSES}>
            <span class="hidden sm:inline">Next</span>
            {@render Chevron("next")}
          </span>
        {/if}
      </li>
    </ul>
  </nav>
{/if}
