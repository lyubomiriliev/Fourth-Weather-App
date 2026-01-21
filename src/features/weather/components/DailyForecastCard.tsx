import { Card, CardContent, CardActionArea, Typography, Box } from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
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
    <Card
      elevation={0}
      sx={{
        background: 'linear-gradient(135deg, #ffffff 0%, #f8fbff 100%)',
        boxShadow: 'inset 0 1px 3px rgba(109, 190, 130, 0.1), 0 4px 16px rgba(25, 52, 99, 0.08)',
        transition: 'all 0.3s ease',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: 'inset 0 1px 3px rgba(109, 190, 130, 0.15), 0 8px 24px rgba(25, 52, 99, 0.12)',
        },
      }}
    >
      <CardActionArea onClick={handleClick}>
        <CardContent sx={{ p: 3 }}>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <Box sx={{ flex: 1 }}>
              <Typography
                variant="h6"
                component="div"
                sx={{ color: 'primary.main', fontWeight: 600, mb: 1 }}
              >
                {new Date(forecast.date + 'T00:00:00').toLocaleDateString('en-US', {
                  weekday: 'short',
                  month: 'short',
                  day: 'numeric',
                })}
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Box
                  sx={{
                    background: 'linear-gradient(135deg,rgb(105, 149, 184) 0%,rgb(193, 230, 255) 100%)',
                    borderRadius: 3,
                    p: 1,
                    boxShadow: 'inset 0 1px 3px rgba(25, 52, 99, 0.08)',
                  }}
                >
                  <img
                    src={iconUrl}
                    alt={forecast.description}
                    style={{ width: 60, height: 60, display: 'block' }}
                  />
                </Box>
                <Box>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ textTransform: 'capitalize', mb: 0.5 }}
                  >
                    {forecast.description}
                  </Typography>
                  <Typography
                    variant="h5"
                    component="div"
                    sx={{
                      fontWeight: 700,
                      background: 'linear-gradient(135deg, #f99b30 0%, #c52d38 100%)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                    }}
                  >
                    {Math.round(forecast.tempMax)}° / {Math.round(forecast.tempMin)}°
                  </Typography>
                </Box>
              </Box>
            </Box>
            <ArrowForwardIosIcon
              sx={{ color: 'primary.main', opacity: 0.5, fontSize: 20 }}
            />
          </Box>
        </CardContent>
      </CardActionArea>
    </Card>
  );
}
