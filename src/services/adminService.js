import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { baseUrl } from "../utils/utils";
import { pageLimit } from "../utils/utils";

const baseQuery = fetchBaseQuery({
  baseUrl,
});

export const adminApi = createApi({
  reducerPath: "adminApi",
  baseQuery,
  endpoints: (builder) => ({
    getAllLoggedEquipment: builder.mutation({
      query: (data) => ({
        url: `epron/fetch-all-logged-equipments${
          data.pagination ? `?page=${data.page || 1}&limit=${pageLimit}` : ""
        }`,
        method: "GET",
      }),
    }),
    getAllLoggedEwaste: builder.mutation({
      query: (data) => ({
        url: `epron/get_all_ewastes${
          data.pagination ? `?page=${data.page || 1}&limit=${pageLimit}` : ""
        }`,
        method: "GET",
      }),
    }),
    getAllRecycleLogs: builder.mutation({
      query: (data) => ({
        url: `epron/recyclers-logged-waste-weight${
          data.pagination ? `?page=${data.page || 1}&limit=${pageLimit}` : ""
        }`,
        method: "GET",
      }),
    }),
    getAllRecycleLogsByRecycler: builder.mutation({
      query: (data) => ({
        url: `epron/recyclers-logged-waste-weight-by-userid/${data.id}${
          data.pagination ? `?page=${data.page || 1}&limit=${pageLimit}` : ""
        }`,
        method: "GET",
      }),
    }),
    getAllCollectionCentres: builder.mutation({
      query: () => ({
        url: `epron/all_collection_center`,
        method: "GET",
      }),
    }),
    getCollectionCentresByLocation: builder.mutation({
      query: (location) => ({
        url: `user/collection_by_location/${location}`,
        method: "GET",
      }),
    }),
    filterEquipment: builder.mutation({
      query: (data) => ({
        url: `epron/search-equipments-logged?page=1&limit=1000&search=${data.value}`,
        method: "GET",
      }),
    }),
    filterUsers: builder.mutation({
      query: (data) => ({
        url: `epron/search-users-name-email?page=1&limit=1000&search=${data.value}`,
        method: "GET",
      }),
    }),
    assignCenter: builder.mutation({
      query: (data) => ({
        url: "epron/asign_center_to_recycler",
        method: "PATCH",
        body: data,
      }),
    }),
    removeCenter: builder.mutation({
      query: (data) => ({
        url: "epron/remove_collection_center",
        method: "PATCH",
        body: data,
      }),
    }),
    approveDocuments: builder.mutation({
      query: (id) => ({
        url: `epron/approve-documents/${id}`,
        method: "PATCH",
        // body: data
      }),
    }),
    disapproveDocuments: builder.mutation({
      query: (id) => ({
        url: `epron/disapprove-documents/${id}`,
        method: "PATCH",
        // body: data
      }),
    }),
    updateAdminRole: builder.mutation({
      query: (data) => ({
        url: `epron/update-admin-role/${data.id}`,
        method: "PATCH",
        body: data.data
      }),
    }),
  }),
});

export const {
  useGetAllLoggedEquipmentMutation,
  useGetAllLoggedEwasteMutation,
  useGetAllRecycleLogsMutation,
  useGetAllCollectionCentresMutation,
  useFilterEquipmentMutation,
  useAssignCenterMutation,
  useRemoveCenterMutation,
  useGetCollectionCentresByLocationMutation,
  useFilterUsersMutation,
  useApproveDocumentsMutation,
  useDisapproveDocumentsMutation,
  useGetAllRecycleLogsByRecyclerMutation,
  useUpdateAdminRoleMutation,
} = adminApi;
