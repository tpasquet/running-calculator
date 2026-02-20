import type { Unit } from './paceSpeed'
import { secondsToMMSS } from './paceSpeed'

/**
 * Jack Daniels training zones (E/M/T/I/R).
 * Expressed as % of VMA (MAS) for consistency with the app.
 * Source: Daniels' Running Formula — intensity ranges converted from % VO2max to % vVO2max (≈ VMA).
 * VO2max % → VMA %: the relationship is approximately linear for running,
 * using the Daniels intensity table: E=59-74%, M=75-84%, T=83-88%, I=95-100%, R=105-120%.
 */

export interface DanielsZone {
  id: string
  nameKey: string
  descriptionKey: string
  minPercent: number
  maxPercent: number
  color: string
  minSpeedKmh: number
  maxSpeedKmh: number
  minPaceSeconds: number
  maxPaceSeconds: number
}

const DANIELS_ZONE_DEFINITIONS = [
  {
    id: 'E',
    nameKey: 'danielsZones.easy.name',
    descriptionKey: 'danielsZones.easy.description',
    minPercent: 59,
    maxPercent: 74,
    color: '#60a5fa',
  },
  {
    id: 'M',
    nameKey: 'danielsZones.marathon.name',
    descriptionKey: 'danielsZones.marathon.description',
    minPercent: 75,
    maxPercent: 84,
    color: '#34d399',
  },
  {
    id: 'T',
    nameKey: 'danielsZones.threshold.name',
    descriptionKey: 'danielsZones.threshold.description',
    minPercent: 83,
    maxPercent: 88,
    color: '#fbbf24',
  },
  {
    id: 'I',
    nameKey: 'danielsZones.interval.name',
    descriptionKey: 'danielsZones.interval.description',
    minPercent: 95,
    maxPercent: 100,
    color: '#f97316',
  },
  {
    id: 'R',
    nameKey: 'danielsZones.repetition.name',
    descriptionKey: 'danielsZones.repetition.description',
    minPercent: 105,
    maxPercent: 120,
    color: '#ef4444',
  },
]

const METERS_PER_UNIT: Record<Unit, number> = {
  km: 1000,
  mile: 1609.34,
}

export function computeDanielsZones(masKmh: number, unit: Unit): DanielsZone[] {
  const metersPerUnit = METERS_PER_UNIT[unit]
  return DANIELS_ZONE_DEFINITIONS.map((def) => {
    const minSpeedKmh = masKmh * (def.minPercent / 100)
    const maxSpeedKmh = masKmh * (def.maxPercent / 100)
    const minPaceSeconds = metersPerUnit / (maxSpeedKmh / 3.6)
    const maxPaceSeconds = metersPerUnit / (minSpeedKmh / 3.6)
    return { ...def, minSpeedKmh, maxSpeedKmh, minPaceSeconds, maxPaceSeconds }
  })
}

export function formatDanielsSpeedRange(minKmh: number, maxKmh: number, unit: Unit): string {
  if (unit === 'km') return `${minKmh.toFixed(1)} – ${maxKmh.toFixed(1)} km/h`
  const toMph = (kmh: number) => kmh / 1.60934
  return `${toMph(minKmh).toFixed(1)} – ${toMph(maxKmh).toFixed(1)} mph`
}

export function formatDanielsPaceRange(minPaceSec: number, maxPaceSec: number, unit: Unit): string {
  const unitLabel = unit === 'km' ? 'min/km' : 'min/mi'
  return `${secondsToMMSS(minPaceSec)} – ${secondsToMMSS(maxPaceSec)} ${unitLabel}`
}
