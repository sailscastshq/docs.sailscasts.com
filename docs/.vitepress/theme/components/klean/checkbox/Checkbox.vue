<script setup>
import {
  computed,
  nextTick,
  onBeforeUnmount,
  onMounted,
  onUpdated,
  ref,
  useAttrs
} from 'vue'
import { twMerge } from 'tailwind-merge'

defineOptions({ inheritAttrs: false })

const props = defineProps({
  indeterminate: { type: Boolean, default: false }
})
const model = defineModel({ default: false })
const attrs = useAttrs()
const element = ref()
const checked = ref(false)
let form

const forwardedAttrs = computed(() => {
  const {
    class: _class,
    type: _type,
    'data-slot': _dataSlot,
    'data-state': _dataState,
    'data-disabled': _dataDisabled,
    'data-invalid': _dataInvalid,
    ...rest
  } = attrs
  return rest
})

const disabled = computed(
  () => attrs.disabled !== undefined && attrs.disabled !== false
)
const invalid = computed(
  () => attrs['aria-invalid'] === true || attrs['aria-invalid'] === 'true'
)
const state = computed(() =>
  props.indeterminate
    ? 'indeterminate'
    : checked.value
      ? 'checked'
      : 'unchecked'
)

function applyElementState() {
  if (!element.value) return
  element.value.indeterminate = props.indeterminate
  checked.value = element.value.checked
}

function valuesMatch(left, right) {
  return Object.is(left, right)
}

function resetModelFromElement() {
  if (!element.value) return

  const nextChecked = element.value.checked
  const current = model.value
  const inputValue = attrs.value ?? 'on'

  if (Array.isArray(current)) {
    const index = current.findIndex((item) => valuesMatch(item, inputValue))
    if (nextChecked && index === -1) model.value = [...current, inputValue]
    if (!nextChecked && index !== -1) {
      model.value = current.filter((_, itemIndex) => itemIndex !== index)
    }
  } else if (current instanceof Set) {
    const next = new Set(current)
    if (nextChecked) next.add(inputValue)
    else next.delete(inputValue)
    model.value = next
  } else {
    model.value = nextChecked
      ? (attrs['true-value'] ?? true)
      : (attrs['false-value'] ?? false)
  }

  checked.value = nextChecked
}

function handleReset() {
  queueMicrotask(resetModelFromElement)
}

function handleChange() {
  nextTick(applyElementState)
}

onMounted(() => {
  applyElementState()
  element.value.defaultChecked = element.value.checked
  form = element.value.form
  form?.addEventListener('reset', handleReset)
})

onUpdated(applyElementState)

onBeforeUnmount(() => {
  form?.removeEventListener('reset', handleReset)
})

defineExpose({
  element,
  focus: (options) => element.value?.focus(options)
})
</script>

<template>
  <input
    ref="element"
    v-model="model"
    v-bind="forwardedAttrs"
    type="checkbox"
    data-slot="checkbox"
    :data-state="state"
    :data-disabled="disabled ? '' : undefined"
    :data-invalid="invalid ? '' : undefined"
    :class="
      twMerge(
        [
          'size-4 shrink-0 cursor-pointer appearance-auto accent-current text-gray-950 outline-none',
          'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-950',
          'disabled:cursor-not-allowed disabled:opacity-50',
          'aria-invalid:focus-visible:outline-red-600',
          'dark:text-white dark:focus-visible:outline-white dark:aria-invalid:focus-visible:outline-red-500'
        ],
        attrs.class
      )
    "
    @change="handleChange"
  />
</template>
