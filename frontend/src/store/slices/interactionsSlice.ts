import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import { addAsyncStatusCases } from "@/store/asyncStatus";
import { interactionService } from "@/services/interactionService";
import type {
  Interaction,
  InteractionCreatePayload,
  InteractionFilters,
  InteractionUpdatePayload,
} from "@/types/interaction";

interface InteractionsState {
  items: Interaction[];
  total: number;
  current: Interaction | null;
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

const initialState: InteractionsState = {
  items: [],
  total: 0,
  current: null,
  status: "idle",
  error: null,
};

export const fetchInteractions = createAsyncThunk(
  "interactions/fetchAll",
  async (filters: InteractionFilters) => interactionService.list(filters)
);

export const fetchInteraction = createAsyncThunk(
  "interactions/fetchOne",
  async (id: string) => interactionService.get(id)
);

export const createInteraction = createAsyncThunk(
  "interactions/create",
  async (payload: InteractionCreatePayload) => interactionService.create(payload)
);

export const updateInteraction = createAsyncThunk(
  "interactions/update",
  async ({ id, payload }: { id: string; payload: InteractionUpdatePayload }) =>
    interactionService.update(id, payload)
);

const interactionsSlice = createSlice({
  name: "interactions",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    addAsyncStatusCases(builder, fetchInteractions, "Failed to load interactions");
    addAsyncStatusCases(builder, fetchInteraction, "Failed to load interaction");
    addAsyncStatusCases(builder, createInteraction, "Failed to create interaction");
    addAsyncStatusCases(builder, updateInteraction, "Failed to update interaction");

    builder
      .addCase(fetchInteractions.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.items = action.payload.items;
        state.total = action.payload.total;
      })
      .addCase(fetchInteraction.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.current = action.payload;
      })
      .addCase(createInteraction.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.items.unshift(action.payload);
        state.total += 1;
      })
      .addCase(updateInteraction.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.current = action.payload;
        state.items = state.items.map((i) =>
          i.id === action.payload.id ? action.payload : i
        );
      });
  },
});

export default interactionsSlice.reducer;
