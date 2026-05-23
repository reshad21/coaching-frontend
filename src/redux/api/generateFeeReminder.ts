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
  const response = await fetch(`${API_BASE_URL}/bulk/generate-fee-reminder`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    credentials: "include",
    body: JSON.stringify(payload),
  });

  const contentType = response.headers.get("content-type") || "";
  const text = await response.text();

  // If the response is not OK, attempt to parse JSON and surface a useful message,
  // otherwise include the raw response text so we can see HTML errors.
  if (!response.ok) {
    try {
      const parsed = JSON.parse(text);
      const msg = parsed?.message || parsed?.data?.text || JSON.stringify(parsed);
      throw new Error(`Request failed ${response.status}: ${msg}`);
    } catch {
      // not JSON — include a short snippet of the body to help debugging
      const snippet = text ? text.slice(0, 1000) : "<empty response>";
      throw new Error(`Request failed ${response.status} and returned non-JSON: ${snippet}`);
    }
  }

  // Successful response: if JSON, parse and return, otherwise return raw text under `text`.
  if (contentType.includes("application/json")) {
    try {
      const data = JSON.parse(text) as GenerateFeeReminderResponse;
      return data;
    } catch {
      // fall through to return raw text
    }
  }

  return { text };
};