import axios from 'axios';

export type WeatherErrorCode =
  | 'CITY_NOT_FOUND'
  | 'INVALID_API_KEY'
  | 'NETWORK'
  | 'UNKNOWN';

export interface WeatherError {
  code: WeatherErrorCode;
  message: string;
  status?: number;
}

export function toWeatherError(error: unknown): WeatherError {
  if (axios.isAxiosError(error)) {
    if (error.response) {
      const status = error.response.status;

      if (status === 404) {
        return {
          code: 'CITY_NOT_FOUND',
          message: 'City not found. Please check the city name and try again.',
          status,
        };
      }

      if (status === 401) {
        return {
          code: 'INVALID_API_KEY',
          message: 'Invalid API key. Please check your configuration.',
          status,
        };
      }

      return {
        code: 'UNKNOWN',
        message: 'An unexpected error occurred. Please try again.',
        status,
      };
    }

    return {
      code: 'NETWORK',
      message: 'Network error. Please check your connection and try again.',
    };
  }

  return {
    code: 'UNKNOWN',
    message: error instanceof Error ? error.message : 'An unknown error occurred',
  };
}
