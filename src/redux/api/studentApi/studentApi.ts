import { TQueryParam } from "@/types/global";
import { baseApi } from "../baseApi";

const studentApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getAllStudent: builder.query({
            query: (args) => {
                const params = new URLSearchParams();
                if (args) {
                    args.forEach((item: TQueryParam) => {
                        params.append(item.name, item.value as string);
                    });
                }
                return {
                    url: '/student',
                    method: 'GET',
                    params: params
                }
            },
            providesTags: ["student"],
        }),

        getStudentById: builder.query({
            query: (id) => ({
                url: `/student/${id}`,
                method: 'GET',
            }),
            providesTags: (id) => [{ type: 'student', id }]
        }),

        deleteStudent: builder.mutation({
            query: (id) => {
                console.log("inside base api=>", id);
                return {
                    url: `/student/${id}`,
                    method: "DELETE",
                };
            },
            invalidatesTags: ["student"]
        }),

        addStudent: builder.mutation({
            query: (data) => {
                return {
                    url: "/student",
                    method: "POST",
                    body: data,
                };
            },
            invalidatesTags: ["student"]
        }),

        updateStudent: builder.mutation({
            query: ({ id, data }) => {
                return {
                    url: `/student/${id}`,
                    method: "PATCH",
                    body: data,
                };
            },
            invalidatesTags: ["student"]
        }),
        updateStudentCertificate: builder.mutation({
            query: ({ id, data }) => {
                return {
                    url: `/student/create-certificate/${id}`,
                    method: "POST",
                    body: data,
                };
            },
            invalidatesTags: ["student"]
        }),
        deleteStudentCertificate: builder.mutation({
            query: (id) => {
                return {
                    url: `/delete-certificate/${id}`,
                    method: "DELETE",
                };
            },
            invalidatesTags: ["student"]
        }),
    }),
});

export const {
    useGetAllStudentQuery,
    useGetStudentByIdQuery,
    useDeleteStudentMutation,
    useAddStudentMutation,
    useUpdateStudentMutation,
    useUpdateStudentCertificateMutation,
    useDeleteStudentCertificateMutation
} = studentApi;
