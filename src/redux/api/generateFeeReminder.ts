export interface GenerateFeeReminderRequest {
  prompt: string;
}

export interface GenerateFeeReminderResponse {
  data?: {
    text?: string;
  };
  text?: string;
  message?: string;
}

const API_BASE_URL =
  "https://coaching-backend-vert.vercel.app/api";

export const generateFeeReminder = async (
  payload: GenerateFeeReminderRequest,
  token?: string,
): Promise<GenerateFeeReminderResponse> => {
  const response = await fetch(
    `${API_BASE_URL}/bulk/generate-fee-reminder`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      credentials: "include",
      body: JSON.stringify(payload),
    },
  );

  const data = (await response.json()) as GenerateFeeReminderResponse;

  if (!response.ok) {
    throw new Error(
      data?.message || data?.data?.text || "Failed to generate fee reminder",
    );
  }

  return data;
};