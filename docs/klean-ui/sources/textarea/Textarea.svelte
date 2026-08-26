<script>
  import { onMount, tick } from "svelte";
  import { twMerge } from "tailwind-merge";

  const BASE_CLASSES = [
    "block h-(--klean-textarea-height) min-h-28 w-full resize-none overflow-y-hidden rounded-md border border-gray-300 bg-white px-3 py-2 text-base text-gray-950 shadow-sm outline-none transition-colors duration-150",
    "placeholder:text-gray-500 hover:border-gray-400",
    "focus-visible:border-gray-950 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-950",
    "disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-gray-500",
    "aria-invalid:border-red-600 aria-invalid:focus-visible:outline-red-600",
    "dark:border-gray-700 dark:bg-gray-950 dark:text-white dark:placeholder:text-gray-400 dark:hover:border-gray-600 dark:focus-visible:border-white dark:focus-visible:outline-white dark:disabled:bg-gray-900 dark:disabled:text-gray-500 dark:aria-invalid:border-red-500 dark:aria-invalid:focus-visible:outline-red-500",
    "motion-reduce:transition-none",
  ];

  let { value = $bindable(), class: className, oninput, ...props } = $props();

  let element;

  function resizeToContent() {
    if (!element) return;
    element.style.removeProperty("--klean-textarea-height");
    element.style.setProperty(
      "--klean-textarea-height",
      `${element.scrollHeight}px`,
    );
  }

  function handleInput(event) {
    resizeToContent();
    oninput?.(event);
  }

  onMount(() => {
    resizeToContent();
    if (typeof ResizeObserver === "undefined") return;
    let width = element.offsetWidth;
    const observer = new ResizeObserver(([entry]) => {
      if (entry.contentRect.width === width) return;
      width = entry.contentRect.width;
      resizeToContent();
    });
    observer.observe(element);
    return () => observer.disconnect();
  });

  $effect(() => {
    value;
    tick().then(resizeToContent);
  });
</script>

<textarea
  bind:this={element}
  {...props}
  bind:value
  data-slot="textarea"
  class={twMerge(BASE_CLASSES, className)}
  oninput={handleInput}></textarea>
