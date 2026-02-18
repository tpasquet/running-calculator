/**
 * Post-build prerender script.
 * Creates /fr/index.html with French-specific meta tags
 * so search engines can index the French version at /fr/.
 *
 * Run after `vite build`:  node scripts/prerender.mjs
 */
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const distDir = path.resolve(__dirname, '..', 'dist')

const enHtml = fs.readFileSync(path.join(distDir, 'index.html'), 'utf-8')

// French variant: swap lang, title, description, canonical and OG/Twitter meta
const frHtml = enHtml
  // html lang
  .replace('<html lang="en"', '<html lang="fr"')
  // title
  .replace(
    '<title>Running Calculator — Pace, Split Times, Training Zones &amp; Performance Prediction</title>',
    '<title>Calculateur Running — Allure, Temps Intermédiaires, Zones d\'Entraînement &amp; Prédiction de Performance</title>',
  )
  // description
  .replace(
    'content="Free running calculator: convert pace and speed, calculate split times, training zones from MAS/VMA, and predict race performances with Jack Daniels and Riegel models. Works offline as a PWA."',
    'content="Calculateur running gratuit : convertisseur allure/vitesse, temps intermédiaires, zones d\'entraînement à partir de la VMA, et prédiction de performances avec les modèles Jack Daniels et Riegel. Fonctionne hors-ligne."',
  )
  // canonical
  .replace(
    '<link rel="canonical" href="https://running-calculator.app/" />',
    '<link rel="canonical" href="https://running-calculator.app/fr/" />',
  )
  // OG url
  .replace(
    '<meta property="og:url" content="https://running-calculator.app/" />',
    '<meta property="og:url" content="https://running-calculator.app/fr/" />',
  )
  // OG title
  .replace(
    '<meta property="og:title" content="Running Calculator — Pace, Split Times, Training Zones &amp; Performance Prediction" />',
    '<meta property="og:title" content="Calculateur Running — Allure, Temps Intermédiaires, Zones d\'Entraînement &amp; Prédiction de Performance" />',
  )
  // OG description
  .replace(
    '<meta property="og:description" content="Free running calculator: convert pace and speed, calculate split times, training zones from MAS/VMA, and predict race performances. Available offline as a PWA." />',
    '<meta property="og:description" content="Calculateur running gratuit : convertisseur allure/vitesse, temps intermédiaires, zones d\'entraînement VMA, prédiction de performances. Disponible hors-ligne." />',
  )
  // OG locale (swap primary/alternate)
  .replace(
    '<meta property="og:locale" content="en_US" />',
    '<meta property="og:locale" content="fr_FR" />',
  )
  .replace(
    '<meta property="og:locale:alternate" content="fr_FR" />',
    '<meta property="og:locale:alternate" content="en_US" />',
  )
  // Twitter title
  .replace(
    '<meta name="twitter:title" content="Running Calculator — Pace, Split Times, Training Zones &amp; Performance Prediction" />',
    '<meta name="twitter:title" content="Calculateur Running — Allure, Temps Intermédiaires, Zones d\'Entraînement &amp; Prédiction" />',
  )
  // Twitter description
  .replace(
    '<meta name="twitter:description" content="Free running calculator: pace converter, split times, training zones from MAS/VMA, race prediction (Jack Daniels, Riegel). Works offline." />',
    '<meta name="twitter:description" content="Calculateur running gratuit : allure/vitesse, temps intermédiaires, zones VMA, prédiction de courses (Jack Daniels, Riegel). Fonctionne hors-ligne." />',
  )

// Write /fr/index.html
const frDir = path.join(distDir, 'fr')
fs.mkdirSync(frDir, { recursive: true })
fs.writeFileSync(path.join(frDir, 'index.html'), frHtml, 'utf-8')

console.log('✓ Prerendered /fr/index.html')
