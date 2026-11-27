import { createAsyncThunk, createSlice, type PayloadAction } from "@reduxjs/toolkit";

import { ACCESS_TOKEN_KEY, AUTH_USER_KEY } from "@/lib/constants";
import { addAsyncStatusCases } from "@/store/asyncStatus";
import { authService } from "@/services/authService";
import type { LoginPayload, RegisterPayload, User } from "@/types/user";
import type { ApiErrorBody } from "@/types/common";
import { isAxiosError } from "axios";

interface AuthState {
  user: User | null;
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  status: "idle",
  error: null,
};

function extractErrorMessage(error: unknown): string {
  if (isAxiosError<ApiErrorBody>(error) && error.response?.data?.error) {
    return error.response.data.error.message;
  }
  return "Something went wrong. Please try again.";
}

function persistSession(token: string, user: User) {
  window.localStorage.setItem(ACCESS_TOKEN_KEY, token);
  window.localStorage.setItem(AUTH_USER_KEY, JSON.stringify(user));
}

export const login = createAsyncThunk(
  "auth/login",
  async (payload: LoginPayload, { rejectWithValue }) => {
    try {
      const data = await authService.login(payload);
      persistSession(data.access_token, data.user);
      return data.user;
    } catch (error) {
      return rejectWithValue(extractErrorMessage(error));
    }
  }
);

export const register = createAsyncThunk(
  "auth/register",
  async (payload: RegisterPayload, { rejectWithValue }) => {
    try {
      const data = await authService.register(payload);
      persistSession(data.access_token, data.user);
      return data.user;
    } catch (error) {
      return rejectWithValue(extractErrorMessage(error));
    }
  }
);

export const fetchCurrentUser = createAsyncThunk(
  "auth/fetchCurrentUser",
  async (_: void, { rejectWithValue }) => {
    try {
      return await authService.me();
    } catch (error) {
      return rejectWithValue(extractErrorMessage(error));
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout(state) {
      state.user = null;
      state.status = "idle";
      state.error = null;
      if (typeof window !== "undefined") {
        window.localStorage.removeItem(ACCESS_TOKEN_KEY);
        window.localStorage.removeItem(AUTH_USER_KEY);
      }
    },
  },
  extraReducers: (builder) => {
    const handleFulfilled = (state: AuthState, action: PayloadAction<User>) => {
      state.status = "succeeded";
      state.user = action.payload;
    };
    const getRejectValueMessage = (action: { payload?: unknown }) =>
      action.payload as string | undefined;


    addAsyncStatusCases(builder, login, "Login failed", getRejectValueMessage);
    addAsyncStatusCases(builder, register, "Registration failed", getRejectValueMessage);

    builder
      .addCase(login.fulfilled, handleFulfilled)
      .addCase(register.fulfilled, handleFulfilled)
      .addCase(fetchCurrentUser.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchCurrentUser.fulfilled, handleFulfilled)
      .addCase(fetchCurrentUser.rejected, (state) => {
        state.user = null;
        state.status = "idle";
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
