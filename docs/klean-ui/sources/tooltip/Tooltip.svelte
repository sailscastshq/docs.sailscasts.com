<script module>
  let closeActiveTooltip;
</script>

<script>
  import {
    arrow as floatingArrow,
    autoUpdate,
    computePosition,
    flip,
    offset as floatingOffset,
    shift,
  } from "@floating-ui/dom";
  import { onMount, untrack } from "svelte";
  import { twMerge } from "tailwind-merge";

  const BASE_CLASSES = [
    "z-50 m-0 w-max max-w-[calc(100vw-1rem)] rounded-md border border-gray-950 bg-gray-950 px-2.5 py-1.5 text-xs font-medium leading-none text-white shadow-md outline-none",
    "transition-opacity duration-100 starting:opacity-0 motion-reduce:transition-none",
    "forced-colors:border forced-colors:border-[CanvasText] forced-colors:bg-[Canvas] forced-colors:text-[CanvasText]",
  ];
  const OPEN_DELAY = 400;
  const CLOSE_DELAY = 80;

  let {
    text,
    placement = "top",
    offset = 8,
    class: className = "",
    style,
    children,
    ...contentProps
  } = $props();

  const rawComponentId = $props.id();
  const componentId = rawComponentId.replace(/[^a-zA-Z0-9_-]/g, "");
  const tooltipId = `klean-tooltip-${componentId}`;
  let rootElement;
  let triggerElement = $state();
  let contentElement;
  let arrowElement;
  let isOpen = $state(false);
  let supportsNative = $state(false);
  let resolvedPlacement = $state(untrack(() => placement));
  let positionStyle = $state({ position: "fixed", left: "0px", top: "0px" });
  let arrowStyle = $state({});
  let openTimer;
  let closeTimer;
  let cleanupPosition = () => {};
  let observer;
  let lastTouchAt = 0;

  function descriptionTokens(element) {
    return (element?.getAttribute("aria-describedby") ?? "")
      .split(/\s+/)
      .filter(Boolean);
  }

  function removeDescription(element) {
    if (!element) return;
    const tokens = descriptionTokens(element).filter(
      (token) => token !== tooltipId,
    );
    if (tokens.length) element.setAttribute("aria-describedby", tokens.join(" "));
    else element.removeAttribute("aria-describedby");
  }

  function syncTrigger() {
    const nextTrigger = rootElement?.firstElementChild;
    if (nextTrigger === triggerElement) return triggerElement;

    removeDescription(triggerElement);
    triggerElement = nextTrigger;
    if (nextTrigger) {
      const tokens = new Set(descriptionTokens(nextTrigger));
      tokens.add(tooltipId);
      nextTrigger.setAttribute("aria-describedby", [...tokens].join(" "));
    }
    return nextTrigger;
  }

  function popoverIsShowing() {
    if (!supportsNative || !contentElement) return false;
    try {
      return contentElement.matches(":popover-open");
    } catch {
      return false;
    }
  }

  function syncNativePopover() {
    if (!supportsNative || !contentElement) return;
    try {
      if (isOpen && !popoverIsShowing()) {
        contentElement.showPopover({ source: triggerElement });
      } else if (!isOpen && popoverIsShowing()) {
        contentElement.hidePopover();
      }
    } catch {
      // Rapid pointer and focus changes can make requests redundant.
    }
  }

  async function updatePosition() {
    if (!triggerElement?.isConnected || !contentElement?.isConnected) {
      closeNow();
      return;
    }

    const result = await computePosition(triggerElement, contentElement, {
      placement,
      strategy: "fixed",
      middleware: [
        floatingOffset(offset),
        flip(),
        shift({ padding: 8 }),
        floatingArrow({ element: arrowElement, padding: 6 }),
      ],
    });
    const side = result.placement.split("-")[0];
    const staticSide = {
      top: "bottom",
      right: "left",
      bottom: "top",
      left: "right",
    }[side];
    const arrowData = result.middlewareData.arrow ?? {};

    resolvedPlacement = result.placement;
    positionStyle = {
      position: "fixed",
      left: `${result.x}px`,
      top: `${result.y}px`,
    };
    arrowStyle = {
      left: arrowData.x == null ? "" : `${arrowData.x}px`,
      top: arrowData.y == null ? "" : `${arrowData.y}px`,
      right: "",
      bottom: "",
      [staticSide]: "-4px",
    };
  }

  function startPositioning() {
    cleanupPosition();
    if (!triggerElement || !contentElement) return;
    cleanupPosition = autoUpdate(triggerElement, contentElement, updatePosition);
  }

  function openNow() {
    clearTimeout(openTimer);
    clearTimeout(closeTimer);
    const trigger = syncTrigger();
    if (!trigger || !text) return;

    if (closeActiveTooltip && closeActiveTooltip !== closeNow) {
      closeActiveTooltip();
    }
    closeActiveTooltip = closeNow;
    isOpen = true;
    syncNativePopover();
    queueMicrotask(startPositioning);
  }

  function closeNow() {
    clearTimeout(openTimer);
    clearTimeout(closeTimer);
    cleanupPosition();
    cleanupPosition = () => {};
    isOpen = false;
    syncNativePopover();
    if (closeActiveTooltip === closeNow) closeActiveTooltip = undefined;
  }

  function scheduleOpen() {
    clearTimeout(closeTimer);
    if (isOpen) return;
    clearTimeout(openTimer);
    openTimer = setTimeout(openNow, OPEN_DELAY);
  }

  function scheduleClose() {
    clearTimeout(openTimer);
    clearTimeout(closeTimer);
    closeTimer = setTimeout(closeNow, CLOSE_DELAY);
  }

  function handlePointerOver(event) {
    if (event.pointerType === "touch") return;
    if (contentElement?.contains(event.target)) {
      clearTimeout(closeTimer);
      return;
    }
    scheduleOpen();
  }

  function handlePointerOut(event) {
    if (
      rootElement?.contains(event.relatedTarget) ||
      contentElement?.contains(event.relatedTarget)
    ) {
      return;
    }
    scheduleClose();
  }

  function handlePointerDown(event) {
    if (event.pointerType !== "touch") return;
    lastTouchAt = Date.now();
    closeNow();
  }

  function handleFocusIn() {
    if (Date.now() - lastTouchAt < 1000) return;
    scheduleOpen();
  }

  function handleFocusOut(event) {
    if (rootElement?.contains(event.relatedTarget)) return;
    scheduleClose();
  }

  function handleEscape(event) {
    if (event.key !== "Escape" || !isOpen) return;
    event.preventDefault();
    closeNow();
  }

  function handleContextChange(event) {
    if (!isOpen) return;
    const path = event.composedPath?.() ?? [event.target];
    if (path.includes(triggerElement) || path.includes(contentElement)) return;
    closeNow();
  }

  function styleString(...values) {
    return values
      .flatMap((value) => {
        if (!value) return [];
        if (typeof value === "string") return value;
        return Object.entries(value)
          .filter(([, propertyValue]) => propertyValue != null)
          .map(([property, propertyValue]) => {
            const cssProperty = property.replace(
              /[A-Z]/g,
              (letter) => `-${letter.toLowerCase()}`,
            );
            return `${cssProperty}:${propertyValue}`;
          });
      })
      .join(";");
  }

  onMount(() => {
    supportsNative =
      typeof contentElement?.showPopover === "function" &&
      typeof contentElement?.hidePopover === "function";
    syncTrigger();

    observer = new MutationObserver(syncTrigger);
    observer.observe(rootElement, { childList: true });
    document.addEventListener("keydown", handleEscape);
    document.addEventListener("pointerdown", handleContextChange, true);
    window.addEventListener("blur", closeNow);

    return () => {
      closeNow();
      removeDescription(triggerElement);
      observer.disconnect();
      document.removeEventListener("keydown", handleEscape);
      document.removeEventListener("pointerdown", handleContextChange, true);
      window.removeEventListener("blur", closeNow);
    };
  });
</script>

<span
  bind:this={rootElement}
  role="presentation"
  class="contents"
  onpointerover={handlePointerOver}
  onpointerout={handlePointerOut}
  onpointerdown={handlePointerDown}
  onfocusin={handleFocusIn}
  onfocusout={handleFocusOut}
>
  {@render children?.()}
  <div
    {...contentProps}
    id={tooltipId}
    bind:this={contentElement}
    popover="hint"
    role="tooltip"
    data-slot="tooltip"
    data-state={isOpen ? "open" : "closed"}
    data-placement={resolvedPlacement}
    hidden={!supportsNative && !isOpen}
    class={twMerge(BASE_CLASSES, className)}
    style={styleString(positionStyle, style)}
    onpointerenter={() => clearTimeout(closeTimer)}
    onpointerleave={scheduleClose}
    ontoggle={(event) => {
      if (event.newState === "closed" && isOpen) isOpen = false;
      contentProps.ontoggle?.(event);
    }}
  >
    {text}
    <span
      bind:this={arrowElement}
      aria-hidden="true"
      data-slot="tooltip-arrow"
      class="absolute -z-10 size-2 rotate-45 border border-inherit bg-inherit forced-colors:hidden"
      style={styleString(arrowStyle)}
    ></span>
  </div>
</span>
