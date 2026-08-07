import { useState } from 'react'
import Slide from '@/components/ui/slide/Slide.jsx'

export default function DeployAction({ ready }) {
  const [deploying, setDeploying] = useState(false)

  async function deploy() {
    setDeploying(true)

    try {
      await fetch('/deployments', { method: 'POST' })
    } finally {
      setDeploying(false)
    }
  }

  return (
    <>
      <Slide
        pending={deploying}
        disabled={!ready}
        className="w-72"
        aria-describedby="deploy-help"
        onConfirm={deploy}
      >
        {deploying ? 'Sliding to production…' : 'Slide to production'}
      </Slide>
      <p id="deploy-help">Release near the end to start deployment.</p>
    </>
  )
}
