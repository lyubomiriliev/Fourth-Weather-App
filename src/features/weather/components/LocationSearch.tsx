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

    navigator.geolocation.getCurrentPosition((position) => {
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
    <Paper elevation={2} sx={{ p: 3, mb: 4 }}>
      <Typography variant="h5" component="h1" gutterBottom>
        Weather Forecast
      </Typography>
      <Box component="form" onSubmit={handleCitySubmit}>
        <Stack spacing={2}>
          <Stack direction="row" spacing={2}>
            <TextField
              fullWidth
              label="Search city"
              placeholder="e.g., London or London,GB"
              value={cityInput}
              onChange={(e) => setCityInput(e.target.value)}
              size="medium"
            />
            <Button
              type="submit"
              variant="contained"
              startIcon={<SearchIcon />}
              disabled={!cityInput.trim()}
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
          >
            {isLoadingGeo ? 'Getting location...' : 'Use Current Location'}
          </Button>
          {geoError && (
            <Alert severity="error" onClose={() => setGeoError(null)}>
              {geoError}
            </Alert>
          )}
        </Stack>
      </Box>
    </Paper>
  );
}
