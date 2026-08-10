<script>
  import { onMount } from "svelte";
  import { twMerge } from "tailwind-merge";

  let {
    value = $bindable(),
    defaultValue,
    onValueChange,
    orientation = "horizontal",
    activation = "automatic",
    class: className,
    children,
    "aria-label": ariaLabel,
    "aria-labelledby": ariaLabelledby,
    onclick: callerClick,
    onfocusin: callerFocusIn,
    onkeydown: callerKeydown,
    "data-slot": _dataSlot,
    "data-orientation": _dataOrientation,
    ...rootProps
  } = $props();

  const rawComponentId = $props.id();
  const componentId = rawComponentId.replace(/[^a-zA-Z0-9_-]/g, "");
  let rootElement;
  let observer;
  let previousValues = [];
  let lastFocusedValue;
  let syncing = false;
  let initialized = false;

  function listElement() {
    return rootElement?.firstElementChild;
  }

  function tabValue(element) {
    return element?.getAttribute("data-value") ?? "";
  }

  function tabs() {
    const list = listElement();
    if (!list) return [];
    return [...list.querySelectorAll("button[data-value]")].filter(
      (tab) =>
        tab.closest('[role="tablist"]') === list ||
        !tab.closest('[role="tablist"]'),
    );
  }

  function panels() {
    const list = listElement();
    if (!rootElement || !list) return [];
    return [...rootElement.children]
      .slice(1)
      .filter((element) => element.hasAttribute("data-value"));
  }

  function disabled(tab) {
    return tab.disabled || tab.getAttribute("aria-disabled") === "true";
  }

  function enabledTabs() {
    return tabs().filter((tab) => !disabled(tab));
  }

  function tabFor(candidate) {
    return tabs().find((tab) => tabValue(tab) === candidate);
  }

  function panelFor(candidate) {
    return panels().find((panel) => tabValue(panel) === candidate);
  }

  function fallbackValue(current) {
    const available = enabledTabs();
    if (!available.length) return undefined;

    const oldIndex = previousValues.indexOf(current);
    const index = oldIndex < 0 ? 0 : Math.min(oldIndex, available.length - 1);
    return tabValue(available[index]);
  }

  function requestValue(nextValue, { user = false } = {}) {
    if (!nextValue || nextValue === value) return;
    value = nextValue;
    onValueChange?.(nextValue, { user });
    queueMicrotask(sync);
  }

  function generatedPairId(candidate, index) {
    const slug = candidate.replace(/[^a-zA-Z0-9_-]/g, "-") || String(index);
    return `klean-tabs-${componentId}-${slug}-${index}`;
  }

  function sync() {
    if (!rootElement || syncing) return;
    syncing = true;

    if (!initialized) {
      initialized = true;
      if (value === undefined && defaultValue !== undefined) value = defaultValue;
    }

    const list = listElement();
    const allTabs = tabs();
    const allPanels = panels();
    const current = value;
    const currentTab = tabFor(current);
    const resolved =
      currentTab && !disabled(currentTab) ? current : fallbackValue(current);

    if (resolved && resolved !== current) {
      value = resolved;
      onValueChange?.(resolved, { user: false });
    }

    if (list) {
      list.setAttribute("role", "tablist");
      list.setAttribute("data-slot", "tabs-list");
      list.setAttribute("data-orientation", orientation);
      list.setAttribute("aria-orientation", orientation);
      if (ariaLabel) list.setAttribute("aria-label", ariaLabel);
      else list.removeAttribute("aria-label");
      if (ariaLabelledby)
        list.setAttribute("aria-labelledby", ariaLabelledby);
      else list.removeAttribute("aria-labelledby");
    }

    allTabs.forEach((tab, index) => {
      const candidate = tabValue(tab);
      const panel = panelFor(candidate);
      const pairId = generatedPairId(candidate, index);
      const selected = candidate === resolved;

      if (!tab.hasAttribute("type")) tab.setAttribute("type", "button");
      tab.setAttribute("role", "tab");
      tab.setAttribute("data-slot", "tab");
      tab.setAttribute("data-state", selected ? "active" : "inactive");
      tab.setAttribute("data-orientation", orientation);
      tab.setAttribute("aria-selected", String(selected));
      tab.tabIndex = selected ? 0 : -1;
      if (!tab.id) tab.id = `${pairId}-tab`;

      if (panel) {
        if (!panel.id) panel.id = `${pairId}-panel`;
        tab.setAttribute("aria-controls", panel.id);
        panel.setAttribute("role", "tabpanel");
        panel.setAttribute("data-slot", "tab-panel");
        panel.setAttribute("data-state", selected ? "active" : "inactive");
        panel.setAttribute("data-orientation", orientation);
        panel.setAttribute("aria-labelledby", tab.id);
        panel.hidden = !selected;
        if (!panel.hasAttribute("tabindex")) panel.tabIndex = 0;
      } else {
        tab.removeAttribute("aria-controls");
      }
    });

    allPanels.forEach((panel) => {
      if (!tabFor(tabValue(panel))) panel.hidden = true;
    });

    const shouldRestoreFocus =
      lastFocusedValue === current &&
      current &&
      !tabFor(current) &&
      resolved;
    previousValues = allTabs.map(tabValue);
    syncing = false;

    if (shouldRestoreFocus) {
      queueMicrotask(() => tabFor(resolved)?.focus({ preventScroll: true }));
    }
  }

  function reveal(tab) {
    tab.scrollIntoView?.({ block: "nearest", inline: "nearest" });
  }

  function focusTab(tab) {
    if (!tab) return;
    tab.focus({ preventScroll: true });
    reveal(tab);
    if (activation === "automatic") {
      requestValue(tabValue(tab), { user: true });
    }
  }

  function eventTab(event) {
    const candidate = event.target.closest?.("button[data-value]");
    return candidate && listElement()?.contains(candidate)
      ? candidate
      : undefined;
  }

  function handleClick(event) {
    callerClick?.(event);
    if (event.defaultPrevented) return;
    const tab = eventTab(event);
    if (!tab || disabled(tab)) return;
    lastFocusedValue = tabValue(tab);
    requestValue(tabValue(tab), { user: true });
  }

  function handleFocusIn(event) {
    callerFocusIn?.(event);
    if (event.defaultPrevented) return;
    const tab = eventTab(event);
    if (!tab || disabled(tab)) return;
    lastFocusedValue = tabValue(tab);
  }

  function handleKeydown(event) {
    callerKeydown?.(event);
    if (event.defaultPrevented) return;
    const tab = eventTab(event);
    if (!tab || disabled(tab)) return;
    const available = enabledTabs();
    const index = available.indexOf(tab);
    let next;

    if (
      (orientation === "horizontal" && event.key === "ArrowRight") ||
      (orientation === "vertical" && event.key === "ArrowDown")
    ) {
      next = available[(index + 1) % available.length];
    } else if (
      (orientation === "horizontal" && event.key === "ArrowLeft") ||
      (orientation === "vertical" && event.key === "ArrowUp")
    ) {
      next = available[(index - 1 + available.length) % available.length];
    } else if (event.key === "Home") {
      next = available[0];
    } else if (event.key === "End") {
      next = available.at(-1);
    } else if (
      activation === "manual" &&
      ["Enter", " "].includes(event.key)
    ) {
      event.preventDefault();
      requestValue(tabValue(tab), { user: true });
      return;
    } else {
      return;
    }

    event.preventDefault();
    focusTab(next);
  }

  onMount(() => {
    sync();
    observer = new MutationObserver(sync);
    observer.observe(rootElement, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ["data-value", "disabled", "aria-disabled"],
    });
    return () => observer?.disconnect();
  });

  $effect(() => {
    value;
    orientation;
    activation;
    ariaLabel;
    ariaLabelledby;
    queueMicrotask(sync);
  });
</script>

<div
  {...rootProps}
  bind:this={rootElement}
  data-slot="tabs"
  data-orientation={orientation}
  class={twMerge(className)}
  onclick={handleClick}
  onfocusin={handleFocusIn}
  onkeydown={handleKeydown}
>
  {@render children?.()}
</div>
