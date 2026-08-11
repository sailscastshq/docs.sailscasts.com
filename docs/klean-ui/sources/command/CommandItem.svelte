<script>
  import { getContext, onMount } from "svelte";
  import { twMerge } from "tailwind-merge";
  import { COMMAND_CONTEXT, COMMAND_GROUP_CONTEXT } from "./context.js";

  const componentIdentity = $props.id();
  const generatedId = componentIdentity.replace(/[^a-zA-Z0-9_-]/g, "");
  let {
    value,
    keywords = [],
    disabled = false,
    id,
    class: className = "",
    onselect,
    onclick,
    onpointermove,
    onmousedown,
    children,
    ...itemProps
  } = $props();

  const command = getContext(COMMAND_CONTEXT);
  if (!command) throw new Error("CommandItem must be used inside Command.");
  const groupId = getContext(COMMAND_GROUP_CONTEXT);
  let itemId = $derived(id ?? `klean-command-item-${generatedId}`);
  let visible = $derived(command.state.visibleIds.has(itemId));
  let active = $derived(command.state.activeId === itemId);
  let previousValue;
  let previousKeywordKey;
  let previousDisabled;

  function select() {
    onselect?.(value);
  }

  function handleClick(event) {
    onclick?.(event);
    if (!event.defaultPrevented && !disabled) command.activate(itemId);
  }

  function handlePointermove(event) {
    onpointermove?.(event);
    if (!event.defaultPrevented && !disabled && event.pointerType !== "touch") {
      command.setActive(itemId);
    }
  }

  function handleMousedown(event) {
    onmousedown?.(event);
    if (!event.defaultPrevented) event.preventDefault();
  }

  onMount(() =>
    command.registerItem({
      id: itemId,
      value,
      keywords,
      disabled,
      groupId,
      select,
    }),
  );

  $effect(() => {
    const keywordKey = keywords.join("\u0000");
    if (
      value === previousValue &&
      keywordKey === previousKeywordKey &&
      disabled === previousDisabled
    ) {
      return;
    }

    previousValue = value;
    previousKeywordKey = keywordKey;
    previousDisabled = disabled;
    command.updateItem(itemId, {
      value,
      keywords,
      disabled,
      groupId,
      select,
    });
  });
</script>

<div
  {...itemProps}
  id={itemId}
  role="option"
  hidden={!visible}
  aria-selected={active}
  aria-disabled={disabled || undefined}
  data-slot="command-item"
  data-command-id={itemId}
  data-state={active ? "active" : "inactive"}
  data-highlighted={active ? "" : undefined}
  class={twMerge(
    "flex min-h-11 cursor-pointer select-none items-center gap-3 rounded-md px-3 py-2 text-sm outline-none data-highlighted:bg-gray-100 data-highlighted:text-gray-950 aria-disabled:cursor-not-allowed aria-disabled:opacity-50 dark:data-highlighted:bg-gray-800 dark:data-highlighted:text-white",
    className,
  )}
  onmousedown={handleMousedown}
  onpointermove={handlePointermove}
  onclick={handleClick}
>
  {@render children?.()}
</div>
