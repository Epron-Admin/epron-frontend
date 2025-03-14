import {createApi, fetchBaseQuery} from '@reduxjs/toolkit/query/react';
import {baseUrl} from '../utils/utils';
import { pageLimit } from "../utils/utils";

const baseQuery = fetchBaseQuery({
  baseUrl,
});

export const ewasteApi = createApi({
  reducerPath: 'ewasteApi',
  baseQuery,
  endpoints: builder => ({
    getLoggedEwaste: builder.mutation({
      query: (data) => ({
        url: `centers/fetch_ewaste_userid/${data.id}${data.pagination ? `?page=${data.page || 1}&limit=${pageLimit}` : ''}`,
        method: 'GET'
      }),
    }),
    logSingleEwaste: builder.mutation({
      query: data => ({
        url: 'centers/log-one-ewaste',
        method: 'POST',
        body: data,
      }),
    }),
    deleteSingleEwaste: builder.mutation({
      query: id => ({
        url: `centers/delete_ewaste/${id}`,
        method: 'DELETE'
      }),
    }),
    updateSingleEwaste: builder.mutation({
      query: (data) => ({
        url: `user/update-log/${data.id}`,
        method: 'PUT',
        body: data.data,
      }),
    }),
    readyForPickup: builder.mutation({
      query: (data) => ({
        url: `/centers/ready-for-pickup`,
        method: "PATCH",
        body: data,
      })
    }),
    uploadCsv: builder.mutation({
      query: data => ({
        url: 'upload/upload-csv',
        method: 'POST',
        body: data,
      }),
    })
  }),
});

export const {useLogSingleEwasteMutation, useUpdateSingleEwasteMutation, useDeleteSingleEwasteMutation, useGetLoggedEwasteMutation, useUploadCsvMutation, useReadyForPickupMutation} = ewasteApi;