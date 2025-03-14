import {createApi, fetchBaseQuery} from '@reduxjs/toolkit/query/react';
import {baseUrl} from '../utils/utils';

const baseQuery = fetchBaseQuery({
  baseUrl,
});

export const globalApi = createApi({
    reducerPath: 'authApi',
    baseQuery,
    endpoints: builder => ({
      getCategories: builder.mutation({
        query: () => ({
          url: 'epron/categories',
          method: 'GET'
        }),
      }),
      getAllTypes: builder.mutation({
        query: () => ({
          url: 'epron/get_all_types',
          method: 'GET'
        }),
      }),
      createCategories: builder.mutation({
        query: (data) => ({
          url: 'epron/create_category',
          method: 'POST',
          body: data
        }),
      }),
      updateCategory: builder.mutation({
        query: (data) => ({
          url: `epron/update_category/${data.id}`,
          method: 'PUT',
          body: data.data,
        }),
      }),
      deleteCategory: builder.mutation({
        query: (id) => ({
          url: `epron/delete_category/${id}`,
          method: 'DELETE'
        }),
      }),
      getTypes: builder.mutation({
        query: (id) => ({
          url: `epron/get_all_category_types/${id}`,
          method: 'GET'
        }),
      }),
      createTypes: builder.mutation({
        query: (data) => ({
          url: 'epron/types',
          method: 'POST',
          body: data
        }),
      }),
      updateType: builder.mutation({
        query: (data) => ({
          url: `epron/update_subcategory/${data.id}`,
          method: 'PUT',
          body: data.data,
        }),
      }),
      deleteType: builder.mutation({
        query: (id) => ({
          url: `epron/delete_type/${id}`,
          method: 'DELETE'
        }),
      }),
      dashboardCount: builder.mutation({
        query: () => ({
          url: 'epron/dashboard-counts',
          method: 'GET'
        }),
      }),
      contact: builder.mutation({
        query: (data) => ({
          url: 'user/contactus',
          method: 'POST',
          body: data
        }),
      }),
    }),
  });
  
  export const {useGetCategoriesMutation, useCreateCategoriesMutation, useDeleteCategoryMutation, useUpdateCategoryMutation, useCreateTypesMutation, useUpdateTypeMutation, useGetTypesMutation, useDeleteTypeMutation, useDashboardCountMutation, useGetAllTypesMutation, useContactMutation} = globalApi;