import { Box, Typography } from '@mui/material'
import TrendingUpIcon from '@mui/icons-material/TrendingUp'
import TrendingDownIcon from '@mui/icons-material/TrendingDown'
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet'

function formatAmount(amount) {
    return new Intl.NumberFormat('en-In', {
        style: 'currency', currency: 'INR', maximumFractionDigits: 2
    }).format(Math.abs(amount))
}

const cards = (totalIncome, totalExpense, balance) => [
    {
        label: 'Total Income', value: totalIncome,
        icon: <TrendingUpIcon sx={{ fontSize: 20 }} />,
        color: '#16a34a', bg: '#f0fdf4', border: '#bbf7d0'
    },
    {
        label: 'Total Expense', value: totalExpense,
        icon: <TrendingDownIcon sx={{ fontSize: 20 }} />,
        color: '#dc2626', bg: '#fef2f2', border: '#fecaca'
    },
    {
        label: 'Balance', value: balance,
        icon: <AccountBalanceWalletIcon sx={{ fontSize: 20 }} />,
        color: balance >= 0 ? '#0e7490' : '#dc2626',
        bg: balance >= 0 ? '#ecfeff' : '#fef2f2',
        border: balance >= 0 ? '#a5f3fc' : '#fecaca'
    },
]

export default function SummaryCards({ totalIncome, totalExpense, balance }) {
    return (
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(3, 1fr)' }, gap: 2, mb: 3 }}>
            {cards(totalIncome, totalExpense, balance).map(( {label, value, icon, color, bg, border} ) => (
                <Box
                    key={label}
                    sx={{
                        bgcolor: bg,
                        p: { xs: 1.5, md: 2 },
                        borderRadius: 2,
                        flex: '1 1 250px',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: 1.5,
                        border: `1px solid ${border}`,
                    }}
                >
                    <Box sx={{
                        bgcolor: color + '18',
                        borderRadius: 1.5,
                        p: 1,
                        color,
                        display: 'flex',
                        flexShrink: 0
                    }}>
                        {icon}
                    </Box>
                    <Box>
                        <Typography variant="caption" color="text.secondary" display="block">
                            {label}
                        </Typography>
                        <Typography variant="h6" fontWeight={700} sx={{ color, lineHeight: 1.2, fontSize: { xs: '1rem', md: '1.15rem' } }}>
                            {formatAmount(value)}
                        </Typography>
                    </Box>
                </Box>
            ))}
        </Box>
    )
}