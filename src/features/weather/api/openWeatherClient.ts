import axios from 'axios';

const apiKey = import.meta.env.VITE_OPENWEATHER_API_KEY;

if (!apiKey) {
  throw new Error(
    'Missing VITE_OPENWEATHER_API_KEY environment variable. ' +
    'Please create a .env file with VITE_OPENWEATHER_API_KEY=your_api_key'
  );
}

export const openWeatherClient = axios.create({
  baseURL: 'https://api.openweathermap.org/data/2.5',
  timeout: 10000,
  params: {
    appid: apiKey,
    units: 'metric',
  },
});
