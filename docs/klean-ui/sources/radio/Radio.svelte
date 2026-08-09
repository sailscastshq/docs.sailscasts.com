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
    group = $bindable(),
    value = "on",
    disabled = false,
    class: className,
    type: _type,
    checked: _checked,
    "data-slot": _dataSlot,
    "data-state": _dataState,
    "data-disabled": _dataDisabled,
    "data-invalid": _dataInvalid,
    ...props
  } = $props();

  let element = $state();
  let initialChecked;
  let state = $derived(Object.is(group, value) ? "checked" : "unchecked");
  let invalid = $derived(
    props["aria-invalid"] === true || props["aria-invalid"] === "true",
  );

  function groupHasCheckedRadio(node) {
    const root = node.form ?? node.getRootNode();
    const controls =
      node.form?.elements ??
      root?.querySelectorAll?.('input[type="radio"]') ??
      [];

    return Array.from(controls).some(
      (control) =>
        control.type === "radio" &&
        control.name === node.name &&
        control.form === node.form &&
        control.checked,
    );
  }

  $effect(() => {
    const node = element;
    if (!node) return;

    if (initialChecked === undefined) {
      initialChecked = Object.is(group, value);
      node.defaultChecked = initialChecked;
    }

    function handleReset() {
      queueMicrotask(() => {
        if (node.checked) group = value;
        else if (!groupHasCheckedRadio(node)) group = undefined;
      });
    }

    node.form?.addEventListener("reset", handleReset);
    return () => node.form?.removeEventListener("reset", handleReset);
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
  bind:group
  type="radio"
  {value}
  {disabled}
  data-slot="radio"
  data-state={state}
  data-disabled={disabled ? "" : undefined}
  data-invalid={invalid ? "" : undefined}
  class={twMerge(BASE_CLASSES, className)}
/>
