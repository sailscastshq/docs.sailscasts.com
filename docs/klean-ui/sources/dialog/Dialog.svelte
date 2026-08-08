<script>
  import { onMount, untrack } from "svelte";
  import { twMerge } from "tailwind-merge";

  const BASE_CLASSES = [
    "m-auto w-[calc(100vw-2rem)] max-w-lg overflow-hidden rounded-lg border border-gray-200 bg-white p-6 text-gray-950 shadow-xl outline-none",
    "backdrop:bg-black/50",
    "dark:border-gray-700 dark:bg-gray-950 dark:text-white",
  ];

  let {
    id,
    open = $bindable(),
    defaultOpen = false,
    dismissible = true,
    onOpenChange,
    class: className = "",
    closedby: _closedby,
    "data-slot": _dataSlot,
    "data-state": _dataState,
    onbeforetoggle,
    ontoggle,
    oncancel,
    onclose,
    onclick,
    children,
    ...dialogProps
  } = $props();

  let internalOpen = $state(untrack(() => defaultOpen));
  let nativeOpen = $state(false);
  let dialogElement = $state();
  let fallbackInvoker;
  let previousDocumentOverflow = "";
  let scrollLocked = false;
  let desiredOpen = $derived(open ?? internalOpen);

  function lockScroll() {
    if (scrollLocked || typeof document === "undefined") return;
    previousDocumentOverflow = document.documentElement.style.overflow;
    document.documentElement.style.overflow = "hidden";
    scrollLocked = true;
  }

  function unlockScroll() {
    if (!scrollLocked || typeof document === "undefined") return;
    document.documentElement.style.overflow = previousDocumentOverflow;
    scrollLocked = false;
  }

  function observeNativeOpen(nextOpen) {
    const shouldNotify = desiredOpen !== nextOpen;
    nativeOpen = nextOpen;

    if (open === undefined) internalOpen = nextOpen;
    else open = nextOpen;
    if (nextOpen) lockScroll();
    else unlockScroll();
    if (shouldNotify) onOpenChange?.(nextOpen);
  }

  export function showModal(source) {
    if (!dialogElement || dialogElement.open) return;

    fallbackInvoker = source;
    dialogElement.showModal();
    observeNativeOpen(true);
  }

  export function close(returnValue) {
    if (!dialogElement?.open) return;

    if (returnValue === undefined) dialogElement.close();
    else dialogElement.close(returnValue);
    observeNativeOpen(false);
  }

  export function requestClose(returnValue) {
    if (!dialogElement?.open) return;

    if (typeof dialogElement.requestClose === "function") {
      if (returnValue === undefined) dialogElement.requestClose();
      else dialogElement.requestClose(returnValue);
      return;
    }

    const event = new Event("cancel", { cancelable: true });
    if (dialogElement.dispatchEvent(event)) close(returnValue);
  }

  function handleToggle(event) {
    observeNativeOpen(event.newState === "open" || dialogElement?.open === true);
    ontoggle?.(event);
  }

  function handleCancel(event) {
    if (!dismissible) event.preventDefault();
    oncancel?.(event);
  }

  function handleClose(event) {
    observeNativeOpen(false);

    if (fallbackInvoker?.isConnected) {
      fallbackInvoker.focus({ preventScroll: true });
    }
    fallbackInvoker = undefined;
    onclose?.(event);
  }

  function handleClick(event) {
    onclick?.(event);

    const rect = event.currentTarget.getBoundingClientRect();
    const outside =
      event.clientX < rect.left ||
      event.clientX > rect.right ||
      event.clientY < rect.top ||
      event.clientY > rect.bottom;

    if (
      event.defaultPrevented ||
      !dismissible ||
      "closedBy" in event.currentTarget ||
      event.target !== event.currentTarget ||
      !outside
    ) {
      return;
    }

    requestClose();
  }

  function commandButton(event) {
    return (event.composedPath?.() ?? [event.target]).find(
      (element) =>
        element?.tagName === "BUTTON" &&
        element.getAttribute("commandfor") === id,
    );
  }

  $effect(() => {
    const element = dialogElement;
    const shouldOpen = desiredOpen;
    if (!element) return;

    if (shouldOpen && !element.open) showModal();
    else if (!shouldOpen && element.open) close();
    else observeNativeOpen(element.open);
  });

  onMount(() => {
    const root = dialogElement?.getRootNode?.() ?? document;
    const supportsCommands =
      typeof HTMLButtonElement !== "undefined" &&
      "commandForElement" in HTMLButtonElement.prototype;

    function handleFallbackCommand(event) {
      const button = commandButton(event);
      if (!button || button.matches(":disabled")) return;

      const command = button.getAttribute("command");
      if (command === "show-modal") showModal(button);
      else if (command === "close") close(button.value);
      else if (command === "request-close") requestClose(button.value);
    }

    if (!supportsCommands && id) {
      root.addEventListener("click", handleFallbackCommand);
    }

    return () => {
      root.removeEventListener("click", handleFallbackCommand);
      if (dialogElement?.open) dialogElement.close();
      unlockScroll();
    };
  });
</script>

<dialog
  {...dialogProps}
  bind:this={dialogElement}
  {id}
  closedby={dismissible ? "any" : "none"}
  data-slot="dialog"
  data-state={nativeOpen ? "open" : "closed"}
  class={twMerge(BASE_CLASSES, className)}
  onbeforetoggle={(event) => onbeforetoggle?.(event)}
  ontoggle={handleToggle}
  oncancel={handleCancel}
  onclose={handleClose}
  onclick={handleClick}
>
  {@render children?.()}
</dialog>
