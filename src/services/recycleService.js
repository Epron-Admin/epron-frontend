import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { baseUrl, pageLimit } from "../utils/utils";

const baseQuery = fetchBaseQuery({
  baseUrl,
});

export const recycleApi = createApi({
  reducerPath: "authApi",
  baseQuery,
  endpoints: (builder) => ({
    logEwasteWeight: builder.mutation({
      query: (data) => ({
        url: "recyclers/log_ewaste_weight",
        method: "POST",
        body: data,
      }),
    }),
    getloggedEwasteWeight: builder.mutation({
      query: (data) => ({
        url: `recyclers/recycler-logged-waste-weight/${data.id}${data.pagination ? `?page=${data.page || 1}&limit=${pageLimit}` : ''}`,
        method: "GET",
      }),
    }),
    getAssignedCollectionCentres: builder.mutation({
      query: (id) => ({
        url: `recyclers/recycler-collection-centers/${id}`,
        method: "GET",
      }),
    }),
    getEwastesReadyForPickup: builder.mutation({
      query: (data) => ({
        url: `recyclers/center-ewastes-ready-pickup/${data.id}?page=${data.page || 1}&limit=${pageLimit}&ready_pickup=true`,
        method: "GET" ,
      }),
    }),
    pickupWaste: builder.mutation({
      query: (data) => ({
        url: "recyclers/picked-up",
        method: "PATCH",
        body: data,
      }),
    }),
  }),
});

export const {
  useLogEwasteWeightMutation,
  useGetloggedEwasteWeightMutation,
  useGetAssignedCollectionCentresMutation,
  useGetEwastesReadyForPickupMutation,
  usePickupWasteMutation,
} = recycleApi;
