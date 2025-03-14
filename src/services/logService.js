import {createApi, fetchBaseQuery} from '@reduxjs/toolkit/query/react';
import {baseUrl, pageLimit} from '../utils/utils';

const baseQuery = fetchBaseQuery({
  baseUrl,
});

export const logApi = createApi({
  reducerPath: 'logApi',
  baseQuery,
  endpoints: builder => ({
    getLoggedEquipment: builder.mutation({
      query: (data) => ({
        url: `user/logged_equiptment_by_user_id/${data.id}${data.pagination ? `?page=${data.page || 1}&limit=${pageLimit}` : ''}`,
        method: 'GET'
      }),
    }),
    logSingleEquipment: builder.mutation({
      query: data => ({
        url: 'user/log-one-equipment',
        method: 'POST',
        body: data,
      }),
    }),
    updateSingleEquipment: builder.mutation({
      query: (data) => ({
        url: `user/update-log-byid/${data.id}`,
        method: 'PUT',
        body: data.data,
      }),
    }),
    deleteSingleEquipment: builder.mutation({
      query: id => ({
        url: `user/delete-log/${id}`,
        method: 'DELETE'
      }),
    }),
    getLoggedEwaste: builder.mutation({
      query: (id) => ({
        url: `user/centers/fetch_ewaste_userid/${id}`,
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
    uploadCsv: builder.mutation({
      query: data => ({
        url: 'upload/upload-csv',
        method: 'POST',
        body: data,
      }),
    })
  }),
});

export const {useLogSingleEquipmentMutation, useUpdateSingleEquipmentMutation, useDeleteSingleEquipmentMutation, useGetLoggedEquipmentMutation, useUploadCsvMutation} = logApi;