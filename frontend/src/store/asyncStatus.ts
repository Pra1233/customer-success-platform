import type { ActionReducerMapBuilder, AsyncThunk } from "@reduxjs/toolkit";

export interface AsyncStatusState {
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

export function addAsyncStatusCases<
  State extends AsyncStatusState,
  Thunk extends Pick<AsyncThunk<unknown, any, object>, "pending" | "rejected">
>(builder: ActionReducerMapBuilder<State>, thunk: Thunk, rejectedMessage: string) {
  builder
    .addCase(thunk.pending, (state) => {
      state.status = "loading";
      state.error = null;
    })
    .addCase(thunk.rejected, (state, action) => {
      state.status = "failed";
      state.error = action.error.message ?? rejectedMessage;
    });
}
