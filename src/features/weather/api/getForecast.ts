import { openWeatherClient } from './openWeatherClient';
import type { ForecastLocation, OpenWeatherForecastResponse } from '../types';

export async function getForecast(
  location: ForecastLocation,
  signal?: AbortSignal
): Promise<OpenWeatherForecastResponse> {
  const params: Record<string, string | number> = {};

  if (location.kind === 'coords') {
    params.lat = location.lat;
    params.lon = location.lon;
  } else {
    params.q = location.query;
  }

  const response = await openWeatherClient.get<OpenWeatherForecastResponse>(
    '/forecast',
    {
      params,
      signal,
    }
  );

  return response.data;
}
