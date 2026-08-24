<Slide :pending="deploying" @confirm="deploy">
  {{ deploying ? 'Deploying…' : 'Slide to deploy' }}

  <template #thumb="{ pending }">
    <img
      src="/mascot.svg"
      alt=""
      class="size-6"
      :class="pending ? 'animate-spin motion-reduce:animate-none' : ''"
    />
  </template>
</Slide>
