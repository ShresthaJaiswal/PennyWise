import { configureStore } from '@reduxjs/toolkit';
import { api } from './api';
import transactionReducer from './slices/transactionSlice';
import authReducer from './slices/authSlice';

export const store = configureStore({
  reducer: {
    [api.reducerPath]: api.reducer,
    transactions: transactionReducer,
    auth: authReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(api.middleware),
});