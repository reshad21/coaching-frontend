import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { generateFeeReminder } from "@/redux/api/generateFeeReminder";
import type { RootState } from "@/redux/store";

interface FeeReminderState {
  loading: boolean;
  error: string | null;
  generatedText: string;
}

const initialState: FeeReminderState = {
  loading: false,
  error: null,
  generatedText: "",
};

export const generateFeeReminderMessage = createAsyncThunk(
  "feeReminder/generateFeeReminderMessage",
  async (prompt: string, { getState, rejectWithValue }) => {
    try {
      const state = getState() as RootState;
      const token = state.auth?.token;
      const response = await generateFeeReminder({ prompt }, token);

      return response?.data?.text || response?.text || "";
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to generate fee reminder";

      return rejectWithValue(message);
    }
  },
);

const feeReminderSlice = createSlice({
  name: "feeReminder",
  initialState,
  reducers: {
    clearFeeReminderState: (state) => {
      state.loading = false;
      state.error = null;
      state.generatedText = "";
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(generateFeeReminderMessage.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(generateFeeReminderMessage.fulfilled, (state, action) => {
        state.loading = false;
        state.generatedText = action.payload;
      })
      .addCase(generateFeeReminderMessage.rejected, (state, action) => {
        state.loading = false;
        state.error =
          (action.payload as string) || action.error.message || "Failed to generate fee reminder";
      });
  },
});

export const { clearFeeReminderState } = feeReminderSlice.actions;

export const selectFeeReminderState = (state: RootState) => state.feeReminder;

export default feeReminderSlice.reducer;