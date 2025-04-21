import { TQueryParam } from "@/types/global";
import { baseApi } from "../baseApi";

const ShiftApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getAllShift: builder.query({
            query: (args) => {
                const params = new URLSearchParams();
                if (args) {
                    args.forEach((item: TQueryParam) => {
                        params.append(item.name, item.value as string);
                    });
                }
                return {
                    url: '/shift',
                    method: 'GET',
                    params: params
                }
            },
            providesTags: ["shift"],
        }),

        getShiftById: builder.query({
            query: (id) => ({
                url: `/Shift/${id}`,
                method: 'GET',
            }),
            providesTags: (id) => [{ type: 'shift', id }]
        }),

        deleteShift: builder.mutation({
            query: (id) => {
                console.log("inside base api=>", id);
                return {
                    url: `/shift/${id}`,
                    method: "DELETE",
                };
            },
            invalidatesTags: ["shift"]
        }),

        addShift: builder.mutation({
            query: (data) => {
                console.log("inside base api=>", data);
                return {
                    url: "/shift",
                    method: "POST",
                    body: data,
                };
            },
            invalidatesTags: ["shift"]
        }),

        updateShift: builder.mutation({
            query: ({ id, data }) => {
                console.log("Updating teacher with id:", id, "and data:", data);
                return {
                    url: `/shift/${id}`,
                    method: "PATCH",
                    body: data,
                };
            },
            invalidatesTags: ["shift"]
        }),
        
    }),
});

export const {
    useGetAllShiftQuery,
    useGetShiftByIdQuery,
    useDeleteShiftMutation,
    useAddShiftMutation,
    useUpdateShiftMutation,
    useUpdateShiftCertificateMutation,
    useDeleteShiftCertificateMutation
} = ShiftApi;
