import { useGetTransactionsQuery } from '../store/api'
import { useBudget } from '../hooks/useBudget.js'
import { Box, Typography, Paper } from '@mui/material'
import { useMemo } from 'react'
// import { blue, purple, orange, teal, yellow, cyan } from '@mui/material/colors'
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { useSelector } from 'react-redux'

const COLORS = ['#0e7490', '#7c3aed', '#f97316', '#0d9488', '#ca8a04', '#06b6d4']

const CustomTooltip = ({ active, payload }) => {
    if (!active || !payload?.length) return null
    return (
        <Box sx={{ bgcolor: 'white', border: '1px solid #e0e0e0', borderRadius: 2, p: 1.5, boxShadow: 2 }}>
            <Typography variant="body2" fontWeight={600}>{payload[0].name}</Typography>
            <Typography variant="body2">₹{payload[0].value.toLocaleString('en-IN')}</Typography>
            <Typography variant="body2" color="text.secondary">{payload[0].payload.percentage}%</Typography>
        </Box>
    )
}

function CategoryBreakdown({ data }) {

    const total = useMemo(() => {
        if (!data?.length) return (
            <Typography variant="body2" sx={{ textAlign: 'center', color: 'text.secondary', py: 4 }}>
                No expense data yet.
            </Typography>
        )
        return data.reduce((sum, d) => sum + d.amount, 0)
    }, [data])

    const withPercentages = useMemo(() => {
        if (!data) return [];

        return data.map(d => ({ ...d, percentage: ((d.amount / total) * 100).toFixed(1) }))
    }, [data, total])

    return (
        <ResponsiveContainer width="100%" height={350}>
            <PieChart>
                <Pie data={withPercentages} dataKey="amount" nameKey="category" cx="50%" cy="50%" outerRadius="70%" label={false} labelLine={false}>
                    {withPercentages.map((_, i) => (
                        <Cell key={i} fill={COLORS[i % COLORS.length]} />
                    ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
                <Legend />
            </PieChart>
        </ResponsiveContainer>
    )
}

export default function Analytics() {
    const { user } = useSelector(state => state.auth)
    const { data: transactions = [] } = useGetTransactionsQuery(user?.id)

    const { categoryBreakdown } = useBudget(transactions)

    return (
        <Box sx={{ p: { xs: 4, md: 3 }, maxWidth: 1100, mx: 'auto' }}>
            <Typography variant="h5" fontWeight={700} mb={3}>
                Category-wise Analytics
            </Typography>
            <Paper elevation={0} sx={{ border: '1px solid #e2e8f0', borderRadius: 3, p: { xs: 2, md: 3 } }}>
                {/* Header row */}
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3, flexWrap: 'wrap', gap: 1 }}>
                    <Box>
                        <Typography variant="h6" fontWeight={600}>Expense Breakdown</Typography>
                    </Box>
                    <Box sx={{ bgcolor: '#fef2f2', border: '1px solid #fecaca', borderRadius: 2, px: 2, py: 0.75 }}>
                        <Typography variant="body2" fontWeight={600} color="error.main">
                            {categoryBreakdown.length} categories
                        </Typography>
                    </Box>
                </Box>

                <CategoryBreakdown data={categoryBreakdown} />
            </Paper>
        </Box>
    )
}