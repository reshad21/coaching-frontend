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
                    url: '/students',
                    method: 'GET',
                    params: params
                }
            },
            providesTags: ["student"],
        }),

        getStudentById: builder.query({
            query: (id) => ({
                url: `/students/${id}`,
                method: 'GET',
            }),
            providesTags: (id) => [{ type: 'student', id }]
        }),

        deleteStudent: builder.mutation({
            query: (id) => {
                console.log("inside base api=>", id);
                return {
                    url: `/students/${id}`,
                    method: "DELETE",
                };
            },
            invalidatesTags: ["student"]
        }),

        addStudent: builder.mutation({
            query: (data) => {
                console.log("inside base api=>", data);
                return {
                    url: "/students",
                    method: "POST",
                    body: data,
                };
            },
            invalidatesTags: ["student"]
        }),

        updateStudent: builder.mutation({
            query: ({ id, data }) => {
                console.log("Updating teacher with id:", id, "and data:", data);
                return {
                    url: `/students/${id}`,
                    method: "PATCH",
                    body: data,
                };
            },
            invalidatesTags: ["student"]
        }),
        updateStudentCertificate: builder.mutation({
            query: ({ id, data }) => {
                return {
                    url: `/students/create-certificate/${id}`,
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
