export type CustomerStatus = "active" | "churned" | "prospect";

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
}

export interface CustomerCreatePayload {
  name: string;
  company?: string;
  email?: string;
  phone?: string;
  status?: CustomerStatus;
}

export type CustomerUpdatePayload = Partial<CustomerCreatePayload>;

export interface CustomerFilters {
  status?: CustomerStatus;
  search?: string;
  offset?: number;
  limit?: number;
}
