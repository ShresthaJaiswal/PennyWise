import { useMemo } from 'react'

export function useBudget(transactions = [], filter = 'all', categoryFilter = 'all', dateFilter = 'all', sortOrder = 'desc', customStartDate = '', customEndDate = '') {

  const totalIncome = useMemo(() => {
    return transactions.filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0)
  }, [transactions])

  const totalExpense = useMemo(() => {
    return transactions.filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0)
  }, [transactions])

  const balance = useMemo(() => totalIncome - totalExpense, [totalIncome, totalExpense])

  const filteredTransactions = useMemo(() => {

    const now = new Date()

    return transactions.filter(
      t => (filter === 'all' || t.type === filter))
      .filter(t => (categoryFilter === 'all' || t.category === categoryFilter))
      .filter(t => {
        if (dateFilter === 'all') return true
        const txDate = new Date(t.createdAt)
        if (dateFilter === 'today') {
          return txDate.toDateString() === now.toDateString()
        }
        if (dateFilter === 'week') {
          const weekAgo = new Date()
          weekAgo.setDate(now.getDate() - 7)
          return txDate >= weekAgo
        }
        if (dateFilter === 'month') {
          return (
            txDate.getMonth() === now.getMonth() &&
            txDate.getFullYear() === now.getFullYear()
          )
        }
        if (dateFilter === '6months') {
          const sixMonthsAgo = new Date()
          sixMonthsAgo.setMonth(now.getMonth() - 6)
          return txDate >= sixMonthsAgo
        }
        if (dateFilter === 'year') {
          return txDate.getFullYear() === now.getFullYear()
        }
        if (dateFilter === 'custom') {
          if (!customStartDate || !customEndDate) return true
          const start = new Date(customStartDate)
          const end = new Date(customEndDate)
          end.setHours(23, 59, 59, 999)
          return txDate >= start && txDate <= end
        }
        return true
      })
      .sort((a, b) => {
        const dateA = new Date(a.createdAt)
        const dateB = new Date(b.createdAt)
        return sortOrder === 'desc' ? dateB - dateA : dateA - dateB
      })
  }, [transactions, filter, categoryFilter, dateFilter, sortOrder, customStartDate, customEndDate])

  const categoryBreakdown = useMemo(() => {
    const breakdown = {}
    transactions
      .filter(t => t.type === 'expense')
      .forEach(t => {
        breakdown[t.category] = (breakdown[t.category] || 0) + t.amount
      })
    return Object.entries(breakdown)
      .map(([category, amount]) => ({ category, amount }))
      .sort((a, b) => b.amount - a.amount)
  }, [transactions])

  const monthlyData = useMemo(() => {
    const map = {}
    filteredTransactions.forEach(t => {
      const date = new Date(t.createdAt)
      if (isNaN(date)) return 
      
      const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
      if (!map[key]) map[key] = { month: key, income: 0, expense: 0 }
      if (t.type === 'income') map[key].income += t.amount
      else map[key].expense += t.amount
    })
    return Object.values(map).sort((a, b) => a.month.localeCompare(b.month))
  }, [filteredTransactions])

  return { totalIncome, totalExpense, balance, filteredTransactions, categoryBreakdown, monthlyData }
}