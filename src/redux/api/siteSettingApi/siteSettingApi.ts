import { baseApi } from "../baseApi";

const siteSettingApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getSiteSetting: builder.query({
            query: () => ({
                url: '/site-setting',
                method: 'GET',
            }),
            providesTags: ["siteSetting"],
        }),

        getSiteSettingById: builder.query({
            query: (id) => ({
                url: `/site-setting/${id}`,
                method: 'GET',
            }),
            providesTags: (id) => [{ type: 'siteSetting', id }]
        }),

        createSiteSetting: builder.mutation({
            query: (data) => {
                return {
                    url: "/site-setting",
                    method: "POST",
                    body: data,
                };
            },
            invalidatesTags: ["siteSetting"]
        }),

        updateSiteSetting: builder.mutation({
            query: ({ id, data }) => {
                return {
                    url: `/site-setting/${id}`,
                    method: "PATCH",
                    body: data,
                };
            },
            invalidatesTags: ["siteSetting"]
        }),

        deleteSiteSetting: builder.mutation({
            query: (id) => {
                return {
                    url: `/site-setting/${id}`,
                    method: "DELETE",
                };
            },
            invalidatesTags: ["siteSetting"]
        }),
    }),
});

export const {
    useGetSiteSettingQuery,
    useGetSiteSettingByIdQuery,
    useCreateSiteSettingMutation,
    useUpdateSiteSettingMutation,
    useDeleteSiteSettingMutation,
} = siteSettingApi;
