import ErrorState from '@/components/ui/error-state/ErrorState.jsx'
import Button from '@/components/ui/button/Button.jsx'

export default function ServicesError({ failed, retry }) {
  if (!failed) return null

  return (
    <ErrorState role="alert" aria-labelledby="services-error-title">
      <h2 id="services-error-title">Services could not load</h2>
      <p>Slipway could not reach the deployment service.</p>
      <Button type="button" onClick={retry}>
        Try again
      </Button>
    </ErrorState>
  )
}
