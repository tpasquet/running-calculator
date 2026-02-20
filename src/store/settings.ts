import { useState, useEffect, createContext, useContext } from 'react'
import type { Unit } from '../utils/paceSpeed'

export type Language = 'en' | 'fr'
export type Theme = 'light' | 'dark' | 'system'

export interface Settings {
  language: Language
  unit: Unit
  mas: number | null              // Maximal Aerobic Speed in km/h, null if not set
  theme: Theme
  refDistanceMeters: number | null  // Reference race distance in meters
  refTimeSeconds: number | null     // Reference race time in seconds
  maxHr: number | null              // Maximum heart rate in bpm
  restingHr: number | null          // Resting heart rate in bpm
}

const STORAGE_KEY = 'running-calculator:settings'

const DEFAULT_SETTINGS: Settings = {
  language: 'en',
  unit: 'km',
  mas: null,
  theme: 'system',
  refDistanceMeters: null,
  refTimeSeconds: null,
  maxHr: null,
  restingHr: null,
}

function loadSettings(): Settings {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return DEFAULT_SETTINGS
    return { ...DEFAULT_SETTINGS, ...JSON.parse(raw) }
  } catch {
    return DEFAULT_SETTINGS
  }
}

function saveSettings(settings: Settings): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings))
  } catch {
    // localStorage unavailable (private mode, quota exceeded, etc.)
  }
}

export function useSettings(urlLang?: Language) {
  const [settings, setSettings] = useState<Settings>(() => {
    const saved = loadSettings()
    // URL language takes priority: if the user navigates to /fr/, use French regardless of localStorage
    if (urlLang && urlLang !== saved.language) {
      return { ...saved, language: urlLang }
    }
    return saved
  })

  useEffect(() => {
    saveSettings(settings)
  }, [settings])

  function updateSettings(patch: Partial<Settings>) {
    setSettings((prev) => ({ ...prev, ...patch }))
  }

  return { settings, updateSettings }
}

export interface SettingsContextValue {
  settings: Settings
  updateSettings: (patch: Partial<Settings>) => void
}

export const SettingsContext = createContext<SettingsContextValue>({
  settings: DEFAULT_SETTINGS,
  updateSettings: () => {},
})

export function useSettingsContext() {
  return useContext(SettingsContext)
}
