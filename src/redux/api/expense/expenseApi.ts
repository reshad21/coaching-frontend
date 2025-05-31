import { TQueryParam } from "@/types/global";
import { baseApi } from "../baseApi";

const expenseApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({

    getAllExpense: builder.query({
      query: (args) => {
        const params = new URLSearchParams();
        if (args) {
          args.forEach((item: TQueryParam) => {
            params.append(item.name, item.value as string);
          });
        }
        return {
          url: '/cost',
          method: 'GET',
          params: params
        }
      },
      providesTags: ["cost"],
    }),

    getExpenseById: builder.query({
      query: (id) => {
        return {
          url: `/cost/${id}`,
          method: 'GET',
        }
      },
      providesTags: ["cost"],
    }),


    addExpense: builder.mutation({
      query: (data) => {
        console.log("resuxk data", data);
        return {
          url: "/cost",
          method: "POST",
          body: data,
        };
      },
      invalidatesTags: ["cost"],
    }),

    updateExpense: builder.mutation({
      query: ({ id, data }) => {
        console.log("redux inside==>", id, data);
        return {
          url: `/cost/${id}`,
          method: "PATCH",
          body: data,
        };
      },
      invalidatesTags: ["cost"],
    }),
  }),
});

export const {
    useGetAllExpenseQuery,
    useGetExpenseByIdQuery,
    useAddExpenseMutation,
    useUpdateExpenseMutation,
} = expenseApi;
