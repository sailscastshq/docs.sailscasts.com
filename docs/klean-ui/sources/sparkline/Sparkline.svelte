<script>
  import { twMerge } from "tailwind-merge";

  let {
    data = [],
    label,
    class: className,
    role: _role,
    "aria-label": _ariaLabel,
    "aria-hidden": _ariaHidden,
    "data-slot": _dataSlot,
    ...props
  } = $props();

  const width = 120;
  const height = 24;
  const inset = 1.5;

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

  let chart = $derived(geometry(data));
</script>

<svg
  {...props}
  data-slot="sparkline"
  role={label ? "img" : undefined}
  aria-label={label}
  aria-hidden={label ? undefined : "true"}
  focusable="false"
  viewBox="0 0 120 24"
  preserveAspectRatio="none"
  fill="none"
  class={twMerge("h-6 w-30 overflow-visible", className)}
>
  {#each chart.segments as segment, index (index)}
    {#if segment.length > 1}
      <polyline
        data-slot="sparkline-line"
        points={coordinates(segment)}
        stroke="currentColor"
        stroke-width="1.5"
        stroke-linecap="round"
        stroke-linejoin="round"
        vector-effect="non-scaling-stroke"
      />
    {:else}
      <circle
        data-slot="sparkline-point"
        cx={segment[0].x}
        cy={segment[0].y}
        r="1.75"
        fill="currentColor"
        vector-effect="non-scaling-stroke"
      />
    {/if}
  {/each}
</svg>
