<script>
  import { twMerge } from "tailwind-merge";

  let {
    as = "div",
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

<svelte:element
  this={as}
  {...props}
  bind:this={element}
  data-slot="alert"
  class={twMerge(
    "relative w-full rounded-md bg-gray-100 p-4 text-sm text-gray-950 dark:bg-gray-900 dark:text-white",
    className,
  )}
>
  {#if children}
    {@render children()}
  {/if}
</svelte:element>
