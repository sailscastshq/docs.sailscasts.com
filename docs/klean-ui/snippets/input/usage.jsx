import Input from '@/components/ui/input/Input.jsx'

export default function EmailField({ value, onChange, error = '' }) {
  return (
    <div className="grid gap-2">
      <label htmlFor="email">Email address</label>
      <Input
        id="email"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        name="email"
        type="email"
        autoComplete="email"
        required
        aria-invalid={Boolean(error)}
        aria-describedby="email-help email-error"
      />
      <p id="email-help">We only use this for account messages.</p>
      <p id="email-error" className="empty:hidden text-sm text-red-700">
        {error}
      </p>
    </div>
  )
}
