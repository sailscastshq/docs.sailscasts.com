<script>
  import { onMount, untrack } from "svelte";
  import { twMerge } from "tailwind-merge";
  import Popover from "../popover/Popover.svelte";

  let {
    value = $bindable(),
    defaultValue,
    options = [],
    query = $bindable(),
    defaultQuery = "",
    placeholder = "Search and choose",
    emptyText = "No matches found.",
    loadingText = "Searching…",
    loading = false,
    error = "",
    searchDelay = 300,
    name,
    required = false,
    disabled = false,
    id,
    open = $bindable(),
    defaultOpen = false,
    onopenchange,
    onchange,
    onquerychange,
    onsearch,
    placement = "bottom-start",
    offset = 4,
    class: className = "",
    style,
    optionContent,
    empty,
    loadingContent,
    errorContent,
    onfocus,
    onclick,
    oninput,
    onkeydown,
    onblur,
    "aria-label": ariaLabel,
    "aria-labelledby": ariaLabelledby,
    "aria-invalid": ariaInvalid,
    "aria-describedby": ariaDescribedby,
    ...inputProps
  } = $props();

  const componentIdentity = $props.id();
  const componentId = componentIdentity.replace(/[^a-zA-Z0-9_-]/g, "");
  let internalValue = $state(untrack(() => defaultValue));
  let internalQuery = $state(untrack(() => defaultQuery));
  let internalOpen = $state(untrack(() => defaultOpen));
  let currentValue = $derived(value !== undefined ? value : internalValue);
  let currentQuery = $derived(query !== undefined ? query : internalQuery);
  let isOpen = $derived(open !== undefined ? open : internalOpen);
  let controlId = $derived(id ?? `klean-combobox-${componentId}`);
  let contentId = $derived(`${controlId}-content`);
  let listboxId = $derived(`${controlId}-listbox`);
  let selectedIndex = $derived(
    options.findIndex((option) => Object.is(option.value, currentValue)),
  );
  let selectedOption = $derived(options[selectedIndex]);
  let visibleValue = $derived(
    isOpen ? currentQuery : String(selectedOption?.label ?? ""),
  );
  let filteredEntries = $derived.by(() => {
    const needle = currentQuery
      .trim()
      .normalize("NFKD")
      .toLocaleLowerCase();
    return options
      .map((option, index) => ({ option, index }))
      .filter(({ option }) => !needle || searchableText(option).includes(needle));
  });
  let groups = $derived.by(() => {
    const result = new Map();
    for (const entry of filteredEntries) {
      const label = entry.option.group ?? null;
      if (!result.has(label)) result.set(label, []);
      result.get(label).push(entry);
    }
    return [...result].map(([label, entries]) => ({ label, entries }));
  });
  let activeDescendant = $derived(
    isOpen && highlightedIndex >= 0
      ? `${controlId}-option-${highlightedIndex}`
      : undefined,
  );

  let root;
  let input;
  let popover;
  let highlightedIndex = $state(-1);
  let inputWidth = $state(0);
  let searchTimer;

  function searchableText(option) {
    return [option.label, option.description, ...(option.keywords ?? [])]
      .filter(Boolean)
      .join(" ")
      .normalize("NFKD")
      .toLocaleLowerCase();
  }

  function enabledIndexes() {
    return filteredEntries
      .filter(({ option }) => !option.disabled)
      .map(({ index }) => index);
  }

  function initialHighlight(edge = "selected") {
    const enabled = enabledIndexes();
    if (!enabled.length) return -1;
    if (edge === "selected" && enabled.includes(selectedIndex)) {
      return selectedIndex;
    }
    return edge === "last" ? enabled.at(-1) : enabled[0];
  }

  function syncInputWidth() {
    inputWidth = input?.getBoundingClientRect().width ?? 0;
  }

  function revealHighlighted(index = highlightedIndex) {
    if (index < 0) return;
    queueMicrotask(() => {
      popover
        ?.getContent?.()
        ?.querySelector?.(`[data-option-index="${index}"]`)
        ?.scrollIntoView?.({ block: "nearest" });
    });
  }

  function setQuery(nextQuery, { search = false } = {}) {
    internalQuery = nextQuery;
    query = nextQuery;
    onquerychange?.(nextQuery);
    clearTimeout(searchTimer);
    searchTimer = undefined;
    if (!search) return;
    searchTimer = setTimeout(() => {
      onsearch?.(nextQuery);
      searchTimer = undefined;
    }, Math.max(0, searchDelay));
  }

  function requestOpen(nextOpen) {
    if (open === undefined) internalOpen = nextOpen;
    else open = nextOpen;
    onopenchange?.(nextOpen);
  }

  export function show(edge = "first") {
    if (disabled) return;
    syncInputWidth();
    if (!isOpen) {
      setQuery("", { search: true });
      popover?.show(input);
    } else {
      highlightedIndex = initialHighlight(edge);
      revealHighlighted();
    }
  }

  export function close({ restoreFocus = false } = {}) {
    setQuery("");
    popover?.close({ restoreFocus });
  }

  export function focus(options) {
    input?.focus(options);
  }

  function handlePopoverOpen(nextOpen) {
    requestOpen(nextOpen);
    if (!nextOpen) setQuery("");
  }

  function moveHighlight(step) {
    const enabled = enabledIndexes();
    if (!enabled.length) return;
    const current = enabled.indexOf(highlightedIndex);
    const position =
      current < 0
        ? step > 0
          ? 0
          : enabled.length - 1
        : (current + step + enabled.length) % enabled.length;
    highlightedIndex = enabled[position];
    revealHighlighted();
  }

  function choose(index) {
    const option = options[index];
    if (!option || option.disabled || disabled) return;
    internalValue = option.value;
    value = option.value;
    onchange?.(option.value, option);
    highlightedIndex = index;
    close({ restoreFocus: true });
  }

  function handleInput(event) {
    oninput?.(event);
    if (event.defaultPrevented) return;
    if (!isOpen) show();
    setQuery(event.currentTarget.value, { search: true });
  }

  function handleKeydown(event) {
    onkeydown?.(event);
    if (event.defaultPrevented || disabled) return;

    if (event.key === "ArrowDown" || event.key === "ArrowUp") {
      event.preventDefault();
      if (!isOpen) show(event.key === "ArrowUp" ? "last" : "first");
      else moveHighlight(event.key === "ArrowDown" ? 1 : -1);
    } else if (event.key === "Home" && isOpen) {
      event.preventDefault();
      highlightedIndex = initialHighlight("first");
      revealHighlighted();
    } else if (event.key === "End" && isOpen) {
      event.preventDefault();
      highlightedIndex = initialHighlight("last");
      revealHighlighted();
    } else if (event.key === "Enter" && isOpen) {
      event.preventDefault();
      if (highlightedIndex >= 0) choose(highlightedIndex);
    } else if (event.key === "Escape" && isOpen) {
      event.preventDefault();
      event.stopPropagation();
      close({ restoreFocus: true });
    } else if (event.key === "Tab" && isOpen) {
      close();
    }
  }

  $effect(() => {
    if (isOpen) {
      const next = initialHighlight("selected");
      highlightedIndex = next;
      syncInputWidth();
      revealHighlighted(next);
    } else {
      highlightedIndex = -1;
    }
  });

  $effect(() => {
    filteredEntries;
    if (!isOpen) return;
    const enabled = enabledIndexes();
    if (!enabled.includes(highlightedIndex)) {
      highlightedIndex = enabled[0] ?? -1;
      revealHighlighted();
    }
  });

  onMount(() => {
    const formElement = root?.closest?.("form");
    const handleReset = () => {
      clearTimeout(searchTimer);
      internalValue = defaultValue;
      value = defaultValue;
      setQuery(defaultQuery);
      if (isOpen) close();
    };
    formElement?.addEventListener("reset", handleReset);
    const observer =
      typeof ResizeObserver !== "undefined" && input
        ? new ResizeObserver(syncInputWidth)
        : undefined;
    observer?.observe(input);
    syncInputWidth();
    return () => {
      clearTimeout(searchTimer);
      observer?.disconnect();
      formElement?.removeEventListener("reset", handleReset);
    };
  });
</script>

<span
  bind:this={root}
  data-slot="combobox"
  data-state={isOpen ? "open" : "closed"}
  data-disabled={disabled ? "" : undefined}
  data-invalid={ariaInvalid === true || ariaInvalid === "true" ? "" : undefined}
  class="relative grid w-full"
>
  <span data-slot="combobox-control" class="relative grid">
    <input
      {...inputProps}
      bind:this={input}
      id={controlId}
      type="text"
      role="combobox"
      autocomplete="off"
      {disabled}
      value={visibleValue}
      {placeholder}
      popovertarget={contentId}
      popovertargetaction="show"
      aria-expanded={String(isOpen)}
      aria-controls={listboxId}
      aria-haspopup="listbox"
      aria-autocomplete="list"
      aria-activedescendant={activeDescendant}
      aria-required={required || undefined}
      aria-label={ariaLabel}
      aria-labelledby={ariaLabelledby}
      aria-invalid={ariaInvalid}
      aria-describedby={ariaDescribedby}
      data-slot="combobox-input"
      data-state={isOpen ? "open" : "closed"}
      class={twMerge(
        "min-h-11 w-full rounded-md border border-gray-300 bg-white px-3 py-2 pr-10 text-base text-gray-950 shadow-sm outline-none transition-colors duration-150 placeholder:text-gray-500 hover:border-gray-400 focus:border-gray-950 focus:outline-2 focus:outline-offset-2 focus:outline-gray-950 disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-gray-500 aria-invalid:border-red-600 aria-invalid:focus:outline-red-600 dark:border-gray-700 dark:bg-gray-950 dark:text-white dark:placeholder:text-gray-400 dark:hover:border-gray-600 dark:focus:border-white dark:focus:outline-white dark:disabled:bg-gray-900 dark:disabled:text-gray-500 dark:aria-invalid:border-red-500 dark:aria-invalid:focus:outline-red-500 motion-reduce:transition-none",
        className,
      )}
      {style}
      onfocus={(event) => {
        onfocus?.(event);
        if (!event.defaultPrevented) show("selected");
      }}
      onclick={(event) => {
        onclick?.(event);
        if (!event.defaultPrevented) show("selected");
      }}
      oninput={handleInput}
      onkeydown={handleKeydown}
      {onblur}
    />

    <span
      data-slot="combobox-icon"
      class="pointer-events-none absolute inset-y-0 right-3 grid place-items-center text-gray-500 dark:text-gray-400"
      aria-hidden="true"
    >
      {#if loading}
        <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.8" class="size-4 animate-spin motion-reduce:animate-none">
          <path d="M17 10a7 7 0 1 1-2.05-4.95" stroke-linecap="round" />
        </svg>
      {:else}
        <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.8" class="size-4">
          <path d="m6 8 4 4 4-4" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
      {/if}
    </span>
  </span>

  {#if name}
    <input
      type="hidden"
      {name}
      value={["string", "number", "boolean"].includes(typeof currentValue)
        ? String(currentValue)
        : ""}
      {disabled}
      form={inputProps.form}
    />
  {/if}

  <Popover
    bind:this={popover}
    id={contentId}
    open={isOpen}
    {placement}
    {offset}
    data-slot="combobox-content"
    class="max-h-80 overflow-hidden p-1"
    style={inputWidth ? { minWidth: `${inputWidth}px` } : undefined}
    onOpenChange={handlePopoverOpen}
  >
    <div
      id={listboxId}
      role="listbox"
      aria-labelledby={ariaLabel ? undefined : (ariaLabelledby ?? controlId)}
      aria-label={ariaLabel ? `${ariaLabel} options` : undefined}
      aria-busy={loading || undefined}
      data-slot="combobox-listbox"
      class="max-h-[19rem] overflow-y-auto overscroll-contain outline-none"
    >
      {#if error}
        <div role="status" data-slot="combobox-error" class="px-3 py-2 text-sm text-red-700 dark:text-red-400">
          {#if errorContent}{@render errorContent(error)}{:else}{error}{/if}
        </div>
      {/if}

      {#each groups as group, groupIndex (group.label ?? `ungrouped-${groupIndex}`)}
        <div role={group.label ? "group" : undefined} aria-label={group.label || undefined} data-slot="combobox-group">
          {#if group.label}
            <p data-slot="combobox-group-label" class="px-3 py-2 text-xs font-medium text-gray-500 dark:text-gray-400">{group.label}</p>
          {/if}
          {#each group.entries as { option, index } (index)}
            <div
              id={`${controlId}-option-${index}`}
              role="option"
              tabindex="-1"
              aria-selected={String(index === selectedIndex)}
              aria-disabled={option.disabled || undefined}
              data-slot="combobox-option"
              data-option-index={index}
              data-highlighted={index === highlightedIndex ? "" : undefined}
              data-selected={index === selectedIndex ? "" : undefined}
              data-disabled={option.disabled ? "" : undefined}
              class="flex min-h-11 cursor-pointer items-center justify-between gap-3 rounded px-3 py-2 text-sm text-gray-700 outline-none data-[highlighted]:bg-gray-100 data-[highlighted]:text-gray-950 data-[disabled]:cursor-not-allowed data-[disabled]:opacity-40 dark:text-gray-200 dark:data-[highlighted]:bg-white/10 dark:data-[highlighted]:text-white"
              onpointermove={() => {
                if (!option.disabled) highlightedIndex = index;
              }}
              onpointerdown={(event) => event.preventDefault()}
              onclick={() => choose(index)}
              onkeydown={handleKeydown}
            >
              <span class="min-w-0 flex-1">
                {#if optionContent}
                  {@render optionContent(option, { selected: index === selectedIndex, highlighted: index === highlightedIndex })}
                {:else}
                  <span class="block truncate">{option.label}</span>
                  {#if option.description}
                    <span class="mt-0.5 block truncate text-xs text-gray-500 dark:text-gray-400">{option.description}</span>
                  {/if}
                {/if}
              </span>
              {#if index === selectedIndex}
                <svg data-slot="combobox-indicator" aria-hidden="true" viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="2" class="size-4 shrink-0">
                  <path d="m5 10 3 3 7-7" stroke-linecap="round" stroke-linejoin="round" />
                </svg>
              {/if}
            </div>
          {/each}
        </div>
      {/each}

      {#if !filteredEntries.length && !loading}
        <div data-slot="combobox-empty" class="px-3 py-6 text-center text-sm text-gray-500 dark:text-gray-400">
          {#if empty}{@render empty(currentQuery)}{:else}{emptyText}{/if}
        </div>
      {/if}

      {#if loading}
        <div role="status" data-slot="combobox-loading" class="px-3 py-2 text-sm text-gray-500 dark:text-gray-400">
          {#if loadingContent}{@render loadingContent()}{:else}{loadingText}{/if}
        </div>
      {/if}
    </div>
  </Popover>
</span>
