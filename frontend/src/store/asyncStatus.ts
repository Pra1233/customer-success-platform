import type { ActionReducerMapBuilder, AsyncThunk } from "@reduxjs/toolkit";

export interface AsyncStatusState {
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

type RejectedAction<Thunk> = Thunk extends { rejected: (...args: any[]) => infer A } ? A : never;

export function addAsyncStatusCases<
  State extends AsyncStatusState,
  Thunk extends Pick<AsyncThunk<unknown, any, object>, "pending" | "rejected">
>(
  builder: ActionReducerMapBuilder<State>,
  thunk: Thunk,
  rejectedMessage: string,
  /** Defaults to RTK's auto-serialized `action.error.message`. Pass this when the
   * thunk uses `rejectWithValue(...)` and the real error lives in `action.payload`. */
  getErrorMessage: (action: RejectedAction<Thunk>) => string | undefined = (action) =>
    (action as { error?: { message?: string } }).error?.message
) {
  builder
    .addCase(thunk.pending, (state) => {
      state.status = "loading";
      state.error = null;
    })
    .addCase(thunk.rejected, (state, action) => {
      state.status = "failed";
      state.error = getErrorMessage(action as RejectedAction<Thunk>) ?? rejectedMessage;
    });
}
