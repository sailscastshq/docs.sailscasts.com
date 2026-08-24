import { useState } from 'react'
import FilterBar from '@/components/ui/filter-bar/FilterBar.jsx'

export default function ServiceFilters() {
  const [filters, setFilters] = useState({ status: 'running' })

  return (
    <FilterBar value={filters} onChange={setFilters}>
      {(filter) => (
        <>
          <label htmlFor="status" className="sr-only">
            Status
          </label>
          <select
            id="status"
            value={filter.draft.status ?? ''}
            onChange={(event) => filter.update('status', event.target.value)}
          >
            <option value="">Any status</option>
            <option value="running">Running</option>
            <option value="stopped">Stopped</option>
          </select>

          <button {...filter.applyProps}>Apply</button>
          <button {...filter.cancelProps}>Cancel</button>

          {filter.entries.map(([key, value]) => (
            <button key={key} {...filter.removeProps(key)}>
              {key}: {value} ×
            </button>
          ))}
        </>
      )}
    </FilterBar>
  )
}
