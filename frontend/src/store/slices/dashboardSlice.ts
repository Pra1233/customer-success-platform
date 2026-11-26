import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import { dashboardService } from "@/services/dashboardService";
import type { Dashboard } from "@/types/dashboard";

interface DashboardState {
  data: Dashboard | null;
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

const initialState: DashboardState = {
  data: null,
  status: "idle",
  error: null,
};

export const fetchDashboard = createAsyncThunk("dashboard/fetch", async () =>
  dashboardService.get()
);

const dashboardSlice = createSlice({
  name: "dashboard",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchDashboard.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchDashboard.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.data = action.payload;
      })
      .addCase(fetchDashboard.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message ?? "Failed to load dashboard";
      });
  },
});

export default dashboardSlice.reducer;
