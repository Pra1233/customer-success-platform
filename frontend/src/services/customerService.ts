import { api } from "@/lib/axios";
import type { PaginatedResponse } from "@/types/common";
import type {
  Customer,
  CustomerCreatePayload,
  CustomerFilters,
  CustomerUpdatePayload,
} from "@/types/customer";

export const customerService = {
  list: (filters: CustomerFilters) =>
    api
      .get<PaginatedResponse<Customer>>("/api/customers", { params: filters })
      .then((r) => r.data),

  get: (id: string) => api.get<Customer>(`/api/customers/${id}`).then((r) => r.data),

  create: (payload: CustomerCreatePayload) =>
    api.post<Customer>("/api/customers", payload).then((r) => r.data),

  update: (id: string, payload: CustomerUpdatePayload) =>
    api.put<Customer>(`/api/customers/${id}`, payload).then((r) => r.data),

  remove: (id: string) => api.delete<void>(`/api/customers/${id}`).then((r) => r.data),
};
