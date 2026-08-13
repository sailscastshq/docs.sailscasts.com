<script>
  import { twMerge } from "tailwind-merge";

  let {
    children,
    class: className,
    "data-slot": _dataSlot,
    ...props
  } = $props();

  let element;

  export function getElement() {
    return element;
  }
</script>

<table
  {...props}
  bind:this={element}
  data-slot="table"
  class={twMerge(
    "w-full border-collapse text-left text-sm text-gray-950 dark:text-white",
    className,
  )}
>
  {@render children?.()}
</table>
