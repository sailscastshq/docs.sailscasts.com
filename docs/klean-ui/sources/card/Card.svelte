<script>
  import { twMerge } from "tailwind-merge";

  const BASE_CLASSES =
    "rounded-lg border border-gray-200 bg-white p-5 text-gray-950 dark:border-gray-800 dark:bg-gray-950 dark:text-white";

  let {
    as = "div",
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

{#if typeof as === "string"}
  <svelte:element
    this={as}
    {...props}
    bind:this={element}
    data-slot="card"
    class={twMerge(BASE_CLASSES, className)}
  >
    {@render children?.()}
  </svelte:element>
{:else}
  {@const Component = as}
  <Component
    {...props}
    bind:this={element}
    data-slot="card"
    class={twMerge(BASE_CLASSES, className)}
  >
    {@render children?.()}
  </Component>
{/if}
