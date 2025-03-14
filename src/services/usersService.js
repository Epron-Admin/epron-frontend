import {createApi, fetchBaseQuery} from '@reduxjs/toolkit/query/react';
import {baseUrl, pageLimit} from '../utils/utils';

const baseQuery = fetchBaseQuery({
  baseUrl,
});

export const usersApi = createApi({
    reducerPath: 'usersApi',
    baseQuery,
    endpoints: builder => ({
      getAllUsers: builder.mutation({
        query: (data) => ({
          url: `epron/all_users${data.pagination ? `?page=${data.page || 1}&limit=${pageLimit}` : ''}`,
          method: 'GET'
        }),
      }),
      getUsersByRole: builder.mutation({
        query: (data) => ({
          url: `user/find_user_by_role/${data}`,
          method: 'GET',
        }),
      }),
      getAdminUsers: builder.mutation({
        query: () => ({
          url: "epron/admin_users",
          method: 'GET'
        }),
      }),
      addAdminUser: builder.mutation({
        query: data => ({
          url: 'epron/user-reg',
          method: 'POST',
          body: data,
        }),
      }),
      activateUser: builder.mutation({
        query: id => ({
          url: `epron/unblock_user/${id}`,
          method: 'PATCH',
        }),
      }),
      deactivateUser: builder.mutation({
        query: id => ({
          url: `epron/block_user/${id}`,
          method: 'PATCH',
        }),
      }),
      editUser: builder.mutation({
        query: id => ({
          url: `user/edit-profile/${id}`,
          method: 'PUT',
        }),
      }),
      getUser: builder.mutation({
        query: id => ({
          url: `user/user/${id}`,
          method: 'GET',
        }),
      }),
      getAllCollectionCentres: builder.mutation({
        query: (data) => ({
          url: `centers/user_centers/${data}`,
          method: 'GET',
        }),
      }),
    }),
  });
  
  export const {useGetAllUsersMutation, useGetUsersByRoleMutation ,useGetAdminUsersMutation, useAddAdminUserMutation, useActivateUserMutation, useDeactivateUserMutation, useEditUserMutation, useGetAllCollectionCentresMutation} = usersApi;