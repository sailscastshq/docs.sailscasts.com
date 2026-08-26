import { computed, onBeforeUnmount, onMounted, ref, unref } from 'vue'

const STORAGE_KEY = 'klean-ui-docs-framework'
const selectedFramework = ref('vue')

let preferenceLoaded = false
let listenerCount = 0

function readStoredFramework() {
  try {
    return window.localStorage.getItem(STORAGE_KEY)
  } catch {
    return undefined
  }
}

function storeFramework(framework) {
  try {
    window.localStorage.setItem(STORAGE_KEY, framework)
  } catch {
    // The selector still works for this page when storage is unavailable.
  }
}

function handleStorage(event) {
  if (event.key === STORAGE_KEY && event.newValue) {
    selectedFramework.value = event.newValue
  }
}

export function useKleanFramework(frameworks) {
  const options = computed(() => unref(frameworks) ?? [])
  const activeFramework = computed(() => {
    const available = options.value.map(({ id }) => id)
    return available.includes(selectedFramework.value)
      ? selectedFramework.value
      : available[0]
  })

  onMounted(() => {
    if (!preferenceLoaded) {
      selectedFramework.value = readStoredFramework() ?? 'vue'
      preferenceLoaded = true
    }

    listenerCount += 1
    if (listenerCount === 1) window.addEventListener('storage', handleStorage)
  })

  onBeforeUnmount(() => {
    listenerCount -= 1
    if (listenerCount === 0) {
      window.removeEventListener('storage', handleStorage)
    }
  })

  function selectFramework(framework) {
    if (!options.value.some(({ id }) => id === framework)) return
    selectedFramework.value = framework
    storeFramework(framework)
  }

  return { activeFramework, selectFramework }
}
