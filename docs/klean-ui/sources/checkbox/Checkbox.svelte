<script>
  import { twMerge } from "tailwind-merge";

  const BASE_CLASSES = [
    "size-4 shrink-0 cursor-pointer appearance-auto accent-current text-gray-950 outline-none",
    "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-950",
    "disabled:cursor-not-allowed disabled:opacity-50",
    "aria-invalid:focus-visible:outline-red-600",
    "dark:text-white dark:focus-visible:outline-white dark:aria-invalid:focus-visible:outline-red-500",
  ];

  let {
    checked = $bindable(false),
    indeterminate = false,
    disabled = false,
    "aria-invalid": ariaInvalid,
    class: className,
    "data-slot": _dataSlot,
    "data-state": _dataState,
    "data-disabled": _dataDisabled,
    "data-invalid": _dataInvalid,
    ...props
  } = $props();

  let element = $state();
  let state = $derived(
    indeterminate ? "indeterminate" : checked ? "checked" : "unchecked",
  );
  let invalid = $derived(ariaInvalid === true || ariaInvalid === "true");

  $effect(() => {
    if (element) element.indeterminate = Boolean(indeterminate);
  });

  $effect(() => {
    const node = element;
    if (!node) return;

    node.defaultChecked = node.checked;
    const form = node.form;
    if (!form) return;

    function handleReset() {
      queueMicrotask(() => {
        checked = node.checked;
      });
    }

    form.addEventListener("reset", handleReset);
    return () => form.removeEventListener("reset", handleReset);
  });

  export function getElement() {
    return element;
  }

  export function focus(options) {
    element?.focus(options);
  }
</script>

<input
  {...props}
  bind:this={element}
  bind:checked
  type="checkbox"
  {disabled}
  aria-invalid={ariaInvalid}
  data-slot="checkbox"
  data-state={state}
  data-disabled={disabled ? "" : undefined}
  data-invalid={invalid ? "" : undefined}
  class={twMerge(BASE_CLASSES, className)}
/>
