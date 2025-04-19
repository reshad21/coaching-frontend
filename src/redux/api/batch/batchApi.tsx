import { TQueryParam } from "@/types/global";
import { baseApi } from "../baseApi";

const batchApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({

    getAllBatch: builder.query({
      query: (args) => {
        const params = new URLSearchParams();
        if (args) {
          args.forEach((item: TQueryParam) => {
            params.append(item.name, item.value as string);
          });
        }
        return {
          url: '/batch',
          method: 'GET',
          params: params
        }
      },
      providesTags: ["batch"],
    }),
    // asif vai query
    geBatchStatus: builder.query({
      query: (selectedBatch) => {

        return {
          url: `/batch/status/${selectedBatch}`,
          method: 'GET',
        }
      },
      providesTags: ["batch"],
    }),
    getBatchById: builder.query({
      query: (id) => {
        return {
          url: `/batch/${id}`,
          method: 'GET',
        }
      },
      providesTags: ["batch"],
    }),
    deleteBatch: builder.mutation({
      query: (id) => {
        return {
          url: `/batch/${id}`,
          method: "DELETE",
        };
      },
      invalidatesTags: ["batch"],
    }),

    addBatch: builder.mutation({
      query: (data) => {
        return {
          url: "/batch",
          method: "POST",
          body: data,
        };
      },
      invalidatesTags: ["batch"],
    }),

    updateBatch: builder.mutation({
      query: ({ id, data }) => {
        return {
          url: `/batch/${id}`,
          method: "PATCH",
          body: data,
        };
      },
      invalidatesTags: ["batch"],
    }),
  }),
});

export const {
  useGetAllBatchQuery,
  useGetBatchByIdQuery,
  useDeleteBatchMutation,
  useAddBatchMutation,
  useUpdateBatchMutation,
  useGeBatchStatusQuery
} = batchApi;
