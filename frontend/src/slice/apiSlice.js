import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// const baseUrl = "https://bookitt.online";

const baseQuery = fetchBaseQuery({ baseUrl : 'https://bookitt.online', credentials: "include" });

console.log(baseQuery)

export const apiSlice = createApi({
  baseQuery,
  tagTypes: ["User"],
  endpoints: (builder) => ({}),
});
