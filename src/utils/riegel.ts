/**
 * Pete Riegel performance prediction formula (1977)
 *
 * T2 = T1 × (D2 / D1) ^ 1.06
 *
 * where T1 = reference time (s), D1 = reference distance (m),
 *       T2 = predicted time (s), D2 = target distance (m)
 *
 * The exponent 1.06 reflects the physiological fatigue cost of running
 * longer distances. Simple, widely used, slightly optimistic for marathon.
 *
 * Reference: Riegel P.S. "Athletic Records and Human Endurance". American Scientist. 1981.
 */

import type { Unit } from './paceSpeed'
import type { PredictionResult } from './jackDaniels'
import { PREDICTION_DISTANCES } from './jackDaniels'

const RIEGEL_EXPONENT = 1.06

const METERS_PER_UNIT: Record<Unit, number> = {
  km: 1000,
  mile: 1609.34,
}

/**
 * Predict race time for a target distance using the Riegel formula
 */
export function riegelPredictTime(
  refDistanceMeters: number,
  refTimeSeconds: number,
  targetDistanceMeters: number,
): number {
  if (refDistanceMeters <= 0 || refTimeSeconds <= 0 || targetDistanceMeters <= 0) return 0
  return refTimeSeconds * (targetDistanceMeters / refDistanceMeters) ** RIEGEL_EXPONENT
}

/**
 * Generate performance predictions for all standard distances using Riegel
 */
export function generateRiegelPredictions(
  refDistanceMeters: number,
  refTimeSeconds: number,
  unit: Unit,
): PredictionResult[] {
  if (refDistanceMeters <= 0 || refTimeSeconds <= 0) return []

  const metersPerUnit = METERS_PER_UNIT[unit]

  return PREDICTION_DISTANCES.map((d) => {
    const timeSeconds = riegelPredictTime(refDistanceMeters, refTimeSeconds, d.meters)
    const paceSeconds = (timeSeconds / d.meters) * metersPerUnit
    return {
      label: d.label,
      meters: d.meters,
      timeSeconds,
      paceSeconds,
    }
  })
}
