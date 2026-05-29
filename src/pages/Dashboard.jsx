import { useState } from 'react'
import { useBudget } from '../hooks/useBudget'
import { useSelector, useDispatch } from 'react-redux'
import { useGetTransactionsQuery } from '../store/api'
import { Box, Select, MenuItem, Typography, Alert } from '@mui/material'
import SummaryCards from '../components/SummaryCards'
import { setDateFilter, setCustomStartDate, setCustomEndDate } from '../store/slices/transactionSlice'
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts'

// function BarChart({ data }) {
//     if (!data || data.length === 0) {
//         return <Typography variant="body2" sx={{ textAlign: 'center', color: 'text.secondary', py: 4 }}>No data yet.</Typography>
//     }

//     const max = Math.max(...data.map(d => Math.max(d.income, d.expense)), 1)

//     return (
//         <Box sx={{ display: 'flex', alignItems: 'flex-end', gap: 1.5, height: 160, pt: 2, maxWidth: 500 }}>
//             {data.map((d) => (
//                 <Box key={d.month} sx={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0.5 }}>
//                     <Box sx={{ width: '100%', display: 'flex', gap: 0.5, alignItems: 'flex-end', height: 128 }}>
//                         <Box sx={{ flex: 1, height: `${(d.income / max) * 100}%`, bgcolor: 'success.main', borderRadius: '4px 4px 0 0', transition: 'height 0.7s' }} title={`Income: ₹${d.income}`} />
//                         <Box sx={{ flex: 1, height: `${(d.expense / max) * 100}%`, bgcolor: 'error.main', borderRadius: '4px 4px 0 0', transition: 'height 0.7s' }} title={`Expense: ₹${d.expense}`} />
//                     </Box>
//                     <Typography variant="caption" sx={{ fontFamily: 'monospace' }}>{d.month}</Typography>
//                 </Box>
//             ))}
//         </Box>
//     )
// }

const CustomTooltip = ({ active, payload, label }) => {
    if (!active || !payload?.length) return null
    return (
        <Box sx={{ bgcolor: 'white', border: '1px solid #e0e0e0', borderRadius: 2, p: 1.5, boxShadow: 2 }}>
            <Typography variant="body2" fontWeight={600} mb={0.5}>{label}</Typography>
            {payload.map(entry => (
                <Typography key={entry.name} variant="body2" sx={{ color: entry.color }}>
                    {entry.name}: ₹{entry.value.toLocaleString('en-IN')}
                </Typography>
            ))}
        </Box>
    )
}

function SpendingChart({ data }) {
    if (!data?.length) return (
        <Typography variant="body2" sx={{ textAlign: 'center', color: 'text.secondary', py: 4 }}>No data yet.</Typography>
    )
    return (
        <Box sx={{ overflowX: 'auto', width: '100%' }}>
            <Box sx={{ minWidth: 500 }}>
                <ResponsiveContainer width="100%" height={240}>
                    <BarChart data={data} margin={{ top: 28, right: 16, left: 0, bottom: 0 }}>
                        <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                        <YAxis tick={{ fontSize: 12 }} tickFormatter={v => `₹${v.toLocaleString('en-IN')}`} />
                        <Tooltip content={<CustomTooltip />} />
                        <Legend />
                        <Bar dataKey="income" name="Income" fill="#22c55e" radius={[4, 4, 0, 0]} />
                        <Bar dataKey="expense" name="Expense" fill="#ef4444" radius={[4, 4, 0, 0]} />
                    </BarChart>
                </ResponsiveContainer>
            </Box>
        </Box>
    )
}

export default function Dashboard() {
    const { user } = useSelector(state => state.auth)
    const { data: transactions = [] } = useGetTransactionsQuery(user?.id)

    const [dateError, setDateError] = useState('')

    const dispatch = useDispatch()
    const { filter, categoryFilter, dateFilter, sortOrder, customStartDate, customEndDate } = useSelector(state => state.transactions)

    const { totalIncome, totalExpense, balance, monthlyData } = useBudget(transactions, filter, categoryFilter, dateFilter, sortOrder, customStartDate, customEndDate)

    return (
        <Box sx={{ p: { xs: 4, md: 3 }, maxWidth: 1100, mx: 'auto' }}>
            <Typography variant="h4" gutterBottom mb={3}>Dashboard</Typography>

            <SummaryCards totalIncome={totalIncome} totalExpense={totalExpense} balance={balance} />

            <Box sx={{ mt: 4 }}>
                <Typography variant="h6" fontWeight={600} mb={2}>
                    Monthly Trends
                </Typography>
                <Select size="small"
                    value={dateFilter || ''}
                    onChange={(e) => dispatch(setDateFilter(e.target.value))}
                    displayEmpty
                    sx={{ mb: 2, minWidth: 140, bgcolor: 'background.paper', color: 'black' }}
                >
                    <MenuItem value="all">All</MenuItem>
                    <MenuItem value="week">Last Week</MenuItem>
                    <MenuItem value="month">Last Month</MenuItem>
                    <MenuItem value="6months">Last 6 Months</MenuItem>
                    <MenuItem value="year">Last Year</MenuItem>
                    <MenuItem value="custom">Custom Date</MenuItem>
                </Select>

                {dateFilter === 'custom' && (
                    <Box sx={{ mt: 2 }}>
                        <Typography variant="body2" gutterBottom>Custom Date Range</Typography>

                        {dateError && <Alert severity="error" sx={{ mb: 2, py: 0 }}>{dateError}</Alert>}

                        <Box sx={{ display: 'flex', gap: 2 }}>
                            <input
                                type="date"
                                value={customStartDate}
                                onChange={(e) => {
                                    if (customEndDate && e.target.value > customEndDate) {
                                        setDateError('Start date cannot be after end date.')
                                        return
                                    }
                                    setDateError('')
                                    dispatch(setCustomStartDate(e.target.value))
                                }}
                            />
                            <input
                                type="date"
                                value={customEndDate}
                                onChange={(e) => {
                                    if (customStartDate && e.target.value < customStartDate) {
                                        setDateError('End date cannot be before start date.')
                                        return
                                    }
                                    setDateError('')
                                    dispatch(setCustomEndDate(e.target.value))
                                }}
                            />
                        </Box>
                    </Box>
                )}
                <SpendingChart data={monthlyData} />
            </Box>
        </Box>
    )
}