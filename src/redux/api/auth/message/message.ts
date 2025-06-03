import { baseApi } from "../../baseApi";

const messageApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({

    // getAllBatch: builder.query({
    //   query: (args) => {
    //     const params = new URLSearchParams();
    //     if (args) {
    //       args.forEach((item: TQueryParam) => {
    //         params.append(item.name, item.value as string);
    //       });
    //     }
    //     return {
    //       url: '/batch',
    //       method: 'GET',
    //       params: params
    //     }
    //   },
    //   providesTags: ["batch"],
    // }),
   
    sendMessage: builder.mutation({
        query: (data) => {
          return {
            url: `/bulk/batch`,
            method: "POST",
            body:data
          };
        },
        invalidatesTags: ["message"],
      }),
    sendClassMessage: builder.mutation({
        query: (data) => {
          return {
            url: `/bulk/class`,
            method: "POST",
            body:data
          };
        },
        invalidatesTags: ["message"],
      }),
    sendShiftMessage: builder.mutation({
        query: (data) => {
          return {
            url: `/bulk/shift`,
            method: "POST",
            body:data
          };
        },
        invalidatesTags: ["message"],
      }),
    sendAllStudentsMessage: builder.mutation({
        query: (data) => {
          return {
            url: `/bulk/all-student`,
            method: "POST",
            body:data
          };
        },
        invalidatesTags: ["message"],
      }),
    sendSingleMessage: builder.mutation({
        query: (data) => {
          return {
            url: `/bulk/single-student`,
            method: "POST",
            body:data
          };
        },
        invalidatesTags: ["message"],
      }),
  }),
});

export const {
 useSendMessageMutation,
 useSendSingleMessageMutation,
 useSendClassMessageMutation,
 useSendShiftMessageMutation,
 useSendAllStudentsMessageMutation
} = messageApi;
