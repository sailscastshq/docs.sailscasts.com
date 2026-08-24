<script>
  import { twMerge } from "tailwind-merge";
  import Menu from "../menu/Menu.svelte";

  const componentIdentity = $props.id();
  const generatedId = componentIdentity.replace(/[^a-zA-Z0-9_-]/g, "");
  let {
    label = "Actions",
    busy = false,
    id,
    placement = "bottom-end",
    offset = 4,
    class: className = "",
    children,
    menu,
    trigger,
    onclick,
    onpointerdown,
    "data-slot": _dataSlot,
    ...rootProps
  } = $props();

  let open = $state(false);
  let menuId = $derived(id ?? `klean-row-actions-${generatedId}`);

  $effect(() => {
    if (busy) open = false;
  });

  function handleClick(event) {
    event.stopPropagation();
    onclick?.(event);
  }

  function handlePointerDown(event) {
    event.stopPropagation();
    onpointerdown?.(event);
  }
</script>

{#snippet menuContent(context)}
  {@render menu?.(context)}
{/snippet}

<div
  {...rootProps}
  role="group"
  aria-label={label}
  aria-busy={busy || undefined}
  data-slot="row-actions"
  class={twMerge("inline-flex items-center gap-1", className)}
  onclick={handleClick}
  onpointerdown={handlePointerDown}
>
  {@render children?.()}

  {#if menu}
    <button
      type="button"
      disabled={busy}
      aria-label={label}
      aria-controls={menuId}
      aria-expanded={open}
      popovertarget={menuId}
      data-slot="row-actions-trigger"
      class="inline-grid size-9 cursor-pointer place-items-center rounded-md text-current hover:bg-black/5 focus-visible:outline-2 focus-visible:outline-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:hover:bg-white/10"
    >
      {#if trigger}
        {@render trigger()}
      {:else}
        <svg
          class="size-4"
          viewBox="0 0 20 20"
          fill="currentColor"
          aria-hidden="true"
        >
          <path
            d="M6 10a2 2 0 1 1-4 0 2 2 0 0 1 4 0Zm6 0a2 2 0 1 1-4 0 2 2 0 0 1 4 0Zm6 0a2 2 0 1 1-4 0 2 2 0 0 1 4 0Z"
          />
        </svg>
      {/if}
    </button>
    <Menu
      id={menuId}
      bind:open
      aria-label={label}
      {placement}
      {offset}
      data-row-actions-menu=""
      class="min-w-40"
      children={menuContent}
    />
  {/if}
</div>
