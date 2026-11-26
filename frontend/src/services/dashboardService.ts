import { api } from "@/lib/axios";
import type { Dashboard } from "@/types/dashboard";

export const dashboardService = {
  get: () => api.get<Dashboard>("/api/dashboard").then((r) => r.data),
};
