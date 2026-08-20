<template>
  <aside class="hidden w-64 border-r lg:block">
    <nav aria-label="Project"><!-- desktop navigation --></nav>
  </aside>

  <Button commandfor="mobile-navigation" command="show-modal" class="lg:hidden">
    Open navigation
  </Button>

  <Sheet
    id="mobile-navigation"
    aria-labelledby="mobile-navigation-title"
    class="right-auto left-0 mr-auto ml-0 w-72 -translate-x-full border-r border-l-0 open:translate-x-0 starting:open:-translate-x-full"
  >
    <header class="flex items-center justify-between p-4">
      <h2 id="mobile-navigation-title">Slipway</h2>
      <Button
        commandfor="mobile-navigation"
        command="request-close"
        autofocus
        aria-label="Close navigation"
      >
        ×
      </Button>
    </header>
    <nav aria-label="Project"><!-- mobile navigation --></nav>
  </Sheet>
</template>
