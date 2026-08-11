<script>
  import { getContext } from "svelte";
  import { twMerge } from "tailwind-merge";
  import { COMMAND_CONTEXT } from "./context.js";

  let {
    text = "No commands found.",
    class: className = "",
    children,
    ...emptyProps
  } = $props();
  const command = getContext(COMMAND_CONTEXT);
  if (!command) throw new Error("CommandEmpty must be used inside Command.");
</script>

{#if command.state.visibleEntries.length === 0}
  <div
    {...emptyProps}
    role="status"
    data-slot="command-empty"
    class={twMerge(
      "px-4 py-8 text-center text-sm text-gray-500 dark:text-gray-400",
      className,
    )}
  >
    {#if children}{@render children()}{:else}{text}{/if}
  </div>
{/if}
