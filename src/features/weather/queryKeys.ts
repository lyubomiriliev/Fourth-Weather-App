import type { ForecastLocation } from './types';

export const weatherKeys = {
  all: ['weather'] as const,
  forecastRoot: () => [...weatherKeys.all, 'forecast'] as const,
  forecast: (location: ForecastLocation) => {
    if (location.kind === 'coords') {
      const lat = Math.round(location.lat * 10000) / 10000;
      const lon = Math.round(location.lon * 10000) / 10000;
      return [...weatherKeys.forecastRoot(), 'coords', lat, lon] as const;
    } else {
      const query = location.query.trim();
      return [...weatherKeys.forecastRoot(), 'city', query] as const;
    }
  },
};
