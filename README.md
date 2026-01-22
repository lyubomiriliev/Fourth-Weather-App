# Fourth Weather App

A small React + Vite weather forecast app powered by the OpenWeatherMap **5-day / 3-hour forecast** API.

## Tech

- React + TypeScript + Vite
- MUI (UI components)
- TanStack Query (data fetching / caching)
- Vitest (unit tests)

## Setup

- **Prereqs**: Node.js + npm
- **Install**:

```bash
npm install
```

## API configuration (OpenWeatherMap)

This app reads the API key from `import.meta.env.VITE_OPENWEATHER_API_KEY`.

1. Create an OpenWeather API key from your OpenWeather account.
2. Create a `.env` file at the project root:

```bash
VITE_OPENWEATHER_API_KEY=YOUR_API_KEY_HERE
```

Notes:
- Do **not** commit your `.env` file.
- The app uses `units=metric` by default.

## Run locally

```bash
npm run dev
```

Then open the URL shown in your terminal (typically `http://localhost:5173`).

## Run tests

```bash
npm test
```

## Useful scripts

- `npm run dev`: start local dev server
- `npm run build`: typecheck + production build
- `npm run preview`: preview the production build locally
- `npm run lint`: run ESLint
