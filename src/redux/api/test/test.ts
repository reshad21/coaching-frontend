import { TQueryParam } from "@/types/global";
import { baseApi } from "../baseApi";

const adminApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    
    getTest: builder.query({
      query: (args) => {
        const params = new URLSearchParams();
        if (args) {
          args.forEach((item: TQueryParam) => {
            params.append(item.name, item.value as string);
          });
        }
        return {
          url: '/test',
          method: 'GET',
          params: params
        }
      },
      providesTags: ["admin"],
    }),
  
  }),
});

export const {
  useGetTestQuery
} = adminApi;
