<script>
  import { setContext, untrack } from "svelte";
  import { twMerge } from "tailwind-merge";
  import { COMMAND_CONTEXT, defaultCommandFilter } from "./context.js";

  const componentIdentity = $props.id();
  const generatedId = componentIdentity.replace(/[^a-zA-Z0-9_-]/g, "");
  let {
    query = $bindable(),
    defaultQuery = "",
    filter = defaultCommandFilter,
    id,
    class: className = "",
    onquerychange,
    onselect,
    onescape,
    onback,
    onkeydown,
    children,
    ...rootProps
  } = $props();

  let rootElement;
  let inputElement;
  let internalQuery = $state(untrack(() => defaultQuery));
  let items = $state([]);
  let activeId = $state();
  let currentQuery = $derived(query !== undefined ? query : internalQuery);
  let controlId = $derived(id ?? `klean-command-${generatedId}`);
  let inputId = $derived(`${controlId}-input`);
  let listId = $derived(`${controlId}-list`);
  let visibleEntries = $derived.by(() =>
    items.filter((item) => {
      const result = filter(item.value, currentQuery, item.keywords);
      return typeof result === "number" ? result > 0 : Boolean(result);
    }),
  );
  let visibleIds = $derived(new Set(visibleEntries.map((item) => item.id)));
  let enabledEntries = $derived(
    visibleEntries.filter((item) => !item.disabled),
  );
  let activeDescendant = $derived(
    enabledEntries.some((item) => item.id === activeId) ? activeId : undefined,
  );
  let state = $state({
    currentQuery: "",
    inputId: "",
    listId: "",
    activeId: undefined,
    activeDescendant: undefined,
    visibleEntries: [],
    visibleIds: new Set(),
  });
  let previousQuery = untrack(() => currentQuery);

  function setQuery(nextQuery) {
    internalQuery = nextQuery;
    query = nextQuery;
    onquerychange?.(nextQuery);
  }

  function registerItem(item) {
    items = [...untrack(() => items), item];
    return () => {
      items = untrack(() => items).filter(
        (candidate) => candidate.id !== item.id,
      );
    };
  }

  function updateItem(itemId, item) {
    items = untrack(() => items).map((candidate) =>
      candidate.id === itemId ? { ...candidate, ...item } : candidate,
    );
  }

  function revealActive(itemId = activeId) {
    if (!itemId) return;
    queueMicrotask(() => {
      rootElement
        ?.querySelector?.(`[data-command-id="${itemId}"]`)
        ?.scrollIntoView?.({ block: "nearest" });
    });
  }

  function setActive(itemId) {
    if (!enabledEntries.some((item) => item.id === itemId)) return;
    activeId = itemId;
  }

  function move(step) {
    if (!enabledEntries.length) return;
    const current = enabledEntries.findIndex((item) => item.id === activeId);
    const next =
      current < 0
        ? step > 0
          ? 0
          : enabledEntries.length - 1
        : (current + step + enabledEntries.length) % enabledEntries.length;
    activeId = enabledEntries[next].id;
    revealActive();
  }

  function moveTo(edge) {
    if (!enabledEntries.length) return;
    activeId =
      edge === "last" ? enabledEntries.at(-1).id : enabledEntries[0].id;
    revealActive();
  }

  function activate(itemId = activeId) {
    const item = enabledEntries.find((candidate) => candidate.id === itemId);
    if (!item) return;
    item.select();
    onselect?.(item.value);
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
      event.preventDefault();
      activate();
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

  function groupHasVisibleItems(groupId) {
    return visibleEntries.some((item) => item.groupId === groupId);
  }

  $effect(() => {
    enabledEntries;
    if (!enabledEntries.some((item) => item.id === activeId)) {
      activeId = enabledEntries[0]?.id;
    }
    revealActive();
  });

  $effect(() => {
    const nextQuery = currentQuery;
    if (nextQuery === previousQuery) return;
    previousQuery = nextQuery;
    activeId = enabledEntries[0]?.id;
    revealActive(activeId);
  });

  $effect(() => {
    state.currentQuery = currentQuery;
    state.inputId = inputId;
    state.listId = listId;
    state.activeId = activeId;
    state.activeDescendant = activeDescendant;
    state.visibleEntries = visibleEntries;
    state.visibleIds = visibleIds;
  });

  setContext(COMMAND_CONTEXT, {
    state,
    setInput(element) {
      inputElement = element;
    },
    registerItem,
    updateItem,
    setActive,
    activate,
    setQuery,
    handleKeydown,
    groupHasVisibleItems,
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
  data-state={visibleEntries.length ? "results" : "empty"}
  class={twMerge(
    "w-full overflow-hidden rounded-lg border border-gray-200 bg-white text-gray-950 shadow-lg dark:border-gray-700 dark:bg-gray-950 dark:text-white",
    className,
  )}
>
  {@render children?.()}
</div>
