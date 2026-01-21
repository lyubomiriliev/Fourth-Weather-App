import { Box, Typography, Alert } from '@mui/material';
import { LocationSearch } from '../components/LocationSearch';
import { ForecastList } from '../components/ForecastList';
import { CenteredLoading } from '../../../shared/components/CenteredLoading';
import { ErrorAlert } from '../../../shared/components/ErrorAlert';
import { useForecastLocationFromUrl } from '../hooks/useForecastLocationFromUrl';
import { useForecastQuery } from '../hooks/useForecastQuery';
import type { WeatherError } from '../utils/errors';

export function ForecastPage() {
  const { location, setLocationCity, setLocationCoords } = useForecastLocationFromUrl();

  const { data, isLoading, error } = useForecastQuery(location ?? { kind: 'city', query: '' },{ enabled: !!location });

  return (
    <Box>
      <LocationSearch
        onCitySubmit={setLocationCity}
        onCoordsSubmit={setLocationCoords}
      />

      {!location && (
        <Alert severity="info">
          Enter a city name or use your current location to see the forecast.
        </Alert>
      )}

      {location && isLoading && <CenteredLoading />}

      {location && error && (
        <ErrorAlert
          title="Failed to load forecast"
          message={
            (error as unknown as WeatherError).message ||
            (error instanceof Error ? error.message : 'An error occurred')
          }
        />
      )}

      {location && data && (
        <Box>
          <Typography variant="h4" component="h2" gutterBottom>
            {data.locationName}, {data.country}
          </Typography>
          <Typography variant="body2" color="text.secondary" paragraph>
            5-Day Forecast
          </Typography>
          <ForecastList days={data.days} />
        </Box>
      )}
    </Box>
  );
}
