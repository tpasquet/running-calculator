/**
 * Heart Rate training zones using the Karvonen method.
 * Formula: target HR = resting HR + % × (max HR − resting HR)
 * 5-zone model (commonly used in running):
 *   Z1: 50–60% HRR — Recovery
 *   Z2: 60–70% HRR — Aerobic base
 *   Z3: 70–80% HRR — Tempo
 *   Z4: 80–90% HRR — Threshold
 *   Z5: 90–100% HRR — VO2max
 */

export interface HeartRateZone {
  id: number
  nameKey: string
  descriptionKey: string
  minPercent: number
  maxPercent: number
  color: string
  minBpm: number
  maxBpm: number
}

const HR_ZONE_DEFINITIONS = [
  {
    id: 1,
    nameKey: 'hrZones.zone1.name',
    descriptionKey: 'hrZones.zone1.description',
    minPercent: 50,
    maxPercent: 60,
    color: '#60a5fa',
  },
  {
    id: 2,
    nameKey: 'hrZones.zone2.name',
    descriptionKey: 'hrZones.zone2.description',
    minPercent: 60,
    maxPercent: 70,
    color: '#34d399',
  },
  {
    id: 3,
    nameKey: 'hrZones.zone3.name',
    descriptionKey: 'hrZones.zone3.description',
    minPercent: 70,
    maxPercent: 80,
    color: '#fbbf24',
  },
  {
    id: 4,
    nameKey: 'hrZones.zone4.name',
    descriptionKey: 'hrZones.zone4.description',
    minPercent: 80,
    maxPercent: 90,
    color: '#f97316',
  },
  {
    id: 5,
    nameKey: 'hrZones.zone5.name',
    descriptionKey: 'hrZones.zone5.description',
    minPercent: 90,
    maxPercent: 100,
    color: '#ef4444',
  },
]

/**
 * Compute HR zones using the Karvonen method.
 * @param maxHr  Maximum heart rate (bpm)
 * @param restingHr  Resting heart rate (bpm)
 */
export function computeHeartRateZones(maxHr: number, restingHr: number): HeartRateZone[] {
  const hrr = maxHr - restingHr // Heart Rate Reserve
  return HR_ZONE_DEFINITIONS.map((def) => ({
    ...def,
    minBpm: Math.round(restingHr + (def.minPercent / 100) * hrr),
    maxBpm: Math.round(restingHr + (def.maxPercent / 100) * hrr),
  }))
}
