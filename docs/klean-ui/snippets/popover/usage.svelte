<script>
  import Button from '$lib/components/ui/button/Button.svelte'
  import Popover from '$lib/components/ui/popover/Popover.svelte'
</script>

{#snippet content({ close })}
  <section aria-labelledby="filters-title">
    <h2 id="filters-title" class="font-semibold">Visible records</h2>
    <p class="mt-1 text-sm leading-6 text-gray-600">
      Choose which records appear in this view.
    </p>
    <Button onclick={close} class="mt-5 w-full">Done</Button>
  </section>
{/snippet}

<Button popovertarget="filters">Filters</Button>
<Popover id="filters" class="w-72" children={content} />
