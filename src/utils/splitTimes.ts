import type { Unit } from './paceSpeed'

export interface Distance {
  label: string
  meters: number
}

export const STANDARD_DISTANCES: Distance[] = [
  { label: '200 m', meters: 200 },
  { label: '300 m', meters: 300 },
  { label: '400 m', meters: 400 },
  { label: '800 m', meters: 800 },
  { label: '1 km', meters: 1000 },
  { label: '1500 m', meters: 1500 },
  { label: '1 mile', meters: 1609.34 },
  { label: '3 km', meters: 3000 },
  { label: '5 km', meters: 5000 },
  { label: '10 km', meters: 10000 },
  { label: 'Semi', meters: 21097.5 },
  { label: 'Marathon', meters: 42195 },
]

export interface SplitResult {
  distance: Distance
  timeSeconds: number
  paceSeconds: number // pace per km or per mile
}

/**
 * Format seconds as h:mm:ss or mm:ss
 */
export function formatTime(totalSeconds: number): string {
  if (totalSeconds <= 0) return '—'
  const h = Math.floor(totalSeconds / 3600)
  const m = Math.floor((totalSeconds % 3600) / 60)
  const s = Math.round(totalSeconds % 60)
  if (h > 0) {
    return `${h}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
  }
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
}

/**
 * Format seconds as mm:ss pace string
 */
export function formatPace(paceSeconds: number): string {
  if (paceSeconds <= 0) return '—'
  const m = Math.floor(paceSeconds / 60)
  const s = Math.round(paceSeconds % 60)
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
}

const METERS_PER_UNIT: Record<Unit, number> = {
  km: 1000,
  mile: 1609.34,
}

/**
 * Calculate splits from a percentage of MAS (maximal aerobic speed in km/h)
 */
export function splitsFromMasPercent(masKmh: number, percent: number, unit: Unit): SplitResult[] {
  const speedKmh = masKmh * (percent / 100)
  if (speedKmh <= 0) return []
  const speedMs = speedKmh / 3.6
  const paceSeconds = METERS_PER_UNIT[unit] / speedMs

  return STANDARD_DISTANCES.map((d) => ({
    distance: d,
    timeSeconds: d.meters / speedMs,
    paceSeconds,
  }))
}

/**
 * Calculate splits from a pace (seconds per unit)
 */
export function splitsFromPace(paceSeconds: number, unit: Unit): SplitResult[] {
  if (paceSeconds <= 0) return []
  const speedMs = METERS_PER_UNIT[unit] / paceSeconds

  return STANDARD_DISTANCES.map((d) => ({
    distance: d,
    timeSeconds: d.meters / speedMs,
    paceSeconds,
  }))
}

/**
 * Calculate splits from a target time on a given distance (meters)
 * Returns pace per unit and projected times on all standard distances
 */
export function splitsFromTargetTime(
  targetSeconds: number,
  distanceMeters: number,
  unit: Unit,
): SplitResult[] {
  if (targetSeconds <= 0 || distanceMeters <= 0) return []
  const speedMs = distanceMeters / targetSeconds
  const paceSeconds = METERS_PER_UNIT[unit] / speedMs

  return STANDARD_DISTANCES.map((d) => ({
    distance: d,
    timeSeconds: d.meters / speedMs,
    paceSeconds,
  }))
}

/**
 * Parse h:mm:ss or mm:ss string into total seconds. Returns NaN if invalid.
 */
export function parseTimeInput(value: string): number {
  const parts = value.split(':').map(Number)
  if (parts.some(isNaN)) return NaN
  if (parts.length === 3) {
    const [h, m, s] = parts
    if (m >= 60 || s >= 60) return NaN
    return h * 3600 + m * 60 + s
  }
  if (parts.length === 2) {
    const [m, s] = parts
    if (s >= 60) return NaN
    return m * 60 + s
  }
  return NaN
}
