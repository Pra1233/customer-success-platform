import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import { addAsyncStatusCases } from "@/store/asyncStatus";
import { customerService } from "@/services/customerService";
import { extractErrorMessage } from "@/lib/errors";
import type {
  Customer,
  CustomerCreatePayload,
  CustomerFilters,
  CustomerUpdatePayload,
} from "@/types/customer";

interface CustomersState {
  items: Customer[];
  total: number;
  current: Customer | null;
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

const initialState: CustomersState = {
  items: [],
  total: 0,
  current: null,
  status: "idle",
  error: null,
};

export const fetchCustomers = createAsyncThunk(
  "customers/fetchAll",
  async (filters: CustomerFilters) => customerService.list(filters)
);

export const fetchCustomer = createAsyncThunk(
  "customers/fetchOne",
  async (id: string) => customerService.get(id)
);

export const createCustomer = createAsyncThunk(
  "customers/create",
  async (payload: CustomerCreatePayload, { rejectWithValue }) => {
    try {
      return await customerService.create(payload);
    } catch (error) {
      return rejectWithValue(extractErrorMessage(error, "Failed to create customer"));
    }
  }
);

export const updateCustomer = createAsyncThunk(
  "customers/update",
  async (
    { id, payload }: { id: string; payload: CustomerUpdatePayload },
    { rejectWithValue }
  ) => {
    try {
      return await customerService.update(id, payload);
    } catch (error) {
      return rejectWithValue(extractErrorMessage(error, "Failed to update customer"));
    }
  }
);

export const deleteCustomer = createAsyncThunk(
  "customers/delete",
  async (id: string, { rejectWithValue }) => {
    try {
      await customerService.remove(id);
      return id;
    } catch (error) {
      return rejectWithValue(extractErrorMessage(error, "Failed to delete customer"));
    }
  }
);

const getRejectValueMessage = (action: { payload?: unknown }) =>
  action.payload as string | undefined;

const customersSlice = createSlice({
  name: "customers",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    addAsyncStatusCases(builder, fetchCustomers, "Failed to load customers");
    addAsyncStatusCases(builder, fetchCustomer, "Failed to load customer");
    addAsyncStatusCases(builder, createCustomer, "Failed to create customer", getRejectValueMessage);
    addAsyncStatusCases(builder, updateCustomer, "Failed to update customer", getRejectValueMessage);
    addAsyncStatusCases(builder, deleteCustomer, "Failed to delete customer", getRejectValueMessage);

    builder
      .addCase(fetchCustomers.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.items = action.payload.items;
        state.total = action.payload.total;
      })
      .addCase(fetchCustomer.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.current = action.payload;
      })
      .addCase(createCustomer.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.items.unshift(action.payload);
        state.total += 1;
      })
      .addCase(updateCustomer.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.current = action.payload;
        state.items = state.items.map((c) =>
          c.id === action.payload.id ? action.payload : c
        );
      })
      .addCase(deleteCustomer.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.items = state.items.filter((c) => c.id !== action.payload);
        state.total -= 1;
      });
  },
});

export default customersSlice.reducer;
