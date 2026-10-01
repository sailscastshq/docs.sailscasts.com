<script>
  import { onMount, untrack } from "svelte";
  import { twMerge } from "tailwind-merge";
  import Popover from "../popover/Popover.svelte";

  let {
    value = $bindable(),
    defaultValue,
    options = [],
    placeholder = "Select options",
    name,
    required = false,
    disabled = false,
    id,
    open = $bindable(),
    defaultOpen = false,
    onopenchange,
    onchange,
    placement = "bottom-start",
    offset = 4,
    class: className = "",
    style,
    valueContent,
    optionContent,
    icon,
    empty,
    onclick,
    onkeydown,
    onblur,
    "aria-label": ariaLabel,
    "aria-labelledby": ariaLabelledby,
    "aria-invalid": ariaInvalid,
    ...triggerProps
  } = $props();

  const componentIdentity = $props.id();
  const componentId = componentIdentity.replace(/[^a-zA-Z0-9_-]/g, "");
  let internalValue = $state(untrack(() => defaultValue ?? []));
  let internalOpen = $state(untrack(() => defaultOpen));
  let currentValue = $derived(value !== undefined ? value : internalValue);
  let isOpen = $derived(open !== undefined ? open : internalOpen);
  let controlId = $derived(id ?? `klean-multi-select-${componentId}`);
  let contentId = $derived(`${controlId}-content`);
  let listboxId = $derived(`${controlId}-listbox`);
  let selectedOptions = $derived(
    options.filter((option) =>
      (currentValue ?? []).some((item) => Object.is(item, option.value)),
    ),
  );
  let selectedIndex = $derived(
    options.findIndex((option) => selectedOptions.includes(option)),
  );
  let hasSelection = $derived(selectedOptions.length > 0);
  function isSelected(index) {
    return selectedOptions.includes(options[index]);
  }
  let activeDescendant = $derived(
    isOpen && highlightedIndex >= 0
      ? `${controlId}-option-${highlightedIndex}`
      : undefined,
  );
  let groups = $derived.by(() => {
    const grouped = new Map();

    options.forEach((option, index) => {
      const label = option.group ?? null;
      if (!grouped.has(label)) grouped.set(label, []);
      grouped.get(label).push({ option, index });
    });

    return [...grouped].map(([label, entries]) => ({ label, entries }));
  });

  let invalid = $state(false);
  let root;
  let trigger;
  let popover;
  let highlightedIndex = $state(-1);
  let triggerWidth = $state(0);
  let typeahead = "";
  let typeaheadTimer;
  let pendingEdge = "selected";

  function enabledIndexes() {
    return groups.flatMap((group) =>
      group.entries
        .filter(({ option }) => !option.disabled)
        .map(({ index }) => index),
    );
  }

  function initialHighlight(edge = "selected") {
    const enabled = enabledIndexes();
    if (!enabled.length) return -1;
    if (
      edge === "selected" &&
      selectedIndex >= 0 &&
      !options[selectedIndex]?.disabled
    ) {
      return selectedIndex;
    }
    return edge === "last" ? enabled.at(-1) : enabled[0];
  }

  function syncTriggerWidth() {
    triggerWidth = trigger?.getBoundingClientRect().width ?? 0;
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

  function requestOpen(nextOpen) {
    if (open === undefined) internalOpen = nextOpen;
    else open = nextOpen;
    onopenchange?.(nextOpen);
  }

  function handlePopoverOpen(nextOpen) {
    requestOpen(nextOpen);
  }

  export function show(edge = "selected") {
    if (disabled) return;
    pendingEdge = edge;
    syncTriggerWidth();
    if (isOpen) {
      highlightedIndex = initialHighlight(edge);
      revealHighlighted();
    } else {
      popover?.show(trigger);
    }
  }

  export function close({ restoreFocus = false } = {}) {
    popover?.close({ restoreFocus });
  }

  export function focus(options) {
    trigger?.focus(options);
  }

  function clearTypeahead() {
    typeahead = "";
    clearTimeout(typeaheadTimer);
    typeaheadTimer = undefined;
  }

  function findTypeaheadMatch(text) {
    const enabled = enabledIndexes();
    if (!enabled.length) return -1;
    const current = enabled.indexOf(isOpen ? highlightedIndex : selectedIndex);
    const ordered = [
      ...enabled.slice(current + 1),
      ...enabled.slice(0, current + 1),
    ];
    return (
      ordered.find((index) =>
        String(options[index]?.label ?? "")
          .trim()
          .toLocaleLowerCase()
          .startsWith(text),
      ) ?? -1
    );
  }

  function choose(index) {
    const option = options[index];
    if (!option || option.disabled || disabled) return;

    invalid = false;
    const next = isSelected(index)
      ? (currentValue ?? []).filter((item) => !Object.is(item, option.value))
      : [...(currentValue ?? []), option.value];
    internalValue = next;
    value = next;
    onchange?.(next, option);
    highlightedIndex = index;
    clearTypeahead();
  }

  function handleTypeahead(event) {
    if (
      event.key.length !== 1 ||
      event.key === " " ||
      event.altKey ||
      event.ctrlKey ||
      event.metaKey
    ) {
      return false;
    }

    event.preventDefault();
    clearTimeout(typeaheadTimer);
    typeahead += event.key.toLocaleLowerCase();
    typeaheadTimer = setTimeout(clearTypeahead, 500);
    let match = findTypeaheadMatch(typeahead);

    if (match < 0 && new Set(typeahead).size === 1) {
      typeahead = typeahead.at(-1);
      match = findTypeaheadMatch(typeahead);
    }

    if (match < 0) return true;
    if (isOpen) {
      highlightedIndex = match;
      revealHighlighted();
    } else {
      show();
      highlightedIndex = match;
      revealHighlighted(match);
    }
    return true;
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

  function handleKeydown(event) {
    onkeydown?.(event);
    if (event.defaultPrevented || disabled) return;

    if (!isOpen) {
      if (["Enter", " ", "ArrowDown", "ArrowUp"].includes(event.key)) {
        event.preventDefault();
        show(event.key === "ArrowUp" ? "last" : "selected");
      } else {
        handleTypeahead(event);
      }
      return;
    }

    if (event.key === "Escape") {
      event.preventDefault();
      event.stopPropagation();
      close({ restoreFocus: true });
    } else if (event.key === "Tab") {
      clearTypeahead();
      close();
    } else if (event.key === "ArrowDown") {
      event.preventDefault();
      moveHighlight(1);
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      moveHighlight(-1);
    } else if (event.key === "Home" || event.key === "End") {
      event.preventDefault();
      highlightedIndex = initialHighlight(
        event.key === "End" ? "last" : "first",
      );
      revealHighlighted();
    } else if (["Enter", " "].includes(event.key)) {
      event.preventDefault();
      if (highlightedIndex >= 0) choose(highlightedIndex);
    } else {
      handleTypeahead(event);
    }
  }

  $effect(() => {
    if (isOpen) {
      const nextHighlight = untrack(() => initialHighlight(pendingEdge));
      highlightedIndex = nextHighlight;
      pendingEdge = "selected";
      syncTriggerWidth();
      revealHighlighted(nextHighlight);
    } else {
      highlightedIndex = -1;
    }
    clearTypeahead();
  });

  $effect(() => {
    options;
    if (!isOpen) return;
    const nextHighlight = untrack(() => initialHighlight("selected"));
    highlightedIndex = nextHighlight;
    revealHighlighted(nextHighlight);
  });

  $effect(() => {
    if (disabled && isOpen) close();
  });

  onMount(() => {
    const form = triggerProps.form
      ? document.getElementById(triggerProps.form)
      : root?.closest?.("form");
    const handleReset = () => {
      invalid = false;
      internalValue = defaultValue ?? [];
      value = defaultValue ?? [];
      if (isOpen) close();
    };
    form?.addEventListener("reset", handleReset);

    const observer =
      typeof ResizeObserver !== "undefined" && trigger
        ? new ResizeObserver(syncTriggerWidth)
        : undefined;
    if (trigger) observer?.observe(trigger);
    syncTriggerWidth();

    return () => {
      clearTypeahead();
      observer?.disconnect();
      form?.removeEventListener("reset", handleReset);
    };
  });
</script>

<span
  bind:this={root}
  data-slot="multi-select"
  data-state={isOpen ? "open" : "closed"}
  data-placeholder={hasSelection ? undefined : ""}
  data-disabled={disabled ? "" : undefined}
  data-invalid={(ariaInvalid ?? invalid) === true ||
  (ariaInvalid ?? invalid) === "true"
    ? ""
    : undefined}
  class="relative grid w-full"
>
  <button
    {...triggerProps}
    bind:this={trigger}
    id={controlId}
    type="button"
    role="combobox"
    {disabled}
    popovertarget={contentId}
    popovertargetaction="toggle"
    aria-label={ariaLabel}
    aria-labelledby={ariaLabelledby}
    aria-invalid={ariaInvalid ?? (invalid || undefined)}
    aria-expanded={String(isOpen)}
    aria-controls={listboxId}
    aria-haspopup="listbox"
    aria-activedescendant={activeDescendant}
    aria-required={required || undefined}
    data-slot="multi-select-trigger"
    data-state={isOpen ? "open" : "closed"}
    data-placeholder={hasSelection ? undefined : ""}
    class={twMerge(
      "flex min-h-11 w-full cursor-pointer items-center justify-between gap-3 rounded-md border border-gray-300 bg-white px-3 py-2 text-left text-base text-gray-950 shadow-sm outline-none transition-colors duration-150 hover:border-gray-400 focus-visible:border-gray-950 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-950 disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-gray-500 aria-invalid:border-red-600 aria-invalid:focus-visible:outline-red-600 dark:border-gray-700 dark:bg-gray-950 dark:text-white dark:hover:border-gray-600 dark:focus-visible:border-white dark:focus-visible:outline-white dark:disabled:bg-gray-900 dark:disabled:text-gray-500 dark:aria-invalid:border-red-500 dark:aria-invalid:focus-visible:outline-red-500 motion-reduce:transition-none",
      className,
    )}
    {style}
    onclick={(event) => {
      onclick?.(event);
      if (event.defaultPrevented) return;
      if (!isOpen) pendingEdge = "selected";
      syncTriggerWidth();
    }}
    onkeydown={handleKeydown}
    {onblur}
  >
    <span
      data-slot="multi-select-value"
      class={hasSelection
        ? "truncate"
        : "truncate text-gray-500 dark:text-gray-400"}
    >
      {#if hasSelection}
        {#if valueContent}
          {@render valueContent(selectedOptions)}
        {:else}
          {selectedOptions.map((option) => option.label).join(", ")}
        {/if}
      {:else}
        {placeholder}
      {/if}
    </span>

    <span
      data-slot="multi-select-icon"
      class="shrink-0 text-gray-500 dark:text-gray-400"
    >
      {#if icon}
        {@render icon(isOpen)}
      {:else}
        <svg
          aria-hidden="true"
          viewBox="0 0 20 20"
          fill="none"
          stroke="currentColor"
          stroke-width="1.8"
          class="size-4"
        >
          <path
            d="m6 8 4 4 4-4"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
      {/if}
    </span>
  </button>

  <select
    multiple
    aria-hidden="true"
    tabindex="-1"
    class="sr-only"
    data-slot="multi-select-native"
    {name}
    {required}
    {disabled}
    form={triggerProps.form}
    oninvalid={(event) => {
      event.preventDefault();
      invalid = true;
      trigger?.focus();
    }}
  >
    {#each options as option, index (index)}
      <option
        value={String(option.value)}
        selected={isSelected(index)}
        disabled={option.disabled}>{option.label}</option
      >
    {/each}
  </select>

  <Popover
    bind:this={popover}
    id={contentId}
    open={isOpen}
    {placement}
    {offset}
    data-slot="multi-select-content"
    class="max-h-72 overflow-hidden p-1"
    style={triggerWidth ? { minWidth: `${triggerWidth}px` } : undefined}
    onOpenChange={handlePopoverOpen}
  >
    <div
      id={listboxId}
      role="listbox"
      aria-multiselectable="true"
      aria-labelledby={ariaLabel ? undefined : (ariaLabelledby ?? controlId)}
      aria-label={ariaLabel ? `${ariaLabel} options` : undefined}
      data-slot="multi-select-listbox"
      class="max-h-68 overflow-y-auto overscroll-contain outline-none"
    >
      {#if options.length}
        {#each groups as group, groupIndex (group.label ?? `ungrouped-${groupIndex}`)}
          <div
            role={group.label ? "group" : undefined}
            aria-label={group.label || undefined}
            data-slot="multi-select-group"
          >
            {#if group.label}
              <p
                data-slot="multi-select-group-label"
                class="px-3 py-2 text-xs font-medium text-gray-500 dark:text-gray-400"
              >
                {group.label}
              </p>
            {/if}

            {#each group.entries as { option, index } (index)}
              <div
                id={`${controlId}-option-${index}`}
                role="option"
                tabindex="-1"
                aria-label={String(option.label)}
                aria-selected={String(isSelected(index))}
                aria-disabled={option.disabled || undefined}
                data-slot="multi-select-option"
                data-option-index={index}
                data-highlighted={index === highlightedIndex ? "" : undefined}
                data-selected={isSelected(index) ? "" : undefined}
                data-disabled={option.disabled ? "" : undefined}
                class="flex min-h-11 cursor-pointer items-center justify-between gap-3 rounded px-3 py-2 text-sm text-gray-700 outline-none data-highlighted:bg-gray-100 data-highlighted:text-gray-950 data-disabled:cursor-not-allowed data-disabled:opacity-40 dark:text-gray-200 dark:data-highlighted:bg-white/10 dark:data-highlighted:text-white"
                onpointermove={() => {
                  if (!option.disabled) highlightedIndex = index;
                }}
                onpointerdown={(event) => event.preventDefault()}
                onclick={() => choose(index)}
                onkeydown={handleKeydown}
              >
                <span class="min-w-0 flex-1 truncate">
                  {#if optionContent}
                    {@render optionContent(option, {
                      selected: isSelected(index),
                      highlighted: index === highlightedIndex,
                    })}
                  {:else}
                    {option.label}
                  {/if}
                </span>

                <span
                  data-slot="multi-select-indicator"
                  class="grid size-5 shrink-0 place-items-center"
                  aria-hidden="true"
                >
                  {#if isSelected(index)}
                    <svg
                      viewBox="0 0 20 20"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="2"
                      class="size-4"
                    >
                      <path
                        d="m5 10 3 3 7-7"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      />
                    </svg>
                  {/if}
                </span>
              </div>
            {/each}
          </div>
        {/each}
      {:else}
        <div
          data-slot="multi-select-empty"
          class="px-3 py-6 text-center text-sm text-gray-500 dark:text-gray-400"
        >
          {#if empty}
            {@render empty()}
          {:else}
            No options available.
          {/if}
        </div>
      {/if}
    </div>
  </Popover>
</span>
