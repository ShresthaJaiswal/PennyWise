import { Box, Typography, IconButton } from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'

export default function ToastContainer({ toasts, removeToast }) {
  return (
    <Box sx={{ position: 'fixed', bottom: 24, right: 24, zIndex: 9999, display: 'flex', flexDirection: 'column', gap: 1.5 }}>
      {toasts.map((toast) => (
        <Box
          key={toast.id}
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1,
            px: 2,
            py: 1,
            bgcolor: 'lightblue',
            color: 'text.primary',
            borderRadius: 2,
          }}
        >
          <Typography variant="body2">{toast.message}</Typography>

          <IconButton
            onClick={() => removeToast(toast.id)}
            size="small"
          >
            <CloseIcon />
          </IconButton>
        </Box>
      ))}
    </Box>
  );
}