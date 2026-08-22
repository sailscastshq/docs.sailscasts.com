import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState
} from 'react'
import { twMerge } from 'tailwind-merge'
import Table from '../table/Table.jsx'

const DataTable = forwardRef(function DataTable(
  {
    rows = [],
    rowKey = 'id',
    selectable = () => true,
    busy = false,
    selected,
    defaultSelected = [],
    onSelectedChange,
    tableClassName,
    className,
    children,
    'data-slot': _dataSlot,
    'data-busy': _dataBusy,
    'data-empty': _dataEmpty,
    ...props
  },
  forwardedRef
) {
  const rootRef = useRef(null)
  const controlled = selected !== undefined
  const [localSelected, setLocalSelected] = useState(defaultSelected)
  const selectedKeys = controlled ? selected : localSelected

  function keyFor(row) {
    return typeof rowKey === 'function' ? rowKey(row) : row?.[rowKey]
  }

  const selectableKeys = useMemo(
    () => rows.filter((row) => selectable(row) !== false).map(keyFor),
    [rows, rowKey, selectable]
  )
  const selectableKeySet = useMemo(
    () => new Set(selectableKeys),
    [selectableKeys]
  )
  const selectedKeySet = useMemo(() => new Set(selectedKeys), [selectedKeys])
  const allSelected =
    selectableKeys.length > 0 &&
    selectableKeys.every((key) => selectedKeySet.has(key))
  const someSelected = selectedKeySet.size > 0 && !allSelected

  function setSelected(next) {
    const value = [...new Set(next)]
    if (!controlled) setLocalSelected(value)
    onSelectedChange?.(value)
  }

  function isSelected(row) {
    return selectedKeySet.has(keyFor(row))
  }

  function setRowSelected(row, checked) {
    if (busy || selectable(row) === false) return
    const key = keyFor(row)
    const next = new Set(selectedKeys)
    if (checked) next.add(key)
    else next.delete(key)
    setSelected(next)
  }

  function setPageSelected(checked) {
    if (busy) return
    setSelected(checked ? selectableKeys : [])
  }

  function clearSelection() {
    setSelected([])
  }

  function removeSelection(keys) {
    const removed = new Set(Array.isArray(keys) ? keys : [keys])
    setSelected(selectedKeys.filter((key) => !removed.has(key)))
  }

  function rowSelection(row, label) {
    const key = keyFor(row)
    return {
      checked: selectedKeySet.has(key),
      disabled: busy || selectable(row) === false,
      'aria-label': label || `Select row ${String(key)}`,
      onChange: (event) => setRowSelected(row, event.currentTarget.checked)
    }
  }

  function pageSelection(label = 'Select all rows on this page') {
    return {
      checked: allSelected,
      indeterminate: someSelected,
      disabled: busy || selectableKeys.length === 0,
      'aria-label': label,
      onChange: (event) => setPageSelected(event.currentTarget.checked)
    }
  }

  useEffect(() => {
    const next = selectedKeys.filter((key) => selectableKeySet.has(key))
    if (
      next.length !== selectedKeys.length ||
      next.some((key, index) => !Object.is(key, selectedKeys[index]))
    ) {
      setSelected(next)
    }
  }, [selectableKeySet, selectedKeys])

  useImperativeHandle(forwardedRef, () => ({
    root: rootRef.current,
    clearSelection,
    removeSelection
  }))

  const api = {
    rows,
    selected: selectedKeys,
    selectedCount: selectedKeySet.size,
    allSelected,
    someSelected,
    isSelected,
    rowSelection,
    pageSelection,
    clearSelection,
    removeSelection
  }
  const status =
    selectedKeySet.size === 0
      ? 'No rows selected.'
      : `${selectedKeySet.size} row${selectedKeySet.size === 1 ? '' : 's'} selected.`

  return (
    <div
      {...props}
      ref={rootRef}
      data-slot="data-table"
      data-busy={busy ? '' : undefined}
      data-empty={rows.length === 0 ? '' : undefined}
      className={twMerge('relative overflow-x-auto', className)}
    >
      <Table
        aria-busy={busy ? 'true' : undefined}
        className={twMerge('min-w-full', tableClassName)}
      >
        {typeof children === 'function' ? children(api) : children}
      </Table>
      <span className="sr-only" aria-live="polite" aria-atomic="true">
        {status}
      </span>
    </div>
  )
})

export default DataTable
