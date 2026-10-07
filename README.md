# TouchGrass

An anti-screen habit application built for **Hacktoberfest 2026 Week 1 ("Touch Grass")**. TouchGrass assigns micro outdoor observation challenges, encourages you to physically step away from your device into nature, and verifies your findings through live camera evidence.

---

## AI Architecture

TouchGrass is powered strictly and exclusively by Google's open-weight **Gemma 4** models via the `@google/genai` SDK:

- **Primary Model**: `gemma-4-26b-a4b-it`
- **Fallback Model**: `gemma-4-31b-it`

### Functions Handled by Gemma 4:
1. **Dynamic Challenge Generation (`POST /api/challenge`)**: Synthesizes safe, achievable outdoor observation tasks across 13+ varied themes with randomized seeds to prevent repetition.
2. **Multimodal Vision Verification (`POST /api/validate`)**: Analyzes camera-captured snapshots against the active assignment criteria and delivers constructive feedback.

---

## Core Features

- **Interactive 3D Terra Biosphere**: Three.js WebGL centerpiece on the hero page with cursor-reactive rotation and floating atmospheric particles.
- **Strictly Camera-Only Shutter**: Evidence capture invokes the device hardware photo camera directly (`capture="environment"`). File explorer and gallery pickers are intentionally disabled.
- **Expedition Category Filters**: Instant switching between:
  - ☁️ Sky & Clouds (cloud silhouettes, canopy framing, sun rays)
  - 🌲 Bark & Textures (tree skin cartography, mineral strata)
  - 🔍 Micro Moss (sidewalk seams, urban micro-forests)
  - 🎨 Color Hunt (non-green natural pigmentation)
  - 🎲 Surprise Me (full randomized rotation)
- **Precision Chronometer Telemetry**: Real-time dual stopwatches for Task Duration and Session Total, computed from timestamp deltas to stay accurate across browser refreshes.
- **Rate-Limited Backend**: Built-in sliding-window rate limiter restricting usage to **30 requests per 4-hour window per client IP** to protect the API key from depletion.
- **Zero Account Walls**: No logins, telemetry, or remote databases. Sessions and preferences persist locally in browser storage.

---

## API Reference

| Endpoint | Method | Description | Rate Limited |
| :--- | :--- | :--- | :--- |
| `/api/challenge` | `POST` | Generates a fresh outdoor challenge. Accepts optional `{ category: string }`. | Yes (30 req / 4h) |
| `/api/validate` | `POST` | Inspects base64 camera photo against active challenge. Returns `{ passed, confidence, reason, feedback }`. | Yes (30 req / 4h) |
| `/api/health` | `GET` | Health status, version, and Gemma 4 model verification. | No |

---

## Environment Variables

Create a `.env` file in the project root:

```env
GEMINI_API_KEY=your_gemini_api_key_here
PORT=3000
NODE_ENV=development
```

---

## Local Setup

```bash
# Install dependencies
npm install

# Run development server (runs full-stack on http://localhost:3000)
npm run dev

# Run TypeScript linter
npm run lint

# Build for production
npm run build

# Start production server
npm start
```

---

## Deployment (Vercel)

This repository includes native Vercel configuration (`vercel.json` and `api/index.ts`):

1. Import the repository into [Vercel](https://vercel.com).
2. Set the Environment Variable:
   - `GEMINI_API_KEY`: Your Gemini API key.
3. Deploy. Vercel automatically builds the Vite frontend to `dist/` and mounts `/api/*` to the serverless Express function.
