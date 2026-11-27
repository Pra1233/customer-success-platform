import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import { addAsyncStatusCases } from "@/store/asyncStatus";
import { insightService } from "@/services/insightService";
import { extractErrorMessage } from "@/lib/errors";
import type { Insight } from "@/types/insight";

interface InsightsState {
  byInteractionId: Record<string, Insight[]>;
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

const initialState: InsightsState = {
  byInteractionId: {},
  status: "idle",
  error: null,
};

export const generateInsight = createAsyncThunk(
  "insights/generate",
  async (interactionId: string, { rejectWithValue }) => {
    try {
      return { interactionId, insight: await insightService.generate(interactionId) };
    } catch (error) {
      return rejectWithValue(extractErrorMessage(error, "Failed to generate insight"));
    }
  }
);

export const fetchInsights = createAsyncThunk(
  "insights/fetchForInteraction",
  async (interactionId: string) => ({
    interactionId,
    insights: await insightService.listForInteraction(interactionId),
  })
);

const insightsSlice = createSlice({
  name: "insights",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    addAsyncStatusCases(
      builder,
      generateInsight,
      "Failed to generate insight",
      (action) => action.payload as string | undefined
    );
    addAsyncStatusCases(builder, fetchInsights, "Failed to load insights");

    builder
      .addCase(generateInsight.fulfilled, (state, action) => {
        state.status = "succeeded";
        const { interactionId, insight } = action.payload;
        const existing = state.byInteractionId[interactionId] ?? [];
        state.byInteractionId[interactionId] = [insight, ...existing];
      })
      .addCase(fetchInsights.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.byInteractionId[action.payload.interactionId] = action.payload.insights;
      });
  },
});

export default insightsSlice.reducer;
