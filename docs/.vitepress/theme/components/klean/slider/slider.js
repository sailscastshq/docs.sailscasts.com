const finite = (value, fallback) =>
  Number.isFinite(Number(value)) ? Number(value) : fallback
const clamp = (value, min, max) => Math.min(max, Math.max(min, value))
const tidy = (value) => Number(value.toPrecision(12))

export function sliderBounds(
  min = 0,
  max = 100,
  step = 1,
  minStepsBetween = 0
) {
  min = finite(min, 0)
  max = Math.max(min, finite(max, 100))
  const numericStep = finite(step, 1)
  step =
    step === 'any'
      ? 'any'
      : Math.max(Number.EPSILON, numericStep > 0 ? numericStep : 1)
  const end =
    step === 'any'
      ? max
      : tidy(min + Math.floor((max - min) / step + 1e-10) * step)
  const gap =
    step === 'any'
      ? 0
      : tidy(
          Math.min(
            end - min,
            Math.max(0, Math.floor(finite(minStepsBetween, 0))) * step
          )
        )
  return { min, max: end, step, gap }
}

export function snap(value, bounds) {
  const { min, max, step } = bounds
  value = clamp(finite(value, min + (max - min) / 2), min, max)
  return step === 'any'
    ? value
    : clamp(tidy(min + Math.round((value - min) / step) * step), min, max)
}

export function sliderValue(value, bounds) {
  if (!Array.isArray(value) || value.length !== 2)
    return snap(Array.isArray(value) ? undefined : value, bounds)
  const sorted = value.map((item) => snap(item, bounds)).sort((a, b) => a - b)
  if (sorted[1] - sorted[0] < bounds.gap) {
    sorted[1] = Math.min(bounds.max, tidy(sorted[0] + bounds.gap))
    sorted[0] = tidy(sorted[1] - bounds.gap)
  }
  return sorted
}

export function moveSlider(value, index, candidate, bounds) {
  if (!Array.isArray(value)) return snap(candidate, bounds)
  const next = [...value]
  const min = index === 0 ? bounds.min : tidy(value[0] + bounds.gap)
  const max = index === 0 ? tidy(value[1] - bounds.gap) : bounds.max
  next[index] = clamp(snap(candidate, bounds), min, max)
  return next
}

export function sliderPercent(value, bounds) {
  return bounds.max === bounds.min
    ? 0
    : ((value - bounds.min) / (bounds.max - bounds.min)) * 100
}

export function sliderKey(key, value, min, max, increment, rtl = false) {
  if (key === 'Home') return min
  if (key === 'End') return max
  if (key === 'PageUp' || key === 'ArrowUp') return value + increment
  if (key === 'PageDown' || key === 'ArrowDown') return value - increment
  if (key === 'ArrowRight') return value + (rtl ? -increment : increment)
  if (key === 'ArrowLeft') return value + (rtl ? increment : -increment)
  return undefined
}
