<script setup>
import Avatar from './Avatar.vue'
import Button from '../Button.vue'
import Spinner from '../spinner/Spinner.vue'

function portrait({ background, shirt, skin, hair, accent }) {
  const source = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 160">
    <rect width="160" height="160" fill="${background}"/>
    <circle cx="80" cy="69" r="35" fill="${skin}"/>
    <path d="M35 160c4-34 20-53 45-53s41 19 45 53" fill="${shirt}"/>
    <path d="M47 66c0-31 15-47 34-47 24 0 36 17 34 49-8-3-15-9-20-18-13 12-28 18-48 16Z" fill="${hair}"/>
    <circle cx="68" cy="72" r="3" fill="#111827"/>
    <circle cx="93" cy="72" r="3" fill="#111827"/>
    <path d="M70 89c8 6 16 6 23 0" fill="none" stroke="${accent}" stroke-width="3" stroke-linecap="round"/>
  </svg>`

  return `data:image/svg+xml,${encodeURIComponent(source)}`
}

const kelvin = portrait({
  background: '#dbeafe',
  shirt: '#172554',
  skin: '#70412f',
  hair: '#0a0a0a',
  accent: '#4c291f'
})

const maya = portrait({
  background: '#ede9fe',
  shirt: '#4c1d95',
  skin: '#c47e5e',
  hair: '#292524',
  accent: '#854d3a'
})

const comments = [
  {
    name: 'Kelvin Omereshone',
    initials: 'KO',
    src: kelvin,
    message: 'The schedule is ready to send.'
  },
  {
    name: 'Ada Okafor',
    initials: 'AO',
    src: '',
    message: 'Perfect. I checked the invoice dates.'
  }
]

const teams = [
  { name: 'Slipway', initials: 'SW', src: kelvin },
  { name: 'Sailscasts', initials: 'SC', src: '' },
  { name: 'Boring Stack', initials: 'BS', src: maya }
]
</script>

<template>
  <div class="grid gap-8 lg:grid-cols-2">
    <article class="space-y-3">
      <p
        class="m-0! font-mono text-[11px] uppercase tracking-[0.18em] text-gray-500"
      >
        Hagfish / invoice discussion
      </p>
      <div
        class="border-2 border-black bg-[#f7f3eb] p-5 shadow-[6px_6px_0_0_#000] dark:border-white dark:bg-gray-950 dark:shadow-[6px_6px_0_0_#fff]"
      >
        <a
          href="#avatar-products"
          class="flex items-center gap-3 border-b-2 border-black pb-4 no-underline dark:border-white"
        >
          <span class="relative inline-flex">
            <Avatar
              :src="kelvin"
              alt=""
              class="size-11 rounded-lg bg-black font-mono text-white dark:bg-white dark:text-black"
              >KO</Avatar
            >
            <span
              class="absolute -right-1 -bottom-1 grid size-3 rounded-sm border-2 border-[#f7f3eb] bg-emerald-500 dark:border-gray-950"
            >
              <span class="sr-only">Online</span>
            </span>
          </span>
          <span>
            <strong class="block text-sm">Kelvin Omereshone</strong>
            <span class="text-xs text-gray-600 dark:text-gray-300"
              >Invoice creator</span
            >
          </span>
          <span aria-hidden="true" class="ml-auto">↗</span>
        </a>

        <ol class="m-0! mt-5! list-none! space-y-5 p-0!">
          <li
            v-for="comment in comments"
            :key="comment.name"
            class="m-0! flex items-start gap-3"
          >
            <Avatar
              :src="comment.src"
              alt=""
              :class="[
                'size-7 text-[10px] font-bold text-white',
                comment.src ? '' : 'bg-gray-900'
              ]"
              >{{ comment.initials }}</Avatar
            >
            <div class="min-w-0">
              <p class="m-0! text-xs font-semibold">{{ comment.name }}</p>
              <p
                class="m-0! mt-1! text-sm leading-6 text-gray-700 dark:text-gray-300"
              >
                {{ comment.message }}
              </p>
            </div>
          </li>
        </ol>
      </div>
    </article>

    <article class="space-y-3">
      <p
        class="m-0! font-mono text-[11px] uppercase tracking-[0.18em] text-gray-500"
      >
        Slipway / team identity
      </p>
      <div
        class="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-950"
      >
        <Button
          type="button"
          class="flex min-h-0 w-full justify-start gap-3 rounded-none border-0 bg-gray-50 px-4 py-3 text-gray-950 shadow-none hover:bg-gray-100 active:bg-gray-100 dark:bg-gray-900 dark:text-white dark:hover:bg-gray-800 dark:active:bg-gray-800"
        >
          <Avatar :src="kelvin" alt="" class="size-7 rounded-md">SW</Avatar>
          <span class="text-sm font-medium">Slipway</span>
          <svg
            aria-hidden="true"
            class="ml-auto size-4 text-gray-400"
            viewBox="0 0 20 20"
            fill="none"
            stroke="currentColor"
          >
            <path
              d="m6 8 4 4 4-4"
              stroke-width="1.75"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
        </Button>
        <ul
          class="m-0! list-none! border-t border-gray-200 p-1.5! dark:border-gray-800"
        >
          <li v-for="team in teams" :key="team.name" class="m-0!">
            <button
              type="button"
              class="flex w-full cursor-pointer items-center gap-3 rounded-lg px-3 py-2 text-left text-sm hover:bg-gray-100 dark:hover:bg-gray-900"
            >
              <Avatar
                :src="team.src"
                alt=""
                class="size-6 rounded-md bg-gray-900 text-[10px] text-white dark:bg-gray-100 dark:text-gray-950"
                >{{ team.initials }}</Avatar
              >
              <span class="flex-1">{{ team.name }}</span>
              <span
                v-if="team.name === 'Slipway'"
                aria-label="Current team"
                class="text-emerald-600"
                >✓</span
              >
            </button>
          </li>
        </ul>
        <div class="border-t border-gray-200 p-4 dark:border-gray-800">
          <p class="m-0! text-xs font-medium text-gray-500 dark:text-gray-400">
            Profile preview
          </p>
          <div class="mt-3 flex items-center gap-4">
            <span class="relative inline-flex">
              <Avatar
                :src="maya"
                alt="Boring Stack team logo"
                class="size-16 rounded-xl"
                >BS</Avatar
              >
              <span
                role="status"
                class="absolute inset-0 grid place-items-center rounded-xl bg-black/55"
              >
                <Spinner class="size-5 text-white" />
                <span class="sr-only">Uploading team logo</span>
              </span>
            </span>
            <div>
              <p class="m-0! text-sm font-medium">Boring Stack</p>
              <p class="m-0! mt-1! text-xs text-gray-500 dark:text-gray-400">
                Uploading a new logo…
              </p>
            </div>
          </div>
        </div>
      </div>
    </article>
  </div>
</template>
