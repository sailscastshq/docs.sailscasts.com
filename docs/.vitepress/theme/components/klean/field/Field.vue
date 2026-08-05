<script setup>
import { computed, provide, useAttrs, useId } from 'vue'
import { twMerge } from 'tailwind-merge'
import { FIELD_CONTEXT_KEY } from './field-context.js'

defineOptions({ inheritAttrs: false })

const props = defineProps({
  /** The native control ID shared by Label, Input, and Textarea. */
  id: { type: String, default: undefined },
  /** The native control name inherited by Input or Textarea. */
  name: { type: String, default: undefined },
  /** The visible native label for the control. */
  label: { type: [String, Number], required: true },
  /** Optional help text connected to the control. */
  description: { type: [String, Number], default: undefined },
  /** Optional server or application error connected to the control. */
  error: { type: [String, Number], default: undefined },
  /** Exposes the server-owned validation state to the field primitives. */
  invalid: { type: Boolean, default: undefined },
  /** Disables the field's native control. */
  disabled: { type: Boolean, default: false },
  /** Marks the field's native control as required. */
  required: { type: Boolean, default: false }
})

const attrs = useAttrs()
const generatedId = useId()
const controlId = computed(() => props.id ?? generatedId)
const descriptionId = computed(() => `${controlId.value}-description`)
const errorId = computed(() => `${controlId.value}-error`)
const resolvedInvalid = computed(() => props.invalid ?? Boolean(props.error))
const describedBy = computed(
  () =>
    [
      props.description !== undefined ? descriptionId.value : undefined,
      props.error !== undefined ? errorId.value : undefined
    ]
      .filter(Boolean)
      .join(' ') || undefined
)

provide(FIELD_CONTEXT_KEY, {
  controlId,
  name: computed(() => props.name),
  invalid: resolvedInvalid,
  disabled: computed(() => props.disabled),
  required: computed(() => props.required),
  describedBy
})

const forwardedAttrs = computed(() => {
  const { class: _class, 'data-slot': _dataSlot, ...rest } = attrs
  return rest
})
</script>

<template>
  <div
    v-bind="forwardedAttrs"
    data-slot="field"
    :data-invalid="resolvedInvalid ? '' : undefined"
    :data-disabled="disabled ? '' : undefined"
    :class="twMerge('grid gap-2', attrs.class)"
  >
    <label
      :for="controlId"
      data-slot="label"
      :data-disabled="disabled ? '' : undefined"
      class="block text-sm font-medium leading-6 text-gray-950 data-[disabled]:cursor-not-allowed data-[disabled]:opacity-60 dark:text-white"
    >
      {{ label }}
    </label>
    <slot />
    <p
      v-if="description !== undefined"
      :id="descriptionId"
      data-slot="field-description"
      class="text-sm leading-6 text-gray-600 dark:text-gray-400"
    >
      {{ description }}
    </p>
    <p
      v-if="error !== undefined"
      :id="errorId"
      data-slot="field-error"
      class="text-sm leading-6 text-red-700 dark:text-red-400"
    >
      {{ error }}
    </p>
  </div>
</template>
