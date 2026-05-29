import { createSlice } from '@reduxjs/toolkit';

const transactionSlice = createSlice({
  name: 'transactions',
  initialState: {
    filter: 'all',
    categoryFilter: 'all',
    dateFilter: 'all',
    sortOrder: 'desc',
    customStartDate: '',
    customEndDate: '',
  },
  reducers: {
    setFilter: (state, action) => { state.filter = action.payload },
    setCategoryFilter: (state, action) => { state.categoryFilter = action.payload },
    setDateFilter: (state, action) => { state.dateFilter = action.payload },
    setSortOrder: (state, action) => { state.sortOrder = action.payload },
    setCustomStartDate: (state, action) => { state.customStartDate = action.payload },
    setCustomEndDate: (state, action) => { state.customEndDate = action.payload },
    resetTransactionFilters: (state) => {
      state.filter = 'all';
      state.categoryFilter = 'all';
      state.dateFilter = 'all';
      state.sortOrder = 'desc';
      state.customStartDate = '';
      state.customEndDate = '';
    }
  },
});

export const { setFilter, setCategoryFilter, setDateFilter, setSortOrder, setCustomStartDate, setCustomEndDate, resetTransactionFilters } = transactionSlice.actions;
export default transactionSlice.reducer;