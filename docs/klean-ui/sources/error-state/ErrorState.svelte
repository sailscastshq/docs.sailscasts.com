<script>
  import { twMerge } from "tailwind-merge";

  const BASE_CLASSES =
    "flex min-h-48 w-full flex-col items-center justify-center gap-4 p-6 text-center text-gray-950 dark:text-white";

  let {
    as = "div",
    children,
    class: className,
    "data-slot": _dataSlot,
    ...rootProps
  } = $props();

  let element = $state();

  export function getElement() {
    return element;
  }
</script>

{#if typeof as === "string"}
  <svelte:element
    this={as}
    {...rootProps}
    bind:this={element}
    data-slot="error-state"
    class={twMerge(BASE_CLASSES, className)}
  >
    {@render children?.()}
  </svelte:element>
{:else}
  {@const Component = as}
  <Component
    {...rootProps}
    bind:this={element}
    data-slot="error-state"
    class={twMerge(BASE_CLASSES, className)}
  >
    {@render children?.()}
  </Component>
{/if}
