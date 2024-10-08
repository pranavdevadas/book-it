import { apiSlice } from "../apiSlice";

const OWNER_URL = "/api/owner";

export const ownerApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    ownerLogin: builder.mutation({
      query: (data) => ({
        url: `${OWNER_URL}/owner-auth`,
        method: "POST",
        body: data,
      }),
    }),
    ownerRegister: builder.mutation({
      query: (data) => ({
        url: `${OWNER_URL}/owner-register`,
        method: "POST",
        body: data,
      }),
    }),
    ownerUpdate: builder.mutation({
      query: (data) => ({
        url: `${OWNER_URL}/owner-profile`,
        method: "PUT",
        body: data,
      }),
    }),
    ownerVerifyOtp: builder.mutation({
      query: (data) => ({
        url: `${OWNER_URL}/owner-verify-otp`,
        method: "POST",
        body: data,
      }),
    }),
    ownerResendOtp: builder.mutation({
      query: (data) => ({
        url: `${OWNER_URL}/owner-resend-otp`,
        method: "POST",
        body: data,
      }),
    }),
    ownerLogout: builder.mutation({
      query: () => ({
        url: `${OWNER_URL}/owner-logout`,
        method: "POST",
      }),
    }),
    getCities: builder.query({
      query: () => ({
        url: `${OWNER_URL}/owner-city`,
        method: "GET",
      }),
    }),
    ownerAddTheatre: builder.mutation({
      query: (data) => ({
        url: `${OWNER_URL}/owner-addtheatre`,
        method: "POST",
        body: data,
      }),
    }),
    getTheatres: builder.query({
      query: () => ({
        url: `${OWNER_URL}/owner-theatres`,
        method: "GET",
      }),
    }),
    getListedTheatres: builder.query({
      query: () => ({
        url: `${OWNER_URL}/owner-listedtheatres`,
        method: "GET",
      }),
    }),
    getTheatreById: builder.query({
      query: (id) => ({
        url: `${OWNER_URL}/theatre/${id}`,
        method: "GET",
      }),
    }),
    ownerEditTheatre: builder.mutation({
      query: ({ id, formData }) => ({
        url: `${OWNER_URL}/theatre/${id}`,
        method: "PUT",
        body: formData,
      }),
    }),
    getNowShowing: builder.query({
      query: () => ({
        url: `${OWNER_URL}/owner-nowshowing`,
        method: "GET",
      }),
    }),
    getAllMovies: builder.query({
      query: () => ({
        url: `${OWNER_URL}/owner-getmovies`,
        method: "GET",
      }),
    }),
    AddShow: builder.mutation({
      query: (data) => ({
        url: `${OWNER_URL}/owner-addshow`,
        method: "POST",
        body: data,
      }),
    }),
    toggleStatus: builder.mutation({
      query: (id) => ({
        url: `${OWNER_URL}/show/${id}/toggle-status`,
        method: "PATCH",
      }),
    }),
    toggleTheatreStatus: builder.mutation({
      query: (id) => ({
        url: `${OWNER_URL}/theatre/${id}/toggle-status`,
        method: "PATCH",
      }),
    }),
    getAllBookings: builder.query({
      query: () => ({
        url: `${OWNER_URL}/owner-getbookings`,
        method: "GET",
      }),
    }),
    getTop5Movies: builder.query({
      query: () => ({
        url: `${OWNER_URL}/top-movies`,
        method: "GET",
      }),
    }),
    ownerChatList: builder.query({
      query: ({ownerId}) => ({
        url: `/api/chat/chat-list/${ownerId}`,
        method: "GET",
      }),
    }),
    chatDetails: builder.query({
      query: ({chatId}) => ({
        url: `/api/chat/chat-details/${chatId}`,
        method: "GET",
      }),
    }),
    saveMessages: builder.mutation({
      query: (data) => ({
        url: `/api/chat/chat-save`,
        method: "POST",
        body: data,
      }),
    }),
  }),
});

export const {
  useOwnerLoginMutation,
  useOwnerLogoutMutation,
  useOwnerRegisterMutation,
  useOwnerUpdateMutation,
  useOwnerVerifyOtpMutation,
  useOwnerResendOtpMutation,
  useOwnerAddTheatreMutation,
  useGetCitiesQuery,
  useGetTheatresQuery,
  useGetTheatreByIdQuery,
  useOwnerEditTheatreMutation,
  useGetNowShowingQuery,
  useGetAllMoviesQuery,
  useAddShowMutation,
  useToggleStatusMutation,
  useToggleTheatreStatusMutation,
  useGetListedTheatresQuery,
  useGetAllBookingsQuery,
  useGetTop5MoviesQuery,
  useOwnerChatListQuery,
  useChatDetailsQuery,
  useSaveMessagesMutation
} = ownerApiSlice;
