import { useState } from 'react'
import Command from '@/components/ui/command/Command'

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

export default function ApplicationCommands() {
  const [query, setQuery] = useState('')

  function run(command) {
    if (command.href) window.location.assign(command.href)
    else command.action?.()
  }

  return (
    <Command
      query={query}
      commands={commands}
      label="Application commands"
      onQueryChange={setQuery}
      onSelect={run}
    />
  )
}
