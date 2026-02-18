import type { Unit } from './paceSpeed'
import { secondsToMMSS } from './paceSpeed'

export interface TrainingZone {
  id: number
  /** i18n key e.g. "zones.zone1.name" */
  nameKey: string
  /** i18n key e.g. "zones.zone1.description" */
  descriptionKey: string
  minPercent: number
  maxPercent: number
  color: string
  /** Speed range in km/h */
  minSpeedKmh: number
  maxSpeedKmh: number
  /** Pace range in seconds per unit */
  minPaceSeconds: number
  maxPaceSeconds: number
}

const ZONE_DEFINITIONS = [
  {
    id: 1,
    nameKey: 'zones.zone1.name',
    descriptionKey: 'zones.zone1.description',
    minPercent: 55,
    maxPercent: 65,
    color: '#60a5fa',
  },
  {
    id: 2,
    nameKey: 'zones.zone2.name',
    descriptionKey: 'zones.zone2.description',
    minPercent: 65,
    maxPercent: 75,
    color: '#34d399',
  },
  {
    id: 3,
    nameKey: 'zones.zone3.name',
    descriptionKey: 'zones.zone3.description',
    minPercent: 75,
    maxPercent: 85,
    color: '#fbbf24',
  },
  {
    id: 4,
    nameKey: 'zones.zone4.name',
    descriptionKey: 'zones.zone4.description',
    minPercent: 85,
    maxPercent: 95,
    color: '#f97316',
  },
  {
    id: 5,
    nameKey: 'zones.zone5.name',
    descriptionKey: 'zones.zone5.description',
    minPercent: 95,
    maxPercent: 105,
    color: '#ef4444',
  },
]

const METERS_PER_UNIT: Record<Unit, number> = {
  km: 1000,
  mile: 1609.34,
}

export function computeTrainingZones(masKmh: number, unit: Unit): TrainingZone[] {
  return ZONE_DEFINITIONS.map((def) => {
    const minSpeedKmh = masKmh * (def.minPercent / 100)
    const maxSpeedKmh = masKmh * (def.maxPercent / 100)

    const metersPerUnit = METERS_PER_UNIT[unit]
    // pace = distance / speed ; speed in m/s = kmh / 3.6
    const minPaceSeconds = metersPerUnit / (maxSpeedKmh / 3.6) // faster speed → shorter pace
    const maxPaceSeconds = metersPerUnit / (minSpeedKmh / 3.6)

    return {
      ...def,
      minSpeedKmh,
      maxSpeedKmh,
      minPaceSeconds,
      maxPaceSeconds,
    }
  })
}

export function formatSpeedRange(minKmh: number, maxKmh: number, unit: Unit): string {
  if (unit === 'km') {
    return `${minKmh.toFixed(1)} – ${maxKmh.toFixed(1)} km/h`
  }
  const toMph = (kmh: number) => kmh / 1.60934
  return `${toMph(minKmh).toFixed(1)} – ${toMph(maxKmh).toFixed(1)} mph`
}

export function formatPaceRange(minPaceSec: number, maxPaceSec: number, unit: Unit): string {
  const unitLabel = unit === 'km' ? 'min/km' : 'min/mi'
  return `${secondsToMMSS(minPaceSec)} – ${secondsToMMSS(maxPaceSec)} ${unitLabel}`
}
