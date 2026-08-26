import Textarea from '@/components/ui/textarea/Textarea.jsx'

export default function NoteField({ value, onChange, error = '' }) {
  return (
    <div className="grid gap-2">
      <label htmlFor="note">Internal note</label>
      <Textarea
        id="note"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        name="note"
        rows={3}
        aria-invalid={Boolean(error)}
        aria-describedby="note-help note-error"
      />
      <p id="note-help">Plain text, up to 2,000 characters.</p>
      <p id="note-error" className="empty:hidden text-sm text-red-700">
        {error}
      </p>
    </div>
  )
}
