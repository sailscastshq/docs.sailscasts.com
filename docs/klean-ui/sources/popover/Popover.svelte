<script>
  import {
    autoUpdate,
    computePosition,
    flip,
    offset as floatingOffset,
    shift,
    size,
  } from "@floating-ui/dom";
  import { onMount, untrack } from "svelte";
  import { twMerge } from "tailwind-merge";

  const BASE_CLASSES = [
    "z-50 m-0 w-max max-w-[calc(100vw-1rem)] rounded-md border border-gray-200 bg-white p-4 text-gray-950 shadow-lg outline-none",
    "dark:border-gray-700 dark:bg-gray-950 dark:text-white",
  ];

  let {
    id,
    open = $bindable(),
    defaultOpen = false,
    anchor,
    onOpenChange,
    placement = "bottom-start",
    offset = 8,
    class: className = "",
    style,
    children,
    ...contentProps
  } = $props();

  const componentId = $props.id();
  const generatedId = `klean-popover-${componentId}`;
  let internalOpen = $state(untrack(() => defaultOpen));
  let contentElement = $state();
  let activeInvoker = $state();
  let supportsNative = $state(false);
  let resolvedPlacement = $state(untrack(() => placement));
  let positionStyle = $state({
    position: "fixed",
    inset: "auto",
    left: "0px",
    top: "0px",
  });
  let isOpen = $derived(open ?? internalOpen);
  let contentId = $derived(id ?? generatedId);
  let mergedStyle = $derived(
    [positionStyle, style]
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
      .join(";"),
  );

  function invokers() {
    const root = contentElement?.getRootNode?.() ?? document;

    return [...(root.querySelectorAll?.("[popovertarget]") ?? [])].filter(
      (element) => element.getAttribute("popovertarget") === contentId,
    );
  }

  function eventPath(event) {
    return event.composedPath?.() ?? [event.target];
  }

  function resolveInvoker(candidate) {
    if (candidate?.isConnected) {
      activeInvoker = candidate;
    }

    if (!activeInvoker?.isConnected) activeInvoker = invokers()[0];
    return activeInvoker;
  }

  function resolveAnchor() {
    if (typeof anchor === "string") {
      const root = contentElement?.getRootNode?.() ?? document;
      const element =
        root.getElementById?.(anchor) ?? document.getElementById(anchor);

      if (element?.isConnected) return element;
    } else if (anchor?.isConnected) {
      return anchor;
    }

    return resolveInvoker();
  }

  function syncInvokerAria() {
    for (const invoker of invokers()) {
      invoker.setAttribute("aria-controls", contentId);
      invoker.setAttribute("aria-expanded", String(isOpen));
    }
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

    const showing = popoverIsShowing();

    try {
      if (isOpen && !showing) {
        contentElement.showPopover({ source: resolveInvoker() });
      } else if (!isOpen && showing) {
        contentElement.hidePopover();
      }
    } catch {
      // A rapid native toggle can briefly make the requested state redundant.
    }
  }

  function requestOpen(nextOpen, { restoreFocus = false } = {}) {
    if (open === undefined) internalOpen = nextOpen;
    else open = nextOpen;
    onOpenChange?.(nextOpen);

    queueMicrotask(() => {
      syncInvokerAria();
      syncNativePopover();

      const invoker = resolveInvoker();
      if (!nextOpen && restoreFocus && invoker?.isConnected) {
        invoker.focus({ preventScroll: true });
      }
    });
  }

  export function close({ restoreFocus = isOpen } = {}) {
    requestOpen(false, { restoreFocus });
  }

  export function show(source) {
    resolveInvoker(source);
    requestOpen(true);
  }

  export function getContent() {
    return contentElement;
  }

  function handleNativeToggle(event) {
    const nextOpen = event.newState === "open";
    const shouldRestoreFocus =
      !nextOpen &&
      event.source?.getAttribute?.("popovertargetaction") === "hide";
    if (nextOpen) resolveInvoker(event.source);
    if (nextOpen === isOpen) return;

    if (open === undefined) internalOpen = nextOpen;
    else open = nextOpen;
    onOpenChange?.(nextOpen);
    queueMicrotask(syncInvokerAria);

    if (shouldRestoreFocus) {
      queueMicrotask(() => {
        const invoker = resolveInvoker();
        if (invoker?.isConnected) invoker.focus({ preventScroll: true });
      });
    }
  }

  onMount(() => {
    supportsNative =
      typeof contentElement?.showPopover === "function" &&
      typeof contentElement?.hidePopover === "function";
    resolveInvoker();
    syncInvokerAria();

    if (supportsNative) return;

    function handleFallbackInvokerClick(event) {
      const candidate = eventPath(event).find(
        (element) => element?.getAttribute?.("popovertarget") === contentId,
      );
      if (candidate?.getAttribute("popovertarget") !== contentId) return;

      resolveInvoker(candidate);
      const action = candidate.getAttribute("popovertargetaction") ?? "toggle";

      if (action === "show") requestOpen(true);
      else if (action === "hide") {
        requestOpen(false, { restoreFocus: true });
      } else requestOpen(!isOpen);
    }

    document.addEventListener("click", handleFallbackInvokerClick);
    return () =>
      document.removeEventListener("click", handleFallbackInvokerClick);
  });

  $effect(() => {
    syncInvokerAria();
    syncNativePopover();

    const anchorElement = resolveAnchor();
    if (!isOpen || !anchorElement || !contentElement) return;
    const element = contentElement;
    let active = true;

    const updatePosition = async () => {
      const result = await computePosition(anchorElement, element, {
        placement,
        strategy: "fixed",
        middleware: [
          floatingOffset(offset),
          flip({ padding: 8 }),
          size({
            padding: 8,
            apply({ availableHeight, elements }) {
              elements.floating.style.setProperty(
                "--klean-popover-available-height",
                `${Math.max(0, availableHeight)}px`,
              );
            },
          }),
          shift({ padding: 8, crossAxis: true }),
        ],
      });

      if (!active || contentElement !== element) return;
      resolvedPlacement = result.placement;
      positionStyle = {
        position: "fixed",
        inset: "auto",
        left: `${result.x}px`,
        top: `${result.y}px`,
        "--klean-popover-available-height": element.style.getPropertyValue(
          "--klean-popover-available-height",
        ),
      };
    };

    const cleanup = autoUpdate(anchorElement, element, updatePosition);
    return () => {
      active = false;
      cleanup();
    };
  });

  $effect(() => {
    if (!isOpen) return;

    function handleOutsidePointer(event) {
      const path = eventPath(event);
      const invoker = resolveInvoker();
      const anchorElement = resolveAnchor();

      if (
        path.includes(contentElement) ||
        (invoker &&
          (path.includes(invoker) || invoker.contains?.(event.target))) ||
        (anchorElement &&
          (path.includes(anchorElement) ||
            anchorElement.contains?.(event.target))) ||
        invokers().some(
          (invoker) => path.includes(invoker) || invoker.contains(event.target),
        )
      ) {
        return;
      }

      requestOpen(false);
    }

    function handleEscape(event) {
      if (event.key !== "Escape" || event.defaultPrevented) return;

      if (supportsNative) {
        const root = contentElement?.getRootNode?.() ?? document;
        const path = eventPath(event);
        const rootIndex = path.indexOf(root);
        const innerPath = rootIndex < 0 ? path : path.slice(0, rootIndex);
        // An open nested surface in a shadow tree owns Escape before its parent.
        if (
          innerPath.some(
            (node) =>
              node !== root &&
              node?.host &&
              node.querySelector?.(":popover-open"),
          )
        )
          return;
        const openPopovers = [...root.querySelectorAll(":popover-open")];
        if (openPopovers.at(-1) !== contentElement) return;
      }

      event.preventDefault();
      requestOpen(false, { restoreFocus: true });
    }

    document.addEventListener("keydown", handleEscape);
    document.addEventListener("pointerdown", handleOutsidePointer, true);

    return () => {
      document.removeEventListener("pointerdown", handleOutsidePointer, true);
      document.removeEventListener("keydown", handleEscape);
    };
  });
</script>

<div
  {...contentProps}
  bind:this={contentElement}
  id={contentId}
  popover="auto"
  hidden={!supportsNative && !isOpen}
  data-slot={contentProps["data-slot"] ?? "popover-content"}
  data-state={isOpen ? "open" : "closed"}
  data-placement={resolvedPlacement}
  class={twMerge(BASE_CLASSES, className)}
  style={mergedStyle}
  ontoggle={handleNativeToggle}
>
  {@render children?.({ open: isOpen, close })}
</div>
