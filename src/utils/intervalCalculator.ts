import type { Unit } from './paceSpeed'
import { secondsToMMSS } from './paceSpeed'

export interface IntervalSet {
  repDistance: number   // meters per rep
  reps: number
  masPercent: number    // % VMA for work
  recoverySeconds: number
  unit: Unit
}

export interface IntervalResult {
  repTimeSeconds: number    // time per rep
  repPaceSeconds: number    // pace per unit for work
  speedKmh: number          // work speed km/h
  totalWorkSeconds: number  // total work time (excl. recovery)
  totalDistanceMeters: number
}

const METERS_PER_UNIT: Record<Unit, number> = {
  km: 1000,
  mile: 1609.34,
}

export function computeInterval(set: IntervalSet): IntervalResult | null {
  const { repDistance, reps, masPercent } = set
  if (repDistance <= 0 || reps <= 0 || masPercent <= 0) return null

  // We'll receive speedKmh from caller; masPercent alone isn't enough without MAS
  // This function is actually called with speed, not percent directly
  return null
}

export function computeIntervalFromMas(
  masKmh: number,
  masPercent: number,
  repDistanceMeters: number,
  reps: number,
  unit: Unit,
): IntervalResult {
  const speedKmh = masKmh * (masPercent / 100)
  const speedMs = speedKmh / 3.6
  const metersPerUnit = METERS_PER_UNIT[unit]

  const repTimeSeconds = repDistanceMeters / speedMs
  const repPaceSeconds = metersPerUnit / speedMs
  const totalWorkSeconds = repTimeSeconds * reps
  const totalDistanceMeters = repDistanceMeters * reps

  return {
    repTimeSeconds,
    repPaceSeconds,
    speedKmh,
    totalWorkSeconds,
    totalDistanceMeters,
  }
}

export function formatRepTime(seconds: number): string {
  return secondsToMMSS(Math.round(seconds))
}

export function formatPaceStr(paceSeconds: number, unit: Unit): string {
  const label = unit === 'km' ? 'min/km' : 'min/mi'
  return `${secondsToMMSS(Math.round(paceSeconds))} ${label}`
}

export function formatSpeedStr(speedKmh: number, unit: Unit): string {
  if (unit === 'km') return `${speedKmh.toFixed(1)} km/h`
  return `${(speedKmh / 1.60934).toFixed(1)} mph`
}

export function formatTotalTime(seconds: number): string {
  const h = Math.floor(seconds / 3600)
  const m = Math.floor((seconds % 3600) / 60)
  const s = Math.round(seconds % 60)
  if (h > 0) return `${h}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
}

export function formatDistance(meters: number): string {
  if (meters >= 1000) return `${(meters / 1000).toFixed(meters % 1000 === 0 ? 0 : 1)} km`
  return `${Math.round(meters)} m`
}

/** Distances proposées pour les répétitions */
export const INTERVAL_DISTANCES = [
  { label: '100 m', meters: 100 },
  { label: '200 m', meters: 200 },
  { label: '300 m', meters: 300 },
  { label: '400 m', meters: 400 },
  { label: '500 m', meters: 500 },
  { label: '600 m', meters: 600 },
  { label: '800 m', meters: 800 },
  { label: '1 km', meters: 1000 },
  { label: '1200 m', meters: 1200 },
  { label: '1500 m', meters: 1500 },
  { label: '2 km', meters: 2000 },
  { label: '3 km', meters: 3000 },
]
