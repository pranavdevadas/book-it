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
    addSavedMovies: builder.mutation({
      query: (movieId) => ({
        url: `${USER_URL}/add-saved-movie`,
        method: "POST",
        body: { movieId },
      }),
    }),
    getSavedMovies: builder.query({
      query: () => ({
        url: `${USER_URL}/get-savedmovies`,
        method: "GET",
      }),
    }),
    removeSavedMovie: builder.mutation({
      query: (id) => ({
        url: `${USER_URL}/remove-savedmovie/${id}`,
        method: "DELETE",
      }),
    }),
    bannerDisplay: builder.query({
      query: () => ({
        url: `${USER_URL}/banner-display`,
        method: "GET",
      }),
    }),
    getSeatsss: builder.query({
      query: ({screen, theatreId}) => ({
        url: `${USER_URL}/get-seats/${theatreId}/${screen}`,
        method: "GET",
      }),
    }),
    theatreDetailsById: builder.query({
      query: (id) => ({
        url: `${USER_URL}/theatre/${id}`,
        method: "GET",
      }),
    }), 
    getAvailableSeatsForBooking: builder.query({
      query: ({theatreId, screen, selectedTime, selectedDate}) => ({
        url: `${USER_URL}/get-availableseats`,
        method: "GET",
        params: { theatreId, screen, selectedTime, selectedDate },
      }),
    }), 
    createBooking: builder.mutation({
      query: (data) => ({
        url: `${USER_URL}/create-booking`,
        method: "POST",
        body: data,
      }),
    }),
    updateBooking: builder.mutation({
      query: (data) => ({
        url: `${USER_URL}/update-booking`,
        method: "POST",
        body: data,
      }),
    }),
    getTickets: builder.query({
      query: () => ({
        url: `${USER_URL}/ticket`,
        method: "GET",
      }),
    }),
    addRatingAndReview: builder.mutation({
      query: (data) => ({
        url: `${USER_URL}/rating-review`,
        method: "POST",
        body: data,
      }),
    }),
    getAllReviews: builder.query({
      query: ({movieId}) => ({
        url: `${USER_URL}/get-review/${movieId}`,
        method: "GET",
      }),
    }),
    sendOtpToMobile: builder.mutation({
      query: (data) => ({
        url: `${USER_URL}/send-mob-otp`,
        method: "POST",
        body: data,
      }),
    }),
    confirmOtpAndChangePassword: builder.mutation({
      query: (data) => ({
        url: `${USER_URL}/confirm-otp`,
        method: "POST",
        body: data,
      }),
    }),
    addAmountToWallet: builder.mutation({
      query: (data) => ({
        url: `${USER_URL}/add-amount-wallet`,
        method: "POST",
        body: data,
      }),
    }),
    getTransactions: builder.query({
      query: () => ({
        url: `${USER_URL}/transactions`,
        method: "GET",
      }),
    }),
    getWalletBalance: builder.query({
      query: () => ({
        url: `${USER_URL}/wallet-balance`,
        method: "GET",
      }),
    }),
    cancelTicket: builder.mutation({
      query: (data) => ({
        url: `${USER_URL}/cancel-ticket`, 
        method: "PATCH",
        body: data, 
      }),
    }),
    getChatHistory: builder.query({
      query: ({ userId, ownerId }) => ({
        url: `/api/chat/chats/${userId}/${ownerId}`,
        method: "GET",
      }),
    }),
    saveChat: builder.mutation({
      query: (data) => ({
        url: `/api/chat/chat`,
        method: "POST",
        body: data,
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
  useAddSavedMoviesMutation,
  useGetSavedMoviesQuery,
  useRemoveSavedMovieMutation,
  useBannerDisplayQuery,
  useGetSeatsssQuery,
  useTheatreDetailsByIdQuery,
  useCreateBookingMutation,
  useGetAvailableSeatsForBookingQuery,
  useGetTicketsQuery,
  useAddRatingAndReviewMutation,
  useGetAllReviewsQuery,
  useSendOtpToMobileMutation,
  useConfirmOtpAndChangePasswordMutation,
  useUpdateBookingMutation,
  useAddAmountToWalletMutation,
  useGetTransactionsQuery,
  useGetWalletBalanceQuery,
  useCancelTicketMutation,
  useGetChatHistoryQuery,
  useSaveChatMutation
  
} = userApiSlice;
