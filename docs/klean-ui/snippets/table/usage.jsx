import Table from '@/components/ui/table/Table.jsx'

const services = [
  { name: 'api', status: 'Healthy', memory: '384 MB' },
  { name: 'worker', status: 'Deploying', memory: '192 MB' },
  { name: 'web', status: 'Healthy', memory: '256 MB' }
]

export default function ServicesTable() {
  return (
    <div className="overflow-x-auto rounded-lg border border-gray-200">
      <Table className="min-w-128">
        <caption className="caption-top px-4 py-3 text-left font-semibold">
          Production services
        </caption>
        <thead className="bg-gray-50 text-xs uppercase tracking-wider text-gray-600">
          <tr>
            <th scope="col" className="px-4 py-3 font-medium">
              Service
            </th>
            <th scope="col" className="px-4 py-3 font-medium">
              Status
            </th>
            <th scope="col" className="px-4 py-3 text-right font-medium">
              Memory
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {services.map((service) => (
            <tr key={service.name}>
              <th scope="row" className="px-4 py-3 font-mono font-medium">
                {service.name}
              </th>
              <td className="px-4 py-3">{service.status}</td>
              <td className="px-4 py-3 text-right tabular-nums">
                {service.memory}
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  )
}
