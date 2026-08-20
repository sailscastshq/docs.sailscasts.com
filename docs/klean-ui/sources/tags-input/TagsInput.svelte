<script>
  import { tick } from "svelte";
  import { twMerge } from "tailwind-merge";

  const ROOT_CLASSES = [
    "flex min-h-11 w-full flex-wrap items-center gap-2 rounded-md border border-gray-300 bg-white px-3 py-2 text-gray-950 shadow-sm outline-none transition-colors duration-150",
    "hover:border-gray-400 focus-within:border-gray-950 focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-gray-950",
    "data-disabled:cursor-not-allowed data-disabled:bg-gray-100 data-disabled:text-gray-500",
    "data-invalid:border-red-600 data-invalid:focus-within:outline-red-600",
    "dark:border-gray-700 dark:bg-gray-950 dark:text-white dark:hover:border-gray-600 dark:focus-within:border-white dark:focus-within:outline-white dark:data-disabled:bg-gray-900 dark:data-disabled:text-gray-500 dark:data-invalid:border-red-500 dark:data-invalid:focus-within:outline-red-500",
    "motion-reduce:transition-none",
  ];

  let {
    value = $bindable([]),
    draft = $bindable(""),
    onchange,
    ondraftchange,
    onreject,
    name,
    form,
    placeholder = "Add a tag",
    disabled = false,
    readonly = false,
    required = false,
    max = Number.POSITIVE_INFINITY,
    normalize = (candidate) => candidate.trim(),
    validate = () => true,
    class: className,
    onblur,
    onkeydown,
    onpaste,
    oncompositionstart,
    oncompositionend,
    "aria-invalid": ariaInvalid,
    "data-slot": _dataSlot,
    "data-disabled": _dataDisabled,
    "data-invalid": _dataInvalid,
    ...inputProps
  } = $props();

  let element = $state();
  let removeElements = $state([]);
  let status = $state("");
  let composing = false;
  const initialValue = [...value];
  const initialDraft = draft;
  let invalid = $derived(ariaInvalid === true || ariaInvalid === "true");

  function announce(message) {
    status = "";
    queueMicrotask(() => {
      status = message;
    });
  }

  function setTags(next) {
    value = next;
    onchange?.(next);
  }

  function setDraft(next) {
    draft = next;
    ondraftchange?.(next);
  }

  function rejection(raw, message) {
    announce(message);
    onreject?.({ value: raw, message });
    return { accepted: false, raw, message };
  }

  function evaluate(raw, tags) {
    let tag;
    try {
      tag = String(normalize(String(raw)) ?? "").trim();
    } catch {
      return rejection(raw, "That tag could not be normalized.");
    }

    if (!tag) return { accepted: false, empty: true, raw };
    if (tags.length >= max) {
      return rejection(raw, `You can add up to ${max} tags.`);
    }
    if (tags.includes(tag)) {
      return rejection(raw, `${tag} is already added.`);
    }

    const result = validate(tag, tags);
    if (result !== true) {
      return rejection(
        raw,
        typeof result === "string" && result
          ? result
          : `${tag} is not a valid tag.`,
      );
    }

    return { accepted: true, tag, raw };
  }

  function addCandidates(candidates) {
    const next = [...value];
    const rejected = [];
    const rejectionMessages = [];
    const added = [];

    for (const candidate of candidates) {
      const result = evaluate(candidate, next);
      if (result.accepted) {
        next.push(result.tag);
        added.push(result.tag);
      } else if (!result.empty && String(candidate).trim()) {
        rejected.push(String(candidate).trim());
        rejectionMessages.push(result.message);
      }
    }

    if (added.length) {
      setTags(next);
      const addition =
        added.length === 1
          ? `${added[0]} added.`
          : `${added.length} tags added.`;
      announce(
        rejectionMessages.length
          ? `${addition} ${rejectionMessages.at(-1)}`
          : addition,
      );
    } else if (rejectionMessages.length) {
      announce(rejectionMessages.at(-1));
    }
    setDraft(rejected.join(", "));
    return added.length > 0;
  }

  export function commit() {
    if (disabled || readonly) return false;
    if (!draft.trim()) {
      setDraft("");
      return false;
    }
    return addCandidates([draft]);
  }

  async function removeAt(index, restoreFocus = true) {
    if (disabled || readonly || index < 0) return;
    const next = [...value];
    const [removed] = next.splice(index, 1);
    if (removed === undefined) return;

    setTags(next);
    announce(`${removed} removed.`);
    if (restoreFocus) {
      await tick();
      const controls = element
        ?.closest('[data-slot="tags-input"]')
        ?.querySelectorAll('[data-part="remove"]');
      (controls?.[index] ?? controls?.[index - 1] ?? element)?.focus();
    }
  }

  function handleInputKeydown(event) {
    onkeydown?.(event);
    if (event.defaultPrevented || composing || event.isComposing) return;

    if (event.key === "Enter" || event.key === ",") {
      event.preventDefault();
      commit();
    } else if (event.key === "Backspace" && !draft && value.length) {
      event.preventDefault();
      removeAt(value.length - 1, false);
      element?.focus();
    } else if (
      event.key === "ArrowLeft" &&
      event.currentTarget.selectionStart === 0 &&
      value.length
    ) {
      event.preventDefault();
      removeElements.at(-1)?.focus();
    }
  }

  function handleRemoveKeydown(event, index) {
    if (event.key === "ArrowLeft") {
      event.preventDefault();
      (removeElements[index - 1] ?? element)?.focus();
    } else if (event.key === "ArrowRight") {
      event.preventDefault();
      (removeElements[index + 1] ?? element)?.focus();
    } else if (event.key === "Home") {
      event.preventDefault();
      removeElements[0]?.focus();
    } else if (event.key === "End") {
      event.preventDefault();
      element?.focus();
    } else if (event.key === "Delete" || event.key === "Backspace") {
      event.preventDefault();
      removeAt(index);
    }
  }

  function handlePaste(event) {
    onpaste?.(event);
    if (event.defaultPrevented || disabled || readonly) return;
    const pasted = event.clipboardData?.getData("text") ?? "";
    if (!/[,\n]/.test(pasted)) return;

    event.preventDefault();
    addCandidates(`${draft}${pasted}`.split(/[,\n]+/));
  }

  function handleBlur(event) {
    onblur?.(event);
    if (!event.defaultPrevented) commit();
  }

  $effect(() => {
    const form = element?.form;
    if (!form) return;

    function handleReset() {
      queueMicrotask(() => {
        setTags([...initialValue]);
        setDraft(initialDraft);
      });
    }

    form.addEventListener("reset", handleReset);
    return () => form.removeEventListener("reset", handleReset);
  });

  export function getElement() {
    return element;
  }

  export function focus(options) {
    element?.focus(options);
  }
</script>

<div
  data-slot="tags-input"
  data-disabled={disabled ? "" : undefined}
  data-readonly={readonly ? "" : undefined}
  data-invalid={invalid ? "" : undefined}
  class={twMerge(ROOT_CLASSES, className)}
>
  {#if value.length}
    <ul role="list" data-part="list" class="contents">
      {#each value as tag, index (`${tag}-${index}`)}
        <li
          data-part="tag"
          class="inline-flex min-w-0 items-center gap-1 rounded-md bg-gray-100 px-2 py-1 text-sm text-gray-800 dark:bg-gray-800 dark:text-gray-100"
        >
          <span data-part="tag-label" class="min-w-0 truncate">{tag}</span>
          {#if !readonly}
            <button
              bind:this={removeElements[index]}
              type="button"
              data-part="remove"
              {disabled}
              aria-label={`Remove ${tag}`}
              class="-mr-1 inline-grid size-6 shrink-0 cursor-pointer place-items-center rounded-sm text-gray-500 outline-none hover:bg-gray-200 hover:text-gray-950 focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-gray-950 disabled:cursor-not-allowed disabled:opacity-50 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white dark:focus-visible:outline-white"
              onclick={() => removeAt(index)}
              onkeydown={(event) => handleRemoveKeydown(event, index)}
            >
              <svg
                aria-hidden="true"
                viewBox="0 0 20 20"
                class="size-3.5"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
              >
                <path d="m5 5 10 10M15 5 5 15" />
              </svg>
            </button>
          {/if}
        </li>
      {/each}
    </ul>
  {/if}

  <input
    {...inputProps}
    bind:this={element}
    value={draft}
    placeholder={value.length ? undefined : placeholder}
    {disabled}
    {readonly}
    {form}
    required={required && value.length === 0}
    aria-invalid={ariaInvalid}
    data-part="input"
    class="min-h-6 min-w-28 flex-1 border-0 bg-transparent p-0 text-base text-inherit outline-none placeholder:text-gray-500 disabled:cursor-not-allowed dark:placeholder:text-gray-400"
    oninput={(event) => setDraft(event.currentTarget.value)}
    oncompositionstart={(event) => {
      composing = true;
      oncompositionstart?.(event);
    }}
    oncompositionend={(event) => {
      composing = false;
      setDraft(event.currentTarget.value);
      oncompositionend?.(event);
    }}
    onkeydown={handleInputKeydown}
    onpaste={handlePaste}
    onblur={handleBlur}
  />

  {#each value as tag, index (`field-${tag}-${index}`)}
    <input
      type="hidden"
      {name}
      {form}
      value={tag}
      disabled={disabled || !name}
    />
  {/each}
  <span class="sr-only" aria-live="polite" aria-atomic="true">{status}</span>
</div>
