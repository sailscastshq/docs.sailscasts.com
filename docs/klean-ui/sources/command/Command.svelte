<script>
  import { untrack } from "svelte";
  import { twMerge } from "tailwind-merge";

  function normalize(value) {
    return String(value ?? "")
      .normalize("NFKD")
      .toLocaleLowerCase()
      .replace(/\p{Diacritic}/gu, "");
  }

  function defaultFilter(command, query) {
    const needle = normalize(query).trim();
    if (!needle) return true;
    return normalize(
      [command.title, ...(command.keywords ?? [])].filter(Boolean).join(" "),
    ).includes(needle);
  }

  const componentIdentity = $props.id();
  const generatedId = componentIdentity.replace(/[^a-zA-Z0-9_-]/g, "");
  let {
    commands = [],
    groups,
    query = $bindable(),
    defaultQuery = "",
    label = "Search commands",
    placeholder = "Type a command or search…",
    filter = defaultFilter,
    autofocus = false,
    id,
    class: className = "",
    prefix,
    suffix,
    before,
    item,
    empty,
    footer,
    onquerychange,
    onselect,
    onescape,
    onback,
    onkeydown,
    "data-slot": _dataSlot,
    "data-state": _dataState,
    children: _children,
    ...rootProps
  } = $props();

  let rootElement;
  let inputElement;
  let internalQuery = $state(untrack(() => defaultQuery));
  let activeKey = $state();
  let currentQuery = $derived(query !== undefined ? query : internalQuery);
  let controlId = $derived(id ?? `klean-command-${generatedId}`);
  let inputId = $derived(`${controlId}-input`);
  let listId = $derived(`${controlId}-list`);
  let sourceGroups = $derived.by(() => {
    if (groups !== undefined) {
      return Object.entries(groups).map(([heading, groupedCommands]) => ({
        heading,
        commands: Array.isArray(groupedCommands) ? groupedCommands : [],
      }));
    }

    const collected = new Map();
    for (const command of commands) {
      if (!filter(command, currentQuery)) continue;
      const heading = command.group || "Other";
      if (!collected.has(heading)) collected.set(heading, []);
      collected.get(heading).push(command);
    }
    return [...collected].map(([heading, groupedCommands]) => ({
      heading,
      commands: groupedCommands,
    }));
  });
  let commandGroups = $derived(
    sourceGroups
      .map((group, groupIndex) => ({
        heading: group.heading,
        headingId: `${controlId}-group-${groupIndex}`,
        entries: group.commands.map((command, commandIndex) => {
          const identity = String(command.id ?? command.title ?? commandIndex)
            .replace(/[^a-zA-Z0-9_-]/g, "-")
            .replace(/-+/g, "-");
          return {
            command,
            key: `${groupIndex}:${commandIndex}:${identity}`,
            optionId: `${controlId}-option-${groupIndex}-${commandIndex}-${identity}`,
          };
        }),
      }))
      .filter((group) => group.entries.length),
  );
  let entries = $derived(commandGroups.flatMap((group) => group.entries));
  let enabledEntries = $derived(
    entries.filter((entry) => !entry.command.disabled),
  );
  let activeEntry = $derived(
    enabledEntries.find((entry) => entry.key === activeKey),
  );
  let previousQuery = untrack(() => currentQuery);

  function setQuery(nextQuery) {
    internalQuery = nextQuery;
    query = nextQuery;
    onquerychange?.(nextQuery);
  }

  function revealActive(entry = activeEntry) {
    if (!entry) return;
    queueMicrotask(() => {
      rootElement
        ?.querySelector?.(`[data-command-key="${entry.key}"]`)
        ?.scrollIntoView?.({ block: "nearest" });
    });
  }

  function move(step) {
    if (!enabledEntries.length) return;
    const current = enabledEntries.findIndex(
      (entry) => entry.key === activeKey,
    );
    const next =
      current < 0
        ? step > 0
          ? 0
          : enabledEntries.length - 1
        : (current + step + enabledEntries.length) % enabledEntries.length;
    activeKey = enabledEntries[next].key;
    revealActive();
  }

  function moveTo(edge) {
    if (!enabledEntries.length) return;
    activeKey =
      edge === "last" ? enabledEntries.at(-1).key : enabledEntries[0].key;
    revealActive();
  }

  function select(entry = activeEntry) {
    if (!entry || entry.command.disabled) return;
    onselect?.(entry.command);
  }

  function handleInput(event) {
    setQuery(event.currentTarget.value);
  }

  function handleKeydown(event) {
    onkeydown?.(event);
    if (event.defaultPrevented || event.isComposing || event.keyCode === 229) {
      return;
    }

    if (event.key === "ArrowDown" || event.key === "ArrowUp") {
      event.preventDefault();
      move(event.key === "ArrowDown" ? 1 : -1);
    } else if (event.key === "Home") {
      event.preventDefault();
      moveTo("first");
    } else if (event.key === "End") {
      event.preventDefault();
      moveTo("last");
    } else if (event.key === "Enter") {
      if (!activeEntry) return;
      event.preventDefault();
      select();
    } else if (event.key === "Escape") {
      if (currentQuery) {
        event.preventDefault();
        event.stopPropagation();
        setQuery("");
      } else {
        onescape?.(event);
      }
    } else if (event.key === "Backspace" && !currentQuery) {
      onback?.(event);
    }
  }

  function handlePointermove(event, entry) {
    if (entry.command.disabled || event.pointerType === "touch") return;
    activeKey = entry.key;
  }

  function handleOptionKeydown(event, entry) {
    if (event.key !== "Enter" && event.key !== " ") return;
    event.preventDefault();
    select(entry);
  }

  $effect(() => {
    const enabled = enabledEntries;
    const nextQuery = currentQuery;
    const queryChanged = nextQuery !== previousQuery;
    previousQuery = nextQuery;
    if (queryChanged || !enabled.some((entry) => entry.key === activeKey)) {
      activeKey = enabled[0]?.key;
    }
    revealActive();
  });

  export function focus(options) {
    inputElement?.focus(options);
  }

  export function clear() {
    setQuery("");
  }
</script>

<div
  {...rootProps}
  bind:this={rootElement}
  data-slot="command"
  data-state={entries.length ? "results" : "empty"}
  class={twMerge(
    "w-full overflow-hidden rounded-lg border border-gray-200 bg-white text-gray-950 shadow-lg dark:border-gray-700 dark:bg-gray-950 dark:text-white",
    className,
  )}
>
  <div
    data-slot="command-search"
    class="flex items-center border-b border-gray-200 px-4 dark:border-gray-800"
  >
    {@render prefix?.()}
    <!-- Autofocus is opt-in and appropriate when a Command opens as a palette. -->
    <!-- svelte-ignore a11y_autofocus -->
    <input
      bind:this={inputElement}
      id={inputId}
      type="text"
      role="combobox"
      aria-autocomplete="list"
      aria-expanded="true"
      aria-label={label}
      aria-controls={listId}
      aria-activedescendant={activeEntry?.optionId}
      autocomplete="off"
      {autofocus}
      {placeholder}
      value={currentQuery}
      data-slot="command-input"
      class="min-h-11 w-full border-0 bg-transparent px-0 py-3 text-base text-gray-950 outline-none placeholder:text-gray-500 focus-visible:-outline-offset-2 focus-visible:outline-2 focus-visible:outline-gray-950 dark:text-white dark:placeholder:text-gray-400 dark:focus-visible:outline-white"
      oninput={handleInput}
      onkeydown={handleKeydown}
    />
    {@render suffix?.()}
  </div>

  {@render before?.()}

  <div
    id={listId}
    role="listbox"
    aria-label={`${label} results`}
    data-slot="command-list"
    class="max-h-72 overflow-y-auto overscroll-contain p-1.5"
  >
    {#each commandGroups as group (group.headingId)}
      <div
        role="group"
        aria-labelledby={group.headingId}
        data-slot="command-group"
      >
        <div
          id={group.headingId}
          data-slot="command-group-heading"
          class="px-2 pb-1 pt-2 text-[11px] font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400"
        >
          {group.heading}
        </div>

        {#each group.entries as entry (entry.key)}
          <div
            id={entry.optionId}
            role="option"
            tabindex="-1"
            aria-selected={entry.key === activeKey}
            aria-disabled={entry.command.disabled || undefined}
            data-slot="command-item"
            data-command-key={entry.key}
            data-state={entry.key === activeKey ? "active" : "inactive"}
            data-highlighted={entry.key === activeKey ? "" : undefined}
            data-destructive={entry.command.destructive ? "" : undefined}
            class="flex min-h-11 cursor-pointer select-none items-center gap-3 rounded-md px-3 py-2 text-sm outline-none data-highlighted:bg-gray-100 data-highlighted:text-gray-950 aria-disabled:cursor-not-allowed aria-disabled:opacity-50 dark:data-highlighted:bg-gray-800 dark:data-highlighted:text-white"
            onmousedown={(event) => event.preventDefault()}
            onpointermove={(event) => handlePointermove(event, entry)}
            onkeydown={(event) => handleOptionKeydown(event, entry)}
            onclick={() => select(entry)}
          >
            {#if item}
              {@render item({
                command: entry.command,
                active: entry.key === activeKey,
              })}
            {:else}
              <span class="flex min-w-0 flex-1 flex-col">
                <span class="truncate">{entry.command.title}</span>
                {#if entry.command.subtitle}
                  <span
                    class="truncate text-xs text-gray-500 dark:text-gray-400"
                  >
                    {entry.command.subtitle}
                  </span>
                {/if}
              </span>
              {#if entry.command.shortcut}
                <kbd
                  aria-hidden="true"
                  class="ml-auto shrink-0 font-mono text-xs text-gray-500 dark:text-gray-400"
                >
                  {entry.command.shortcut}
                </kbd>
              {/if}
            {/if}
          </div>
        {/each}
      </div>
    {/each}
  </div>

  <div
    data-slot="command-empty"
    class={entries.length
      ? "sr-only"
      : "py-10 text-center text-sm text-gray-500 dark:text-gray-400"}
    role="status"
    aria-atomic="true"
  >
    {#if !entries.length}
      {#if empty}
        {@render empty({ query: currentQuery })}
      {:else}
        No matching command.
      {/if}
    {/if}
  </div>

  {@render footer?.()}
</div>
