<script>
  import { onMount, tick } from "svelte";
  import { twMerge } from "tailwind-merge";
  import { toast } from "../toast.js";

  const POSITIONS = {
    "top-left": "left-4 top-4 items-start",
    "top-center": "left-1/2 top-4 -translate-x-1/2 items-center",
    "top-right": "right-4 top-4 items-end",
    "bottom-left": "bottom-4 left-4 items-start",
    "bottom-center": "bottom-4 left-1/2 -translate-x-1/2 items-center",
    "bottom-right": "bottom-4 right-4 items-end",
  };

  const POSITION_EDGES = {
    "top-left": ["top", "left"],
    "top-center": ["top"],
    "top-right": ["top", "right"],
    "bottom-left": ["bottom", "left"],
    "bottom-center": ["bottom"],
    "bottom-right": ["bottom", "right"],
  };

  const NEARBY_DURATION = { enter: 300, leave: 200 };
  const CROSS_VIEWPORT_DURATION = { enter: 450, leave: 320 };

  function motionVector(direction, position) {
    if (direction === "fade" || direction === "none") return ["0px", "0px"];

    const nearby = POSITION_EDGES[position]?.includes(direction);
    const horizontal = direction === "left" || direction === "right";
    const negative = direction === "left" || direction === "top";
    const distance = nearby
      ? negative
        ? "calc(-100% - 1rem)"
        : "calc(100% + 1rem)"
      : horizontal
        ? negative
          ? "-100vw"
          : "100vw"
        : negative
          ? "-100dvh"
          : "100dvh";

    return horizontal ? [distance, "0px"] : ["0px", distance];
  }

  function motionDuration(phase, direction, position) {
    if (direction === "none") return 0;
    if (["fade", ...POSITION_EDGES[position]].includes(direction)) {
      return NEARBY_DURATION[phase];
    }
    return CROSS_VIEWPORT_DURATION[phase];
  }

  let {
    controller = toast,
    position = "top-right",
    from,
    to,
    label = "Notifications",
    expanded = false,
    class: className = "",
    style = "",
    children,
    ...viewportProps
  } = $props();

  let viewport;
  let items = $state([]);
  let hovered = $state(false);
  let focused = $state(false);
  let pinned = $state(false);
  let heights = $state({});
  let isReading = $derived(hovered || focused || pinned);
  let isExpanded = $derived(expanded || hovered || focused || pinned);
  let stackCount = $derived(
    items.filter((item) => item.state !== "closing").length,
  );
  let stackedItems = $derived(
    position.startsWith("top") ? [...items].reverse() : items,
  );
  function stackDepth(item) {
    return (
      items.length -
      1 -
      items.findIndex((candidate) => candidate.id === item.id)
    );
  }
  let frontHeight = $derived(heights[items.at(-1)?.id] ?? 0);
  let listHeight = $derived(
    isExpanded
      ? items.reduce(
          (total, item) => total + (heights[item.id] ?? frontHeight),
          0,
        )
      : frontHeight,
  );
  $effect(() => {
    const expandedNow = isExpanded;
    const focusedNow = focused;
    const bottom = position.startsWith("bottom");
    tick().then(() => {
      const list = viewport?.querySelector('[data-slot="toast-list"]');
      if (focusedNow)
        document.activeElement?.scrollIntoView?.({
          block: "nearest",
          inline: "nearest",
        });
      else if (expandedNow && bottom && list)
        list.scrollTop = list.scrollHeight;
    });
  });
  function rowOffset(item) {
    const index = stackedItems.findIndex(
      (candidate) => candidate.id === item.id,
    );
    return isExpanded
      ? stackedItems
          .slice(0, index)
          .reduce(
            (total, candidate) =>
              total + (heights[candidate.id] ?? frontHeight),
            0,
          )
      : 0;
  }
  $effect(() => {
    const snapshot = items;
    let observer;
    let active = true;
    tick().then(() => {
      if (!active) return;
      const cards = [
        ...(viewport?.querySelectorAll("[data-klean-toast-item]") ?? []),
      ];
      function measure() {
        heights = Object.fromEntries(
          cards.map((element) => {
            const row = element.parentElement;
            return [
              row.dataset.toastId,
              row.dataset.state === "closing"
                ? (heights[row.dataset.toastId] ?? element.offsetHeight + 12)
                : element.offsetHeight + 12,
            ];
          }),
        );
      }
      observer =
        typeof ResizeObserver === "undefined"
          ? null
          : new ResizeObserver(measure);
      for (const card of cards) observer?.observe(card);
      measure();
    });
    return () => {
      active = false;
      observer?.disconnect();
    };
  });
  function setHover(event, value) {
    if (event.pointerType === "mouse") hovered = value;
  }
  function focusStack(event) {
    focused = Boolean(event.target.closest("[data-klean-toast-row]"));
  }
  function blurStack(event) {
    if (!event.currentTarget.contains(event.relatedTarget)) focused = false;
  }
  $effect(() => {
    if (stackCount === 0) {
      pinned = false;
      focused = false;
      hovered = false;
    }
  });
  $effect(() => {
    const activeController = controller;
    if (isReading) activeController.pauseAll("stack-reading");
    else activeController.resumeAll("stack-reading");
    return () => activeController.resumeAll("stack-reading");
  });
  let promotedItemId;
  let defaultDirection = $derived(
    position.endsWith("-left") ? "left" : "right",
  );
  let resolvedFrom = $derived(from ?? defaultDirection);
  let resolvedTo = $derived(to ?? defaultDirection);
  let motionStyle = $derived.by(() => {
    const enter = motionVector(resolvedFrom, position);
    const leave = motionVector(resolvedTo, position);
    const enterDuration = motionDuration("enter", resolvedFrom, position);
    const leaveDuration = motionDuration("leave", resolvedTo, position);
    const collapseDelay = Math.min(80, Math.round(leaveDuration * 0.4));

    return [
      `--klean-toast-enter-x:${enter[0]}`,
      `--klean-toast-enter-y:${enter[1]}`,
      `--klean-toast-leave-x:${leave[0]}`,
      `--klean-toast-leave-y:${leave[1]}`,
      `--klean-toast-enter-duration:${enterDuration}ms`,
      `--klean-toast-leave-duration:${leaveDuration}ms`,
      `--klean-toast-collapse-delay:${collapseDelay}ms`,
      `--klean-toast-collapse-duration:${Math.max(0, leaveDuration - collapseDelay)}ms`,
      style,
    ]
      .filter(Boolean)
      .join(";");
  });

  function syncInstantMotion() {
    queueMicrotask(() => {
      for (const item of controller.getSnapshot()) {
        if (item.state === "entering" && resolvedFrom === "none") {
          controller.completeEnter(item.id);
        } else if (item.state === "closing" && resolvedTo === "none") {
          controller.remove(item.id);
        }
      }
    });
  }

  $effect(() => {
    const activeController = controller;
    promotedItemId = undefined;
    const sync = () => {
      const snapshot = activeController.getSnapshot();
      items = snapshot;
      const enteringItem = snapshot.findLast(
        (item) => item.state === "entering",
      );
      if (enteringItem && enteringItem.id !== promotedItemId) {
        promotedItemId = enteringItem.id;
        const focusedElement = viewport?.contains(document.activeElement)
          ? document.activeElement
          : null;
        try {
          viewport?.hidePopover?.();
        } catch {
          // Not open yet or already closed.
        }
        try {
          viewport?.showPopover?.();
        } catch {
          // Rejected by a partial Popover API implementation.
        }
        focusedElement?.focus({ preventScroll: true });
      }
      syncInstantMotion();
    };

    sync();
    const unsubscribe = activeController.subscribe(sync);
    return unsubscribe;
  });

  function handleAnimationEnd(item, event) {
    if (event.target !== event.currentTarget) return;
    if (item.state === "entering") controller.completeEnter(item.id);
    else if (item.state === "closing") controller.remove(item.id);
  }

  function handleFocusOut(item, event) {
    if (!event.currentTarget.contains(event.relatedTarget)) {
      controller.resume(item.id, "focus");
    }
  }

  function activateAction(item, event) {
    item.action?.onClick?.(event, item);
    controller.dismiss(item.id);
  }

  onMount(() => {
    try {
      viewport?.showPopover?.();
    } catch {
      // Already open or rejected by a partial Popover API implementation.
    }

    function handleVisibility() {
      if (document.hidden) controller.pauseAll("page-hidden");
      else controller.resumeAll("page-hidden");
    }
    function handleBlur() {
      controller.pauseAll("window-blur");
    }
    function handleFocus() {
      controller.resumeAll("window-blur");
    }

    document.addEventListener("visibilitychange", handleVisibility);
    window.addEventListener("blur", handleBlur);
    window.addEventListener("focus", handleFocus);
    handleVisibility();

    return () => {
      try {
        viewport?.hidePopover?.();
      } catch {
        // Already closed during teardown.
      }
      document.removeEventListener("visibilitychange", handleVisibility);
      window.removeEventListener("blur", handleBlur);
      window.removeEventListener("focus", handleFocus);
      controller.resumeAll("page-hidden");
      controller.resumeAll("window-blur");
    };
  });
</script>

<section
  bind:this={viewport}
  {...viewportProps}
  popover="manual"
  data-slot="toast-viewport"
  data-position={position}
  data-from={resolvedFrom}
  data-to={resolvedTo}
  data-expanded={isExpanded}
  data-focused={focused}
  data-stack-count={stackCount}
  aria-label={label}
  aria-live="polite"
  aria-atomic="false"
  aria-relevant="additions text"
  class={twMerge(
    "pointer-events-none fixed inset-auto z-100 m-0 flex w-[min(24rem,calc(100vw-2rem))] flex-col border-0 bg-transparent p-0",
    POSITIONS[position],
    className,
  )}
  style={motionStyle}
  onpointerenter={(event) => {
    setHover(event, true);
    viewportProps.onpointerenter?.(event);
  }}
  onpointerleave={(event) => {
    setHover(event, false);
    viewportProps.onpointerleave?.(event);
  }}
  onfocusin={(event) => {
    focusStack(event);
    viewportProps.onfocusin?.(event);
  }}
  onfocusout={(event) => {
    blurStack(event);
    viewportProps.onfocusout?.(event);
  }}
>
  <ol
    data-slot="toast-list"
    style={`height:${listHeight ? `${listHeight}px` : "auto"};--klean-toast-front-height:${frontHeight ? `${frontHeight}px` : "none"}`}
    class="m-0 flex w-full min-w-0 list-none flex-col p-0"
  >
    {#each stackedItems as item (item.id)}
      <li
        data-klean-toast-row
        data-state={item.state}
        data-depth={stackDepth(item)}
        data-toast-id={item.id}
        style={`--klean-toast-depth:${Math.min(stackDepth(item), 2)};z-index:${items.length - stackDepth(item)};top:${rowOffset(item)}px`}
        aria-atomic="true"
        class="grid min-w-0 grid-cols-1 grid-rows-[1fr] pb-3"
        onmouseenter={() => controller.pause(item.id, "hover")}
        onmouseleave={() => controller.resume(item.id, "hover")}
        onfocusin={() => controller.pause(item.id, "focus")}
        onfocusout={(event) => handleFocusOut(item, event)}
      >
        <div
          data-slot="toast"
          data-klean-toast-item
          data-state={item.state}
          data-from={resolvedFrom}
          data-to={resolvedTo}
          class={twMerge(
            "pointer-events-auto grid min-h-0 w-full min-w-0 grid-cols-[minmax(0,1fr)_auto] items-start gap-3 overflow-hidden rounded-xl bg-white px-4 py-3 wrap-anywhere text-gray-950 shadow-sm ring-1 ring-gray-950/10 dark:bg-gray-950 dark:text-white dark:ring-white/15",
            item.class,
            item.className,
          )}
          onanimationend={(event) => handleAnimationEnd(item, event)}
        >
          {#if children}
            {@render children({
              item,
              dismiss: () => controller.dismiss(item.id),
            })}
          {:else}
            <div class="min-w-0 pt-0.5">
              {#if item.title}
                <p
                  data-slot="toast-title"
                  class="text-sm font-semibold leading-5"
                >
                  {item.title}
                </p>
              {/if}
              {#if item.message}
                <p
                  data-slot="toast-message"
                  class={twMerge(
                    "text-sm leading-5 text-gray-600 dark:text-gray-300",
                    item.title && "mt-0.5",
                  )}
                >
                  {item.message}
                </p>
              {/if}
              {#if item.action?.href}
                <a
                  data-slot="toast-action"
                  href={item.action.href}
                  class={twMerge(
                    "mt-2 inline-flex min-h-8 max-w-full items-center whitespace-normal text-left text-sm font-semibold text-gray-950 underline decoration-gray-300 underline-offset-4 hover:decoration-current focus-visible:rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-950 dark:text-white dark:decoration-gray-600 dark:focus-visible:ring-white",
                    item.action.class,
                    item.action.className,
                  )}
                  onclick={(event) => activateAction(item, event)}
                >
                  {item.action.label}
                </a>
              {:else if item.action?.label}
                <button
                  type="button"
                  data-slot="toast-action"
                  class={twMerge(
                    "mt-2 inline-flex min-h-8 max-w-full cursor-pointer items-center whitespace-normal text-left text-sm font-semibold text-gray-950 hover:text-gray-600 focus-visible:rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-950 dark:text-white dark:hover:text-gray-300 dark:focus-visible:ring-white",
                    item.action.class,
                    item.action.className,
                  )}
                  onclick={(event) => activateAction(item, event)}
                >
                  {item.action.label}
                </button>
              {/if}
            </div>
            {#if item.dismissible !== false}
              <button
                type="button"
                data-slot="toast-dismiss"
                class="-mr-2 -mt-1 grid size-9 cursor-pointer place-items-center rounded-lg text-lg leading-none text-gray-400 hover:bg-gray-100 hover:text-gray-950 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-950 dark:text-gray-500 dark:hover:bg-gray-800 dark:hover:text-white dark:focus-visible:ring-white"
                aria-label={item.dismissLabel ??
                  `Dismiss ${item.title || "notification"}`}
                onclick={() => controller.dismiss(item.id)}
              >
                <span aria-hidden="true">×</span>
              </button>
            {/if}
          {/if}
        </div>
      </li>
    {/each}
  </ol>
  {#if stackCount > 1}
    <button
      type="button"
      data-slot="toast-expand"
      aria-live="off"
      aria-expanded={isExpanded}
      class="pointer-events-auto mt-2 min-h-9 cursor-pointer self-end rounded-full bg-white px-3 text-xs font-medium text-gray-600 shadow-none ring-1 ring-gray-950/10 hover:text-gray-950 focus-visible:outline-2 focus-visible:outline-offset-2 dark:bg-gray-950 dark:text-gray-300 dark:ring-white/15"
      onclick={() => (pinned = !pinned)}
      >{pinned ? "Collapse" : isExpanded ? "Keep open" : "View all"} · {stackCount}</button
    >
  {/if}
</section>

<style>
  [data-slot="toast-viewport"] [data-slot="toast-list"] {
    position: relative;
    display: block;
    pointer-events: auto;
    max-height: calc(100dvh - 7rem);
    overscroll-behavior: contain;
    transition: height 220ms ease;
  }
  [data-slot="toast-viewport"] [data-klean-toast-row] {
    position: absolute;
    width: 100%;
    transition:
      top 220ms ease,
      translate 220ms ease,
      scale 220ms ease,
      opacity 150ms ease;
  }
  [data-slot="toast-viewport"][data-expanded="false"] [data-slot="toast-list"] {
    margin-block-end: 1.5rem;
  }
  [data-slot="toast-viewport"][data-expanded="false"][data-position^="bottom"]
    [data-slot="toast-list"] {
    margin-block-start: 1.5rem;
    margin-block-end: 0;
  }
  [data-slot="toast-viewport"][data-expanded="false"][data-stack-count="1"]
    [data-slot="toast-list"] {
    margin-block: 0;
  }
  [data-slot="toast-viewport"][data-expanded="false"] [data-klean-toast-row] {
    align-self: start;
    transform-origin: center top;
    translate: 0 calc(var(--klean-toast-depth) * 12px);
    scale: calc(1 - var(--klean-toast-depth) * 0.04);
  }
  [data-slot="toast-viewport"][data-expanded="false"][data-position^="bottom"]
    [data-klean-toast-row] {
    align-self: end;
    transform-origin: center bottom;
    translate: 0 calc(var(--klean-toast-depth) * -12px);
  }
  [data-slot="toast-viewport"][data-expanded="false"]
    [data-klean-toast-row]:not([data-depth="0"]) {
    pointer-events: none;
    max-height: var(--klean-toast-front-height);
    overflow: clip;
  }
  [data-slot="toast-viewport"][data-expanded="false"]
    [data-klean-toast-row]:not([data-depth="0"])
    [data-klean-toast-item] {
    pointer-events: none;
    max-height: var(--klean-toast-front-height);
  }
  [data-slot="toast-viewport"][data-expanded="false"]
    [data-klean-toast-row]:not([data-depth="0"]):not([data-depth="1"]):not(
      [data-depth="2"]
    ) {
    opacity: 0;
  }
  [data-slot="toast-viewport"][data-expanded="true"] [data-slot="toast-list"] {
    overflow-y: auto;
    padding-inline: 0.25rem;
    margin-inline: -0.25rem;
    width: calc(100% + 0.5rem);
  }
  [data-slot="toast-viewport"][data-expanded="true"] [data-klean-toast-row] {
    width: calc(100% - 0.5rem);
  }
  [data-slot="toast-viewport"][data-focused="true"] [data-klean-toast-row],
  [data-slot="toast-viewport"][data-focused="true"] [data-slot="toast-list"] {
    transition: none;
  }
  @keyframes klean-toast-enter {
    0% {
      opacity: 0;
      transform: translate3d(
          var(--klean-toast-enter-x),
          var(--klean-toast-enter-y),
          0
        )
        scale(0.98);
    }
    100% {
      opacity: 1;
      transform: translate3d(0, 0, 0) scale(1);
    }
  }

  @keyframes klean-toast-leave {
    0% {
      opacity: 1;
      transform: translate3d(0, 0, 0) scale(1);
    }
    100% {
      opacity: 0;
      transform: translate3d(
          var(--klean-toast-leave-x),
          var(--klean-toast-leave-y),
          0
        )
        scale(0.98);
    }
  }

  @keyframes klean-toast-collapse {
    0% {
      grid-template-rows: 1fr;
      padding-block-end: 0.75rem;
    }
    100% {
      grid-template-rows: 0fr;
      padding-block-end: 0;
    }
  }

  [data-klean-toast-item][data-state="entering"] {
    animation: klean-toast-enter var(--klean-toast-enter-duration) ease-out both;
  }

  [data-klean-toast-item][data-state="closing"] {
    animation: klean-toast-leave var(--klean-toast-leave-duration) ease-in both;
    pointer-events: none;
  }

  [data-klean-toast-row][data-state="closing"] {
    animation: klean-toast-collapse var(--klean-toast-collapse-duration) ease-in
      var(--klean-toast-collapse-delay) both;
    overflow: hidden;
  }

  @media (prefers-reduced-motion: reduce) {
    [data-slot="toast-viewport"] [data-klean-toast-row] {
      transition: none;
    }
    [data-slot="toast-viewport"] [data-slot="toast-list"] {
      transition: none;
    }
    [data-klean-toast-item][data-state] {
      animation-duration: 1ms;
      animation-timing-function: linear;
    }

    [data-klean-toast-row][data-state="closing"] {
      animation-delay: 0ms;
      animation-duration: 1ms;
    }
  }
</style>
