import { apiSlice } from "../apiSlice";

const ADMIN_URL = "/api/admin";

export const adminApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    adminLogin: builder.mutation({
      query: (data) => ({
        url: `${ADMIN_URL}/admin-auth`,
        method: "POST",
        body: data,
      }),
    }),
    adminLogout: builder.mutation({
      query: () => ({
        url: `${ADMIN_URL}/logout`,
        method: "POST",
      }),
    }),
    addCity: builder.mutation({
      query: (data) => ({
        url: `${ADMIN_URL}/admin-city`,
        method: "POST",
        body: data
      }),
    }),
    getCities: builder.query({
      query: () => ({
        url: `${ADMIN_URL}/admin-city`,
        method: "GET",
      }),
    }),
  }),
});

export const {
  useAdminLoginMutation,
  useAdminLogoutMutation,
  useAddCityMutation,
  useGetCitiesQuery
} = adminApiSlice;
