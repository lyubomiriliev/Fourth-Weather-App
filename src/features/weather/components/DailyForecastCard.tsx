import { Card, CardContent, CardActionArea, Typography, Box } from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import type { DailyForecast } from '../types';

interface DailyForecastCardProps {
  forecast: DailyForecast;
}

export function DailyForecastCard({ forecast }: DailyForecastCardProps) {
  const navigate = useNavigate();
  const location = useLocation();

  const handleClick = () => {
    navigate({
      pathname: `/forecast/${forecast.date}`,
      search: location.search,
    });
  };

  const iconUrl = `https://openweathermap.org/img/wn/${forecast.icon}@2x.png`;

  return (
    <Card>
      <CardActionArea onClick={handleClick}>
        <CardContent>
          <Typography variant="h6" component="div" gutterBottom>
            {new Date(forecast.date + 'T00:00:00').toLocaleDateString('en-US', {
              weekday: 'short',
              month: 'short',
              day: 'numeric',
            })}
          </Typography>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <img
                src={iconUrl}
                alt={forecast.description}
                style={{ width: 60, height: 60 }}
              />
              <Box>
                <Typography variant="body2" color="text.secondary">
                  {forecast.description}
                </Typography>
                <Typography variant="h5" component="div">
                  {Math.round(forecast.tempMax)}° / {Math.round(forecast.tempMin)}°
                </Typography>
              </Box>
            </Box>
          </Box>
        </CardContent>
      </CardActionArea>
    </Card>
  );
}
