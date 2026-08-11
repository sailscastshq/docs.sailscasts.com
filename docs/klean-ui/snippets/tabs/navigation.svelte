<script>
  import Tabs from '$lib/components/ui/tabs/Tabs.svelte'

  let { current } = $props()
  const sections = [
    { value: 'profile', label: 'Profile', href: '/settings/profile' },
    { value: 'billing', label: 'Billing', href: '/settings/billing' },
    { value: 'schedule', label: 'Schedule', href: '/settings/schedule' }
  ]
</script>

<Tabs
  as="nav"
  value={current}
  orientation="vertical"
  aria-label="Account settings"
  class="flex flex-col gap-1"
>
  {#each sections as section (section.value)}
    <a
      href={section.href}
      data-value={section.value}
      data-sveltekit-preload-data="hover"
      class="block min-h-11 cursor-pointer rounded-lg px-3 py-2 text-sm font-medium text-black/60 no-underline outline-none hover:bg-black/5 hover:text-black focus-visible:ring-2 focus-visible:ring-black data-[state=active]:bg-black data-[state=active]:text-white"
    >
      {section.label}
    </a>
  {/each}
</Tabs>
