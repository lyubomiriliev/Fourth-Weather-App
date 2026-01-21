import { describe, it, expect } from 'vitest';
import { transformForecastToDaily } from '../utils/transformForecast';
import type { OpenWeatherForecastResponse, Forecast3hItem } from '../types';

function createForecast3hItem(overrides: {
  dt: number;
  temp_min: number;
  temp_max: number;
  temp?: number;
  icon?: string;
  description?: string;
}): Forecast3hItem {
  return {
    dt: overrides.dt,
    dt_txt: new Date(overrides.dt * 1000).toISOString(),
    main: {
      temp: overrides.temp ?? (overrides.temp_min + overrides.temp_max) / 2,
      feels_like: overrides.temp ?? (overrides.temp_min + overrides.temp_max) / 2,
      temp_min: overrides.temp_min,
      temp_max: overrides.temp_max,
      pressure: 1013,
      humidity: 65,
    },
    weather: [
      {
        id: 800,
        main: 'Clear',
        description: overrides.description ?? 'clear sky',
        icon: overrides.icon ?? '01d',
      },
    ],
    pop: 0,
  };
}

function createMockResponse(
  items: Forecast3hItem[],
  timezone: number = 0
): OpenWeatherForecastResponse {
  return {
    cod: '200',
    message: 0,
    cnt: items.length,
    list: items,
    city: {
      id: 1,
      name: 'Test City',
      coord: { lat: 0, lon: 0 },
      country: 'TC',
      timezone,
      sunrise: 1600000000,
      sunset: 1600040000,
    },
  };
}

describe('transformForecastToDaily', () => {
  it('groups items into correct daily keys', () => {
    const items = [
      createForecast3hItem({
        dt: 1704067200,
        temp_min: 10,
        temp_max: 15,
        icon: '01d',
      }),
      createForecast3hItem({
        dt: 1704078000,
        temp_min: 12,
        temp_max: 18,
        icon: '02d',
      }),
      createForecast3hItem({
        dt: 1704153600,
        temp_min: 8,
        temp_max: 14,
        icon: '03d',
      }),
    ];

    const response = createMockResponse(items, 0);
    const result = transformForecastToDaily(response);

    expect(result.days).toHaveLength(2);
    expect(result.days[0].date).toBe('2024-01-01');
    expect(result.days[1].date).toBe('2024-01-02');
  });

  it('calculates correct min/max temperatures for each day', () => {
    const items = [
      createForecast3hItem({
        dt: 1704067200,
        temp_min: 10,
        temp_max: 15,
      }),
      createForecast3hItem({
        dt: 1704078000,
        temp_min: 8,
        temp_max: 18,
      }),
      createForecast3hItem({
        dt: 1704088800,
        temp_min: 12,
        temp_max: 20,
      }),
    ];

    const response = createMockResponse(items, 0);
    const result = transformForecastToDaily(response);

    expect(result.days).toHaveLength(1);
    expect(result.days[0].tempMin).toBe(8);
    expect(result.days[0].tempMax).toBe(20);
  });

  it('selects icon closest to noon (12:00 local)', () => {
    const items = [
      createForecast3hItem({
        dt: 1704067200,
        temp_min: 10,
        temp_max: 15,
        icon: '01d',
      }),
      createForecast3hItem({
        dt: 1704110400,
        temp_min: 12,
        temp_max: 18,
        icon: '02d',
        description: 'partly cloudy',
      }),
      createForecast3hItem({
        dt: 1704121200,
        temp_min: 14,
        temp_max: 20,
        icon: '03d',
      }),
    ];

    const response = createMockResponse(items, 0);
    const result = transformForecastToDaily(response);

    expect(result.days).toHaveLength(1);
    expect(result.days[0].icon).toBe('02d');
    expect(result.days[0].description).toBe('partly cloudy');
  });

  it('handles timezone boundaries correctly', () => {
    const timezoneOffset = 3600 * 8;

    const items = [
      createForecast3hItem({
        dt: 1704063600,
        temp_min: 10,
        temp_max: 15,
        icon: '01d',
      }),
      createForecast3hItem({
        dt: 1704067200,
        temp_min: 12,
        temp_max: 18,
        icon: '02d',
      }),
    ];

    const response = createMockResponse(items, timezoneOffset);
    const result = transformForecastToDaily(response);

    const localDate1 = new Date((items[0].dt + timezoneOffset) * 1000);
    const localDate2 = new Date((items[1].dt + timezoneOffset) * 1000);

    const expectedDay1 = `${localDate1.getUTCFullYear()}-${String(localDate1.getUTCMonth() + 1).padStart(2, '0')}-${String(localDate1.getUTCDate()).padStart(2, '0')}`;
    const expectedDay2 = `${localDate2.getUTCFullYear()}-${String(localDate2.getUTCMonth() + 1).padStart(2, '0')}-${String(localDate2.getUTCDate()).padStart(2, '0')}`;

    expect(result.days[0].date).toBe(expectedDay1);

    if (expectedDay1 !== expectedDay2) {
      expect(result.days).toHaveLength(2);
    } else {
      expect(result.days).toHaveLength(1);
    }
  });

  it('limits output to 5 days', () => {
    const items: Forecast3hItem[] = [];

    for (let day = 0; day < 7; day++) {
      for (let hour = 0; hour < 8; hour++) {
        items.push(
          createForecast3hItem({
            dt: 1704067200 + day * 86400 + hour * 10800,
            temp_min: 10 + day,
            temp_max: 20 + day,
            icon: '01d',
          })
        );
      }
    }

    const response = createMockResponse(items, 0);
    const result = transformForecastToDaily(response);

    expect(result.days).toHaveLength(5);
  });

  it('sorts days in ascending order', () => {
    const items = [
      createForecast3hItem({
        dt: 1704240000,
        temp_min: 10,
        temp_max: 15,
      }),
      createForecast3hItem({
        dt: 1704067200,
        temp_min: 12,
        temp_max: 18,
      }),
      createForecast3hItem({
        dt: 1704153600,
        temp_min: 8,
        temp_max: 14,
      }),
    ];

    const response = createMockResponse(items, 0);
    const result = transformForecastToDaily(response);

    expect(result.days).toHaveLength(3);
    expect(result.days[0].date).toBe('2024-01-01');
    expect(result.days[1].date).toBe('2024-01-02');
    expect(result.days[2].date).toBe('2024-01-03');
  });

  it('includes hourly data with local time formatting', () => {
    const items = [
      createForecast3hItem({
        dt: 1704067200,
        temp_min: 10,
        temp_max: 15,
        temp: 12,
        icon: '01d',
        description: 'clear',
      }),
      createForecast3hItem({
        dt: 1704078000,
        temp_min: 12,
        temp_max: 18,
        temp: 15,
        icon: '02d',
        description: 'cloudy',
      }),
    ];

    const response = createMockResponse(items, 0);
    const result = transformForecastToDaily(response);

    expect(result.days[0].hourly).toHaveLength(2);
    expect(result.days[0].hourly[0]).toMatchObject({
      dt: 1704067200,
      temp: 12,
      icon: '01d',
      description: 'clear',
    });
    expect(result.days[0].hourly[0].timeLocal).toMatch(/^\d{2}:\d{2}$/);
  });

  it('preserves location metadata', () => {
    const items = [
      createForecast3hItem({
        dt: 1704067200,
        temp_min: 10,
        temp_max: 15,
      }),
    ];

    const response = createMockResponse(items, 3600);
    response.city.name = 'London';
    response.city.country = 'GB';

    const result = transformForecastToDaily(response);

    expect(result.locationName).toBe('London');
    expect(result.country).toBe('GB');
    expect(result.timezoneOffsetSec).toBe(3600);
  });
});
