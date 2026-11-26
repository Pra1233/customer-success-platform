export type InteractionType = "call" | "email" | "meeting";

export interface Interaction {
  id: string;
  customer_id: string;
  created_by: string;
  title: string | null;
  type: InteractionType;
  notes: string;
  interaction_date: string;
  created_at: string;
  updated_at: string;
}

export interface InteractionCreatePayload {
  customer_id: string;
  title?: string;
  type: InteractionType;
  notes: string;
  interaction_date: string;
}

export type InteractionUpdatePayload = Partial<
  Omit<InteractionCreatePayload, "customer_id">
>;

export interface InteractionFilters {
  customer_id?: string;
  type?: InteractionType;
  date_from?: string;
  date_to?: string;
  offset?: number;
  limit?: number;
}
