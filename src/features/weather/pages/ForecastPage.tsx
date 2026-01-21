import { Box, Typography, Alert, Paper } from '@mui/material';
import { LocationSearch } from '../components/LocationSearch';
import { ForecastList } from '../components/ForecastList';
import { CenteredLoading } from '../../../shared/components/CenteredLoading';
import { ErrorAlert } from '../../../shared/components/ErrorAlert';
import { useForecastLocationFromUrl } from '../hooks/useForecastLocationFromUrl';
import { useForecastQuery } from '../hooks/useForecastQuery';
import type { WeatherError } from '../utils/errors';

export function ForecastPage() {
  const { location, setLocationCity, setLocationCoords } =
    useForecastLocationFromUrl();

  const { data, isLoading, error } = useForecastQuery(
    location ?? { kind: 'city', query: '' },
    { enabled: !!location }
  );

  return (
    <Box>
      <LocationSearch
        onCitySubmit={setLocationCity}
        onCoordsSubmit={setLocationCoords}
      />

      {!location && (
        <Alert
          severity="info"
          sx={{
            borderRadius: 3,
            background: 'linear-gradient(135deg, #e8f5ff 0%, #f0f9ff 100%)',
            border: '1px solid rgba(109, 190, 130, 0.2)',
          }}
        >
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
          <Paper
            elevation={0}
            sx={{
              p: 3,
              mb: 3,
              background: 'linear-gradient(135deg, #6dbe82 0%, #8cd09d 100%)',
              boxShadow: 'inset 0 2px 8px rgba(255, 255, 255, 0.2), 0 4px 16px rgba(109, 190, 130, 0.2)',
            }}
          >
            <Typography
              variant="h4"
              component="h2"
              sx={{ color: 'white', fontWeight: 700, mb: 0.5 }}
            >
              {data.locationName}, {data.country}
            </Typography>
            <Typography variant="body1" sx={{ color: 'rgba(255, 255, 255, 0.9)' }}>
              5-Day Forecast
            </Typography>
          </Paper>
          <ForecastList days={data.days} />
        </Box>
      )}
    </Box>
  );
}
