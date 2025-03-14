import {createApi, fetchBaseQuery} from '@reduxjs/toolkit/query/react';
import {baseUrl} from '../utils/utils';

const baseQuery = fetchBaseQuery({
  baseUrl,
});

export const authApi = createApi({
  reducerPath: 'authApi',
  baseQuery,
  endpoints: builder => ({
    registerUser: builder.mutation({
      query: data => ({
        url: 'access/user-reg',
        method: 'POST',
        body: data,
      }),
    }),
    loginUser: builder.mutation({
      query: data => ({
        url: 'access/user-login',
        method: 'POST',
        body: data,
      }),
    }),
    forgotPassword: builder.mutation({
      query: data => ({
        url: 'user/forgot-password',
        method: 'POST',
        body: data,
      }),
    }),
    resetPassword: builder.mutation({
      query: data => ({
        url: `user/reset-password/${data.token}`,
        method: 'POST',
        body: data.data,
      }),
    }),
    updatePassword: builder.mutation({
      query: data => ({
        url: 'user/update-password',
        method: 'PUT',
        body: data,
      }),
    }),
    verifyEmail: builder.mutation({
      query: data => ({
        url: `access/verify/${data}`,
        method: 'POST'
      }),
    }),
    sendVerifyToken: builder.mutation({
      query: data => ({
        url: `access/verify-token`,
        method: 'POST',
        body: data
      }),
    }),
  }),
});

export const {useRegisterUserMutation, useLoginUserMutation, useForgotPasswordMutation, useResetPasswordMutation, useUpdatePasswordMutation, useVerifyEmailMutation, useSendVerifyTokenMutation} = authApi;


// alert(JSON.stringify(data, null, 2));
// console.log(data);
// setSubmitting(false);