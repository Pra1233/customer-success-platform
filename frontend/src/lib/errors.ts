import { isAxiosError } from "axios";

import type { ApiErrorBody } from "@/types/common";

export function extractErrorMessage(
  error: unknown,
  fallback = "Something went wrong. Please try again."
): string {
  if (isAxiosError<ApiErrorBody>(error) && error.response?.data?.error) {
    return error.response.data.error.message;
  }
  return fallback;
}
