import { baseApi } from "../baseApi";

const adminApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // getTest: builder.query({
    //   query: (args) => {
    //     const params = new URLSearchParams();
    //     if (args) {
    //       args.forEach((item: TQueryParam) => {
    //         params.append(item.name, item.value as string);
    //       });
    //     }
    //     return {
    //       url: '/test',
    //       method: 'GET',
    //       params: params
    //     }
    //   },
    //   providesTags: ["admin"],
    // }),
    loginAdmin: builder.mutation({
      query: (data) => {
        return {
          url: "/login",
          method: "POST",
          body: data,
        };
      },
      invalidatesTags: ["admin"],
    }),
  }),
});

export const { useLoginAdminMutation } = adminApi;
