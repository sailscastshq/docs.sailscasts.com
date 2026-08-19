import { useState } from 'react'
import TagsInput from '@/components/ui/tags-input/TagsInput.jsx'

export default function ExpenseTags() {
  const [tags, setTags] = useState(['billing', 'invoice'])
  const [draft, setDraft] = useState('')

  return (
    <div className="grid gap-2">
      <label htmlFor="expense-tags" className="text-sm font-medium">
        Tags
      </label>
      <TagsInput
        id="expense-tags"
        value={tags}
        onChange={setTags}
        draft={draft}
        onDraftChange={setDraft}
        name="tags"
        aria-describedby="expense-tags-help"
      />
      <p id="expense-tags-help" className="text-sm text-gray-500">
        Press Enter or comma to add. Paste a comma-separated list.
      </p>
    </div>
  )
}
