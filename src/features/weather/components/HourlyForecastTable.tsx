import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Box,
} from '@mui/material';
import type { DailyForecast } from '../types';

interface HourlyForecastTableProps {
  day: DailyForecast;
}

export function HourlyForecastTable({ day }: HourlyForecastTableProps) {
  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Time</TableCell>
            <TableCell>Weather</TableCell>
            <TableCell align="right">Temperature</TableCell>
            <TableCell align="right">Precipitation</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {day.hourly.map((hour) => {
            const iconUrl = `https://openweathermap.org/img/wn/${hour.icon}.png`;
            return (
              <TableRow key={hour.dt}>
                <TableCell>{hour.timeLocal}</TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <img
                      src={iconUrl}
                      alt={hour.description}
                      style={{ width: 40, height: 40 }}
                    />
                    <span>{hour.description}</span>
                  </Box>
                </TableCell>
                <TableCell align="right">{Math.round(hour.temp)}°C</TableCell>
                <TableCell align="right">
                  {hour.pop !== undefined ? `${Math.round(hour.pop * 100)}%` : 'N/A'}
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
