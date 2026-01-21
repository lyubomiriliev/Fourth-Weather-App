import type {
  OpenWeatherForecastResponse,
  DailyForecastResult,
  DailyForecast,
  Forecast3hItem,
} from '../types';

function formatDateFromShiftedEpoch(epochSec: number): string {
  const d = new Date(epochSec * 1000);
  const y = d.getUTCFullYear();
  const m = String(d.getUTCMonth() + 1).padStart(2, '0');
  const day = String(d.getUTCDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

function formatTimeFromShiftedEpoch(epochSec: number): string {
  const d = new Date(epochSec * 1000);
  const hh = String(d.getUTCHours()).padStart(2, '0');
  const mm = String(d.getUTCMinutes()).padStart(2, '0');
  return `${hh}:${mm}`;
}

function findNoonChunk(chunks: Forecast3hItem[], tz: number): Forecast3hItem {
  let bestChunk = chunks[0];
  let minDiff = Infinity;

  for (const chunk of chunks) {
    const localEpochSec = chunk.dt + tz;
    const d = new Date(localEpochSec * 1000);
    const hour = d.getUTCHours();
    const diff = Math.abs(hour - 12);

    if (diff < minDiff) {
      minDiff = diff;
      bestChunk = chunk;
    }
  }

  return bestChunk;
}

export function transformForecastToDaily(
  response: OpenWeatherForecastResponse
): DailyForecastResult {
  const tz = response.city.timezone;
  const groups: Record<string, Forecast3hItem[]> = {};

  for (const item of response.list) {
    const localEpochSec = item.dt + tz;
    const dayKey = formatDateFromShiftedEpoch(localEpochSec);

    if (!groups[dayKey]) {
      groups[dayKey] = [];
    }
    groups[dayKey].push(item);
  }

  const sortedDays = Object.keys(groups).sort();
  const days: DailyForecast[] = sortedDays.slice(0, 5).map((dayKey) => {
    const chunks = groups[dayKey];

    const tempMin = Math.min(...chunks.map((c) => c.main.temp_min));
    const tempMax = Math.max(...chunks.map((c) => c.main.temp_max));

    const representativeChunk = findNoonChunk(chunks, tz);

    const hourly = chunks.map((c) => ({
      dt: c.dt,
      timeLocal: formatTimeFromShiftedEpoch(c.dt + tz),
      temp: c.main.temp,
      icon: c.weather[0].icon,
      description: c.weather[0].description,
      pop: c.pop,
    }));

    return {
      date: dayKey,
      tempMin,
      tempMax,
      icon: representativeChunk.weather[0].icon,
      description: representativeChunk.weather[0].description,
      hourly,
    };
  });

  return {
    locationName: response.city.name,
    country: response.city.country,
    timezoneOffsetSec: tz,
    days,
  };
}
