import Alert from '@/components/ui/alert/Alert.jsx'

export default function DeploymentError() {
  return (
    <Alert
      as="section"
      role="alert"
      aria-labelledby="deployment-error-title"
      className="bg-red-50 text-red-950 dark:bg-red-950 dark:text-red-100"
    >
      <h2 id="deployment-error-title" className="font-medium">
        Deployment failed
      </h2>
      <p className="mt-1 leading-6 text-red-800 dark:text-red-200">
        The server could not be reached. No production files changed.
      </p>
      <button
        type="button"
        className="mt-4 cursor-pointer font-medium underline"
      >
        Try again
      </button>
    </Alert>
  )
}
