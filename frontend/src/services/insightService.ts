import { api } from "@/lib/axios";
import type { Insight } from "@/types/insight";

export const insightService = {
  generate: (interactionId: string) =>
    api
      .post<Insight>(`/api/interactions/${interactionId}/insights`)
      .then((r) => r.data),

  listForInteraction: (interactionId: string) =>
    api
      .get<Insight[]>(`/api/interactions/${interactionId}/insights`)
      .then((r) => r.data),
};
