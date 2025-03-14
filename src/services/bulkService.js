import {createApi, fetchBaseQuery} from '@reduxjs/toolkit/query/react';
import {baseUrl} from '../utils/utils';

const baseQuery = fetchBaseQuery({
  baseUrl,
});

export const bulkApi = createApi({
  reducerPath: 'bulkApi',
  baseQuery,
  endpoints: builder => ({
    uploadEquipment: builder.mutation({
      query: data => ({
        url: 'user/excel-equipment',
        method: 'POST',
        body: data,
      }),
    }),
    uploadEwaste: builder.mutation({
      query: data => ({
        url: 'centers/excel-bulk-ewaste',
        method: 'POST',
        body: data,
      }),
    }),
  }),
});

export const {useUploadEquipmentMutation, useUploadEwasteMutation} = bulkApi;