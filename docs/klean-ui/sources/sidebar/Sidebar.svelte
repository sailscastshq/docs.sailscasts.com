<script>
  import { onMount } from "svelte";
  import { twMerge } from "tailwind-merge";

  let {
    id = "app-sidebar",
    open = $bindable(),
    defaultOpen = true,
    remember = true,
    onopenchange,
    class: className,
    children,
    "data-slot": _dataSlot,
    "data-state": _dataState,
    "data-restored": _dataRestored,
    "aria-hidden": _ariaHidden,
    inert: _inert,
    ...props
  } = $props();

  function initialVisibility() {
    return defaultOpen;
  }

  let root = $state();
  const controlled = open !== undefined;
  let internalOpen = $state(initialVisibility());
  let restored = $state(false);
  let visible = $derived(open === undefined ? internalOpen : open);
  let storageKey = $derived(`klean:sidebar:${id}:open`);

  function rememberVisibility(next) {
    if (!remember || typeof window === "undefined") return;
    try {
      window.localStorage.setItem(storageKey, String(next));
    } catch {
      // Visibility still works when persistence is unavailable.
    }
  }

  function setOpen(next, notify = true) {
    const normalized = Boolean(next);
    internalOpen = normalized;
    open = normalized;
    if (notify) onopenchange?.(normalized);
    rememberVisibility(normalized);
  }

  export function show() {
    setOpen(true);
  }

  export function hide() {
    setOpen(false);
  }

  export function toggle() {
    setOpen(!visible);
  }

  export function getRoot() {
    return root;
  }

  onMount(() => {
    if (open === undefined && remember) {
      try {
        const value = window.localStorage.getItem(storageKey);
        const next =
          value === "true" ? true : value === "false" ? false : defaultOpen;
        internalOpen = next;
        open = next;
        onopenchange?.(next);
      } catch {
        // The supplied default remains authoritative without storage.
        onopenchange?.(defaultOpen);
      }
    } else if (open !== undefined) {
      rememberVisibility(open);
    }

    restored = true;

    function handleStorage(event) {
      if (
        !remember ||
        event.storageArea !== window.localStorage ||
        event.key !== storageKey
      ) {
        return;
      }
      if (event.newValue === "true") {
        if (!controlled) internalOpen = true;
        open = true;
        onopenchange?.(true);
      }
      if (event.newValue === "false") {
        if (!controlled) internalOpen = false;
        open = false;
        onopenchange?.(false);
      }
    }

    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  });

  $effect(() => {
    if (restored) rememberVisibility(visible);
  });

  let api = {
    get open() {
      return visible;
    },
    show,
    hide,
    toggle,
  };
</script>

<aside
  {...props}
  bind:this={root}
  {id}
  data-slot="sidebar"
  data-state={visible ? "open" : "closed"}
  data-restored={restored ? "true" : "false"}
  aria-hidden={visible ? undefined : "true"}
  inert={visible ? undefined : ""}
  class={twMerge(
    "min-w-0 shrink-0 overflow-hidden transition-[width,opacity] duration-200 ease-out motion-reduce:transition-none",
    className,
  )}
>
  {@render children?.(api)}
</aside>
