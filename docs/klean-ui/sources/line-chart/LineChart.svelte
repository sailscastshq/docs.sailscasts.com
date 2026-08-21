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
  const inset = 8;
  const cornerRadius = 20;
  const guides = [inset, height / 2, height - inset];

  function finiteValue(point) {
    return Number.isFinite(point?.value) ? point.value : undefined;
  }

  function geometry(points) {
    const values = points
      .map(finiteValue)
      .filter((value) => value !== undefined);
    if (!values.length) {
      return {
        segments: [],
        points: [],
        minimum: undefined,
        maximum: undefined,
      };
    }

    const minimum = Math.min(...values);
    const maximum = Math.max(...values);
    let domainMinimum = minimum;
    let domainMaximum = maximum;
    if (domainMinimum === domainMaximum) {
      const padding = Math.max(Math.abs(domainMinimum) * 0.1, 1);
      domainMinimum -= padding;
      domainMaximum += padding;
    }

    const x = (index) =>
      points.length === 1
        ? width / 2
        : inset + (index / (points.length - 1)) * (width - inset * 2);
    const y = (value) =>
      inset +
      ((domainMaximum - value) / (domainMaximum - domainMinimum)) *
        (height - inset * 2);

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

      const coordinate = { x: x(index), y: y(value), index };
      chartPoints.push(coordinate);
      segment.push(coordinate);
    });
    if (segment.length) segments.push(segment);

    return { segments, points: chartPoints, minimum, maximum };
  }

  function compact(value) {
    return Number(value.toFixed(2));
  }

  function roundedPath(segment) {
    if (segment.length < 2) return "";

    let path = `M ${compact(segment[0].x)} ${compact(segment[0].y)}`;

    for (let index = 1; index < segment.length - 1; index += 1) {
      const previous = segment[index - 1];
      const point = segment[index];
      const next = segment[index + 1];
      const previousDistance = Math.hypot(
        point.x - previous.x,
        point.y - previous.y,
      );
      const nextDistance = Math.hypot(next.x - point.x, next.y - point.y);
      const radius = Math.min(
        cornerRadius,
        previousDistance / 3,
        nextDistance / 3,
      );
      const before = {
        x: point.x + ((previous.x - point.x) / previousDistance) * radius,
        y: point.y + ((previous.y - point.y) / previousDistance) * radius,
      };
      const after = {
        x: point.x + ((next.x - point.x) / nextDistance) * radius,
        y: point.y + ((next.y - point.y) / nextDistance) * radius,
      };

      path += ` L ${compact(before.x)} ${compact(before.y)} Q ${compact(point.x)} ${compact(point.y)} ${compact(after.x)} ${compact(after.y)}`;
    }

    const last = segment.at(-1);
    return `${path} L ${compact(last.x)} ${compact(last.y)}`;
  }

  function exactValue(point) {
    if (point?.detail) return point.detail;
    const value = finiteValue(point);
    return value === undefined ? emptyLabel : formatValue(value);
  }

  function pointLabel(point) {
    const value = exactValue(point);
    return point?.detail || !point?.label ? value : `${point.label}: ${value}`;
  }

  function pointStyle(point) {
    return `left: ${(point.x / width) * 100}%; top: ${(point.y / height) * 100}%`;
  }

  function tipPosition(point) {
    const horizontal =
      point.x <= width * 0.2
        ? "left-1/2"
        : point.x >= width * 0.8
          ? "right-1/2"
          : "left-1/2 -translate-x-1/2";
    const vertical =
      point.y <= height * 0.32 ? "top-full mt-1.5" : "bottom-full mb-1.5";

    return twMerge(
      "pointer-events-none absolute z-10 w-max max-w-52 rounded-md bg-gray-950 px-2.5 py-1.5 text-xs font-medium text-white opacity-0 shadow-lg group-hover:opacity-100 group-focus:opacity-100 dark:bg-white dark:text-gray-950",
      horizontal,
      vertical,
    );
  }

  let chart = $derived(geometry(data));
  let hasValues = $derived(chart.points.length > 0);
  let firstLabel = $derived(data[0]?.label ?? "");
  let middleLabel = $derived(
    data.length > 2
      ? (data[Math.floor((data.length - 1) / 2)]?.label ?? "")
      : "",
  );
  let lastLabel = $derived(data.length > 1 ? (data.at(-1)?.label ?? "") : "");
  let currentPoint = $derived(chart.points.at(-1));
</script>

<figure
  {...props}
  data-slot="line-chart"
  class={twMerge(
    "grid h-56 grid-cols-[auto_minmax(0,1fr)] grid-rows-[auto_minmax(0,1fr)_auto] gap-x-3 gap-y-2 text-gray-950 dark:text-white",
    className,
  )}
>
  <figcaption
    data-slot="line-chart-caption"
    class="col-span-2 text-sm font-semibold"
  >
    {caption}
  </figcaption>

  {#if hasValues}
    <div
      data-slot="line-chart-scale"
      class={twMerge(
        "row-start-2 grid min-w-8 text-right text-[11px] leading-none text-gray-500 tabular-nums dark:text-gray-400",
        chart.minimum === chart.maximum
          ? "place-items-center"
          : "content-between",
      )}
    >
      <span>{formatValue(chart.maximum)}</span>
      {#if chart.minimum !== chart.maximum}
        <span>{formatValue(chart.minimum)}</span>
      {/if}
    </div>
  {/if}

  {#if hasValues}
    <div
      data-slot="line-chart-plot"
      class="relative col-start-2 row-start-2 min-h-0"
    >
      <svg
        data-slot="line-chart-graphic"
        aria-hidden="true"
        focusable="false"
        viewBox="0 0 640 200"
        preserveAspectRatio="none"
        fill="none"
        class="h-full w-full overflow-visible"
      >
        <g
          data-slot="line-chart-guides"
          class="text-gray-200 dark:text-gray-800"
        >
          {#each guides as guide (guide)}
            <line
              data-slot="line-chart-guide"
              x1={inset}
              x2={width - inset}
              y1={guide}
              y2={guide}
              stroke="currentColor"
              stroke-width="1"
              vector-effect="non-scaling-stroke"
            />
          {/each}
        </g>
        {#each chart.segments as segment, index (index)}
          {#if segment.length > 1}
            <path
              data-slot="line-chart-line"
              d={roundedPath(segment)}
              stroke="currentColor"
              stroke-width="2.5"
              stroke-linecap="round"
              stroke-linejoin="round"
              vector-effect="non-scaling-stroke"
            />
          {/if}
        {/each}
        {#each chart.points as point (point.index)}
          <circle
            data-slot="line-chart-point"
            cx={point.x}
            cy={point.y}
            r="2.25"
            fill="currentColor"
            opacity="0.38"
            vector-effect="non-scaling-stroke"
          />
        {/each}
        {#if currentPoint}
          <circle
            data-slot="line-chart-current-halo"
            cx={currentPoint.x}
            cy={currentPoint.y}
            r="7"
            fill="currentColor"
            opacity="0.14"
            vector-effect="non-scaling-stroke"
          />
          <circle
            data-slot="line-chart-current"
            cx={currentPoint.x}
            cy={currentPoint.y}
            r="3.5"
            fill="currentColor"
            vector-effect="non-scaling-stroke"
          />
        {/if}
      </svg>

      <div
        data-slot="line-chart-values"
        role="list"
        aria-label={`${caption} values`}
        class="pointer-events-none absolute inset-0"
      >
        {#each chart.points as point (point.index)}
          <span role="listitem">
            <button
              type="button"
              data-slot="line-chart-hit"
              aria-label={`Inspect ${pointLabel(data[point.index])}`}
              style={pointStyle(point)}
              class="group pointer-events-auto absolute size-7 -translate-x-1/2 -translate-y-1/2 cursor-crosshair rounded-full outline-none focus-visible:ring-2 focus-visible:ring-current focus-visible:ring-offset-2 dark:focus-visible:ring-offset-gray-950"
            >
              <span
                data-slot="line-chart-hover-point"
                aria-hidden="true"
                class="absolute left-1/2 top-1/2 size-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-current opacity-0 ring-2 ring-white group-hover:opacity-100 group-focus:opacity-100 dark:ring-gray-950"
              ></span>
              <span
                data-slot="line-chart-tip"
                aria-hidden="true"
                class={tipPosition(point)}
              >
                {pointLabel(data[point.index])}
              </span>
            </button>
          </span>
        {/each}
        {#each data as point, index (index)}
          {#if finiteValue(point) === undefined}
            <span role="listitem" class="sr-only">{pointLabel(point)}</span>
          {/if}
        {/each}
      </div>
    </div>
  {:else}
    <p
      data-slot="line-chart-empty"
      class="col-span-2 grid min-h-32 place-items-center text-sm text-gray-500 dark:text-gray-400"
    >
      {emptyLabel}
    </p>
  {/if}

  {#if hasValues}
    <div
      data-slot="line-chart-labels"
      class={twMerge(
        "col-start-2 row-start-3 flex text-xs text-gray-500 tabular-nums dark:text-gray-400",
        lastLabel ? "justify-between" : "justify-center",
      )}
    >
      <span>{firstLabel}</span>
      {#if middleLabel}<span>{middleLabel}</span>{/if}
      {#if lastLabel}<span>{lastLabel}</span>{/if}
    </div>
  {/if}
</figure>
