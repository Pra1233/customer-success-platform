import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import { addAsyncStatusCases } from "@/store/asyncStatus";
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
    addAsyncStatusCases(builder, fetchDashboard, "Failed to load dashboard");

    builder.addCase(fetchDashboard.fulfilled, (state, action) => {
      state.status = "succeeded";
      state.data = action.payload;
    });
  },
});

export default dashboardSlice.reducer;
