<script>
  import { twMerge } from "tailwind-merge";
  let { class: className = "", children, ...shortcutProps } = $props();
</script>

<kbd
  {...shortcutProps}
  aria-hidden="true"
  data-slot="command-shortcut"
  class={twMerge(
    "ml-auto text-xs tracking-widest text-gray-500 dark:text-gray-400",
    className,
  )}
>
  {@render children?.()}
</kbd>
