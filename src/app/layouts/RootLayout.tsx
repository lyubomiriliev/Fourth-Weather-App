import { Outlet } from 'react-router-dom';
import { Container, Box } from '@mui/material';

export function RootLayout() {
  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #f5f7fa 0%, #e8f0f8 100%)',
        py: 4,
      }}
    >
      <Container maxWidth="lg">
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            mb: 4,
          }}
        >
          <img
            src="/assets/fourth-logo.png"
            alt="Fourth"
            style={{ height: '60px', width: 'auto' }}
          />
        </Box>
        <Outlet />
      </Container>
    </Box>
  );
}
