import { useSettingsContext } from '../store/settings'
import en from './en.json'
import fr from './fr.json'

type Translations = typeof en
type Interpolations = Record<string, string | number>

const locales: Record<string, Translations> = { en, fr }

/**
 * Resolve a dot-notation key from a nested object.
 * e.g. "paceSpeed.title" → locales[lang]["paceSpeed"]["title"]
 */
function resolve(obj: unknown, keys: string[]): string {
  let current: unknown = obj
  for (const key of keys) {
    if (typeof current !== 'object' || current === null) return keys.join('.')
    current = (current as Record<string, unknown>)[key]
  }
  return typeof current === 'string' ? current : keys.join('.')
}

/**
 * Replace {{variable}} placeholders with values from interpolations.
 */
function interpolate(str: string, params?: Interpolations): string {
  if (!params) return str
  return str.replace(/\{\{(\w+)\}\}/g, (_, key) =>
    params[key] !== undefined ? String(params[key]) : `{{${key}}}`
  )
}

export function useT() {
  const { settings } = useSettingsContext()
  const lang = settings.language ?? 'en'
  const translations = locales[lang] ?? en

  function t(key: string, params?: Interpolations): string {
    const raw = resolve(translations, key.split('.'))
    return interpolate(raw, params)
  }

  return t
}
