export type CustomerStatus = "active" | "churned" | "prospect";

export type CustomerSort = "last_interaction" | "name" | "company";

export interface Customer {
  id: string;
  name: string;
  company: string | null;
  email: string | null;
  phone: string | null;
  status: CustomerStatus;
  owner_id: string;
  created_at: string;
  updated_at: string;
  last_interaction_at: string | null;
}

export interface CustomerCreatePayload {
  name: string;
  company?: string;
  email?: string;
  phone?: string;
}

export type CustomerUpdatePayload = Partial<CustomerCreatePayload>;

export interface CustomerFilters {
  search?: string;
  sort?: CustomerSort;
  offset?: number;
  limit?: number;
}
