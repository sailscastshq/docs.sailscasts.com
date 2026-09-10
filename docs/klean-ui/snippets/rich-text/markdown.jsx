import { useState } from 'react'
import RichText from '@/components/ui/rich-text/RichText.jsx'

export default function TalkOutline() {
  const [outline, setOutline] = useState(
    '## What we will build\n\n- A working feature\n- A recovery path\n- Tests for the edge cases\n'
  )

  return (
    <>
      <label htmlFor="talk-outline">Talk outline</label>
      <RichText
        id="talk-outline"
        value={outline}
        onValueChange={setOutline}
        format="markdown"
        name="outline"
      />
    </>
  )
}
