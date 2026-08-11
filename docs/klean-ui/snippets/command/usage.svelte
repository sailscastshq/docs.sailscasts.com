<script>
  import Command from '$lib/components/ui/command/Command.svelte'
  import CommandEmpty from '$lib/components/ui/command/CommandEmpty.svelte'
  import CommandGroup from '$lib/components/ui/command/CommandGroup.svelte'
  import CommandInput from '$lib/components/ui/command/CommandInput.svelte'
  import CommandItem from '$lib/components/ui/command/CommandItem.svelte'
  import CommandList from '$lib/components/ui/command/CommandList.svelte'
  import CommandShortcut from '$lib/components/ui/command/CommandShortcut.svelte'

  let query = $state('')
  const commands = [
    { value: 'Open projects', keywords: ['apps'], shortcut: 'G P' },
    {
      value: 'Open Lookout',
      keywords: ['metrics', 'monitoring'],
      shortcut: 'G L'
    },
    {
      value: 'Deploy application',
      keywords: ['ship', 'release'],
      shortcut: 'D'
    }
  ]

  function run(command) {
    // Route, open a nested step, or begin application work.
    console.log(command)
  }
</script>

<Command bind:query onselect={run}>
  <CommandInput aria-label="Application commands" />
  <CommandList aria-label="Available commands">
    <CommandEmpty>No matching command.</CommandEmpty>
    <CommandGroup heading="Commands">
      {#each commands as command (command.value)}
        <CommandItem value={command.value} keywords={command.keywords}>
          <span>{command.value}</span>
          <CommandShortcut>{command.shortcut}</CommandShortcut>
        </CommandItem>
      {/each}
    </CommandGroup>
  </CommandList>
</Command>
