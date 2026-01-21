export interface OpenWeatherForecastResponse {
  cod: string;
  message: number;
  cnt: number;
  list: Forecast3hItem[];
  city: {
    id: number;
    name: string;
    coord: {
      lat: number;
      lon: number;
    };
    country: string;
    timezone: number;
    sunrise: number;
    sunset: number;
  };
}

export interface Forecast3hItem {
  dt: number;
  dt_txt: string;
  main: {
    temp: number;
    feels_like: number;
    temp_min: number;
    temp_max: number;
    pressure: number;
    humidity: number;
  };
  weather: Array<{
    id: number;
    main: string;
    description: string;
    icon: string;
  }>;
  clouds?: {
    all: number;
  };
  wind?: {
    speed: number;
    deg: number;
    gust?: number;
  };
  visibility?: number;
  pop?: number;
  rain?: {
    '3h'?: number;
  };
  snow?: {
    '3h'?: number;
  };
}

export type ForecastLocation =
  | { kind: 'coords'; lat: number; lon: number }
  | { kind: 'city'; query: string };

export interface DailyForecast {
  date: string;
  tempMin: number;
  tempMax: number;
  icon: string;
  description: string;
  hourly: Array<{
    dt: number;
    timeLocal: string;
    temp: number;
    icon: string;
    description: string;
    pop?: number;
  }>;
}

export interface DailyForecastResult {
  locationName: string;
  country: string;
  timezoneOffsetSec: number;
  days: DailyForecast[];
}
