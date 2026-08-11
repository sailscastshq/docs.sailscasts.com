<script>
  import { getContext, setContext } from "svelte";
  import { twMerge } from "tailwind-merge";
  import { COMMAND_CONTEXT, COMMAND_GROUP_CONTEXT } from "./context.js";

  const componentIdentity = $props.id();
  const generatedId = componentIdentity.replace(/[^a-zA-Z0-9_-]/g, "");
  let { heading, class: className = "", children, ...groupProps } = $props();
  const command = getContext(COMMAND_CONTEXT);
  if (!command) throw new Error("CommandGroup must be used inside Command.");
  const groupId = `klean-command-group-${generatedId}`;
  const labelId = `${groupId}-label`;
  let visible = $derived(
    command.state.visibleEntries.some((item) => item.groupId === groupId),
  );
  setContext(COMMAND_GROUP_CONTEXT, groupId);
</script>

<div
  {...groupProps}
  role="group"
  aria-labelledby={labelId}
  hidden={!visible}
  data-slot="command-group"
  class={twMerge("py-1", className)}
>
  <div
    id={labelId}
    data-slot="command-group-heading"
    class="px-3 py-2 text-xs font-medium uppercase tracking-[0.12em] text-gray-500 dark:text-gray-400"
  >
    {heading}
  </div>
  {@render children?.()}
</div>
