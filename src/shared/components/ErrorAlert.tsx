import { Alert, AlertTitle } from '@mui/material';

interface ErrorAlertProps {
  title?: string;
  message: string;
}

export function ErrorAlert({ title = 'Error', message }: ErrorAlertProps) {
  return (
    <Alert
      severity="error"
      sx={{
        borderRadius: 3,
        background: 'linear-gradient(135deg, #ffebee 0%, #ffcdd2 100%)',
        border: '1px solid rgba(197, 45, 56, 0.2)',
      }}
    >
      <AlertTitle sx={{ fontWeight: 600 }}>{title}</AlertTitle>
      {message}
    </Alert>
  );
}
