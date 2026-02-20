export interface RpeZone {
  id: number
  level: number
  nameKey: string
  descriptionKey: string
  color: string
}

export interface BorgZone {
  id: number
  level: number
  nameKey: string
  descriptionKey: string
  color: string
}

export const RPE_ZONES: RpeZone[] = [
  { id: 1, level: 1, nameKey: 'rpeZones.rpe1.name', descriptionKey: 'rpeZones.rpe1.description', color: '#93c5fd' },
  { id: 2, level: 2, nameKey: 'rpeZones.rpe2.name', descriptionKey: 'rpeZones.rpe2.description', color: '#60a5fa' },
  { id: 3, level: 3, nameKey: 'rpeZones.rpe3.name', descriptionKey: 'rpeZones.rpe3.description', color: '#34d399' },
  { id: 4, level: 4, nameKey: 'rpeZones.rpe4.name', descriptionKey: 'rpeZones.rpe4.description', color: '#6ee7b7' },
  { id: 5, level: 5, nameKey: 'rpeZones.rpe5.name', descriptionKey: 'rpeZones.rpe5.description', color: '#fbbf24' },
  { id: 6, level: 6, nameKey: 'rpeZones.rpe6.name', descriptionKey: 'rpeZones.rpe6.description', color: '#f59e0b' },
  { id: 7, level: 7, nameKey: 'rpeZones.rpe7.name', descriptionKey: 'rpeZones.rpe7.description', color: '#fb923c' },
  { id: 8, level: 8, nameKey: 'rpeZones.rpe8.name', descriptionKey: 'rpeZones.rpe8.description', color: '#f97316' },
  { id: 9, level: 9, nameKey: 'rpeZones.rpe9.name', descriptionKey: 'rpeZones.rpe9.description', color: '#ef4444' },
  { id: 10, level: 10, nameKey: 'rpeZones.rpe10.name', descriptionKey: 'rpeZones.rpe10.description', color: '#dc2626' },
]

export const BORG_ZONES: BorgZone[] = [
  { id: 6, level: 6, nameKey: 'borgZones.borg6.name', descriptionKey: 'borgZones.borg6.description', color: '#bfdbfe' },
  { id: 7, level: 7, nameKey: 'borgZones.borg7.name', descriptionKey: 'borgZones.borg7.description', color: '#93c5fd' },
  { id: 8, level: 8, nameKey: 'borgZones.borg8.name', descriptionKey: 'borgZones.borg8.description', color: '#7dd3fc' },
  { id: 9, level: 9, nameKey: 'borgZones.borg9.name', descriptionKey: 'borgZones.borg9.description', color: '#60a5fa' },
  { id: 10, level: 10, nameKey: 'borgZones.borg10.name', descriptionKey: 'borgZones.borg10.description', color: '#4ade80' },
  { id: 11, level: 11, nameKey: 'borgZones.borg11.name', descriptionKey: 'borgZones.borg11.description', color: '#34d399' },
  { id: 12, level: 12, nameKey: 'borgZones.borg12.name', descriptionKey: 'borgZones.borg12.description', color: '#a3e635' },
  { id: 13, level: 13, nameKey: 'borgZones.borg13.name', descriptionKey: 'borgZones.borg13.description', color: '#fbbf24' },
  { id: 14, level: 14, nameKey: 'borgZones.borg14.name', descriptionKey: 'borgZones.borg14.description', color: '#f59e0b' },
  { id: 15, level: 15, nameKey: 'borgZones.borg15.name', descriptionKey: 'borgZones.borg15.description', color: '#fb923c' },
  { id: 16, level: 16, nameKey: 'borgZones.borg16.name', descriptionKey: 'borgZones.borg16.description', color: '#f97316' },
  { id: 17, level: 17, nameKey: 'borgZones.borg17.name', descriptionKey: 'borgZones.borg17.description', color: '#ef4444' },
  { id: 18, level: 18, nameKey: 'borgZones.borg18.name', descriptionKey: 'borgZones.borg18.description', color: '#dc2626' },
  { id: 19, level: 19, nameKey: 'borgZones.borg19.name', descriptionKey: 'borgZones.borg19.description', color: '#b91c1c' },
  { id: 20, level: 20, nameKey: 'borgZones.borg20.name', descriptionKey: 'borgZones.borg20.description', color: '#7f1d1d' },
]
