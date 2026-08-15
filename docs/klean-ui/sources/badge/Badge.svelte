<script>
  import { twMerge } from "tailwind-merge";

  const BASE_CLASSES =
    "inline-flex items-center gap-1.5 rounded-full border border-transparent bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-700 text-nowrap forced-colors:border-current dark:bg-gray-800 dark:text-gray-300";

  let {
    children,
    class: className,
    "data-slot": _dataSlot,
    ...props
  } = $props();

  let element = $state();

  export function getElement() {
    return element;
  }
</script>

<span
  {...props}
  bind:this={element}
  data-slot="badge"
  class={twMerge(BASE_CLASSES, className)}
>
  {@render children?.()}
</span>
