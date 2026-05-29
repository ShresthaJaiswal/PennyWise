import { createTheme } from '@mui/material'

export const theme = createTheme({
    typography: {
        fontFamily: 'Inter, system-ui, sans-serif',
        h4: { fontSize: '1.75rem', fontWeight: 700 },
        h6: { fontSize: '1rem', fontWeight: 600 },
        body1: { fontSize: '0.9rem' },
        body2: { fontSize: '0.8rem' },
    },
    spacing: 8,
    components: {
        MuiTableCell: {
            styleOverrides: {
                root: { padding: '8px 12px', fontSize: '0.8rem' }
            }
        },
        MuiButton: {
            styleOverrides: {
                root: { textTransform: 'none', fontWeight: 600 }
            }
        },
        MuiTextField: {
            defaultProps: { size: 'small', variant: 'outlined' },
        },
        MuiInputLabel: {
            styleOverrides: {
                root: { color: 'rgba(37, 36, 36, 0.5)', '&.Mui-focused': { color: '#0e7490' } }
            }
        },
        MuiSelect: {
            defaultProps: { size: 'small' },
        },
        MuiFormControl: {
            defaultProps: { size: 'small' }
        },
        MuiMenuItem: {
            styleOverrides: {
                root: { fontSize: '0.875rem' }
            }
        },
    }
})