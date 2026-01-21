import { useState } from 'react';
import {
  Box,
  TextField,
  Button,
  Stack,
  Alert,
  Paper,
  Typography,
} from '@mui/material';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import SearchIcon from '@mui/icons-material/Search';

interface LocationSearchProps {
  onCitySubmit: (city: string) => void;
  onCoordsSubmit: (lat: number, lon: number) => void;
}

export function LocationSearch({
  onCitySubmit,
  onCoordsSubmit,
}: LocationSearchProps) {
  const [cityInput, setCityInput] = useState('');
  const [geoError, setGeoError] = useState<string | null>(null);
  const [isLoadingGeo, setIsLoadingGeo] = useState(false);

  const handleCitySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (cityInput.trim()) {
      onCitySubmit(cityInput.trim());
    }
  };

  const handleUseCurrentLocation = () => {
    setGeoError(null);
    setIsLoadingGeo(true);

    if (!navigator.geolocation) {
      setGeoError('Geolocation is not supported by your browser');
      setIsLoadingGeo(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setIsLoadingGeo(false);
        onCoordsSubmit(position.coords.latitude, position.coords.longitude);
      },
      (error) => {
        setIsLoadingGeo(false);
        let message = 'Failed to get your location';
        if (error.code === error.PERMISSION_DENIED) {
          message = 'Location permission denied. Please enable location access.';
        } else if (error.code === error.POSITION_UNAVAILABLE) {
          message = 'Location information unavailable.';
        } else if (error.code === error.TIMEOUT) {
          message = 'Location request timed out.';
        }
        setGeoError(message);
      }
    );
  };

  return (
      <Paper
      elevation={0}
      sx={{
        p: 4,
        mb: 4,
        backgroundColor: 'background.default',
        boxShadow: 'inset 0 2px 8px rgba(255, 255, 255, 0.1), 0 8px 32px rgba(25, 52, 99, 0.15)',
      }}
    >
      <Typography
        variant="h5"
        component="h1"
        gutterBottom
        sx={{ color: 'primary.main', fontWeight: 600, mb: 3 }}
      >
        Weather Forecast
      </Typography>
      <Box component="form" onSubmit={handleCitySubmit}>
        <Stack spacing={2}>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
            <TextField
              fullWidth
              label="Search city"
              placeholder="e.g., London or London,GB"
              value={cityInput}
              onChange={(e) => setCityInput(e.target.value)}
              size="medium"
              sx={{
                '& .MuiOutlinedInput-root': {
                  backgroundColor: 'white',
                },
              }}
            />
            <Button
              type="submit"
              variant="contained"
              startIcon={<SearchIcon />}
              disabled={!cityInput.trim()}
              sx={{
                minWidth: { xs: '100%', sm: '120px' },
                cursor: !cityInput.trim() ? 'not-allowed' : 'pointer',
                background: 'linear-gradient(135deg, #6dbe82 0%, #8cd09d 100%)',
                '&:hover': {
                  background: 'linear-gradient(135deg, #4a9b60 0%, #6dbe82 100%)',
                },
              }}
            >
              Search
            </Button>
          </Stack>
          <Button
            variant="outlined"
            startIcon={<LocationOnIcon />}
            onClick={handleUseCurrentLocation}
            disabled={isLoadingGeo}
            fullWidth
            sx={{
              borderColor: 'primary.main',
              color: 'primary.main',
              transition: 'all 0.3s ease',
              '&:hover': {
                borderColor: 'primary.dark',
                backgroundColor: 'primary.light',
                color: 'white',
              },
            }}
          >
            {isLoadingGeo ? 'Getting location...' : 'Use Current Location'}
          </Button>
          {geoError && (
            <Alert
              severity="error"
              onClose={() => setGeoError(null)}
              sx={{ borderRadius: 2 }}
            >
              {geoError}
            </Alert>
          )}
        </Stack>
      </Box>
    </Paper>
  );
}
