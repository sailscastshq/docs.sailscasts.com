<script setup>
import Button from '~/components/ui/button/Button.vue'
import Dialog from '~/components/ui/dialog/Dialog.vue'
</script>

<template>
  <section class="bg-[#f7f3eb] p-8">
    <p
      class="mb-5 text-xs font-medium uppercase tracking-[0.18em] text-black/60"
    >
      Hagfish / invoice editor
    </p>
    <Button
      commandfor="delete-invoice"
      command="show-modal"
      class="rounded-lg border-2 border-black bg-black text-white hover:bg-white hover:text-black hover:shadow-[4px_4px_0_0_rgba(0,0,0,1)]"
    >
      Delete draft
    </Button>
    <Dialog
      id="delete-invoice"
      aria-labelledby="delete-invoice-title"
      aria-describedby="delete-invoice-description"
      class="max-w-md rounded-2xl border-2 border-black p-6 shadow-[4px_4px_0_0_rgba(0,0,0,1)]"
    >
      <p class="text-xs font-medium uppercase tracking-wider text-red-700">
        Permanent action
      </p>
      <h2 id="delete-invoice-title" class="mt-1 text-xl font-semibold">
        Delete this draft invoice?
      </h2>
      <p
        id="delete-invoice-description"
        class="mt-4 text-sm leading-6 text-black/60"
      >
        INV-1042 and its public link will be permanently removed.
      </p>
      <form
        method="dialog"
        class="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end"
      >
        <Button
          type="submit"
          value="cancel"
          autofocus
          class="border-2 border-black bg-white text-black hover:bg-black hover:text-white"
        >
          Cancel
        </Button>
        <Button
          type="submit"
          value="delete"
          class="border-2 border-red-700 bg-red-700 text-white hover:bg-white hover:text-red-700"
        >
          Delete invoice
        </Button>
      </form>
    </Dialog>
  </section>

  <section class="dark bg-gray-950 p-8 text-white">
    <p class="mb-5 font-mono text-xs uppercase tracking-[0.18em] text-gray-400">
      Slipway / project settings
    </p>
    <Button
      commandfor="delete-project"
      command="show-modal"
      class="min-h-9 min-w-0 bg-red-600 px-3 py-1.5 text-sm text-white hover:bg-red-700"
    >
      Delete project
    </Button>
    <Dialog
      id="delete-project"
      aria-labelledby="delete-project-title"
      aria-describedby="delete-project-description"
      class="max-w-sm border-gray-700 bg-gray-900 p-6 text-white shadow-xl"
    >
      <h2 id="delete-project-title" class="text-lg font-semibold">
        Delete project?
      </h2>
      <p id="delete-project-description" class="mt-2 text-sm text-gray-400">
        Recovery data remains unless you choose to purge it.
      </p>
      <form method="dialog" class="mt-5 flex justify-end gap-3">
        <Button
          type="submit"
          value="cancel"
          autofocus
          class="min-h-9 min-w-0 border border-gray-600 bg-transparent px-3 py-1.5 text-sm text-gray-300 hover:bg-gray-800"
        >
          Cancel
        </Button>
        <Button
          type="submit"
          value="delete"
          class="min-h-9 min-w-0 bg-red-600 px-3 py-1.5 text-sm text-white hover:bg-red-700"
        >
          Delete
        </Button>
      </form>
    </Dialog>
  </section>
</template>
