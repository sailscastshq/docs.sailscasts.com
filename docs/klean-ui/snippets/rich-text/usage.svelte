<script>
  import RichText from '@/components/ui/rich-text/RichText.svelte'

  let abstract = $state(
    '<p>A practical look at building resilient web applications, with the decisions and trade-offs behind a working demo.</p>'
  )
</script>

<div class="grid gap-2">
  <label for="proposal-abstract" class="text-sm font-medium"
    >Talk abstract</label
  >
  <RichText
    id="proposal-abstract"
    bind:value={abstract}
    name="abstract"
    required
    aria-describedby="proposal-abstract-help"
    placeholder="The problem, your approach, and why it matters."
  />
  <p id="proposal-abstract-help" class="text-sm text-gray-600">
    Explain what attendees will learn. Use headings, lists, and links where they
    help.
  </p>
</div>
