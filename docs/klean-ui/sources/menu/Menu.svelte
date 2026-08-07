<script>
  import { onMount, untrack } from "svelte";
  import { twMerge } from "tailwind-merge";
  import Popover from "../popover/Popover.svelte";

  const TABBABLE_SELECTOR =
    'a[href], button, input, select, textarea, [tabindex], [contenteditable="true"]';

  let {
    id,
    open = $bindable(),
    defaultOpen = false,
    onOpenChange,
    placement = "bottom-start",
    offset = 8,
    class: className = "",
    children,
    onkeydown,
    onclickcapture,
    ...contentProps
  } = $props();

  let popoverElement = $state();
  let internalOpen = $state(untrack(() => defaultOpen));
  let activeInvoker = $state();
  let isOpen = $derived(open ?? internalOpen);
  let pendingFocus = "first";
  let restoreOnClose = false;
  let tabExitPending = false;
  let tabExitTarget;
  let typeahead = "";
  let typeaheadTimer;

  function contentElement() {
    return popoverElement?.getContent?.();
  }

  function eventPath(event) {
    return event.composedPath?.() ?? [event.target];
  }

  function invokers() {
    const content = contentElement();
    const root = content?.getRootNode?.() ?? document;

    return [...(root.querySelectorAll?.("[popovertarget]") ?? [])].filter(
      (element) => element.getAttribute("popovertarget") === content?.id,
    );
  }

  function syncInvokerSemantics() {
    for (const invoker of invokers()) {
      invoker.setAttribute("aria-haspopup", "menu");
    }
  }

  function matchingInvoker(event) {
    const contentId = contentElement()?.id;
    return eventPath(event).find(
      (element) => element?.getAttribute?.("popovertarget") === contentId,
    );
  }

  function restoreInvokerFocus() {
    const invoker = activeInvoker?.isConnected ? activeInvoker : invokers()[0];
    invoker?.focus?.({ preventScroll: true });
  }

  function adjacentTabStop(backward) {
    const content = contentElement();
    const invoker = activeInvoker?.isConnected ? activeInvoker : invokers()[0];
    let anchor = invoker;
    let root = content?.getRootNode?.() ?? document;

    while (anchor && root) {
      const stops = [...(root.querySelectorAll?.(TABBABLE_SELECTOR) ?? [])].filter(
        (element) =>
          !content?.contains(element) &&
          element.tabIndex >= 0 &&
          !element.matches(":disabled") &&
          !element.closest("[hidden], [inert]"),
      );
      const current = stops.indexOf(anchor);
      let target;

      if (current >= 0) {
        target = stops[current + (backward ? -1 : 1)];
      } else {
        const candidates = stops.filter((element) => {
          const relation = anchor.compareDocumentPosition(element);
          return backward ? Boolean(relation & 2) : Boolean(relation & 4);
        });
        target = backward ? candidates.at(-1) : candidates[0];
      }

      if (target) return target;
      if (!root.host) return undefined;
      anchor = root.host;
      root = anchor.getRootNode?.();
    }

    return undefined;
  }

  function completeTabExit() {
    if (tabExitTarget?.isConnected) {
      tabExitTarget.focus({ preventScroll: true });
    } else {
      const root = contentElement()?.getRootNode?.() ?? document;
      root.activeElement?.blur?.();
    }

    tabExitTarget = undefined;
    tabExitPending = false;
  }

  function itemRole(element) {
    return ["menuitem", "menuitemcheckbox", "menuitemradio"].includes(
      element.getAttribute("role"),
    );
  }

  function menuItems() {
    const content = contentElement();
    if (!content) return [];

    for (const element of content.querySelectorAll("button, a[href]")) {
      if (!element.hasAttribute("role")) element.setAttribute("role", "menuitem");
    }

    const items = [
      ...content.querySelectorAll(
        '[role="menuitem"], [role="menuitemcheckbox"], [role="menuitemradio"]',
      ),
    ].filter((element) => element.closest('[role="menu"]') === content);

    for (const item of items) item.tabIndex = -1;
    return items;
  }

  function itemIsDisabled(item) {
    return (
      item.matches(":disabled") ||
      item.getAttribute("aria-disabled") === "true" ||
      item.hidden ||
      item.closest("[hidden]") !== null
    );
  }

  function enabledItems() {
    return menuItems().filter((item) => !itemIsDisabled(item));
  }

  function focusedElement() {
    return contentElement()?.getRootNode?.().activeElement ?? document.activeElement;
  }

  function focusItem(item) {
    if (!item) return;
    for (const candidate of menuItems()) candidate.tabIndex = -1;
    item.tabIndex = 0;
    item.focus({ preventScroll: true });
  }

  function focusEdge(edge = "first") {
    const items = enabledItems();
    const item = edge === "last" ? items.at(-1) : items[0];
    if (item) focusItem(item);
    else contentElement()?.focus({ preventScroll: true });
  }

  function clearTypeahead() {
    typeahead = "";
    clearTimeout(typeaheadTimer);
    typeaheadTimer = undefined;
  }

  function normalizedText(item) {
    return (item.getAttribute("aria-label") ?? item.textContent ?? "")
      .trim()
      .toLocaleLowerCase();
  }

  function handleTypeahead(event) {
    if (
      event.key.length !== 1 ||
      event.key === " " ||
      event.altKey ||
      event.ctrlKey ||
      event.metaKey
    ) {
      return false;
    }

    event.preventDefault();
    clearTimeout(typeaheadTimer);
    typeahead += event.key.toLocaleLowerCase();
    typeaheadTimer = setTimeout(clearTypeahead, 500);

    const items = enabledItems();
    if (!items.length) return true;
    const current = items.indexOf(focusedElement());
    const ordered = [...items.slice(current + 1), ...items.slice(0, current + 1)];
    let match = ordered.find((item) => normalizedText(item).startsWith(typeahead));

    if (!match && new Set(typeahead).size === 1) {
      typeahead = typeahead.at(-1);
      match = ordered.find((item) => normalizedText(item).startsWith(typeahead));
    }

    if (match) focusItem(match);
    return true;
  }

  function requestOpen(nextOpen) {
    if (open === undefined) internalOpen = nextOpen;
    else open = nextOpen;
    onOpenChange?.(nextOpen);
  }

  function openMenu(edge = "first") {
    pendingFocus = edge;
    if (isOpen) focusEdge(edge);
    else requestOpen(true);
  }

  function closeMenu({ restoreFocus = false } = {}) {
    restoreOnClose ||= restoreFocus;
    if (isOpen) requestOpen(false);
    else if (restoreOnClose) {
      restoreOnClose = false;
      queueMicrotask(restoreInvokerFocus);
    }
  }

  function itemFromEvent(event) {
    const content = contentElement();
    return eventPath(event).find(
      (element) =>
        element?.nodeType === 1 &&
        itemRole(element) &&
        element.closest?.('[role="menu"]') === content,
    );
  }

  function handleClick(event) {
    const item = itemFromEvent(event);
    if (!item) {
      onclickcapture?.(event);
      return;
    }

    if (itemIsDisabled(item)) {
      event.preventDefault();
      event.stopImmediatePropagation();
      return;
    }

    closeMenu({ restoreFocus: true });
    onclickcapture?.(event);
  }

  function handleKeydown(event) {
    const items = enabledItems();
    const currentIndex = items.indexOf(focusedElement());
    let nextIndex;

    if (event.key === "Escape") {
      event.preventDefault();
      event.stopPropagation();
      closeMenu({ restoreFocus: true });
    } else if (event.key === "Tab") {
      event.preventDefault();
      clearTypeahead();
      restoreOnClose = false;
      tabExitTarget = adjacentTabStop(event.shiftKey);
      tabExitPending = true;
      closeMenu();
    } else if (event.key === "ArrowDown") {
      nextIndex = currentIndex < 0 ? 0 : (currentIndex + 1) % items.length;
    } else if (event.key === "ArrowUp") {
      nextIndex =
        currentIndex < 0
          ? items.length - 1
          : (currentIndex - 1 + items.length) % items.length;
    } else if (event.key === "Home") {
      nextIndex = 0;
    } else if (event.key === "End") {
      nextIndex = items.length - 1;
    } else if (!handleTypeahead(event)) {
      onkeydown?.(event);
      return;
    }

    if (nextIndex !== undefined && items.length) {
      event.preventDefault();
      focusItem(items[nextIndex]);
    }
    onkeydown?.(event);
  }

  $effect(() => {
    const nextOpen = isOpen;
    queueMicrotask(() => {
      syncInvokerSemantics();

      if (nextOpen) {
        focusEdge(pendingFocus);
        pendingFocus = "first";
        return;
      }

      clearTypeahead();
      menuItems();
      if (tabExitPending) completeTabExit();
      else if (restoreOnClose) restoreInvokerFocus();
      restoreOnClose = false;
    });
  });

  onMount(() => {
    const content = contentElement();
    const root = content?.getRootNode?.() ?? document;

    function rememberInvoker(event) {
      const invoker = matchingInvoker(event);
      if (invoker) activeInvoker = invoker;
    }

    function handleInvokerKeydown(event) {
      const invoker = matchingInvoker(event);
      if (!invoker || invoker.matches(":disabled")) return;
      activeInvoker = invoker;

      if (event.key === "ArrowDown" || event.key === "ArrowUp") {
        event.preventDefault();
        openMenu(event.key === "ArrowUp" ? "last" : "first");
      }
    }

    root.addEventListener("keydown", handleInvokerKeydown);
    root.addEventListener("click", rememberInvoker, true);
    syncInvokerSemantics();
    menuItems();

    const observer =
      typeof MutationObserver !== "undefined" && content
        ? new MutationObserver(menuItems)
        : undefined;
    observer?.observe(content, { childList: true, subtree: true });

    return () => {
      observer?.disconnect();
      root.removeEventListener("keydown", handleInvokerKeydown);
      root.removeEventListener("click", rememberInvoker, true);
      clearTypeahead();
    };
  });
</script>

<Popover
  {...contentProps}
  bind:this={popoverElement}
  {id}
  open={isOpen}
  onOpenChange={requestOpen}
  {placement}
  {offset}
  role="menu"
  tabindex={-1}
  data-slot="menu"
  class={twMerge("min-w-40 p-1", className)}
  onclickcapture={handleClick}
  onkeydown={handleKeydown}
>
  {@render children?.({ open: isOpen, close: closeMenu })}
</Popover>
