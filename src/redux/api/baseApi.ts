import {
  BaseQueryApi,
  createApi,
  fetchBaseQuery,
} from "@reduxjs/toolkit/query/react";
import { RootState } from "../store";



export const baseApi = createApi({
  reducerPath: "baseApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:3000/api",
    credentials: "include",
    prepareHeaders: (
      headers: Headers,
      { getState }: Pick<BaseQueryApi, "getState">
    ) => {
      const state = getState() as RootState;
      const token: string | undefined = state.auth?.token;

      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }

      return headers;
    },
  }),
  tagTypes: ["vacation", "subject", "batch", "department", "room", "notice", "role", "exam", "teacher", "student","admin", "class"],
  endpoints: () => ({}),
});
