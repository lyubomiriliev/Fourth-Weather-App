import { Outlet } from 'react-router-dom';
import { Container, Box } from '@mui/material';

export function RootLayout() {
  return (
    <Box sx={{ minHeight: '100vh', py: 4 }}>
      <Container maxWidth="lg">
        <Outlet />
      </Container>
    </Box>
  );
}
