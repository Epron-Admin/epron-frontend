import {createApi, fetchBaseQuery} from '@reduxjs/toolkit/query/react';
import {baseUrl} from '../utils/utils';

const baseQuery = fetchBaseQuery({
  baseUrl,
});

export const paymentApi = createApi({
  reducerPath: 'paymentApi',
  baseQuery,
  endpoints: builder => ({
    initTransaction: builder.mutation({
      query: data => ({
        url: 'epron/payment_advice',
        method: 'POST',
        body: data,
      }),
    }),
    verifyTransaction: builder.mutation({
      query: reference => ({
        url: `epron/verify_payment/${reference}`,
        method: 'GET',
      }),
    }),
    updateTransaction: builder.mutation({
      query: data => ({
        url: `user/update-payment-status/${data.pin}/${data.reference}`,
        method: 'PATCH',
      }),
    }),
    updateBulkTransaction: builder.mutation({
      query: data => ({
        url: `user/update-bulk-payments/${data.pin}/${data.reference}`,
        method: 'PATCH',
      }),
    }),
  }),
});

export const {useInitTransactionMutation, useVerifyTransactionMutation, useUpdateTransactionMutation, useUpdateBulkTransactionMutation} = paymentApi;