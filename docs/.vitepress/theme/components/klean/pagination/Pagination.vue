<script setup>
import { Link, usePage } from '@inertiajs/vue3'
import { computed, nextTick, ref, useAttrs, watch } from 'vue'
import { twMerge } from 'tailwind-merge'

defineOptions({ inheritAttrs: false })

const props = defineProps({
  /** Server-provided current page. */
  page: { type: [Number, String], required: true },
  /** Server-provided total number of pages. */
  pages: { type: [Number, String], required: true },
  /** Optional Inertia partial-reload prop names. */
  only: { type: Array, default: () => [] }
})

const attrs = useAttrs()
const inertiaPage = usePage()
const root = ref()
const pendingPage = ref()
const lastIntent = ref()

const LINK_CLASSES =
  'inline-flex min-h-11 min-w-11 cursor-pointer items-center justify-center gap-2 rounded-md border border-gray-200 bg-white px-3 text-sm font-medium text-gray-700 no-underline transition-colors hover:bg-gray-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-950 dark:border-gray-700 dark:bg-gray-950 dark:text-gray-200 dark:hover:bg-gray-900 dark:focus-visible:outline-white'
const CURRENT_CLASSES =
  'border-gray-950 bg-gray-950 text-white hover:bg-gray-950 dark:border-white dark:bg-white dark:text-gray-950 dark:hover:bg-white'
const DISABLED_CLASSES =
  'inline-flex min-h-11 min-w-11 cursor-not-allowed items-center justify-center gap-2 rounded-md border border-gray-200 bg-gray-50 px-3 text-sm font-medium text-gray-400 opacity-70 dark:border-gray-800 dark:bg-gray-950 dark:text-gray-600'

function positiveInteger(value, fallback = 1) {
  const number = Math.trunc(Number(value))
  return Number.isFinite(number) && number > 0 ? number : fallback
}

function pageWindow(current, total) {
  if (total <= 7) return Array.from({ length: total }, (_, index) => index + 1)

  const visible = new Set([1, total, current - 1, current, current + 1])
  if (current <= 4) [2, 3, 4, 5].forEach((value) => visible.add(value))
  if (current >= total - 3) {
    ;[total - 4, total - 3, total - 2, total - 1].forEach((value) =>
      visible.add(value)
    )
  }

  const ordered = [...visible]
    .filter((value) => value >= 1 && value <= total)
    .sort((a, b) => a - b)

  return ordered.flatMap((value, index) => {
    const previous = ordered[index - 1]
    return index > 0 && value - previous > 1 ? [null, value] : [value]
  })
}

function browserUrl() {
  if (typeof window === 'undefined') return '/'
  return `${window.location.pathname}${window.location.search}${window.location.hash}`
}

function hrefFor(source, target) {
  const raw = source || '/'
  const absolute = /^[a-z][a-z\d+.-]*:/i.test(raw)
  const url = new URL(raw, 'http://klean.invalid')

  if (target === 1) url.searchParams.delete('page')
  else url.searchParams.set('page', String(target))

  return absolute ? url.href : `${url.pathname}${url.search}${url.hash}`
}

const totalPages = computed(() => positiveInteger(props.pages))
const currentPage = computed(() =>
  Math.min(positiveInteger(props.page), totalPages.value)
)
const items = computed(() => pageWindow(currentPage.value, totalPages.value))
const currentUrl = computed(() => inertiaPage.url || browserUrl())
const label = computed(() => attrs['aria-label'] || 'Pagination')
const rootAttrs = computed(() => {
  const {
    class: _class,
    'aria-label': _ariaLabel,
    'aria-busy': _ariaBusy,
    'data-slot': _dataSlot,
    ...rest
  } = attrs
  return rest
})

function isPlainActivation(event) {
  return (
    (event.button === undefined || event.button === 0) &&
    !event.metaKey &&
    !event.ctrlKey &&
    !event.shiftKey &&
    !event.altKey
  )
}

function rememberIntent(event, target) {
  if (!isPlainActivation(event)) return
  if (pendingPage.value === target) {
    event.preventDefault()
    return
  }
  lastIntent.value = target
}

function start(target) {
  pendingPage.value = target
}

function finish(target) {
  if (pendingPage.value === target) pendingPage.value = undefined
}

function linkProps(target) {
  return {
    href: hrefFor(currentUrl.value, target),
    only: props.only,
    preserveScroll: true,
    preserveState: true
  }
}

watch(currentPage, async (nextPage, previousPage) => {
  if (nextPage === previousPage || lastIntent.value !== nextPage) return
  await nextTick()

  if (!root.value?.contains(document.activeElement)) {
    root.value
      ?.querySelector(`[data-slot="page"][data-page="${nextPage}"]`)
      ?.focus({ preventScroll: true })
  }

  lastIntent.value = undefined
})
</script>

<template>
  <nav
    v-if="totalPages > 1"
    ref="root"
    v-bind="rootAttrs"
    data-slot="pagination"
    :aria-label="label"
    :aria-busy="pendingPage ? 'true' : undefined"
    :class="twMerge('w-full', attrs.class)"
  >
    <ul class="flex items-center justify-between gap-2 sm:justify-center">
      <li>
        <Link
          v-if="currentPage > 1"
          v-bind="linkProps(currentPage - 1)"
          data-slot="previous"
          :data-page="currentPage - 1"
          :data-pending="pendingPage === currentPage - 1 ? '' : undefined"
          :aria-label="`Go to page ${currentPage - 1}`"
          :class="LINK_CLASSES"
          @click="rememberIntent($event, currentPage - 1)"
          @start="start(currentPage - 1)"
          @finish="finish(currentPage - 1)"
          @cancel="finish(currentPage - 1)"
          @error="finish(currentPage - 1)"
        >
          <svg
            aria-hidden="true"
            class="size-4"
            viewBox="0 0 20 20"
            fill="none"
          >
            <path
              d="m12.5 15-5-5 5-5"
              stroke="currentColor"
              stroke-width="1.75"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
          <span class="hidden sm:inline">Previous</span>
        </Link>
        <span
          v-else
          data-slot="previous"
          aria-disabled="true"
          :class="DISABLED_CLASSES"
        >
          <svg
            aria-hidden="true"
            class="size-4"
            viewBox="0 0 20 20"
            fill="none"
          >
            <path
              d="m12.5 15-5-5 5-5"
              stroke="currentColor"
              stroke-width="1.75"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
          <span class="hidden sm:inline">Previous</span>
        </span>
      </li>

      <li class="sm:hidden">
        <span
          data-slot="summary"
          aria-current="page"
          class="px-2 text-sm text-gray-600 tabular-nums dark:text-gray-300"
        >
          Page {{ currentPage }} of {{ totalPages }}
        </span>
      </li>

      <li
        v-for="(item, index) in items"
        :key="item ?? `ellipsis-${index}`"
        class="hidden sm:block"
      >
        <span
          v-if="item === null"
          data-slot="ellipsis"
          class="inline-flex min-h-11 min-w-8 items-center justify-center text-sm text-gray-400 dark:text-gray-500"
        >
          <span aria-hidden="true">…</span>
          <span class="sr-only">More pages</span>
        </span>
        <Link
          v-else
          v-bind="linkProps(item)"
          data-slot="page"
          :data-page="item"
          :data-state="item === currentPage ? 'current' : undefined"
          :data-pending="pendingPage === item ? '' : undefined"
          :aria-current="item === currentPage ? 'page' : undefined"
          :aria-label="
            item === currentPage
              ? `Page ${item}, current page`
              : `Go to page ${item}`
          "
          :class="
            twMerge(LINK_CLASSES, item === currentPage && CURRENT_CLASSES)
          "
          @click="rememberIntent($event, item)"
          @start="start(item)"
          @finish="finish(item)"
          @cancel="finish(item)"
          @error="finish(item)"
        >
          {{ item }}
        </Link>
      </li>

      <li>
        <Link
          v-if="currentPage < totalPages"
          v-bind="linkProps(currentPage + 1)"
          data-slot="next"
          :data-page="currentPage + 1"
          :data-pending="pendingPage === currentPage + 1 ? '' : undefined"
          :aria-label="`Go to page ${currentPage + 1}`"
          :class="LINK_CLASSES"
          @click="rememberIntent($event, currentPage + 1)"
          @start="start(currentPage + 1)"
          @finish="finish(currentPage + 1)"
          @cancel="finish(currentPage + 1)"
          @error="finish(currentPage + 1)"
        >
          <span class="hidden sm:inline">Next</span>
          <svg
            aria-hidden="true"
            class="size-4"
            viewBox="0 0 20 20"
            fill="none"
          >
            <path
              d="m7.5 5 5 5-5 5"
              stroke="currentColor"
              stroke-width="1.75"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
        </Link>
        <span
          v-else
          data-slot="next"
          aria-disabled="true"
          :class="DISABLED_CLASSES"
        >
          <span class="hidden sm:inline">Next</span>
          <svg
            aria-hidden="true"
            class="size-4"
            viewBox="0 0 20 20"
            fill="none"
          >
            <path
              d="m7.5 5 5 5-5 5"
              stroke="currentColor"
              stroke-width="1.75"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
        </span>
      </li>
    </ul>
  </nav>
</template>
