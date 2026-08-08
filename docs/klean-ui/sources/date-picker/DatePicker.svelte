<script>
  import { untrack } from "svelte";
  import { twMerge } from "tailwind-merge";
  import Calendar from "../calendar/Calendar.svelte";
  import {
    dateIsUnavailable,
    dateLabel,
    parseIsoDate,
    resolveLocale,
  } from "../calendar/date.js";
  import Input from "../input/Input.svelte";
  import Popover from "../popover/Popover.svelte";

  let {
    value = $bindable(),
    defaultValue,
    onchange,
    id,
    name,
    placeholder = "YYYY-MM-DD",
    min,
    max,
    unavailable,
    locale: localeProp,
    dir,
    open = $bindable(),
    defaultOpen = false,
    onopenchange,
    required = false,
    disabled = false,
    readonly = false,
    class: className,
    "aria-describedby": externalDescribedBy,
    ...inputProps
  } = $props();

  const componentId = $props.id();
  const generatedId = componentId.replace(/[^a-zA-Z0-9_-]/g, "");
  let inputId = $derived(id ?? `klean-date-picker-${generatedId}`);
  let popoverId = $derived(`${inputId}-calendar`);
  let descriptionId = $derived(`${inputId}-description`);
  let input;
  let popover;
  let locale = $derived(resolveLocale(localeProp));
  const initialDraft = untrack(() =>
    parseIsoDate(value)
      ? value
      : parseIsoDate(defaultValue)
        ? defaultValue
        : "",
  );
  let draft = $state(initialDraft);
  let invalid = $derived(
    Boolean(
      draft &&
        (!parseIsoDate(draft) ||
          dateIsUnavailable(draft, { min, max, unavailable })),
    ),
  );
  let describedValue = $derived(
    !invalid && parseIsoDate(draft)
      ? dateLabel(draft, locale, { weekday: "long" })
      : "",
  );
  let describedBy = $derived(
    [externalDescribedBy, describedValue && descriptionId]
      .filter(Boolean)
      .join(" ") || undefined,
  );

  function commit(nextValue) {
    if (disabled || readonly) return;
    if (nextValue && dateIsUnavailable(nextValue, { min, max, unavailable }))
      return;
    value = nextValue;
    draft = nextValue;
    onchange?.(nextValue);
  }

  function handleInput(event) {
    const nextValue = event.target.value.trim();
    draft = nextValue;
    if (
      !nextValue ||
      (parseIsoDate(nextValue) &&
        !dateIsUnavailable(nextValue, { min, max, unavailable }))
    ) {
      commit(nextValue);
    }
  }

  function chooseDate(nextValue) {
    commit(nextValue);
    popover?.close();
  }

  $effect(() => {
    if (value !== undefined && value !== draft && parseIsoDate(value)) {
      draft = value;
    }
  });

  $effect(() => {
    const element = input?.getElement();
    if (!element) return;
    if (required && !draft) element.setCustomValidity("Choose a date.");
    else if (invalid)
      element.setCustomValidity(
        "Enter an available date as YYYY-MM-DD.",
      );
    else element.setCustomValidity("");
  });

  export function focus(options) {
    input?.focus(options);
  }

  export function show() {
    popover?.show();
  }

  export function close() {
    popover?.close();
  }
</script>

<div
  data-slot="date-picker"
  class={twMerge(
    "relative flex w-full items-stretch [&_[data-slot=input]]:pe-12",
    className,
  )}
>
  <Input
    {...inputProps}
    bind:this={input}
    {name}
    id={inputId}
    type="text"
    inputmode="numeric"
    autocomplete="off"
    value={draft}
    {placeholder}
    {required}
    {disabled}
    {readonly}
    aria-invalid={invalid || undefined}
    aria-describedby={describedBy}
    data-slot="date-picker-input"
    oninput={handleInput}
    onclick={() => !disabled && !readonly && popover?.show()}
    onkeydown={(event) => {
      inputProps.onkeydown?.(event);
      if (
        !event.defaultPrevented &&
        event.key === "ArrowDown" &&
        !disabled &&
        !readonly
      ) {
        event.preventDefault();
        popover?.show();
      }
    }}
  />
  {#if describedValue}
    <span
      id={descriptionId}
      data-slot="date-picker-description"
      class="sr-only"
    >
      {describedValue}
    </span>
  {/if}
  <button
    type="button"
    popovertarget={popoverId}
    data-slot="date-picker-button"
    class="absolute inset-y-0 end-0 grid min-w-11 place-items-center rounded-e-md text-gray-500 hover:bg-gray-100 hover:text-gray-950 focus-visible:z-10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-950 disabled:cursor-not-allowed disabled:opacity-40 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-white dark:focus-visible:outline-white"
    disabled={disabled || readonly}
    aria-label={draft ? `Change date, ${describedValue}` : "Choose a date"}
  >
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="1.8"
      class="size-5"
    >
      <path
        d="M7 3v3M17 3v3M4 9h16M5 5h14a1 1 0 0 1 1 1v14H4V6a1 1 0 0 1 1-1Z"
      />
    </svg>
  </button>
  <Popover
    bind:this={popover}
    bind:open
    id={popoverId}
    {defaultOpen}
    onOpenChange={onopenchange}
    placement="bottom-start"
    data-slot="date-picker-popover"
    class="w-[min(22rem,calc(100vw-1rem))] p-0"
  >
    <Calendar
      value={parseIsoDate(value) ? value : undefined}
      defaultValue={parseIsoDate(draft) ? draft : undefined}
      {min}
      {max}
      {unavailable}
      {locale}
      {dir}
      {disabled}
      {readonly}
      onchange={chooseDate}
    />
  </Popover>
</div>
