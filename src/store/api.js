import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

export const api = createApi({
  reducerPath: 'api',
  tagTypes: ['Transactions'],
  baseQuery: fetchBaseQuery({
    baseUrl: 'http://localhost:3002',
    prepareHeaders: (headers, { getState }) => {
      const token = getState().auth.token
      if (token) headers.set('Authorization', `Bearer ${token}`)
      return headers
    }
  }),

  endpoints: (builder) => ({

    register: builder.mutation({
      query: (body) => ({ url: '/register', method: 'POST', body })
    }),
    login: builder.mutation({
      query: (body) => ({ url: '/login', method: 'POST', body })
    }),
    getTransactions: builder.query({
      query: (userId) => `/transactions?userId=${userId}`,
      providesTags: ['Transactions'],
    }),
    getTransactionById: builder.query({
      query: (id) => `/transactions/${id}`,
      providesTags: (result, error, id) => [{ type: 'Transactions', id }],
    }),
    addTransaction: builder.mutation({
        query: (transaction) => ({
            url: '/transactions',
            method: 'POST',
            body: transaction,  // userId must already be inside transaction
        }),
        invalidatesTags: ['Transactions'],
    }),
    updateTransaction: builder.mutation({
      query: ({ id, ...transaction }) => ({
        url: `/transactions/${id}`,
        method: 'PUT',
        body: transaction,
      }),
      invalidatesTags: ['Transactions'],
    }),
    deleteTransaction: builder.mutation({
      query: (id) => ({
        url: `/transactions/${id}`,
        method: 'PATCH',
        body: { status: '0' }
      }),
      invalidatesTags: ['Transactions'],
    }),

    getTypes: builder.query({
      query: () => '/types',
    }),
    getCategories: builder.query({
      query: () => '/categories',
    }),
  }),
})

export const {
  useRegisterMutation,
  useLoginMutation,
  useGetTransactionsQuery,
  useGetTransactionByIdQuery,
  useAddTransactionMutation,
  useUpdateTransactionMutation,
  useDeleteTransactionMutation,
  useGetTypesQuery,
  useGetCategoriesQuery
} = api