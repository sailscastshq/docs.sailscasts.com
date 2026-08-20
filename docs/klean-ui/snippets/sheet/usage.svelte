<Button commandfor="project-details" command="show-modal">Open details</Button>

<Sheet id="project-details" aria-labelledby="project-details-title">
  <article class="grid h-full grid-rows-[auto_minmax(0,1fr)_auto]">
    <header class="flex items-center justify-between border-b p-5">
      <h2 id="project-details-title">Project details</h2>
      <Button
        commandfor="project-details"
        command="request-close"
        autofocus
        aria-label="Close project details"
      >
        ×
      </Button>
    </header>

    <div class="overflow-y-auto p-5">Your application content.</div>
  </article>
</Sheet>
