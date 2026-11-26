import { api } from "@/lib/axios";
import type { PaginatedResponse } from "@/types/common";
import type {
  Interaction,
  InteractionCreatePayload,
  InteractionFilters,
  InteractionUpdatePayload,
} from "@/types/interaction";

export const interactionService = {
  list: (filters: InteractionFilters) =>
    api
      .get<PaginatedResponse<Interaction>>("/api/interactions", { params: filters })
      .then((r) => r.data),

  get: (id: string) => api.get<Interaction>(`/api/interactions/${id}`).then((r) => r.data),

  create: (payload: InteractionCreatePayload) =>
    api.post<Interaction>("/api/interactions", payload).then((r) => r.data),

  update: (id: string, payload: InteractionUpdatePayload) =>
    api.put<Interaction>(`/api/interactions/${id}`, payload).then((r) => r.data),
};
