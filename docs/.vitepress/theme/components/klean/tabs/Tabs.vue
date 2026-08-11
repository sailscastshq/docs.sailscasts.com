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
import { twMerge } from 'tailwind-merge'

defineOptions({ inheritAttrs: false })

const props = defineProps({
  /** Framework-native controlled value. Omit for uncontrolled use. */
  modelValue: { type: String, default: undefined },
  /** Initial value when `modelValue` is not controlled. */
  defaultValue: { type: String, default: undefined },
  /** Arrow-key direction. */
  orientation: {
    type: String,
    default: 'horizontal',
    validator: (value) => ['horizontal', 'vertical'].includes(value)
  },
  /** Whether moving focus also selects a tab. */
  activation: {
    type: String,
    default: 'automatic',
    validator: (value) => ['automatic', 'manual'].includes(value)
  }
})

const emit = defineEmits(['update:modelValue', 'change'])
const attrs = useAttrs()
const componentId = useId().replace(/[^a-zA-Z0-9_-]/g, '')
const root = ref()
const internalValue = ref(props.defaultValue)
const isControlled = computed(() => props.modelValue !== undefined)
const value = computed(() =>
  isControlled.value ? props.modelValue : internalValue.value
)
const rootAttrs = computed(() => {
  const {
    class: _class,
    'aria-label': _ariaLabel,
    'aria-labelledby': _ariaLabelledby,
    role: _role,
    ...rest
  } = attrs
  return rest
})
const rootClasses = computed(() => twMerge(attrs.class))

let observer
let previousValues = []
let lastFocusedValue
let syncing = false

function listElement() {
  return root.value?.firstElementChild
}

function tabValue(element) {
  return element?.getAttribute('data-value') ?? ''
}

function belongsToThisTabs(element) {
  return element.closest('[data-slot="tabs"]') === root.value
}

function triggers() {
  const list = listElement()
  if (!list) return []
  return [
    ...list.querySelectorAll('button[data-value], a[href][data-value]')
  ].filter(belongsToThisTabs)
}

function mode(elements = triggers()) {
  if (!elements.length) return 'empty'
  if (elements.every((element) => element.matches('button'))) return 'panels'
  if (elements.every((element) => element.matches('a[href]'))) {
    return 'navigation'
  }
  return 'mixed'
}

function tabs() {
  return triggers().filter((trigger) => trigger.matches('button'))
}

function panels() {
  const list = listElement()
  if (!root.value || !list) return []
  return [...root.value.children]
    .slice(1)
    .filter((element) => element.hasAttribute('data-value'))
}

function disabled(tab) {
  return tab.disabled || tab.getAttribute('aria-disabled') === 'true'
}

function enabledTabs() {
  return tabs().filter((tab) => !disabled(tab))
}

function tabFor(candidate) {
  return tabs().find((tab) => tabValue(tab) === candidate)
}

function panelFor(candidate) {
  return panels().find((panel) => tabValue(panel) === candidate)
}

function fallbackValue(current) {
  const available = enabledTabs()
  if (!available.length) return undefined

  const oldIndex = previousValues.indexOf(current)
  const index = oldIndex < 0 ? 0 : Math.min(oldIndex, available.length - 1)
  return tabValue(available[index])
}

function requestValue(nextValue, { user = false } = {}) {
  if (!nextValue || nextValue === value.value) return
  if (!isControlled.value) internalValue.value = nextValue
  emit('update:modelValue', nextValue)
  if (user) emit('change', nextValue)
  nextTick(sync)
}

function generatedPairId(candidate, index) {
  const slug = candidate.replace(/[^a-zA-Z0-9_-]/g, '-') || String(index)
  return `klean-tabs-${componentId}-${slug}-${index}`
}

function setAttribute(element, name, nextValue) {
  if (element.getAttribute(name) !== nextValue) {
    element.setAttribute(name, nextValue)
  }
}

function syncList(list, currentMode) {
  if (!list) return
  list.setAttribute('data-slot', 'tabs-list')
  list.setAttribute('data-mode', currentMode)
  list.setAttribute('data-orientation', props.orientation)
  if (attrs['aria-label']) list.setAttribute('aria-label', attrs['aria-label'])
  if (attrs['aria-labelledby'])
    list.setAttribute('aria-labelledby', attrs['aria-labelledby'])
}

function syncNavigation(list, links) {
  if (list.getAttribute('role') === 'tablist') list.removeAttribute('role')
  list.removeAttribute('aria-orientation')

  const current = value.value
  const currentLink = links.find((link) => tabValue(link) === current)
  const markedLink = links.find(
    (link) => link.getAttribute('aria-current') === 'page'
  )
  const selected = currentLink ?? (!isControlled.value ? markedLink : undefined)

  if (!isControlled.value && selected && tabValue(selected) !== current) {
    internalValue.value = tabValue(selected)
  }

  links.forEach((link) => {
    const active = link === selected
    link.setAttribute('data-slot', 'tab')
    link.setAttribute('data-mode', 'navigation')
    link.setAttribute('data-state', active ? 'active' : 'inactive')
    link.setAttribute('data-orientation', props.orientation)
    if (link.getAttribute('role') === 'tab') link.removeAttribute('role')
    link.removeAttribute('aria-selected')
    link.removeAttribute('aria-controls')
    if (active) setAttribute(link, 'aria-current', 'page')
    else if (link.getAttribute('aria-current') === 'page') {
      link.removeAttribute('aria-current')
    }
  })
}

function sync() {
  if (!root.value || syncing) return
  syncing = true

  const list = listElement()
  const allTriggers = triggers()
  const currentMode = mode(allTriggers)
  root.value.setAttribute('data-mode', currentMode)
  syncList(list, currentMode)

  if (currentMode === 'navigation') {
    syncNavigation(list, allTriggers)
    previousValues = []
    syncing = false
    return
  }

  if (currentMode !== 'panels') {
    syncing = false
    return
  }

  const allTabs = tabs()
  const allPanels = panels()
  const current = value.value
  const currentTab = tabFor(current)
  const resolved =
    currentTab && !disabled(currentTab) ? current : fallbackValue(current)

  if (resolved && resolved !== current) {
    if (!isControlled.value) internalValue.value = resolved
    else emit('update:modelValue', resolved)
  }

  if (list) {
    list.setAttribute('role', 'tablist')
    list.setAttribute('aria-orientation', props.orientation)
  }

  allTabs.forEach((tab, index) => {
    const candidate = tabValue(tab)
    const panel = panelFor(candidate)
    const pairId = generatedPairId(candidate, index)
    const selected = candidate === resolved

    if (!tab.hasAttribute('type')) tab.setAttribute('type', 'button')
    tab.setAttribute('role', 'tab')
    tab.setAttribute('data-slot', 'tab')
    tab.setAttribute('data-mode', 'panels')
    tab.setAttribute('data-state', selected ? 'active' : 'inactive')
    tab.setAttribute('data-orientation', props.orientation)
    tab.setAttribute('aria-selected', String(selected))
    tab.tabIndex = selected ? 0 : -1
    if (!tab.id) tab.id = `${pairId}-tab`

    if (panel) {
      if (!panel.id) panel.id = `${pairId}-panel`
      tab.setAttribute('aria-controls', panel.id)
      panel.setAttribute('role', 'tabpanel')
      panel.setAttribute('data-slot', 'tab-panel')
      panel.setAttribute('data-state', selected ? 'active' : 'inactive')
      panel.setAttribute('data-orientation', props.orientation)
      panel.setAttribute('aria-labelledby', tab.id)
      panel.hidden = !selected
      if (!panel.hasAttribute('tabindex')) panel.tabIndex = 0
    } else {
      tab.removeAttribute('aria-controls')
    }
  })

  allPanels.forEach((panel) => {
    if (tabFor(tabValue(panel))) return
    panel.hidden = true
  })

  const shouldRestoreFocus =
    lastFocusedValue === current && current && !tabFor(current) && resolved
  previousValues = allTabs.map(tabValue)
  syncing = false

  if (shouldRestoreFocus) {
    nextTick(() => tabFor(resolved)?.focus({ preventScroll: true }))
  }
}

function reveal(tab) {
  tab.scrollIntoView?.({ block: 'nearest', inline: 'nearest' })
}

function focusTab(tab) {
  if (!tab) return
  tab.focus({ preventScroll: true })
  reveal(tab)
  if (props.activation === 'automatic') {
    requestValue(tabValue(tab), { user: true })
  }
}

function eventTab(event) {
  const candidate = event.target.closest?.('button[data-value]')
  return candidate && listElement()?.contains(candidate) ? candidate : undefined
}

function handleClick(event) {
  const tab = eventTab(event)
  if (!tab || disabled(tab)) return
  lastFocusedValue = tabValue(tab)
  requestValue(tabValue(tab), { user: true })
}

function handleFocusIn(event) {
  const tab = eventTab(event)
  if (!tab || disabled(tab)) return
  lastFocusedValue = tabValue(tab)
}

function handleKeydown(event) {
  const tab = eventTab(event)
  if (!tab || disabled(tab)) return
  const available = enabledTabs()
  const index = available.indexOf(tab)
  let next

  if (
    (props.orientation === 'horizontal' && event.key === 'ArrowRight') ||
    (props.orientation === 'vertical' && event.key === 'ArrowDown')
  ) {
    next = available[(index + 1) % available.length]
  } else if (
    (props.orientation === 'horizontal' && event.key === 'ArrowLeft') ||
    (props.orientation === 'vertical' && event.key === 'ArrowUp')
  ) {
    next = available[(index - 1 + available.length) % available.length]
  } else if (event.key === 'Home') {
    next = available[0]
  } else if (event.key === 'End') {
    next = available.at(-1)
  } else if (
    props.activation === 'manual' &&
    ['Enter', ' '].includes(event.key)
  ) {
    event.preventDefault()
    requestValue(tabValue(tab), { user: true })
    return
  } else {
    return
  }

  event.preventDefault()
  focusTab(next)
}

onMounted(async () => {
  await nextTick()
  sync()
  observer = new MutationObserver(sync)
  observer.observe(root.value, {
    childList: true,
    subtree: true,
    attributes: true,
    attributeFilter: [
      'data-value',
      'disabled',
      'aria-disabled',
      'href',
      'aria-current'
    ]
  })
})

watch(
  () => [props.modelValue, props.orientation, props.activation],
  () => nextTick(sync)
)

onBeforeUnmount(() => observer?.disconnect())
</script>

<template>
  <div
    v-bind="rootAttrs"
    ref="root"
    data-slot="tabs"
    :data-orientation="orientation"
    :class="rootClasses"
    @click="handleClick"
    @focusin="handleFocusIn"
    @keydown="handleKeydown"
  >
    <slot />
  </div>
</template>
