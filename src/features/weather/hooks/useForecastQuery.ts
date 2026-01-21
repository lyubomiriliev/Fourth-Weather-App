import { useQuery } from '@tanstack/react-query';
import type { ForecastLocation, DailyForecastResult } from '../types';
import { weatherKeys } from '../queryKeys';
import { getForecast } from '../api/getForecast';
import { transformForecastToDaily } from '../utils/transformForecast';
import { toWeatherError } from '../utils/errors';

interface UseForecastQueryOptions {
  enabled?: boolean;
}

export function useForecastQuery(
  location: ForecastLocation,
  options?: UseForecastQueryOptions
) {
  return useQuery({
    queryKey: weatherKeys.forecast(location),
    queryFn: async ({ signal }) => {
      try {
        return await getForecast(location, signal);
      } catch (error) {
        throw toWeatherError(error);
      }
    },
    select: (raw) => transformForecastToDaily(raw),
    enabled: options?.enabled,
  });
}

export type UseForecastQueryResult = ReturnType<typeof useForecastQuery> & {
  data?: DailyForecastResult;
};
