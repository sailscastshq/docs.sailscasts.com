<script>
  import { twMerge } from "tailwind-merge";

  let {
    data = [],
    caption,
    emptyLabel = "No data",
    formatValue = String,
    class: className,
    "data-slot": _dataSlot,
    ...props
  } = $props();

  const width = 640;
  const height = 200;
  const inset = 4;

  function finiteValue(point) {
    return Number.isFinite(point?.value) ? point.value : undefined;
  }

  function geometry(points) {
    const values = points
      .map(finiteValue)
      .filter((value) => value !== undefined);
    if (!values.length) return { segments: [], points: [] };

    let minimum = Math.min(0, ...values);
    let maximum = Math.max(0, ...values);
    if (minimum === maximum) {
      minimum -= 1;
      maximum += 1;
    }

    const x = (index) =>
      points.length === 1
        ? width / 2
        : inset + (index / (points.length - 1)) * (width - inset * 2);
    const y = (value) =>
      inset + ((maximum - value) / (maximum - minimum)) * (height - inset * 2);

    const segments = [];
    const chartPoints = [];
    let segment = [];

    points.forEach((point, index) => {
      const value = finiteValue(point);
      if (value === undefined) {
        if (segment.length) segments.push(segment);
        segment = [];
        return;
      }

      const coordinate = { x: x(index), y: y(value) };
      chartPoints.push(coordinate);
      segment.push(coordinate);
    });
    if (segment.length) segments.push(segment);

    return { segments, points: chartPoints };
  }

  function coordinates(segment) {
    return segment.map((point) => `${point.x},${point.y}`).join(" ");
  }

  function exactValue(point) {
    if (point?.detail) return point.detail;
    const value = finiteValue(point);
    return value === undefined ? emptyLabel : formatValue(value);
  }

  let chart = $derived(geometry(data));
  let hasValues = $derived(chart.points.length > 0);
  let firstLabel = $derived(data[0]?.label ?? "");
  let lastLabel = $derived(data.length > 1 ? (data.at(-1)?.label ?? "") : "");
</script>

<figure
  {...props}
  data-slot="line-chart"
  class={twMerge(
    "grid h-64 grid-rows-[auto_minmax(0,1fr)_auto] gap-3 text-gray-950 dark:text-white",
    className,
  )}
>
  <figcaption data-slot="line-chart-caption" class="text-sm font-semibold">
    {caption}
  </figcaption>

  {#if hasValues}
    <svg
      data-slot="line-chart-graphic"
      aria-hidden="true"
      focusable="false"
      viewBox="0 0 640 200"
      preserveAspectRatio="none"
      fill="none"
      class="h-full min-h-0 w-full overflow-visible"
    >
      {#each chart.segments as segment, index (index)}
        {#if segment.length > 1}
          <polyline
            data-slot="line-chart-line"
            points={coordinates(segment)}
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            vector-effect="non-scaling-stroke"
          />
        {:else}
          <circle
            data-slot="line-chart-point"
            cx={segment[0].x}
            cy={segment[0].y}
            r="3"
            fill="currentColor"
            vector-effect="non-scaling-stroke"
          />
        {/if}
      {/each}
    </svg>
  {:else}
    <p
      data-slot="line-chart-empty"
      class="grid min-h-32 place-items-center text-sm text-gray-500 dark:text-gray-400"
    >
      {emptyLabel}
    </p>
  {/if}

  {#if hasValues}
    <div
      data-slot="line-chart-labels"
      class={twMerge(
        "flex text-xs text-gray-500 tabular-nums dark:text-gray-400",
        lastLabel ? "justify-between" : "justify-center",
      )}
    >
      <span>{firstLabel}</span>
      {#if lastLabel}<span>{lastLabel}</span>{/if}
    </div>
  {/if}

  <ul data-slot="line-chart-values" class="sr-only">
    {#each data as point, index (index)}
      <li>{point?.label}: {exactValue(point)}</li>
    {/each}
  </ul>
</figure>
