<script>
  import { untrack } from "svelte";
  import { twMerge } from "tailwind-merge";
  import { filtersEqual, stableFilters } from "./filterState.js";

  let {
    value = $bindable(),
    defaultValue = {},
    label = "Filters",
    busy = false,
    class: className = "",
    children,
    onchange,
    onapply,
    oncancel,
    onclear,
    onremove,
    onsubmit,
    onreset,
    "data-slot": _dataSlot,
    "data-dirty": _dataDirty,
    "data-empty": _dataEmpty,
    ...formProps
  } = $props();

  function clone(source) {
    return JSON.parse(JSON.stringify(source ?? {}));
  }

  let formElement;
  let internalValue = $state(clone(untrack(() => defaultValue)));
  let committed = $derived(value !== undefined ? value : internalValue);
  let committedSignature = $derived(stableFilters(committed));
  let draft = $state(clone(untrack(() => committed)));
  let entries = $derived(Object.entries(committed ?? {}));
  let count = $derived(entries.length);
  let dirty = $derived(!filtersEqual(draft, committed));
  let previousSignature = untrack(() => committedSignature);

  $effect(() => {
    const signature = committedSignature;
    if (signature !== previousSignature) {
      draft = clone(committed);
      previousSignature = signature;
    }
  });

  function setDraft(next) {
    draft = clone(typeof next === "function" ? next(clone(draft)) : next);
  }

  function update(key, nextValue) {
    draft = { ...draft, [key]: nextValue };
  }

  function commit(next, callback) {
    if (busy) return;
    const committedNext = clone(next);
    if (value === undefined) internalValue = committedNext;
    else value = committedNext;
    draft = clone(committedNext);
    onchange?.(clone(committedNext));
    callback?.(clone(committedNext));
  }

  function apply() {
    if (!dirty) return;
    commit(draft, onapply);
  }

  function cancel() {
    const next = clone(committed);
    draft = next;
    oncancel?.(clone(next));
  }

  function clear() {
    if (!count) return;
    commit({}, onclear);
  }

  function focusAfterRemoval(index) {
    setTimeout(() => {
      const buttons = [
        ...(formElement?.querySelectorAll?.("[data-filter-remove]") ?? []),
      ];
      const next = buttons[Math.min(index, buttons.length - 1)];
      (
        next ??
        formElement?.querySelector?.(
          "[data-filter-clear], [data-filter-trigger]",
        )
      )?.focus?.();
    });
  }

  function remove(key, event) {
    if (busy || !(key in (committed ?? {}))) return;
    const buttons = [
      ...(formElement?.querySelectorAll?.("[data-filter-remove]") ?? []),
    ];
    const index = Math.max(0, buttons.indexOf(event?.currentTarget));
    const next = clone(committed);
    delete next[key];
    commit(next, (filters) => onremove?.(filters, key));
    focusAfterRemoval(index);
  }

  function handleSubmit(event) {
    onsubmit?.(event);
    if (!event.defaultPrevented) {
      event.preventDefault();
      apply();
    }
  }

  function handleReset(event) {
    onreset?.(event);
    if (!event.defaultPrevented) {
      event.preventDefault();
      cancel();
    }
  }

  function removeProps(key, removeLabel) {
    return {
      type: "button",
      disabled: busy,
      "aria-label": removeLabel ?? `Remove ${key} filter`,
      "data-filter-remove": "",
      "data-filter-key": key,
      onclick: (event) => remove(key, event),
    };
  }

  let state = $derived({
    draft,
    setDraft,
    entries,
    count,
    dirty,
    busy,
    update,
    apply,
    cancel,
    clear,
    remove,
    removeProps,
    applyProps: { type: "submit", disabled: busy || !dirty },
    cancelProps: { type: "reset", disabled: busy || !dirty },
    clearProps: {
      type: "button",
      disabled: busy || count === 0,
      "data-filter-clear": "",
      onclick: clear,
    },
  });
</script>

<form
  {...formProps}
  bind:this={formElement}
  role="search"
  aria-label={label}
  aria-busy={busy ? "true" : undefined}
  data-slot="filter-bar"
  data-dirty={dirty ? "" : undefined}
  data-empty={count === 0 ? "" : undefined}
  class={twMerge("flex flex-wrap items-center gap-2", className)}
  onsubmit={handleSubmit}
  onreset={handleReset}
>
  {@render children?.(state)}
  <span class="sr-only" aria-live="polite" aria-atomic="true">
    {count} active {count === 1 ? "filter" : "filters"}.
  </span>
</form>
