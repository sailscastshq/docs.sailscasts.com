<script setup>
import Table from './Table.vue'

const queryRows = [
  { id: 4012, email: 'kelvin@example.com', plan: 'Pro', total: '$48.00' },
  { id: 4011, email: 'mira@example.com', plan: 'Team', total: '$120.00' },
  { id: 4010, email: 'ada@example.com', plan: 'Pro', total: '$48.00' }
]

const invoiceRows = [
  { item: 'Brand direction', quantity: 1, amount: '$1,600.00' },
  { item: 'Landing page', quantity: 2, amount: '$2,400.00' },
  { item: 'Launch support', quantity: 4, amount: '$800.00' }
]
</script>

<template>
  <div class="grid w-full gap-8 xl:grid-cols-2">
    <article
      class="overflow-hidden rounded-lg border border-gray-800 bg-gray-950 text-white"
    >
      <header class="px-5 py-4">
        <p class="font-mono text-xs uppercase tracking-wider text-gray-500">
          Slipway / SQL result
        </p>
        <h2 class="mt-1 text-lg font-semibold">customers · 3 rows</h2>
      </header>
      <div class="overflow-x-auto">
        <Table class="min-w-128 text-gray-100 dark:text-gray-100">
          <caption class="sr-only">
            Latest customer query results
          </caption>
          <thead
            class="border-y border-gray-800 bg-gray-900 font-mono text-xs uppercase tracking-wider text-gray-400"
          >
            <tr>
              <th scope="col" class="px-5 py-3 font-medium">id</th>
              <th scope="col" class="px-5 py-3 font-medium">email</th>
              <th scope="col" class="px-5 py-3 font-medium">plan</th>
              <th scope="col" class="px-5 py-3 text-right font-medium">
                total
              </th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-900 font-mono text-xs">
            <tr v-for="row in queryRows" :key="row.id" class="hover:bg-white/5">
              <td class="px-5 py-3 text-gray-400 tabular-nums">{{ row.id }}</td>
              <td class="px-5 py-3">{{ row.email }}</td>
              <td class="px-5 py-3">{{ row.plan }}</td>
              <td class="px-5 py-3 text-right tabular-nums">{{ row.total }}</td>
            </tr>
          </tbody>
        </Table>
      </div>
    </article>

    <article
      class="overflow-hidden border-2 border-black bg-[#f7f3eb] p-6 text-black shadow-[6px_6px_0_0_#000]"
    >
      <p class="font-mono text-xs uppercase tracking-wider text-black/55">
        Hagfish / report ledger
      </p>
      <h2 class="mt-2 text-2xl font-semibold tracking-tight">
        Invoice INV-1042
      </h2>
      <div class="mt-6 overflow-x-auto">
        <Table
          class="min-w-112 border-separate border-spacing-0 text-black dark:text-black"
        >
          <caption class="sr-only">
            Invoice INV-1042 line item report
          </caption>
          <thead
            class="font-mono text-xs uppercase tracking-wider text-black/55"
          >
            <tr>
              <th
                scope="col"
                class="border-b-2 border-black py-3 pr-6 font-medium"
              >
                Work
              </th>
              <th
                scope="col"
                class="border-b-2 border-black px-6 py-3 text-right font-medium"
              >
                Qty
              </th>
              <th
                scope="col"
                class="border-b-2 border-black py-3 pl-6 text-right font-medium"
              >
                Amount
              </th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="row in invoiceRows" :key="row.item">
              <th
                scope="row"
                class="border-b border-black/20 py-4 pr-6 font-medium"
              >
                {{ row.item }}
              </th>
              <td
                class="border-b border-black/20 px-6 py-4 text-right tabular-nums"
              >
                {{ row.quantity }}
              </td>
              <td
                class="border-b border-black/20 py-4 pl-6 text-right font-semibold tabular-nums"
              >
                {{ row.amount }}
              </td>
            </tr>
          </tbody>
        </Table>
      </div>
    </article>
  </div>
</template>
