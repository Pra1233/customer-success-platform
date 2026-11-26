import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import { customerService } from "@/services/customerService";
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
  async (payload: CustomerCreatePayload) => customerService.create(payload)
);

export const updateCustomer = createAsyncThunk(
  "customers/update",
  async ({ id, payload }: { id: string; payload: CustomerUpdatePayload }) =>
    customerService.update(id, payload)
);

export const deleteCustomer = createAsyncThunk(
  "customers/delete",
  async (id: string) => {
    await customerService.remove(id);
    return id;
  }
);

const customersSlice = createSlice({
  name: "customers",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCustomers.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchCustomers.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.items = action.payload.items;
        state.total = action.payload.total;
      })
      .addCase(fetchCustomers.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message ?? "Failed to load customers";
      })
      .addCase(fetchCustomer.fulfilled, (state, action) => {
        state.current = action.payload;
      })
      .addCase(createCustomer.fulfilled, (state, action) => {
        state.items.unshift(action.payload);
        state.total += 1;
      })
      .addCase(updateCustomer.fulfilled, (state, action) => {
        state.current = action.payload;
        state.items = state.items.map((c) =>
          c.id === action.payload.id ? action.payload : c
        );
      })
      .addCase(deleteCustomer.fulfilled, (state, action) => {
        state.items = state.items.filter((c) => c.id !== action.payload);
        state.total -= 1;
      });
  },
});

export default customersSlice.reducer;
