<script>
  import { untrack } from "svelte";
  import { twMerge } from "tailwind-merge";
  import Calendar from "../calendar/Calendar.svelte";
  import Input from "../input/Input.svelte";
  import Popover from "../popover/Popover.svelte";
  import {
    formatSchedule,
    instantToWallClock,
    initialScheduleWallClock,
    interpretSchedule,
    resolveTimeZone,
    scheduleCalendarBounds,
    scheduleConstraint,
    timeFields,
    updateTimeField,
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
    allowPast = false,
    min,
    max,
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
  const initialWall = untrack(() =>
    initialScheduleWallClock(initialValue, {
      allowPast,
      min,
      max,
      timeZone: zone,
      minuteStep,
    }),
  );
  let selectedDate = $state(initialWall.date);
  let selectedTime = $state(initialWall.time);
  let draft = $state(
    initialValue
      ? formatSchedule(
          initialValue,
          untrack(() => locale),
          untrack(() => zone),
        )
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
  let validationClock = $state(Date.now());
  let input;
  let popover;
  let panel;
  let root;
  let constraints = $derived({
    allowPast,
    min,
    max,
    reference: new Date(validationClock),
  });
  let calendarBounds = $derived(
    scheduleCalendarBounds({ ...constraints, timeZone: zone }),
  );
  let fields = $derived(timeFields(selectedTime, locale));
  const minutes = Array.from({ length: 60 }, (_, minute) =>
    String(minute).padStart(2, "0"),
  );
  let constraintError = $derived(
    interpretation.iso
      ? scheduleConstraint(interpretation.iso, constraints)
      : "",
  );
  let committable = $derived(
    interpretation.state === "proposal" && !constraintError,
  );
  let invalid = $derived(
    interpretation.state === "invalid" ||
      Boolean(constraintError) ||
      (touched && interpretation.state === "incomplete"),
  );
  let statusText = $derived.by(() => {
    if (interpretation.state === "empty")
      return "Type a date and time, or choose them from the calendar.";
    if (interpretation.state === "invalid")
      return "Enter a date and time, such as tomorrow at 9am.";
    if (interpretation.state === "incomplete") return interpretation.message;
    if (constraintError === "past") return "Choose a time in the future.";
    if (constraintError === "min")
      return `Choose ${formatSchedule(min, locale, zone)} or later.`;
    if (constraintError === "max")
      return `Choose ${formatSchedule(max, locale, zone)} or earlier.`;
    if (interpretation.state === "proposal")
      return `${allowPast ? "Use" : "Will schedule for"} ${interpretation.label} in ${zone}. Press Enter or leave the picker to use it.`;
    return `${allowPast ? "Selected" : "Scheduled for"} ${interpretation.label} in ${zone}.`;
  });
  let describedBy = $derived(
    [externalDescribedBy, statusId].filter(Boolean).join(" "),
  );

  function updateValue(nextValue) {
    value = nextValue;
    onchange?.(nextValue);
  }

  function readDraft(nextDraft) {
    validationClock = Date.now();
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
      allowPast,
    });
    interpretation = next;
    if (next.date) selectedDate = next.date;
    if (next.time) selectedTime = next.time;
  }

  function stage(date = selectedDate, time = selectedTime) {
    if (disabled || readonly) return;
    validationClock = Date.now();
    // Reselecting an unchanged instant must not discard its seconds.
    const iso =
      interpretation.iso &&
      interpretation.date === date &&
      interpretation.time === time
        ? interpretation.iso
        : wallClockToIso({ date, time, timeZone: zone });
    selectedDate = date;
    selectedTime = time;
    if (!iso) {
      interpretation = { state: "invalid" };
      return;
    }
    const label = formatSchedule(iso, locale, zone);
    draft = label;
    interpretation = { state: "proposal", iso, date, time, label };
  }

  function commitProposal({ restoreFocus = true } = {}) {
    const reference = new Date();
    validationClock = reference.getTime();
    if (
      interpretation.state !== "proposal" ||
      disabled ||
      readonly ||
      scheduleConstraint(interpretation.iso, { allowPast, min, max, reference })
    )
      return;
    updateValue(interpretation.iso);
    draft = interpretation.label;
    interpretation = { ...interpretation, state: "committed" };
    popover?.close({ restoreFocus });
  }

  function handleFocusOut(event) {
    if (event.relatedTarget && root?.contains(event.relatedTarget)) return;
    touched = true;
    commitProposal({ restoreFocus: false });
  }

  function finish() {
    const reference = new Date();
    validationClock = reference.getTime();
    if (
      disabled ||
      readonly ||
      scheduleConstraint(interpretation.iso, { allowPast, min, max, reference })
    )
      return;
    if (interpretation.state === "committed") {
      popover?.close();
      return;
    }
    commitProposal();
  }

  function handleOpenChange(nextOpen) {
    validationClock = Date.now();
    onopenchange?.(nextOpen);
    if (!nextOpen) return;
    if (interpretation.state === "empty") {
      const wall = initialScheduleWallClock("", {
        allowPast,
        min,
        max,
        timeZone: zone,
        minuteStep,
      });
      selectedDate = wall.date;
      selectedTime = wall.time;
    }
    requestAnimationFrame(() => {
      if (!panel?.getClientRects().length) return;
      panel.parentElement.scrollTop = 0;
    });
  }

  function chooseTimeField(part, nextValue) {
    stage(selectedDate, updateTimeField(selectedTime, part, nextValue, locale));
  }

  $effect(() => {
    const committedValue = value;
    const currentZone = zone;
    const currentLocale = locale;
    untrack(() => {
      const wall = instantToWallClock(committedValue, currentZone);
      if (!wall) {
        if (!committedValue) {
          draft = "";
          interpretation = { state: "empty" };
        }
        return;
      }
      const label = formatSchedule(committedValue, currentLocale, currentZone);
      selectedDate = wall.date;
      selectedTime = wall.time;
      draft = label;
      interpretation = {
        state: "committed",
        iso: committedValue,
        ...wall,
        label,
      };
    });
  });

  $effect(() => {
    const element = input?.getElement();
    if (!element) return;
    if (required && !value)
      element.setCustomValidity("Choose a date and time.");
    else if (invalid || interpretation.state === "incomplete")
      element.setCustomValidity(statusText);
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
  bind:this={root}
  data-slot="schedule-picker"
  data-state={interpretation.state}
  onfocusout={handleFocusOut}
  class={twMerge(
    "grid w-full gap-2 **:data-[slot=schedule-picker-field]:relative **:data-[slot=schedule-picker-field]:flex **:data-[slot=schedule-picker-field]:items-stretch **:data-[slot=input]:pe-12",
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
      oninput={(event) => {
        touched = false;
        readDraft(event.target.value);
      }}
      onclick={() => !disabled && !readonly && popover?.show()}
      onkeydown={(event) => {
        inputProps.onkeydown?.(event);
        if (event.defaultPrevented) return;
        if (event.key === "ArrowDown" && !disabled && !readonly) {
          event.preventDefault();
          popover?.show();
        } else if (
          event.key === "Enter" &&
          (interpretation.state === "proposal" ||
            interpretation.state === "incomplete" ||
            interpretation.state === "invalid" ||
            constraintError)
        ) {
          event.preventDefault();
          touched = true;
          commitProposal({ restoreFocus: false });
        }
      }}
    />
    <button
      type="button"
      popovertarget={popoverId}
      data-slot="schedule-picker-button"
      class="absolute inset-y-0 inset-e-0 grid min-w-11 place-items-center rounded-e-md text-gray-500 hover:bg-gray-100 hover:text-gray-950 focus-visible:z-10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-950 disabled:cursor-not-allowed disabled:opacity-40 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-white dark:focus-visible:outline-white"
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
    <input type="hidden" {name} {value} {disabled} />
  {/if}
  <p
    id={statusId}
    data-slot="schedule-picker-status"
    class="text-sm text-gray-600 aria-invalid:text-red-700 dark:text-gray-400 dark:aria-invalid:text-red-400"
    aria-invalid={invalid}
    aria-live="polite"
  >
    {statusText}
  </p>
  <Popover
    bind:this={popover}
    bind:open
    id={popoverId}
    anchor={inputId}
    {defaultOpen}
    onOpenChange={handleOpenChange}
    placement="bottom-start"
    data-slot="schedule-picker-popover"
    class="max-h-[min(var(--klean-popover-available-height,100dvh),calc(100dvh-1rem))] w-[min(24rem,calc(100vw-1rem))] overflow-y-auto overscroll-contain rounded-xl p-0"
  >
    <div bind:this={panel} data-slot="schedule-picker-panel">
      <div class="grid">
        <Calendar
          value={selectedDate}
          min={calendarBounds.min}
          max={calendarBounds.max}
          {locale}
          {dir}
          {disabled}
          {readonly}
          class="max-w-none p-4"
          onchange={(date) => stage(date, selectedTime)}
        />
        <section
          data-slot="schedule-picker-times"
          class="sticky bottom-0 grid min-w-0 gap-2 border-t border-gray-200 bg-white px-4 py-3 dark:border-gray-800 dark:bg-gray-950"
          aria-labelledby={timeHeadingId}
        >
          <div class="flex min-w-0 items-baseline justify-between gap-3">
            <h2 id={timeHeadingId} class="text-sm font-medium">Time</h2>
            <p
              id={`${inputId}-time-zone`}
              data-slot="schedule-picker-time-zone"
              class="min-w-0 text-end text-xs wrap-anywhere text-gray-500 dark:text-gray-400"
            >
              {zone}
            </p>
          </div>
          <div class="flex flex-wrap items-center justify-between gap-2">
            <div
              data-slot="schedule-picker-time-fields"
              role="group"
              aria-labelledby={timeHeadingId}
              aria-describedby={`${inputId}-time-zone`}
              dir="ltr"
              class="inline-flex shrink-0 items-center rounded-lg border border-gray-200 bg-gray-50 p-0.5 text-sm font-medium tabular-nums shadow-xs dark:border-gray-700 dark:bg-gray-900"
            >
              <select
                data-slot="schedule-picker-hour"
                aria-label="Hour"
                class="h-11 w-11 cursor-pointer appearance-none rounded-md bg-transparent text-center text-gray-950 hover:bg-gray-200/60 focus-visible:bg-white focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-gray-950 disabled:cursor-not-allowed disabled:opacity-40 dark:text-white dark:hover:bg-gray-800 dark:focus-visible:bg-gray-800 dark:focus-visible:outline-white"
                value={fields.hour}
                disabled={disabled || readonly}
                onchange={(event) =>
                  chooseTimeField("hour", event.target.value)}
              >
                {#each fields.hours as hour (hour.value)}
                  <option value={hour.value}>{hour.label}</option>
                {/each}
              </select>
              <span aria-hidden="true" class="text-gray-400">:</span>
              <select
                data-slot="schedule-picker-minute"
                aria-label="Minute"
                class="h-11 w-11 cursor-pointer appearance-none rounded-md bg-transparent text-center text-gray-950 hover:bg-gray-200/60 focus-visible:bg-white focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-gray-950 disabled:cursor-not-allowed disabled:opacity-40 dark:text-white dark:hover:bg-gray-800 dark:focus-visible:bg-gray-800 dark:focus-visible:outline-white"
                value={fields.minute}
                disabled={disabled || readonly}
                onchange={(event) =>
                  chooseTimeField("minute", event.target.value)}
              >
                {#each minutes as minute (minute)}
                  <option value={minute}>{minute}</option>
                {/each}
              </select>
              {#if fields.hour12}
                <div
                  class="relative ms-1 border-s border-gray-200 ps-1 dark:border-gray-700"
                >
                  <select
                    data-slot="schedule-picker-period"
                    aria-label="Period"
                    class="h-11 min-w-16 cursor-pointer appearance-none rounded-md bg-transparent ps-2 pe-6 text-gray-950 hover:bg-gray-200/60 focus-visible:bg-white focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-gray-950 disabled:cursor-not-allowed disabled:opacity-40 dark:text-white dark:hover:bg-gray-800 dark:focus-visible:bg-gray-800 dark:focus-visible:outline-white"
                    value={fields.period}
                    disabled={disabled || readonly}
                    onchange={(event) =>
                      chooseTimeField("period", event.target.value)}
                  >
                    {#each fields.periods as period (period.value)}
                      <option value={period.value}>{period.label}</option>
                    {/each}
                  </select>
                  <svg
                    aria-hidden="true"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="1.5"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    class="pointer-events-none absolute inset-e-2 top-1/2 size-3 -translate-y-1/2 text-gray-500 dark:text-gray-400"
                  >
                    <path d="m7 10 5 5 5-5" />
                  </svg>
                </div>
              {/if}
            </div>
            <div data-slot="schedule-picker-footer">
              <button
                type="button"
                data-slot="schedule-picker-confirm"
                class="min-h-11 cursor-pointer rounded-lg bg-gray-950 px-4 py-2 text-sm font-medium text-white hover:bg-gray-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-950 disabled:cursor-not-allowed disabled:opacity-40 dark:bg-white dark:text-gray-950 dark:hover:bg-gray-200 dark:focus-visible:outline-white"
                disabled={(!committable &&
                  interpretation.state !== "committed") ||
                  invalid ||
                  disabled ||
                  readonly}
                onclick={finish}
              >
                Done
              </button>
            </div>
          </div>
          {#if invalid}
            <p class="text-sm text-red-700 dark:text-red-400">{statusText}</p>
          {/if}
        </section>
      </div>
    </div>
  </Popover>
</div>
