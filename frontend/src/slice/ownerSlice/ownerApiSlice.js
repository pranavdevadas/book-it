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
  }),
});

export const {
  useOwnerLoginMutation,
  useOwnerLogoutMutation,
  useOwnerRegisterMutation,
  useOwnerUpdateMutation,
  useOwnerVerifyOtpMutation,
  useOwnerResendOtpMutation
} = ownerApiSlice;
