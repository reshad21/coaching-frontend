import { TQueryParam } from "@/types/global";
import { baseApi } from "../baseApi";

const paymentApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({

    getAllPayment: builder.query({
      query: (args) => {
        const params = new URLSearchParams();
        if (args) {
          args.forEach((item: TQueryParam) => {
            params.append(item.name, item.value as string);
          });
        }
        return {
          url: '/payment',
          method: 'GET',
          params: params
        }
      },
      providesTags: ["payment"],
    }),

    getPaymentById: builder.query({
      query: (id) => {
        return {
          url: `/payment/${id}`,
          method: 'GET',
        }
      },
      providesTags: ["payment"],
    }),


    addPayment: builder.mutation({
      query: (data) => {
        console.log("resuxk data", data);
        return {
          url: "/payment",
          method: "POST",
          body: data,
        };
      },
      invalidatesTags: ["payment"],
    }),

    updatePayment: builder.mutation({
      query: ({ id, data }) => {
        console.log("redux inside==>", id, data);
        return {
          url: `/payment/${id}`,
          method: "PATCH",
          body: data,
        };
      },
      invalidatesTags: ["payment"],
    }),
  }),
});

export const {
  useGetAllPaymentQuery,
  useGetPaymentByIdQuery,
  useAddPaymentMutation,
  useUpdatePaymentMutation,
} = paymentApi;
