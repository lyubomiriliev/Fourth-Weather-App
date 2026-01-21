import { Box, Stack } from '@mui/material';
import { DailyForecastCard } from './DailyForecastCard';
import type { DailyForecast } from '../types';

interface ForecastListProps {
  days: DailyForecast[];
}

export function ForecastList({ days }: ForecastListProps) {
  return (
    <Stack spacing={2}>
      {days.map((day) => (
        <Box key={day.date}>
          <DailyForecastCard forecast={day} />
        </Box>
      ))}
    </Stack>
  );
}
