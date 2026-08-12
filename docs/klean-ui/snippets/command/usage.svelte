<script>
  import Command from '$lib/components/ui/command/Command.svelte'

  let query = $state('')
  const commands = [
    {
      id: 'projects',
      title: 'Open projects',
      subtitle: 'View every application and service',
      keywords: ['apps'],
      group: 'Navigation',
      shortcut: 'G P',
      href: '/projects'
    },
    {
      id: 'deploy',
      title: 'Deploy application',
      keywords: ['ship', 'release'],
      group: 'Actions',
      shortcut: 'D',
      action: () => console.log('Choose an application')
    }
  ]

  function run(command) {
    if (command.href) window.location.assign(command.href)
    else command.action?.()
  }
</script>

<Command bind:query {commands} label="Application commands" onselect={run} />
