<script setup>
import { Link } from "@inertiajs/vue3";
import { computed, useAttrs } from "vue";
import { twMerge } from "tailwind-merge";

defineOptions({ inheritAttrs: false });

const props = defineProps({
  /** Ordered ancestors followed by the current page. */
  items: { type: Array, required: true },
});

const attrs = useAttrs();
const crumbs = computed(() => props.items ?? []);
const lastIndex = computed(() => crumbs.value.length - 1);
const collapses = computed(() => crumbs.value.length > 3);
const label = computed(() => attrs["aria-label"] || "Breadcrumb");
const rootAttrs = computed(() => {
  const {
    class: _class,
    "aria-label": _ariaLabel,
    "data-slot": _dataSlot,
    ...rest
  } = attrs;
  return rest;
});

const LINK_CLASSES =
  "inline-flex min-h-11 min-w-0 max-w-48 cursor-pointer items-center rounded-sm px-1 text-gray-500 no-underline transition-colors hover:text-gray-950 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-950 dark:text-gray-400 dark:hover:text-white dark:focus-visible:outline-white";
const LABEL_CLASSES =
  "inline-flex min-h-11 min-w-0 max-w-48 items-center px-1 text-gray-500 dark:text-gray-400";
const CURRENT_CLASSES =
  "inline-flex min-h-11 min-w-0 max-w-64 items-center px-1 font-medium text-gray-950 dark:text-white";

function itemClass(index) {
  return twMerge(
    "flex min-w-0 shrink-0 items-center gap-1.5",
    collapses.value && index > 0 && index < lastIndex.value - 1
      ? "hidden @lg:flex"
      : undefined,
    index === lastIndex.value ? "shrink" : undefined,
  );
}
</script>

<template>
  <nav
    v-if="crumbs.length"
    v-bind="rootAttrs"
    data-slot="breadcrumb"
    :aria-label="label"
    :class="twMerge('@container min-w-0', attrs.class)"
  >
    <ol data-slot="list" class="flex min-w-0 items-center gap-1.5 overflow-hidden text-sm">
      <template v-for="(item, index) in crumbs" :key="`${index}-${item.label}`">
        <li
          v-if="collapses && index === lastIndex - 1"
          data-slot="ellipsis"
          class="flex shrink-0 items-center gap-1.5 @lg:hidden"
        >
          <svg data-slot="separator" aria-hidden="true" class="size-3.5 shrink-0 text-gray-400 dark:text-gray-600" viewBox="0 0 16 16" fill="none">
            <path d="m6 3.5 4.5 4.5L6 12.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
          </svg>
          <span class="inline-flex min-h-11 items-center px-1 text-gray-400 dark:text-gray-500">
            <span aria-hidden="true">…</span>
            <span class="sr-only">Collapsed breadcrumb items</span>
          </span>
        </li>

        <li
          data-slot="item"
          :data-index="index"
          :data-state="index === lastIndex ? 'current' : undefined"
          :class="itemClass(index)"
        >
          <svg
            v-if="index > 0"
            data-slot="separator"
            aria-hidden="true"
            class="size-3.5 shrink-0 text-gray-400 dark:text-gray-600"
            viewBox="0 0 16 16"
            fill="none"
          >
            <path d="m6 3.5 4.5 4.5L6 12.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
          </svg>

          <span
            v-if="index === lastIndex"
            data-slot="current"
            aria-current="page"
            :title="item.title"
            :class="CURRENT_CLASSES"
          >
            <span class="truncate">{{ item.label }}</span>
          </span>
          <Link
            v-else-if="item.href"
            :href="item.href"
            data-slot="link"
            :title="item.title"
            :class="LINK_CLASSES"
          >
            <span class="truncate">{{ item.label }}</span>
          </Link>
          <span
            v-else
            data-slot="label"
            :title="item.title"
            :class="LABEL_CLASSES"
          >
            <span class="truncate">{{ item.label }}</span>
          </span>
        </li>
      </template>
    </ol>
  </nav>
</template>
