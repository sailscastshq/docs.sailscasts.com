import { onBeforeUnmount, ref } from 'vue'

export function useClipboard() {
  const copied = ref(false)
  const copyFailed = ref(false)
  let resetTimer

  async function copy(text) {
    copied.value = false
    copyFailed.value = false

    try {
      await navigator.clipboard.writeText(text)
      copied.value = true
      clearTimeout(resetTimer)
      resetTimer = setTimeout(() => {
        copied.value = false
      }, 2000)
    } catch {
      copyFailed.value = true
    }
  }

  onBeforeUnmount(() => {
    clearTimeout(resetTimer)
  })

  return {
    copied,
    copyFailed,
    copy
  }
}
