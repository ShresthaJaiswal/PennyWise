import { useGetTransactionsQuery } from '../store/api'
import { Box, Typography } from '@mui/material'
import TransactionTable from '../components/TransactionTable.jsx'
import { useState, useMemo } from 'react'
import { createColumnHelper } from '@tanstack/react-table'
import RowActions from '../components/RowActions.jsx'
import { useSelector } from 'react-redux'

const columnHelper = createColumnHelper()

export default function ExpenseLogs() {
    const user = useSelector(state => state.auth.user)
    const { data: transactions = [] } = useGetTransactionsQuery(user?.id)
    const [globalFilter, setGlobalFilter] = useState('')

    const columns = useMemo(() => [
        columnHelper.accessor('id', {
            header: 'ID',
            sortingFn: 'alphanumeric',
        }),
        columnHelper.display({
            id: 'actions',
            header: 'Actions',
            enableSorting: false,
            cell: ({ row }) => <RowActions transactionId={row.original.id} />
        }),
        columnHelper.accessor('type', {
            header: 'Type',
            sortingFn: 'text',
        }),
        columnHelper.accessor('category', {
            header: 'Category',
            sortingFn: 'text',
        }),
        columnHelper.accessor('amount', {
            header: 'Amount',
            sortingFn: 'basic',
            cell: info => {
                const val = info.getValue();
                return `₹${(val != null ? val : 0).toFixed(2)}`;
            },
        }),
        columnHelper.accessor('description', {
            header: 'Description',
            sortingFn: 'text',
        }),
        columnHelper.accessor('createdAt', {
            header: 'Created At',
            sortingFn: 'datetime',
            cell: info => new Date(info.getValue()).toLocaleDateString(),
        }),
        columnHelper.accessor('status', {
            header: 'Status',
            sortingFn: 'basic',
        }),
    ], [])


    return (
        <Box sx={{ p: 4, maxWidth: 1200, mx: 'auto' }}>
            <Typography variant="h4" gutterBottom mb={3}>
                Expense Logs
            </Typography>
            <TransactionTable rows={transactions} columns={columns} globalFilter={globalFilter} setGlobalFilter={setGlobalFilter} />
        </Box>
    )
}