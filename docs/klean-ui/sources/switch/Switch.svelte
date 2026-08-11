<script>
  import { twMerge } from "tailwind-merge";

  const BASE_CLASSES = [
    "relative inline-flex h-6 w-11 shrink-0 cursor-pointer appearance-none rounded-full border-0 bg-gray-300 p-0 outline-none transition-colors duration-200 ease-[cubic-bezier(0.32,0.72,0,1)] after:pointer-events-none after:absolute after:left-0.5 after:top-1/2 after:block after:size-5 after:rounded-full after:bg-white after:transform-[translate(0,-50%)] after:[transition-property:transform] after:duration-200 after:ease-[cubic-bezier(0.32,0.72,0,1)] after:content-['']",
    "checked:bg-gray-950 checked:after:transform-[translate(1.25rem,-50%)]",
    "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-950",
    "disabled:cursor-not-allowed disabled:opacity-50",
    "aria-invalid:outline-2 aria-invalid:outline-offset-2 aria-invalid:outline-red-600 aria-invalid:focus-visible:outline-red-600",
    "motion-reduce:duration-100 motion-reduce:ease-out motion-reduce:after:duration-100 motion-reduce:after:ease-out",
    "dark:bg-gray-700 dark:checked:bg-white dark:checked:after:bg-gray-950 dark:focus-visible:outline-white dark:aria-invalid:outline-red-500",
    "forced-colors:border forced-colors:border-[CanvasText] forced-colors:bg-[Canvas] forced-colors:checked:bg-[Highlight] forced-colors:after:bg-[CanvasText] forced-colors:checked:after:bg-[HighlightText]",
  ];

  let {
    checked = $bindable(false),
    disabled = false,
    "aria-invalid": ariaInvalid,
    "aria-checked": _ariaChecked,
    class: className,
    role: _role,
    type: _type,
    "data-slot": _dataSlot,
    "data-state": _dataState,
    "data-disabled": _dataDisabled,
    "data-invalid": _dataInvalid,
    ...props
  } = $props();

  let element = $state();
  const initialChecked = Boolean(checked);
  let state = $derived(Boolean(checked) ? "checked" : "unchecked");
  let invalid = $derived(ariaInvalid === true || ariaInvalid === "true");

  $effect(() => {
    const node = element;
    if (!node) return;

    node.defaultChecked = initialChecked;
    const form = node.form;
    if (!form) return;

    function handleReset() {
      queueMicrotask(() => {
        checked = Boolean(node.checked);
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
  role="switch"
  {disabled}
  aria-invalid={ariaInvalid}
  data-slot="switch"
  data-state={state}
  data-disabled={disabled ? "" : undefined}
  data-invalid={invalid ? "" : undefined}
  class={twMerge(BASE_CLASSES, className)}
/>
