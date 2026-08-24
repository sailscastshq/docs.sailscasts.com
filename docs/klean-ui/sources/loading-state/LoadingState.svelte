<script>
  import { twMerge } from "tailwind-merge";

  const BASE_CLASSES =
    "flex min-h-32 w-full flex-col items-center justify-center gap-3 p-6 text-center text-gray-600 dark:text-gray-300";

  let {
    children,
    class: className,
    role: _role,
    "aria-live": _ariaLive,
    "aria-atomic": _ariaAtomic,
    "data-slot": _dataSlot,
    ...rootProps
  } = $props();

  let element = $state();

  export function getElement() {
    return element;
  }
</script>

<div
  {...rootProps}
  bind:this={element}
  role="status"
  aria-live="polite"
  aria-atomic="true"
  data-slot="loading-state"
  class={twMerge(BASE_CLASSES, className)}
>
  {@render children?.()}
</div>
