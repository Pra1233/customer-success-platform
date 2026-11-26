import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import { insightService } from "@/services/insightService";
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
  async (interactionId: string) => ({
    interactionId,
    insight: await insightService.generate(interactionId),
  })
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
    builder
      .addCase(generateInsight.pending, (state) => {
        state.status = "loading";
      })
      .addCase(generateInsight.fulfilled, (state, action) => {
        state.status = "succeeded";
        const { interactionId, insight } = action.payload;
        const existing = state.byInteractionId[interactionId] ?? [];
        state.byInteractionId[interactionId] = [insight, ...existing];
      })
      .addCase(generateInsight.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message ?? "Failed to generate insight";
      })
      .addCase(fetchInsights.fulfilled, (state, action) => {
        state.byInteractionId[action.payload.interactionId] = action.payload.insights;
      });
  },
});

export default insightsSlice.reducer;
