<script setup>
import {
  computed,
  nextTick,
  onBeforeUnmount,
  onMounted,
  ref,
  useAttrs,
  useId,
  watch
} from 'vue'
import Menu from '../menu/Menu.vue'

defineOptions({ inheritAttrs: false })
const props = defineProps({
  /** Existing focusable target element or its id, in the same document/shadow root. */
  target: { type: [String, Object], required: true },
  id: { type: String, default: undefined },
  disabled: { type: Boolean, default: false },
  open: { type: Boolean, default: undefined },
  placement: { type: String, default: 'bottom-start' },
  offset: { type: Number, default: 0 }
})
const emit = defineEmits(['update:open'])
const attrs = useAttrs()
const generatedId = useId()
const menu = ref()
const internalOpen = ref(false)
const anchor = ref()
const isOpen = computed(() => props.open ?? internalOpen.value)
const menuId = computed(
  () =>
    props.id ??
    `klean-context-menu-${generatedId.replace(/[^a-zA-Z0-9_-]/g, '')}`
)
let cleanup = () => {}
let mounted = false

function targetElement() {
  const root = menu.value?.getContent()?.getRootNode() ?? document
  return typeof props.target === 'string'
    ? root.getElementById?.(props.target)
    : props.target
}
function unavailable(target) {
  return (
    props.disabled ||
    !target?.isConnected ||
    target.matches(':disabled') ||
    target.getAttribute('aria-disabled') === 'true'
  )
}
function requestOpen(value) {
  if (props.open === undefined) internalOpen.value = value
  emit('update:open', value)
}
function show(source = targetElement(), point) {
  const target = targetElement()
  if (unavailable(target) || !source?.isConnected) return
  const rect = source.getBoundingClientRect()
  const x = point?.x ?? rect.left
  const y = point?.y ?? rect.bottom
  anchor.value = {
    contextElement: source,
    getBoundingClientRect: () => ({
      x,
      y,
      left: x,
      right: x,
      top: y,
      bottom: y,
      width: 0,
      height: 0
    })
  }
  menu.value?.open('first', source)
}
function hide() {
  menu.value?.close({ restoreFocus: true })
}
function bindTarget() {
  cleanup()
  const target = targetElement()
  if (!target) return
  const attributes = ['aria-haspopup', 'aria-controls', 'aria-expanded']
  const previous = attributes.map((name) => target.getAttribute(name))
  target.setAttribute('aria-haspopup', 'menu')
  target.setAttribute('aria-controls', menuId.value)
  target.setAttribute('aria-expanded', String(isOpen.value))
  function invoke(event) {
    if (event.defaultPrevented || unavailable(target)) return
    const keyboard = event.type === 'keydown'
    if (
      keyboard &&
      !(
        event.key === 'ContextMenu' ||
        (event.key === 'F10' &&
          event.shiftKey &&
          !event.ctrlKey &&
          !event.altKey &&
          !event.metaKey)
      )
    )
      return
    event.preventDefault()
    // Browser keyboard contextmenu events commonly have zero pointer coordinates.
    const point =
      !keyboard && (event.clientX || event.clientY)
        ? { x: event.clientX, y: event.clientY }
        : undefined
    show(target, point)
  }
  target.addEventListener('contextmenu', invoke)
  target.addEventListener('keydown', invoke)
  cleanup = () => {
    target.removeEventListener('contextmenu', invoke)
    target.removeEventListener('keydown', invoke)
    attributes.forEach((name, index) =>
      previous[index] === null
        ? target.removeAttribute(name)
        : target.setAttribute(name, previous[index])
    )
    cleanup = () => {}
  }
}
watch(
  () => [props.target, menuId.value, isOpen.value],
  () => {
    if (mounted) bindTarget()
  },
  { flush: 'post' }
)
watch(
  () => props.disabled,
  (disabled) => {
    if (disabled) hide()
  }
)
onMounted(async () => {
  await nextTick()
  mounted = true
  bindTarget()
})
onBeforeUnmount(() => {
  mounted = false
  cleanup()
})
defineExpose({ show, hide })
</script>

<template>
  <Menu
    ref="menu"
    v-bind="attrs"
    popover="manual"
    :id="menuId"
    :open="isOpen"
    :anchor="anchor"
    :placement="placement"
    :offset="offset"
    @update:open="requestOpen"
  >
    <slot :open="isOpen" :close="hide" />
  </Menu>
</template>
