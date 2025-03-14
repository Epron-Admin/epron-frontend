import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { baseUrl } from "../utils/utils";

const baseQuery = fetchBaseQuery({
  baseUrl,
});

export const locationApi = createApi({
  reducerPath: "locationApi",
  baseQuery,
  endpoints: (builder) => ({
    fetchCountries: builder.mutation({
      query: () => ({
        url: "user/countries",
        method: "GET",
      }),
    }),
    fetchStates: builder.mutation({
      query: (country) => ({
        url: `user/states/${country}`,
        method: "GET",
      }),
    }),
    fetchLgas: builder.mutation({
      query: (data) => ({
        url: `user/naija_lgas/${data.state}`,
        method: "GET",
      }),
    }),
    fetchCities: builder.mutation({
      query: (data) => ({
        url: `user/cities/${data.country}/${data.state}`,
        method: "GET",
      }),
    }),
  }),
});

export const {useFetchCountriesMutation, useFetchStatesMutation, useFetchLgasMutation, useFetchCitiesMutation} = locationApi;
