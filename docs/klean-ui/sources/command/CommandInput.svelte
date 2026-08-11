<script>
  import { getContext } from "svelte";
  import { twMerge } from "tailwind-merge";
  import { COMMAND_CONTEXT } from "./context.js";

  let {
    placeholder = "Type a command or search…",
    class: className = "",
    oninput,
    onkeydown,
    ...inputProps
  } = $props();

  const command = getContext(COMMAND_CONTEXT);
  if (!command) throw new Error("CommandInput must be used inside Command.");
  let inputElement;

  function handleInput(event) {
    oninput?.(event);
    if (!event.defaultPrevented) command.setQuery(event.currentTarget.value);
  }

  function handleKeydown(event) {
    onkeydown?.(event);
    if (!event.defaultPrevented) command.handleKeydown(event);
  }

  $effect(() => command.setInput(inputElement));
</script>

<input
  {...inputProps}
  bind:this={inputElement}
  id={command.state.inputId}
  type="text"
  role="combobox"
  aria-autocomplete="list"
  aria-expanded="true"
  aria-controls={command.state.listId}
  aria-activedescendant={command.state.activeDescendant}
  autocomplete="off"
  data-slot="command-input"
  value={command.state.currentQuery}
  {placeholder}
  class={twMerge(
    "min-h-11 w-full border-0 border-b border-gray-200 bg-transparent px-4 py-3 text-base text-gray-950 outline-none placeholder:text-gray-500 focus-visible:-outline-offset-2 focus-visible:outline-2 focus-visible:outline-gray-950 dark:border-gray-800 dark:text-white dark:placeholder:text-gray-400 dark:focus-visible:outline-white",
    className,
  )}
  oninput={handleInput}
  onkeydown={handleKeydown}
/>
