<script setup>
import { computed, onBeforeUnmount, ref, useAttrs, watch } from 'vue'

defineOptions({ inheritAttrs: false })

const props = defineProps({
  accept: { type: String, default: undefined },
  capture: { type: [String, Boolean], default: undefined },
  disabled: { type: Boolean, default: false },
  validate: { type: Function, default: () => true }
})

const emit = defineEmits(['change', 'reject'])
const file = defineModel({ default: null })
const attrs = useAttrs()
const root = ref()
const input = ref()
const previewUrl = ref('')
const dragging = ref(false)
let dragDepth = 0
let previewFile

const rootAttrs = computed(() => {
  const {
    class: _class,
    'data-slot': _dataSlot,
    'data-state': _dataState,
    'data-dragging': _dataDragging,
    'data-disabled': _dataDisabled,
    ...rest
  } = attrs
  return rest
})

function resetInput() {
  if (input.value) input.value.value = ''
}

function revokePreview() {
  if (previewUrl.value && typeof URL.revokeObjectURL === 'function') {
    URL.revokeObjectURL(previewUrl.value)
  }
  previewUrl.value = ''
  previewFile = undefined
}

function syncPreview(candidate) {
  if (Object.is(candidate, previewFile)) return
  revokePreview()
  previewFile = candidate

  if (
    candidate &&
    typeof Blob !== 'undefined' &&
    candidate instanceof Blob &&
    typeof URL.createObjectURL === 'function'
  ) {
    previewUrl.value = URL.createObjectURL(candidate)
  }
}

function acceptedByAttribute(candidate) {
  const rules = props.accept
    ?.split(',')
    .map((rule) => rule.trim().toLowerCase())
    .filter(Boolean)
  if (!rules?.length) return true

  const type = candidate.type?.toLowerCase() ?? ''
  const name = candidate.name?.toLowerCase() ?? ''
  return rules.some((rule) => {
    if (rule.startsWith('.')) return name.endsWith(rule)
    if (rule.endsWith('/*')) return type.startsWith(rule.slice(0, -1))
    return type === rule
  })
}

function reject(candidate, reason, message, files = undefined) {
  const detail = { file: candidate ?? null, reason, message }
  if (files) detail.files = files
  emit('reject', detail)
  resetInput()
  return false
}

function setFile(candidate) {
  file.value = candidate
  emit('change', candidate)
  resetInput()
  return true
}

function select(files) {
  if (props.disabled) return false
  const candidates = Array.from(files ?? [])
  if (!candidates.length) return false
  if (candidates.length > 1) {
    return reject(
      candidates[0],
      'multiple',
      'Choose one file at a time.',
      candidates
    )
  }

  const candidate = candidates[0]
  if (!acceptedByAttribute(candidate)) {
    return reject(candidate, 'accept', 'That file type is not accepted.')
  }

  let result
  try {
    result = props.validate(candidate)
  } catch {
    return reject(candidate, 'validate', 'That file could not be validated.')
  }

  if (result !== true && result !== undefined) {
    return reject(
      candidate,
      typeof result === 'object' && result?.reason ? result.reason : 'validate',
      typeof result === 'string' && result
        ? result
        : typeof result === 'object' && result?.message
          ? result.message
          : 'That file is not valid.'
    )
  }

  return setFile(candidate)
}

function choose() {
  if (props.disabled || !input.value) return
  resetInput()
  if (typeof input.value.showPicker === 'function') {
    try {
      input.value.showPicker()
      return
    } catch {
      // The native click path covers browsers that restrict showPicker().
    }
  }
  input.value.click()
}

function clear() {
  if (props.disabled) return
  setFile(null)
}

function hasFiles(event) {
  return Array.from(event.dataTransfer?.types ?? []).includes('Files')
}

function handleDragEnter(event) {
  if (props.disabled || !hasFiles(event)) return
  event.preventDefault()
  dragDepth += 1
  dragging.value = true
}

function handleDragOver(event) {
  if (props.disabled || !hasFiles(event)) return
  event.preventDefault()
  if (event.dataTransfer) event.dataTransfer.dropEffect = 'copy'
  dragging.value = true
}

function handleDragLeave(event) {
  if (props.disabled || !hasFiles(event)) return
  event.preventDefault()
  dragDepth = Math.max(0, dragDepth - 1)
  if (dragDepth === 0) dragging.value = false
}

function handleDrop(event) {
  if (!hasFiles(event)) return
  event.preventDefault()
  dragDepth = 0
  dragging.value = false
  if (!props.disabled) select(event.dataTransfer?.files)
}

const dropzone = computed(() => ({
  'data-dragging': dragging.value ? '' : undefined,
  'data-disabled': props.disabled ? '' : undefined,
  onDragenter: handleDragEnter,
  onDragover: handleDragOver,
  onDragleave: handleDragLeave,
  onDrop: handleDrop
}))

watch(
  file,
  (candidate) => {
    syncPreview(candidate)
  },
  { immediate: true, flush: 'sync' }
)

onBeforeUnmount(() => {
  revokePreview()
})

defineExpose({ root, choose, clear })
</script>

<template>
  <div
    ref="root"
    v-bind="rootAttrs"
    data-slot="file-upload"
    :data-state="file ? 'ready' : 'empty'"
    :data-dragging="dragging ? '' : undefined"
    :data-disabled="disabled ? '' : undefined"
    :class="attrs.class"
  >
    <input
      ref="input"
      type="file"
      hidden
      data-part="input"
      :accept="accept"
      :capture="capture"
      :disabled="disabled"
      @change="select($event.currentTarget.files)"
    />
    <slot
      :file="file"
      :preview-url="previewUrl"
      :dragging="dragging"
      :choose="choose"
      :clear="clear"
      :dropzone="dropzone"
    />
  </div>
</template>
