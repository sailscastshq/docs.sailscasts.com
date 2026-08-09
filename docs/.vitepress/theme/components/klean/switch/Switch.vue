<script setup>
import { computed, onBeforeUnmount, onMounted, ref, useAttrs } from 'vue'
import { twMerge } from 'tailwind-merge'

defineOptions({ inheritAttrs: false })

const model = defineModel({ type: Boolean, default: false })
const attrs = useAttrs()
const element = ref()
let form

const forwardedAttrs = computed(() => {
  const {
    class: _class,
    type: _type,
    role: _role,
    checked: _checked,
    'true-value': _trueValue,
    'false-value': _falseValue,
    'aria-checked': _ariaChecked,
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

function handleChange(event) {
  model.value = Boolean(event.currentTarget.checked)
}

function handleReset() {
  queueMicrotask(() => {
    if (element.value) model.value = Boolean(element.value.checked)
  })
}

onMounted(() => {
  element.value.defaultChecked = Boolean(model.value)
  form = element.value.form
  form?.addEventListener('reset', handleReset)
})

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
    v-bind="forwardedAttrs"
    v-model="model"
    type="checkbox"
    role="switch"
    data-slot="switch"
    :data-state="model ? 'checked' : 'unchecked'"
    :data-disabled="disabled ? '' : undefined"
    :data-invalid="invalid ? '' : undefined"
    :class="
      twMerge(
        [
          `relative inline-flex h-6 w-11 shrink-0 cursor-pointer appearance-none rounded-full border border-transparent bg-gray-300 p-0.5 outline-none transition-colors duration-150 ease-out after:pointer-events-none after:block after:size-5 after:rounded-full after:bg-white after:shadow-sm after:transition-transform after:duration-150 after:ease-out after:content-['']`,
          'checked:bg-gray-950 checked:after:[transform:translateX(1.25rem)]',
          'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-950',
          'disabled:cursor-not-allowed disabled:opacity-50',
          'aria-invalid:outline-2 aria-invalid:outline-offset-2 aria-invalid:outline-red-600 aria-invalid:focus-visible:outline-red-600',
          'motion-reduce:transition-none motion-reduce:after:transition-none',
          'dark:bg-gray-700 dark:checked:bg-white dark:checked:after:bg-gray-950 dark:focus-visible:outline-white dark:aria-invalid:outline-red-500',
          'forced-colors:border-[CanvasText] forced-colors:bg-[Canvas] forced-colors:checked:bg-[Highlight] forced-colors:after:bg-[CanvasText] forced-colors:checked:after:bg-[HighlightText]'
        ],
        attrs.class
      )
    "
    @change="handleChange"
  />
</template>
