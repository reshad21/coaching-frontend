import { baseApi } from "../baseApi";

export type ChatRole = "user" | "model";

export interface ChatHistoryMessage {
    role: ChatRole;
    parts: { text: string }[];
}

export interface ChatRequest {
    message: string;
    history: ChatHistoryMessage[];
}

export interface ChatResponse {
    success?: boolean;
    message?: string;
    error?: string;
    data?: {
        reply?: string;
        history?: ChatHistoryMessage[];
    };
}

export const aiChatApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        sendChatMessage: builder.mutation<ChatResponse, ChatRequest>({
            query: (body) => ({
                url: "/ai/chat",
                method: "POST",
                body,
            }),
            transformErrorResponse: (response: any) => {
                console.log("RTK ERROR RESPONSE:", response);
                return response;
            },
        }),
    }),
});

export const { useSendChatMessageMutation } = aiChatApi;