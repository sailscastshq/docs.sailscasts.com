<script>
  import { untrack } from "svelte";
  import { twMerge } from "tailwind-merge";
  import Calendar from "../calendar/Calendar.svelte";
  import Input from "../input/Input.svelte";
  import Popover from "../popover/Popover.svelte";
  import {
    formatSchedule,
    formatTimeLabel,
    instantToWallClock,
    interpretSchedule,
    resolveTimeZone,
    roundedFutureWallClock,
    timeOptions,
    wallClockToIso,
  } from "./schedule.js";

  let {
    value = $bindable(),
    defaultValue,
    onchange,
    id,
    name,
    placeholder = "Tomorrow at 9am",
    timeZone,
    locale,
    dir,
    min,
    minuteStep = 15,
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
  let inputId = $derived(id ?? `klean-schedule-picker-${generatedId}`);
  let popoverId = $derived(`${inputId}-panel`);
  let statusId = $derived(`${inputId}-status`);
  let timeHeadingId = $derived(`${inputId}-time-heading`);
  let zone = $derived(resolveTimeZone(timeZone));
  const initialValue = untrack(() => {
    const candidate = value === undefined ? defaultValue : value;
    return Number.isNaN(new Date(candidate).getTime()) ? "" : candidate;
  });
  if (untrack(() => value) === undefined) value = initialValue;
  const initialWall =
    instantToWallClock(initialValue, untrack(() => zone)) ||
    roundedFutureWallClock(
      new Date(),
      untrack(() => zone),
      untrack(() => minuteStep),
    );
  let selectedDate = $state(initialWall.date);
  let selectedTime = $state(initialWall.time);
  let draft = $state(
    initialValue
      ? formatSchedule(initialValue, untrack(() => locale), untrack(() => zone))
      : "",
  );
  let interpretation = $state(
    initialValue
      ? {
          state: "committed",
          iso: initialValue,
          ...initialWall,
          label: formatSchedule(
            initialValue,
            untrack(() => locale),
            untrack(() => zone),
          ),
        }
      : { state: "empty" },
  );
  let touched = $state(false);
  let input;
  let popover;
  let panel;
  let minimumTimestamp = $derived.by(() => {
    const configured = new Date(min).getTime();
    return Math.max(Date.now(), Number.isNaN(configured) ? -Infinity : configured);
  });
  let calendarMin = $derived(
    instantToWallClock(
      new Date(minimumTimestamp + 1000).toISOString(),
      zone,
    ).date,
  );
  let choices = $derived(timeOptions(minuteStep));
  let proposalIsPast = $derived(
    interpretation.state === "proposal" &&
      new Date(interpretation.iso).getTime() <= minimumTimestamp,
  );
  let committable = $derived(
    interpretation.state === "proposal" && !proposalIsPast,
  );
  let invalid = $derived(
    interpretation.state === "invalid" ||
      proposalIsPast ||
      (touched && interpretation.state === "incomplete"),
  );
  let statusText = $derived.by(() => {
    if (interpretation.state === "empty")
      return "Type a date and time, or choose them from the calendar.";
    if (interpretation.state === "invalid")
      return "Enter a date and time, such as tomorrow at 9am.";
    if (interpretation.state === "incomplete") return interpretation.message;
    if (proposalIsPast) return "Choose a time in the future.";
    if (interpretation.state === "proposal")
      return `Use ${interpretation.label} in ${zone}?`;
    return `Scheduled for ${interpretation.label} in ${zone}.`;
  });
  let describedBy = $derived(
    [externalDescribedBy, statusId].filter(Boolean).join(" "),
  );

  function updateValue(nextValue) {
    value = nextValue;
    onchange?.(nextValue);
  }

  function readDraft(nextDraft) {
    draft = nextDraft;
    if (!nextDraft.trim()) {
      updateValue("");
      interpretation = { state: "empty" };
      return;
    }
    const next = interpretSchedule(nextDraft, {
      reference: new Date(),
      locale,
      timeZone: zone,
    });
    interpretation = next;
    if (next.date) selectedDate = next.date;
    if (next.time) selectedTime = next.time;
  }

  function stage(date = selectedDate, time = selectedTime) {
    const iso = wallClockToIso({ date, time, timeZone: zone });
    if (!iso) {
      interpretation = { state: "invalid" };
      return;
    }
    const label = formatSchedule(iso, locale, zone);
    selectedDate = date;
    selectedTime = time;
    draft = label;
    interpretation = { state: "proposal", iso, date, time, label };
  }

  function commitProposal() {
    if (!committable || disabled || readonly) return;
    updateValue(interpretation.iso);
    draft = interpretation.label;
    interpretation = { ...interpretation, state: "committed" };
    popover?.close();
  }

  function handleOpenChange(nextOpen) {
    onopenchange?.(nextOpen);
    if (!nextOpen) return;
    queueMicrotask(() =>
      panel
        ?.querySelector(`[data-time="${selectedTime}"]`)
        ?.scrollIntoView?.({ block: "center" }),
    );
  }

  function timeIsUnavailable(time) {
    const iso = wallClockToIso({ date: selectedDate, time, timeZone: zone });
    return !iso || new Date(iso).getTime() <= minimumTimestamp;
  }

  function handleTimeKeydown(event, index) {
    let nextIndex;
    if (event.key === "ArrowDown")
      nextIndex = Math.min(index + 1, choices.length - 1);
    else if (event.key === "ArrowUp") nextIndex = Math.max(index - 1, 0);
    else if (event.key === "Home") nextIndex = 0;
    else if (event.key === "End") nextIndex = choices.length - 1;
    else return;
    event.preventDefault();
    const movement = nextIndex >= index ? 1 : -1;
    while (
      nextIndex >= 0 &&
      nextIndex < choices.length &&
      timeIsUnavailable(choices[nextIndex])
    ) {
      nextIndex += movement;
    }
    const nextTime = choices[nextIndex];
    if (!nextTime) return;
    selectedTime = nextTime;
    queueMicrotask(() =>
      panel
        ?.querySelector(`[data-time="${nextTime}"]`)
        ?.focus({ preventScroll: true }),
    );
  }

  $effect(() => {
    const wall = instantToWallClock(value, zone);
    if (!wall) {
      if (!value && interpretation.state === "committed") {
        draft = "";
        interpretation = { state: "empty" };
      }
      return;
    }
    if (interpretation.state === "proposal" && interpretation.iso === value)
      return;
    const label = formatSchedule(value, locale, zone);
    selectedDate = wall.date;
    selectedTime = wall.time;
    draft = label;
    interpretation = { state: "committed", iso: value, ...wall, label };
  });

  $effect(() => {
    const element = input?.getElement();
    if (!element) return;
    if (required && !value)
      element.setCustomValidity("Choose and confirm a schedule.");
    else if (invalid) element.setCustomValidity(statusText);
    else if (committable)
      element.setCustomValidity("Confirm the interpreted schedule.");
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
  data-slot="schedule-picker"
  data-state={interpretation.state}
  class={twMerge(
    "grid w-full gap-2 [&_[data-slot=schedule-picker-field]]:relative [&_[data-slot=schedule-picker-field]]:flex [&_[data-slot=schedule-picker-field]]:items-stretch [&_[data-slot=input]]:pe-12",
    className,
  )}
>
  <div data-slot="schedule-picker-field">
    <Input
      {...inputProps}
      bind:this={input}
      id={inputId}
      type="text"
      autocomplete="off"
      value={draft}
      {placeholder}
      {required}
      {disabled}
      {readonly}
      aria-invalid={invalid || undefined}
      aria-describedby={describedBy}
      data-slot="schedule-picker-input"
      oninput={(event) => {
        touched = false;
        readDraft(event.target.value);
      }}
      onblur={() => (touched = true)}
      onclick={() => !disabled && !readonly && popover?.show()}
      onkeydown={(event) => {
        inputProps.onkeydown?.(event);
        if (event.defaultPrevented) return;
        if (event.key === "ArrowDown" && !disabled && !readonly) {
          event.preventDefault();
          popover?.show();
        } else if (event.key === "Enter" && committable) {
          event.preventDefault();
          commitProposal();
        }
      }}
    />
    <button
      type="button"
      popovertarget={popoverId}
      data-slot="schedule-picker-button"
      class="absolute inset-y-0 end-0 grid min-w-11 place-items-center rounded-e-md text-gray-500 hover:bg-gray-100 hover:text-gray-950 focus-visible:z-10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-950 disabled:cursor-not-allowed disabled:opacity-40 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-white dark:focus-visible:outline-white"
      disabled={disabled || readonly}
      aria-label="Choose a date and time"
    >
      <svg
        aria-hidden="true"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="1.8"
        class="size-5"
      >
        <circle cx="12" cy="12" r="9" />
        <path d="M12 7v5l3 2" />
      </svg>
    </button>
  </div>
  {#if name}
    <input type="hidden" {name} {value} />
  {/if}
  <p
    id={statusId}
    data-slot="schedule-picker-status"
    class="text-sm text-gray-600 aria-[invalid=true]:text-red-700 dark:text-gray-400 dark:aria-[invalid=true]:text-red-400"
    aria-invalid={invalid}
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
    data-slot="schedule-picker-popover"
    class="w-[min(42rem,calc(100vw-1rem))] p-0"
  >
    <div bind:this={panel} data-slot="schedule-picker-panel">
      <div class="grid sm:grid-cols-[minmax(0,1fr)_10rem]">
        <Calendar
          value={selectedDate}
          min={calendarMin}
          {locale}
          {dir}
          {disabled}
          {readonly}
          class="max-w-none p-4"
          onchange={(date) => stage(date, selectedTime)}
        />
        <section
          data-slot="schedule-picker-times"
          class="border-t border-gray-200 p-3 sm:border-s sm:border-t-0 dark:border-gray-700"
          aria-labelledby={timeHeadingId}
        >
          <h2 id={timeHeadingId} class="px-2 pb-2 text-sm font-semibold">
            Time
          </h2>
          <div
            role="listbox"
            aria-label="Choose a time"
            class="max-h-64 overflow-y-auto overscroll-contain"
          >
            {#each choices as time, index (time)}
              <button
                type="button"
                role="option"
                data-slot="schedule-picker-time"
                data-time={time}
                aria-selected={time === selectedTime}
                disabled={timeIsUnavailable(time)}
                tabindex={time === selectedTime ? 0 : -1}
                class="block min-h-11 w-full rounded-md px-3 text-start text-sm tabular-nums hover:bg-gray-100 focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-gray-950 disabled:cursor-not-allowed disabled:text-gray-300 aria-selected:bg-gray-950 aria-selected:font-semibold aria-selected:text-white dark:hover:bg-gray-800 dark:focus-visible:outline-white dark:disabled:text-gray-700 dark:aria-selected:bg-white dark:aria-selected:text-gray-950"
                onclick={() => stage(selectedDate, time)}
                onkeydown={(event) => handleTimeKeydown(event, index)}
              >
                {formatTimeLabel(time, locale)}
              </button>
            {/each}
          </div>
        </section>
      </div>
      <footer
        data-slot="schedule-picker-footer"
        class="flex flex-col gap-3 border-t border-gray-200 p-4 sm:flex-row sm:items-center sm:justify-between dark:border-gray-700"
      >
        <p class="text-sm text-gray-600 dark:text-gray-400">{statusText}</p>
        <button
          type="button"
          data-slot="schedule-picker-confirm"
          class="min-h-11 shrink-0 rounded-md bg-gray-950 px-4 py-2 text-sm font-semibold text-white hover:bg-gray-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-950 disabled:cursor-not-allowed disabled:opacity-40 dark:bg-white dark:text-gray-950 dark:hover:bg-gray-200 dark:focus-visible:outline-white"
          disabled={!committable || disabled || readonly}
          onclick={commitProposal}
        >
          Use this time
        </button>
      </footer>
    </div>
  </Popover>
</div>
