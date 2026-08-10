<template>
  <!-- Compact secondary status -->
  <Spinner class="size-3 text-gray-500" />

  <!-- Prominent application status -->
  <Spinner class="size-8 text-sky-600" />

  <!-- Product-owned mark, sized by the same wrapper -->
  <Spinner class="size-6 text-white">
    <ProductLoader />
  </Spinner>
</template>
