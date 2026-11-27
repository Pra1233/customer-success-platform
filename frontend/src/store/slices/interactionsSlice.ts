import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import { addAsyncStatusCases } from "@/store/asyncStatus";
import { interactionService } from "@/services/interactionService";
import { extractErrorMessage } from "@/lib/errors";
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
  async (payload: InteractionCreatePayload, { rejectWithValue }) => {
    try {
      return await interactionService.create(payload);
    } catch (error) {
      return rejectWithValue(extractErrorMessage(error, "Failed to create interaction"));
    }
  }
);

export const updateInteraction = createAsyncThunk(
  "interactions/update",
  async (
    { id, payload }: { id: string; payload: InteractionUpdatePayload },
    { rejectWithValue }
  ) => {
    try {
      return await interactionService.update(id, payload);
    } catch (error) {
      return rejectWithValue(extractErrorMessage(error, "Failed to update interaction"));
    }
  }
);

const getRejectValueMessage = (action: { payload?: unknown }) =>
  action.payload as string | undefined;

const interactionsSlice = createSlice({
  name: "interactions",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    addAsyncStatusCases(builder, fetchInteractions, "Failed to load interactions");
    addAsyncStatusCases(builder, fetchInteraction, "Failed to load interaction");
    addAsyncStatusCases(builder, createInteraction, "Failed to create interaction", getRejectValueMessage);
    addAsyncStatusCases(builder, updateInteraction, "Failed to update interaction", getRejectValueMessage);

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
