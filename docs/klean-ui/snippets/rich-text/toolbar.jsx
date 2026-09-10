import { useState } from 'react'
import RichText from '@/components/ui/rich-text/RichText.jsx'

export default function ReviewNote() {
  const [note, setNote] = useState('<p>A short note for the review team.</p>')

  return (
    <>
      <label htmlFor="review-note">Review note</label>
      <RichText
        id="review-note"
        value={note}
        onValueChange={setNote}
        renderToolbar={({ editor, mode, setMode, openLink }) => (
          <div
            role="group"
            className="flex flex-wrap items-center gap-1 border-b border-gray-200 p-2 *:min-h-9 *:rounded *:px-3"
            aria-label="Text formatting"
          >
            <button
              type="button"
              disabled={!editor?.isEditable || mode !== 'visual'}
              aria-pressed={editor?.isActive('bold') || false}
              onClick={() => editor?.chain().focus().toggleBold().run()}
            >
              Bold
            </button>
            <button
              type="button"
              disabled={!editor?.isEditable || mode !== 'visual'}
              onClick={openLink}
            >
              Link
            </button>
            <button
              type="button"
              aria-pressed={mode === 'source'}
              onClick={() => setMode(mode === 'source' ? 'visual' : 'source')}
            >
              Source
            </button>
          </div>
        )}
      />
    </>
  )
}
