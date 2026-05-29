import React, { useState } from 'react'
import { flexRender, useReactTable, getCoreRowModel, getSortedRowModel, getFilteredRowModel, getPaginationRowModel } from '@tanstack/react-table'
import { Paper, MenuItem, IconButton, Typography, Input, Table, TableHead, TableBody, TableRow, TableCell, Box, TextField } from '@mui/material'
import { useBudget } from '../hooks/useBudget.js'
import { useSelector, useDispatch } from 'react-redux'
import { setDateFilter, setCustomStartDate, setCustomEndDate } from '../store/slices/transactionSlice.js'
import { ArrowLeft, ArrowRight } from '@mui/icons-material'
import { useGetCategoriesQuery } from '../store/api.js'


export default function TransactionTable({ rows = [], columns = [] }) {

    const dispatch = useDispatch()
    const { dateFilter, customStartDate, customEndDate } = useSelector(state => state.transactions)

    const { data: categories = [] } = useGetCategoriesQuery()

    const { filteredTransactions } = useBudget(rows, 'all', 'all', dateFilter, 'desc', customStartDate, customEndDate)

    const [sorting, setSorting] = useState([])
    const [columnFilters, setColumnFilters] = useState([])
    const [globalFilter, setGlobalFilter] = useState('')
    const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 10 })

    const table = useReactTable({
        data: filteredTransactions,
        columns,
        state: { sorting, columnFilters, globalFilter, pagination },
        enableSortingRemoval: false,
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        onGlobalFilterChange: setGlobalFilter,
        onPaginationChange: setPagination,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
    })

    return (
        <Paper elevation={1} sx={{ width: '100%', mt: 3, p: 2, overflowX: 'auto' }}>

            {/* global-filters */}
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: 'auto auto auto 1fr' },
            gap: 1.5, mb: 2, alignItems: 'center', }}>
                <TextField
                    label="Search"
                    value={globalFilter}
                    onChange={e => setGlobalFilter(e.target.value)}
                    size="small"
                    variant="outlined"
                    sx={{ minWidth: 240 }}
                />

                <TextField
                    select
                    label="Category"
                    size="small"
                    sx={{ minWidth: 160 }}
                    value={table.getColumn('category')?.getFilterValue() ?? ''}
                    onChange={(e) => {
                        const val = e.target.value;
                        table.getColumn('category')?.setFilterValue(val === '' ? undefined : val);
                    }}
                >
                    <MenuItem value="">All Categories</MenuItem>
                    {categories.map((c) => (
                        <MenuItem key={c.id} value={c.name}>{c.name}</MenuItem>
                    ))}
                </TextField>

                <TextField
                    select
                    label="Date Filter"
                    size="small"
                    sx={{ minWidth: 160 }}
                    value={dateFilter || 'all'}
                    onChange={(e) => dispatch(setDateFilter(e.target.value))}
                >
                    <MenuItem value="all">All Time</MenuItem>
                    <MenuItem value="today">Today</MenuItem>
                    <MenuItem value="thisMonth">This Month</MenuItem>
                    <MenuItem value="custom">Custom Range</MenuItem>
                </TextField>

                {dateFilter === 'custom' && (
                    <Box sx={{ display: 'flex', gap: 1 }}>
                        <TextField
                            type="date"
                            label="Start Date"
                            size="small"
                            slotProps={{ inputLabel: { shrink: true } }}
                            value={customStartDate || ''}
                            onChange={(e) => dispatch(setCustomStartDate(e.target.value))}
                        />
                        <TextField
                            type="date"
                            label="End Date"
                            size="small"
                            slotProps={{ inputLabel: { shrink: true } }}
                            value={customEndDate || ''}
                            onChange={(e) => dispatch(setCustomEndDate(e.target.value))}
                        />
                    </Box>
                )}

                {/* pagination */}
                <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', justifyContent: { xs: 'center', md: 'flex-end' }, ml: 'auto' }}>
                    <IconButton
                        onClick={() => table.previousPage()}
                        disabled={!table.getCanPreviousPage()}
                        size="small"
                    >
                        <ArrowLeft fontSize="small" />
                    </IconButton>
                    <Typography variant="caption" sx={{ color: 'text.primary', whitespace: 'nowrap' }}>
                        Page {table.getState().pagination.pageIndex + 1}/{table.getPageCount()}
                    </Typography>
                    <IconButton
                        onClick={() => table.nextPage()}
                        disabled={!table.getCanNextPage()} size="small"
                    >
                        <ArrowRight fontSize="small" />
                    </IconButton>
                </Box>
            </Box>

            <Table sx={{ width: '100%', minWidth: 700, tableLayout: 'auto' }}>
                <TableHead sx={{ backgroundColor: '#f4f6f8' }}>
                    {table.getHeaderGroups().map(headerGroup => (
                        <React.Fragment key={headerGroup.id}>
                            <TableRow>
                                {headerGroup.headers.map(header => {
                                    // const isSortable = header.column.getCanSort();
                                    return (
                                        <TableCell
                                            key={header.id}
                                            onClick={header.column.getCanSort() ? header.column.getToggleSortingHandler() : undefined}
                                            sx={{ fontWeight: 700, color: '#455a64', borderBottom: '2px solid #e0e0e0', py: 1.5, cursor: header.column.getCanSort() ? 'pointer' : 'default', userSelect: 'none', whiteSpace: 'nowrap', '&:hover': header.column.getCanSort() ? { bgcolor: '#f0f4f8' } : {}, }} >
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                                {flexRender(header.column.columnDef.header, header.getContext())}
                                                {header.column.getCanSort() && (
                                                    <Box sx={{ display: 'flex', flexDirection: 'column', ml: 0.5 }}>
                                                        <Typography sx={{ fontSize: 10, lineHeight: 1, color: header.column.getIsSorted() === 'asc' ? '#0e7490' : '#bdbdbd' }}>▲</Typography>
                                                        <Typography sx={{ fontSize: 10, lineHeight: 1, color: header.column.getIsSorted() === 'desc' ? '#0e7490' : '#bdbdbd' }}>▼</Typography>
                                                    </Box>
                                                )}
                                            </Box>
                                        </TableCell>
                                    );
                                })}
                            </TableRow>

                            <TableRow sx={{ '& td': { borderBottom: '2px solid #e0e0e0' } }}>
                                {headerGroup.headers.map(header => (
                                    <TableCell key={`filter-${header.id}`} sx={{ py: 0.5, px: 1 }}>
                                        {header.column.getCanFilter() ? (
                                            <Input
                                                placeholder="Search"
                                                size="small"
                                                disableUnderline
                                                value={(header.column.getFilterValue()) ?? ''}
                                                onChange={e => header.column.setFilterValue(e.target.value)}
                                                sx={{
                                                    width: '100%',
                                                    fontSize: '0.8125rem',
                                                    backgroundColor: '#ffffff',
                                                    border: '1px solid #ced4da',
                                                    borderRadius: '4px',
                                                    padding: '2px 6px',
                                                    color: '#000000',
                                                    '& input': {
                                                        color: '#000000',
                                                    },
                                                    '&:focus-within': {
                                                        borderColor: 'primary.main',
                                                        boxShadow: '0 0 0 2px rgba(25, 118, 210, 0.2)'
                                                    }
                                                }}
                                            />
                                        ) : null}
                                    </TableCell>
                                ))}
                            </TableRow>
                        </React.Fragment>
                    ))}
                </TableHead>

                <TableBody>
                    {table.getRowModel().rows.map(row => (
                        <TableRow key={row.id} hover>
                            {row.getVisibleCells().map(cell => (
                                <TableCell key={cell.id} sx={{ py: 1.5 }}>
                                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                </TableCell>
                            ))}
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </Paper>
    )
}