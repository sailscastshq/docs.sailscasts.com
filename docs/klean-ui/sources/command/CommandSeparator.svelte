<script>
  import { twMerge } from "tailwind-merge";
  let { class: className = "", ...separatorProps } = $props();
</script>

<hr
  {...separatorProps}
  data-slot="command-separator"
  class={twMerge(
    "-mx-1 my-1 h-px border-0 bg-gray-200 dark:bg-gray-800",
    className,
  )}
/>
