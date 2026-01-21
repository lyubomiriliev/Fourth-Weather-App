import { useSearchParams } from 'react-router-dom';
import { useMemo } from 'react';
import type { ForecastLocation } from '../types';

interface UseForecastLocationFromUrlResult {
  location: ForecastLocation | null;
  mode: 'city' | 'coords' | 'none';
  setLocationCity: (city: string) => void;
  setLocationCoords: (lat: number, lon: number) => void;
}

export function useForecastLocationFromUrl(): UseForecastLocationFromUrlResult {
  const [searchParams, setSearchParams] = useSearchParams();

  const { location, mode } = useMemo(() => {
    const city = searchParams.get('city');
    const latStr = searchParams.get('lat');
    const lonStr = searchParams.get('lon');

    if (city && city.trim()) {
      return {
        location: { kind: 'city' as const, query: city.trim() },
        mode: 'city' as const,
      };
    }

    if (latStr && lonStr) {
      const lat = parseFloat(latStr);
      const lon = parseFloat(lonStr);
      if (Number.isFinite(lat) && Number.isFinite(lon)) {
        return {
          location: { kind: 'coords' as const, lat, lon },
          mode: 'coords' as const,
        };
      }
    }

    return {
      location: null,
      mode: 'none' as const,
    };
  }, [searchParams]);

  const setLocationCity = (city: string) => {
    const newParams = new URLSearchParams();
    if (city.trim()) {
      newParams.set('city', city.trim());
    }
    setSearchParams(newParams);
  };

  const setLocationCoords = (lat: number, lon: number) => {
    const newParams = new URLSearchParams();
    newParams.set('lat', lat.toString());
    newParams.set('lon', lon.toString());
    setSearchParams(newParams);
  };

  return {
    location,
    mode,
    setLocationCity,
    setLocationCoords,
  };
}
