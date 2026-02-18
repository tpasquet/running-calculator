export type Unit = 'km' | 'mile'

const KM_PER_MILE = 1.60934

/**
 * Convert speed (km/h or mph) to pace (seconds per km or per mile)
 */
export function speedToPaceSeconds(speed: number, unit: Unit): number {
  if (speed <= 0) return 0
  const distanceInKm = unit === 'km' ? 1 : KM_PER_MILE
  return (distanceInKm / speed) * 3600
}

/**
 * Convert pace (seconds per km or per mile) to speed (km/h or mph)
 */
export function paceSecondsToSpeed(paceSeconds: number, unit: Unit): number {
  if (paceSeconds <= 0) return 0
  const distanceInKm = unit === 'km' ? 1 : KM_PER_MILE
  return (distanceInKm / paceSeconds) * 3600
}

/**
 * Format seconds into mm:ss string
 */
export function secondsToMMSS(totalSeconds: number): string {
  if (totalSeconds <= 0) return '00:00'
  const minutes = Math.floor(totalSeconds / 60)
  const seconds = Math.floor(totalSeconds % 60)
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
}

/**
 * Parse mm:ss string into total seconds. Returns NaN if invalid.
 */
export function mmssToSeconds(value: string): number {
  const parts = value.split(':')
  if (parts.length === 1) {
    const n = parseFloat(value)
    return isNaN(n) ? NaN : n * 60
  }
  const [min, sec] = parts.map(Number)
  if (isNaN(min) || isNaN(sec) || sec >= 60) return NaN
  return min * 60 + sec
}

/**
 * Convert speed between km/h and mph
 */
export function convertSpeed(speed: number, from: Unit, to: Unit): number {
  if (from === to) return speed
  return from === 'km' ? speed / KM_PER_MILE : speed * KM_PER_MILE
}
