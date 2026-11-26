import { configureStore } from "@reduxjs/toolkit";

import authReducer from "@/store/slices/authSlice";
import customersReducer from "@/store/slices/customersSlice";
import dashboardReducer from "@/store/slices/dashboardSlice";
import insightsReducer from "@/store/slices/insightsSlice";
import interactionsReducer from "@/store/slices/interactionsSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    customers: customersReducer,
    interactions: interactionsReducer,
    insights: insightsReducer,
    dashboard: dashboardReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
