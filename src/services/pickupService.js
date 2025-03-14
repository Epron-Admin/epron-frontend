import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { baseUrl, pageLimit } from "../utils/utils";

const baseQuery = fetchBaseQuery({
  baseUrl,
});

export const pickupApi = createApi({
  reducerPath: "authApi",
  baseQuery,
  endpoints: (builder) => ({
    requestPickup: builder.mutation({
      query: (data) => ({
        url: "pickup/request-pickup",
        method: "POST",
        body: data,
      })
    }),
    getAllPickups: builder.mutation({
      query: (data) => ({
        url: `pickup/pickups${data.pagination ? `?page=${data.page || 1}&limit=${pageLimit}` : ''}`,
        method: "GET",
      })
    }),
    getAllPickupsByAcceptance: builder.mutation({
      query: (data) => ({
        url: `epron/pickups_based_on_acceptance${data.pagination ? `?page=${data.page || 1}&limit=${pageLimit}` : ''}&accepted=${data.status}`,
        method: "GET",
      })
    }),
    getAllPickupsByLocation: builder.mutation({
      query: (data) => ({
        url: `pickup/pickups/${data.location}`,
        method: "GET",
      })
    }),
    getAllUnacceptedPickupsByLocation: builder.mutation({
      query: (data) => ({
        url: `pickup/unaccepted_pickups_only/${data.location}?page=${data.page || 1}&limit=${pageLimit}`,
        method: "GET",
      })
    }),
    getAllUserAcceptedPickups: builder.mutation({
      query: (data) => ({
        url: `pickup/accepted_pickup_byuser/${data.id}/${data.location}?page=${data.page || 1}&limit=${pageLimit}`,
        method: "GET",
      })
    }),
    acceptPickup: builder.mutation({
      query: (data) => ({
        url: `centers/accept_pickup`,
        method: "PATCH",
        body: data,
      })
    }),
    completePickup: builder.mutation({
      query: (data) => ({
        url: `centers/mark-pickup-completed`,
        method: "PATCH",
        body: data,
      })
    }),
  }),
});

export const {useRequestPickupMutation, useGetAllPickupsMutation, useGetAllPickupsByAcceptanceMutation, useGetAllPickupsByLocationMutation, useGetAllUnacceptedPickupsByLocationMutation, useGetAllUserAcceptedPickupsMutation, useAcceptPickupMutation, useCompletePickupMutation} = pickupApi;