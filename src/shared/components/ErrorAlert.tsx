import { Alert, AlertTitle } from '@mui/material';

interface ErrorAlertProps {
  title?: string;
  message: string;
}

export function ErrorAlert({ title = 'Error', message }: ErrorAlertProps) {
  return (
    <Alert severity="error">
      <AlertTitle>{title}</AlertTitle>
      {message}
    </Alert>
  );
}
