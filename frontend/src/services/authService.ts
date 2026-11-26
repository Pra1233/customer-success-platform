import { api } from "@/lib/axios";
import type { AuthResponse, LoginPayload, RegisterPayload, User } from "@/types/user";

export const authService = {
  register: (payload: RegisterPayload) =>
    api.post<AuthResponse>("/api/auth/register", payload).then((r) => r.data),

  login: (payload: LoginPayload) =>
    api.post<AuthResponse>("/api/auth/login", payload).then((r) => r.data),

  me: () => api.get<User>("/api/auth/me").then((r) => r.data),
};
