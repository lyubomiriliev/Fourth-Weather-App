import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { Box, Typography, Button, Alert } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { HourlyForecastTable } from '../components/HourlyForecastTable';
import { CenteredLoading } from '../../../shared/components/CenteredLoading';
import { ErrorAlert } from '../../../shared/components/ErrorAlert';
import { useForecastLocationFromUrl } from '../hooks/useForecastLocationFromUrl';
import { useForecastQuery } from '../hooks/useForecastQuery';
import type { WeatherError } from '../utils/errors';

export function ForecastDetailPage() {
  const { dayId } = useParams<{ dayId: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const { location: forecastLocation } = useForecastLocationFromUrl();

  const { data, isLoading, error } = useForecastQuery(
    forecastLocation ?? { kind: 'city', query: '' },
    { enabled: !!forecastLocation }
  );

  const handleBack = () => {
    navigate({
      pathname: '/',
      search: location.search,
    });
  };

  if (!forecastLocation) {
    return (
      <Box>
        <Alert severity="warning">
          No location selected. Please go back and select a location.
        </Alert>
        <Button
          variant="contained"
          startIcon={<ArrowBackIcon />}
          onClick={handleBack}
          sx={{ mt: 2 }}
        >
          Back to Search
        </Button>
      </Box>
    );
  }

  if (isLoading) {
    return <CenteredLoading />;
  }

  if (error) {
    return (
      <Box>
        <ErrorAlert
          title="Failed to load forecast"
          message={
            (error as unknown as WeatherError).message ||
            (error instanceof Error ? error.message : 'An error occurred')
          }
        />
        <Button
          variant="contained"
          startIcon={<ArrowBackIcon />}
          onClick={handleBack}
          sx={{ mt: 2 }}
        >
          Back to Search
        </Button>
      </Box>
    );
  }

  if (!data) {
    return null;
  }

  const selectedDay = data.days.find((day) => day.date === dayId);

  if (!selectedDay) {
    return (
      <Box>
        <Alert severity="error">
          Day not found. The selected date may not be available in the forecast.
        </Alert>
        <Button
          variant="contained"
          startIcon={<ArrowBackIcon />}
          onClick={handleBack}
          sx={{ mt: 2 }}
        >
          Back to Forecast List
        </Button>
      </Box>
    );
  }

  const formattedDate = new Date(selectedDay.date + 'T00:00:00').toLocaleDateString(
    'en-US',
    {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }
  );

  return (
    <Box>
      <Button
        variant="outlined"
        startIcon={<ArrowBackIcon />}
        onClick={handleBack}
        sx={{ mb: 3 }}
      >
        Back to Forecast List
      </Button>

      <Typography variant="h4" component="h1" gutterBottom>
        {data.locationName}, {data.country}
      </Typography>
      <Typography variant="h5" component="h2" gutterBottom color="text.secondary">
        {formattedDate}
      </Typography>
      <Typography variant="body1" paragraph>
        Temperature range: {Math.round(selectedDay.tempMin)}°C -{' '}
        {Math.round(selectedDay.tempMax)}°C
      </Typography>

      <HourlyForecastTable day={selectedDay} />
    </Box>
  );
}
