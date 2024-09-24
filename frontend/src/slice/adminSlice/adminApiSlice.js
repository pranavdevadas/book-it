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
        body: data,
      }),
    }),
    getCities: builder.query({
      query: () => ({
        url: `${ADMIN_URL}/admin-city`,
        method: "GET",
      }),
    }),
    addMovie: builder.mutation({
      query: (data) => ({
        url: `${ADMIN_URL}/admin-movie`,
        method: "POST",
        body: data,
      }),
    }),
    getMovies: builder.query({
      query: () => ({
        url: `${ADMIN_URL}/admin-movie`,
        method: "GET",
      }),
    }),
    toggleListStatus: builder.mutation({
      query: (id) => ({
        url: `${ADMIN_URL}/movie/${id}/toggle-status`,
        method: "PATCH",
      }),
    }),
    editMovie: builder.mutation({
      query: ({ id, formData }) => ({
        url: `${ADMIN_URL}/movie/${id}`,
        method: "PATCH",
        body: formData,
      }),
    }),
    getMovieById: builder.query({
      query: (id) => ({
        url: `${ADMIN_URL}/movie/${id}`,
        method: "GET",
      }),
    }),
    getUsers: builder.query({
      query: () => ({
        url: `${ADMIN_URL}/admin-user`,
        method: "GET",
      }),
    }),
    blockUnblockUser: builder.mutation({
      query: (id) => ({
        url: `${ADMIN_URL}/${id}/blockUnblockUser`,
        method: "PATCH",
      }),
    }),
    getOwners: builder.query({
      query: () => ({
        url: `${ADMIN_URL}/admin-owner`,
        method: "GET",
      }),
    }),
    blockUnblockOwner: builder.mutation({
      query: (id) => ({
        url: `${ADMIN_URL}/${id}/blockUnblockOwner`,
        method: "PATCH",
      }),
    }),
    getTheatress: builder.query({
      query: () => ({
        url: `${ADMIN_URL}/admin-theatres`,
        method: "GET",
      }),
    }),
    bannerManagment: builder.mutation({
      query: (formData) => ({
        url: `${ADMIN_URL}/banner`,
        method: "PATCH",
        body: formData,
      }),
    }),
    getBanner: builder.query({
      query: () => ({
        url: `${ADMIN_URL}/banner`,
        method: "GET",
      }),
    }),
    getBookings: builder.query({
      query: () => ({
        url: `${ADMIN_URL}/bookings`,
        method: "GET",
      }),
    }),
  }),
});

export const {
  useAdminLoginMutation,
  useAdminLogoutMutation,
  useAddCityMutation,
  useGetCitiesQuery,
  useAddMovieMutation,
  useGetMoviesQuery,
  useToggleListStatusMutation,
  useEditMovieMutation,
  useGetMovieByIdQuery,
  useGetUsersQuery,
  useBlockUnblockUserMutation,
  useGetOwnersQuery,
  useBlockUnblockOwnerMutation,
  useGetTheatressQuery,
  useBannerManagmentMutation,
  useGetBannerQuery,
  useGetBookingsQuery
} = adminApiSlice;
