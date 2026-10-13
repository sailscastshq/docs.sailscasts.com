<script>
  import Menu from "../menu/Menu.svelte";
  let {
    target,
    id,
    disabled = false,
    open = $bindable(),
    onOpenChange,
    placement = "bottom-start",
    offset = 0,
    children: content,
    ...attrs
  } = $props();
  const generatedId = $props.id();
  let menu = $state();
  let internalOpen = $state(false);
  let anchor = $state();
  const menuId = $derived(
    id ?? `klean-context-menu-${generatedId.replace(/[^a-zA-Z0-9_-]/g, "")}`,
  );
  const isOpen = $derived(open ?? internalOpen);
  function targetElement() {
    const root = menu?.getContent()?.getRootNode() ?? document;
    return typeof target === "string" ? root.getElementById?.(target) : target;
  }
  function requestOpen(value) {
    if (open === undefined) internalOpen = value;
    else open = value;
    onOpenChange?.(value);
  }
  export function show(source = targetElement(), point) {
    const element = targetElement();
    if (
      disabled ||
      !element?.isConnected ||
      !source?.isConnected ||
      element.matches(":disabled") ||
      element.getAttribute("aria-disabled") === "true"
    )
      return;
    const rect = source.getBoundingClientRect();
    const x = point?.x ?? rect.left;
    const y = point?.y ?? rect.bottom;
    anchor = {
      contextElement: source,
      getBoundingClientRect: () => ({
        x,
        y,
        left: x,
        right: x,
        top: y,
        bottom: y,
        width: 0,
        height: 0,
      }),
    };
    menu?.show("first", source);
  }
  export function hide() {
    menu?.closeMenu({ restoreFocus: true });
  }
  $effect(() => {
    if (disabled) hide();
  });
  $effect(() => {
    const element = targetElement();
    if (!element) return;
    const attributes = ["aria-haspopup", "aria-controls", "aria-expanded"];
    const previous = attributes.map((name) => element.getAttribute(name));
    element.setAttribute("aria-haspopup", "menu");
    element.setAttribute("aria-controls", menuId);
    element.setAttribute("aria-expanded", String(isOpen));
    function invoke(event) {
      if (
        event.defaultPrevented ||
        disabled ||
        element.matches(":disabled") ||
        element.getAttribute("aria-disabled") === "true"
      )
        return;
      const keyboard = event.type === "keydown";
      if (
        keyboard &&
        !(
          event.key === "ContextMenu" ||
          (event.key === "F10" &&
            event.shiftKey &&
            !event.ctrlKey &&
            !event.altKey &&
            !event.metaKey)
        )
      )
        return;
      event.preventDefault();
      const point =
        !keyboard && (event.clientX || event.clientY)
          ? { x: event.clientX, y: event.clientY }
          : undefined;
      show(element, point);
    }
    element.addEventListener("contextmenu", invoke);
    element.addEventListener("keydown", invoke);
    return () => {
      element.removeEventListener("contextmenu", invoke);
      element.removeEventListener("keydown", invoke);
      attributes.forEach((name, index) =>
        previous[index] === null
          ? element.removeAttribute(name)
          : element.setAttribute(name, previous[index]),
      );
    };
  });
</script>

<Menu
  {...attrs}
  popover="manual"
  bind:this={menu}
  id={menuId}
  open={isOpen}
  onOpenChange={requestOpen}
  {anchor}
  {placement}
  {offset}
>
  {#snippet children(state)}{@render content?.(state)}{/snippet}
</Menu>
