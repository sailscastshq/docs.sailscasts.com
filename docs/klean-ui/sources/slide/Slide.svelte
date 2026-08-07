<script>
  import { onMount, untrack } from "svelte";
  import { twMerge } from "tailwind-merge";

  const CONFIRM_THRESHOLD = 0.85;

  const BASE_CLASSES = [
    "group/slide relative inline-grid min-h-11 w-56 max-w-full touch-none cursor-grab select-none overflow-hidden rounded-full border border-gray-300 bg-gray-100 p-1 text-sm font-medium text-gray-700 shadow-sm outline-none",
    "focus-visible:ring-2 focus-visible:ring-gray-950 focus-visible:ring-offset-2",
    "disabled:cursor-not-allowed disabled:opacity-50",
    "dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 dark:focus-visible:ring-white",
  ];

  const FILL_CLASSES = [
    "pointer-events-none absolute inset-y-0 start-0 bg-gray-200",
    "transition-[width,background-color] duration-200 ease-out group-data-[state=dragging]/slide:transition-none motion-reduce:transition-none",
    "dark:bg-gray-800",
  ];

  const THUMB_CLASSES = [
    "pointer-events-none absolute top-1 start-1 z-20 flex size-9 items-center justify-center rounded-full bg-gray-950 text-white shadow-sm",
    "transition-[transform,background-color,color] duration-200 ease-out group-data-[state=dragging]/slide:transition-none motion-reduce:transition-none",
    "dark:bg-white dark:text-gray-950",
  ];

  let {
    disabled = false,
    pending = false,
    class: className = "",
    onconfirm,
    onclick,
    onkeydown,
    onpointerdown,
    onpointermove,
    onpointerup,
    onpointercancel,
    onlostpointercapture,
    "aria-busy": ariaBusy,
    children,
    ...buttonProps
  } = $props();

  const initialPending = untrack(() => pending);

  let buttonElement;
  let thumbElement;
  let progress = $state(initialPending ? 1 : 0);
  let travel = $state(0);
  let direction = $state(1);
  let activePointer = $state();
  let startX = 0;
  let startProgress = 0;
  let confirmed = $state(initialPending);
  let status = $state(initialPending ? "Action in progress." : "");
  let suppressClick = false;
  let previousPending = initialPending;

  let dragging = $derived(activePointer !== undefined);
  let ready = $derived(progress >= CONFIRM_THRESHOLD);
  let state = $derived(
    pending
      ? "pending"
      : dragging
        ? "dragging"
        : confirmed
          ? "confirmed"
          : "idle",
  );
  let progressState = $derived(
    pending || confirmed
      ? "complete"
      : ready
        ? "ready"
        : progress >= 0.33
          ? "middle"
          : "start",
  );

  function measure() {
    if (!buttonElement || !thumbElement || typeof getComputedStyle === "undefined")
      return;

    const buttonStyle = getComputedStyle(buttonElement);
    const thumbStyle = getComputedStyle(thumbElement);
    const inlineStart = Number.parseFloat(thumbStyle.insetInlineStart) || 0;

    direction =
      buttonElement.dir === "rtl" || buttonStyle.direction === "rtl" ? -1 : 1;
    travel = Math.max(
      0,
      buttonElement.clientWidth - thumbElement.offsetWidth - inlineStart * 2,
    );
  }

  function setProgress(nextProgress) {
    const wasReady = progress >= CONFIRM_THRESHOLD;
    progress = Math.max(0, Math.min(1, nextProgress));

    if (!wasReady && progress >= CONFIRM_THRESHOLD) {
      status = "Release to confirm.";
    } else if (wasReady && progress < CONFIRM_THRESHOLD) {
      status = "Keep sliding.";
    }
  }

  function clearPointer(releaseCapture = true) {
    const pointerId = activePointer;
    activePointer = undefined;

    if (
      releaseCapture &&
      pointerId !== undefined &&
      buttonElement?.hasPointerCapture?.(pointerId)
    ) {
      buttonElement.releasePointerCapture(pointerId);
    }
  }

  function reset(nextStatus = "") {
    clearPointer();
    confirmed = false;
    progress = 0;
    status = nextStatus;
  }

  function cancel() {
    if (activePointer === undefined) return;
    reset("Slide cancelled.");
  }

  function confirm() {
    if (disabled || pending || confirmed) return;

    clearPointer();
    confirmed = true;
    progress = 1;
    status = "Confirmed.";
    onconfirm?.();

    queueMicrotask(() => {
      if (!pending) reset();
    });
  }

  function handlePointerdown(event) {
    onpointerdown?.(event);
    if (
      event.defaultPrevented ||
      disabled ||
      pending ||
      !event.isPrimary ||
      (event.pointerType === "mouse" && event.button !== 0)
    ) {
      return;
    }

    event.preventDefault();
    buttonElement?.focus({ preventScroll: true });
    measure();
    confirmed = false;
    activePointer = event.pointerId;
    startX = event.clientX;
    startProgress = progress;
    status = "Sliding. Move to the end, then release to confirm.";
    buttonElement?.setPointerCapture?.(event.pointerId);
  }

  function handlePointermove(event) {
    onpointermove?.(event);
    if (event.pointerId !== activePointer || event.defaultPrevented) return;

    event.preventDefault();
    measure();
    const delta = direction * (event.clientX - startX);
    setProgress(startProgress + (travel ? delta / travel : 0));
  }

  function handlePointerup(event) {
    onpointerup?.(event);
    if (event.pointerId !== activePointer) return;

    suppressClick = true;
    queueMicrotask(() => {
      suppressClick = false;
    });
    if (ready && !event.defaultPrevented) confirm();
    else reset("Slide cancelled.");
  }

  function handlePointercancel(event) {
    onpointercancel?.(event);
    if (event.pointerId === activePointer) reset("Slide cancelled.");
  }

  function handleLostPointercapture(event) {
    onlostpointercapture?.(event);
    if (event.pointerId === activePointer) reset("Slide cancelled.");
  }

  function handleClick(event) {
    if (suppressClick) {
      suppressClick = false;
      event.preventDefault();
      return;
    }

    if (event.detail !== 0) {
      event.preventDefault();
      return;
    }

    onclick?.(event);
    if (!event.defaultPrevented) confirm();
  }

  function handleKeydown(event) {
    onkeydown?.(event);
    if (event.defaultPrevented || event.key !== "Escape") return;

    cancel();
  }

  $effect(() => {
    const busy = pending;
    const wasPending = previousPending;
    previousPending = busy;

    if (busy) {
      clearPointer();
      confirmed = true;
      progress = 1;
      status = "Action in progress.";
    } else if (wasPending) {
      reset();
    }
  });

  $effect(() => {
    if (disabled) cancel();
  });

  onMount(() => {
    measure();
    if (typeof ResizeObserver === "undefined") return;

    const observer = new ResizeObserver(measure);
    if (buttonElement) observer.observe(buttonElement);
    if (thumbElement) observer.observe(thumbElement);

    return () => {
      clearPointer();
      observer.disconnect();
    };
  });
</script>

<button
  {...buttonProps}
  bind:this={buttonElement}
  type="button"
  disabled={disabled || pending}
  aria-busy={pending ? "true" : ariaBusy}
  data-slot="slide"
  data-state={state}
  data-progress={progressState}
  class={twMerge(BASE_CLASSES, className)}
  onclick={handleClick}
  onkeydown={handleKeydown}
  onpointerdown={handlePointerdown}
  onpointermove={handlePointermove}
  onpointerup={handlePointerup}
  onpointercancel={handlePointercancel}
  onlostpointercapture={handleLostPointercapture}
>
  <span
    aria-hidden="true"
    data-slot="slide-fill"
    class={FILL_CLASSES.join(" ")}
    style:width={`${progress * 100}%`}
  ></span>
  <span
    data-slot="slide-label"
    class="pointer-events-none relative z-10 flex min-w-0 items-center justify-center px-11 text-center"
  >
    {#if ready && !pending}
      Release to confirm
    {:else}
      {@render children?.()}
    {/if}
  </span>
  <span
    bind:this={thumbElement}
    aria-hidden="true"
    data-slot="slide-thumb"
    class={THUMB_CLASSES.join(" ")}
    style:transform={`translateX(${direction * progress * travel}px)`}
  >
    <svg
      class="size-4 rtl:rotate-180"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
    >
      <path
        d="m9 5 7 7-7 7"
        stroke-linecap="round"
        stroke-linejoin="round"
      ></path>
    </svg>
  </span>
  <span data-slot="slide-status" class="sr-only" aria-live="polite">
    {status}
  </span>
</button>
