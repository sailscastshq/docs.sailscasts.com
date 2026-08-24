<script setup>
import { computed, ref, useAttrs, watch } from 'vue'
import { twMerge } from 'tailwind-merge'
import Table from '../table/Table.vue'

defineOptions({ inheritAttrs: false })

const props = defineProps({
  rows: { type: Array, default: () => [] },
  rowKey: { type: [String, Function], default: 'id' },
  selectable: { type: Function, default: () => true },
  busy: { type: Boolean, default: false },
  tableClass: { type: [String, Array, Object], default: undefined }
})

const selected = defineModel('selected', { default: () => [] })
const attrs = useAttrs()
const root = ref()

const rootAttrs = computed(() => {
  const {
    class: _class,
    'data-slot': _dataSlot,
    'data-busy': _dataBusy,
    'data-empty': _dataEmpty,
    ...rest
  } = attrs
  return rest
})

function keyFor(row) {
  return typeof props.rowKey === 'function'
    ? props.rowKey(row)
    : row?.[props.rowKey]
}

function canSelect(row) {
  return props.selectable(row) !== false
}

const selectableKeys = computed(() => props.rows.filter(canSelect).map(keyFor))
const selectableKeySet = computed(() => new Set(selectableKeys.value))
const selectedKeySet = computed(() => new Set(selected.value))
const selectedCount = computed(() => selectedKeySet.value.size)
const allSelected = computed(
  () =>
    selectableKeys.value.length > 0 &&
    selectableKeys.value.every((key) => selectedKeySet.value.has(key))
)
const someSelected = computed(
  () => selectedCount.value > 0 && !allSelected.value
)
const status = computed(() => {
  if (selectedCount.value === 0) return 'No rows selected.'
  return `${selectedCount.value} row${selectedCount.value === 1 ? '' : 's'} selected.`
})

function setSelected(next) {
  selected.value = [...new Set(next)]
}

function isSelected(row) {
  return selectedKeySet.value.has(keyFor(row))
}

function setRowSelected(row, checked) {
  if (props.busy || !canSelect(row)) return
  const key = keyFor(row)
  const next = new Set(selected.value)
  if (checked) next.add(key)
  else next.delete(key)
  setSelected(next)
}

function setPageSelected(checked) {
  if (props.busy) return
  setSelected(checked ? selectableKeys.value : [])
}

function clearSelection() {
  setSelected([])
}

function removeSelection(keys) {
  const removed = new Set(Array.isArray(keys) ? keys : [keys])
  setSelected(selected.value.filter((key) => !removed.has(key)))
}

function rowSelection(row, label) {
  const key = keyFor(row)
  return {
    modelValue: selectedKeySet.value.has(key),
    disabled: props.busy || !canSelect(row),
    'aria-label': label || `Select row ${String(key)}`,
    'onUpdate:modelValue': (checked) => setRowSelected(row, checked)
  }
}

function pageSelection(label = 'Select all rows on this page') {
  return {
    modelValue: allSelected.value,
    indeterminate: someSelected.value,
    disabled: props.busy || selectableKeys.value.length === 0,
    'aria-label': label,
    'onUpdate:modelValue': setPageSelected
  }
}

watch(
  selectableKeySet,
  (keys) => {
    const next = selected.value.filter((key) => keys.has(key))
    if (
      next.length !== selected.value.length ||
      next.some((key, index) => !Object.is(key, selected.value[index]))
    ) {
      setSelected(next)
    }
  },
  { immediate: true, flush: 'sync' }
)

defineExpose({
  root,
  clearSelection,
  removeSelection
})
</script>

<template>
  <div
    ref="root"
    v-bind="rootAttrs"
    data-slot="data-table"
    :data-busy="busy ? '' : undefined"
    :data-empty="rows.length === 0 ? '' : undefined"
    :class="twMerge('relative overflow-x-auto', attrs.class)"
  >
    <Table
      :aria-busy="busy ? 'true' : undefined"
      :class="twMerge('min-w-full', tableClass)"
    >
      <slot
        :rows="rows"
        :selected="selected"
        :selected-count="selectedCount"
        :all-selected="allSelected"
        :some-selected="someSelected"
        :is-selected="isSelected"
        :row-selection="rowSelection"
        :page-selection="pageSelection"
        :clear-selection="clearSelection"
        :remove-selection="removeSelection"
      />
    </Table>
    <span class="sr-only" aria-live="polite" aria-atomic="true">{{
      status
    }}</span>
  </div>
</template>
