<script>
  import { getContext } from "svelte";
  import { twMerge } from "tailwind-merge";
  import { COMMAND_CONTEXT } from "./context.js";

  let { class: className = "", children, ...listProps } = $props();
  const command = getContext(COMMAND_CONTEXT);
  if (!command) throw new Error("CommandList must be used inside Command.");
</script>

<div
  {...listProps}
  id={command.state.listId}
  role="listbox"
  data-slot="command-list"
  class={twMerge(
    "max-h-[min(22rem,60dvh)] overflow-y-auto overscroll-contain p-1",
    className,
  )}
>
  {@render children?.()}
</div>
