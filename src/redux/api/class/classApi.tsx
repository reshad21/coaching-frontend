import { TQueryParam } from "@/types/global";
import { baseApi } from "../baseApi";

const classApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllClass: builder.query({
      query: (args) => {
        const params = new URLSearchParams();
        if (args) {
          args.forEach((item: TQueryParam) => {
            params.append(item.name, item.value as string);
          });
        }
        return {
          url: "/class",
          method: "GET",
          params: params,
        };
      },
      providesTags: ["class"],
    }),

    getClassById: builder.query({
      query: (id) => {
        return {
          url: `/class/${id}`,
          method: "GET",
        };
      },
      providesTags: ["class"],
    }),

    deleteClass: builder.mutation({
      query: (id) => {
        return {
          url: `/class/${id}`,
          method: "DELETE",
        };
      },
      invalidatesTags: ["class"],
    }),

    addClass: builder.mutation({
      query: (data) => {
        return {
          url: "/class",
          method: "POST",
          body: data,
        };
      },
      invalidatesTags: ["class"],
    }),

    updateClass: builder.mutation({
      query: ({ id, data }) => {
        return {
          url: `/class/${id}`,
          method: "PATCH",
          body: data,
        };
      },
      invalidatesTags: ["class"],
    }),
  }),
});

export const {
    useGetAllClassQuery,
    useGetClassByIdQuery,
    useDeleteClassMutation,
    useAddClassMutation,
    useUpdateClassMutation,
} = classApi;
