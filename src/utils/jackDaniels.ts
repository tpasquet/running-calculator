/**
 * Jack Daniels / Daniels-Gilbert VDOT formula
 *
 * Based on the Daniels-Gilbert equations:
 *   - Oxygen cost of running: -4.60 + 0.182258 * S + 0.000104 * S²
 *   - Fractional utilization:  0.8 + 0.1894393 * e^(-0.012778 * T)
 *                                  + 0.2989558 * e^(-0.1932605 * T)
 * where S = speed (m/min), T = race time (min)
 * VDOT = oxygenCost / fractionalUtilization
 *
 * Reference: Daniels J, Gilbert J. Oxygen Power. 1979.
 */

import { formatTime } from './splitTimes'
import type { Unit } from './paceSpeed'

export interface PredictionResult {
  label: string
  meters: number
  timeSeconds: number
  paceSeconds: number // per km
}

// Standard race distances for prediction output
const PREDICTION_DISTANCES = [
  { label: '1500 m', meters: 1500 },
  { label: '1 mile', meters: 1609.34 },
  { label: '3 km', meters: 3000 },
  { label: '5 km', meters: 5000 },
  { label: '10 km', meters: 10000 },
  { label: 'Half Marathon', meters: 21097.5 },
  { label: 'Marathon', meters: 42195 },
]

const METERS_PER_UNIT: Record<Unit, number> = {
  km: 1000,
  mile: 1609.34,
}

/**
 * Compute oxygen cost of running at speed S (m/min)
 */
function oxygenCost(speedMperMin: number): number {
  return -4.60 + 0.182258 * speedMperMin + 0.000104 * speedMperMin ** 2
}

/**
 * Compute fractional utilization at time T (minutes)
 */
function fractionalUtilization(timeMin: number): number {
  return (
    0.8 +
    0.1894393 * Math.exp(-0.012778 * timeMin) +
    0.2989558 * Math.exp(-0.1932605 * timeMin)
  )
}

/**
 * Compute VDOT from a race performance
 * @param distanceMeters - race distance in meters
 * @param timeSeconds    - race time in seconds
 */
export function computeVDOT(distanceMeters: number, timeSeconds: number): number {
  if (distanceMeters <= 0 || timeSeconds <= 0) return 0
  const timeMin = timeSeconds / 60
  const speedMperMin = distanceMeters / timeMin
  return oxygenCost(speedMperMin) / fractionalUtilization(timeMin)
}

/**
 * Predict race time for a given distance from a VDOT value.
 * Solves numerically (binary search): find T such that VDOT(dist, T) = targetVDOT
 *
 * @param distanceMeters - target race distance in meters
 * @param vdot           - VDOT value
 * @returns predicted race time in seconds
 */
export function predictTime(distanceMeters: number, vdot: number): number {
  if (distanceMeters <= 0 || vdot <= 0) return 0

  // Binary search bounds (in seconds): 30s to 24h
  let lo = 30
  let hi = 86400

  for (let i = 0; i < 64; i++) {
    const mid = (lo + hi) / 2
    const v = computeVDOT(distanceMeters, mid)
    if (v > vdot) {
      lo = mid // too fast → slower time needed
    } else {
      hi = mid
    }
  }

  return (lo + hi) / 2
}

/**
 * Generate performance predictions for all standard distances from a reference performance
 */
export function generatePredictions(
  refDistanceMeters: number,
  refTimeSeconds: number,
  unit: Unit,
): { vdot: number; predictions: PredictionResult[] } {
  const vdot = computeVDOT(refDistanceMeters, refTimeSeconds)
  if (vdot <= 0) return { vdot: 0, predictions: [] }

  const metersPerUnit = METERS_PER_UNIT[unit]

  const predictions: PredictionResult[] = PREDICTION_DISTANCES.map((d) => {
    const timeSeconds = predictTime(d.meters, vdot)
    const paceSeconds = (timeSeconds / d.meters) * metersPerUnit
    return {
      label: d.label,
      meters: d.meters,
      timeSeconds,
      paceSeconds,
    }
  })

  return { vdot, predictions }
}

export { formatTime, PREDICTION_DISTANCES }
