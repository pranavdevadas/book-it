import { apiSlice } from "../apiSlice";

const USER_URL = "/api/users";

export const userApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (data) => ({
        url: `${USER_URL}/auth`,
        method: "POST",
        body: data,
      }),
    }),
    register: builder.mutation({
      query: (data) => ({
        url: `${USER_URL}`,
        method: "POST",
        body: data,
      }),
    }),
    verifyOtp: builder.mutation({
      query: (data) => ({
        url: `${USER_URL}/verify-otp`,
        method: "POST",
        body: data,
      }),
    }),
    resendOtp: builder.mutation({
      query: (data) => ({
        url: `${USER_URL}/resend-otp`,
        method: "POST",
        body: data,
      }),
    }),
    logout: builder.mutation({
      query: () => ({
        url: `${USER_URL}/logout`,
        method: "POST",
      }),
    }),
    updateUser: builder.mutation({
      query: (data) => ({
        url: `${USER_URL}/profile`,
        method: "PUT",
        body: data,
      }),
    }),
    getShowDetails: builder.query({
      query: () => ({
        url: `${USER_URL}/get-show`,
        method: "GET",
      }),
    }),
    getAllmovies: builder.query({
      query: () => ({
        url: `${USER_URL}/get-movies`,
        method: "GET",
      }),
    }),
    getAvailableShows: builder.query({
      query: ({ id, lat, lng }) => ({
        url: `${USER_URL}/get-available-shows/${id}`,
        method: "GET",
        params: {
          lat,
          lng,
        },
      }),
    }),
    moveDetailsById: builder.query({
      query: (id) => ({
        url: `${USER_URL}/movie/${id}`,
        method: "GET",
      }),
    }),
  }),
});

export const {
  useLoginMutation,
  useLogoutMutation,
  useRegisterMutation,
  useUpdateUserMutation,
  useVerifyOtpMutation,
  useResendOtpMutation,
  useGetShowDetailsQuery,
  useGetAllmoviesQuery,
  useMoveDetailsByIdQuery,
  useGetAvailableShowsQuery,
} = userApiSlice;
