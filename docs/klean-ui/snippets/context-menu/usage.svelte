<script>
  import ContextMenu from '$lib/components/ui/context-menu/ContextMenu.svelte'
  let actions = $state()
</script>

<div id="project" tabindex="0" class="rounded-lg border p-8 focus:ring-2">
  Northstar project
</div>
<button type="button" onclick={(event) => actions.show(event.currentTarget)}
  >Actions</button
>
<ContextMenu
  bind:this={actions}
  target="project"
  aria-label="Project actions"
  class="w-52"
>
  <button
    type="button"
    class="block w-full px-3 py-2 text-left focus:bg-gray-100 dark:focus:bg-gray-800"
    >Rename</button
  >
  <a
    href="/projects/42"
    class="block px-3 py-2 focus:bg-gray-100 dark:focus:bg-gray-800"
    >Open project</a
  >
</ContextMenu>
