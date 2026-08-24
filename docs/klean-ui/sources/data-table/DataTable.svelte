<script>
  import { twMerge } from "tailwind-merge";
  import Table from "../table/Table.svelte";

  let {
    rows = [],
    rowKey = "id",
    selectable = () => true,
    busy = false,
    selected = $bindable([]),
    tableClass,
    class: className,
    children,
    "data-slot": _dataSlot,
    "data-busy": _dataBusy,
    "data-empty": _dataEmpty,
    ...props
  } = $props();

  let root = $state();

  function keyFor(row) {
    return typeof rowKey === "function" ? rowKey(row) : row?.[rowKey];
  }

  let selectableKeys = $derived(
    rows.filter((row) => selectable(row) !== false).map(keyFor),
  );
  let selectableKeySet = $derived(new Set(selectableKeys));
  let selectedKeySet = $derived(new Set(selected));
  let selectedCount = $derived(selectedKeySet.size);
  let allSelected = $derived(
    selectableKeys.length > 0 &&
      selectableKeys.every((key) => selectedKeySet.has(key)),
  );
  let someSelected = $derived(selectedCount > 0 && !allSelected);
  let status = $derived(
    selectedCount === 0
      ? "No rows selected."
      : `${selectedCount} row${selectedCount === 1 ? "" : "s"} selected.`,
  );

  function setSelected(next) {
    selected = [...new Set(next)];
  }

  function isSelected(row) {
    return selectedKeySet.has(keyFor(row));
  }

  function setRowSelected(row, checked) {
    if (busy || selectable(row) === false) return;
    const key = keyFor(row);
    const next = new Set(selected);
    if (checked) next.add(key);
    else next.delete(key);
    setSelected(next);
  }

  function setPageSelected(checked) {
    if (busy) return;
    setSelected(checked ? selectableKeys : []);
  }

  export function clearSelection() {
    setSelected([]);
  }

  export function removeSelection(keys) {
    const removed = new Set(Array.isArray(keys) ? keys : [keys]);
    setSelected(selected.filter((key) => !removed.has(key)));
  }

  export function getRoot() {
    return root;
  }

  function rowSelection(row, label) {
    const key = keyFor(row);
    return {
      checked: selectedKeySet.has(key),
      disabled: busy || selectable(row) === false,
      "aria-label": label || `Select row ${String(key)}`,
      onchange: (event) => setRowSelected(row, event.currentTarget.checked),
    };
  }

  function pageSelection(label = "Select all rows on this page") {
    return {
      checked: allSelected,
      indeterminate: someSelected,
      disabled: busy || selectableKeys.length === 0,
      "aria-label": label,
      onchange: (event) => setPageSelected(event.currentTarget.checked),
    };
  }

  let api = {
    get rows() {
      return rows;
    },
    get selected() {
      return selected;
    },
    get selectedCount() {
      return selectedCount;
    },
    get allSelected() {
      return allSelected;
    },
    get someSelected() {
      return someSelected;
    },
    isSelected,
    rowSelection,
    pageSelection,
    clearSelection,
    removeSelection,
  };

  $effect(() => {
    const next = selected.filter((key) => selectableKeySet.has(key));
    if (
      next.length !== selected.length ||
      next.some((key, index) => !Object.is(key, selected[index]))
    ) {
      setSelected(next);
    }
  });
</script>

<div
  {...props}
  bind:this={root}
  data-slot="data-table"
  data-busy={busy ? "" : undefined}
  data-empty={rows.length === 0 ? "" : undefined}
  class={twMerge("relative overflow-x-auto", className)}
>
  <Table
    aria-busy={busy ? "true" : undefined}
    class={twMerge("min-w-full", tableClass)}
  >
    {@render children?.(api)}
  </Table>
  <span class="sr-only" aria-live="polite" aria-atomic="true">{status}</span>
</div>
