import Card from '@/components/ui/card/Card.jsx'

export default function ReleaseCard() {
  return (
    <Card as="article" aria-labelledby="release-title">
      <header>
        <p className="text-xs text-gray-500">Production</p>
        <h2 id="release-title" className="mt-1 text-lg font-semibold">
          API release
        </h2>
      </header>
      <p className="mt-3 leading-6 text-gray-600">
        Healthy in Lagos with three replicas.
      </p>
    </Card>
  )
}
