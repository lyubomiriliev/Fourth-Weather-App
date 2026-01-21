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
    <TableContainer
      component={Paper}
      elevation={0}
      sx={{
        background: 'linear-gradient(135deg, #ffffff 0%, #f8fbff 100%)',
        boxShadow: 'inset 0 1px 3px rgba(109, 190, 130, 0.1), 0 4px 16px rgba(25, 52, 99, 0.08)',
      }}
    >
      <Table>
        <TableHead>
          <TableRow
            sx={{
              background: 'linear-gradient(135deg, #193463 0%, #2d4a7c 100%)',
            }}
          >
            <TableCell sx={{ color: 'white', fontWeight: 600 }}>Time</TableCell>
            <TableCell sx={{ color: 'white', fontWeight: 600 }}>Weather</TableCell>
            <TableCell align="right" sx={{ color: 'white', fontWeight: 600 }}>
              Temperature
            </TableCell>
            <TableCell align="right" sx={{ color: 'white', fontWeight: 600 }}>
              Precipitation
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {day.hourly.map((hour) => {
            const iconUrl = `https://openweathermap.org/img/wn/${hour.icon}.png`;
            return (
              <TableRow
                key={hour.dt}
                sx={{
                  '&:nth-of-type(odd)': {
                    backgroundColor: 'rgba(25, 52, 99, 0.02)',
                  },
                  '&:hover': {
                    backgroundColor: 'rgba(109, 190, 130, 0.08)',
                  },
                }}
              >
                <TableCell sx={{ fontWeight: 500 }}>{hour.timeLocal}</TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Box
                      sx={{
                        background: 'linear-gradient(135deg, #e8f5ff 0%, #f0f9ff 100%)',
                        borderRadius: 2,
                        p: 0.5,
                        display: 'flex',
                        boxShadow: 'inset 0 1px 2px rgba(25, 52, 99, 0.05)',
                      }}
                    >
                      <img
                        src={iconUrl}
                        alt={hour.description}
                        style={{ width: 40, height: 40, display: 'block' }}
                      />
                    </Box>
                    <span style={{ textTransform: 'capitalize' }}>{hour.description}</span>
                  </Box>
                </TableCell>
                <TableCell align="right" sx={{ fontWeight: 600, fontSize: '1.1rem' }}>
                  {Math.round(hour.temp)}°C
                </TableCell>
                <TableCell
                  align="right"
                  sx={{
                    color: hour.pop && hour.pop > 0.5 ? '#c52d38' : 'text.secondary',
                    fontWeight: hour.pop && hour.pop > 0.5 ? 600 : 400,
                  }}
                >
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
