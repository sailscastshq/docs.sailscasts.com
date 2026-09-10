import { useState } from 'react'
import RichText from '@/components/ui/rich-text/RichText.jsx'

export default function TalkAbstract() {
  const [abstract, setAbstract] = useState(
    '<p>A practical look at building resilient web applications, with the decisions and trade-offs behind a working demo.</p>'
  )

  return (
    <div className="grid gap-2">
      <label htmlFor="proposal-abstract" className="text-sm font-medium">
        Talk abstract
      </label>
      <RichText
        id="proposal-abstract"
        value={abstract}
        onValueChange={setAbstract}
        name="abstract"
        required
        aria-describedby="proposal-abstract-help"
        placeholder="The problem, your approach, and why it matters."
      />
      <p id="proposal-abstract-help" className="text-sm text-gray-600">
        Explain what attendees will learn. Use headings, lists, and links where
        they help.
      </p>
    </div>
  )
}
