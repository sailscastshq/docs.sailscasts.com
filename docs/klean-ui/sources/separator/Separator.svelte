<script>
  import { twMerge } from "tailwind-merge";

  const BASE_CLASSES =
    "shrink-0 border-0 bg-gray-200 forced-colors:bg-current dark:bg-gray-800";

  let {
    orientation = "horizontal",
    class: className,
    role: _role,
    "aria-orientation": _ariaOrientation,
    "data-orientation": _dataOrientation,
    "data-slot": _dataSlot,
    ...props
  } = $props();

  let element = $state();

  export function getElement() {
    return element;
  }
</script>

{#if orientation === "vertical"}
  <div
    {...props}
    bind:this={element}
    data-slot="separator"
    data-orientation="vertical"
    role="separator"
    aria-orientation="vertical"
    class={twMerge(BASE_CLASSES, "w-px self-stretch", className)}
  ></div>
{:else}
  <hr
    {...props}
    bind:this={element}
    data-slot="separator"
    data-orientation="horizontal"
    class={twMerge(BASE_CLASSES, "h-px w-full", className)}
  />
{/if}
