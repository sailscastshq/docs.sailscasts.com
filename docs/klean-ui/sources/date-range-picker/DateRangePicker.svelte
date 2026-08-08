<script>
  import { untrack } from "svelte";
  import { twMerge } from "tailwind-merge";
  import Calendar from "../calendar/Calendar.svelte";
  import {
    addDays,
    compareDates,
    dateIsUnavailable,
    dateLabel,
    parseIsoDate,
    resolveLocale,
  } from "../calendar/date.js";
  import Input from "../input/Input.svelte";
  import Popover from "../popover/Popover.svelte";

  function normalizeRange(candidate) {
    return {
      start: parseIsoDate(candidate?.start) ? candidate.start : "",
      end: parseIsoDate(candidate?.end) ? candidate.end : "",
    };
  }

  function rangeContainsUnavailable(start, end, unavailable) {
    if (!unavailable || !parseIsoDate(start) || !parseIsoDate(end)) return false;
    const [first, last] =
      compareDates(start, end) <= 0 ? [start, end] : [end, start];

    for (
      let date = first;
      date && compareDates(date, last) <= 0;
      date = addDays(date, 1)
    ) {
      if (unavailable(date)) return true;
    }

    return false;
  }

  let {
    value = $bindable(),
    defaultValue = {},
    onchange,
    id,
    name,
    label = "Date range",
    startLabel = "Start date",
    endLabel = "End date",
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
    ...fieldsetProps
  } = $props();

  const initialRange = normalizeRange(
    untrack(() => (value === undefined ? defaultValue : value)),
  );
  if (untrack(() => value) === undefined) value = initialRange;
  const componentId = $props.id();
  const generatedId = componentId.replace(/[^a-zA-Z0-9_-]/g, "");
  let baseId = $derived(id ?? `klean-date-range-${generatedId}`);
  let startId = $derived(`${baseId}-start`);
  let endId = $derived(`${baseId}-end`);
  let popoverId = $derived(`${baseId}-calendar`);
  let statusId = $derived(`${baseId}-status`);
  let range = $derived(normalizeRange(value));
  let startDraft = $state(initialRange.start);
  let endDraft = $state(initialRange.end);
  let activePart = $state("start");
  let preview = $state("");
  let internalPopoverOpen = $state(untrack(() => defaultOpen));
  let startInput;
  let endInput;
  let popover;
  let locale = $derived(resolveLocale(localeProp));
  let startInvalid = $derived(
    Boolean(
      startDraft &&
        (!parseIsoDate(startDraft) ||
          dateIsUnavailable(startDraft, { min, max, unavailable })),
    ),
  );
  let endInvalid = $derived(
    Boolean(
      endDraft &&
        (!parseIsoDate(endDraft) ||
          dateIsUnavailable(endDraft, { min, max, unavailable })),
    ),
  );
  let endWithoutStartInvalid = $derived(Boolean(endDraft && !startDraft));
  let orderInvalid = $derived(
    Boolean(
      parseIsoDate(startDraft) &&
        parseIsoDate(endDraft) &&
        compareDates(endDraft, startDraft) < 0,
    ),
  );
  let rangeUnavailable = $derived(
    !orderInvalid &&
      rangeContainsUnavailable(startDraft, endDraft, unavailable),
  );
  let popoverOpen = $derived(open ?? internalPopoverOpen);
  let statusText = $derived.by(() => {
    if (endWithoutStartInvalid)
      return "Choose a start date before the end date.";
    if (orderInvalid) return "The end date must be on or after the start date.";
    if (startInvalid || endInvalid)
      return "Enter available dates as YYYY-MM-DD.";
    if (rangeUnavailable)
      return "The range cannot include an unavailable date.";
    if (range.start && range.end)
      return `${dateLabel(range.start, locale)} through ${dateLabel(range.end, locale)}.`;
    if (range.start) return "Choose an end date.";
    return "Choose a start date, then an end date.";
  });
  let decoration = $derived.by(() => {
    const decoratedEnd = range.end || preview;
    return range.start &&
      decoratedEnd &&
      compareDates(range.start, decoratedEnd) > 0
      ? { start: decoratedEnd, end: range.start }
      : { start: range.start, end: decoratedEnd };
  });
  let calendarValue = $derived(
    activePart === "end"
      ? range.end || preview || range.start
      : range.start,
  );
  const calendarButtonClasses =
    "absolute inset-y-0 end-0 grid min-w-11 place-items-center rounded-e-md text-gray-500 hover:bg-gray-100 hover:text-gray-950 focus-visible:z-10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-950 disabled:cursor-not-allowed disabled:opacity-40 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-white dark:focus-visible:outline-white";

  function updateRange(nextRange) {
    value = normalizeRange(nextRange);
    onchange?.(value);
  }

  function calendarUnavailable(date) {
    return (
      dateIsUnavailable(date, { min, max, unavailable }) ||
      (activePart === "end" &&
        range.start &&
        rangeContainsUnavailable(range.start, date, unavailable))
    );
  }

  function openPart(part, source) {
    if (disabled || readonly) return;
    activePart = part;
    preview = "";
    const input =
      part === "end" ? endInput?.getElement() : startInput?.getElement();
    popover?.show(source ?? input);
  }

  function handleDraft(part, event) {
    const next = event.target.value.trim();
    if (part === "start") startDraft = next;
    else endDraft = next;

    if (part === "start" && !next) {
      endDraft = "";
      updateRange({ start: "", end: "" });
      return;
    }
    if (part === "end" && next && !range.start) return;
    if (
      next &&
      (!parseIsoDate(next) ||
        dateIsUnavailable(next, { min, max, unavailable }))
    )
      return;
    const nextRange = {
      start: part === "start" ? next : range.start,
      end: part === "end" ? next : range.end,
    };
    if (
      nextRange.start &&
      nextRange.end &&
      compareDates(nextRange.end, nextRange.start) < 0
    ) {
      return;
    }
    if (
      nextRange.start &&
      nextRange.end &&
      rangeContainsUnavailable(nextRange.start, nextRange.end, unavailable)
    ) {
      return;
    }
    updateRange(nextRange);
  }

  function chooseDate(date) {
    if (disabled || readonly || calendarUnavailable(date)) return;

    if (activePart === "start" || !range.start) {
      updateRange({ start: date, end: "" });
      startDraft = date;
      endDraft = "";
      activePart = "end";
      preview = date;
      return;
    }
    const nextRange =
      compareDates(date, range.start) < 0
        ? { start: date, end: range.start }
        : { start: range.start, end: date };
    updateRange(nextRange);
    startDraft = nextRange.start;
    endDraft = nextRange.end;
    preview = "";
    popover?.close();
  }

  function handleKeydown(event, part) {
    if (event.key !== "ArrowDown" || disabled || readonly) return;
    event.preventDefault();
    openPart(part, event.currentTarget);
  }

  function handleOpenChange(nextOpen) {
    if (open === undefined) internalPopoverOpen = nextOpen;
    onopenchange?.(nextOpen);
  }

  $effect(() => {
    startDraft = range.start;
    endDraft = range.end;
  });

  $effect(() => {
    const startElement = startInput?.getElement();
    const endElement = endInput?.getElement();
    if (startElement) {
      startElement.setCustomValidity(
        startInvalid || orderInvalid || rangeUnavailable
          ? statusText
          : required && !range.start
            ? "Choose a start date."
            : "",
      );
    }
    if (endElement) {
      endElement.setCustomValidity(
        endInvalid ||
        endWithoutStartInvalid ||
        orderInvalid ||
        rangeUnavailable
          ? statusText
          : required && !range.end
            ? "Choose an end date."
            : "",
      );
    }
  });

  export function focus(part = "start", options) {
    (part === "end" ? endInput : startInput)?.focus(options);
  }

  export function show(part = "start") {
    openPart(part);
  }

  export function close() {
    popover?.close();
  }
</script>

<fieldset
  {...fieldsetProps}
  data-slot="date-range-picker"
  {disabled}
  class={twMerge(
    "grid w-full gap-3 [&_[data-slot=date-range-field]]:relative [&_[data-slot=date-range-field]]:flex [&_[data-slot=date-range-field]]:items-stretch [&_[data-slot=input]]:pe-12",
    className,
  )}
>
  <legend data-slot="date-range-legend" class="text-sm font-medium">
    {label}
  </legend>
  <div class="grid gap-3 sm:grid-cols-2">
    <div class="grid gap-2">
      <label for={startId} class="text-sm text-gray-600 dark:text-gray-400">
        {startLabel}
      </label>
      <div data-slot="date-range-field">
        <Input
          bind:this={startInput}
          id={startId}
          type="text"
          inputmode="numeric"
          autocomplete="off"
          name={name ? `${name}[start]` : undefined}
          value={startDraft}
          placeholder="YYYY-MM-DD"
          {required}
          {readonly}
          aria-invalid={startInvalid ||
            orderInvalid ||
            rangeUnavailable ||
            undefined}
          aria-describedby={statusId}
          aria-controls={popoverId}
          aria-expanded={popoverOpen && activePart === "start"}
          aria-haspopup="grid"
          data-slot="date-range-start"
          oninput={(event) => handleDraft("start", event)}
          onclick={(event) => openPart("start", event.currentTarget)}
          onkeydown={(event) => handleKeydown(event, "start")}
        />
        <button
          type="button"
          popovertarget={popoverId}
          popovertargetaction="show"
          data-slot="date-range-start-button"
          class={calendarButtonClasses}
          disabled={disabled || readonly}
          aria-label={`Choose ${startLabel.toLowerCase()}`}
          aria-haspopup="grid"
          onclick={() => (activePart = "start")}
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
      </div>
    </div>
    <div class="grid gap-2">
      <label for={endId} class="text-sm text-gray-600 dark:text-gray-400">
        {endLabel}
      </label>
      <div data-slot="date-range-field">
        <Input
          bind:this={endInput}
          id={endId}
          type="text"
          inputmode="numeric"
          autocomplete="off"
          name={name ? `${name}[end]` : undefined}
          value={endDraft}
          placeholder="YYYY-MM-DD"
          {required}
          {readonly}
          aria-invalid={endInvalid ||
            endWithoutStartInvalid ||
            orderInvalid ||
            rangeUnavailable ||
            undefined}
          aria-describedby={statusId}
          aria-controls={popoverId}
          aria-expanded={popoverOpen && activePart === "end"}
          aria-haspopup="grid"
          data-slot="date-range-end"
          oninput={(event) => handleDraft("end", event)}
          onclick={(event) => openPart("end", event.currentTarget)}
          onkeydown={(event) => handleKeydown(event, "end")}
        />
        <button
          type="button"
          popovertarget={popoverId}
          popovertargetaction="show"
          data-slot="date-range-end-button"
          class={calendarButtonClasses}
          disabled={disabled || readonly}
          aria-label={`Choose ${endLabel.toLowerCase()}`}
          aria-haspopup="grid"
          onclick={() => (activePart = "end")}
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
      </div>
    </div>
  </div>
  <p
    id={statusId}
    data-slot="date-range-status"
    class={twMerge(
      "text-sm text-gray-600 dark:text-gray-400",
      (startInvalid ||
        endInvalid ||
        endWithoutStartInvalid ||
        orderInvalid ||
        rangeUnavailable) &&
        "text-red-700 dark:text-red-400",
    )}
    aria-live="polite"
  >
    {statusText}
  </p>
  <Popover
    bind:this={popover}
    bind:open
    id={popoverId}
    {defaultOpen}
    onOpenChange={handleOpenChange}
    placement="bottom-start"
    data-slot="date-range-popover"
    class="w-[min(22rem,calc(100vw-1rem))] p-0"
  >
    <Calendar
      value={calendarValue}
      defaultValue={range.start}
      {min}
      {max}
      unavailable={calendarUnavailable}
      rangeStart={decoration.start}
      rangeEnd={range.end ? decoration.end : undefined}
      rangePreview={!range.end ? decoration.end : undefined}
      {locale}
      {dir}
      {disabled}
      {readonly}
      onfocuschange={(date) => {
        if (
          activePart === "end" &&
          range.start &&
          !calendarUnavailable(date)
        ) {
          preview = date;
        }
      }}
      onchange={chooseDate}
    />
  </Popover>
</fieldset>
