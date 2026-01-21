import { createBrowserRouter } from 'react-router-dom';
import { RootLayout } from './layouts/RootLayout';
import { ForecastPage } from '../features/weather/pages/ForecastPage';
import { ForecastDetailPage } from '../features/weather/pages/ForecastDetailPage';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    children: [
      {
        index: true,
        element: <ForecastPage />,
      },
      {
        path: 'forecast/:dayId',
        element: <ForecastDetailPage />,
      },
    ],
  },
]);
