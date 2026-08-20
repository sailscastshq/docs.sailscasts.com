<Button commandfor="invoice-comments" command="show-modal">
  Open comments
</Button>

<Sheet
  id="invoice-comments"
  aria-labelledby="invoice-comments-title"
  class="inset-x-0 top-auto bottom-0 m-0 mt-auto h-auto max-h-[70dvh] w-full max-w-none translate-x-0 translate-y-full rounded-t-2xl border-x-0 border-b-0 border-t open:translate-y-0 starting:open:translate-x-0 starting:open:translate-y-full"
>
  <header class="flex items-center justify-between px-5 py-4">
    <h2 id="invoice-comments-title">Comments</h2>
    <Button
      commandfor="invoice-comments"
      command="request-close"
      autofocus
      aria-label="Close comments"
    >
      ×
    </Button>
  </header>

  <section
    aria-label="Invoice discussion"
    class="max-h-[50dvh] overflow-y-auto px-5 pb-[max(1.25rem,env(safe-area-inset-bottom))]"
  >
    <!-- comment thread and form -->
  </section>
</Sheet>
