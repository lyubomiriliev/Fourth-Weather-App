import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { Box, Typography, Button, Alert, Paper } from '@mui/material';
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
        <Alert
          severity="warning"
          sx={{
            borderRadius: 3,
            background: 'linear-gradient(135deg, #fff8e1 0%, #ffecb3 100%)',
            mb: 2,
          }}
        >
          No location selected. Please go back and select a location.
        </Alert>
        <Button
          variant="contained"
          startIcon={<ArrowBackIcon />}
          onClick={handleBack}
          sx={{
            background: 'linear-gradient(135deg, #193463 0%, #2d4a7c 100%)',
            '&:hover': {
              background: 'linear-gradient(135deg, #0f1f3d 0%, #193463 100%)',
            },
          }}
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
          sx={{
            mt: 2,
            background: 'linear-gradient(135deg, #193463 0%, #2d4a7c 100%)',
            '&:hover': {
              background: 'linear-gradient(135deg, #0f1f3d 0%, #193463 100%)',
            },
          }}
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
        <Alert
          severity="error"
          sx={{
            borderRadius: 3,
            background: 'linear-gradient(135deg, #ffebee 0%, #ffcdd2 100%)',
            mb: 2,
          }}
        >
          Day not found. The selected date may not be available in the forecast.
        </Alert>
        <Button
          variant="contained"
          startIcon={<ArrowBackIcon />}
          onClick={handleBack}
          sx={{
            background: 'linear-gradient(135deg, #193463 0%, #2d4a7c 100%)',
            '&:hover': {
              background: 'linear-gradient(135deg, #0f1f3d 0%, #193463 100%)',
            },
          }}
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
        sx={{
          mb: 3,
          borderColor: 'primary.main',
          color: 'primary.main',
          '&:hover': {
            borderColor: 'primary.dark',
            backgroundColor: 'rgba(25, 52, 99, 0.04)',
          },
        }}
      >
        Back to Forecast List
      </Button>

      <Paper
        elevation={0}
        sx={{
          p: 3,
          mb: 3,
          background: 'linear-gradient(135deg, #193463 0%, #2d4a7c 100%)',
          boxShadow: 'inset 0 2px 8px rgba(255, 255, 255, 0.1), 0 4px 16px rgba(25, 52, 99, 0.2)',
        }}
      >
        <Typography
          variant="h4"
          component="h1"
          sx={{ color: 'white', fontWeight: 700, mb: 1 }}
        >
          {data.locationName}, {data.country}
        </Typography>
        <Typography
          variant="h5"
          component="h2"
          sx={{ color: 'rgba(255, 255, 255, 0.9)', fontWeight: 500, mb: 1 }}
        >
          {formattedDate}
        </Typography>
        <Typography variant="body1" sx={{ color: 'rgba(255, 255, 255, 0.8)' }}>
          Temperature range:{' '}
          <Box
            component="span"
            sx={{
              fontWeight: 700,
              background: 'linear-gradient(135deg, #f99b30 0%, #fab45a 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            {Math.round(selectedDay.tempMin)}°C - {Math.round(selectedDay.tempMax)}°C
          </Box>
        </Typography>
      </Paper>

      <HourlyForecastTable day={selectedDay} />
    </Box>
  );
}
