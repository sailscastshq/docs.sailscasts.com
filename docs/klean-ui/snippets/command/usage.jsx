import { useState } from 'react'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandShortcut
} from '@/components/ui/command/Command.jsx'

const commands = [
  { value: 'Open projects', keywords: ['apps'], shortcut: 'G P' },
  {
    value: 'Open Lookout',
    keywords: ['metrics', 'monitoring'],
    shortcut: 'G L'
  },
  { value: 'Deploy application', keywords: ['ship', 'release'], shortcut: 'D' }
]

export default function ApplicationCommands() {
  const [query, setQuery] = useState('')

  function run(command) {
    // Route, open a nested step, or begin application work.
    console.log(command)
  }

  return (
    <Command query={query} onQueryChange={setQuery} onSelect={run}>
      <CommandInput aria-label="Application commands" />
      <CommandList aria-label="Available commands">
        <CommandEmpty>No matching command.</CommandEmpty>
        <CommandGroup heading="Commands">
          {commands.map((command) => (
            <CommandItem
              key={command.value}
              value={command.value}
              keywords={command.keywords}
            >
              <span>{command.value}</span>
              <CommandShortcut>{command.shortcut}</CommandShortcut>
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
    </Command>
  )
}
