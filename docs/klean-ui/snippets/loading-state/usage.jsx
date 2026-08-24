import LoadingState from '@/components/ui/loading-state/LoadingState.jsx'
import Spinner from '@/components/ui/spinner/Spinner.jsx'

export default function ServicesLoading() {
  return (
    <section aria-busy="true" aria-labelledby="services-title">
      <h2 id="services-title">Services</h2>
      <LoadingState>
        <Spinner className="size-6" />
        <span>Loading services…</span>
      </LoadingState>
    </section>
  )
}
