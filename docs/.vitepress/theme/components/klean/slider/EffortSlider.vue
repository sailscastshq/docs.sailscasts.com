<script setup>
import { computed, ref } from 'vue'
import Slider from './Slider.vue'
import Bolt from '../icons/Bolt.vue'
import Refresh from '../icons/Refresh.vue'

const effort = ref(2)
const levels = ['Low', 'Medium', 'High', 'Very high', 'Ultra']
const ultra = computed(() => effort.value === 5)
const accentClasses = computed(() =>
  ultra.value
    ? 'text-violet-600 dark:text-violet-400'
    : 'text-blue-500 dark:text-blue-400'
)
const sliderClasses = computed(() =>
  [
    'h-16 [--thumb-size:3.5rem]',
    accentClasses.value,
    '**:data-[slot=slider-track]:h-12 **:data-[slot=slider-track]:bg-gray-100 **:data-[slot=slider-track]:ring-1 **:data-[slot=slider-track]:ring-gray-200',
    '**:data-[slot=slider-mark]:size-2 **:data-[slot=slider-mark]:bg-gray-400/65',
    '[&>input::-webkit-slider-thumb]:border-gray-200 [&>input::-webkit-slider-thumb]:shadow-md',
    '[&>input::-moz-range-thumb]:border-gray-200 [&>input::-moz-range-thumb]:shadow-md',
    ultra.value
      ? '**:data-[slot=slider-fill]:bg-[linear-gradient(90deg,#2563eb,#a78bfa,#7c3aed)] **:data-[slot=slider-mark]:opacity-0'
      : ''
  ].join(' ')
)
</script>

<template>
  <section
    class="w-full max-w-md rounded-3xl border border-gray-200 bg-white px-6 py-5 shadow-sm dark:border-gray-700 dark:bg-gray-950"
    aria-labelledby="effort-title"
  >
    <div class="mb-5 grid grid-cols-[2.75rem_1fr_2.75rem] items-start gap-3">
      <Bolt class="mt-2 size-6" :class="accentClasses" />
      <div class="text-center">
        <label id="effort-title" for="effort-slider" class="sr-only"
          >Thinking effort</label
        >
        <output
          for="effort-slider"
          class="block text-2xl font-medium"
          :class="accentClasses"
          >{{ levels[effort - 1] }}</output
        >
        <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Thinking effort
        </p>
      </div>
      <button
        type="button"
        aria-label="Reset thinking effort to Medium"
        class="grid size-11 cursor-pointer place-items-center rounded-full text-gray-400 hover:bg-gray-100 hover:text-gray-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500 dark:hover:bg-gray-800 dark:hover:text-white"
        @click="effort = 2"
      >
        <Refresh class="size-6" />
      </button>
    </div>
    <Slider
      id="effort-slider"
      v-model="effort"
      :min="1"
      :max="5"
      :marks="[2, 3, 4]"
      :value-text="(value) => levels[value - 1]"
      :class="sliderClasses"
    />
  </section>
</template>
