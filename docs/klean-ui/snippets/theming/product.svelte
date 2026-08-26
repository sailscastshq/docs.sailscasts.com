<!-- assets/js/components/DeployButton.svelte -->
<script>
  import { twMerge } from 'tailwind-merge'
  import Button from './ui/button/Button.svelte'

  const classes =
    'min-h-11 bg-emerald-700 px-5 font-semibold text-white hover:bg-emerald-800'

  let { children, class: className, ...props } = $props()
</script>

<Button {...props} class={twMerge(classes, className)}>
  {@render children?.()}
</Button>
