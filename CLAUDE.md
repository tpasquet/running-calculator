# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

React application for running calculations, built with modern standards using Vite, TypeScript, and React 18.

## Tech Stack

- **Framework**: React 18.3
- **Build Tool**: Vite 5.4
- **Language**: TypeScript 5.5
- **Styling**: SCSS/Sass 1.77
- **Linting**: ESLint 9 with TypeScript ESLint and React Hooks plugins
- **PWA**: vite-plugin-pwa (service worker, web manifest, offline support)
- **Module System**: ESNext with bundler resolution

## Commands

- `npm install` - Install dependencies
- `npm run dev` - Start development server (usually on http://localhost:5173)
- `npm run build` - Build for production (TypeScript check + Vite build)
- `npm run preview` - Preview production build locally
- `npm run lint` - Run ESLint on the codebase

## Project Structure

```
src/
  ├── main.tsx          # Application entry point
  ├── App.tsx           # Main App component
  ├── App.scss          # App component styles
  ├── index.scss        # Global styles
  ├── vite-env.d.ts     # Vite type definitions
  └── assets/           # Static assets
```

## TypeScript Configuration

The project uses a composite TypeScript configuration:
- `tsconfig.json` - References both app and node configs
- `tsconfig.app.json` - Application code configuration (strict mode, React JSX)
- `tsconfig.node.json` - Vite configuration file settings

## Development Notes

- Hot Module Replacement (HMR) is enabled for fast development
- Strict TypeScript mode is enabled with unused variables/parameters checking
- ESLint is configured with React Hooks rules and React Refresh validation
- SCSS is configured with Vite - no additional setup needed, just import `.scss` files

## Architecture

### Design
- **Progressive Web App (PWA)**: the application is built as a PWA, installable on mobile and desktop
- **Mobile first**: all interfaces are designed for mobile first, then adapted to larger screens
- **Web Components**: UI is built with reusable web components

### Internationalisation (i18n)
- Supported languages: **English** (en) and **French** (fr)
- Language is configurable in user preferences

### Configuration & User Preferences
- No user account: all configuration is stored in **browser memory** (`localStorage`)
- User preferences:
  - **Unit of measure**: kilometer (km) or mile
  - **Reference MAS** (Maximal Aerobic Speed / VMA)
  - **Reference PRs** (Personal Records per distance)
  - **Language** (en / fr)

## Features

### Pace / Speed Converter
- Bidirectional conversion between pace (min/km or min/mile) and speed (km/h or mph)

### Performance Prediction Models
- **Jack Daniels Formula**: VDOT-based prediction (Daniels-Gilbert equations) — physiologically grounded
- **Riegel Formula**: power-law prediction T2 = T1 × (D2/D1)^1.06 — simple and widely used

### Training Zones
- Calculate theoretical training zones based on the user's MAS (VMA)

### Split Time Calculator
- Based on a **percentage of MAS**
- Based on a **given pace**
- Based on a **target time** for a given distance
