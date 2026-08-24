import { useState } from 'react'
import Checkbox from '@/components/ui/checkbox/Checkbox.jsx'
import DataTable from '@/components/ui/data-table/DataTable.jsx'

export default function ServicesTable({ services }) {
  const [selected, setSelected] = useState([])

  return (
    <DataTable
      rows={services}
      selected={selected}
      onSelectedChange={setSelected}
      className="rounded-lg border border-gray-200"
      tableClassName="min-w-160"
    >
      {(table) => (
        <>
          <caption className="caption-top px-4 py-3 text-left font-semibold">
            Production services
          </caption>
          <thead className="border-y border-gray-200 bg-gray-50 text-xs text-gray-600">
            <tr>
              <th scope="col" className="w-12 px-4 py-3">
                <Checkbox {...table.pageSelection()} />
              </th>
              <th scope="col" className="px-4 py-3 font-medium">
                Service
              </th>
              <th scope="col" className="px-4 py-3 font-medium">
                Status
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {services.map((service) => (
              <tr key={service.id}>
                <td className="px-4 py-3">
                  <Checkbox
                    {...table.rowSelection(service, `Select ${service.name}`)}
                  />
                </td>
                <th scope="row" className="px-4 py-3 font-medium">
                  <a href={`/services/${service.id}`}>{service.name}</a>
                </th>
                <td className="px-4 py-3">{service.status}</td>
              </tr>
            ))}
          </tbody>
        </>
      )}
    </DataTable>
  )
}
