<script setup>
import { computed, useAttrs } from 'vue'
import { twMerge } from 'tailwind-merge'
import { useFieldContext } from '../field/field-context.js'

defineOptions({ inheritAttrs: false })

const props = defineProps({
  for: { type: String, default: undefined }
})
const attrs = useAttrs()
const field = useFieldContext()
const resolvedFor = computed(() => field?.controlId.value ?? props.for)

const forwardedAttrs = computed(() => {
  const { class: _class, 'data-slot': _dataSlot, ...rest } = attrs
  return rest
})
</script>

<template>
  <label
    v-bind="forwardedAttrs"
    :for="resolvedFor"
    data-slot="label"
    :data-disabled="field?.disabled.value ? '' : undefined"
    :class="
      twMerge(
        'block text-sm font-medium leading-6 text-gray-950 data-[disabled]:cursor-not-allowed data-[disabled]:opacity-60 dark:text-white',
        attrs.class
      )
    "
  >
    <slot />
  </label>
</template>
